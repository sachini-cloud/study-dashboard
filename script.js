document.addEventListener("DOMContentLoaded", function () {

    // ===============================
    // 1. CLOCK & GREETING
    // ===============================
    function updateClock() {
        const now = new Date();

        let h = String(now.getHours()).padStart(2, '0');
        let m = String(now.getMinutes()).padStart(2, '0');
        let s = String(now.getSeconds()).padStart(2, '0');

        const clock = document.getElementById('digital-clock');
        if (clock) clock.textContent = `${h}:${m}:${s}`;

        const greeting = document.getElementById('greeting');
        if (greeting) {
            let hour = now.getHours();

            if (hour < 12) greeting.textContent = "Good Morning!";
            else if (hour < 18) greeting.textContent = "Good Afternoon!";
            else greeting.textContent = "Good Evening!";
        }
    }

    setInterval(updateClock, 1000);
    updateClock();


    // ===============================
    // 2. DARK MODE
    // ===============================
    const themeToggle = document.getElementById('theme-toggle');

    if (localStorage.getItem('theme') === 'dark') {
        document.body.classList.add('dark');
        if (themeToggle) themeToggle.textContent = "☀️ Light Mode";
    }

    if (themeToggle) {
        themeToggle.onclick = function () {
            document.body.classList.toggle('dark');

            if (document.body.classList.contains('dark')) {
                localStorage.setItem('theme', 'dark');
                themeToggle.textContent = "☀️ Light Mode";
            } else {
                localStorage.setItem('theme', 'light');
                themeToggle.textContent = "🌙 Dark Mode";
            }
        };
    }


    // ===============================
    // 3. TODO LIST (LOCAL STORAGE)
    // ===============================
    const taskInput = document.getElementById('task-input');
    const addTaskBtn = document.getElementById('add-task-btn');
    const taskList = document.getElementById('task-list');

    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

    function saveTasks() {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    function renderTasks() {
        taskList.innerHTML = "";

        tasks.forEach((task, index) => {
            const li = document.createElement('li');

            const leftDiv = document.createElement('div');
            leftDiv.className = "task-left";

            const checkbox = document.createElement('input');
            checkbox.type = "checkbox";
            checkbox.checked = task.completed;

            const span = document.createElement('span');
            span.textContent = task.text;
            span.className = "task-text";

            if (task.completed) {
                span.classList.add("completed");
            }

            const deleteBtn = document.createElement('button');
            deleteBtn.textContent = "Delete";
            deleteBtn.className = "delete-btn";

            checkbox.onchange = function () {
                tasks[index].completed = checkbox.checked;
                saveTasks();
                renderTasks();
            };

            deleteBtn.onclick = function () {
                tasks.splice(index, 1);
                saveTasks();
                renderTasks();
            };

            leftDiv.appendChild(checkbox);
            leftDiv.appendChild(span);

            li.appendChild(leftDiv);
            li.appendChild(deleteBtn);

            taskList.appendChild(li);
        });
    }

    if (addTaskBtn) {
        addTaskBtn.onclick = function () {
            const value = taskInput.value.trim();
            if (value === "") return;

            tasks.push({
                text: value,
                completed: false
            });

            taskInput.value = "";
            saveTasks();
            renderTasks();
        };
    }

    renderTasks();


    // ===============================
    // 4. TIMER (FULL UPGRADE)
    // ===============================

    const timerDisplay = document.getElementById('timer-display');
    const bigTimer = document.getElementById('big-timer');
    const startBtn = document.getElementById('start-btn');
    const resetBtn = document.getElementById('reset-btn');
    const minutesInput = document.getElementById('minutes-input');

    const modal = document.getElementById('timer-modal');
    const pauseBtn = document.getElementById('pause-btn');
    const resumeBtn = document.getElementById('resume-btn');
    const closeModalBtn = document.getElementById('close-modal-btn');
    const alarmSound = document.getElementById('alarm-sound');

    const modeButtons = document.querySelectorAll('.mode-btn');

    let timeLeft = 25 * 60;
    let timerId = null;
    let isPaused = false;

    function formatTime(seconds) {
        let mins = Math.floor(seconds / 60);
        let secs = seconds % 60;
        return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    }

    function updateDisplays() {
        let formatted = formatTime(timeLeft);
        if (timerDisplay) timerDisplay.textContent = formatted;
        if (bigTimer) bigTimer.textContent = formatted;
    }

    // Mode buttons
    modeButtons.forEach(btn => {
        btn.onclick = function () {
            let minutes = parseInt(this.dataset.time);
            timeLeft = minutes * 60;
            updateDisplays();
        };
    });

    // Custom input
    if (minutesInput) {
        minutesInput.addEventListener("input", function () {
            let value = parseInt(minutesInput.value);
            if (!isNaN(value) && value > 0) {
                timeLeft = value * 60;
                updateDisplays();
            }
        });
    }

    // Start / Pause / Resume
    if (startBtn) {
        startBtn.onclick = function () {

            if (!timerId) {
                modal.classList.remove("hidden");
                isPaused = false;

                timerId = setInterval(() => {
                    if (!isPaused) {
                        timeLeft--;
                        updateDisplays();

                        if (timeLeft <= 0) {
                            clearInterval(timerId);
                            timerId = null;

                            // 🔔 Alarm
                            if (alarmSound) alarmSound.play();

                            alert("Time's up!");

                            modal.classList.add("hidden");
                            startBtn.textContent = "Start";
                        }
                    }
                }, 1000);

                startBtn.textContent = "Pause";

            } else {
                isPaused = !isPaused;
                startBtn.textContent = isPaused ? "Resume" : "Pause";
            }
        };
    }

    // Pause button
    if (pauseBtn) {
        pauseBtn.onclick = function () {
            isPaused = true;
        };
    }

    // Resume button
    if (resumeBtn) {
        resumeBtn.onclick = function () {
            isPaused = false;
        };
    }

    // Close modal
    if (closeModalBtn) {
        closeModalBtn.onclick = function () {
            modal.classList.add("hidden");
            clearInterval(timerId);
            timerId = null;
            startBtn.textContent = "Start";
        };
    }

    // Reset
    if (resetBtn) {
        resetBtn.onclick = function () {
            clearInterval(timerId);
            timerId = null;
            isPaused = false;

            let value = parseInt(minutesInput.value);
            timeLeft = (!isNaN(value) && value > 0) ? value * 60 : 25 * 60;

            updateDisplays();
            startBtn.textContent = "Start";
        };
    }

    updateDisplays();

});