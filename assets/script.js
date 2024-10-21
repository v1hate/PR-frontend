const BASE_URL = 'https://pr-backend-d3rg.onrender.com'; // Reemplaza con tu URL real

document.getElementById('connectButton').addEventListener('click', async function() {
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
    if (result.message === 'User connected successfully') {
        loadFiles(); // Cargar archivos y solicitudes si la conexión es exitosa
        loadPendingRequests(userId);
    }
});

// Manejo del formulario de subida de archivos
document.getElementById('uploadForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const formData = new FormData(this);
    const response = await fetch(`${BASE_URL}/upload`, {
        method: 'POST',
        body: formData
    });

    const result = await response.json();
    alert(result.message);
    loadFiles(); // Recargar archivos después de subir uno
});

// Función para cargar archivos
async function loadFiles() {
    const response = await fetch(`${BASE_URL}/files`);
    const files = await response.json();

    const fileList = document.getElementById('fileList');
    fileList.innerHTML = '';  // Limpiar la lista
    files.forEach(file => {
        const li = document.createElement('li');
        li.className = 'list-group-item';
        li.textContent = file;
        fileList.appendChild(li);
    });
}

// Cargar solicitudes pendientes
async function loadPendingRequests(userId) {
    const response = await fetch(`${BASE_URL}/pending-requests?user_id=${userId}`);
    const requests = await response.json();

    const pendingRequestsList = document.getElementById('pendingRequests');
    pendingRequestsList.innerHTML = '';  // Limpiar la lista
    for (const filename of Object.keys(requests)) {
        const li = document.createElement('li');
        li.className = 'list-group-item d-flex justify-content-between align-items-center';
        li.textContent = filename;

        const acceptButton = document.createElement('button');
        acceptButton.className = 'btn btn-success btn-sm';
        acceptButton.textContent = 'Aceptar';
        acceptButton.onclick = async () => {
            await acceptFile(filename);
        };

        li.appendChild(acceptButton);
        pendingRequestsList.appendChild(li);
    }
}

// Aceptar archivo
async function acceptFile(filename) {
    const userId = document.getElementById('userId').value; // Obtener el ID de usuario

    const response = await fetch(`${BASE_URL}/accept`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ user_id: userId })
    });

    const result = await response.json();
    alert(result.message);
}

// Cargar archivos y solicitudes al cargar la página
window.onload = function() {
    const userId = document.getElementById('userId').value; // Obtener el ID de usuario
    if (userId) {
        loadFiles();
        loadPendingRequests(userId);
    }
};
