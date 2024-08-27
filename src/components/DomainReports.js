import React, { useState } from 'react';
import { Line } from 'react-chartjs-2';
import { formatDateToEST } from '../utils/dateUtils';
import ReportDetails from './ReportDetails';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

function DomainReports({ reports, onRunScan, selectedDomain }) {
  const [scanningSites, setScanningSites] = useState({});
  const [selectedReport, setSelectedReport] = useState(null);

  const handleRunScan = async (url, device) => {
    setScanningSites(prev => ({ ...prev, [`${url}-${device}`]: true }));
    try {
      await onRunScan(url, device);
    } finally {
      setScanningSites(prev => ({ ...prev, [`${url}-${device}`]: false }));
    }
  };

  const getScoreColor = (score) => {
    if (score >= 90) return '#4caf50'; // Green
    if (score >= 50) return '#ff9800'; // Orange
    return '#f44336'; // Red
  };

  const renderSummary = (domainData) => {
    const formatScore = (score) => {
      return typeof score === 'number' ? score.toFixed(2) : 'N/A';
    };

    return (
      <div className="domain-summary">
        <h3>Domain Summary</h3>
        <table>
          <thead>
            <tr>
              <th>Metric</th>
              <th>Average Score</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>SEO</td>
              <td style={{ backgroundColor: getScoreColor(domainData.avgSEO || 0) }}>
                {formatScore(domainData.avgSEO)}
              </td>
            </tr>
            <tr>
              <td>Performance</td>
              <td style={{ backgroundColor: getScoreColor(domainData.avgPerformance || 0) }}>
                {formatScore(domainData.avgPerformance)}
              </td>
            </tr>
            <tr>
              <td>Accessibility</td>
              <td style={{ backgroundColor: getScoreColor(domainData.avgAccessibility || 0) }}>
                {formatScore(domainData.avgAccessibility)}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  };

  const renderDataTable = (reports) => {
    if (reports.length === 0) return <p>No data available</p>;

    return (
      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Performance</th>
            <th>Accessibility</th>
            <th>SEO</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {reports.map((report, index) => (
            <tr key={index}>
              <td>{formatDateToEST(report.created_at)}</td>
              <td style={{ backgroundColor: getScoreColor(report.performance), color: 'white' }}>
                {report.performance.toFixed(2)}
              </td>
              <td style={{ backgroundColor: getScoreColor(report.accessibility), color: 'white' }}>
                {report.accessibility.toFixed(2)}
              </td>
              <td style={{ backgroundColor: getScoreColor(report.seo), color: 'white' }}>
                {report.seo.toFixed(2)}
              </td>
              <td>
                {report.report_json ? (
                  <button onClick={() => setSelectedReport(report)}>View Details</button>
                ) : (
                  <span>No details available</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  const renderChart = (reports) => {
    const data = {
      labels: reports.map(report => formatDateToEST(report.created_at)),
      datasets: [
        {
          label: 'Performance',
          data: reports.map(report => report.performance),
          borderColor: 'rgb(255, 99, 132)',
          fill: false,
        },
        {
          label: 'Accessibility',
          data: reports.map(report => report.accessibility),
          borderColor: 'rgb(54, 162, 235)',
          fill: false,
        },
        {
          label: 'SEO',
          data: reports.map(report => report.seo),
          borderColor: 'rgb(75, 192, 192)',
          fill: false,
        },
      ],
    };

    const options = {
      responsive: true,
      plugins: {
        legend: {
          position: 'top',
        },
        title: {
          display: true,
          text: 'Lighthouse Scores Over Time',
        },
      },
    };

    return <Line data={data} options={options} />;
  };

  if (!reports) {
    return <p>Loading reports...</p>;
  }

  const filteredReports = selectedDomain === 'all' 
    ? reports 
    : { [selectedDomain]: reports[selectedDomain] };

  return (
    <div className="domain-reports">
      {Object.entries(filteredReports).map(([domain, domainData]) => (
        <div key={domain} className="domain-section">
          <h2>{domain}</h2>
          {renderSummary(domainData)}
          {domainData.urls.map((page, index) => (
            <div key={index} className="page-report">
              <h3>{page.url}</h3>
              <p>Device: {page.device}</p>
              <p>Status: {page.status}</p>
              <button 
                className="scan-button"
                onClick={() => handleRunScan(page.url, page.device)}
                disabled={scanningSites[`${page.url}-${page.device}`]}
              >
                {scanningSites[`${page.url}-${page.device}`] 
                  ? 'Scanning...' 
                  : 'Run Lighthouse Scan'}
              </button>
              {page.lighthouse_reports && page.lighthouse_reports.length > 0 ? (
                <>
                  {renderDataTable(page.lighthouse_reports)}
                  {page.lighthouse_reports.length > 3 && renderChart(page.lighthouse_reports)}
                </>
              ) : (
                <p>No Lighthouse reports available yet.</p>
              )}
            </div>
          ))}
        </div>
      ))}
      {selectedReport && (
        <ReportDetails report={selectedReport} onClose={() => setSelectedReport(null)} />
      )}
    </div>
  );
}

export default DomainReports;
