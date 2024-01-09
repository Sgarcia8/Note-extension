import Note from "./note.js";
import { setCurrentTab, getCurrentTab, getNotes, setNumNotes, getCurrentView } from "./main.js";
import { saveNote, getNoteById, getAllNotes } from "./NotesPers.js";
import { createEventListenerTab, createEventListenerCloseB, createEventListenerNewTab, createEventListenerTextA, createEventListenerDel, createEventListenerDiv, createEventListenerEdit, createEventListenerCheck, createEventeListenerDDButon, createEventeListenerDDListItem } from "./listeners.js";

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

    second_view.classList.remove('content-2');
    second_view.classList.add('content-2-notes');
    second_view.appendChild(ul);

    for (let key in object) {
        if (object.hasOwnProperty(key)) {
            let item = document.createElement("li");
            let div = document.createElement("div");
            let h1 = document.createElement("h1");
            let divB = document.createElement("div");
            let divD = document.createElement("div");
            let divE = document.createElement("div");
            let divC = document.createElement("div");

            h1.textContent = object[key]._title;
            h1.title = object[key]._title;
            divD.classList.add('img');
            divD.classList.add('delete');
            divD.id = key;
            divE.classList.add('img');
            divE.classList.add('edit');
            divE.id = key;
            divC.classList.add('img');
            divC.classList.add('check');
            divC.id = key;
            divC.style.display = 'none';

            divB.appendChild(divC);
            divB.appendChild(divE);
            divB.appendChild(divD);
            div.appendChild(h1);
            div.appendChild(divB);
            item.appendChild(div);
            ul.appendChild(item);

            createEventListenerCheck(divC)
            createEventListenerDel(divD);
            createEventListenerDiv(div);
            createEventListenerEdit(divE);
        }
    }
}

// VERIFICA SI HAY PESTAÑAS EXISTENTES EN LA VISTA
function tabExists(key, tabs, element) {
    let exists = false;

    if (element === 'navbar') {
        Array.from(tabs).some(function (tab) {
            if (tab.style.display === 'none') {
                return false;
            }
            let id = tab.querySelector('p').id;
    
            if (id === key) {
                exists = true;
                return true;
            } else {
                exists = false;
                return false;
            }
        });
    } else {
        Array.from(tabs).some(function (tab) {
            if (tab.style.display != 'none') {
                return false;
            }
            let id = tab.querySelector('p').id;
    
            if (id === key) {
                exists = true;
                return true;
            } else {
                exists = false;
                return false;
            }
        });
    }
    return exists;
}

//VERIFICA QUE EL ANCHO DE LA BARRA DE PESTAÑAS NO SUPERE LO MAXIMO PERMITIDO 
function verifyExistingTabs(tabs) {
    const button = document.querySelector('.open-list');
    let width = 0;

    for (const tab of tabs) {
        width = width + tab.offsetWidth;
        if (!button || (button && button.style.display == 'none')) {
            if (width > 175) {
                return tab;
            }
        } else if (button && button.style.display != 'none') {
            if (width > 150) {
                return tab;
            }
        }
    }

    return null;
}

//CREA EL BOTÓN PARA VER LA LISTA DE NOTAS QUE NO SON VISIBLES
function createButtonDropdownList(parent) {
    let openList = document.createElement('div');
    let p = document.createElement('p');

    openList.classList.add('open-list');
    openList.id = 'open-list';
    p.textContent = "⌄";

    openList.appendChild(p);
    parent.appendChild(openList);

    createEventeListenerDDButon(openList);
}

//CREA EL DIV DE LA LISTA DESPLEGABLE DONDE SE MOSTRARA TODO EL CONTENIDO, OSEA, LAS NOTAS QUE NO SON VISIBLES PERO SE ABRIERON
function createContDropdownList(parent) {
    let list = document.createElement('div');
    let ul = document.createElement("ul");

    list.classList.add('dropList');

    list.appendChild(ul);
    parent.parentNode.appendChild(list);
}

//AÑADE A LA LISTA DESPLEGABLE DE LAS NOTAS QUE NO ESTAN VISIBLES UNA NUEVA NOTA
function addNoteDropdownList (tab) {
    const container = document.querySelector('.dropList');
    const list = document.querySelector('.dropList').querySelector('ul');
    let item = document.createElement("li");
    let div = document.createElement("div");
    let p = document.createElement("p");

    p.textContent = tab.querySelector('p').textContent;
    p.title = tab.querySelector('p').textContent;
    p.id = tab.querySelector('p').id;

    div.appendChild(p);
    item.appendChild(div);
    list.appendChild(item);

    createEventeListenerDDListItem(item);

    const computedStyle = getComputedStyle(container);
    let bottom = parseInt(computedStyle.bottom)

    if (parseInt(computedStyle.height) < 120) {
        container.style.bottom = (bottom - 27) + 'px';
    } else {
        if (bottom != 144) {
            container.style.bottom = (bottom - 9) + 'px';
        }
    }

    tab.style.display = 'none';
}

//CREA EL BOTÓN Y LA LISTA DESPLEGABLE EN LA BARRA DE NAVEGACIÓN DE LAS NOTAS, ESTO PASA CUANDO SE SUPERA EL NÚMERO DE NOTAS VISIBLES PERMITIDAS
function createDropdownList(tab) {
    let noteTop = document.querySelector('.note-top');

    if (noteTop.querySelector('#open-list')) {
        addNoteDropdownList(tab);
        return;
    }

    createButtonDropdownList(noteTop);
    createContDropdownList(noteTop);

    if (noteTop.contains(tab)) {
        addNoteDropdownList(tab)
    }
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
    let firstTab = existingTabs[0];
    let note = new Note();

    let newTab = document.createElement('div');
    let p = document.createElement('p');
    let closeB = document.createElement('div');
    let pClose = document.createElement('p');

    newTab.classList.add('tab');
    p.textContent = note.title;
    p.id = note.id;
    p.title = note.title;
    closeB.classList.add('close-button');
    pClose.textContent = "x";
    await saveNote(note, getNotes());

    closeB.appendChild(pClose);
    newTab.appendChild(p);
    newTab.appendChild(closeB);
    firstTab.parentNode.insertBefore(newTab, existingTabs[0]);

    setCurrentTab(p.id)

    //createEventListenerP(p);
    createEventListenerTab(newTab);
    createEventListenerCloseB(closeB);

    await setNote();

    let result = verifyExistingTabs(existingTabs);
    if (result) {
        createDropdownList(result);
    }
}

// FUNCIÓN PARA ABRIR UNA PESTAÑA Y EL CONTENIDO QUE DEBE IR AHÍ
export async function openTab(object) {

    if (getComputedStyle(first_view).getPropertyValue("display") == 'none') {
        assignView(first_view);
    }

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
            if (tabExists(object._id, existingTabs, 'navbar')) {
                //HAY QUE MODIFICAR AQUI EN UN FUTURO
                setCurrentTab(object._id);
            } else if (tabExists(object._id, existingTabs, 'droplist')) {
                removeNoteDDList(object._id);
                await reOpenTab(object._id);
            } else {
                let firstTab = existingTabs[0];
                let newTab = document.createElement('div');
                let p = document.createElement('p');
                let closeB = document.createElement('div');
                let pClose = document.createElement('p');

                newTab.classList.add('tab');
                p.textContent = object._title;
                p.id = object._id;
                p.title = object._title;
                closeB.classList.add('close-button');
                pClose.textContent = "x";

                closeB.appendChild(pClose);
                newTab.appendChild(p);
                newTab.appendChild(closeB);
                firstTab.parentNode.insertBefore(newTab, existingTabs[0]);

                setCurrentTab(p.id);

                //createEventListenerP(p);
                createEventListenerTab(newTab);
                createEventListenerCloseB(closeB);

                let result = verifyExistingTabs(existingTabs);
                if (result) {
                    createDropdownList(result);
                }
            }
        }
        await setNote();
    }
}

// ACTUALIZA LA PRIMERA VISTA
export async function updateFirstView() {
    let divs = document.querySelectorAll(".note-top .tab");
    let tabs = Array.from(divs);

    // Creamos un array para almacenar todas las promesas
    const promises = tabs.map(async function (tab) {
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

//ELIMINA LA NOTA DE LA LISTA DESPLEGABLE
export function removeNoteDDList(id) {
    const container = document.querySelector('.dropList');
    const list = document.querySelector('.dropList').querySelector('ul').querySelectorAll('li');
    const computedStyle = getComputedStyle(container);
    let bottom = parseInt(computedStyle.bottom)

    for (const item of list) {
        if (id === item.querySelector('p').id) {
            if (parseInt(computedStyle.height) < 120) {
                container.querySelector('ul').removeChild(item);
                container.style.bottom = (bottom + 27) + 'px';
            } else {
                container.querySelector('ul').removeChild(item);
                if (bottom != 144 || parseInt(computedStyle.height) != 120) {
                    container.style.bottom = (bottom + 9) + 'px';
                }
            }
        }
    }

    if (document.querySelector('.dropList').querySelector('ul').querySelectorAll('li').length === 0) {
        document.querySelector('.note-top').querySelector('#open-list').remove();
        document.querySelector('.dropList').remove();
    }
}

//RE ABRE Y ACOMODA UNA NOTA QUE ESTABA EN LA LISTA DESPLEGABLE Y QUE EL USUSARIO SELECCIONÓ
export async function reOpenTab(id) {
    const tabs = document.querySelector('.note-top').querySelectorAll('.tab');

    for (const tab of tabs) {
        if (id === tab.querySelector('p').id) {
            tab.remove();
            let note = await getNoteById(id);
            if (note) {
                await openTab(note);
            }
        }
    }
}

//ABRE UNA NOTA DE LAS POSIBLES NOTAS QUE EXISTEN EN LA LISTA DESPLEGABLE DE NOTAS
export function openExistingTab() {
    //DEBO EVALUAR SI UNA NOTA CON TITULO LARGO ESTÁ
    const tabs = document.querySelector('.note-top').querySelectorAll('.tab');
    let isOpen = null;

    for (const tab of tabs) {
        if (tab.style.display === 'none') {
            tab.style.display = 'flex';
            let result = verifyExistingTabs(tabs);
                if (result) {
                    tab.style.display = 'none';
                    continue;
                } else {
                    isOpen = tab.querySelector('p').id;
                    break;
                }
        }
    }

    return isOpen;
}

//CARGA LA VISTA INICIAL DEL PROGRAMA TAL CUAL COMO EL USUARIO LO DEJO AL CERRARLO POR ULTIMA VEZ
export async function loadInitView(info) {
    const view = getCurrentView();
    const currentTab = getCurrentTab();
    if (view === 1 && info) {
        if ('existingTabs' in info) {
            // que se abra la primerea vista con las tabs existentes
            const tabs = info.existingTabs

            for (const tab of [...tabs].reverse()) {
                let note = await getNoteById(tab);
                if (note) {
                    await openTab(note);
                }
            }

            setCurrentTab(currentTab);
            await setNote();
        } else {
            // que se abra en la vista de create new note
            return;
        }
    } else if (view === 2) {
        // que se abra en la segunda vista de lista de notas
        if (getComputedStyle(second_view).getPropertyValue("display") == 'none') {
            second_view.style.display = 'flex';
            first_view.style.display = 'none';
        }
    }
}