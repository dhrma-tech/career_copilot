const user = JSON.parse(localStorage.getItem('user'));

if (!user) {
  // If no user data, redirect to login page
  window.location.href = './index.html';
} else {
  // If user data exists, proceed with setting up the dashboard
  document.getElementById('welcome').innerText = `Welcome, ${user.name}!`;

  // Your existing dashboard code...
  // Dark mode toggle
  document.getElementById('darkModeToggle').onclick = () => {
    document.body.classList.toggle('dark-mode');
  };

// Show initial tab
showTab('courses');

// Welcome modal
const modal = document.getElementById('welcomeModal');
const modalName = document.getElementById('modalName');
modalName.textContent = user.name;
document.getElementById('closeModal').onclick = () => {
  modal.style.display = 'none';
};

function showTab(tab) {
  const content = document.getElementById('content');
  window.scrollTo({ top: 0, behavior: 'smooth' });

  // Highlight active tab
  document.querySelectorAll('.tabs button').forEach(btn => btn.classList.remove('active'));
  document.querySelector(`.tabs button[onclick="showTab('${tab}')"]`).classList.add('active');

  content.style.opacity = 0;
  setTimeout(() => {
    content.innerHTML = '';

    if (tab === 'courses') {
      const courses = [
        { title: 'Python Basics', desc: 'Learn Python syntax, variables, loops, functions.' },
        { title: 'ML with Scikit-learn', desc: 'Hands-on Machine Learning models using Python.' },
        { title: 'Deep Learning with TensorFlow', desc: 'Build neural networks and deep learning models.' },
        { title: 'Data Visualization', desc: 'Learn Matplotlib, Seaborn, and visual storytelling.' }
      ];

      courses.forEach(c => {
        const card = document.createElement('div');
        card.className = 'card courses';
        card.innerHTML = `<h3><i class="fas fa-graduation-cap"></i> ${c.title}</h3><p>${c.desc}</p>`;
        content.appendChild(card);
      });
    }

    if (tab === 'roadmap') {
      const roadmap = ['Python', 'Statistics & Math', 'ML Basics', 'Deep Learning', 'Projects & Deployment', 'Advanced AI Topics'];

      roadmap.forEach((step, index) => {
        const card = document.createElement('div');
        card.className = 'card roadmap';
        card.innerHTML = `
          <strong><i class="fas fa-map-signs"></i> Step ${index+1}:</strong> ${step}
          <div class="progress-container">
            <div class="progress-bar" style="width: ${(index+1)/roadmap.length*100}%"></div>
          </div>
        `;
        content.appendChild(card);
      });
    }

    if (tab === 'tasks') {
      let tasks = JSON.parse(localStorage.getItem('tasks') || '[]');

      const inputContainer = document.createElement('div');
      inputContainer.style.display = 'flex';
      inputContainer.style.marginBottom = '1rem';

      const input = document.createElement('input');
      input.placeholder = 'New Task';
      input.style.flex = '1';
      input.style.padding = '0.5rem';
      input.style.borderRadius = '8px';
      input.style.border = '1px solid #ccc';
      input.style.marginRight = '0.5rem';

      const btn = document.createElement('button');
      btn.textContent = 'Add';
      btn.onclick = () => {
        if (input.value.trim() !== '') {
          tasks.push(input.value);
          localStorage.setItem('tasks', JSON.stringify(tasks));
          showTab('tasks');
        }
      };

      inputContainer.appendChild(input);
      inputContainer.appendChild(btn);
      content.appendChild(inputContainer);

      tasks.forEach((t, i) => {
        const card = document.createElement('div');
        card.className = 'card tasks';
        card.innerHTML = `<p><i class="fas fa-check-circle"></i> ${t}</p>`;
        card.onclick = () => card.querySelector('p').style.textDecoration = 'line-through';
        content.appendChild(card);
      });
    }

    content.style.opacity = 1;
  }, 150);
}

