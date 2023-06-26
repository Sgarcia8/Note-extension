import Note from "./note.js";

let createB = document.getElementById("principal-b");
let content = document.getElementById('view-one');

function initNote() {
    let note = new Note();
}

function createTopNote(note) {
    let divTop = document.createElement('div');
    let tab = document.createElement('div');
    let pTitle = document.createElement('p');
    let newTab = document.createElement('div');
    let p = document.createElement('p');

    divTop.classList.add('note-top');
    tab.classList.add('tab');
    pTitle.textContent = "N " + note.title.charAt(note.title.length - 1);
    newTab.classList.add('new-tab');
    newTab.id = 'add-tab';
    p.textContent = "+";
    
    tab.appendChild(pTitle);
    newTab.appendChild(p);
    divTop.appendChild(tab);
    divTop.appendChild(newTab);
    content.appendChild(divTop);    
}

function creatContNote(note) {
    let divC = document.createElement('div');
    let textarea = document.createElement('textarea');

    divC.classList.add('note-content');
    textarea.id = 'note-textarea';
    textarea.value = note.content;

    
    divC.appendChild(textarea);
    content.appendChild(divC);
}

function createNote(note) {
    content.classList.remove('content-1');
    content.classList.add('content-1-grid');
    content.style.display = 'grid';
    
    createTopNote(note);
    creatContNote(note);
}

function saveNote() {
    let note = document.getElementById('note-textarea').value;
    chrome.storage.local.set({ note2: note })
    console.log(note);
}

function getNote() {
    /*chrome.storage.local.get(["note1"]).then((result) => {
        console.log(result.note1);
    });*/
    chrome.storage.local.get(null, (result) => {
        console.log("All stored items:", result);
    });
}

function createNewTab() {

    let existingTabs = document.getElementsByClassName("tab");
    let lastTab = existingTabs[existingTabs.length - 1];
    let note = new Note();

    let newTab = document.createElement('div');
    let p = document.createElement('p');
    newTab.classList.add('tab');
    p.textContent = "N " + note.title.charAt(note.title.length - 1);

    newTab.appendChild(p);
    lastTab.parentNode.insertBefore(newTab, lastTab.nextSibling);
}

createB.addEventListener("click", () => {
    createB.style.display = "none";
    let note = new Note();
    createNote(note);

    let addTabB = document.getElementById('add-tab');

    if (addTabB) {
        addTabB.addEventListener("click", () => {
            createNewTab();
        });
    }
});