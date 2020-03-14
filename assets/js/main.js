// menu
const el_body = document.getElementsByTagName('body')[0];
const el_sideBar = document.getElementsByClassName('side-bar')[0];
const el_menuButton = document.getElementsByClassName('menu-button')[0];

el_menuButton.addEventListener('click', (e) => {
    el_body.classList.toggle('open-menu');
});


// modal post images
const el_article = document.getElementsByTagName('article')[0];

if(el_article) {
    el_article.addEventListener('click', (e) => {
        if (e.srcElement.tagName == 'IMG') {
            e.srcElement.classList.toggle('modal');
            el_article.classList.toggle('modal');
        }
        else if (e.srcElement.tagName == 'ARTICLE') {
            var modals = [...document.getElementsByClassName('modal')];
            for(var el of modals)
                el.classList.remove('modal');
        }
    });
}
