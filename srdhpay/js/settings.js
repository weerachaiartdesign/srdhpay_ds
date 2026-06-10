// settings.js
document.addEventListener('DOMContentLoaded', () => {
  const tabs = document.querySelectorAll('.tab-btn');
  tabs.forEach(btn => btn.addEventListener('click', () => {
    tabs.forEach(b => b.classList.replace('bg-purple-600','bg-purple-200'));
    btn.classList.replace('bg-purple-200','bg-purple-600');
    const tab = btn.dataset.tab;
    loadTabContent(tab);
  }));
  loadTabContent('fiscal');
});

async function loadTabContent(tab) {
  const container = document.getElementById('tabContent');
  switch(tab) {
    case 'fiscal':
      const fiscal = await apiCall('getFiscalYear');
      container.innerHTML = `
        <h3 class="font-semibold mb-2">ปีงบประมาณปัจจุบัน: ${fiscal.currentYear}</h3>
        <label>เริ่มวันที่: <input type="date" value="${fiscal.startDate}" id="fiscalStart" class="border p-1 rounded"></label>
        <label class="ml-4">สิ้นสุด: <input type="date" value="${fiscal.endDate}" id="fiscalEnd" class="border p-1 rounded"></label>
        <button class="btn-primary mt-2" onclick="saveFiscal()">บันทึก</button>`;
      break;
    case 'moneyType':
      const moneyTypes = await apiCall('getMoneyTypes');
      renderMoneyTypeTable(moneyTypes);
      break;
    case 'vendor':
      const vendors = await apiCall('getVendors');
      renderVendorTable(vendors);
      break;
    case 'editor':
      const editors = await apiCall('getEditors');
      container.innerHTML = `<table class="w-full">${editors.map(e => `<tr><td>${e.email}</td><td>${e.username}</td></tr>`).join('')}</table>`;
      break;
    case 'display':
      container.innerHTML = `... form กำหนดจำนวน card, top หน่วยงาน ...`;
      break;
    case 'editData':
      container.innerHTML = `
        <div class="flex gap-2 mb-3">
          <select id="searchType" class="border p-2 rounded"><option>เลขที่รับ</option><option>ใบขอเบิก</option>...</select>
          <input id="searchValue" class="border p-2 rounded flex-1">
          <button onclick="searchEditData()" class="btn-primary">ค้นหา</button>
        </div>
        <div id="editDataTable"></div>`;
      break;
    case 'backup':
      container.innerHTML = `
        <button onclick="exportData('csv')" class="bg-green-600 text-white px-4 py-2 rounded mr-2">Export CSV</button>
        <button onclick="exportData('xlsx')" class="bg-blue-600 text-white px-4 py-2 rounded mr-2">Export XLSX</button>
        <input type="file" id="restoreFile" accept=".json,.csv" class="mt-2">
        <button onclick="restoreData()" class="bg-purple-600 text-white px-4 py-2 rounded">Restore</button>`;
      break;
  }
}

function renderMoneyTypeTable(types) {
  const container = document.getElementById('tabContent');
  container.innerHTML = `
    <table class="w-full text-sm">
      <thead><tr><th>ลำดับ</th><th>ประเภทเงิน</th><th>สี</th></tr></thead>
      <tbody>${types.map((t,i) => `<tr>
        <td>${i+1}</td><td contenteditable="true" data-field="type">${t.type}</td>
        <td><input type="color" value="${t.color}" data-field="color"></td>
      </tr>`).join('')}</tbody>
    </table>
    <button class="btn-primary mt-2" onclick="saveMoneyTypes()">บันทึก</button>`;
}

// ... functions for save, export, restore using apiCall ...