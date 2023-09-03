var expanded = false;

function dropdown() {
    document.getElementById("downArrow").classList = "spin";
    document.getElementById("mobileNavbar").classList = "dropnav";
    document.getElementById("mobileLinks").classList = "showlinks";
}
function dropup() {
    document.getElementById("downArrow").classList = "spinback";
    document.getElementById("mobileNavbar").classList = "notdropnav";
    document.getElementById("mobileLinks").classList = ""; 
    document.getElementById("mobileLinks").height = "0%";
}

function toggleDrop() {
    if (expanded) {
        dropup();
    } else {
        dropdown();
    }
    expanded = !expanded;
}