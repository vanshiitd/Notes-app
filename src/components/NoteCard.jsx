import {useRef,useEffect,useState} from 'react'
import DeleteButton from './DeleteButton';
import { setNewOffset } from '../utils';
import { autoGrow } from '../utils';
import { setZIndex } from '../utils';
import { bodyParser } from '../utils';
import { db } from '../appwrite/database';
import Spinner from '../icons/Spinner';
import { useContext } from 'react';
import { NoteContext } from '../Context/NoteContext';


const NoteCard = ({note}) => {

    const [position, setPosition] = useState(bodyParser(note.position));
    const colors = bodyParser(note.colors);
    const body = bodyParser(note.body);
    const {setSelectedNote} = useContext(NoteContext);  

    let mouseStartPos = { x: 0, y: 0 };
    const cardRef = useRef(null);

    const textAreaRef = useRef(null);

    useEffect(() => {
        autoGrow(textAreaRef);
        setZIndex(cardRef.current);
    }, []);

    const mouseDown = (e) =>{

        if (e.target.className === "card-header"){
            setZIndex(cardRef.current);
            setSelectedNote(note);

            mouseStartPos.x = e.clientX;
            mouseStartPos.y = e.clientY;

            document.addEventListener('mousemove', mouseMove);
            document.addEventListener( 'mouseup', mouseUp);
        }
    };

    const mouseMove = (e) => {

        let mouseMoveDir = {
            x: mouseStartPos.x - e.clientX,
            y: mouseStartPos.y - e.clientY,
        }

        mouseStartPos.x = e.clientX;
        mouseStartPos.y = e.clientY;

        const newPosition = setNewOffset(cardRef.current, mouseMoveDir);

        setPosition(newPosition);
    };

    const saveData = async (key, value) => {
        const payload = { [key]: JSON.stringify(value) };
        try {
            await db.notes.update(note.$id, payload);
        } catch (error) {
            console.error(error);
        }
        setSaving(false);
    };

    const mouseUp = () => {
        document.removeEventListener("mousemove", mouseMove);
        document.removeEventListener("mouseup", mouseUp);

        const newPosition = setNewOffset(cardRef.current);
        saveData("position", newPosition);
    };

    const [saving, setSaving] = useState(false);

    const keyUpTimer = useRef(null);

    const handleKeyUp = async () => {
        //1 - Initiate "saving" state
        setSaving(true);
     
        //2 - If we have a timer id, clear it so we can add another two seconds
        if (keyUpTimer.current) {
            clearTimeout(keyUpTimer.current);
        }
     
        //3 - Set timer to trigger save in 2 seconds
        keyUpTimer.current = setTimeout(() => {
            saveData("body", textAreaRef.current.value);
        }, 2000);
    };

    

    return (
        <div ref = {cardRef} className="card" style={{backgroundColor: colors.colorBody, left: `${position.x}px`, top: `${position.y}px`}}>

            <div className="card-header" style={{ backgroundColor: colors.colorHeader }} onMouseDown = {mouseDown}>
                <DeleteButton noteId={note.$id} />
                {saving && (
                <div className="card-saving">
                    <Spinner color={colors.colorText} />
                    <span style={{ color: colors.colorText }}>
                        Saving...
                    </span>
                </div>
)}
            </div>

            <div className="card-body">
                <textarea 
                    ref = {textAreaRef} 
                    style={{ color: colors.colorText }} 
                    defaultValue={body} 
                    onFocus={() => {
                        setZIndex(cardRef.current);
                        setSelectedNote(note);
                    }} 
                    onInput={() => {autoGrow(textAreaRef);}}
                    onKeyUp={handleKeyUp}
                ></textarea>

            </div>
        </div>
  )
};

export default NoteCard;
