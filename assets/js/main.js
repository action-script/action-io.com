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

        if (e.srcElement.tagName == 'IMG' && !e.srcElement.classList.contains('modal') ) {
            img_copy = e.srcElement.cloneNode(true);
            img_copy.classList.add('modal');
            el_article.insertBefore(img_copy, el_article.childNodes[0]);

            el_article.classList.toggle('modal');
        }
        else if (e.srcElement.tagName == 'ARTICLE' || e.srcElement.parentElement.tagName == 'ARTICLE') {
            var img_modal = el_article.querySelectorAll('img.modal');
            if (img_modal)
                img_modal[0].remove();
            var modals = [...document.getElementsByClassName('modal')];
            for(var el of modals)
                el.classList.remove('modal');
        }

    });
}

// gallery filter
if(window.location.hash) {
    const hash = window.location.hash.substring(1);
    var style = document.createElement('style');
    var styleString = `.gallery-grid .filter:not(.${hash}) {
    display: none;
}`;
    style.textContent = styleString;
    document.head.append(style);
}
