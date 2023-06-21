let createB = document.getElementById("principal-b");
let content = document.getElementById('view-one');

function createNote() {
    let divTop = document.createElement('div');
    let divC = document.createElement('div');
    let textarea = document.createElement('textarea');
    let buttonSave = document.createElement('div');
    let buttonConfig = document.createElement('div');

    content.classList.remove('content-1');
    content.classList.add('content-1-grid');
    content.style.display = 'grid';
    divTop.classList.add('note-top');
    divC.classList.add('note-content');
    buttonSave.classList.add('button-top');
    buttonSave.id = 'save-button';
    buttonConfig.classList.add('button-top');
    buttonConfig.id = 'conf-button';
    
    divTop.appendChild(buttonSave);
    divTop.appendChild(buttonConfig);
    divC.appendChild(textarea);
    content.appendChild(divTop);
    content.appendChild(divC);
}

createB.addEventListener("click", () => {
    createB.style.display = "none";
    createNote();
});