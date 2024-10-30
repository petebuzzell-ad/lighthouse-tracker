import React, { useState, useEffect } from 'react';
import UrlInput from './components/UrlInput';
import DomainReports from './components/DomainReports';
import { getReports, addUrls, runLighthouseScan } from './services';
import ErrorBoundary from './ErrorBoundary';
import './App.css';

function App() {
  console.log('App component rendering');

  const [domainData, setDomainData] = useState(null);
  const [selectedDomain, setSelectedDomain] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    console.log('Fetching data');
    setIsLoading(true);
    setError(null);
    try {
      const reports = await getReports();
      console.log('Fetched reports:', reports);
      setDomainData(reports);
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Failed to fetch reports. Please try again later.');
    } finally {
      setIsLoading(false);
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
      setError('Failed to add URLs. Please try again.');
    }
  };

  const handleRunScan = async (url, device) => {
    try {
      await runLighthouseScan(url, device);
      fetchData();
    } catch (error) {
      console.error('Error running Lighthouse scan:', error);
      setError('Failed to run Lighthouse scan. Please try again.');
    }
  };

  const domains = domainData ? ['all', ...Object.keys(domainData)] : ['all'];

  return (
    <ErrorBoundary>
      <div className="App">
        <h1>Lighthouse Tracker</h1>
        {isLoading && <p>Loading...</p>}
        {error && <p className="error">{error}</p>}
        {!isLoading && !error && (
          <>
            <div className="url-input-container">
              <UrlInput onSubmit={handleUrlSubmit} />
            </div>
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
          </>
        )}
      </div>
    </ErrorBoundary>
  );
}

export default App;