import colors from "../assets/colors.json";
import { useContext } from "react";
import { NoteContext } from "../Context/NoteContext";
import Plus from "../icons/Plus";
import { useRef } from "react";
import { db } from "../appwrite/database";
 
const AddButton = () => {
    const {setNotes} = useContext(NoteContext);
    const startingPos = useRef(10);
 
    const addNote = async () => {
        const payload = {
            position: JSON.stringify({
                x: startingPos.current,
                y: startingPos.current,
            }),
            colors: JSON.stringify(colors[2]),
        };

        startingPos.current += 10;  
        const response = await db.notes.create(payload);
        setNotes((prevState) => [response, ...prevState]);
    };

    
 
    return (
        <div id="add-btn" onClick={addNote}>
            <Plus />
        </div>
    );
};

export default AddButton;