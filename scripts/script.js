let create_b = document.getElementById("button-create");
let organize_b = document.getElementById("button-organize");
let first_view = document.getElementById("view-one");
let second_view = document.getElementById("view-two");

console.log('ssssss');

create_b.addEventListener("click", () => {    
    if (getComputedStyle(first_view).getPropertyValue("display") == 'none') {
        first_view.style.display = 'flex';
        second_view.style.display = 'none';
    }
});

organize_b.addEventListener("click", () => {
    if (getComputedStyle(second_view).getPropertyValue("display") == 'none') {
        second_view.style.display = 'flex';
        first_view.style.display = 'none';
    }
});