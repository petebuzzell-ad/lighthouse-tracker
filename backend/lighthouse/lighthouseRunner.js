import lighthouse from 'lighthouse';
import * as chromeLauncher from 'chrome-launcher';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

export async function runLighthouse(url, device) {
    console.log(`Starting Lighthouse test for ${url} on ${device}`);
    let chrome;
    try {
        chrome = await chromeLauncher.launch({ chromeFlags: ['--headless'] });
        const options = {
            logLevel: 'info',
            output: 'json',
            onlyCategories: ['performance', 'accessibility', 'seo'],
            port: chrome.port,
            formFactor: device === 'mobile' ? 'mobile' : 'desktop',
            screenEmulation: device === 'mobile' ? { mobile: true } : { mobile: false },
            maxWaitForLoad: 60000, // Increase timeout to 60 seconds
        };

        const runnerResult = await lighthouse(url, options);
        const reportJson = JSON.parse(runnerResult.report);

        const { data, error } = await supabase.from('lighthouse_reports').insert([
            {
                url,
                device,
                performance: reportJson.categories.performance.score * 100,
                accessibility: reportJson.categories.accessibility.score * 100,
                seo: reportJson.categories.seo.score * 100,
                report_json: reportJson,
                created_at: new Date().toISOString()
            }
        ]);

        if (error) throw error;
        console.log(`Lighthouse test completed for ${url} on ${device}`);

        // Update URL status to 'completed'
        await supabase
            .from('urls_to_test')
            .update({ status: 'completed' })
            .match({ url, device });

    } catch (error) {
        console.error(`Error running Lighthouse for ${url} on ${device}:`, error);
        // Update URL status to 'error'
        await supabase
            .from('urls_to_test')
            .update({ status: 'error' })
            .match({ url, device });
        throw error;
    } finally {
        if (chrome) {
            await chrome.kill();
        }
    }
}