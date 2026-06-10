// import.js – นำเข้าข้อมูล
let previewRows = [];

document.addEventListener('DOMContentLoaded', () => {
  const dropZone = document.getElementById('dropZone');
  const fileInput = document.getElementById('fileInput');
  dropZone.addEventListener('click', () => fileInput.click());
  dropZone.addEventListener('dragover', (e) => e.preventDefault());
  dropZone.addEventListener('drop', handleDrop);
  fileInput.addEventListener('change', handleFile);

  document.getElementById('addManualBtn').addEventListener('click', openManualForm);
  document.getElementById('registerBtn').addEventListener('click', registerBatch);
});

function handleDrop(e) {
  e.preventDefault();
  const file = e.dataTransfer.files[0];
  processFile(file);
}

function handleFile(e) {
  const file = e.target.files[0];
  processFile(file);
}

function processFile(file) {
  if (file.size > 5*1024*1024) { Swal.fire('ไฟล์ใหญ่เกิน','สูงสุด 5MB','error'); return; }
  const reader = new FileReader();
  reader.onload = function(e) {
    const data = new Uint8Array(e.target.result);
    const workbook = XLSX.read(data, { type: 'array' });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const json = XLSX.utils.sheet_to_json(sheet, { header: 1 });
    const headers = json[0];
    previewRows = json.slice(1).map(row => ({
      MONEY_TYPE: row[0]||'', REQUEST_NO: row[1]||'', DK_NO: row[2]||'', EGP_NO: row[3]||'',
      VENDOR: row[4]||'', AMOUNT: (parseFloat(row[5])||0) + (parseFloat(row[6])||0), DESCRIPTION: row[7]||''
    }));
    renderPreview();
  };
  reader.readAsArrayBuffer(file);
}

function renderPreview() {
  document.getElementById('previewContainer').classList.remove('hidden');
  const tbody = document.getElementById('previewBody');
  tbody.innerHTML = previewRows.map((r,i) => `
    <tr>
      <td>${i+1}</td><td>${r.MONEY_TYPE}</td><td>${r.REQUEST_NO}</td><td>${r.VENDOR}</td>
      <td>${formatMoney(r.AMOUNT)}</td><td contenteditable="true" data-field="DESCRIPTION" data-index="${i}">${r.DESCRIPTION||''}</td>
      <td><button onclick="editRow(${i})" class="text-blue-500">✏️</button></td>
    </tr>
  `).join('');
  // inline editing logic
  document.querySelectorAll('[contenteditable]').forEach(el => {
    el.addEventListener('blur', function() {
      const idx = this.dataset.index;
      const field = this.dataset.field;
      previewRows[idx][field] = this.textContent.trim();
    });
  });
  document.getElementById('registerBtn').disabled = false;
}

function editRow(idx) {
  // เปิด popup แก้ไขละเอียด
}

async function registerBatch() {
  // validate limit, etc.
  try {
    const result = await apiCall('importRegister', { rows: previewRows });
    Swal.fire('ลงทะเบียนสำเร็จ', `เลขที่ ${result.registerNo}`, 'success');
    previewRows = [];
    document.getElementById('previewContainer').classList.add('hidden');
    document.getElementById('registerBtn').disabled = true;
    // เปิด print preview
    window.open(`print.html?register=${result.registerNo}`, '_blank');
  } catch(e) {}
}