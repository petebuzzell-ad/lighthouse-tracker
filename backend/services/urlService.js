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

function processReportsData(urlsData, reportsData) {
    console.log('Processing reports data...');
    // Group URLs by domain
    const domainData = {};

    urlsData.forEach(url => {
        const domain = new URL(url.url).hostname;
        if (!domainData[domain]) {
            domainData[domain] = {
                urls: [],
                avgPerformance: 0,
                avgAccessibility: 0,
                avgSEO: 0
            };
        }

        // Find reports for this URL
        const urlReports = reportsData.filter(
            report => report.url === url.url && report.device === url.device
        );

        domainData[domain].urls.push({
            url: url.url,
            device: url.device,
            status: url.status,
            lighthouse_reports: urlReports.map(report => ({
                id: report.id,
                performance: report.performance,
                accessibility: report.accessibility,
                seo: report.seo,
                created_at: report.created_at,
                report_json: report.report_json
            }))
        });

        // Calculate averages for the domain
        if (urlReports.length > 0) {
            domainData[domain].avgPerformance += urlReports.reduce((acc, report) => acc + report.performance, 0) / urlReports.length;
            domainData[domain].avgAccessibility += urlReports.reduce((acc, report) => acc + report.accessibility, 0) / urlReports.length;
            domainData[domain].avgSEO += urlReports.reduce((acc, report) => acc + report.seo, 0) / urlReports.length;
        }
    });

    // Normalize domain averages
    Object.keys(domainData).forEach(domain => {
        const urlCount = domainData[domain].urls.length;
        if (urlCount > 0) {
            domainData[domain].avgPerformance /= urlCount;
            domainData[domain].avgAccessibility /= urlCount;
            domainData[domain].avgSEO /= urlCount;
        }
    });

    console.log('Processed data:', domainData);
    return domainData;
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