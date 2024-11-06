document.addEventListener("DOMContentLoaded", function() {
    const taskForm = document.getElementById('taskForm');
    const taskInput = document.getElementById('taskInput');
    const prioritySelect = document.getElementById('prioritySelect');
    const taskList = document.getElementById('taskList');

  
        // Récupère les tâches
    function fetchTasks() {
        if (window.location.pathname !== '/login') {
        fetch('/api/tasks')
        .then(response => response.json())
        .then(tasks => {
            console.log('Response from API:', tasks); // Ajoutez cette ligne pour voir la réponse exacte
            taskList.innerHTML = '';
            tasks.forEach(task => {
                const li = document.createElement('li');
                li.className = task.completed ? 'completed' : ''; // Ajoutez la classe si la tâche est terminée
                li.textContent = `${task.title} - Priority: ${task.priority} - Status: ${task.completed ? 'Terminé' : 'Non terminé'}`;
    
                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.checked = task.completed; // Vérifie si la tâche est terminée
                checkbox.onclick = () => completeTask(task.id); // Marquer la tâche comme complète au clic
                li.prepend(checkbox); // Ajoute la case à cocher au début de l'élément li
    
                const deleteButton = document.createElement('button');
                deleteButton.innerHTML = '<i class="fas fa-trash"></i>'; // Icône de la corbeille
                deleteButton.onclick = () => deleteTask(task.id);
                li.appendChild(deleteButton);
    
                taskList.appendChild(li);
            });
        })
        .catch(error => {
            console.error('Erreur lors de la récupération des tâches:', error);
        });
    
    }
}


    
    if (window.location.pathname !== '/login') {
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
}
    


    // Fonction pour vérifier si l'utilisateur est connecté
function checkAuthentication() {
    if (window.location.pathname !== '/login') {
    return fetch('/api/check-auth', {
        method: 'GET',
        credentials: 'same-origin' // Pour inclure les cookies dans la requête
    })
    .then(response => response.json())
    .then(data => {
        if (data.authenticated) {
            return true; // L'utilisateur est authentifié
        } else {
            window.location.href = '/login'; // Redirige vers la page de connexion
            return false;
        }
    })
    .catch(error => {
        console.error('Erreur lors de la vérification de l\'authentification:', error);
        window.location.href = '/login'; // Redirige vers la page de connexion en cas d'erreur
        return false;
    });
}

}
if (window.location.pathname !== '/login') {
    
// Appeler cette fonction avant de charger les tâches
checkAuthentication().then(isAuthenticated => {
    if (isAuthenticated) {
        fetchTasks(); // Charge les tâches seulement si l'utilisateur est connecté
    }
    
});
}

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
