// Debug utility to check reports in localStorage
export const debugReports = () => {
  console.log('🔍 Debugging Reports...');
  
  const stored = localStorage.getItem('hazardReports');
  console.log('📦 Raw localStorage data:', stored);
  
  if (stored) {
    try {
      const parsed = JSON.parse(stored);
      console.log('📋 Parsed reports:', parsed);
      console.log('📊 Number of reports:', parsed.length);
      
      parsed.forEach((report, index) => {
        console.log(`Report ${index + 1}:`, {
          id: report.id,
          type: report.type,
          location: report.location,
          latitude: report.latitude,
          longitude: report.longitude,
          userName: report.userName,
          timestamp: report.timestamp
        });
      });
    } catch (error) {
      console.error('❌ Failed to parse reports:', error);
    }
  } else {
    console.log('❌ No reports found in localStorage');
  }
};

// Add to window for easy access
if (typeof window !== 'undefined') {
  window.debugReports = debugReports;
}
