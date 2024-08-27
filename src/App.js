import React, { useState, useEffect } from 'react';
import ErrorBoundary from './ErrorBoundary';
// import UrlInput from './components/UrlInput';
// import DomainReports from './components/DomainReports';
// import { getReports, addUrls, runLighthouseScan } from './services/api';
import './App.css';

function App() {
  return (
    <ErrorBoundary>
      {/* Your existing app content */}
    </ErrorBoundary>
  );
}

// function App() {
//   const [domainData, setDomainData] = useState(null);
//   const [selectedDomain, setSelectedDomain] = useState('all');

//   const fetchData = async () => {
//     try {
//       const reports = await getReports();
//       setDomainData(reports);
//     } catch (error) {
//       console.error('Error fetching data:', error);
//     }
//   };

//   useEffect(() => {
//     fetchData();
//   }, []);

//   const handleUrlSubmit = async (urls) => {
//     try {
//       await addUrls(urls);
//       fetchData();
//     } catch (error) {
//       console.error('Error adding URLs:', error);
//     }
//   };

//   const handleRunScan = async (url, device) => {
//     try {
//       await runLighthouseScan(url, device);
//       fetchData();
//     } catch (error) {
//       console.error('Error running Lighthouse scan:', error);
//     }
//   };

//   const domains = domainData ? ['all', ...Object.keys(domainData)] : ['all'];

//   return (
//     <div className="App">
//       <h1>Lighthouse Tracker</h1>
//       <div className="url-input-container">
//         <UrlInput onSubmit={handleUrlSubmit} />
//       </div>
//       <div className="domain-filter">
//         <label htmlFor="domain-select">Filter by domain: </label>
//         <select
//           id="domain-select"
//           value={selectedDomain}
//           onChange={(e) => setSelectedDomain(e.target.value)}
//         >
//           {domains.map(domain => (
//             <option key={domain} value={domain}>{domain}</option>
//           ))}
//         </select>
//       </div>
//       <div className="domain-reports">
//         <DomainReports 
//           reports={domainData} 
//           onRunScan={handleRunScan} 
//           selectedDomain={selectedDomain}
//         />
//       </div>
//     </div>
//   );
// }

export default App;