import React, { useContext } from "react";
import { NoteContext } from "../Context/NoteContext";
import { db } from "../appwrite/database";

const Color = ({ color }) => {
    const { selectedNote, notes, setNotes } = useContext(NoteContext); // Ensure setNotes is available

    const changeColor = async () => {
        console.log("Change color clicked:", color);

        if (!selectedNote) {
            alert("You must select a note before changing colors");
            return;
        }

        try {
            const currentNoteIndex = notes.findIndex(
                (note) => note.$id === selectedNote.$id
            );

            if (currentNoteIndex === -1) {
                alert("Selected note not found");
                return;
            }

            const updatedNote = {
                ...notes[currentNoteIndex],
                colors: JSON.stringify(color),
            };

            const newNotes = [...notes];
            newNotes[currentNoteIndex] = updatedNote;
            setNotes(newNotes);

            await db.notes.update(selectedNote.$id, {
                colors: JSON.stringify(color),
            });
        } catch (error) {
            console.error("Failed to update note color:", error);
        }
    };

    return (
        <div
            onClick={changeColor}
            className="color"
            style={{ backgroundColor: color.colorHeader }}
        ></div>
    );
};

export default Color;
