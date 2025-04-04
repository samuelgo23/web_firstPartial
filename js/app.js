const addNewStudentBtn = document.getElementById('addNewStudent');
const volverBtn = document.getElementById('volverBtn');
const formView = document.getElementById('formView');
const mainView = document.getElementById('mainView');
const studentForm = document.getElementById('studentForm');
const profileView = document.getElementById('profileView');
const volverDesdePerfil = document.getElementById('volverDesdePerfil');

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
        clone.querySelector('.student-id').textContent = `Código: ${alumno.codigo}`;
        clone.querySelector('.student-email').textContent = `Email: ${alumno.email || '—'}`;
        clone.querySelector('.student-phone').textContent = `Tel: ${alumno.telefono || '—'}`;
        
        const foto = alumno.foto?.trim() || 'https://randomuser.me/api/portraits/lego/1.jpg';
        clone.querySelector('.student-thumb').src = foto;

        // Botón Editar
        clone.querySelector('.btn-outline-warning').addEventListener('click', () => {
            abrirFormularioEditar(alumno);
        });

        clone.querySelector('.btn-outline-info').addEventListener('click', () => {
            mostrarPerfil(alumno);
        });

        studentsList.appendChild(clone);
    });
}

function mostrarPerfil(alumno) {
    // Ocultar otras vistas
    mainView.classList.add('d-none');
    formView.classList.add('d-none');
    profileView.classList.remove('d-none');

    // Llenar datos del perfil
    perfilFoto.src = alumno.foto?.trim() || 'https://randomuser.me/api/portraits/lego/1.jpg';
    perfilNombre.textContent = alumno.nombre;
    perfilCodigo.textContent = `Código: ${alumno.codigo}`;
    perfilEmail.textContent = alumno.email || '—';
    perfilTelefono.textContent = alumno.telefono || '—';
    perfilNacimiento.textContent = alumno.fecha_nacimiento || '—';
    perfilDireccion.textContent = alumno.direccion || '—';
    perfilGithub.href = alumno.github || '#';
    perfilGithub.textContent = alumno.github || 'No disponible';
}

volverDesdePerfil.addEventListener('click', () => {
    profileView.classList.add('d-none');
    mainView.classList.remove('d-none');
});

function abrirFormularioEditar(alumno) {
    mostrarFormulario();

    studentForm.codigo.value = alumno.codigo;
    studentForm.nombre.value = alumno.nombre;
    studentForm.email.value = alumno.email || '';
    studentForm.telefono.value = alumno.telefono || '';
    studentForm.fecha_nacimiento.value = alumno.fecha_nacimiento || '';
    studentForm.direccion.value = alumno.direccion || '';

    studentForm.codigo.disabled = true;
}

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
