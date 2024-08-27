import React from 'react';

function ReportDetails({ report, onClose }) {
  if (!report || !report.report_json) {
    return null;
  }

  const renderAudits = (audits) => {
    return Object.entries(audits).map(([id, audit]) => (
      <div key={id} className="audit-item">
        <h4>{audit.title}</h4>
        <p>Score: {audit.score}</p>
        <p>{audit.description}</p>
      </div>
    ));
  };

  return (
    <div className="report-details-modal">
      <div className="report-details-content">
        <h2>Lighthouse Report Details</h2>
        <button onClick={onClose}>Close</button>
        <h3>URL: {report.url}</h3>
        <p>Device: {report.device}</p>
        <p>Date: {new Date(report.created_at).toLocaleString()}</p>
        
        <h3>Categories</h3>
        {Object.entries(report.report_json.categories).map(([key, category]) => (
          <div key={key}>
            <h4>{category.title}</h4>
            <p>Score: {(category.score * 100).toFixed(2)}%</p>
          </div>
        ))}

        <h3>Audits</h3>
        {renderAudits(report.report_json.audits)}
      </div>
    </div>
  );
}

export default ReportDetails;
