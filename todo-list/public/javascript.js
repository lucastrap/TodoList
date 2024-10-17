document.addEventListener("DOMContentLoaded", function() {
    const taskForm = document.getElementById('taskForm');
    const taskInput = document.getElementById('taskInput');
    const taskList = document.getElementById('taskList');

   
   // Récupère les tâches
function fetchTasks(id) {
    fetch('/api/tasks')
        .then(response => {
            if (!response.ok) {
                throw new Error('Erreur réseau, statut: ' + response.status);
            }
            return response.json();
        })
        .then(tasks => {
            taskList.innerHTML = '';
            tasks.forEach(task => {
                const li = document.createElement('li');
                li.textContent = task.title;
                if(id.completed){
                    li.appendChild("TESt");
                }else{
                    
                }
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


    function completeTask(id) {
        fetch(`/api/tasks/${id}`, {
            method: 'PUT', 
            headers: {
                'Content-Type': 'application/json' 
            },
            body: JSON.stringify({ completed: true }) 
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Erreur lors de la mise à jour de la tâche');
            }
            return fetchTasks(id);
        })
        .catch(error => {
            console.error('Erreur:', error);
        });
    }
    


    fetchTasks();
});