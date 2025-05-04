const form = document.getElementById('registrationForm');
const entriesTableBody = document.querySelector('#entriesTable tbody');
const dobInput = document.getElementById('dob');
const dobPicker = document.getElementById('dobPicker');
const datePickerBtn = document.getElementById('datePickerBtn');

// Load entries from localStorage on page load
function loadEntries() {
  const entries = JSON.parse(localStorage.getItem('registrationEntries') || '[]');
  entriesTableBody.innerHTML = '';
  entries.forEach(entry => {
    const newRow = document.createElement('tr');
    newRow.innerHTML = `
      <td>${entry.name}</td>
      <td>${entry.email}</td>
      <td>${entry.password}</td>
      <td>${entry.dob}</td>
      <td>${entry.acceptTerms}</td>
    `;
    entriesTableBody.appendChild(newRow);
  });
}

// Set min and max dates for age between 18 and 55
function setDateConstraints() {
  const today = new Date();
  
  // Max date (18 years ago)
  const maxDate = new Date(today);
  maxDate.setFullYear(today.getFullYear() - 18);
  
  // Min date (55 years ago)
  const minDate = new Date(today);
  minDate.setFullYear(today.getFullYear() - 55);
  
  // Set the attributes
  dobPicker.max = maxDate.toISOString().split('T')[0];
  dobPicker.min = minDate.toISOString().split('T')[0];
}

// Initialize date constraints and load entries
setDateConstraints();
loadEntries();

// Set up the date picker button
datePickerBtn.addEventListener('click', function() {
  dobPicker.showPicker();
});

// When date is picked from calendar, format it and update the text field
dobPicker.addEventListener('change', function() {
  const selectedDate = new Date(dobPicker.value);
  const day = String(selectedDate.getDate()).padStart(2, '0');
  const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
  const year = selectedDate.getFullYear();
  
  dobInput.value = `${day}/${month}/${year}`;
});

// Parse date string in DD/MM/YYYY format
function parseDateString(dateStr) {
  const parts = dateStr.split('/');
  if (parts.length !== 3) return null;
  
  const day = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10) - 1; // JS months are 0-indexed
  const year = parseInt(parts[2], 10);
  
  return new Date(year, month, day);
}

// Validate email format
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Validate age is between 18 and 55
function isValidAge(birthDate) {
  const today = new Date();
  const age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    return age - 1 >= 18 && age - 1 <= 55;
  }
  return age >= 18 && age <= 55;
}

// Form submission handler
form.addEventListener('submit', function(event) {
  event.preventDefault();

  // Get form values
  const name = document.getElementById('name').value;
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const dateStr = dobInput.value;
  const birthDate = parseDateString(dateStr);
  const acceptTerms = document.getElementById('acceptTerms').checked;

  // Validate email
  if (!isValidEmail(email)) {
    alert('Please enter a valid email address');
    return;
  }

  // Validate age
  if (!birthDate || !isValidAge(birthDate)) {
    alert('Age must be between 18 and 55 years');
    return;
  }

  // Format the date as YYYY-MM-DD for the table display
  const formattedDate = birthDate.toISOString().split('T')[0];

  // Create new entry
  const newEntry = {
    name,
    email,
    password,
    dob: formattedDate,
    acceptTerms
  };

  // Get existing entries from localStorage
  const entries = JSON.parse(localStorage.getItem('registrationEntries') || '[]');
  
  // Add new entry
  entries.push(newEntry);
  
  // Save to localStorage
  localStorage.setItem('registrationEntries', JSON.stringify(entries));

  // Add to table
  const newRow = document.createElement('tr');
  newRow.innerHTML = `
    <td>${name}</td>
    <td>${email}</td>
    <td>${password}</td>
    <td>${formattedDate}</td>
    <td>${acceptTerms}</td>
  `;

  entriesTableBody.appendChild(newRow);

  // Reset form
  form.reset();
}); 