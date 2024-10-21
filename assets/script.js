const BASE_URL = 'https://pr-backend-d3rg.onrender.com'; // Cambia esto por la URL de tu back-end

// Manejar la conexión de usuario
document.getElementById('connectForm').onsubmit = async function(event) {
    event.preventDefault();
    const userId = document.getElementById('userId').value;

    const response = await fetch(`${BASE_URL}/connect`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ user_id: userId })
    });

    const result = await response.json();
    alert(result.message);
    document.getElementById('connectedUserId').value = userId; // Guardar el ID de usuario conectado
    loadConnectedUsers(); // Cargar usuarios conectados
};

// Manejar la subida de archivos
document.getElementById('uploadForm').onsubmit = async function(event) {
    event.preventDefault();
    const fileInput = document.getElementById('fileInput');
    const userId = document.getElementById('connectedUserId').value;

    const formData = new FormData();
    formData.append('file', fileInput.files[0]);
    formData.append('user_id', userId);

    const response = await fetch(`${BASE_URL}/upload`, {
        method: 'POST',
        body: formData
    });

    const result = await response.json();
    alert(result.message);
    fileInput.value = ''; // Limpiar el campo de entrada
};

// Cargar usuarios conectados
async function loadConnectedUsers() {
    const response = await fetch(`${BASE_URL}/connected-users`);
    const users = await response.json();

    const connectedUsersList = document.getElementById('connectedUsersList');
    connectedUsersList.innerHTML = '';  // Limpiar la lista
    users.forEach(user => {
        const li = document.createElement('li');
        li.className = 'list-group-item';
        li.textContent = user;
        connectedUsersList.appendChild(li);
    });
}

// Cargar usuarios conectados al cargar la página
window.onload = loadConnectedUsers;
