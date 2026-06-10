// receive.js – รับเข้าระบบ
let waitingRows = [];
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('checkRegister').addEventListener('click', loadWaiting);
  document.getElementById('receiveBtn').addEventListener('click', receiveConfirm);
});

async function loadWaiting() {
  waitingRows = await apiCall('receiveList');
  renderReceiveTable(waitingRows);
}

function renderReceiveTable(rows) {
  const div = document.getElementById('receiveTable');
  div.innerHTML = `<table class="w-full text-sm">
    <thead><tr><th>เลือก</th><th>เลขที่ลงทะเบียน</th><th>วันที่ลงทะเบียน</th><th>ประเภทเงิน</th><th>ผู้ส่ง</th><th>จำนวน</th></tr></thead>
    <tbody>${rows.map(r => `<tr>
      <td><input type="checkbox" value="${r.UUID}"></td>
      <td>${r.REGISTER_NO_DISPLAY}</td><td>${r.REGISTER_DATE}</td><td>${r.MONEY_TYPE}</td><td>${r.SENDER}</td>
      <td>${formatMoney(r.AMOUNT)}</td>
    </tr>`).join('')}</tbody></table>`;
}

async function receiveConfirm() {
  const selected = [...document.querySelectorAll('input:checked')].map(cb => cb.value);
  if (!selected.length) return Swal.fire('กรุณาเลือกรายการ');
  await apiCall('receiveConfirm', { uuids: selected });
  Swal.fire('รับเข้าระบบสำเร็จ');
  loadWaiting();
}