// api-config.js - Centralized API Configuration
const API_CONFIG = {
  baseUrl: 'https://script.google.com/macros/s/AKfycbwgvgfa6QMaHwPkGfDMgFQ30_jESlrlcx124OIGp6Kro28m9akLh-HzFIgP3wCM0pjC/exec', // Replace with deployed GAS Web App URL
  timeout: 15000,
  retryAttempts: 2,
  
  endpoints: {
    login: 'login',
    guest: 'guest',
    logout: 'logout',
    changePassword: 'changePassword',
    dashboard: 'dashboard',
    importPreview: 'importPreview',
    importCommit: 'importCommit',
    getWaitingList: 'getWaitingList',
    receiveItems: 'receiveItems',
    getCheckupList: 'getCheckupList',
    editItems: 'editItems',
    returnItems: 'returnItems',
    passItems: 'passItems',
    getPassedList: 'getPassedList',
    proposeItems: 'proposeItems',
    approveItems: 'approveItems',
    getApprovedList: 'getApprovedList',
    payItems: 'payItems',
    reportType: 'reportType',
    reportStatus: 'reportStatus',
    getSettings: 'getSettings',
    saveSettings: 'saveSettings',
    getUsers: 'getUsers',
    addUser: 'addUser',
    updateUser: 'updateUser',
    deleteUser: 'deleteUser',
    getAuditLogs: 'getAuditLogs',
    getPermissions: 'getPermissions',
    savePermissions: 'savePermissions',
    getTelegramConfig: 'getTelegramConfig',
    saveTelegramConfig: 'saveTelegramConfig'
  }
};

// Centralized API call function
async function apiCall(action, data = {}) {
  const token = localStorage.getItem('srdh_token');
  const payload = { action, ...data, token };
  
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.timeout);
  
  try {
    const response = await fetch(API_CONFIG.baseUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      signal: controller.signal
    });
    clearTimeout(timeoutId);
    const result = await response.json();
    if (!result.success && result.error) {
      throw new Error(result.error);
    }
    return result;
  } catch (error) {
    if (API_CONFIG.retryAttempts > 0) {
      return retryApiCall(action, data, API_CONFIG.retryAttempts);
    }
    throw error;
  }
}

async function retryApiCall(action, data, attempts) {
  for (let i = 0; i < attempts; i++) {
    try {
      await new Promise(r => setTimeout(r, 1000 * (i + 1)));
      const token = localStorage.getItem('srdh_token');
      const payload = { action, ...data, token };
      const response = await fetch(API_CONFIG.baseUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const result = await response.json();
      if (!result.success && result.error) throw new Error(result.error);
      return result;
    } catch (e) {
      if (i === attempts - 1) throw e;
    }
  }
}
