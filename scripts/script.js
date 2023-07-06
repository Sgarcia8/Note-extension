import { createEventListenerCloseB, createEventListenerP, createEventListenerTab, setNote, setCurrentTab, createNote } from "./notas.js";

let create_b = document.getElementById("button-create");
let organize_b = document.getElementById("button-organize");
let first_view = document.getElementById("view-one");
let second_view = document.getElementById("view-two");
let numNotes;

function assignView(view) {
    if (view.classList.value === "content-1") {
        first_view.style.display = 'flex';
        second_view.style.display = 'none';
    } else if (view.classList.value === "content-1-grid") {
        first_view.style.display = 'grid';
        second_view.style.display = 'none';
    }
}

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

function clearSecondView() {
    while (second_view.firstChild) {
        second_view.removeChild(second_view.firstChild);
    }
}

function updateFirstView() {
    let divs = document.querySelectorAll(".note-top .tab");
    let tabs = Array.from(divs);

    tabs.forEach(function(tab){
        let id = tab.querySelector('.tab p').id;
        
        chrome.storage.local.get(id, (result) => {
            if (!Object.keys(result).includes(id)) {
                let notebar = tab.parentNode;
                notebar.removeChild(tab);
            }
        });
    });
}

function loadSecondView() {
    clearSecondView();

    chrome.storage.local.get(null, (result) => {
        if (Object.keys(result).length !== 0) {
            createList(result);
        } else {
            second_view.classList.add('content-2');
            let p = document.createElement('p');
            let textNode = document.createTextNode("No hay notas guardadas");
            p.appendChild(textNode);
            second_view.appendChild(p);
        }
        numNotes = Object.keys(result).length;
    });
}

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
    console.log(exists);
    return exists;
}

function openTab(object) {
    
    for (let key in object) {
        if (object.hasOwnProperty(key)) {
            let existingTabs = document.getElementsByClassName("tab");

            if (existingTabs.length === 0) {
                createNote(object[key]._title, object[key]._id, object[key]._content);

                if (getComputedStyle(second_view).getPropertyValue("display") != 'none') {
                    second_view.style.display = 'none';
                    //first_view.style.display = 'none';
                }

                let button = document.getElementById("principal-b");
                button.style.display = 'none';
            } else {
                if (tabExists(key, existingTabs)){
                    setCurrentTab(object[key]._id);
                } else {
                    let lastTab = existingTabs[existingTabs.length - 1];
                    let newTab = document.createElement('div');
                    let p = document.createElement('p');
                    let closeB = document.createElement('div');
                    let pClose = document.createElement('p');

                    newTab.classList.add('tab');
                    p.textContent = object[key]._title;
                    p.id = object[key]._id;
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
            setNote();
        }
    }

    if (getComputedStyle(first_view).getPropertyValue("display") == 'none') {
        assignView(first_view);
    }
}

function createEventListenerDiv(element) {
    element.addEventListener('click', () =>{
        let id = element.querySelector('.img').id;

        chrome.storage.local.get(id, (result) => {
            openTab(result);
        });
    });
}

function createEventListenerDel(element) {
    element.addEventListener('click', () => {
        chrome.storage.local.remove(element.id, () => {
            loadSecondView();
            updateFirstView();
        });
    });
}

create_b.addEventListener("click", () => {    
    if (getComputedStyle(first_view).getPropertyValue("display") == 'none') {
        assignView(first_view);
    }
});

organize_b.addEventListener("click", () => {
    if (getComputedStyle(second_view).getPropertyValue("display") == 'none') {
        second_view.style.display = 'flex';
        first_view.style.display = 'none';
    }

    chrome.storage.local.get(null, (result) => {
        if (Object.keys(result).length !== numNotes) {
            loadSecondView();
        }
    });
});

//chrome.storage.local.clear();
loadSecondView();