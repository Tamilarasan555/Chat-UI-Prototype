import React from 'react';
import './HistorySidebar.css';

// Helper function to check if two dates are the same day
const isSameDay = (date1, date2) => {
  return date1.getFullYear() === date2.getFullYear() &&
         date1.getMonth() === date2.getMonth() &&
         date1.getDate() === date2.getDate();
};

// Helper function to group history items by date categories
const groupHistoryByDate = (history) => {
  const groups = {
    Today: [],
    Yesterday: [],
    'Previous 7 Days': [],
    'Previous 30 Days': [],
    Older: [],
  };

  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  const sevenDaysAgo = new Date(today);
  sevenDaysAgo.setDate(today.getDate() - 7);
  const thirtyDaysAgo = new Date(today);
  thirtyDaysAgo.setDate(today.getDate() - 30); // Simplified, doesn't account for month length perfectly but okay for example

  history.forEach(item => {
    const itemDate = new Date(item.timestamp); // Ensure timestamp is a Date object or parseable

    if (isSameDay(itemDate, today)) {
      groups.Today.push(item);
    } else if (isSameDay(itemDate, yesterday)) {
      groups.Yesterday.push(item);
    } else if (itemDate > sevenDaysAgo) {
      groups['Previous 7 Days'].push(item);
    } else if (itemDate > thirtyDaysAgo) {
      groups['Previous 30 Days'].push(item);
    } else {
      groups.Older.push(item);
    }
  });

  return groups;
};

// Define the order of groups for rendering
const groupOrder = ['Today', 'Yesterday', 'Previous 7 Days', 'Previous 30 Days', 'Older'];

// Accept history and onToggleSettings props
const HistorySidebar = ({ history = [], onToggleSettings }) => { // Default history to empty array

  const groupedHistory = groupHistoryByDate(history);

  return (
    <div className="history-sidebar">
      <div className="sidebar-header">
        <button className="icon-button" aria-label="Toggle Sidebar"> {/* Placeholder Icon */}
          <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"></path></svg> {/* Simple Menu Icon */}
        </button>
        <div className="header-icons-right">
          <button className="icon-button" aria-label="Search History"> {/* Placeholder Icon */}
            <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"></path></svg> {/* Search Icon */}
          </button>
          <button className="icon-button" aria-label="New Chat"> {/* Placeholder Icon */}
            <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34a.9959.9959 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"></path></svg> {/* Edit/Create Icon */}
          </button>
        </div>
      </div>

      <div className="history-list-container">
        {groupOrder.map((groupTitle) => {
          const itemsInGroup = groupedHistory[groupTitle];
          // Render group only if it has items or is 'Today' (always show 'Today' header)
          return (itemsInGroup.length > 0 || groupTitle === 'Today') ? (
            <div key={groupTitle} className="history-group">
              <h3 className="history-group-title">{groupTitle}</h3>
              <ul className="history-items">
                {itemsInGroup.map((item) => (
                  <li key={item.id} className="history-item">
                    {item.title}
                  </li>
                ))}
              </ul>
            </div>
          ) : null; // Return null if group is empty (and not 'Today')
        })}
      </div>

      <div className="sidebar-footer">
        {/* Add onClick handler */}
        <button className="renew-plus-button" onClick={onToggleSettings}>
          <span className="renew-icon"> {/* Placeholder Icon */}
             <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"></path></svg> {/* Simple Placeholder */}
          </span>
          Settings
        </button>
      </div>
    </div>
  );
};

export default HistorySidebar;