// ==Data ==
let students = [];
let nextId = 1;

// ==Connect to the HTML ==
const form = document.getElementById("studentForm");
const list = document.getElementById("studentList");
const searchBox = document.getElementById("search");
const summary = document.getElementById("summary");
const message = document.getElementById("message");

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

// ==Draw the table and the summary ==
function render() {
  const term = searchBox.value.trim().toLowerCase();

  const shown = students.filter(s =>
    s.name.toLowerCase().includes(term) ||
    s.course.toLowerCase().includes(term)
  );

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

