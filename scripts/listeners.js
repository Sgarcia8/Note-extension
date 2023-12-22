import { getCurrentTab, getCurrentView, getExistingTabs, getNotes, setCurrentTab, setNotes, setInfo, setCurrentView } from "./main.js";
import { loadFirstview, updateFirstView, loadSecondView, saveContNote, setNote, createNewTab, openTab } from "./views.js";
import { getNoteById, saveNote, deleteNote } from "./NotesPers.js";

// ASIGNA EL EVENT LISTENER A LOS DE CIERRE DE PESTAÑAS
export function createEventListenerCloseB(element) {
    element.addEventListener("click", async () => {
        let noteBar = element.parentNode.parentNode;
        let existingTabs = document.getElementsByClassName("tab");

        noteBar.removeChild(element.parentNode);

        if (existingTabs.length === 0) {
            loadFirstview();
            setCurrentTab(null);
        } else {
            let lastTab = existingTabs[existingTabs.length - 1];
            setCurrentTab(lastTab.querySelector('p').id);
            await setNote();
        }
        const tabs = getExistingTabs();
        try {
            await setInfo(getCurrentView(), getCurrentTab(), tabs);   
        } catch (error) {
            console.log('Error al setear la información: ', error);
        }
    });
}

// ASIGNA EL EVENT LISTENER A LOS TEXT AREA DONDE EL USUARIO ESCRIBE LAS NOTAS
export function createEventListenerTextA(element) {
    element.addEventListener("input", async () => {
        await saveContNote(element.value);
      });
}

// ASIGNA EL EVENT LISTENER A LAS PESTAÑAS DEL NAVBAR, FUNCIONA PARA PODER CAMBIAR DE PESTAÑA
export function createEventListenerTab(element) {
    element.addEventListener('click', async (event) => {
        if (!event.target.closest('.close-button') && element.querySelector('.tab p').id != getCurrentTab()) {
            setCurrentView(1)
            setCurrentTab(element.querySelector('.tab p').id);
            await setNote();
            const tabs = getExistingTabs();
            try {
                await setInfo(getCurrentView(), getCurrentTab(), tabs);   
            } catch (error) {
                console.log('Error al setear la información: ', error);
            }
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
                    await saveNote(note, getNotes());
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
        setCurrentView(1);
        const tabs = getExistingTabs();
        try {
            await setInfo(getCurrentView(), getCurrentTab(), tabs);   
        } catch (error) {
            console.log('Error al setear la información: ', error);
        }
    });
}

// ASIGNA EL EVENT LISTENER A LOS DIVS QUE CONFORMAN LA LISTA DE NOTA (CADA DIV ES UNA NOTA)
export function createEventListenerDiv(element) {
    element.addEventListener('click', async (event) =>{
        let divDel = element.querySelector('.delete');
        if (event.target === divDel) {
            return;
        }

        let id = element.querySelector('.img').id;

        try {
            let note = await getNoteById(id);
            if (note) {
                await openTab(note);
            }
        } catch (error) {
            console.error("Error al guardar la nota:", error);
        }
        setCurrentView(1);
        const tabs = getExistingTabs();
        try {
            await setInfo(getCurrentView(), getCurrentTab(), tabs);   
        } catch (error) {
            console.log('Error al setear la información: ', error);
        }
    });
}

// ASIGNA EL EVENT LISTENER A LOS ELEMENTOS DE ELMINICACIÓN DE NOTAS (BOTONES)
export function createEventListenerDel(element) {
    element.addEventListener('click', async () => {
        const result = await deleteNote(element.id);
        if (result) {
            await loadSecondView();
            await updateFirstView();
            await setNotes();
        } else {
            console.log("Error al eliminar el elemento");
        }
    });
}