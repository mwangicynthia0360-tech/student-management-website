
let students = [];
let nextId = 1;

// Connect to the HTML
const form = document.getElementById("studentForm");
const list = document.getElementById("studentList");
const summary = document.getElementById("summary");


//Save and load 
function save() {
  try {
    localStorage.setItem("students", JSON.stringify(students));
  } catch (e) {}
}

function load() {
  try {
    const saved = JSON.parse(localStorage.getItem("students"));
    if (Array.isArray(saved)) students = saved;
  } catch (e) {}
  nextId = students.reduce((max, s) => Math.max(max, s.id), 0) + 1;
}

// Draw the table
function render() {
  list.innerHTML = "";

  if (students.length === 0) {
    list.innerHTML = '<tr><td colspan="6">No students yet.</td></tr>';
  }

  students.forEach(s => {
    const row = document.createElement("tr");

    [s.name, s.age, s.gender, s.course, s.marks].forEach(value => {
      const cell = document.createElement("td");
      cell.textContent = value;
      row.appendChild(cell);
    });

    const actionCell = document.createElement("td");
    const btn = document.createElement("button");
    btn.textContent = "Delete";
    btn.addEventListener("click", () => deleteStudent(s.id));
    actionCell.appendChild(btn);
    row.appendChild(actionCell);

    list.appendChild(row);
  });

  if (students.length > 0) {
    const total = students.reduce((sum, s) => sum + s.marks, 0);
    summary.textContent =
      students.length + " student(s) · average marks " +
      (total / students.length);
  } else {
    summary.textContent = "";
  }
}


// Add a student (the submit button) 
form.addEventListener("submit", function (event) {
  event.preventDefault();

  const name = document.getElementById("fullName").value.trim();
  const age = Number(document.getElementById("age").value);
  const gender = document.getElementById("gender").value.trim();
  const course = document.getElementById("course").value.trim();
  const marks = Number(document.getElementById("marks").value);

  if (name === "" || gender === "" || course === "") {
    message.textContent = "Please fill in every field.";
    return;
  }
  if (age < 1 || age > 120) {
    message.textContent = "Please enter a valid age.";
    return;
  }
  if (marks < 0 || marks > 100) {
    message.textContent = "Marks must be between 0 and 100.";
    return;
  }

  message.textContent = "";
  students.push({ id: nextId++, name, age, gender, course, marks });
  save();
  render();
  form.reset();
});

// Delete a student 
function deleteStudent(id) {
  students = students.filter(s => s.id !== id);
  save();
  render();
}

//  Search section
const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");
const clearBtn = document.getElementById("clearBtn");
const searchResult = document.getElementById("searchResult");

function searchStudents() {
  const term = searchInput.value.trim().toLowerCase();

  if (term === "") {
    searchResult.textContent = "Please enter a name to search.";
    return;
  }

  const found = students.filter(s => s.name.toLowerCase().includes(term));
  searchResult.innerHTML = "";

  if (found.length === 0) {
    searchResult.textContent = "No student found.";
    return;
  }

  found.forEach(s => {
    const p = document.createElement("p");
    p.textContent = s.name + " | Age " + s.age + " | " + s.gender +
                    " | " + s.course + " | Marks " + s.marks;
    searchResult.appendChild(p);
  });
}

function clearSearch() {
  searchInput.value = "";
  searchResult.innerHTML = "";
}

searchBtn.addEventListener("click", searchStudents);
clearBtn.addEventListener("click", clearSearch);

// Start the app 
load();
render();