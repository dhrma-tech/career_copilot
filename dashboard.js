document.addEventListener('DOMContentLoaded', () => {
  const user = JSON.parse(localStorage.getItem('user'));

  // If no user data is found, redirect to the login page
  if (!user) {
    window.location.href = 'index.html';
    return;
  }

  document.getElementById('welcome').innerText = `Welcome, ${user.name}!`;

  // Logout button functionality
  document.getElementById('logoutBtn').onclick = function() {
    localStorage.removeItem('user');
    window.location.href = 'index.html';
  };

  // Load the default tab and the tasks sidebar on page load
  showTab('roadmap', document.querySelector('.tabs button'));
  renderTasks();
});

// Fetches AI-generated content from the backend
async function getAiContent(type) {
  const user = JSON.parse(localStorage.getItem('user'));
  const contentEl = document.getElementById('content');
  
  let loadingMessage = 'Generating...';
  if (type === 'roadmap') loadingMessage = 'Generating your personalized roadmap...';
  if (type === 'courses') loadingMessage = 'Finding the best courses for you...';
  if (type === 'growth') loadingMessage = 'Curating self-growth insights...';
  
  contentEl.innerHTML = `<div class="loader-container"><div class="loader"></div><p class="loader-text">${loadingMessage}</p></div>`;

  try {
    const response = await fetch('https://career-copilot-backend-u39g.onrender.com', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        user,
        type,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    contentEl.innerHTML = data.html;

  } catch (error) {
    console.error("Error fetching AI content:", error);
    contentEl.innerHTML = `<div class="card error">
      <h3>Oops! Something went wrong.</h3>
      <p>Could not fetch personalized content. Please try again later.</p>
    </div>`;
  }
}

function showTab(tabName, element) {
  const buttons = document.querySelectorAll('.tabs button');
  buttons.forEach(button => button.classList.remove('active'));
  element.classList.add('active');

  const content = document.getElementById('content');
  content.innerHTML = '';

  if (tabName === 'roadmap' || tabName === 'courses' || tabName === 'growth') {
    getAiContent(tabName);
  } else if (tabName === 'profile') {
    renderProfile();
  }
}

function renderProfile() {
  const user = JSON.parse(localStorage.getItem('user'));
  const contentEl = document.getElementById('content');
  
  const profileHtml = `
    <div class="card profile-card">
      <h3>Your Profile</h3>
      <p><strong>Name:</strong> ${user.name}</p>
      <p><strong>Branch:</strong> ${user.branch}</p>
      <p><strong>Interests:</strong> ${user.interests}</p>
    </div>
  `;
  contentEl.innerHTML = profileHtml;
}

// --- THIS ENTIRE FUNCTION IS NEW AND IMPROVED ---
function renderTasks() {
  const user = JSON.parse(localStorage.getItem('user'));
  const taskContainer = document.getElementById('task-list-container');
  const taskKey = `tasks_${user.name.replace(/\s+/g, '_')}`;
  let tasks = JSON.parse(localStorage.getItem(taskKey) || '[]');

  // Auto-migrate old string-based tasks to new object-based tasks
  if (tasks.length > 0 && typeof tasks[0] === 'string') {
    tasks = tasks.map(taskText => ({ text: taskText, completed: false }));
    localStorage.setItem(taskKey, JSON.stringify(tasks));
  }

  const taskInputHtml = `
    <div class="task-input-container">
      <input type="text" id="taskInput" placeholder="Add a new task...">
      <button id="addTaskBtn">+</button>
    </div>
    <div class="task-list"></div>
  `;
  taskContainer.innerHTML = taskInputHtml;

  const taskList = taskContainer.querySelector('.task-list');
  if (tasks.length === 0) {
    taskList.innerHTML = `<p class="no-tasks">No tasks yet. Add one above!</p>`;
  } else {
    tasks.forEach((task, index) => {
      const taskItem = document.createElement('div');
      taskItem.className = `task-item ${task.completed ? 'completed' : ''}`;
      taskItem.dataset.index = index; // Use data-attribute for easier access
      
      taskItem.innerHTML = `
        <span class="task-text">${task.text}</span>
        <button class="delete-btn" data-index="${index}">&times;</button>
      `;
      taskList.appendChild(taskItem);
    });
  }

  // Event listener for adding a new task
  document.getElementById('addTaskBtn').onclick = () => {
    const input = document.getElementById('taskInput');
    if (input.value.trim() !== '') {
      // Add new tasks as objects
      tasks.push({ text: input.value.trim(), completed: false });
      localStorage.setItem(taskKey, JSON.stringify(tasks));
      renderTasks();
    }
  };

  // Event listener for toggling task completion
  taskContainer.querySelectorAll('.task-item').forEach(item => {
    item.onclick = function(e) {
      // Prevent toggling when delete button is clicked
      if (e.target.classList.contains('delete-btn')) return;
      
      const index = this.dataset.index;
      tasks[index].completed = !tasks[index].completed; // Toggle the completed state
      localStorage.setItem(taskKey, JSON.stringify(tasks));
      renderTasks();
    };
  });

  // Event listener for deleting a task
  taskContainer.querySelectorAll('.delete-btn').forEach(button => {
    button.onclick = (e) => {
      e.stopPropagation(); // Stop the click from bubbling up to the task-item
      const index = e.target.getAttribute('data-index');
      tasks.splice(index, 1);
      localStorage.setItem(taskKey, JSON.stringify(tasks));
      renderTasks();
    };
  });
}

