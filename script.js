// ==Data ==
let students = [];
let nextId = 1;

// ==Connect to the HTML ==
const form = document.getElementById("studentForm");
const list = document.getElementById("studentList");


// ==Save and load ==
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
// == Search section ==
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

  const found = students.filter(s =>
    s.name.toLowerCase().includes(term)
  );

  searchResult.innerHTML = "";

  if (found.length === 0) {
    searchResult.textContent = "No student found.";
    return;
  }

  found.forEach(s => {
    const p = document.createElement("p");
    p.textContent =
      s.name + " | " + s.course + " | Age " + s.age + " | Grade " + s.grade;
    searchResult.appendChild(p);
  });
}

function clearSearch() {
  searchInput.value = "";
  searchResult.innerHTML = "";
}

searchBtn.addEventListener("click", searchStudents);
clearBtn.addEventListener("click", clearSearch);

// ==Draw the table and the summary ==
function render() {
  const shown = students;

  list.innerHTML = "";

  if (shown.length === 0) {
    list.innerHTML = '<tr><td colspan="5">No students found.</td></tr>';
  }

  shown.forEach(s => {
    const row = document.createElement("tr");

    [s.name, s.course, s.age, s.grade].forEach(value => {
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
    const total = students.reduce((sum, s) => sum + s.grade, 0);
    summary.textContent =
      students.length + " student(s) · average grade " +
      (total / students.length).toFixed(1);
  } else {
    summary.textContent = "";
  }
}



// ==Delete a student ==
function deleteStudent(id) {
  students = students.filter(s => s.id !== id);
  save();
  render();
}

