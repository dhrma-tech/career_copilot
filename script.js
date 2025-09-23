document.addEventListener('DOMContentLoaded', () => {
  // Modal Handling
  const modal = document.getElementById('login-modal');
  const loginNavBtn = document.getElementById('login-nav-btn');
  const getStartedBtn = document.getElementById('get-started-btn');
  const closeModalBtn = document.querySelector('.modal-close-btn');

  const openModal = () => {
    modal.classList.remove('hidden');
  };

  const closeModal = () => {
    modal.classList.add('hidden');
  };

  loginNavBtn.addEventListener('click', openModal);
  getStartedBtn.addEventListener('click', openModal);
  closeModalBtn.addEventListener('click', closeModal);
  
  // Close modal if user clicks on the overlay
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeModal();
    }
  });

  // Form Submission Handling
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
});
