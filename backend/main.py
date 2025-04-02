from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
import os
import asyncio
from dotenv import load_dotenv
from pydantic import BaseModel, Field

# Import pydantic-ai components
from pydantic_ai import Agent
from pydantic_ai.models.gemini import GeminiModel
from pydantic_ai.messages import PartDeltaEvent, TextPartDelta # Import necessary event/delta types

import uvicorn

# Load environment variables from .env file
load_dotenv()

# --- Pydantic Models ---
class QueryRequest(BaseModel):
    query: str

# --- AI Agent Initialization ---
google_api_key = os.getenv("GEMINI_API_KEY")
pydantic_ai_agent = None

if not google_api_key:
    print("Warning: GEMINI_API_KEY not found in environment variables. AI agent will not be initialized.")
else:
    try:
        # Initialize the pydantic-ai model and agent
        # Using the model specified in the example
        # Rely on pydantic-ai picking up GEMINI_API_KEY from environment
        model = GeminiModel('gemini-2.5-pro-exp-03-25')

        # Define the agent with system prompt from the example
        # Define a more capable system prompt
        system_prompt = (
            "You are an expert Python programming assistant. Your goal is to help users learn "
            "Python libraries and frameworks. Provide clear explanations, concise code examples, "
            "and step-by-step guidance when requested. If the query is unrelated to Python "
            "programming, libraries, or frameworks, politely state that you specialize in Python assistance."
        )
        pydantic_ai_agent = Agent(
            model,
            system_prompt=system_prompt
            # Removed deps_type and system_prompt decorator for simplicity in FastAPI context
        )
        print("Pydantic-AI Agent initialized successfully.")
    except Exception as e:
        print(f"Error initializing Pydantic-AI Agent: {e}")
        pydantic_ai_agent = None

# --- FastAPI App Initialization ---
app = FastAPI(title="Chat UI Backend with Pydantic-AI Agent")

# --- CORS Configuration ---
origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- API Endpoints ---
@app.get("/")
async def read_root():
    return {"message": "Chat UI Backend is running with Pydantic-AI"}

# --- Streaming Endpoint using Pydantic-AI Agent ---
async def stream_agent_response(query: str):
    """Async generator to stream text responses from the Pydantic-AI Agent."""
    if not pydantic_ai_agent:
        yield "data: Error: AI Agent not initialized. Check API key and configuration.\n\n"
        return
    if not query:
        yield "data: Error: Please provide a query.\n\n"
        return

    try:
        print(f"Streaming agent request for query: {query}")
        # Use agent.iter() and focus on extracting text deltas from model requests
        async with pydantic_ai_agent.iter(query) as run:
            async for node in run:
                # Only process ModelRequestNode for streaming text output
                if Agent.is_model_request_node(node):
                    async with node.stream(run.ctx) as request_stream:
                        async for event in request_stream:
                            # Directly yield formatted text delta content
                            if isinstance(event, PartDeltaEvent) and isinstance(event.delta, TextPartDelta):
                                chunk_text = event.delta.content_delta
                                if chunk_text:
                                    formatted_text = chunk_text.replace('\n', '\\n')
                                    yield f"data: {formatted_text}\n\n"
                                    await asyncio.sleep(0.01) # Prevent overwhelming client
                # We ignore other node types (UserPrompt, CallTools, End) for simplicity,
                # as we only want to stream the final text output deltas.

        yield "data: [DONE]\n\n" # Signal end of stream
        print("Streaming finished.")

    except Exception as e:
        print(f"Error during Pydantic-AI Agent iteration/streaming: {e}")
        yield f"data: Error generating response: {e}\n\n"


@app.post("/stream")
async def stream_endpoint(request: QueryRequest):
    """
    Streams responses from the Pydantic-AI agent for the given query.
    """
    query = request.query
    return StreamingResponse(stream_agent_response(query), media_type="text/event-stream")

# --- Main Execution ---
if __name__ == "__main__":
    # Note: Uvicorn needs the API key available when the worker starts.
    # Ensure .env is loaded before uvicorn starts workers if running this way.
    uvicorn.run(app, host="0.0.0.0", port=8000)