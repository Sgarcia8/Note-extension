let create_b = document.getElementById("button-create");
let organize_b = document.getElementById("button-organize");
let first_view = document.getElementById("view-one");
let second_view = document.getElementById("view-two");
let numNotes = 0;

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
            
            h1.textContent = key

            div.appendChild(h1);
            item.appendChild(div);
            ul.appendChild(item);
        }
    }

    second_view.classList.remove('content-2');
    second_view.classList.add('content-2-notes');
    second_view.appendChild(ul);
}

function loadSecondView() {
    chrome.storage.local.get(null, (result) => {
        if (result.valueOf.length != 0) {
            createList(result);
        } else {
            second_view.classList.add('content-2');
            let p = document.createElement('p');
            let textNode = document.createTextNode("No hay notas guardadas");
            p.appendChild(textNode);
            second_view.appendChild(p);
        }
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
});

chrome.storage.local.clear();
loadSecondView();