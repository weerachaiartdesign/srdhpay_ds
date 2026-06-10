// payment.js
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('btnPay')?.addEventListener('click', payAction);
  loadPaymentTable();
});

async function loadPaymentTable() {
  const data = await apiCall('list', { module: 'payment', filters: { status: 'อนุมัติ' } });
  const rows = data.rows.filter(r => r.STATUS === 'อนุมัติ');
  renderPaymentTable(rows);
}

function renderPaymentTable(rows) {
  const div = document.getElementById('paymentTable');
  div.innerHTML = `
    <table class="w-full text-sm">
      <thead><tr>
        <th><input type="checkbox" id="selectAll"></th>
        <th>เลขที่ฎีกา</th><th>ผู้ขาย</th><th>จำนวนเงิน</th><th>ประเภทเงิน</th><th>หน่วยงาน</th>
      </tr></thead>
      <tbody>
        ${rows.map(r => `<tr>
          <td><input type="checkbox" value="${r.UUID}"></td>
          <td>${r.DK_NO_DISPLAY}</td>
          <td>${r.VENDOR}</td>
          <td class="font-bold">${formatMoney(r.AMOUNT)}</td>
          <td>${r.MONEY_TYPE}</td>
          <td>${r.DEPT}</td>
        </tr>`).join('')}
      </tbody>
    </table>`;
  document.getElementById('selectAll').addEventListener('change', function(e) {
    document.querySelectorAll('tbody input[type="checkbox"]').forEach(cb => cb.checked = e.target.checked);
  });
}

async function payAction() {
  const uuids = [...document.querySelectorAll('tbody input[type="checkbox"]:checked')].map(cb => cb.value);
  if (!uuids.length) { Swal.fire('กรุณาเลือก', 'เลือกรายการเพื่อจ่าย', 'warning'); return; }
  await apiCall('paymentPay', { uuids });
  Swal.fire('จ่ายเช็คแล้ว', 'สถานะเปลี่ยนเป็นจ่ายแล้ว', 'success');
  loadPaymentTable();
}

// Inject elements
window.addEventListener('load', () => {
  const container = document.getElementById('paymentTable');
  const btnGroup = document.createElement('div');
  btnGroup.className = 'flex space-x-2 my-3';
  btnGroup.innerHTML = `<button id="btnPay" class="bg-purple-600 text-white px-4 py-2 rounded">จ่ายเช็ค</button>`;
  container.parentNode.insertBefore(btnGroup, container);
  document.getElementById('btnPay').addEventListener('click', payAction);
});