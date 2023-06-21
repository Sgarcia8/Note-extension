let create_b = document.getElementById("button-create");
let organize_b = document.getElementById("button-organize");
let first_view = document.getElementById("view-one");
let second_view = document.getElementById("view-two");

function assignView(view) {
    console.log(view.classList.value);
    if (view.classList.value === "content-1") {
        first_view.style.display = 'flex';
        second_view.style.display = 'none';
    } else if (view.classList.value === "content-1-grid") {
        first_view.style.display = 'grid';
        second_view.style.display = 'none';
    }
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