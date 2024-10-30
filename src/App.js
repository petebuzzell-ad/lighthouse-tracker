import React, { useState, useEffect } from 'react';
import supabase from './services/supabase';
import UrlInput from './components/UrlInput';
import DomainReports from './components/DomainReports';
import { getReports, addUrls, runLighthouseScan } from './services/api';
import './App.css';

function App() {
    const [session, setSession] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Check active sessions and subscribe to auth changes
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
            setLoading(false);
        });

        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
        });

        return () => subscription.unsubscribe();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!session) {
        return <Auth />;
    }

    return (
        <div className="App">
            <h1>Lighthouse Tracker</h1>
            {isLoading && <p>Loading...</p>}
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
    );
}

function Auth() {
    const handleLogin = async () => {
        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'github',
        });
        if (error) console.error('Error logging in:', error.message);
    };

    return (
        <div className="auth-container">
            <h1>Lighthouse Tracker</h1>
            <button onClick={handleLogin}>Sign In</button>
        </div>
    );
}

export default App;