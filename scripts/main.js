import Note from "./note.js";
import { createNote, assignView, loadSecondView, loadInitView } from "./views.js";
import { saveNote, getAllNotes, getAll, getInfo, savePosition, deleteAll } from "./NotesPers.js";

let first_view = document.getElementById('view-one');
let second_view = document.getElementById("view-two");
let createB = document.getElementById("principal-b");
let comodin = document.getElementById('button-personalize');
let view1B = document.getElementById("button-create");
let view2B = document.getElementById("button-organize");
let currentView = 1;
let currentTab;
let notes;
let numNotes;

/*-----------------------------------------------------------------*/
/* --------------------- SETTERS & GETTERS ----------------------- */ 
/*-----------------------------------------------------------------*/

export function setCurrentView(view) {
    currentView = view;
}

export function getCurrentView() {
    return currentView;
}

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
/* -------------------- LISTENERS PRINCIPALES -------------------- */ 
/*-----------------------------------------------------------------*/

// LISTENER ASIGNADO AL BOTÓN DE LA VISTA 1 PARA CREAR UNA NUEVA NOTA (BOTÓN CREAR NOTA)
createB.addEventListener("click", async () => {
    createB.style.display = "none";
    let note = new Note();
    createNote(note.title, note.id, note.content); //Se encarga de asignar la interfaz adecuada para crear una nota
    await saveNote(note, notes);
    await setNotes();
    let tabs = getExistingTabs();
    try {
        await setInfo(currentView, currentTab, tabs);   
    } catch (error) {
        console.log('Error al setear la información: ', error);
    }
});

// LISTENER ASIGNADO AL BOTÓN PARA IR A LA PRIMERA VISTA EN EL MENÚ LATERAL
view1B.addEventListener("click", async () => {    
    if (getComputedStyle(first_view).getPropertyValue("display") == 'none') {
        assignView(first_view);
        currentView = 1;
        let tabs = getExistingTabs();
        try {
            await setInfo(currentView, currentTab, tabs);   
        } catch (error) {
            console.log('Error al setear la información: ', error);
        }
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
    currentView = 2;

    try {
        await setInfo(currentView);   
    } catch (error) {
        console.log('Error al setear la información: ', error);
    }
});

// BOTPON COMODIN
comodin.addEventListener("click", async () => {
    deleteAll();
    //console.log('todo: ', currentTab, currentView);
    //setPosition();
    //const info = await getInfo();
    //const todo = await getAll();
    //console.log('todo: ', info, info.view, info.currentTab, currentTab, currentView);
})

/*-----------------------------------------------------------------*/
/* -------------------------- FUNCIONES -------------------------- */ 
/*-----------------------------------------------------------------*/

async function initialize() {
    await Note.setCount();
    await setNotes();
    await loadSecondView();
    const info = await setPosition();
    await loadInitView(info);
}

async function setPosition() {
    const info = await getInfo();
    if (info) {
        console.log(info);

        if ('view' in info) {
            setCurrentView(info.view)
        }
        if ('currentTab' in info) {
            setCurrentTab(info.currentTab)
        }   
    }

    return info;
}

export async function setInfo(view=1, currentTab=null, existingTabs=null) {
    const info = {
        view: view
    }

    if (currentTab && existingTabs) {
        info['existingTabs'] = existingTabs;
        info['currentTab'] = currentTab;
    }
    await savePosition(info);
}

export function getExistingTabs() {
    let tabs = [];
    if (currentView === 1 && currentTab) {
        let divs = document.querySelectorAll(".note-top .tab");

        for (const div of divs) {
            tabs.push(div.querySelector('p').id);
        }
    }
    return tabs;
}

initialize();