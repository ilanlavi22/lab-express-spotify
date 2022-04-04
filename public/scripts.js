const searchField = document.getElementById("search");
const searchSubmit = document.getElementById('submit');

const checkSubmit = (e) => {
    const searchFieldLength = searchField.value;
    if (searchFieldLength === '') {
        searchField.classList.add("error");
        e.preventDefault();
    } else if (searchField.classList.contains("error")) {
        searchField.classList.remove("error");
    }
}

searchSubmit.addEventListener('click', checkSubmit);



