import Note from "./note.js";
import { createNote, assignView, loadSecondView } from "./views.js";
import { saveNote, getAllNotes, getAll } from "./NotesPers.js";

let first_view = document.getElementById('view-one');
let second_view = document.getElementById("view-two");
let createB = document.getElementById("principal-b");
let comodin = document.getElementById('button-personalize');
let view1B = document.getElementById("button-create");
let view2B = document.getElementById("button-organize");
let currentTab;
let notes;
let numNotes;

/*-----------------------------------------------------------------*/
/* SETTERS & GETTERS */ 
/*-----------------------------------------------------------------*/

export function setCurrentTab(id) {
    currentTab = id;
}

export function getCurrentTab() {
    return currentTab;
}

export async function setNotes() {
    notes = await getAllNotes();
}

export function getNotes() {
    return notes;
}

export function setNumNotes(num) {
    numNotes = num;
}

/*-----------------------------------------------------------------*/
/* LISTENERS PRINCIPALES */ 
/*-----------------------------------------------------------------*/

// LISTENER ASIGNADO AL BOTÓN DE LA VISTA 1 PARA CREAR UNA NUEVA NOTA (BOTÓN CREAR NOTA)
createB.addEventListener("click", async () => {
    createB.style.display = "none";
    let note = new Note();
    createNote(note.title, note.id, note.content); //Se encarga de asignar la interfaz adecuada para crear una nota
    await saveNote(note, notes);
    await setNotes();
});

// LISTENER ASIGNADO AL BOTÓN PARA IR A LA PRIMERA VISTA EN EL MENÚ LATERAL
view1B.addEventListener("click", () => {    
    if (getComputedStyle(first_view).getPropertyValue("display") == 'none') {
        assignView(first_view);
    }
});

// LISTENER ASIGNADO AL BOTÓN PARA IR A LA SEGUNDA VISTA EN EL MENÚ LATERAL
view2B.addEventListener("click", async () => {
    if (getComputedStyle(second_view).getPropertyValue("display") == 'none') {
        second_view.style.display = 'flex';
        first_view.style.display = 'none';
    }

    try {
        let notes = await getAllNotes();
        if (notes && Object.keys(notes).length !== numNotes) {
            await loadSecondView();
        }
    } catch (error) {
        console.error("Error al guardar la nota:", error);
    }
});

// BOTPON COMODIN
comodin.addEventListener("click", async () => {
    //let notasp = await getAllNotes();
    //console.log('notasp: ', notasp);
    //console.log('notes: ', notes);
    //deleteAll();
    const todo = await getAll();
    console.log('todo: ', todo);
})

Note.setCount();
setNotes();
loadSecondView();