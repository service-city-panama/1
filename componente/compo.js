// Configuración de Firebase
const firebaseConfig = {
    apiKey: "AIzaSyAczBzL80MoEe8qm91CCHHxX-_8iAla-S8",
    authDomain: "service-city-app.firebaseapp.com",
    projectId: "service-city-app",
    storageBucket: "service-city-app.appspot.com",
    messagingSenderId: "1068099519430",
    appId: "1:1068099519430:web:a896e65c893c36d833a8c7"
  };

// Inicializa Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const storage = firebase.storage();

// Referencias a elementos del DOM
const articleForm = document.getElementById('article-form');
const articlesTable = document.getElementById('articles-table');

// Event listener para el envío del formulario
articleForm.addEventListener('submit', e => {
    e.preventDefault();

    // Obtiene los valores del formulario
    const name = document.getElementById('article-name').value;
    const detail = document.getElementById('article-detail').value;
    const photo = document.getElementById('article-photo').files[0];

 // Sube la foto a Firebase Storage y obtiene la URL
 const photoRef = storage.ref(`articles/${photo.name}`);
 photoRef.put(photo).then(() => {
     return photoRef.getDownloadURL();
 }).then(url => {
     // Agrega el artículo a Firestore
     return db.collection('articles').add({
         name: name,
         detail: detail,
         photoUrl: url
     });
 }).then(docRef => {
     console.log('Artículo agregado con éxito');
     // Actualiza la tabla con el nuevo artículo
     addArticleToTable(docRef.id, { name, detail, photoUrl: url });
 }).catch(error => {
     console.error('Error al agregar el artículo:', error);
 });
});

// Función para agregar un artículo a la tabla
function addArticleToTable(id, article) {
 const row = `
     <tr data-id="${id}">
         <td><img src="${article.photoUrl}" alt="${article.name}" width="100"></td>
         <td>${article.name}</td>
         <td>${article.detail}</td>
         <td>
             <!-- Botones para editar y eliminar -->
             <button onclick="editArticle('${id}')">Editar</button>
             <button onclick="deleteArticle('${id}')">Eliminar</button>
         </td>
     </tr>
 `;
 articlesTable.querySelector('tbody').insertAdjacentHTML('beforeend', row);
}

// Función para mostrar los artículos en la tabla al cargar la página
function displayArticles() {
 db.collection('articles').get().then(snapshot => {
     snapshot.forEach(doc => {
         const article = doc.data();
         addArticleToTable(doc.id, article);
     });
 });
}

// Event listener para cargar los artículos al abrir la página
window.addEventListener('load', displayArticles);

// Funciones para editar y eliminar artículos (implementar según necesidad)
function editArticle(id) {
 // Lógica para editar un artículo
}

function deleteArticle(id) {
 db.collection('articles').doc(id).delete().then(() => {
     console.log('Artículo eliminado con éxito');
     document.querySelector(`tr[data-id="${id}"]`).remove();
 }).catch(error => {
     console.error('Error al eliminar el artículo:', error);
 });
}