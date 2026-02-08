let appData = {
    dates: [],
    parts: {},
    startDate: '',
    endDate: ''
};

let tempParts = [];
let myChart = null;

function addPart() {
    const input = document.getElementById('newPartInput');
    const name = input.value.trim();

    if (!name) return;
    if (tempParts.includes(name)) {
        alert("Nama part sudah ada!");
        return;
    }

    tempParts.push(name);
    renderPartList();
    input.value = '';
    input.focus();
}

function removePart(index) {
    tempParts.splice(index, 1);
    renderPartList();
}

function renderPartList() {
    const ul = document.getElementById('partList');
    ul.innerHTML = '';

    tempParts.forEach((part, index) => {
        const li = document.createElement('li');
        li.className = 'part-item';
        li.innerHTML = `
            ${part} 
            <span class="delete-tag" onclick="removePart(${index})">&times;</span>
        `;
        ul.appendChild(li);
    });
}

function handleEnter(e) {
    if (e.key === 'Enter') addPart();
}

function getDatesInRange(startDate, endDate) {
    const date = new Date(startDate);
    const end = new Date(endDate);
    const dates = [];

    while (date <= end) {
        dates.push(new Date(date).toLocaleDateString('id-ID'));
        date.setDate(date.getDate() + 1);
    }
    return dates;
}

function generateWorkspace() {
    const startInput = document.getElementById('startDate').value;
    const endInput = document.getElementById('endDate').value;

    if (!startInput || !endInput) return alert("Harap isi rentang tanggal!");
    if (new Date(startInput) > new Date(endInput)) return alert("Tanggal mulai tidak boleh lebih besar dari akhir!");
    if (tempParts.length === 0) return alert("Harap masukkan minimal satu Part!");

    appData.startDate = startInput;
    appData.endDate = endInput;

    appData.dates = getDatesInRange(startInput, endInput);

    appData.parts = {};
    tempParts.forEach(part => {
        appData.parts[part] = new Array(appData.dates.length).fill(null);
    });

    toggleView('workspace');

    renderTable();
    initChart();
}

function renderTable() {
    const headerRow = document.getElementById('headerRow');
    const tableBody = document.getElementById('tableBody');

    headerRow.innerHTML = '<th class="sticky-col">Nama Part</th>';
    appData.dates.forEach(date => {
        const th = document.createElement('th');
        th.innerText = date;
        headerRow.appendChild(th);
    });

    tableBody.innerHTML = '';

    for (const [partName, values] of Object.entries(appData.parts)) {
        const tr = document.createElement('tr');

        const tdName = document.createElement('td');
        tdName.className = 'sticky-col';
        tdName.innerText = partName;
        tr.appendChild(tdName);

        values.forEach((val, index) => {
            const td = document.createElement('td');
            const input = document.createElement('input');

            input.type = 'number';
            input.className = 'cell-input';
            input.placeholder = '-';
            input.value = (val === null || val === undefined) ? '' : val;

            input.onchange = (e) => {
                const newValue = e.target.value === '' ? null : parseFloat(e.target.value);
                appData.parts[partName][index] = newValue;
                updateChartData();
            };

            td.appendChild(input);
            tr.appendChild(td);
        });

        tableBody.appendChild(tr);
    }
}

function initChart() {
    const ctx = document.getElementById('myChart').getContext('2d');

    if (myChart) myChart.destroy();

    myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: appData.dates,
            datasets: []
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            interaction: {
                mode: 'index',
                intersect: false,
            },
            plugins: {
                legend: { position: 'bottom' }
            },
            scales: {
                y: { beginAtZero: true }
            }
        }
    });

    updateChartData();
}

function updateChartData() {
    if (!myChart) return;

    const datasets = Object.keys(appData.parts).map((partName, index) => {
        const hue = (index * 137) % 360;
        const color = `hsl(${hue}, 70%, 50%)`;

        return {
            label: partName,
            data: appData.parts[partName],
            borderColor: color,
            backgroundColor: color,
            borderWidth: 2,
            tension: 0.1,
            pointRadius: 3,
            fill: false,
            spanGaps: true
        };
    });

    myChart.data.datasets = datasets;
    myChart.update();
}

function toggleView(viewName) {
    const setupPanel = document.getElementById('setupPanel');
    const workspace = document.getElementById('workspace');

    if (viewName === 'workspace') {
        setupPanel.style.display = 'none';
        workspace.style.display = 'block';
    } else {
        setupPanel.style.display = 'block';
        workspace.style.display = 'none';
    }
}

function backToSetup() {
    if (confirm("Perhatian: Data yang belum disimpan akan hilang jika mengubah konfigurasi. Lanjut?")) {
        toggleView('setup');
        tempParts = Object.keys(appData.parts);
        renderPartList();
    }
}

function saveData() {
    const payload = JSON.stringify({
        appData: appData,
        tempParts: Object.keys(appData.parts)
    });
    localStorage.setItem('project_pertamina_v1', payload);
    alert("Data berhasil disimpan!");
}

function loadData() {
    const saved = localStorage.getItem('project_pertamina_v1');
    if (saved) {
        const parsed = JSON.parse(saved);
        appData = parsed.appData;
        tempParts = parsed.tempParts || [];

        document.getElementById('startDate').value = appData.startDate;
        document.getElementById('endDate').value = appData.endDate;

        renderPartList();

        if (appData.dates.length > 0) {
            toggleView('workspace');
            renderTable();
            initChart();
        }
    }
}

function resetData() {
    if (confirm("Yakin ingin mereset semua data? Data tersimpan akan dihapus.")) {
        localStorage.removeItem('project_pertamina_v1');
        location.reload();
    }
}

window.onload = loadData;