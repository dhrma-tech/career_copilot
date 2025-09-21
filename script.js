document.getElementById('loginForm').addEventListener('submit', function(e) {
  e.preventDefault();
  const name = document.getElementById('name').value;
  const branch = document.getElementById('branch').value;
  const interests = Array.from(document.querySelectorAll('.interests input:checked')).map(i => i.value);
  localStorage.setItem('user', JSON.stringify({ name, branch, interests }));
  window.location.href = 'dashboard.html'; // <-- corrected redirect
});
