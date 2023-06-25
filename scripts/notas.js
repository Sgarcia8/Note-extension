import Note from "./note.js";

let createB = document.getElementById("principal-b");
let content = document.getElementById('view-one');

function initNote() {
    let note = new Note();
    console.log(Note.count);
}

function createNote() {
    let divTop = document.createElement('div');
    let divC = document.createElement('div');
    let textarea = document.createElement('textarea');
    let buttonSave = document.createElement('div');
    let tab = document.createElement('div');
    let pTitle = document.createElement('p');

    content.classList.remove('content-1');
    content.classList.add('content-1-grid');
    content.style.display = 'grid';
    divTop.classList.add('note-top');
    divC.classList.add('note-content');
    textarea.id = 'note-textarea';
    tab.classList.add('tab');
    pTitle.classList.add('p-title');
    pTitle.textContent = "N";
    buttonSave.classList.add('img');
    buttonSave.classList.add('save');
    buttonSave.id = 'save-button';
    
    tab.appendChild(pTitle);
    divTop.appendChild(tab);
    divC.appendChild(buttonSave);
    divC.appendChild(textarea);
    content.appendChild(divTop);
    content.appendChild(divC);
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

createB.addEventListener("click", () => {
    createB.style.display = "none";
    createNote();

    let saveB = document.getElementById('save-button');

    if (saveB) {
        saveB.addEventListener("click", () => {
            //saveNote();
            initNote();
        });
    }
});