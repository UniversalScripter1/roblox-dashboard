import { createClient } from '@supabase/supabase-js';
import fetch from 'node-fetch';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const executor_id = req.body.executor_id || "anonymous";
        const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
        let country = 'Unknown';

        try {
            const geoRes = await fetch(`https://ipapi.co/${ip}/json/`);
            const geoData = await geoRes.json();
            country = geoData.country_name || 'Unknown';
        } catch {}

        const { error } = await supabase
            .from('script_executions')
            .insert([{ executor_id, timestamp: new Date(), ip_address: ip, country }]);

        if (error) return res.status(500).json({ error: error.message });
        return res.status(200).json({ message: 'Count incremented' });

    } else if (req.method === 'GET') {
        const { data, error } = await supabase
            .from('script_executions')
            .select('*');

        if (error) return res.status(500).json({ error: error.message });
        return res.status(200).json({ data });
    }
    res.status(405).end();
              }
