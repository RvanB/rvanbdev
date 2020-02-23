initLetters();

window.onload = function() {
    animateLetters();
}

function initLetters() {
    let letters = document.getElementsByClassName("letter");

    for (let i = 0; i < letters.length; i++) {
        let letter = letters[i];
        let glyph = letter.getAttribute("letter");
        
        letter.innerHTML = "<span>" + glyph + "</span>";
        if (letter.hasAttribute("animated")) {
            letter.firstChild.style.left = "50px";
        }
    }
}

function animateLetters() {
    let letters = document.getElementsByClassName("letter");

    for (let i = 0; i < letters.length; i++) {
        let letter = letters[i];

        if (letter.hasAttribute("animated")) {
            letter.firstChild.style.left = "0px";
        }
    }
}

