const API_BASE = 'https://dvkvmjdefaytycdbsntd.supabase.co/rest/v1';
const API_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR2a3ZtamRlZmF5dHljZGJzbnRkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM3MjE1MjAsImV4cCI6MjA1OTI5NzUyMH0.wYHbfTAJyIp2CLfU4LcIJfJAMrVq41zUK6kw5GZ01ts';

async function obtenerAlumnos() {
    const res = await fetch(`${API_BASE}/alumno`, {
        headers: {
            apikey: API_KEY,
            Authorization: `Bearer ${API_KEY}`,
            'Content-Type': 'application/json'
        }
    });

    if (!res.ok) throw new Error('Error al obtener alumnos');
    return await res.json();
}

async function guardarAlumno(alumno) {
    const res = await fetch(`${API_BASE}/alumno`, {
        method: 'POST',
        headers: {
            'apikey': API_KEY,
            'Authorization': `Bearer ${API_KEY}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(alumno)
    });

    if (!res.ok) {
        throw new Error('Error al guardar el alumno');
    }

    // Solo intentar convertir en JSON si hay contenido
    const text = await res.text();
    return text ? JSON.parse(text) : null;
}

async function alumnoExiste(codigo) {
    const res = await fetch(`${API_BASE}/alumno?codigo=eq.${codigo}`, {
        headers: {
            'apikey': API_KEY,
            'Authorization': `Bearer ${API_KEY}`
        }
    });
    const data = await res.json();
    return data.length > 0;
}
