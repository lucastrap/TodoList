document.addEventListener("DOMContentLoaded", function() {
    const taskForm = document.getElementById('taskForm');
    const taskInput = document.getElementById('taskInput');
    const taskList = document.getElementById('taskList');

    // Récupère les tâches
    function fetchTasks() {
        fetch('/api/tasks')
            .then(response => response.json())
            .then(tasks => {
                taskList.innerHTML = '';
                tasks.forEach(task => {
                    const li = document.createElement('li');
                    li.textContent = `${task.title} - Priority: ${task.priority}`; // Afficher la priorité
                    const deleteButton = document.createElement('button');
                    deleteButton.textContent = 'Supprimer';
                    deleteButton.onclick = () => deleteTask(task.id);
                    li.appendChild(deleteButton);
    
                    const completeButton = document.createElement('button');
                    completeButton.textContent = 'Terminer';
                    completeButton.onclick = () => completeTask(task.id);
                    li.appendChild(completeButton);
    
                    taskList.appendChild(li);
                });
            })
            .catch(error => {
                console.error('Erreur lors de la récupération des tâches:', error);
            });
    }
    
    taskForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const taskTitle = taskInput.value;
        const priority = document.getElementById('prioritySelect').value; // Récupérer la priorité
    
        console.log("Task Title:", taskTitle); // Affiche le titre de la tâche
        console.log("Priority:", priority); // Affiche la priorité
    
        fetch('/api/tasks', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ title: taskTitle, priority: priority }), // Inclure la priorité
        })
        .then(response => response.json())
        .then(task => {
            taskInput.value = '';
            document.getElementById('prioritySelect').value = ''; // Réinitialiser la sélection
            fetchTasks();
        });
    });
    
    

    // Supprime une tâche
    function deleteTask(id) {
        fetch(`/api/tasks/${id}`, {
            method: 'DELETE',
        })
        .then(() => fetchTasks());
    }

    function completeTask(id) {
        fetch(`/api/tasks/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Erreur lors de la mise à jour de la tâche');
            }
            return response.json();
        })
        .then(data => {
            console.log(data.message); // Affichez le message de confirmation
            fetchTasks(); // Recharger les tâches après la mise à jour
        })
        .catch(error => {
            console.error('Erreur:', error.message);
        });
    }
    

    fetchTasks();
});
