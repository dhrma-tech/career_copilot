const user = JSON.parse(localStorage.getItem('user'));

// If no user is logged in, redirect to the login page
if (!user) {
  window.location.href = 'index.html';
}

document.getElementById('welcome').innerText = `Welcome, ${user.name}!`;

// Logout button handler
document.getElementById('logoutBtn').onclick = function() {
  localStorage.removeItem('user');
  window.location.href = 'index.html';
};

showTab('courses'); // default tab

function showTab(tab) {
  const content = document.getElementById('content');
  content.innerHTML = '';

  if (tab === 'courses') {
    const courses = ['Python Basics', 'ML with Scikit-learn', 'Deep Learning with TensorFlow', 'Data Visualization'];
    courses.forEach(c => {
      const div = document.createElement('div');
      div.textContent = c;
      div.style.padding = '0.5rem';
      div.style.borderBottom = '1px solid #ddd';
      content.appendChild(div);
    });
  }

  if (tab === 'roadmap') {
    const roadmap = ['Python', 'Statistics & Math', 'ML Basics', 'Deep Learning', 'Projects & Deployment', 'Advanced AI Topics'];
    roadmap.forEach((step, index) => {
      const div = document.createElement('div');
      div.textContent = `${index + 1}. ${step}`;
      div.style.padding = '0.5rem';
      content.appendChild(div);
    });
  }

  if (tab === 'tasks') {
    const taskKey = `tasks_${user.name}_${user.branch}`;
    let tasks = JSON.parse(localStorage.getItem(taskKey) || '[]');

    const input = document.createElement('input');
    input.placeholder = 'New Task';
    input.style.marginRight = '0.5rem';

    const btn = document.createElement('button');
    btn.textContent = 'Add Task';
    btn.onclick = () => {
      if (input.value.trim() !== '') {
        tasks.push(input.value);
        localStorage.setItem(taskKey, JSON.stringify(tasks));
        showTab('tasks'); // refresh
      }
    };

    content.appendChild(input);
    content.appendChild(btn);

    tasks.forEach((t, i) => {
      const div = document.createElement('div');
      div.textContent = t;

      // Add delete button
      const delBtn = document.createElement('button');
      delBtn.textContent = 'Delete';
      delBtn.style.marginLeft = '1rem';
      delBtn.onclick = () => {
        tasks.splice(i, 1);
        localStorage.setItem(taskKey, JSON.stringify(tasks));
        showTab('tasks');
      };

      div.appendChild(delBtn);
      div.style.padding = '0.3rem';
      div.style.borderBottom = '1px solid #eee';
      content.appendChild(div);
    });
  }
}
