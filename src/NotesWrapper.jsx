import React from 'react';


const notesWrapper = {
    flex: "1",
    display: "flex",
    flexDirection: "column",
    borderRight: "2px solid #f2f2f2f5",
    maxWidth: "280px",
};

const topNotes = {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    borderBottom: "2px solid #f2f2f2f5"
};

const bottomNotes = {
    display: "flex",
    flexDirection: "column"
};


const newNoteWrapper = {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    borderBottom: "2px solid #f2f2f2f5"
    // padding: "20px 0px 20px 0px"
}


const options = {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
};


function NotesWrapper ( {notes, addNewNote, currentNote, setCurrent} ) {
    
    const formatDate = (when) => {
        const formatted = new Date(when).toLocaleString("en-US", options);
        if (formatted === "Invalid Date") {
            return "";
        }
        return formatted;
    };

    return(
        <div style={notesWrapper}>
            <div style={topNotes}>
                <h2>Notes</h2>
                <button id="newNotes" onClick={addNewNote}>+</button>
            </div>
            <div style={bottomNotes}>
                {notes.map((oneNote) => (
                    <div 
                    style={newNoteWrapper} 
                    className={`newNote ${oneNote.id === currentNote && "current"}`} 
                    onClick={() => setCurrent(oneNote.id)}>
                        <strong>
                            {oneNote.title}
                        </strong>
                        <small>
                            Last modified {formatDate(oneNote.lastModified)}
                        </small>
                        <p>
                            {oneNote.body && oneNote.body.replace(/<[^>]+>/g, '').substr(0,20) + "..."}
                        </p>
                    </div>
                ))}
                <h3 id="noNoteText" placeholder="No Note Yet"></h3>
            </div>
        </div>
    )
}

export default NotesWrapper;