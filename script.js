//let studentfullname = prompt("Enter student full name");
//alert("This field cannot be empty. Please try again.");
//let age = prompt("Enter age");
//alert("This field cannot be empty. Please try again.");
//let gender = prompt("Enter gender");
//alert("This field cannot be empty. Please try again.");
//let course = prompt("Enter course");
//alert("This field cannot be empty. Please try again.");
//let marks = prompt("Enter marks");
//alert("This field cannot be empty. Please try again.");


//console.log("studentfullname " + studentfullname);
//console.log("age " + age);
//console.log("gender " + gender);
//console.log("course " + course);
//console.log("marks " + marks);

function getPerformance(marks) {
  if (marks >= 80) return "Excellent";
  else if (marks >= 70) return "Very Good";
  else if (marks >= 60) return "Good";
  else if (marks >= 50) return "Average";
  else return "Failed";
}
