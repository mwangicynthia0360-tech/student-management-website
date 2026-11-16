let studentfullname = prompt("Enter student full name");
alert("This field cannot be empty. Please try again.");
let course = prompt("Enter course");
alert("This field cannot be empty. Please try again.");
let marks = prompt("Enter marks");
alert("This field cannot be empty. Please try again.");


console.log("studentfullname " + studentfullname);
console.log("course " + course);
console.log("marks " + marks);

function getPerformance(marks) {
  if (marks >= 80) return "Excellent";
  else if (marks >= 70) return "Very Good";
  else if (marks >= 60) return "Good";
  else if (marks >= 50) return "Average";
  else return "Failed";
}

function getPerformanceClass(performance) {
  return "perf-" + performance.toLowerCase().replace(" ", "-");
}

let searchText = "";

let students = JSON.parse(localStorage.getItem("students")) || [];


let nextId = students.length > 0 ? Math.max(...students.map(s => s.id)) + 1 : 1;

function saveStudents() {
  localStorage.setItem("students", JSON.stringify(students));
}

function showMessage(element, text, type) {
  if (!element) return;
  element.textContent = text;
  element.className = "message " + type; 
}
const studentForm = document.getElementById("Form");
const formMessage = document.getElementById("formMessage");
const tableBody = document.getElementById("studentTable");
const searchInput = document.getElementById("searchInput");
const searchMessage = document.getElementById("searchMessage");
const clearAllBtn = document.getElementById("clearAllBtn");

function getVisibleStudents() {
  let list = students.filter(function (student) {
    const matchesName = student.name.toLowerCase().includes(searchText.toLowerCase());
    const matchesCourse = selectedCourse === "All" || student.course === selectedCourse;
    return matchesName && matchesCourse;
  });

  if (sortHighToLow) {
    list = list.slice().sort((a, b) => b.marks - a.marks);
  }
  return list;
}

function displayStudents(){
  if (!tableBody) return; // this page has no table
  const list = getVisibleStudents();
  tableBody.innerHTML = "";
}
  // Message when nothing is found
  if (list.length === 0) {
    const text = students.length === 0 ? "No students registered yet." : "No matching student found.";
    tableBody.innerHTML = '<tr><td colspan="7">' + text + "</td></tr>";
    showMessage(searchMessage, searchText || selectedCourse !== "All" ? "No matching student found." : "", "error");
    return;
  }
  showMessage(searchMessage, "", "");

  for (let i = 0; i < list.length; i++) {
    const student = list[i];
    const performance = getPerformance(student.marks);

    const row = document.createElement("tr");
    row.innerHTML =
      "<td>" + escapeHTML(student.name) + "</td>" +
      "<td>" + student.age + "</td>" +
      "<td>" + student.gender + "</td>" +
      "<td>" + student.course + "</td>" +
      "<td>" + student.marks + "</td>" +
      '<td><span class="badge ' + getPerformanceClass(performance) + '">' + performance + "</span></td>" +
      "<td>" +
      '<button class="btn-update" data-id="' + student.id + '">Update</button> ' +
      '<button class="btn-delete" data-id="' + student.id + '">Delete</button>' +
      "</td>";
    tableBody.appendChild(row);
  }

function updateStatistics() {
  const total = students.length;
  let passed = 0;
  let failed = 0;
  let sum = 0;
  const counts = { "Excellent": 0, "Very Good": 0, "Good": 0, "Average": 0, "Failed": 0 };
  let highest = null;
  let lowest = null;

  for (let i = 0; i < students.length; i++) {
    const s = students[i];
    sum += s.marks;
    if (s.marks >= 50) passed++; else failed++;
    counts[getPerformance(s.marks)]++;
    if (highest === null || s.marks > highest.marks) highest = s;
    if (lowest === null || s.marks < lowest.marks) lowest = s;
  }

  const average = total > 0 ? (sum / total).toFixed(1) : 0;

  setText("totalStudents", total);
  setText("passedStudents", passed);
  setText("failedStudents", failed);
  setText("averageMarks", average);
  setText("highestStudent", highest ? highest.name + " (" + highest.marks + ")" : "-");
  setText("lowestStudent", lowest ? lowest.name + " (" + lowest.marks + ")" : "-");

  setText("countExcellent", counts["Excellent"]);
  setText("countVeryGood", counts["Very Good"]);
  setText("countGood", counts["Good"]);
  setText("countAverage", counts["Average"]);
  setText("countFailed", counts["Failed"]);
}
function refreshPage() {
  displayStudents();
  updateStatistics();
}

if (studentForm) {
  studentForm.addEventListener("submit", function (event) {
    event.preventDefault(); // stop the page from reloading

    const name = document.getElementById("fullName").value.trim();
    const age = Number(document.getElementById("age").value);
    const gender = document.getElementById("gender").value;
    const course = document.getElementById("course").value;
    const marksValue = document.getElementById("marks").value.trim();
    const marks = Number(marksValue);

    
    if (name === "" || gender === "" || course === "" || marksValue === "" || document.getElementById("age").value === "") {
      showMessage(formMessage, "Please fill in all fields.", "error");
      return;
    }
    if (isNaN(age) || age < 1 || age > 120) {
      showMessage(formMessage, "Age must be a valid number.", "error");
      return;
    }
    if (isNaN(marks) || marks < 0 || marks > 100) {
      showMessage(formMessage, "Marks must be between 0 and 100.", "error");
      return;
    }

    
    const newStudent = { id: nextId, name: name, age: age, gender: gender, course: course, marks: marks };
    nextId++;
    students.push(newStudent);

    saveStudents();
    refreshPage();
    studentForm.reset();
    showMessage(formMessage, name + " was registered successfully!", "success");
  });
}
if (searchInput) {
  searchInput.addEventListener("input", function () {
    searchText = searchInput.value.trim();
    displayStudents();
  });
}

if (tableBody) {
  tableBody.addEventListener("click", function (event) {
    const id = Number(event.target.getAttribute("data-id"));
    if (!id) return;

    // DELETE
    if (event.target.classList.contains("btn-delete")) {
      const sure = confirm("Are you sure you want to delete this student?");
      if (sure) {
        students = students.filter(s => s.id !== id);
        saveStudents();
        refreshPage();
      }
    }

    
    if (event.target.classList.contains("btn-update")) {
      const input = prompt("Enter the new marks (0 - 100):");
      if (input === null) return; // user pressed Cancel
      const newMarks = Number(input);

      if (input.trim() === "" || isNaN(newMarks) || newMarks < 0 || newMarks > 100) {
        alert("Invalid marks. Enter a number between 0 and 100.");
        return;
      }
      const student = students.find(s => s.id === id);
      student.marks = newMarks;
      saveStudents();
      refreshPage();
    }
  });
}

const contactForm = document.getElementById("contactForm");
const contactFeedback = document.getElementById("contactFeedback");

if (contactForm) {
  contactForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const name = document.getElementById("contactName").value.trim();
    const email = document.getElementById("contactEmail").value.trim();
    const subject = document.getElementById("contactSubject").value.trim();
    const message = document.getElementById("contactMessage").value.trim();

    if (name === "" || email === "" || subject === "" || message === "") {
      showMessage(contactFeedback, "All fields are required.", "error");
      return;
    }
    // email must contain @ and a dot after it
    if (!email.includes("@") || !email.includes(".") || email.indexOf("@") > email.lastIndexOf(".")) {
      showMessage(contactFeedback, "Please enter a valid email address.", "error");
      return;
    }
    if (message.length < 10) {
      showMessage(contactFeedback, "Message must be at least 10 characters long.", "error");
      return;
    }

    showMessage(contactFeedback, "Thank you, your message has been sent.", "success");
    contactForm.reset();
  });
}

