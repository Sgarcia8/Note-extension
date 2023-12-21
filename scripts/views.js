import Note from "./note.js";
import { setCurrentTab, getCurrentTab, getNotes, setNumNotes } from "./main.js";
import { saveNote, getNoteById, getAllNotes } from "./NotesPers.js";
import { createEventListenerP, createEventListenerTab, createEventListenerCloseB, createEventListenerNewTab, createEventListenerTextA, createEventListenerDel, createEventListenerDiv } from "./listeners.js";

let first_view = document.getElementById('view-one');
let second_view = document.getElementById("view-two");

/*-----------------------------------------------------------------*/
/* FUNCIONES LOCALES */ 
/*-----------------------------------------------------------------*/

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
    first_view.appendChild(divTop);    

    setCurrentTab(pTitle.id);

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
    first_view.appendChild(divC);

    createEventListenerTextA(textarea);
}

// LIMPIA TODOS LOS ELEMENTOS DE LA SEGUNDA VISTA
function clearSecondView() {
    while (second_view.firstChild) {
        second_view.removeChild(second_view.firstChild);
    }
}

// CREACIÓN DE LA LISTA DE NOTAS EN LA VISTA DE NOTAS DE USUARIO
function createList(object) {
    let ul = document.createElement("ul");

    for (let key in object) {
        if (object.hasOwnProperty(key)) {
            let item = document.createElement("li");
            let div = document.createElement("div");
            let h1 = document.createElement("h1");
            let divD = document.createElement("div");
            
            h1.textContent = object[key]._title;
            divD.classList.add('img');
            divD.classList.add('delete');
            divD.id = key;

            div.appendChild(h1);
            div.appendChild(divD);
            item.appendChild(div);
            ul.appendChild(item);

            createEventListenerDel(divD);
            createEventListenerDiv(div);
        }
    }

    second_view.classList.remove('content-2');
    second_view.classList.add('content-2-notes');
    second_view.appendChild(ul);
}

// VERIFICA SI HAY PESTAÑAS EXISTENTES EN LA VISTA
function tabExists(key, tabs) {
    let exists = false;
    Array.from(tabs).some(function(tab) {
        let id = tab.querySelector('p').id;

        if (id === key) {
            exists = true;
            return true;
        } else {
            exists = false;
            return false;
        }
    });
    return exists;
}

/*-----------------------------------------------------------------*/
/* FUNCIONES EXPORTADAS */ 
/*-----------------------------------------------------------------*/

// CARGA LA VISTA PRINCIPAL DE LA FORMA ORIGINAL
export function loadFirstview() {
    let noteTop = document.querySelector('.note-top');
    let noteContent = document.querySelector('.note-content');
    let createB = document.getElementById("principal-b");

    first_view.removeChild(noteTop);
    first_view.removeChild(noteContent);

    first_view.classList.remove('content-1-grid');
    first_view.classList.add('content-1');
    first_view.style.display = 'flex';
    createB.style.display = "flex";
}

// CARGA LA SEGUNDA VISTA CON TODOS SUS ELEMENTOS
export async function loadSecondView() {
    clearSecondView();

    try {
        let notes = await getAllNotes();

        if (notes) {
            createList(notes);
            setNumNotes(Object.keys(notes).length);
        } else {
            second_view.classList.add('content-2');
            let p = document.createElement('p');
            let textNode = document.createTextNode("No hay notas guardadas");
            p.appendChild(textNode);
            second_view.appendChild(p);
            setNumNotes(0);
        }
    } catch (error) {
        console.error("Error al recuperar las notas:", error);
    }
}

// ASIGNA VALOR AL CONTENIDO DE UNA NOTA Y LA GUARDA, ESTO SUCEDE CADA VEZ QUE EL USUARIO ESCRIBE EN EL TEXT AREA
export async function saveContNote(value) {
    try {
        let note = await getNoteById(getCurrentTab());
        if (note) {
            note._content = value;
            await saveNote(note, getNotes());
        }
    } catch (error) {
        console.error("Error al guardar la nota:", error);
    }
}

// ASIGNA EL CONTENIDO DEL TEXT AREA DE UNA NOTA, SETEA EL CONTENIDO CON LA NOTA SELECCIONADA
export async function setNote() {
    let textArea = document.getElementById("note-textarea");

    try {
        let note = await getNoteById(getCurrentTab());
        if (note) {
            textArea.value = note._content;
        }
    } catch (error) {
        console.error("Error al setear el contenido de la nota: ", error);
    }
}

// AÑADE UNA NUEVA PESTAÑA AL NAVBAR DE LAS NOTAS
export async function createNewTab() {
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
    await saveNote(note, getNotes());

    closeB.appendChild(pClose);
    newTab.appendChild(p);
    newTab.appendChild(closeB);
    lastTab.parentNode.insertBefore(newTab, lastTab.nextSibling);

    setCurrentTab(p.id)

    createEventListenerP(p);
    createEventListenerTab(newTab);
    createEventListenerCloseB(closeB);

    await setNote();
}

// FUNCIÓN PARA ABRIR UNA PESTAÑA Y EL CONTENIDO QUE DEBE IR AHÍ
export async function openTab(object) {
    
    if (object) {
        let existingTabs = document.getElementsByClassName("tab");

        if (existingTabs.length === 0) {
            createNote(object._title, object._id, object._content);

            if (getComputedStyle(second_view).getPropertyValue("display") != 'none') {
                second_view.style.display = 'none';
            }

            let button = document.getElementById("principal-b");
            button.style.display = 'none';
        } else {
            if (tabExists(object._id, existingTabs)){
                setCurrentTab(object._id);
            } else {
                let lastTab = existingTabs[existingTabs.length - 1];
                let newTab = document.createElement('div');
                let p = document.createElement('p');
                let closeB = document.createElement('div');
                let pClose = document.createElement('p');

                newTab.classList.add('tab');
                p.textContent = object._title;
                p.id = object._id;
                closeB.classList.add('close-button');
                pClose.textContent = "x";

                closeB.appendChild(pClose);
                newTab.appendChild(p);
                newTab.appendChild(closeB);
                lastTab.parentNode.insertBefore(newTab, lastTab.nextSibling);

                setCurrentTab(p.id);

                createEventListenerP(p);
                createEventListenerTab(newTab);
                createEventListenerCloseB(closeB);
            }
        }
        await setNote();
    }

    if (getComputedStyle(first_view).getPropertyValue("display") == 'none') {
        assignView(first_view);
    }
}

// ACTUALIZA LA PRIMERA VISTA
export async function updateFirstView() {
    let divs = document.querySelectorAll(".note-top .tab");
    let tabs = Array.from(divs);

    // Creamos un array para almacenar todas las promesas
    const promises = tabs.map(async function(tab){
        let id = tab.querySelector('.tab p').id;
        
        try {
            let note = await getNoteById(id);
            if (!note) {
                let notebar = tab.parentNode;
                notebar.removeChild(tab);
            }
        } catch (error) {
            console.error("Error al actualizar el navbar:", error);
        }
    });

    // Esperamos a que todas las promesas se resuelvan antes de continuar
    await Promise.all(promises);
}

// CREA EL HTML DE LA NOTA EN GENERAL
export function createNote(title, id, cont) {
    first_view.classList.remove('content-1');
    first_view.classList.add('content-1-grid');
    first_view.style.display = 'grid';
    
    createTopNote(title, id);
    creatContNote(cont);
}

// ASIGNA LA VISTA QUE SE LE DEBE MOSTRAR AL USUSARIO
export function assignView(view) {
    if (view.classList.value === "content-1") {
        first_view.style.display = 'flex';
        second_view.style.display = 'none';
    } else if (view.classList.value === "content-1-grid") {
        first_view.style.display = 'grid';
        second_view.style.display = 'none';
    }
}