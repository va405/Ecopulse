// Advanced data export utilities

/**
 * Export data to CSV format
 */
export const exportToCSV = (data, filename = 'ecopulse-data.csv') => {
  if (!data || data.length === 0) {
    console.error('No data to export');
    return;
  }

  // Convert data to CSV format
  const headers = Object.keys(data[0]).join(',');
  const rows = data.map(obj => 
    Object.values(obj).map(val => 
      typeof val === 'string' && val.includes(',') ? `"${val}"` : val
    ).join(',')
  );
  
  const csv = [headers, ...rows].join('\n');
  
  // Create blob and download
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

/**
 * Export data to JSON format
 */
export const exportToJSON = (data, filename = 'ecopulse-data.json') => {
  const json = JSON.stringify(data, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

/**
 * Generate PDF report (requires browser print)
 */
export const exportToPDF = (elementId, filename = 'ecopulse-report.pdf') => {
  const element = document.getElementById(elementId);
  if (!element) {
    console.error('Element not found');
    return;
  }

  // Create print-friendly version
  const printWindow = window.open('', '_blank');
  const styles = `
    <style>
      @media print {
        body { 
          font-family: Inter, sans-serif;
          background: white;
          color: black;
          padding: 20px;
        }
        .no-print { display: none !important; }
        h1 { color: #2563EB; }
        h2 { color: #7C3AED; margin-top: 20px; }
        table { 
          width: 100%; 
          border-collapse: collapse; 
          margin: 20px 0;
        }
        th, td { 
          border: 1px solid #ddd; 
          padding: 8px; 
          text-align: left;
        }
        th { 
          background-color: #2563EB; 
          color: white;
        }
        .header {
          text-align: center;
          margin-bottom: 30px;
          border-bottom: 3px solid #2563EB;
          padding-bottom: 20px;
        }
        .footer {
          margin-top: 40px;
          padding-top: 20px;
          border-top: 2px solid #ddd;
          text-align: center;
          font-size: 12px;
          color: #666;
        }
      }
    </style>
  `;
  
  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>${filename}</title>
        ${styles}
      </head>
      <body>
        <div class="header">
          <h1>🌍 EcoPulse</h1>
          <p>Carbon Footprint Intelligence Report</p>
          <p>Generated: ${new Date().toLocaleDateString()}</p>
        </div>
        ${element.innerHTML}
        <div class="footer">
          <p>EcoPulse - Empowering sustainable living through data-driven insights</p>
          <p>Carbon Intelligence Platform</p>
        </div>
      </body>
    </html>
  `);
  
  printWindow.document.close();
  printWindow.focus();
  
  setTimeout(() => {
    printWindow.print();
    printWindow.close();
  }, 500);
};

/**
 * Share data via Web Share API
 */
export const shareData = async (title, text, url) => {
  if (navigator.share) {
    try {
      await navigator.share({ title, text, url });
      return true;
    } catch (error) {
      console.error('Share failed:', error);
      return false;
    }
  } else {
    // Fallback - copy to clipboard
    try {
      await navigator.clipboard.writeText(`${title}\n${text}\n${url}`);
      alert('Link copied to clipboard!');
      return true;
    } catch (error) {
      console.error('Clipboard failed:', error);
      return false;
    }
  }
};

/**
 * Format data for export
 */
export const formatDataForExport = (monthlyData, currentStats, badges) => {
  return {
    exportDate: new Date().toISOString(),
    summary: {
      currentCarbon: currentStats.carbon,
      currentWater: currentStats.water,
      sustainabilityScore: currentStats.score,
      totalPoints: currentStats.points
    },
    monthlyTrends: monthlyData,
    achievements: badges.filter(b => b.unlocked).map(b => b.name),
    metadata: {
      platform: 'EcoPulse',
      version: '1.0.0',
      exportFormat: 'JSON'
    }
  };
};
