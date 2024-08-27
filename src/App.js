import React, { useState, useEffect } from 'react';
import UrlInput from './components/UrlInput';
import DomainReports from './components/DomainReports';
import { getReports, addUrls, runLighthouseScan } from './services/api';
import ErrorBoundary from './ErrorBoundary';
import './App.css';

function App() {
  console.log('App component rendering');  // Add this line

  const [domainData, setDomainData] = useState(null);
  const [selectedDomain, setSelectedDomain] = useState('all');
  const [isLoading, setIsLoading] = useState(true);  // Add this line

  const fetchData = async () => {
    setIsLoading(true);  // Add this line
    try {
      const reports = await getReports();
      setDomainData(reports);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);  // Add this line
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleUrlSubmit = async (urls) => {
    try {
      await addUrls(urls);
      fetchData();
    } catch (error) {
      console.error('Error adding URLs:', error);
    }
  };

  const handleRunScan = async (url, device) => {
    try {
      await runLighthouseScan(url, device);
      fetchData();
    } catch (error) {
      console.error('Error running Lighthouse scan:', error);
    }
  };

  const domains = domainData ? ['all', ...Object.keys(domainData)] : ['all'];

  return (
    <ErrorBoundary>
      <div className="App">
        <h1>Lighthouse Tracker</h1>
        {isLoading ? (
          <p>Loading...</p>
        ) : (
          <div className="url-input-container">
            <UrlInput onSubmit={handleUrlSubmit} />
          </div>
        )}
        <div className="domain-filter">
          <label htmlFor="domain-select">Filter by domain: </label>
          <select
            id="domain-select"
            value={selectedDomain}
            onChange={(e) => setSelectedDomain(e.target.value)}
          >
            {domains.map(domain => (
              <option key={domain} value={domain}>{domain}</option>
            ))}
          </select>
        </div>
        <div className="domain-reports">
          <DomainReports 
            reports={domainData} 
            onRunScan={handleRunScan} 
            selectedDomain={selectedDomain}
          />
        </div>
      </div>
    </ErrorBoundary>
  );
}

export default App;