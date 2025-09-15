const downloadButton = document.querySelector('.download');

function downloadCSV() {
  const qubesTable = document.querySelector('#qubes');
  const rows = Array.from(qubesTable.querySelectorAll('tr')).map((row) =>
    Array.from(row.querySelectorAll('th,td')).map((cell) => cell.textContent)
  );
  const filename = 'baqup-qubes.csv';
  const csvContent = rows
    .map((row) => row.map((cell) => `"${cell}"`).join(','))
    .join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.setAttribute('download', filename);
  a.style.display = 'none';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}
function handleFile(file) {
  let reader = new FileReader();
  reader.onload = (event) => {
    let jsonData = JSON.parse(event.target.result);
    addQubesToTable(jsonData);
  };
  reader.readAsText(file);
}

document.querySelector('.dropzone').addEventListener('drop', (e) => {
  e.preventDefault();
  let file = e.dataTransfer.files[0];
  handleFile(file);
  downloadButton.classList.remove('hidden');
});

document.querySelector('input[type=file]').addEventListener('change', (e) => {
  let file = e.target.files[0];
  handleFile(file);
  downloadButton.classList.remove('hidden');
});

function formatQube(tableBody, qube, isArchived) {
  const row = tableBody.insertRow();
  const cells = [
    row.insertCell(),
    row.insertCell(),
    row.insertCell(),
    row.insertCell(),
    row.insertCell(),
    row.insertCell(),
    row.insertCell(),
    row.insertCell(),
    row.insertCell(),
    row.insertCell(),
    row.insertCell(),
    row.insertCell(),
    row.insertCell(),
    row.insertCell(),
    row.insertCell(),
    row.insertCell(),
    row.insertCell(),
    row.insertCell(),
    row.insertCell(),
    row.insertCell(),
  ];
  cells[0].innerHTML = qube.name;
  cells[1].innerHTML = qube.type;
  switch (qube.type) {
    case 'billing': {
      cells[2].innerHTML = qube.billqube?.spend_avg_12_months;
      cells[3].innerHTML = qube.billqube?.spend_avg_6_months;
      cells[4].innerHTML = qube.billqube?.spend_avg_3_months;
      cells[6].innerHTML = qube.billqube.bill_amount;
      cells[10].innerHTML = qube?.billqube?.next_due_date;
      cells[11].innerHTML = qube?.billqube?.payment_card?.galileo_prn;
      cells[12].innerHTML = qube?.billqube?.payment_card?.card_number;
      cells[15].innerHTML = qube.billqube?.payment_frequency;
      break;
    }
    case 'goal': {
      cells[2].innerHTML = qube.goalqube?.spend_avg_12_months;
      cells[3].innerHTML = qube.goalqube?.spend_avg_6_months;
      cells[4].innerHTML = qube.goalqube?.spend_avg_3_months;
      cells[6].innerHTML = qube.goalqube?.goal_amount;
      cells[16].innerHTML = qube.goalqube?.suggested_goal_amount;
      cells[17].innerHTML = qube.goalqube?.suggested_goal_date;
      cells[18].innerHTML = qube.goalqube?.suggested_budget;
      break;
    }
    case 'spending': {
      cells[2].innerHTML = qube.spendingqube?.spend_avg_12_months;
      cells[3].innerHTML = qube.spendingqube?.spend_avg_6_months;
      cells[4].innerHTML = qube.spendingqube?.spend_avg_3_months;
      cells[6].innerHTML = '-';
      break;
    }
  }
  cells[5].innerHTML = qube?.budget;
  cells[7].innerHTML = qube?.creation_datetime;

  cells[8].innerHTML = qube?.balance;
  cells[9].innerHTML = qube?.group;
  cells[13].innerHTML = qube?.description;
  cells[14].innerHTML = qube?.last_activity_datetime;
  cells[19].innerHTML = isArchived ? 'Archived' : '';
}

function addQubesToTable(jsonData) {
  const template_common = ['name', 'type', 'budget'];

  const tableBody = document.querySelector('#qubes > tbody');

  jsonData.qubes.qubes.forEach((qube) => formatQube(tableBody, qube, false));
  jsonData.qubes.archivedQubes.forEach((qube) =>
    formatQube(tableBody, qube, true)
  );
}
