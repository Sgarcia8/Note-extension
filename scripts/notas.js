import Note from "./note.js";

let createB = document.getElementById("principal-b");
let content = document.getElementById('view-one');
let comodin = document.getElementById('button-personalize');
let currentTab;

export function setCurrentTab(id) {
    currentTab = id;
}

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

export function createNote(title, id, cont) {
    content.classList.remove('content-1');
    content.classList.add('content-1-grid');
    content.style.display = 'grid';
    
    createTopNote(title, id);
    creatContNote(cont);
}

function saveContNote(value) {
    chrome.storage.local.get([currentTab]).then((result) => {
        let note = result[Object.keys(result)[0]];
        note._content = value;
        saveNote(note);
    });
}

export function setNote() {
    let textArea = document.getElementById("note-textarea");

    chrome.storage.local.get([currentTab]).then((result) => {
        let note = result[Object.keys(result)[0]];
        textArea.value = note._content;
    });
}

function saveNote(note) {
    const data = {};
    data[note._id] = note;
    chrome.storage.local.set(data);
}

function createNewTab() {
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
    saveNote(note);

    closeB.appendChild(pClose);
    newTab.appendChild(p);
    newTab.appendChild(closeB);
    lastTab.parentNode.insertBefore(newTab, lastTab.nextSibling);

    currentTab = p.id;

    createEventListenerP(p);
    createEventListenerTab(newTab);
    createEventListenerCloseB(closeB);

    setNote();
}

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

function createEventListenerTextA(element) {
    element.addEventListener("input", () => {
        saveContNote(element.value);
      });
}

export function createEventListenerTab(element) {
    element.addEventListener('click', (event) => {
        if (!event.target.closest('.close-button')) {
            currentTab = element.querySelector('.tab p').id;
            setNote();
        }
    });
}

export function createEventListenerP(element) {
    let originalCont;

    element.addEventListener('dblclick', () => {
        originalCont = element.textContent;
        element.contentEditable = true;
    });

    document.addEventListener('click', (e) => {
        if (element.contentEditable === "true" && !element.contains(e.target)) {
            if (originalCont != element.textContent) {
                chrome.storage.local.get([element.id]).then((result) => {
                    let note = result[Object.keys(result)[0]];
                    note._title = element.textContent;
                    saveNote(note);
                });
            } 
            element.contentEditable = false;
        }
    });
}

export function createEventListenerNewTab(element) {
    element.addEventListener("click", () => {
        createNewTab();
    });
}

createB.addEventListener("click", () => {
    createB.style.display = "none";
    let note = new Note();
    createNote(note.title, note.id, note.content);
    saveNote(note);
});

comodin.addEventListener("click", () => {
    Note.setCount();    
})

Note.setCount();