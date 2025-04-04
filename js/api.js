const API_BASE = 'https://dvkvmjdefaytycdbsntd.supabase.co/rest/v1';
const API_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR2a3ZtamRlZmF5dHljZGJzbnRkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM3MjE1MjAsImV4cCI6MjA1OTI5NzUyMH0.wYHbfTAJyIp2CLfU4LcIJfJAMrVq41zUK6kw5GZ01ts';

const studentsList = document.getElementById('studentsList');
const template = document.getElementById('studentCardTemplate');

async function cargarAlumnos() {
    try {
        const response = await fetch(`${API_BASE}/alumno`, {
            headers: {
                'apikey': API_KEY,
                'Authorization': `Bearer ${API_KEY}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error('Error al cargar alumnos');
        }

        const alumnos = await response.json();
        mostrarAlumnos(alumnos);
    } catch (error) {
        console.error('Error:', error);
    }
}

function mostrarAlumnos(alumnos) {
    studentsList.innerHTML = '';
    alumnos.forEach(alumno => {
        const clone = template.content.cloneNode(true);
        clone.querySelector('.student-name').textContent = alumno.nombre;
        clone.querySelector('.student-id').textContent = `Código: ${alumno.codigo}`;
        clone.querySelector('.student-email').textContent = alumno.email;
        clone.querySelector('.student-image').src = alumno.foto || 'https://via.placeholder.com/150';
        clone.querySelector('.github-link').href = alumno.github || '#';
        studentsList.appendChild(clone);
    });
}

document.addEventListener('DOMContentLoaded', cargarAlumnos);
