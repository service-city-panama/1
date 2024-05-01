import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
import { getDatabase, push, ref, remove, onValue, update } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-database.js";
import {showMessage} from "../app/utils/showMessage.js"

const firebaseConfig = {
  apiKey: "AIzaSyAczBzL80MoEe8qm91CCHHxX-_8iAla-S8",
  authDomain: "service-city-app.firebaseapp.com",
  projectId: "service-city-app",
  storageBucket: "service-city-app.appspot.com",
  messagingSenderId: "1068099519430",
  appId: "1:1068099519430:web:a896e65c893c36d833a8c7",
  databaseURL: "https://service-city-app-default-rtdb.firebaseio.com/",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

// Open/Close - NavBar =====
const nav = document.querySelector("#nav");
const abrir = document.querySelector("#abrir");
const cerrar = document.querySelector("#cerrar");
abrir.addEventListener("click", () => { nav.classList.add("visible"); });
cerrar.addEventListener("click", () => { nav.classList.remove("visible"); });

const form = document.querySelector("form");
const tabla = document.getElementById("tableroChorrera");
let itemsPerPage = 10; // Número de elementos por página
let totalPages;
let currentPage = 1;
let isSubmitting = false;
// const submitBtn = document.getElementById("submitForm-btn");

// Función para mostrar los datos en la tabla
function mostrarDatos() {
    // Vacía la tabla antes de agregar los nuevos datos
    tabla.innerHTML = "";

    // Obtén los datos de la base de datos
    onValue(ref(database, "unidades"), snapshot => {
        const data = [];
        snapshot.forEach(childSnapshot => {
            data.push({ id: childSnapshot.key, ...childSnapshot.val() });
        });

        // Calcular totalPages
        totalPages = Math.ceil(data.length / itemsPerPage);

        // Calcular índices de inicio y fin
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = Math.min(startIndex + itemsPerPage, data.length);

        // Inicializa el contador de fila
        let filaNumero = startIndex + 1;

        // Mostrar datos de la página actual
        for (let i = startIndex; i < endIndex; i++) {
            const childData = data[i];
            const row = `
                        <tr>
                            <td class="text-center">${filaNumero++}</td>
                            <td class="text-center">${childData.unidad}</td>
                            <td class="text-center">${childData.estado}</td>
                            <td>
                                <select class="form-select estado-select" data-id="${childData.id}">
                                    <option ${childData.estado === 'Llenó' ? 'selected' : ''}>Lleno</option>
                                    <option ${childData.estado === 'En pesa' ? 'selected' : ''}>En pesa</option>
                                    <option ${childData.estado === 'Pendiente' ? 'selected' : ''}>A pesa</option>
                                    <option ${childData.estado === 'Pendiente' ? 'selected' : ''}>Activo</option>               
                                    <option ${childData.estado === 'Pendiente' ? 'selected' : ''}>Pendiente</option>
                                    <option ${childData.estado === 'Pidio Permiso' ? 'selected' : ''}>Permiso</option>
                                    <option ${childData.estado === 'Apoyo' ? 'selected' : ''}>Apoyo</option>
                                    <option ${childData.estado === 'Taller' ? 'selected' : ''}>Taller</option>
                                    <option ${childData.estado === 'Revision X' ? 'selected' : ''}>X</option>
                                    <option ${childData.estado === 'Revision 2X' ? 'selected' : ''}>X X</option>
                                    <option ${childData.estado === 'Revision 3X' ? 'selected' : ''}>X X X</option>
                              </select>
                            </td>
                            <td>
                            <button type="button" class="button delete-btn" data-id="${childData.id}">
                                <i class="bi bi-journal-x"></i>
                            </button>
                            </td>
                        </tr>
                          `;
            tabla.innerHTML += row;
        };

        // Actualizar la paginación pasando totalPages como argumento
        updatePagination(totalPages);
    });
}

// Función para actualizar la paginación
function updatePagination(totalPages) {
    const paginationContainer = document.querySelector(".pagination");
    const prevPageBtn = paginationContainer.querySelector("#prevPage");
    const nextPageBtn = paginationContainer.querySelector("#nextPage");

    // Actualizar estado de botones prev y next
    prevPageBtn.disabled = currentPage === 1;
    nextPageBtn.disabled = currentPage === totalPages;

    // Eliminar números de página existentes
    paginationContainer.querySelectorAll(".pageNumber:not(.prev-page):not(.next-page)").forEach((page) => {
        page.remove();
    });

    // Determinar las páginas a mostrar
    let startPage = Math.max(1, currentPage - 1);
    let endPage = Math.min(totalPages, currentPage + 1);

    // Asegurarse de que siempre haya tres páginas visibles si es posible
    if (startPage === 1 && totalPages > 2) {
        endPage = 3;
    } else if (endPage === totalPages && totalPages > 2) {
        startPage = totalPages - 2;
    }

    // Agregar números de página actualizados
    for (let i = startPage; i <= endPage; i++) {
        const pageItem = document.createElement("li");
        pageItem.classList.add("pageNumber");
        if (i === currentPage) {
            pageItem.classList.add("active");
        }
        const pageLink = document.createElement("a");
        pageLink.href = "#";
        pageLink.textContent = i;
        pageItem.appendChild(pageLink);

        // Insertar pageItem antes del botón de la página siguiente
        nextPageBtn.parentElement.before(pageItem);

        (function (index) {
            pageLink.addEventListener("click", (e) => {
                e.preventDefault();

                currentPage = index;
                mostrarDatos();
                updatePagination(totalPages);
            });
        })(i);
    }

    // Evento para el botón de página anterior
    prevPageBtn.removeEventListener("click", handlePrevPage); // Remover el evento anterior
    prevPageBtn.addEventListener("click", handlePrevPage); // Agregar el evento

    // Evento para el botón de página siguiente
    nextPageBtn.removeEventListener("click", handleNextPage); // Remover el evento anterior
    nextPageBtn.addEventListener("click", handleNextPage); // Agregar el evento



// Actualiza itemsPerPage con el valor seleccionado
document.getElementById('itemsPerPageSelect').addEventListener('change', function () {
    itemsPerPage = parseInt(this.value);
    currentPage = 1;
    mostrarDatos();
    updatePagination(totalPages);
});
}

// Evento para el botón de página anterior
function handlePrevPage() {
    if (currentPage > 1) {
        currentPage--;
        mostrarDatos();
        updatePagination(totalPages);
    }
};

// Evento para el botón de página siguiente
function handleNextPage() {
    if (currentPage < totalPages) {
        currentPage++;
        mostrarDatos();
        updatePagination(totalPages);
    }
};


// Evento para enviar el formulario
form.addEventListener("submit", function (event) {
    event.preventDefault(); // Evita que se recargue la página al enviar el formulario

    console.log("Evento submit está funcionando"); // Agregar este console.log

    if (!isSubmitting) {
        isSubmitting = true; // Bloquea el formulario

        const unidadInput = document.getElementById("validationCustom01").value;
        const estadoInput = document.getElementById("validationCustom04").value;

        // Verifica que los campos no estén vacíos
        if (unidadInput.trim() !== "" && estadoInput.trim() !== "") {
            // Crear un nuevo objeto con los datos a guardar
            const nuevoRegistro = {
                unidad: unidadInput,
                estado: estadoInput
            };

            // Obtener una referencia a la ubicación en la base de datos donde se guardarán los datos
            const referenciaUnidades = ref(database, "unidades");

            // Agregar datos a la base de datos
            push(referenciaUnidades, nuevoRegistro)
                .then(() => {
                    // Limpia los campos del formulario
                    form.reset();
                    // Desbloquea el formulario después de 1 segundos
                    setTimeout(() => {
                        isSubmitting = false;
                    }, 1000);
                    // Recarga la página después de enviar el formulario
                    setTimeout(() => {
                        location.reload();
                    }, 100);
                })
                .catch(error => {
                    console.error("Error al enviar datos a la base de datos:", error);
                });
        } else {
            alert("Por favor completa todos los campos.");
        }
    } else {
        alert("Ya se está enviando un formulario. Por favor espera unos momentos antes de intentar de nuevo.");
    }
});

// Suscribirse a eventos en tiempo real para actualizar la tabla automáticamente
onValue(ref(database, "unidades"), snapshot => {
    mostrarDatos(); // Mostrar los datos actualizados en la tabla
    setTimeout(mostrarDatos, 200); // Actualizar la tabla automáticamente después de 1 segundo
});

// Evento para actualizar el estado al cambiar el select
tabla.addEventListener("change", function (event) {
    if (event.target.classList.contains("estado-select")) {
        const confirmar = confirm("¿Estás seguro de que deseas cambiar el estado?");
        if (confirmar) {
            const id = event.target.getAttribute("data-id");
            const nuevoEstado = event.target.value;
            update(ref(database, `unidades/${id}`), { estado: nuevoEstado })
                .then(() => {
                    console.log("Estado actualizado exitosamente");
                    location.reload(); // Recargar la página después de cambiar el estado
                })
                .catch(error => {
                    console.error("Error al actualizar el estado:", error);
                });
        } else {
            // Volver al estado original si se cancela la operación
            mostrarDatos();
        };
    };
});

// Accion de Desplazamiento ===========================
// Botón de desplazamiento hacia Arriba/Abajo
const scrollToBottomBtn = document.getElementById("scrollToBottomBtn");
const scrollToTopBtn = document.getElementById("scrollToTopBtn");

// Evento de clic en el botón de desplazamiento hacia abajo
scrollToBottomBtn.addEventListener("click", function () {
    const lastRow = tabla.rows[tabla.rows.length - 1];
    lastRow.scrollIntoView({ behavior: "smooth", block: "end" });
});

// Evento de clic en el botón de desplazamiento hacia arriba
scrollToTopBtn.addEventListener("click", function () {
    const firstRow = tabla.rows[0];
    firstRow.scrollIntoView({ behavior: "smooth", block: "start" });
}); // Accion de Desplazamiento ===========================


// Borrar Tablero
// Botón de borrado
const deleteButton = document.getElementById('delete-board-button');

// Modal de confirmación
const confirmationModal = document.getElementById('confirmation-modal');
const confirmDeleteButton = document.getElementById('confirm-delete');
const cancelDeleteButton = document.getElementById('cancel-delete');

// Mostrar modal de confirmación al hacer clic en el botón de borrado
deleteButton.addEventListener('click', function() {
  confirmationModal.style.display = 'block';
});

// Confirmar el borrado
confirmDeleteButton.addEventListener('click', function() {
  // Ubicación de los datos a borrar en la base de datos
  const boardRef = remove(ref(database, 'unidades'));

  // Borra los datos
  boardRef.remove()
    showMessage(() => {
      console.log("Datos borrados correctamente.");
      confirmationModal.style.display = 'none'; // Ocultar el modal después de borrar
    })
    .catch((error) => {
      console.error("Error al borrar los datos:", error);
      confirmationModal.style.display = 'none'; // Ocultar el modal si hay un error
    });
});

// Cancelar el borrado
cancelDeleteButton.addEventListener('click', function() {
  confirmationModal.style.display = 'none';
});










console.log(database);

