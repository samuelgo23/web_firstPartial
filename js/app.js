const addNewStudentBtn = document.getElementById('addNewStudent');
const volverBtn = document.getElementById('volverBtn');
const formView = document.getElementById('formView');
const mainView = document.getElementById('mainView');
const studentForm = document.getElementById('studentForm');

document.addEventListener('DOMContentLoaded', async () => {
    try {
        const alumnos = await obtenerAlumnos();
        mostrarAlumnos(alumnos);
    } catch (err) {
        console.error(err);
    }
});

function mostrarAlumnos(alumnos) {
    const studentsList = document.getElementById('studentsList');
    const template = document.getElementById('studentCardTemplate');
    studentsList.innerHTML = '';

    alumnos.forEach(alumno => {
        const clone = template.content.cloneNode(true);
        clone.querySelector('.student-name').textContent = alumno.nombre;
        clone.querySelector('.student-id').textContent = `ID: ${alumno.codigo}`;
        clone.querySelector('.student-email').textContent = alumno.email;

        // Imagen por defecto si no hay foto
        const foto = alumno.foto || alumno.photo || '';
        clone.querySelector('.student-image').src = 
            foto.trim() !== '' 
                ? foto 
                : 'https://randomuser.me/api/portraits/lego/1.jpg';

        clone.querySelector('.github-link').href = alumno.github || '#';
        studentsList.appendChild(clone);
    });
}

// Mostrar formulario con transición suave
function mostrarFormulario() {
    mainView.classList.add('d-none');
    formView.classList.remove('d-none');
    setTimeout(() => formView.classList.add('fade-in'), 10);
}

// Ocultar formulario con transición suave
function ocultarFormulario() {
    formView.classList.remove('fade-in');
    setTimeout(() => {
        formView.classList.add('d-none');
        mainView.classList.remove('d-none');
        setTimeout(() => mainView.classList.add('fade-in'), 10);
    }, 300);
}

// Eventos de botones
addNewStudentBtn.addEventListener('click', mostrarFormulario);
volverBtn.addEventListener('click', ocultarFormulario);

// Evento de guardado de formulario
studentForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData(studentForm);
    const alumno = Object.fromEntries(formData.entries());

    // Validar si ya existe
    if (await alumnoExiste(alumno.codigo)) {
        alert('Ya existe un alumno con ese código');
        return;
    }

    try {
        await guardarAlumno(alumno);
        alert('Alumno guardado correctamente');

        studentForm.reset();
        ocultarFormulario();

        const alumnos = await obtenerAlumnos();
        mostrarAlumnos(alumnos);
    } catch (error) {
        console.error(error);
        alert('Error al guardar el alumno');
    }
});
