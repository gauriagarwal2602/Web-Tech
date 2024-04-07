 console.log("Welcome to notes app. This is app.js");
showNotes();
function updateClock() {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const seconds = now.getSeconds().toString().padStart(2, '0');
  
    const clockDisplay = `${hours}:${minutes}:${seconds}`;
    document.getElementById('clock').innerText = clockDisplay;
  }
  
  function updateClockEverySecond() {
    updateClock();
    setInterval(updateClock, 1000);
  }
  
  updateClockEverySecond();
    let isEditing=false;
    function addNote() {
    if (isEditing) {
        return;
    }
    let addTxt = document.getElementById("addTxt");
    let notes = localStorage.getItem("notes");
    let timestamp = new Date().toLocaleString();
    if (notes == null) {
        notesObj = [];
    } else {
        notesObj = JSON.parse(notes);
    }
    if (addTxt.value.trim() === "") {
        return;
    }
    if (notesObj.length >= 25) {
        alert("You can only add up to 25 notes.");
        addTxt.value = "";
        return;
    }
    const existingNote = notesObj.find(note => note.text.trim() === addTxt.value.trim());
    if (existingNote) {
        alert("This note already exists.");
        addTxt.value = "";
        return; 
    }
    let newNote = {
        text: addTxt.value,
        timestamp: timestamp
    };
    notesObj.push(newNote);
    localStorage.setItem("notes", JSON.stringify(notesObj));
    addTxt.value = "";
    console.log(notesObj);
    showNotes();
}
function editNote(timestamp) {
    let notes = localStorage.getItem("notes");
    if (notes == null) {
        notesObj = [];
    } else {
        notesObj = JSON.parse(notes);
    }
    let editIndex = notesObj.findIndex(n => n.timestamp === timestamp);
    if (editIndex !== -1) {
        const { text } = notesObj[editIndex];
        document.getElementById("addTxt").value = text;
        document.getElementById("addBtn").innerHTML = `<span class="material-symbols-outlined">upgrade</span>`;
        // innerText = "Save Changes";
        isEditing= true;
        document.getElementById("addBtn").addEventListener("click", function saveChanges() {
            const updatedText = document.getElementById("addTxt").value;
            const newTimestamp = new Date().toLocaleString();
            notesObj[editIndex].text = updatedText;
            notesObj[editIndex].timestamp = newTimestamp;
            
            localStorage.setItem("notes", JSON.stringify(notesObj));
            document.getElementById("addTxt").value = "";
            document.getElementById("addBtn").innerHTML = `<span class="material-symbols-outlined">
            add
            </span>`;
            document.getElementById("addBtn").removeEventListener("click", saveChanges);
            isEditing = false;
            showNotes();
        });
    } else {
        console.error("Note not found for editing.");
    }
}

function showNotes() {
    let notes = localStorage.getItem("notes");
    if (notes == null) {
        notesObj = [];
    } else {
        notesObj = JSON.parse(notes);
    }
    notesObj.sort((a, b) => {
        return new Date(b.timestamp) - new Date(a.timestamp);
    });
    let html = "";
    notesObj.forEach(function (element, index) {
        html += `
                    <div class="noteCard my-2 mx-2 card card" style="width: 18rem;">
                        <div class="card-body">
                            <h5 class="card-title"><center>Note ${index + 1}</center></h5>
                            <p class="card-text">${element.text}</p> 
                            <p class="card-text">Added On: ${element.timestamp}</p>
                            <button id="${index}" onclick="deleteNote('${element.timestamp}')" class="btn btn-primary"><span class="material-symbols-outlined">
                            delete
                            </span></button>
                            <button id="${index}" onclick="editNote('${element.timestamp}')" class="btn btn-secondary"><span class="material-symbols-outlined">
                            edit
                            </span></button>
                        </div>
                    </div>`;
    });
    let notesElm = document.getElementById("notes");
    if (notesObj.length != 0) {
        notesElm.innerHTML = html;
    } else {
        notesElm.innerHTML = `Nothing to show! Use "Add a Note" section above to add notes.`;
    }
}

function deleteNote(timestamp) {
    let notes = localStorage.getItem("notes");
    if (notes == null) {
        notesObj = [];
    } else {
        notesObj = JSON.parse(notes);
    }
    let deleteIndex = notesObj.findIndex(n => n.timestamp === timestamp);

    if (deleteIndex !== -1) {
        notesObj.splice(deleteIndex, 1);
        localStorage.setItem("notes", JSON.stringify(notesObj));
        showNotes();
    } else {
        console.error("Note not found for deletion.");
    }
}

let search = document.getElementById('searchTxt');
search.addEventListener("input", function(){

    let inputVal = search.value.toLowerCase();
    let noteCards = document.getElementsByClassName('noteCard');
    Array.from(noteCards).forEach(function(element){
        let cardTxt = element.getElementsByTagName("p")[0].innerText;
        if(cardTxt.includes(inputVal)){
            element.style.display = "block";
        }
        else{
            element.style.display = "none";
        }
    })
})
const daysTag = document.querySelector(".days"),
currentDate = document.querySelector(".current-date"),
prevNextIcon = document.querySelectorAll(".icons span");

let date = new Date(),
currYear = date.getFullYear(),
currMonth = date.getMonth();

const months = ["January", "February", "March", "April", "May", "June", "July",
              "August", "September", "October", "November", "December"];

const renderCalendar = () => {
    let firstDayofMonth = new Date(currYear, currMonth, 1).getDay(), 
    lastDateofMonth = new Date(currYear, currMonth + 1, 0).getDate(), 
    lastDayofMonth = new Date(currYear, currMonth, lastDateofMonth).getDay(),
    lastDateofLastMonth = new Date(currYear, currMonth, 0).getDate(); 
    let liTag = "";

    for (let i = firstDayofMonth; i > 0; i--) { 
        liTag += `<li class="inactive">${lastDateofLastMonth - i + 1}</li>`;
    }

    for (let i = 1; i <= lastDateofMonth; i++) { 
        let isToday = i === date.getDate() && currMonth === new Date().getMonth() 
                     && currYear === new Date().getFullYear() ? "active" : "";
        liTag += `<li class="${isToday}">${i}</li>`;
    }

    for (let i = lastDayofMonth; i < 6; i++) { 
        liTag += `<li class="inactive">${i - lastDayofMonth + 1}</li>`
    }
    currentDate.innerText = `${months[currMonth]} ${currYear}`;    
    daysTag.innerHTML = liTag;
}
renderCalendar();

prevNextIcon.forEach(icon => {     
    icon.addEventListener("click", () => { 
        currMonth = icon.id === "prev" ? currMonth - 1 : currMonth + 1;

        if(currMonth < 0 || currMonth > 11) { 
            date = new Date(currYear, currMonth, new Date().getDate());
            currYear = date.getFullYear();
            currMonth = date.getMonth(); 
        } else {
            date = new Date(); 
        }
        renderCalendar();
    });
});
