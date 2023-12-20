import Note from "./note.js";
import { saveNote, getAllNotes, getNoteById, deleteAll } from "./NotesPers.js";
import { loadSecondView } from "./script.js";

let createB = document.getElementById("principal-b");
let content = document.getElementById('view-one');
let comodin = document.getElementById('button-personalize');
let currentTab;
let notes;

export function setCurrentTab(id) {
    currentTab = id;
}

export async function setAllNotes() {
    notes = await getAllNotes();
}

/*######################################################################
#  FUNCIONES DE CREACIÓN DE HTML 
######################################################################*/

// CREA EL NAVBAR DE LA SECCIÓN DE NOTAS
function createTopNote(title, id) {
    let divTop = document.createElement('div');
    let tab = document.createElement('div');
    let pTitle = document.createElement('p');
    let newTab = document.createElement('div');
    let p = document.createElement('p');
    let closeB = document.createElement('div');
    let pClose = document.createElement('p');

    divTop.classList.add('note-top');
    tab.classList.add('tab');
    pTitle.textContent = title;
    pTitle.id = id;
    newTab.classList.add('new-tab');
    newTab.id = 'add-tab';
    p.textContent = "+";
    closeB.classList.add('close-button');
    pClose.textContent = "x";
    
    closeB.appendChild(pClose);
    tab.appendChild(pTitle);
    tab.appendChild(closeB);
    newTab.appendChild(p);
    divTop.appendChild(tab);
    divTop.appendChild(newTab);
    content.appendChild(divTop);    

    currentTab = pTitle.id;

    createEventListenerP(pTitle);
    createEventListenerTab(tab);
    createEventListenerCloseB(closeB);
    createEventListenerNewTab(newTab);
}

// CREA EL HTML DEL CONTENIDO, DONDE EL USUARIO ESCRIBIRA SUS NOTAS
function creatContNote(cont) {
    let divC = document.createElement('div');
    let textarea = document.createElement('textarea');

    divC.classList.add('note-content');
    textarea.id = 'note-textarea';
    textarea.value = cont;

    
    divC.appendChild(textarea);
    content.appendChild(divC);

    createEventListenerTextA(textarea);
}

// CREA EL HTML DE LA NOTA EN GENERAL
export function createNote(title, id, cont) {
    content.classList.remove('content-1');
    content.classList.add('content-1-grid');
    content.style.display = 'grid';
    
    createTopNote(title, id);
    creatContNote(cont);
}

// AÑADE UNA NUEVA PESTAÑA AL NAVBAR DE LAS NOTAS
async function createNewTab() {
    let existingTabs = document.getElementsByClassName("tab");
    let lastTab = existingTabs[existingTabs.length - 1];
    let note = new Note();

    let newTab = document.createElement('div');
    let p = document.createElement('p');
    let closeB = document.createElement('div');
    let pClose = document.createElement('p');

    newTab.classList.add('tab');
    p.textContent = note.title;
    p.id = note.id;
    closeB.classList.add('close-button');
    pClose.textContent = "x";
    await saveNote(note, notes);

    closeB.appendChild(pClose);
    newTab.appendChild(p);
    newTab.appendChild(closeB);
    lastTab.parentNode.insertBefore(newTab, lastTab.nextSibling);

    currentTab = p.id;

    createEventListenerP(p);
    createEventListenerTab(newTab);
    createEventListenerCloseB(closeB);

    await setNote();
}

// CARGA LA VISTA PRINCIPAL DE LA FORMA ORIGINAL
function loadFirstview() {
    let noteTop = document.querySelector('.note-top');
    let noteContent = document.querySelector('.note-content');

    content.removeChild(noteTop);
    content.removeChild(noteContent);

    content.classList.remove('content-1-grid');
    content.classList.add('content-1');
    content.style.display = 'flex';
    createB.style.display = "flex";
}

/*######################################################################
#  FUNCIONES DE ASIGNACIÓN DE EVENT LISTENERS
######################################################################*/

// ASIGNA EL EVENT LISTENER A LOS DE CIERRE DE PESTAÑAS
export function createEventListenerCloseB(element) {
    element.addEventListener("click", () => {
        let noteBar = element.parentNode.parentNode;
        let existingTabs = document.getElementsByClassName("tab");

        noteBar.removeChild(element.parentNode);

        if (existingTabs.length === 0) {
            loadFirstview();
        }
    });
}

// ASIGNA EL EVENT LISTENER A LOS TEXT AREA DONDE EL USUARIO ESCRIBE LAS NOTAS
function createEventListenerTextA(element) {
    element.addEventListener("input", async () => {
        await saveContNote(element.value);
      });
}

// ASIGNA EL EVENT LISTENER A LAS PESTAÑAS DEL NAVBAR, FUNCIONA PARA PODER CAMBIAR DE PESTAÑA
export function createEventListenerTab(element) {
    element.addEventListener('click', async (event) => {
        if (!event.target.closest('.close-button') && element.querySelector('.tab p').id != currentTab) {
            currentTab = element.querySelector('.tab p').id;
            await setNote();
        }
    });
}

// ASIGNA EL EVENT LISTENER A LOS ELEMENTOS P QUE ESTAN DENTRO DE LAS PESTAÑAS (EL TEXTO), FUNCIONA PARA PODER CAMBIAR EL TITULO DE LA NOTA
export function createEventListenerP(element) {
    let originalCont;

    element.addEventListener('dblclick', () => {
        originalCont = element.textContent;
        element.contentEditable = true;
    });

    document.addEventListener('click', async (e) => {
        if (element.contentEditable === "true" && !element.contains(e.target)) {
            if (originalCont != element.textContent) {
                let note = await getNoteById(element.id);
                if (note) {
                    note._title = element.textContent;
                    await saveNote(note, notes);
                    await loadSecondView();
                }
            } 
            element.contentEditable = false;
        }
    });
}

// ASIGNA EL EVENT LISTENER AL BOTÓN DE AÑADIR UNA NUEVA PESTAÑA
export function createEventListenerNewTab(element) {
    element.addEventListener("click", async () => {
        await createNewTab();
    });
}

/*######################################################################
#  FUNCIONES DE LOGICA DE LAS NOTAS
######################################################################*/

// ASIGNA VALOR AL CONTENIDO DE UNA NOTA Y LA GUARDA, ESTO SUCEDE CADA VEZ QUE EL USUARIO ESCRIBE EN EL TEXT AREA
async function saveContNote(value) {
    try {
        let note = await getNoteById(currentTab);
        if (note) {
            note._content = value;
            await saveNote(note, notes);
        }
    } catch (error) {
        console.error("Error al guardar la nota:", error);
    }
}

// ASIGNA EL CONTENIDO DEL TEXT AREA DE UNA NOTA, SETEA EL CONTENIDO CON LA NOTA SELECCIONADA
export async function setNote() {
    let textArea = document.getElementById("note-textarea");

    try {
        let note = await getNoteById(currentTab);
        if (note) {
            textArea.value = note._content;
        }
    } catch (error) {
        console.error("Error al guardar la nota:", error);
    }
}

/*######################################################################
#  ASIGNACIÓN DE LISTENERS A ELEMENTOS ESPECIFICOS
######################################################################*/


// LISTENER ASIGNADO AL BOTÓN DE LA VISTA 1 PARA CREAR UNA NUEVA NOTA
createB.addEventListener("click", async () => {
    createB.style.display = "none";
    let note = new Note();
    createNote(note.title, note.id, note.content); //Se encarga de asignar la interfaz adecuada para crear una nota
    await saveNote(note, notes);
    await setAllNotes();
});

comodin.addEventListener("click", async () => {
    //let notasp = await getAllNotes();
    //console.log('notasp: ', notasp);
    //console.log('notes: ', notes);
    deleteAll();
})

Note.setCount();
setAllNotes();