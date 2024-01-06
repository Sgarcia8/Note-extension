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
        let h1 = element.querySelector('h1');
        let divDel = element.querySelector('.delete');
        let divEdit = element.querySelector('.edit');
        let divCheck = element.querySelector('.check');
        if (event.target === divDel || event.target === divEdit || event.target === divCheck || h1.contentEditable === "true") {
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

// ASIGNA EL EVENT LISTENER A LOS BOTONES DE EDICIÓN DE TITULO, OSEA, PARA PODER CAMBIAR EL TITULO DE LA NOTA (BOTONES)
export function createEventListenerEdit(element) {
    let originalCont;
    let h1 = element.parentNode.parentNode.querySelector('h1');
    let checkB = element.parentNode.querySelector('.check');

    element.addEventListener('click', async () => {
        originalCont = h1.textContent;

        console.log(h1, checkB, originalCont);

        h1.contentEditable = true;
        checkB.style.display = 'inline-block';
        element.style.display = 'none';

        h1.focus();
    });

    document.addEventListener('click', async (e) => {
        //AQUI
        if (h1.contentEditable === "true" && !element.contains(e.target) && !checkB.contains(e.target) && !h1.contains(e.target)) {
            console.log(element.contains(e.target));
            console.log(checkB.contains(e.target));
            console.log(h1.contains(e.target));
            if (originalCont != h1.textContent) {
                let note = await getNoteById(element.id);
                if (note) {
                    note._title = h1.textContent;
                    await saveNote(note, getNotes());
                    await loadSecondView();
                }
            } 
            h1.contentEditable = false;
            element.style.display = 'inline-block';
            checkB.style.display = 'none';
        }
    });
}

// ASIGNA EL EVENT LISTENER A LOS ELEMENTOS DE CONFIRMACIÓN PARA PODER GUARDAR EL TITULO DE UNA NOTA SI SE ESTA CAMBIANDO
export function createEventListenerCheck(element) {
    element.addEventListener('click', async () => {
        let h1 = element.parentNode.parentNode.querySelector('h1');
        let editB = element.parentNode.querySelector('.edit');

        if (h1.contentEditable === "true") {
            let note = await getNoteById(element.id);
            if (note) {
                note._title = h1.textContent;
                await saveNote(note, getNotes());
                await loadSecondView();
            }
            h1.contentEditable = false;
        }

        editB.style.display = 'inline-block';
        element.style.display = 'none';
    });
}

// ASIGNA EL EVENT LISTENERS AL BOTÓN DEL DROPDAWN LIST DONDE ESTAN LAS NOTAS QUE ESTAN ABIERTAS PERO NO SON VISIBLES
export function createEventeListenerDDButon(element) {
    element.addEventListener('click', async () => {
        const dropList = document.querySelector('.dropList');
        
        if (dropList.style.display == 'none') {
            dropList.style.display = 'block';
        } else {
            dropList.style.display = 'none';
        }
        
    });
}