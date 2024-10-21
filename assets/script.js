const BASE_URL = 'https://pr-backend-d3rg.onrender.com'; // Cambia esto por la URL de tu back-end
const socket = io(BASE_URL);

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

// Manejar la actualización de usuarios conectados en tiempo real
socket.on('update_users', function(users) {
    const connectedUsersList = document.getElementById('connectedUsersList');
    connectedUsersList.innerHTML = '';  // Limpiar la lista
    users.forEach(user => {
        const li = document.createElement('li');
        li.className = 'list-group-item';
        li.textContent = user;
        connectedUsersList.appendChild(li);
    });
});

// Manejar la actualización de archivos subidos en tiempo real
socket.on('update_files', function(files) {
    const uploadedFilesList = document.getElementById('uploadedFilesList');
    uploadedFilesList.innerHTML = '';  // Limpiar la lista
    files.forEach(file => {
        const li = document.createElement('li');
        li.className = 'list-group-item';
        li.innerHTML = `${file} <a href="${BASE_URL}/download/${file}" class="btn btn-link">Descargar</a>`;
        uploadedFilesList.appendChild(li);
    });
});

// Cargar usuarios conectados y archivos subidos al cargar la página
window.onload = async function() {
    const userId = document.getElementById('connectedUserId').value;
    if (userId) {
        await loadConnectedUsers();
        await loadUploadedFiles();
    }
};

// Cargar archivos subidos (puede ser opcional si se usa WebSocket)
async function loadUploadedFiles() {
    const response = await fetch(`${BASE_URL}/files`);
    const files = await response.json();

    const uploadedFilesList = document.getElementById('uploadedFilesList');
    uploadedFilesList.innerHTML = '';  // Limpiar la lista
    files.forEach(file => {
        const li = document.createElement('li');
        li.className = 'list-group-item';
        li.innerHTML = `${file} <a href="${BASE_URL}/download/${file}" class="btn btn-link">Descargar</a>`;
        uploadedFilesList.appendChild(li);
    });
}

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
};

// Desconectar al usuario al recargar o cerrar la página
window.onbeforeunload = async function() {
    const userId = document.getElementById('connectedUserId').value;
    if (userId) {
        await fetch(`${BASE_URL}/disconnect`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ user_id: userId })
        });
    }
};
