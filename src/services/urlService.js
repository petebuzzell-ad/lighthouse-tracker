import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabase = createClient(process.env.REACT_APP_SUPABASE_URL, process.env.REACT_APP_SUPABASE_KEY);

export const addUrls = async (urls) => {
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
};

export const runLighthouseScan = async (url, device) => {
    // ... implementation
};

export async function getUrlsToTest() {
    try {
        const { data, error } = await supabase
            .from('urls_to_test')
            .select('*')
            .eq('status', 'pending');
        if (error) throw error;
        return data;
    } catch (error) {
        console.error('Error fetching URLs to test:', error);
        throw error;
    }
}

export async function updateUrlStatus(url, device, status) {
    try {
        const { data, error } = await supabase
            .from('urls_to_test')
            .update({ status })
            .match({ url, device });
        if (error) throw error;
        return data;
    } catch (error) {
        console.error('Error updating URL status:', error);
        throw error;
    }
}

export async function getReports() {
    try {
        const { data, error } = await supabase
            .from('lighthouse_reports')
            .select('*')
            .order('created_at', { ascending: false });
        if (error) throw error;
        return data;
    } catch (error) {
        console.error('Error fetching reports:', error);
        throw error;
    }
}