
//tối đa cho phép từ 1 device
const MAX_ACCOUNTS_PER_DEVICE = 1000;

/**
 * Phát hiện Multi-accounting với tính năng block
 * Kiểm tra xem device fingerprint có bị sử dụng bởi nhiều tài khoản không
 */
export const checkMultiAccounting = async (visitorId, userId) => {
  try {
    const fingerprintData = JSON.parse(localStorage.getItem('fingerprintData') || '{}');
    const blockedDevices = JSON.parse(localStorage.getItem('blockedDevices') || '[]');
    
    // Kiểm tra xem device có bị block không
    if (blockedDevices.includes(visitorId)) {
      return {
        isBlocked: true,
        isMultiAccounting: true,
        accountCount: fingerprintData[visitorId]?.userIds.length || 0,
        message: `Thiết bị này đã bị chặn do phát hiện quá nhiều tài khoản (${fingerprintData[visitorId]?.userIds.length || 0}/${MAX_ACCOUNTS_PER_DEVICE}).`
      };
    }
    
    // Lấy danh sách userId đã đăng nhập từ device này
    if (!fingerprintData[visitorId]) {
      fingerprintData[visitorId] = {
        userIds: [userId],
        firstSeen: new Date().toISOString(),
        lastSeen: new Date().toISOString(),
        loginCount: 1,
        isBlocked: false
      };
    } else {
      const existingData = fingerprintData[visitorId];
      
      // Kiểm tra nếu userId mới khác với các userId đã lưu
      if (!existingData.userIds.includes(userId)) {
        // Kiểm tra số lượng tài khoản đã vượt quá giới hạn chưa
        if (existingData.userIds.length >= MAX_ACCOUNTS_PER_DEVICE) {
          // BLOCK DEVICE
          blockedDevices.push(visitorId);
          localStorage.setItem('blockedDevices', JSON.stringify(blockedDevices));
          existingData.isBlocked = true;
          existingData.blockedAt = new Date().toISOString();
          
          console.error('🚫 DEVICE BLOCKED!', {
            visitorId,
            userIds: existingData.userIds,
            accountCount: existingData.userIds.length,
            attemptedUser: userId
          });
          
          localStorage.setItem('fingerprintData', JSON.stringify(fingerprintData));
          
          return {
            isBlocked: true,
            isMultiAccounting: true,
            accountCount: existingData.userIds.length,
            maxAllowed: MAX_ACCOUNTS_PER_DEVICE,
            message: `Đã vượt quá giới hạn ${MAX_ACCOUNTS_PER_DEVICE} tài khoản. Thiết bị bị chặn!`
          };
        }
        
        existingData.userIds.push(userId);
        
        // CẢNH BÁO: Phát hiện multi-accounting
        if (existingData.userIds.length > 1) {
          console.warn('⚠️ MULTI-ACCOUNTING DETECTED!', {
            visitorId,
            userIds: existingData.userIds,
            accountCount: existingData.userIds.length
          });
          
          localStorage.setItem('fingerprintData', JSON.stringify(fingerprintData));
          
          return {
            isBlocked: false,
            isMultiAccounting: true,
            accountCount: existingData.userIds.length,
            maxAllowed: MAX_ACCOUNTS_PER_DEVICE,
            accounts: existingData.userIds,
            warning: `Còn ${MAX_ACCOUNTS_PER_DEVICE - existingData.userIds.length} lần đăng nhập với tài khoản mới`
          };
        }
      }
      
      existingData.lastSeen = new Date().toISOString();
      existingData.loginCount++;
    }
    
    localStorage.setItem('fingerprintData', JSON.stringify(fingerprintData));
    
    return {
      isBlocked: false,
      isMultiAccounting: false,
      accountCount: fingerprintData[visitorId].userIds.length,
      maxAllowed: MAX_ACCOUNTS_PER_DEVICE
    };
  } catch (error) {
    console.error('Error checking multi-accounting:', error);
    return { isMultiAccounting: false, error: error.message };
  }
};

/**
 * Lấy thông tin fingerprint data (cho admin view)
 */
export const getFingerprintData = () => {
  try {
    return JSON.parse(localStorage.getItem('fingerprintData') || '{}');
  } catch (error) {
    console.error('Error getting fingerprint data:', error);
    return {};
  }
};

/**
 * Lấy danh sách devices bị block
 */
export const getBlockedDevices = () => {
  try {
    return JSON.parse(localStorage.getItem('blockedDevices') || '[]');
  } catch (error) {
    console.error('Error getting blocked devices:', error);
    return [];
  }
};

/**
 * Unblock một device (chỉ admin)
 */
export const unblockDevice = (visitorId) => {
  try {
    const blockedDevices = JSON.parse(localStorage.getItem('blockedDevices') || '[]');
    const fingerprintData = JSON.parse(localStorage.getItem('fingerprintData') || '{}');
    
    // Xóa khỏi danh sách blocked
    const index = blockedDevices.indexOf(visitorId);
    if (index > -1) {
      blockedDevices.splice(index, 1);
      localStorage.setItem('blockedDevices', JSON.stringify(blockedDevices));
    }
    
    // Cập nhật fingerprint data
    if (fingerprintData[visitorId]) {
      fingerprintData[visitorId].isBlocked = false;
      fingerprintData[visitorId].unblockedAt = new Date().toISOString();
      localStorage.setItem('fingerprintData', JSON.stringify(fingerprintData));
    }
    
    console.log('✅ Device unblocked:', visitorId);
    return { success: true, visitorId };
  } catch (error) {
    console.error('Error unblocking device:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Xóa tài khoản khỏi device fingerprint (chỉ admin)
 */
export const removeAccountFromDevice = (visitorId, userId) => {
  try {
    const fingerprintData = JSON.parse(localStorage.getItem('fingerprintData') || '{}');
    
    if (fingerprintData[visitorId]) {
      const index = fingerprintData[visitorId].userIds.indexOf(userId);
      if (index > -1) {
        fingerprintData[visitorId].userIds.splice(index, 1);
        localStorage.setItem('fingerprintData', JSON.stringify(fingerprintData));
        
        console.log('✅ Account removed from device:', { visitorId, userId });
        return { success: true, visitorId, userId };
      }
    }
    
    return { success: false, message: 'Account not found' };
  } catch (error) {
    console.error('Error removing account:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Lấy thống kê multi-accounting
 */
export const getMultiAccountingStats = () => {
  try {
    const fingerprintData = getFingerprintData();
    const blockedDevices = getBlockedDevices();
    
    const devices = Object.keys(fingerprintData);
    const multiAccountDevices = devices.filter(
      deviceId => fingerprintData[deviceId].userIds.length > 1
    );
    
    const totalAccounts = devices.reduce(
      (sum, deviceId) => sum + fingerprintData[deviceId].userIds.length,
      0
    );
    
    return {
      totalDevices: devices.length,
      multiAccountDevices: multiAccountDevices.length,
      blockedDevices: blockedDevices.length,
      totalAccounts,
      suspiciousRate: devices.length > 0 
        ? ((multiAccountDevices.length / devices.length) * 100).toFixed(1)
        : 0
    };
  } catch (error) {
    console.error('Error getting stats:', error);
    return {
      totalDevices: 0,
      multiAccountDevices: 0,
      blockedDevices: 0,
      totalAccounts: 0,
      suspiciousRate: 0
    };
  }
};
