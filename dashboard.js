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

  // Load the default tab on page load
  showTab('roadmap', document.querySelector('.tabs button'));
});

// Fetches AI-generated content from the backend
async function getAiContent(type) {
  const user = JSON.parse(localStorage.getItem('user'));
  const contentEl = document.getElementById('content');
  contentEl.innerHTML = '<div class="loader"></div>'; // Show loading spinner

  try {
    // --- THIS IS THE UPDATED LINE ---
    // Replace the placeholder with your actual Render URL
    const response = await fetch('https://your-backend-url.onrender.com/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        user,
        type, // 'roadmap' or 'courses'
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    contentEl.innerHTML = data.html; // The backend will return formatted HTML

  } catch (error) {
    console.error("Error fetching AI content:", error);
    contentEl.innerHTML = `<div class="card error">
      <h3>Oops! Something went wrong.</h3>
      <p>Could not fetch personalized content. Please try again later.</p>
    </div>`;
  }
}

function showTab(tabName, element) {
  // Update active tab style
  const buttons = document.querySelectorAll('.tabs button');
  buttons.forEach(button => button.classList.remove('active'));
  element.classList.add('active');

  const content = document.getElementById('content');
  content.innerHTML = ''; // Clear previous content

  if (tabName === 'roadmap' || tabName === 'courses') {
    getAiContent(tabName);
  } else if (tabName === 'tasks') {
    renderTasks();
  }
}

function renderTasks() {
  const user = JSON.parse(localStorage.getItem('user'));
  const content = document.getElementById('content');
  const taskKey = `tasks_${user.name.replace(/\s+/g, '_')}`; // Sanitize name for key
  let tasks = JSON.parse(localStorage.getItem(taskKey) || '[]');

  const taskInputHtml = `
    <div class="task-input-container">
      <input type="text" id="taskInput" placeholder="Add a new task...">
      <button id="addTaskBtn">Add Task</button>
    </div>
    <div class="task-list"></div>
  `;
  content.innerHTML = taskInputHtml;

  const taskList = document.querySelector('.task-list');
  tasks.forEach((task, index) => {
    const taskItem = document.createElement('div');
    taskItem.className = 'task-item card';
    taskItem.innerHTML = `
      <span>${task}</span>
      <button class="delete-btn" data-index="${index}">Delete</button>
    `;
    taskList.appendChild(taskItem);
  });

  // Event listener for adding a task
  document.getElementById('addTaskBtn').onclick = () => {
    const input = document.getElementById('taskInput');
    if (input.value.trim() !== '') {
      tasks.push(input.value.trim());
      localStorage.setItem(taskKey, JSON.stringify(tasks));
      renderTasks(); // Re-render the tasks list
    }
  };

  // Event listener for deleting tasks
  document.querySelectorAll('.delete-btn').forEach(button => {
    button.onclick = (e) => {
      const index = e.target.getAttribute('data-index');
      tasks.splice(index, 1);
      localStorage.setItem(taskKey, JSON.stringify(tasks));
      renderTasks(); // Re-render
    };
  });
}

