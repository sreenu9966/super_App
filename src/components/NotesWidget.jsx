import React, { useState } from "react";
import { useStore } from "../store/useStore";

const NotesWidget = () => {
  const { notes, setNotes } = useStore();
  
  const [noteTheme, setNoteTheme] = useState(() => {
    return localStorage.getItem("super_app_notes_theme") || "amber";
  });

  const handleNotesChange = (e) => {
    setNotes(e.target.value);
  };

  const handleClear = () => {
    if (window.confirm("Are you sure you want to clear all text inside your notes pad?")) {
      setNotes("");
    }
  };

  const changeTheme = (theme) => {
    setNoteTheme(theme);
    localStorage.setItem("super_app_notes_theme", theme);
  };

  return (
    <div className={`dashboard-widget notes-widget theme-${noteTheme} glass-panel`}>
      <div className="widget-header">
        <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
          <h3>All Notes</h3>
          <div className="notes-color-picker" style={{ marginTop: "0.15rem" }}>
            {["amber", "cyan", "emerald", "rose"].map((t) => (
              <div
                key={t}
                className={`color-dot dot-${t} ${noteTheme === t ? "active" : ""}`}
                onClick={() => changeTheme(t)}
                title={`${t.charAt(0).toUpperCase() + t.slice(1)} Theme`}
              />
            ))}
          </div>
        </div>
        <button onClick={handleClear} className="btn-link">Clear</button>
      </div>
      <div className="notes-editor-container">
        <textarea
          className="notes-textarea"
          placeholder="Jot down your notes, links, ideas, or reminders here... (Auto-saves in real-time)"
          value={notes}
          onChange={handleNotesChange}
        />
      </div>
      <div className="notes-footer">
        <span className="auto-save-tag">✓ Saved to browser storage</span>
      </div>
    </div>
  );
};

export default NotesWidget;
