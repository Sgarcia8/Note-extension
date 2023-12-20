import { deleteNote, getAllNotes, getNoteById } from "./NotesPers.js";
import { createEventListenerCloseB, createEventListenerP, createEventListenerTab, setNote, setCurrentTab, createNote, setAllNotes } from "./notas.js";

let create_b = document.getElementById("button-create");
let organize_b = document.getElementById("button-organize");
let first_view = document.getElementById("view-one");
let second_view = document.getElementById("view-two");
let numNotes;
let pestaniaActual;

/*######################################################################
#  FUNCIONES DE MANEJO DE VISTAS
######################################################################*/

// ASIGNA LA VISTA QUE SE LE DEBE MOSTRAR AL USUSARIO
function assignView(view) {
    if (view.classList.value === "content-1") {
        first_view.style.display = 'flex';
        second_view.style.display = 'none';
    } else if (view.classList.value === "content-1-grid") {
        first_view.style.display = 'grid';
        second_view.style.display = 'none';
    }
}

// LIMPIA TODOS LOS ELEMENTOS DE LA SEGUNDA VISTA
function clearSecondView() {
    while (second_view.firstChild) {
        second_view.removeChild(second_view.firstChild);
    }
}

// ACTUALIZA LA PRIMERA VISTA
async function updateFirstView() {
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
            console.error("Error al guardar la nota:", error);
        }
    });

    // Esperamos a que todas las promesas se resuelvan antes de continuar
    await Promise.all(promises);
}

// CARGA LA SEGUNDA VISTA CON TODOS SUS ELEMENTOS
export async function loadSecondView() {
    clearSecondView();

    try {
        let notes = await getAllNotes();

        if (notes) {
            createList(notes);
            numNotes = Object.keys(notes).length;
        } else {
            second_view.classList.add('content-2');
            let p = document.createElement('p');
            let textNode = document.createTextNode("No hay notas guardadas");
            p.appendChild(textNode);
            second_view.appendChild(p);
            numNotes = 0;
        }
    } catch (error) {
        console.error("Error al guardar la nota:", error);
    }
}

/*######################################################################
#  FUNCIONES NORMALES
######################################################################*/

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

// FUNCIÓN PARA ABRIR UNA PESTAÑA Y EL CONTENIDO QUE DEBE IR AHÍ
async function openTab(object) {
    
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

/*######################################################################
#  FUNCIONES DE ASIGNACIÓN DE EVENT LISTENERS
######################################################################*/

// ASIGNA EL EVENT LISTENER A LOS DIVS QUE CONFORMAN LA LISTA DE NOTA (CADA DIV ES UNA NOTA)
function createEventListenerDiv(element) {
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
    });
}

// ASIGNA EL EVENT LISTENER A LOS ELEMENTOS DE ELMINICACIÓN DE NOTAS (BOTONES)
function createEventListenerDel(element) {
    element.addEventListener('click', async () => {
        const result = await deleteNote(element.id);
        if (result) {
            await loadSecondView();
            await updateFirstView();
            await setAllNotes();
        } else {
            console.log("Error al eliminar el elemento");
        }
    });
}

/*######################################################################
#  ASIGNACIÓN DE LISTENERS A ELEMENTOS ESPECIFICOS
######################################################################*/

create_b.addEventListener("click", () => {    
    if (getComputedStyle(first_view).getPropertyValue("display") == 'none') {
        assignView(first_view);
    }
});

organize_b.addEventListener("click", async () => {
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

loadSecondView();