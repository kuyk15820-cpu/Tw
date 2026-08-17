import React from 'react';
import './get-style.css';

export default function GetUdid() {
  const handleContextMenu = (e) => {
    e.preventDefault();
  };

  const handleDragStart = (e) => {
    e.preventDefault();
  };

  return (
    <div className="wrapper">
      <div className="title-container">
        <div className="title">Get UDID Tool</div>
      </div>

      <a 
        href="/get-udid/get-mobileconfig.php" 
        className="terminal-btn" 
        id="terminalBtn"
        onContextMenu={handleContextMenu} 
        onDragStart={handleDragStart}
      >
        <span className="btn-text" id="btnText">&gt; Get Profile</span>
      </a>
    </div>
  );
}
