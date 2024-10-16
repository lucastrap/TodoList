document.addEventListener("DOMContentLoaded", function() {
    const taskForm = document.getElementById('taskForm');
    const taskInput = document.getElementById('taskInput');
    const taskList = document.getElementById('taskList');

    // Recupere les taches
    function fetchTasks() {
        fetch('/api/tasks')
            .then(response => response.json())
            .then(tasks => {
                taskList.innerHTML = '';
                tasks.forEach(task => {
                    const li = document.createElement('li');
                    li.textContent = task.title;
                    const deleteButton = document.createElement('button');
                    deleteButton.textContent = 'Delete';
                    deleteButton.onclick = () => deleteTask(task.id);
                    li.appendChild(deleteButton);
                    taskList.appendChild(li);
                });
            });
    }

    // Ajout taches
    taskForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const taskTitle = taskInput.value;

        fetch('/api/tasks', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ title: taskTitle }),
        })
        .then(response => response.json())
        .then(task => {
            taskInput.value = '';
            fetchTasks();
        });
    });

    // Supprime tache
    function deleteTask(id) {
        fetch(`/api/tasks/${id}`, {
            method: 'DELETE',
        })
        .then(() => fetchTasks());
    }

    fetchTasks();
});