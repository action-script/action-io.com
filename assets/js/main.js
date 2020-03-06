// menu
const el_body = document.getElementsByTagName("body")[0];
const el_sideBar = document.getElementsByClassName("side-bar")[0];
const el_menuButton = document.getElementsByClassName("menu-button")[0];

el_menuButton.addEventListener("click", (e) => {
    el_body.classList.toggle("open-menu");
});
