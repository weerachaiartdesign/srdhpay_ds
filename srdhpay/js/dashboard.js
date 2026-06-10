// dashboard.js (ต่อจากส่วนที่มีอยู่)
// ในฟังก์ชัน renderDeptChart, renderTypeChart, renderMonthlyChart
// สมมติว่า data จาก backend มีโครงสร้างดังนี้:
// deptData: { labels: ['ฝ่ายพัสดุ','ฝ่ายเภสัช',...], values: [50000, 30000,...] }
// typeData: ซับซ้อนกว่า (stacked bar) เราจะใช้แบบ grouped bar แยกตาม dept

function renderDeptChart(data) {
  const ctx = document.getElementById('deptChart').getContext('2d');
  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: data.labels,
      datasets: [{
        label: 'จำนวนเงินเบิกจ่าย (บาท)',
        data: data.values,
        backgroundColor: '#A855F7'
      }]
    },
    options: { responsive: true, maintainAspectRatio: false }
  });
}

function renderTypeChart(data) {
  // data: { depts: ['ฝ่ายพัสดุ','ฝ่ายเภสัช'], types: [{ label: 'เงินงบประมาณ', data: [..], bg: '#FFCCFF' }, {...}] }
  const ctx = document.getElementById('typeChart').getContext('2d');
  const datasets = data.types.map(t => ({
    label: t.label,
    data: t.data,
    backgroundColor: t.bg
  }));
  new Chart(ctx, {
    type: 'bar',
    data: { labels: data.depts, datasets },
    options: { responsive: true, scales: { x: { stacked: true }, y: { stacked: true } } }
  });
}

function renderMonthlyChart(data) {
  // data: { months: ['ต.ค.','พ.ย.',...], thisYear: [10,20,...], lastYear: [5,15,...] }
  const ctx = document.getElementById('monthlyChart').getContext('2d');
  new Chart(ctx, {
    type: 'line',
    data: {
      labels: data.months,
      datasets: [
        { label: 'ปีงบประมาณปัจจุบัน', data: data.thisYear, borderColor: '#A855F7' },
        { label: 'ปีงบประมาณก่อน', data: data.lastYear, borderColor: '#D8B4FE', borderDash: [5,5] }
      ]
    },
    options: { responsive: true }
  });
}