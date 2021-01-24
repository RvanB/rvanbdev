initLetters();

function hoverLetters() {
    let letters = document.getElementsByClassName("letter");
    
    for (let i = 0; i < letters.length; i++) {
        let letter = letters[i];
        letter.style.backgroundColor = "yellow";
    }
}

function getRowString(row) {
    let string = "";
    for (let i = 0; i < row.children.length; i++) {
        string = string + row.children[i].firstChild.innerHTML;
    }
    return string;
}

function kern() {
    let kerningCalculator = document.getElementById("kerningCalculator");
    let rows = document.getElementsByClassName("letterRow");

    for (let i = 0; i < rows.length; i++) {
        let row = rows[i];
        let string = getRowString(row);
        kerningCalculator.innerHTML = string[0];
        let totalWidth = kerningCalculator.offsetWidth;
        for (let j = 0; j < row.children.length - 1; j++) {
            kerningCalculator.innerHTML = string[j];
            let aWidth = kerningCalculator.offsetWidth;
            
            kerningCalculator.innerHTML = string[j + 1];
            let bWidth = kerningCalculator.offsetWidth;

            kerningCalculator.innerHTML = string.substring(j, j + 2);
            let kernedWidth = kerningCalculator.offsetWidth;

            let bMarginLeft = kernedWidth - (aWidth + bWidth);
            row.children[j + 1].style.marginLeft = bMarginLeft + "px";

            totalWidth = totalWidth + bWidth;
        }
        row.style.width = totalWidth + "px";
    }

    kerningCalculator.parentNode.removeChild(kerningCalculator);
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
    kern();
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

window.onload = function() {

    totalHeight = document.getElementsByTagName("header")[0].offsetHeight + document.getElementById("projectList").offsetHeight + document.getElementsByClassName("list")[1].offsetHeight;
    
    document.getElementById("projectListContainer").style.height = "calc(100% - 3em - " + (document.getElementsByTagName("header")[0].offsetHeight + document.getElementsByClassName("list")[1].offsetHeight) + "px)";

    if (totalHeight > window.innerHeight) {
        height = "calc(100% - 2em - " + (document.getElementsByTagName("header")[0].offsetHeight + document.getElementsByClassName("list")[1].offsetHeight) + "px)";
        $("#projectList").slimScroll({
            color: "white",
            position: "left",
            start: "top",
            size: "8px",
            alwaysVisible:true,
            wheelStep: 10,
            touchScrollStep: 3000,
            height: "auto"
        });
    }
    animateLetters();
}

