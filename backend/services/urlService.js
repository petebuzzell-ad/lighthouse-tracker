import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { parse } from 'url';

dotenv.config();

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

export async function addUrls(urls) {
    console.log('Adding URLs to Supabase:', urls);
    const newUrls = urls.flatMap(url => [
        { url, device: 'desktop', status: 'pending' },
        { url, device: 'mobile', status: 'pending' }
    ]);

    try {
        const { data, error } = await supabase.from('urls_to_test').upsert(newUrls, { onConflict: ['url', 'device'] });
        if (error) throw error;
        console.log('URLs added successfully:', data);
        return data;
    } catch (error) {
        console.error('Error adding URLs to Supabase:', error);
        throw error;
    }
}

export async function getUrlsToTest() {
    try {
        console.log('Fetching URLs to test...');
        const { data, error } = await supabase
            .from('urls_to_test')
            .select('*')
            .eq('status', 'pending');
        if (error) throw error;
        console.log('URLs to test:', data);
        return data;
    } catch (error) {
        console.error('Error fetching URLs to test:', error);
        throw error;
    }
}

export async function getReports() {
    try {
        console.log('Fetching reports from Supabase...');
        const { data: urlsData, error: urlsError } = await supabase
            .from('urls_to_test')
            .select('*')
            .order('url', { ascending: true });
        
        if (urlsError) throw urlsError;

        const { data: reportsData, error: reportsError } = await supabase
            .from('lighthouse_reports')
            .select('*')
            .order('created_at', { ascending: false });
        
        if (reportsError) throw reportsError;

        // Group data by domain
        const groupedData = {};
        urlsData.forEach(url => {
            const domain = parse(url.url).hostname;
            if (!groupedData[domain]) {
                groupedData[domain] = {
                    urls: [],
                    totalSEO: 0,
                    totalPerformance: 0,
                    totalAccessibility: 0,
                    reportCount: 0
                };
            }
            const urlReports = reportsData.filter(report => report.url === url.url && report.device === url.device);
            groupedData[domain].urls.push({
                ...url,
                lighthouse_reports: urlReports
            });
            
            // Calculate totals for averages
            urlReports.forEach(report => {
                groupedData[domain].totalSEO += report.seo;
                groupedData[domain].totalPerformance += report.performance;
                groupedData[domain].totalAccessibility += report.accessibility;
                groupedData[domain].reportCount++;
            });
        });

        // Initialize averages
        Object.keys(groupedData).forEach(domain => {
            const { totalSEO, totalPerformance, totalAccessibility, reportCount } = groupedData[domain];
            groupedData[domain].avgSEO = reportCount > 0 ? (totalSEO / reportCount) : null;
            groupedData[domain].avgPerformance = reportCount > 0 ? (totalPerformance / reportCount) : null;
            groupedData[domain].avgAccessibility = reportCount > 0 ? (totalAccessibility / reportCount) : null;
        });

        console.log('Reports fetched and grouped successfully:', groupedData);
        return groupedData;
    } catch (error) {
        console.error('Error fetching reports:', error);
        throw error;
    }
}