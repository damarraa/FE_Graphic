let state = {
    dates: [],
    parts: {},
    view: {
        startIndex: 0,
        pageSize: 15
    }
};

let chart;

function handleAddDate() {
    const input = document.getElementById("dateInput");
    if (!input.value) return;

    state.dates.push(input.value);
    Object.keys(state.parts).forEach(p => state.parts[p].push(null));

    input.value = "";
    autoSave();
    render();
}

function addPart() {
    const name = prompt("Nama Part:");
    if (!name) return;

    state.parts[name] = state.dates.map(() => null);
    autoSave();
    render();
}

function nextDates() {
    if (state.view.startIndex + state.view.pageSize < state.dates.length) {
        state.view.startIndex += state.view.pageSize;
        render();
    }
}

function prevDates() {
    if (state.view.startIndex > 0) {
        state.view.startIndex -= state.view.pageSize;
        render();
    }
}

function renderTable() {
    const { startIndex, pageSize } = state.view;
    const visibleDates = state.dates.slice(startIndex, startIndex + pageSize);

    const dateRow = document.getElementById("dateRow");
    dateRow.innerHTML =
        "<th>Part / Tanggal</th>" +
        visibleDates.map(d => `<th>${d}</th>`).join("");

    const tbody = document.getElementById("tableBody");
    tbody.innerHTML = "";

    Object.keys(state.parts).forEach(part => {
        let row = `<tr><td>${part}</td>`;
        visibleDates.forEach((_, i) => {
            const realIndex = startIndex + i;
            row += `
        <td>
          <input type="number"
            value="${state.parts[part][realIndex] ?? ""}"
            onchange="updateValue('${part}', ${realIndex}, this.value)"
          />
        </td>`;
        });
        row += "</tr>";
        tbody.innerHTML += row;
    });
}

function updateValue(part, index, value) {
    state.parts[part][index] = value === "" ? null : Number(value);
    autoSave();
    renderChart();
}

function renderChart() {
    const { startIndex, pageSize } = state.view;
    const labels = state.dates.slice(startIndex, startIndex + pageSize);

    if (chart) chart.destroy();

    chart = new Chart(document.getElementById("chartCanvas"), {
        type: "line",
        data: {
            labels,
            datasets: Object.keys(state.parts).map(part => ({
                label: part,
                data: state.parts[part].slice(startIndex, startIndex + pageSize),
                tension: 0.3,
                borderWidth: 2
            }))
        },
        options: {
            responsive: true,
            plugins: {
                legend: { position: "bottom" }
            }
        }
    });
}

function autoSave() {
    localStorage.setItem("tableData", JSON.stringify(state));
}

function manualSave() {
    autoSave();
    alert("Data berhasil disimpan");
}

function loadData() {
    const saved = localStorage.getItem("tableData");
    if (!saved) return;

    state = JSON.parse(saved);
}

function render() {
    renderTable();
    renderChart();
}

loadData();
render();
