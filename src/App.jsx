import NotesPage from "./pages/NotesPage";
import React from "react";
import NotesProvider from "./Context/NoteContext";

function App() {
  return (
      <div id="app">
        <NotesProvider>
          <NotesPage />
        </NotesProvider>
      </div>
  );
}

export default App;