const DATA_SOURCE = 'datos/dashboard_oportunidades_rgrlk.csv';

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
        console.error('Error en el radar:', error);
    }
}

function parseCSV(text) {
    const lines = text.split('\n').filter(line => line.trim() !== '');
    // Buscamos la línea que empieza con "ID" para saber dónde empiezan los datos reales
    const startIndex = lines.findIndex(l => l.startsWith('ID,'));
    if (startIndex === -1) return [];

    const dataLines = lines.slice(startIndex + 1);
    
    return dataLines.map(line => {
        // Separador por comas que respeta comillas
        const values = line.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);
        
        // Si la línea no tiene suficientes columnas o es "basura", la ignoramos
        if (values.length < 10 || isNaN(parseInt(values[0]))) return null;

        return {
            score: values[8] ? values[8].trim() : '0',
            puesto: values[2] ? values[2].replace(/"/g, '').trim() : 'N/A',
            empresa: values[3] ? values[3].replace(/"/g, '').trim() : 'N/A',
            ubicacion: values[5] ? values[5].replace(/"/g, '').trim() : 'N/A',
            fuente: values[7] ? values[7].replace(/"/g, '').trim() : 'N/A',
            categoria: values[9] ? values[9].replace(/"/g, '').trim() : 'B',
            link: values[15] ? values[15].replace(/"/g, '').trim() : '#'
        };
    }).filter(r => r !== null);
}

function renderDashboard(records) {
    const tableBody = document.getElementById('table-body');
    const totalCount = document.getElementById('total-count');
    const aPlusCount = document.getElementById('aplus-count');

    totalCount.textContent = records.length;
    const aPlus = records.filter(r => r.categoria.includes('A+')).length;
    aPlusCount.textContent = aPlus;

    tableBody.innerHTML = '';
    // Ordenar de mayor a menor score
    records.sort((a, b) => (parseInt(b.score) || 0) - (parseInt(a.score) || 0));

    records.forEach(repo => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td><span class="score-badge">${repo.score}</span></td>
            <td><strong>${repo.puesto}</strong></td>
            <td>${repo.empresa}</td>
            <td>${repo.ubicacion}</td>
            <td>${repo.fuente}</td>
            <td><a href="${repo.link}" target="_blank" class="btn-go">VER OFERTA 🚀</a></td>
        `;
        tableBody.appendChild(row);
    });
}
