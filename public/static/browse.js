var databaseData = [];
var currentClass = "none";
var focusedIndex = 0;
var isRunning = false;
var isKeyRunning = false;
var previewTemplate = 
`<div class="preview [ANIMATION]" id="[PIECEID]" onclick="[FUNCTION]">
<div class="previewimage">
  <img src="[PREVIEWLINK]" alt="Preview of [PIECENAME]">
</div>
<hr class="divider" />
<div class="previewtext">
  <h1 class="piecename">[PIECENAME] by [PIECEAUTHOR]</h1>
  <p class="piecedesc">[PIECEDESC]</p>
</div>
</div>`;
const litTemplate = 
`<div class="preview [ANIMATION]" id="[PIECEID]" onclick="[FUNCTION]">
<div class="previewtext">
  <h1 class="piecename">[PIECENAME] by [PIECEAUTHOR]</h1>
  <hr class="divider" />
  <p class="piecedesc">[PIECEDESC]</p>
</div>
</div>`;
var mainbody;

function loadSubmissions(subClass) {
    databaseData = [];
    currentClass = subClass; 
    const http = new XMLHttpRequest();
    const url = "https://us-central1-lensesmagazine-a8639.cloudfunctions.net/dbreadall"; 
    http.open("GET", url);
    http.setRequestHeader("class","active/"+subClass);
    http.send();
    http.onreadystatechange = (e) => {
        if(http.readyState==4 && http.status==200) {
            databaseData = JSON.parse(http.responseText);
            if ((new URLSearchParams(window.location.search)).get("p") != null) {
                target_ID = (new URLSearchParams(window.location.search)).get("p");
                let entries = Object.entries(databaseData);
                for (var i=0; i < entries.length; i++) {
                    if (entries[i][0] == target_ID) {
                        console.log("found " + entries[i][0] + " at " + i);
                        focusedIndex = i;
                        break;
                    }
                }
                renderPieces(i,"up");
            } else {
                renderPieces(0,"up");
            }
        }
    }
}

function submissionHTML(id) {
    var pieceLink = "https://drive.google.com/uc?export=view&id=";
    if (databaseData[id].docID.indexOf(",") > 0) {
        pieceLink += databaseData[id].docID.split(",")[0];
    } else {
        pieceLink += databaseData[id].docID;
    }


    return previewTemplate.replace("[PIECEID]",id).replace("[PREVIEWLINK]",pieceLink).replace("[PIECENAME]",databaseData[id].title).replace("[PIECENAME]",databaseData[id].title).replace("[PIECEAUTHOR]",databaseData[id].author).replace("[PIECEDESC]",databaseData[id].desc);
}

function renderPieces(centerPieceIndex, direction) {
    var ID_LIST = Object.keys(databaseData);
    var cpi = centerPieceIndex;
    var topPiece = "";
    if (cpi > 0) {
        topPiece = submissionHTML(ID_LIST[cpi-1]).replace("[ANIMATION]",(direction=="up" ? "center2top" : "off2top")).replace("[FUNCTION]","goPrev();");
    }
    var centerPiece = submissionHTML(ID_LIST[cpi]).replace("[ANIMATION]",(direction=="up" ? "bottom2center" : "top2center")).replace("[FUNCTION]","window.location.href=\'/v/"+currentClass+"/?id="+ID_LIST[cpi]+"\'\;");
    var bottomPiece = "";
    if (cpi < ID_LIST.length-1) {
        bottomPiece = submissionHTML(ID_LIST[cpi+1]).replace("[ANIMATION]",(direction=="up" ? "off2bottom" : "center2bottom")).replace("[FUNCTION]","goNext();");
    }
    mainbody.innerHTML = topPiece + centerPiece + bottomPiece;
}

function goNext() {
    if (focusedIndex < Object.keys(databaseData).length-1) {
        focusedIndex++;
        renderPieces(focusedIndex,"up");
    }
}
function goPrev() {
    if (focusedIndex > 0) {
        focusedIndex--;
        renderPieces(focusedIndex,"down");
    }
}
var keyEvent = (event) => {
    if (isKeyRunning) return;
    isKeyRunning = true;
    switch (event.key) {
        case "ArrowDown":
            goNext();
            break;
        case "ArrowUp":
            goPrev();
            break;
        default:
            return;
    }
    window.removeEventListener("keydown", keyEvent);
    setTimeout(() => {
        window.addEventListener("keydown", keyEvent);
        isKeyRunning = false;
    }, 500);
};

window.addEventListener("keydown",keyEvent,true,);

var mouseEvent = (event) => {
    if (isRunning) return;
    isRunning = true;
    const elements = document.querySelectorAll('.previewtext');
    var isOver = false;
    elements.forEach((element) => {
        if (element.contains(event.target)) {
            isOver = true;
        }
    });
    if (!isOver) {
        if (event.deltaY > 0) {
            goNext();
        } else {
            goPrev();
        }
        window.removeEventListener("wheel", mouseEvent);
        setTimeout(() => {
            window.addEventListener("wheel", mouseEvent);
            isRunning = false;
        }, 200);
    } else {
        isRunning = false;
    }
};
window.addEventListener("wheel", mouseEvent);

let touchstartY = 0
let touchendY = 0
    
function checkDirection() {
if (touchendY < touchstartY && (touchstartY-touchendY > 100)) goNext();
if (touchendY > touchstartY  && (touchendY-touchstartY > 100)) goPrev();
}

document.addEventListener('touchstart', e => {
touchstartY = e.changedTouches[0].screenY;
});

document.addEventListener('touchend', e => {
touchendY = e.changedTouches[0].screenY;
checkDirection();
});

function a(artClass) {
    if (artClass=="lit" || artClass=="art") {
        previewTemplate = litTemplate;
    }
    mainbody = document.getElementById("mainBody");
    currentClass=artClass;
    loadSubmissions(artClass);
}