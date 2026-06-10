// report.js (ใช้กับ report_type.html และ report_status.html)
if (window.location.pathname.includes('report_type')) {
  document.addEventListener('DOMContentLoaded', loadReportType);
} else if (window.location.pathname.includes('report_status')) {
  document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('btnReceived')?.addEventListener('click', () => loadStatus('รับเข้าระบบ'));
    document.getElementById('btnEditing')?.addEventListener('click', () => loadStatus('ส่งแก้ไข'));
    document.getElementById('btnPending')?.addEventListener('click', () => loadStatus('เสนอ'));
  });
}

async function loadReportType() {
  const data = await apiCall('reportType');
  const container = document.getElementById('reportTypeContainer');
  if (!data || !data.types) return;
  container.innerHTML = data.types.map(type => `
    <div class="mb-6">
      <h2 class="text-lg font-bold mb-2">${type.moneyType}</h2>
      <table class="w-full text-sm">
        <thead><tr>
          <th>หน่วยงาน</th><th>ฎีกาที่รับ</th><th>จ่ายแล้ว</th><th>คงเหลือ</th>
          <th>จำนวนเงินขอเบิก</th><th>จ่ายแล้ว</th><th>คงเหลือยังไม่จ่าย</th>
        </tr></thead>
        <tbody>
          ${type.depts.map(d => `<tr>
            <td>${d.dept}</td><td>${d.received}</td><td>${d.paid}</td><td>${d.remaining}</td>
            <td>${formatMoney(d.amountTotal)}</td><td>${formatMoney(d.amountPaid)}</td><td>${formatMoney(d.amountRemaining)}</td>
          </tr>`).join('')}
        </tbody>
      </table>
    </div>
  `).join('');
}

async function loadStatus(statusFilter) {
  const dateFrom = document.getElementById('dateFrom')?.value;
  const dateTo = document.getElementById('dateTo')?.value;
  const data = await apiCall('reportStatus', { status: statusFilter, dateFrom, dateTo });
  const container = document.getElementById('reportStatusTable');
  container.innerHTML = `
    <table class="w-full text-sm">
      <thead><tr>
        <th>วันที่รับ</th><th>ใบขอเบิก</th><th>ฎีกา</th><th>ผู้ขาย</th><th>รายการ</th>
        <th>จำนวนเงิน</th><th>หน่วยงาน</th><th>ผู้ส่ง</th>
      </tr></thead>
      <tbody>${data.rows.map(r => `<tr>
        <td>${r.RECEIVE_DATE}</td><td>${r.REQUEST_NO_DISPLAY}</td><td>${r.DK_NO_DISPLAY}</td>
        <td>${r.VENDOR}</td><td>${r.DESCRIPTION}</td><td>${formatMoney(r.AMOUNT)}</td>
        <td>${r.DEPT}</td><td>${r.SENDER}</td>
      </tr>`).join('')}</tbody>
    </table>`;
}