import React from 'react'
import Trash from '../icons/Trash';
import { db } from '../appwrite/database';
import { useContext } from 'react';
import { NoteContext } from '../Context/NoteContext';

const DeleteButton = ({noteId}) => {

    const {setNotes} = useContext(NoteContext);

    const handleDelete = async (e) => {
        console.log("delete was clicked!");
        await db.notes.delete(noteId);
        setNotes((prevState)=>
            prevState.filter((note) => note.$id !== noteId)
        );
    };
  return (
    <div onClick={handleDelete}>
      <Trash/>
    </div>
  )
}

export default DeleteButton;
