import Note from "./note.js";

let createB = document.getElementById("principal-b");
let content = document.getElementById('view-one');
let currentTab;

function createTopNote(note) {
    let divTop = document.createElement('div');
    let tab = document.createElement('div');
    let pTitle = document.createElement('p');
    let newTab = document.createElement('div');
    let p = document.createElement('p');
    let closeB = document.createElement('div');

    divTop.classList.add('note-top');
    tab.classList.add('tab');
    pTitle.textContent = note.title;
    pTitle.id = note.id;
    newTab.classList.add('new-tab');
    newTab.id = 'add-tab';
    p.textContent = "+";
    closeB.classList.add('close-button');
    
    tab.appendChild(pTitle);
    tab.appendChild(closeB);
    newTab.appendChild(p);
    divTop.appendChild(tab);
    divTop.appendChild(newTab);
    content.appendChild(divTop);    

    currentTab = pTitle.id;

    createEventListenerP(pTitle);
    createEventListenerTab(tab);
}

function creatContNote(note) {
    let divC = document.createElement('div');
    let textarea = document.createElement('textarea');

    divC.classList.add('note-content');
    textarea.id = 'note-textarea';
    textarea.value = note.content;

    
    divC.appendChild(textarea);
    content.appendChild(divC);

    createEventListenerTextA(textarea);
}

function createNote(note) {
    content.classList.remove('content-1');
    content.classList.add('content-1-grid');
    content.style.display = 'grid';
    
    createTopNote(note);
    creatContNote(note);
}

function saveContNote(value) {
    chrome.storage.local.get([currentTab]).then((result) => {
        let note = result[Object.keys(result)[0]];
        note._content = value;
        saveNote(note);
    });
}

function setNote() {
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
    newTab.classList.add('tab');
    p.textContent = note.title;
    p.id = note.id;
    closeB.classList.add('close-button');
    saveNote(note);

    newTab.appendChild(p);
    newTab.appendChild(closeB);
    lastTab.parentNode.insertBefore(newTab, lastTab.nextSibling);

    currentTab = p.id;

    createEventListenerP(p);
    createEventListenerTab(newTab);

    setNote();
}

function createEventListenerTextA(element) {
    element.addEventListener("input", () => {
        saveContNote(element.value);
      });
}

function createEventListenerTab(element) {
    element.addEventListener('click', () => {
        currentTab = element.querySelector('.tab p').id;
        setNote();
    });
}

function createEventListenerP(element) {
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

createB.addEventListener("click", () => {
    createB.style.display = "none";
    let note = new Note();
    createNote(note);
    saveNote(note);

    let addTabB = document.getElementById('add-tab');

    if (addTabB) {
        addTabB.addEventListener("click", () => {
            createNewTab();
        });
    }
});

Note.setCount();