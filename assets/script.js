const BASE_URL = 'https://pr-backend-d3rg.onrender.com'; // Cambia esto a la URL de tu backend en Render
const socket = io(BASE_URL);
let userId;

document.getElementById('connectBtn').onclick = connectUser;

socket.on('user_list', updateUserList);
socket.on('file_uploaded', displayUploadStatus);

document.getElementById('uploadBtn').onclick = uploadFile;

// Función para conectar al usuario
function connectUser() {
    userId = document.getElementById('userId').value;
    
    if (userId) {
        socket.emit('connect_user', { user_id: userId });

        // Ocultar campos de entrada
        document.getElementById('userInput').style.display = 'none';
        const welcomeMessage = document.getElementById('welcomeMessage');
        welcomeMessage.innerText = `Welcome, ${userId}!`;
        welcomeMessage.style.display = 'block';

        // Mostrar el botón de carga
        document.getElementById('fileInput').style.display = 'block';
        document.getElementById('uploadBtn').style.display = 'block';
    }
}

// Función para actualizar la lista de usuarios conectados
function updateUserList(users) {
    const userList = document.getElementById('userList');
    userList.innerHTML = '';
    users.forEach(user => {
        const li = document.createElement('li');
        li.textContent = user;
        userList.appendChild(li);
    });
}

// Función para cargar archivos
function uploadFile() {
    const fileInput = document.getElementById('fileInput');
    const formData = new FormData();
    formData.append('file', fileInput.files[0]);
    formData.append('user_id', userId);

    fetch(`${BASE_URL}/upload`, { 
        method: 'POST',
        body: formData
    }).then(response => response.json())
      .then(data => {
          // Notificar éxito
          displayUploadStatus({ filename: data.filename, user_id: userId });
      })
      .catch(error => {
          displayUploadStatus({ filename: 'Error', user_id: error.message });
      });
}

// Función para mostrar el estado de la carga de archivos
function displayUploadStatus(data) {
    const uploadStatus = document.getElementById('uploadStatus');
    if (data.user_id === 'Error') {
        uploadStatus.innerText = `Error uploading file: ${data.user_id}`;
    } else {
        uploadStatus.innerText = `File uploaded by ${data.user_id}: ${data.filename}`;
    }
}
