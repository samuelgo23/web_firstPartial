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

        // Verifica si hay foto válida, si no usa una por defecto
        const foto = alumno.foto || alumno.photo || '';
        clone.querySelector('.student-image').src = 
            foto.trim() !== '' 
                ? foto 
                : 'https://randomuser.me/api/portraits/lego/1.jpg';

        clone.querySelector('.github-link').href = alumno.github || '#';
        studentsList.appendChild(clone);
    });
}



addNewStudentBtn.addEventListener('click', () => {
    mainView.classList.add('d-none');
    formView.classList.remove('d-none');
});

volverBtn.addEventListener('click', () => {
    formView.classList.add('d-none');
    mainView.classList.remove('d-none');
});

studentForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = new FormData(studentForm);
    const alumno = Object.fromEntries(formData.entries());

    console.log("Nuevo estudiante a guardar:", alumno);

    studentForm.reset();
    volverBtn.click();
});