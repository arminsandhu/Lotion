import React, { useState , useEffect} from 'react';
import ReactQuill from "react-quill"
import 'quill/dist/quill.snow.css';
import { useParams, useNavigate } from "react-router-dom";




const mainWrapper = {
    flex: "3",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    height: "100%"
};

// const firstText = {
//     color: "grey",
//     fontWeight: "normal",
// }

const mainHeader = {
    flex: "10",
    display: "flex",
    flexDirection: "row",
    width: "100%",
    borderBottom: "2px solid #f2f2f2f5",
};

const mainBody = {
    flex: "80",
    display: "flex"
};

const mainTitle = {
    flex: "80",
    display: "flex",
    flexDirection: "column"
}


const saveOption = {
    flex: "5",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "0px 5px 0px 5px"
}

const deleteOption = {
    flex: "5",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "0px 5px 0px 5px"

}

const startMessage = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: "80%",
    fontSize: "30px"
}

const dateTime = {
    width: "200px",
    margin: "10px 0px 0px 10px",
    border: "none",
    backgroundColor: "transparent",
    textDecoration: "none"
}



function MainWrapper ( {currentNote, updateNote, delNote, saveNotes, when, setWhen} ) {
    
    const [buttonText, setButton] = useState("Save")

    const [isEdit, setEdit] = useState(false)

    const [quillDisabled, setQuill] = useState(false);

    let { id } = useParams();
    
    const edit = (part, value) => {
        updateNote({ ...currentNote, [part]: value, lastModified: Date.now()});
    }

    const navigate = useNavigate();


    useEffect(() => {
        if(!currentNote) return;
        if(buttonText == "Save") 
            navigate("/notes/" + currentNote.id + "/edit")
        else
        navigate("/notes/" + currentNote.id)
      }, [buttonText])


    if(!currentNote) {
        return (
            <div style={startMessage}>Select a note, or create a new one.</div>
        )
    }

    const toggle = () => {
        setEdit(!isEdit)
        if(isEdit) {
            setQuill(false)
            return "Save"
        }
        else {
            setQuill(true)
            return "Edit"
        }
    }

    const getCurrentTime = () => {
        const now = new Date();
        const year = now.getFullYear();
        const month = (now.getMonth() + 1).toString().padStart(2, '0');
        const day = now.getDate().toString().padStart(2, '0');
        const hour = now.getHours().toString().padStart(2, '0');
        const minute = now.getMinutes().toString().padStart(2, '0');
        return (`${year}-${month}-${day}T${hour}:${minute}`)
        
    }


    return(
        <div style={mainWrapper}>
            <div style={mainHeader}>
                <div style={mainTitle}>
                    <input 
                    type="text" 
                    id = "main-title" 
                    value={currentNote.title} 
                    onChange={(event) => edit("title", event.target.value)} 
                    autoFocus/>
                    <input 
                    type="datetime-local" 
                    style={dateTime}
                    value= {when}
                    onChange={(e) => setWhen(e.target.value)} />
                    </div>
                <div 
                    style={saveOption} 
                    id="saveOption"
                    onClick={() => {saveNotes(currentNote); setButton(toggle()); navigate()}}
                    ><h4>{buttonText}</h4></div>
                <div 
                    style={deleteOption} 
                    id="deleteOption" 
                    onClick={() => {delNote(currentNote.id) ; setButton("Save"); setQuill(false) ;setEdit(false)}}
                    ><h4>Delete</h4>
                    </div>
            </div>
            <div style={mainBody}>
                <div style={{width: "100%", height: "100%"}}>
                <ReactQuill
                    id = "textBox"
                    theme = "snow"
                    placeholder="Your Note Here." 
                    value={currentNote.body}
                    onChange={(value) => {
                        if(value !== "<p><br></p>") // band-aid
                            edit("body", value)
                    }}
                    
                    readOnly={quillDisabled === true}
                />
                </div>
            </div>
        </div>
    )
}

export default MainWrapper;