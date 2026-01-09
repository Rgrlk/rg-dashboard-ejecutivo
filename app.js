const DATA_SOURCE = 'datos/dashboard_oportunidades_rgrlk.csv';

document.addEventListener('DOMContentLoaded', () => {
    fetch(DATA_SOURCE + '?v=' + Date.now())
        .then(res => res.text())
        .then(csv => {
            const lines = csv.split('\n');
            const table = document.getElementById('table-body');
            let total = 0, aplus = 0;
            table.innerHTML = '';

            lines.forEach(line => {
                const cleanLine = line.trim();
                if (/^\d+/.test(cleanLine)) {
                    const v = cleanLine.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);
                    if (v.length >= 10) {
                        const scoreNum = parseInt(v[8]) || 0;
                        total++;
                        if (v[9] && v[9].includes('A+')) aplus++;
                        
                        const row = `<tr>
                            <td><span class="score-badge">${scoreNum}</span></td>
                            <td><strong>${(v[2] || 'N/A').replace(/"/g, '')}</strong></td>
                            <td>${(v[3] || 'N/A').replace(/"/g, '')}</td>
                            <td>${(v[5] || 'N/A').replace(/"/g, '')}</td>
                            <td>${(v[7] || 'N/A').replace(/"/g, '')}</td>
                            <td><a href="${(v[15] || '#').replace(/"/g, '')}" target="_blank" class="btn-go">VER OFERTA 🚀</a></td>
                        </tr>`;
                        table.innerHTML += row;
                    }
                }
            });
            document.getElementById('total-count').textContent = total;
            document.getElementById('aplus-count').textContent = aplus;
        })
        .catch(err => console.error(err));
});
