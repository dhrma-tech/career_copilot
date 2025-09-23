document.getElementById('visionForm').addEventListener('submit', function(e) {
  e.preventDefault();
  const vision = document.getElementById('vision-input').value;

  if (vision.trim() === '') {
    alert('Please define your vision.');
    return;
  }

  // Save the vision to localStorage
  localStorage.setItem('user_vision', vision);

  // Redirect to the dashboard
  window.location.href = 'dashboard.html';
});
