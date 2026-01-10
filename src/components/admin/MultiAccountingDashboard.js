import React, { useState, useEffect } from 'react';
import { useFingerprint } from '../../hooks/useFingerprint.js';
import { 
  getFingerprintData, 
  getBlockedDevices, 
  unblockDevice, 
  removeAccountFromDevice,
  getMultiAccountingStats 
} from '../../services/fingerprintService.js';
import DashboardHeader from './MultiAccountingDashboard/DashboardHeader.js';
import StatsCards from './MultiAccountingDashboard/StatsCards.js';
import DevicesList from './MultiAccountingDashboard/DevicesList.js';
import '../../styles/pages/admin-dashboard.css';

const MultiAccountingDashboard = () => {
  const { visitorId } = useFingerprint();
  const [fingerprintData, setFingerprintData] = useState({});
  const [blockedDevices, setBlockedDevices] = useState([]);
  const [stats, setStats] = useState({});
  const [selectedTab, setSelectedTab] = useState('overview');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setFingerprintData(getFingerprintData());
    setBlockedDevices(getBlockedDevices());
    setStats(getMultiAccountingStats());
  };

  const handleUnblock = (deviceId) => {
    if (window.confirm(`Bạn có chắc muốn unblock device ${deviceId.slice(0, 16)}...?`)) {
      const result = unblockDevice(deviceId);
      if (result.success) {
        alert('✅ Device đã được unblock!');
        loadData();
      }
    }
  };

  const handleRemoveAccount = (deviceId, userId) => {
    if (window.confirm(`Xóa tài khoản ${userId} khỏi device này?`)) {
      const result = removeAccountFromDevice(deviceId, userId);
      if (result.success) {
        alert('✅ Đã xóa tài khoản!');
        loadData();
      }
    }
  };

  const handleClearAll = () => {
    if (window.confirm('⚠️ XÓA TẤT CẢ dữ liệu fingerprint?')) {
      localStorage.removeItem('fingerprintData');
      localStorage.removeItem('blockedDevices');
      alert('✅ Đã xóa tất cả!');
      loadData();
    }
  };

  // Filter devices
  const filteredDevices = Object.keys(fingerprintData).filter(deviceId => {
    if (!searchQuery) return true;
    const data = fingerprintData[deviceId];
    return deviceId.toLowerCase().includes(searchQuery.toLowerCase()) ||
           data.userIds.some(userId => userId.toLowerCase().includes(searchQuery.toLowerCase()));
  });

  const multiAccountDevices = filteredDevices.filter(
    deviceId => fingerprintData[deviceId].userIds.length > 1
  );
  const singleAccountDevices = filteredDevices.filter(
    deviceId => fingerprintData[deviceId].userIds.length === 1
  );

  return (
    <div className="multi-accounting-dashboard">
      <DashboardHeader 
        onClearAll={handleClearAll}
        onRefresh={loadData}
      />

      <StatsCards stats={stats} />

      {visitorId && fingerprintData[visitorId] && (
        <div className="current-device">
          <h3>🔒 Thiết bị hiện tại</h3>
          <code>{visitorId}</code>
          <div className="device-status">
            {fingerprintData[visitorId].isBlocked ? (
              <span className="badge blocked">🚫 Bị Block</span>
            ) : fingerprintData[visitorId].userIds.length > 1 ? (
              <span className="badge warning">⚠️ Multi-Account ({fingerprintData[visitorId].userIds.length})</span>
            ) : (
              <span className="badge safe">✅ Bình thường</span>
            )}
          </div>
        </div>
      )}

      <div className="tabs">
        <button 
          className={selectedTab === 'overview' ? 'active' : ''}
          onClick={() => setSelectedTab('overview')}
        >
          📊 Tổng quan
        </button>
        <button 
          className={selectedTab === 'multi' ? 'active' : ''}
          onClick={() => setSelectedTab('multi')}
        >
          ⚠️ Multi-Account ({multiAccountDevices.length})
        </button>
        <button 
          className={selectedTab === 'blocked' ? 'active' : ''}
          onClick={() => setSelectedTab('blocked')}
        >
          🚫 Blocked ({blockedDevices.length})
        </button>
        <button 
          className={selectedTab === 'single' ? 'active' : ''}
          onClick={() => setSelectedTab('single')}
        >
          ✅ Single Account ({singleAccountDevices.length})
        </button>
      </div>

      <div className="search-box">
        <input
          type="text"
          placeholder="🔍 Tìm kiếm..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="dashboard-content">
        {selectedTab === 'overview' && (
          <DevicesList 
            devices={filteredDevices}
            fingerprintData={fingerprintData}
            blockedDevices={blockedDevices}
            onUnblock={handleUnblock}
            onRemoveAccount={handleRemoveAccount}
            title="Tất cả Devices"
          />
        )}
        {selectedTab === 'multi' && (
          <DevicesList 
            devices={multiAccountDevices}
            fingerprintData={fingerprintData}
            blockedDevices={blockedDevices}
            onUnblock={handleUnblock}
            onRemoveAccount={handleRemoveAccount}
            title="Multi-Account Devices"
          />
        )}
        {selectedTab === 'blocked' && (
          <DevicesList 
            devices={blockedDevices}
            fingerprintData={fingerprintData}
            blockedDevices={blockedDevices}
            onUnblock={handleUnblock}
            onRemoveAccount={handleRemoveAccount}
            title="Blocked Devices"
          />
        )}
        {selectedTab === 'single' && (
          <DevicesList 
            devices={singleAccountDevices}
            fingerprintData={fingerprintData}
            blockedDevices={blockedDevices}
            onUnblock={handleUnblock}
            onRemoveAccount={handleRemoveAccount}
            title="Single Account Devices"
          />
        )}
      </div>
    </div>
  );
};

export default MultiAccountingDashboard;
