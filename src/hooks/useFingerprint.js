import { useEffect, useState } from 'react';
import FingerprintJS from '@fingerprintjs/fingerprintjs';

/**
 * @returns {Object} { visitorId, isLoading, error, getData }
 */
export const useFingerprint = () => {
  const [visitorId, setVisitorId] = useState(null);
  const [visitorData, setVisitorData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const getData = async () => {
    try {
      setIsLoading(true);
      const fp = await FingerprintJS.load();
      const result = await fp.get();
      
      setVisitorId(result.visitorId);
      setVisitorData({
        visitorId: result.visitorId,
        confidence: { score: result.confidence },
        components: result.components,
        browserName: getBrowserName(),
        browserVersion: getBrowserVersion(),
        os: getOS(),
        osVersion: getOSVersion(),
        ip: 'N/A', // Free version không có IP
        device: getDeviceType()
      });
      setIsLoading(false);
      return result;
    } catch (err) {
      console.error('Fingerprint error:', err);
      setError(err);
      setIsLoading(false);
      return null;
    }
  };

  useEffect(() => {
    getData();
  }, []);

  return {
    visitorId,
    visitorData,
    isLoading,
    error,
    getData,
  };
};

// Helper functions
const getBrowserName = () => {
  const ua = navigator.userAgent;
  if (ua.includes('Chrome')) return 'Chrome';
  if (ua.includes('Firefox')) return 'Firefox';
  if (ua.includes('Safari')) return 'Safari';
  if (ua.includes('Edge')) return 'Edge';
  return 'Unknown';
};

const getBrowserVersion = () => {
  const ua = navigator.userAgent;
  const match = ua.match(/(Chrome|Firefox|Safari|Edge)\/(\d+)/);
  return match ? match[2] : 'Unknown';
};

const getOS = () => {
  const ua = navigator.userAgent;
  if (ua.includes('Win')) return 'Windows';
  if (ua.includes('Mac')) return 'macOS';
  if (ua.includes('Linux')) return 'Linux';
  if (ua.includes('Android')) return 'Android';
  if (ua.includes('iOS')) return 'iOS';
  return 'Unknown';
};

const getOSVersion = () => {
  const ua = navigator.userAgent;
  const match = ua.match(/Windows NT (\d+\.\d+)|Mac OS X (\d+[._]\d+)|Android (\d+)/);
  return match ? (match[1] || match[2] || match[3]) : 'Unknown';
};

const getDeviceType = () => {
  const ua = navigator.userAgent;
  if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) return 'Tablet';
  if (/Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(ua)) return 'Mobile';
  return 'Desktop';
};

export default useFingerprint;
