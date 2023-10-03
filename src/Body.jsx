import NotesWrapper from './NotesWrapper'
import MainWrapper from './MainWrapper'
import React, { useState, useEffect } from "react";
import uuid from 'react-uuid';
import { useNavigate, useParams } from "react-router-dom";

const bodyWrapper = {
    height: "100%",
    flex: "1",
    display: "flex",
    flexDirection: "row"
};

const Body = ( {showSidebar, email, setEmail} ) => {
    const [notes, setNotes] = useState(JSON.parse(localStorage.getItem("notes")) || []) ;
    
    let { id } = useParams();

    const [currentNote, setCurrent] = useState(id);

    const navigate = useNavigate();

    const [when, setWhen] = useState(null);


    useEffect(() => {
      
      if(currentNote) 
      navigate("/notes/" + currentNote + "/edit")
    }, [currentNote])




    const addNewNote = () => {
      const newNote = {
        id: uuid(),
        title: "Untitled",
        lastModified: Date.now(),
        body: "",
      };
      setNotes([newNote, ...notes])
      setCurrent(newNote.id)
  
    };  




    const getCurrentNote = () => {
      return notes.find((note) => note.id === currentNote);
      
    };




    const updateNote = (theUpdated) => {
      setNotes((prevNotes) => {
        return prevNotes.map(note => {
          if(note.id === theUpdated.id){
            return theUpdated;
          }
          return note;
        })
      })
    }


  


    const delNote = async (theDeleted) => { 
      const answer = window.confirm("Are you sure?");
      if (answer) {
        const res = await fetch(
          `https://otwgzgu32f2u44efnqyfh3zwz40upfaw.lambda-url.ca-central-1.on.aws?email=${email}&id=${theDeleted}`,
          {
          method: "DELETE",
          }
      );
        if (res.status == 200){
          const savedNotes = JSON.parse(localStorage.getItem("notes")) || [];
          const noteToDeleteExists = savedNotes.some(note => note.id === theDeleted);
          if(noteToDeleteExists) {
            localStorage.setItem("notes", JSON.stringify(savedNotes.filter((note) => note.id !== theDeleted)))
          }
          setNotes(notes.filter((note) => note.id !== theDeleted))
        }
      }
    }





  // const onFormSubmit = (event) => {
  //   event.preventDefault();
  //   console.log("submitted", `email is ${email}`);
  //   setUser(email);
  // }




    const saveNotes = async (theSaved) => {
      const preSavedNotes = JSON.parse(localStorage.getItem("notes"));
      var notesToSave;
      if(preSavedNotes) {
        const newNoteToSaveExists = preSavedNotes.some(note => note.id === theSaved.id);
        if(newNoteToSaveExists){
          notesToSave = preSavedNotes.map((note) => {
            if(note.id === theSaved.id){
              return theSaved;
            }
            return note;
          })
        }else{
          notesToSave = [theSaved, ...preSavedNotes]
        }
      }else{
        notesToSave = [theSaved];
      }
      localStorage.setItem("notes", JSON.stringify(notesToSave))
      const newNote = { title:theSaved.title, body:theSaved.body, when, id:theSaved.id };
      const res = await fetch(`https://rxggjab3nrpz6xnxg6rpyj26tu0rvhzr.lambda-url.ca-central-1.on.aws?email=${email}&id=${theSaved.id}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...newNote, email: email }),
      }
    );
    const jsonRes = await res.json();
    }



    useEffect(() => {
      const asyncEffect = async () => {
        if (email) {
          const promise = await fetch(`https://um7d24uaeuybcuagyze5dbkjhi0lnhwi.lambda-url.ca-central-1.on.aws?email=${email}`)
          if (promise.status == 200) {
            const notes = await promise.json();
            setNotes(notes);
          }
        }
      };
      asyncEffect();
    }, [email]);
  

    

    return(
    <div style={bodyWrapper}>
        {showSidebar && <NotesWrapper notes={notes} addNewNote={addNewNote} currentNote={currentNote} setCurrent={setCurrent}/>}
        <MainWrapper currentNote={getCurrentNote()} updateNote={updateNote} delNote={delNote} saveNotes={saveNotes} when={when} setWhen={setWhen}/>
    </div>
    )
}

export default Body;