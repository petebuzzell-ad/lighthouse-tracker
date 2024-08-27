import axios from 'axios';

const api = axios.create({
    baseURL: '/api',
});

export const getReports = async () => {
    try {
        console.log('Fetching reports...');  // Add this line
        const response = await api.get('/reports');
        console.log('Reports fetched:', response.data);  // Add this line
        return response.data;
    } catch (error) {
        console.error('Error fetching reports:', error);
        throw error;
    }
};

export const addUrls = async (urls) => {
    try {
        console.log('Adding URLs:', urls);  // Add this line
        const response = await api.post('/urls', { urls });
        console.log('URLs added:', response.data);  // Add this line
        return response.data;
    } catch (error) {
        console.error('Error adding URLs:', error);
        throw error;
    }
};

export const runLighthouseScan = async (url, device) => {
    try {
        console.log(`Running Lighthouse scan for ${url} on ${device}`);  // Add this line
        const response = await api.post('/run-lighthouse', { url, device });
        console.log('Lighthouse scan response:', response.data);  // Add this line
        return response.data;
    } catch (error) {
        console.error('Error running Lighthouse scan:', error);
        throw error;
    }
};