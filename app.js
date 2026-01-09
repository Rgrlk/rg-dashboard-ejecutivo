const DATA_SOURCE = 'datos/dashboard_oportunidades_rgrlk.csv';

document.addEventListener('DOMContentLoaded', () => loadData());

async function loadData() {
    try {
        const response = await fetch(DATA_SOURCE + '?v=' + Date.now());
        const csvText = await response.text();
        const records = parseCSV(csvText);
        renderDashboard(records);
    } catch (e) { console.error("Error:", e); }
}

function parseCSV(text) {
    const lines = text.split('\n');
    const result = [];
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        // REGLA DE ORO: Solo procesar líneas que empiecen con un número (ID)
        if (!/^\d+/.test(line)) continue; 

        const v = line.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);
        if (v.length >= 10) {
            result.push({
                score: v[8] ? v[8].trim() : '0',
                puesto: v[2] ? v[2].replace(/"/g, '').trim() : 'N/A',
                empresa: v[3] ? v[3].replace(/"/g, '').trim() : 'N/A',
                ubicacion: v[5] ? v[5].replace(/"/g, '').trim() : 'N/A',
                fuente: v[7] ? v[7].replace(/"/g, '').trim() : 'N/A',
                categoria: v[9] ? v[9].replace(/"/g, '').trim() : 'B',
                link: v[15] ? v[15].replace(/"/g, '').trim() : '#'
            });
        }
    }
    return result;
}

function renderDashboard(records) {
    const tableBody = document.getElementById('table-body');
    document.getElementById('total-count').textContent = records.length;
    document.getElementById('aplus-count').textContent = records.filter(r => r.categoria.includes('A+')).length;
    tableBody.innerHTML = '';
    records.sort((a, b) => parseInt(b.score) - parseInt(a.score));
    records.forEach(repo => {
        const row = document.createElement('tr');
        row.innerHTML = `<td><span class="score-badge">${repo.score}</span></td><td><strong>${repo.puesto}</strong></td><td>${repo.empresa}</td><td>${repo.ubicacion}</td><td>${repo.fuente}</td><td><a href="${repo.link}" target="_blank" class="btn-go">VER OFERTA 🚀</a></td>`;
        tableBody.appendChild(row);
    });
}
