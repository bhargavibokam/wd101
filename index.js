const form = document.getElementById("registrationForm");
const tableBody = document.querySelector("#userTable tbody");

function isValidAge(dobStr) {
  const dob = new Date(dobStr);
  const today = new Date();
  const age = today.getFullYear() - dob.getFullYear();
  const m = today.getMonth() - dob.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
    return age - 1 >= 18 && age - 1 <= 55;
  }
  return age >= 18 && age <= 55;
}

function loadData() {
  const entries = JSON.parse(localStorage.getItem("users") || "[]");
  tableBody.innerHTML = "";
  entries.forEach(addToTable);
}

function addToTable(user) {
  const row = document.createElement("tr");
  row.innerHTML = `
    <td>${user.name}</td>
    <td>${user.email}</td>
    <td>${user.password}</td>
    <td>${user.dob}</td>
    <td>${user.acceptedTerms}</td>
  `;
  tableBody.appendChild(row);
}

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();
  const dob = document.getElementById("dob").value;
  const acceptedTerms = document.getElementById("acceptTerms").checked;

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    alert("Enter a valid email address.");
    return;
  }

  if (!isValidAge(dob)) {
    alert("Age must be between 18 and 55.");
    return;
  }

  const user = { name, email, password, dob, acceptedTerms };
  const existing = JSON.parse(localStorage.getItem("users") || "[]");
  existing.push(user);
  localStorage.setItem("users", JSON.stringify(existing));

  addToTable(user);
  form.reset();
});


function getTodaysEntries() {
  const today = new Date().toISOString().split('T')[0]; // "YYYY-MM-DD"
  const entries = JSON.parse(localStorage.getItem("users") || "[]");

  const todaysEntries = entries.filter(entry => entry.dob === today);

  if (todaysEntries.length === 0) {
    return "";
  }

  return todaysEntries.map(entry => entry.name).join(", ");
}

window.getTodaysEntries = getTodaysEntries;

window.onload = loadData;