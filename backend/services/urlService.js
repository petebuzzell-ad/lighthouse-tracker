import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

// Add logging for environment variables (mask sensitive data)
console.log('Supabase URL configured:', process.env.SUPABASE_URL ? 'Yes' : 'No');
console.log('Supabase Key configured:', process.env.SUPABASE_KEY ? 'Yes' : 'No');

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

async function addUrls(urls) {
    console.log('addUrls: Starting database insertion', urls);
    try {
        const urlRecords = urls.map(url => ({
            url: url.url,
            device: url.device,
            status: 'pending'
        }));

        const { data, error } = await supabase
            .from('urls_to_test')
            .insert(urlRecords)
            .select();

        if (error) {
            console.error('Error inserting URLs:', error);
            throw error;
        }
        console.log('Successfully added URLs:', data);
        return data;
    } catch (error) {
        console.error('Database error in addUrls:', error);
        throw error;
    }
}

async function getReports() {
    console.log('getReports: Starting database query');
    try {
        // First, get all URLs
        const { data: urlsData, error: urlsError } = await supabase
            .from('urls_to_test')
            .select('*');
        
        if (urlsError) {
            console.error('Error fetching URLs:', urlsError);
            throw urlsError;
        }
        console.log('Retrieved URLs:', urlsData);

        // Then get all reports
        const { data: reportsData, error: reportsError } = await supabase
            .from('lighthouse_reports')
            .select('*')
            .order('created_at', { ascending: false });

        if (reportsError) {
            console.error('Error fetching reports:', reportsError);
            throw reportsError;
        }
        console.log('Retrieved reports:', reportsData);

        // Process and return the data
        return processReportsData(urlsData, reportsData);
    } catch (error) {
        console.error('Database error in getReports:', error);
        throw error;
    }
}

async function runLighthouseScan(url, device) {
    console.log(`Lighthouse scan requested for ${url} on ${device}`);
}

// Add a test function to verify database connection
async function testDatabaseConnection() {
    try {
        const { data, error } = await supabase
            .from('urls_to_test')
            .select('count');
        
        if (error) throw error;
        console.log('Database connection successful. Row count:', data);
        return true;
    } catch (error) {
        console.error('Database connection failed:', error);
        
    }
}

export {
    addUrls,
    getReports,
    runLighthouseScan,
    testDatabaseConnection
};