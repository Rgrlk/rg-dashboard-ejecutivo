// Configuración de la fuente de datos
const DATA_SOURCE = 'data/dashboard_oportunidades_rgrlk.csv';

document.addEventListener('DOMContentLoaded', () => {
    loadData();
});

async function loadData() {
    try {
        const response = await fetch(DATA_SOURCE);
        const csvText = await response.text();
        const records = parseCSV(csvText);
        
        renderDashboard(records);
    } catch (error) {
        console.error('Error cargando el radar:', error);
    }
}

function parseCSV(text) {
    const lines = text.split('\n');
    const headers = lines[0].split(',');
    
    return lines.slice(1).filter(line => line.trim() !== '').map(line => {
        // Lógica simple para manejar comas dentro de comillas en las Notas
        const values = line.match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g);
        if (!values) return null;

        return {
            id: values[0],
            puesto: values[2],
            empresa: values[3],
            ubicacion: values[5],
            fuente: values[7],
            score: parseInt(values[8]),
            categoria: values[9],
            link: values[15] ? values[15].replace(/"/g, '') : '#'
        };
    }).filter(r => r !== null);
}

function renderDashboard(records) {
    const tableBody = document.getElementById('table-body');
    const totalCount = document.getElementById('total-count');
    const aPlusCount = document.getElementById('aplus-count');

    // Limpiar tabla
    tableBody.innerHTML = '';

    // Actualizar KPIs
    totalCount.textContent = records.length;
    const aPlus = records.filter(r => r.categoria === 'A+').length;
    aPlusCount.textContent = aPlus;

    // Ordenar por Score (Descendente)
    records.sort((a, b) => b.score - a.score);

    // Inyectar Filas
    records.forEach(repo => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td><span class="score-badge">${repo.score}</span></td>
            <td><strong>${repo.puesto}</strong></td>
            <td>${repo.empresa}</td>
            <td>${repo.ubicacion}</td>
            <td>${repo.fuente}</td>
            <td>
                <a href="${repo.link}" target="_blank" class="btn-go">
                    VER OFERTA 🚀
                </a>
            </td>
        `;
        tableBody.appendChild(row);
    });
}
