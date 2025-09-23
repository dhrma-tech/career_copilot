document.addEventListener('DOMContentLoaded', () => {
  const user = JSON.parse(localStorage.getItem('user'));
  const vision = localStorage.getItem('user_vision');

  // If no user data is found, redirect to the login page
  if (!user) {
    window.location.href = 'index.html';
    return;
  }

  document.getElementById('welcome').innerText = `Welcome, ${user.name}!`;

  // --- NEW CODE STARTS HERE ---

  // Display User's Vision
  const visionDisplay = document.getElementById('vision-display');
  if (visionDisplay && vision) {
    visionDisplay.innerText = `Your Vision: ${vision}`;
  }

  // Pomodoro Timer Logic
  const timerDisplay = document.getElementById('timer-display');
  const startTimerBtn = document.getElementById('start-timer-btn');
  let countdown;
  let timerDuration = 25 * 60;

  function displayTimeLeft(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainderSeconds = seconds % 60;
    const display = `${minutes}:${remainderSeconds < 10 ? '0' : ''}${remainderSeconds}`;
    timerDisplay.textContent = display;
    document.title = `${display} - Career Copilot`; // Update page title
  }

  function startTimer() {
    clearInterval(countdown);
    const now = Date.now();
    const then = now + timerDuration * 1000;
    displayTimeLeft(timerDuration);

    countdown = setInterval(() => {
      const secondsLeft = Math.round((then - Date.now()) / 1000);
      if (secondsLeft < 0) {
        clearInterval(countdown);
        alert('Time for a break!');
        startTimerBtn.textContent = 'Start Focus';
        displayTimeLeft(timerDuration); // Reset display
        return;
      }
      displayTimeLeft(secondsLeft);
    }, 1000);
    startTimerBtn.textContent = 'Reset';
  }

  if (startTimerBtn) {
    startTimerBtn.addEventListener('click', () => {
      if (countdown) {
        clearInterval(countdown);
        countdown = null;
        displayTimeLeft(timerDuration);
        startTimerBtn.textContent = 'Start Focus';
      } else {
        startTimer();
      }
    });
  }
  
  // Focus Mode Logic
  const focusModeBtn = document.getElementById('focus-mode-btn');
  const dashboardContainer = document.querySelector('.dashboard-container');
  if (focusModeBtn) {
    focusModeBtn.addEventListener('click', () => {
        dashboardContainer.classList.toggle('focus-mode');
    });
  }

  // --- NEW CODE ENDS HERE ---


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
    const response = await fetch('https://career-copilot-backend-u39g.onrender.com/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        user,
        type, // 'roadmap', 'courses', or 'growth'
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

  if (tabName === 'roadmap' || tabName === 'courses' || tabName === 'growth') {
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
