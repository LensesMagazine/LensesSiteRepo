var pieceClass = "none";
var pieceId = "none";
var pieceData;
const visTemplate = `
<div id="fullscreenPiece">
<img id="pieceImage" src="[VISLINK]" alt="Fullscreen Image of [PIECENAME]"/>
</div>
`;
const mvTemplate = `
<div id="fullscreenPiece">
<video id="pieceImage" controls alt="Fullscreen Video of [PIECENAME]">
    <source src="[VISLINK]" type="video/mp4">
</video>
</div>
`;
const litTemplate = 
//<iframe id="pieceFrame" src="[VISLINK]" alt="[PIECENAME]"></iframe>
`<embed id="pieceFrame" src="[VISLINK]#toolbar=0&navpanes=0&scrollbar=0" type="application/pdf"/>`;
const infoTemplate = `
<div id="titleAndAuthor">
    <h1 id="pieceTitle">[PIECENAME]</h1>
    <h3 id="pieceAuthor">by [PIECEAUTHOR]</h3>
</div>
<div id="pieceDesc">
    <p>[PIECEDESC]</p>
</div>
`;

function loadPiece() {
    let splitURL = window.location.href.split("/");
    pieceClass = splitURL[splitURL.length - 2];
    pieceId = (new URLSearchParams(window.location.search)).get("id");

    const http = new XMLHttpRequest();
    const url = "https://us-central1-lensesmagazine-a8639.cloudfunctions.net/dbreadkey";
    http.open("GET", url);
    http.setRequestHeader("class","active/"+pieceClass);
    http.setRequestHeader("postkey",pieceId);
    http.send();
    http.onreadystatechange = (e) => {
        if (http.readyState==4 && http.status==200) {
            pieceData = JSON.parse(http.responseText);
            renderPiece();
        }
    }
}

function getExportableLink(link) {
    var http = new XMLHttpRequest();
    http.open("GET", link);
    http.send();
    http.onreadystatechange = (e) => {
        if (http.readyState==4 && http.status==200) {
            console.log(http.getResponseHeader("Content-Type"));
        }
    }
}

function renderPiece() {
    if (pieceClass == "vis") {
        var links = pieceData.docID.split(",");
        for (var link in links) {
            var imgLink = "https://drive.google.com/uc?export=view&id=" + links[link];
            document.getElementById("mainView").innerHTML += visTemplate.replace("[VISLINK]",imgLink).replace("[PIECENAME]",pieceData.title);
        }

        document.getElementById("pieceInfo").innerHTML = infoTemplate.replace("[PIECENAME]",pieceData.title).replace("[PIECEAUTHOR]",pieceData.author).replace("[PIECEDESC]",pieceData.desc);
    }
    else if (pieceClass == "mv") {
        var links = pieceData.docID.split(",");
        for (var link in links) {
            var imgLink = "https://drive.google.com/uc?export=view&id=" + links[link];
            var exportableLink = getExportableLink(imgLink);
            document.getElementById("mainView").innerHTML = mvTemplate.replace("[VISLINK]",imgLink).replace("[PIECENAME]",pieceData.title);
        }

        document.getElementById("pieceInfo").innerHTML = infoTemplate.replace("[PIECENAME]",pieceData.title).replace("[PIECEAUTHOR]",pieceData.author).replace("[PIECEDESC]",pieceData.desc);
    } else if (pieceClass == "lit" || pieceClass =="art") {
        var links = pieceData.docID.split(",");
        for (var link in links) {
            if (pieceData.useEmbed == "useEmbed") {
            document.getElementById("litView").innerHTML += litTemplate.replace("[VISLINK]","https://docs.google.com/document/d/"+links[link]+"/pub?embedded=true").replace("[PIECENAME]",pieceData.title);
            } else {
            document.getElementById("litView").innerHTML += litTemplate.replace("[VISLINK]","https://drive.google.com/uc?export=view&id="+links[link]+"").replace("[PIECENAME]",pieceData.title);
            }
        }
        document.getElementById("litInfo").innerHTML = infoTemplate.replace("[PIECENAME]",pieceData.title).replace("[PIECEAUTHOR]",pieceData.author).replace("[PIECEDESC]",pieceData.desc);
    }
}