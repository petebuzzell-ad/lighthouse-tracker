import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

async function testSupabaseConnection() {
    try {
        const { data, error } = await supabase
            .from('lighthouse_reports')
            .select('count')
            .single();
        if (error) throw error;
        console.log('Supabase connection successful. Row count:', data.count);
    } catch (error) {
        console.error('Supabase connection failed:', error);
    }
}

testSupabaseConnection();
