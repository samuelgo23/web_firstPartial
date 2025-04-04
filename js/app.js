document.addEventListener('DOMContentLoaded', () => {
    const addNewStudentBtn = document.getElementById('addNewStudent');
    const volverBtn = document.getElementById('volverBtn');
    const formView = document.getElementById('formView');
    const mainView = document.getElementById('mainView');
    const studentForm = document.getElementById('studentForm');
    const profileView = document.getElementById('profileView');
    const volverAlListado = document.getElementById('volverAlListado');
    const listaAsignaturas = document.getElementById('listaAsignaturas');
    const formAgregarAsignatura = document.getElementById('formAgregarAsignatura');
    const selectAsignatura = document.getElementById('selectAsignatura');
    const perfilFoto = document.getElementById('perfilFoto');
    const perfilNombre = document.getElementById('perfilNombre');
    const perfilCodigo = document.getElementById('perfilCodigo');
    const perfilEmail = document.getElementById('perfilEmail');
    const perfilTelefono = document.getElementById('perfilTelefono');
    const perfilNacimiento = document.getElementById('perfilNacimiento');
    const perfilDireccion = document.getElementById('perfilDireccion');

    let alumnoActivo = null;

    async function cargarAlumnos() {
        try {
            const alumnos = await obtenerAlumnos();
            mostrarAlumnos(alumnos);
        } catch (err) {
            console.error(err);
        }
    }

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

            clone.querySelector('.btn-outline-warning').addEventListener('click', () => {
                abrirFormularioEditar(alumno);
            });

            clone.querySelector('.btn-ver-perfil').addEventListener('click', () => {
                mostrarPerfil(alumno);
            });

            studentsList.appendChild(clone);
        });
    }

    function mostrarPerfil(alumno) {
        alumnoActivo = alumno;
        perfilFoto.src = alumno.foto?.trim() || 'https://randomuser.me/api/portraits/lego/1.jpg';
        perfilNombre.textContent = alumno.nombre;
        perfilCodigo.textContent = alumno.codigo;
        perfilEmail.textContent = alumno.email || 'N/A';
        perfilTelefono.textContent = alumno.telefono || 'N/A';
        perfilNacimiento.textContent = alumno.fecha_nacimiento || 'N/A';
        perfilDireccion.textContent = alumno.direccion || 'N/A';

        mainView.classList.add('d-none');
        formView.classList.add('d-none');
        profileView.classList.remove('d-none');
        setTimeout(() => profileView.classList.add('fade-in'), 10);

        cargarAsignaturasDelAlumno(alumno.codigo);
        cargarAsignaturasDisponibles();
    }

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
        profileView.classList.add('d-none');
        formView.classList.remove('d-none');
        setTimeout(() => formView.classList.add('fade-in'), 10);
    }

    function ocultarFormulario() {
        formView.classList.remove('fade-in');
        setTimeout(() => {
            formView.classList.add('d-none');
            mainView.classList.remove('d-none');
            setTimeout(() => mainView.classList.add('fade-in'), 10);
        }, 300);
    }

    addNewStudentBtn.addEventListener('click', mostrarFormulario);
    volverBtn.addEventListener('click', ocultarFormulario);

    studentForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const formData = new FormData(studentForm);
        const alumno = Object.fromEntries(formData.entries());

        if (!studentForm.codigo.disabled && await alumnoExiste(alumno.codigo)) {
            alert('Ya existe un alumno con ese código');
            return;
        }

        try {
            await guardarAlumno(alumno);
            alert('Alumno guardado correctamente');
            studentForm.reset();
            ocultarFormulario();
            cargarAlumnos();
        } catch (error) {
            console.error(error);
            alert('Error al guardar el alumno');
        }
    });

    volverAlListado.addEventListener('click', () => {
        profileView.classList.add('d-none');
        mainView.classList.remove('d-none');
    });

    async function cargarAsignaturasDelAlumno(codigoAlumno) {
        const res = await fetch(`${API_BASE}/matricula?codigo_alumno=eq.${codigoAlumno}&select=asignatura(*)`, {
            headers: {
                apikey: API_KEY,
                Authorization: `Bearer ${API_KEY}`
            }
        });

        const data = await res.json();
        listaAsignaturas.innerHTML = '';

        if (data.length === 0) {
            listaAsignaturas.innerHTML = '<li class="list-group-item">No tiene asignaturas registradas</li>';
            return;
        }

        data.forEach(item => {
            const li = document.createElement('li');
            li.className = 'list-group-item d-flex justify-content-between';
            li.innerHTML = `
                <div>
                    <strong>${item.asignatura.nombre}</strong> (${item.asignatura.codigo})
                    <br><small>${item.asignatura.descripcion || 'Sin descripción'}</small>
                </div>
            `;
            listaAsignaturas.appendChild(li);
        });
    }

    async function cargarAsignaturasDisponibles() {
        const res = await fetch(`${API_BASE}/asignatura`, {
            headers: {
                apikey: API_KEY,
                Authorization: `Bearer ${API_KEY}`
            }
        });

        const data = await res.json();
        selectAsignatura.innerHTML = data.map(asig =>
            `<option value="${asig.codigo}">${asig.nombre} (${asig.codigo})</option>`
        ).join('');
    }

    formAgregarAsignatura.addEventListener('submit', async (e) => {
        e.preventDefault();
        const codigoAsignatura = selectAsignatura.value;

        const res = await fetch(`${API_BASE}/matricula`, {
            method: 'POST',
            headers: {
                apikey: API_KEY,
                Authorization: `Bearer ${API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                codigo_alumno: alumnoActivo.codigo,
                codigo_asignatura: codigoAsignatura
            })
        });

        if (res.ok) {
            alert('Asignatura agregada correctamente');
            cargarAsignaturasDelAlumno(alumnoActivo.codigo);
        } else {
            alert('Error al agregar asignatura');
        }
    });

    cargarAlumnos();
});