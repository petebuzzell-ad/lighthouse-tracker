import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

async function addUrls(urls) {
    // ... (keep the existing implementation)
}

async function getReports() {
    // ... (keep the existing implementation)
}

async function runLighthouseScan(url, device) {
    console.log(`Lighthouse scan requested for ${url} on ${device}`);
}

export {
    addUrls,
    getReports,
    runLighthouseScan
};