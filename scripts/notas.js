let createB = document.getElementById("principal-b");

function createNote() {
    let content = document.getElementById('view-one');
    let divTop = document.createElement('div');
    let divC = document.createElement('div');
    let textarea = document.createElement('textarea');

    divTop.classList.add('note-top');
    divC.classList.add('note-content');
    
    divC.appendChild(textarea);
    content.appendChild(divTop);
    content.appendChild(divC);
}

createB.addEventListener("click", () => {
    createB.style.display = "none";
    createNote();
});