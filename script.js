document.getElementById('loginForm').addEventListener('submit', function(e) {
  e.preventDefault();
  const name = document.getElementById('name').value;
  const branch = document.getElementById('branch').value;
  const interests = document.getElementById('interests').value;

  // Basic validation to ensure fields are not empty
  if (name.trim() === '' || branch.trim() === '' || interests.trim() === '') {
    alert('Please fill out all fields.');
    return;
  }

  const user = { name, branch, interests };
  localStorage.setItem('user', JSON.stringify(user));

  window.location.href = 'dashboard.html';
});
