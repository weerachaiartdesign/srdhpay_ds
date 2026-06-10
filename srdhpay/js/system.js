// system.js
document.addEventListener('DOMContentLoaded', () => {
  const tabs = document.querySelectorAll('.tab-btn');
  tabs.forEach(btn => btn.addEventListener('click', () => {
    tabs.forEach(b => b.classList.replace('bg-purple-600','bg-purple-200'));
    btn.classList.replace('bg-purple-200','bg-purple-600');
    loadSystemTab(btn.dataset.tab);
  }));
  loadSystemTab('permission');
});

async function loadSystemTab(tab) {
  const container = document.getElementById('tabContent');
  switch(tab) {
    case 'permission':
      const perm = await apiCall('getPermissionMatrix');
      container.innerHTML = `<table class="w-full text-sm">
        <thead><tr><th>Module</th><th>Admin</th><th>Manager</th><th>Editor</th><th>Checker</th><th>Staff</th><th>Guest</th></tr></thead>
        <tbody>${perm.map(p => `<tr>
          <td>${p.module}</td>
          ${['admin','manager','editor','checker','staff','guest'].map(r => `<td><input type="checkbox" ${p.roles.includes(r)?'checked':''} data-module="${p.module}" data-role="${r}"></td>`).join('')}
        </tr>`).join('')}</tbody></table>
        <button class="btn-primary mt-2" onclick="savePermission()">บันทึก</button>`;
      break;
    case 'session':
      container.innerHTML = `
        <label>Guest Timeout (hours): <input type="number" id="guestTimeout" class="border p-1"></label>
        <label>Inactivity Logout (minutes): <input type="number" id="inactivity" class="border p-1"></label>
        <button class="btn-primary" onclick="saveSession()">บันทึก</button>`;
      break;
    case 'audit':
      const logs = await apiCall('getAuditLogs');
      container.innerHTML = `<table class="w-full text-sm"><thead><tr><th>เวลา</th><th>ผู้ใช้</th><th>Action</th><th>รายละเอียด</th></tr></thead>
        <tbody>${logs.map(l => `<tr><td>${l.time}</td><td>${l.email}</td><td>${l.action}</td><td>${l.detail}</td></tr>`).join('')}</tbody></table>
        <button class="btn-primary mt-2" onclick="exportAudit()">Export Logs</button>`;
      break;
    case 'telegram':
      container.innerHTML = `... form bot token, chat id, events ...`;
      break;
    case 'retention':
      container.innerHTML = `... retention settings ...`;
      break;
  }
}
// ... helper functions