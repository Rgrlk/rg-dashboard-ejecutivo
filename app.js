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
    const headers = lines[0].split(',');
    
    return lines.slice(1).map(line => {
        // Esta regex separa por comas pero respeta las que están dentro de comillas
        const values = line.match(/(".*?"|[^",]+)(?=\s*,|\s*$)/g);
        if (!values || values.length < 10) return null;

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
    records.sort((a, b) => parseInt(b.score) - parseInt(a.score));

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
