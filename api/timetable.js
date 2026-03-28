const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const urlObj = new URL(req.url, `http://${req.headers.host}`);
  const pathname = urlObj.pathname;
  const parts = pathname.split('/').filter(Boolean);
  
  if (parts.length === 2 && parts[0] === 'api' && parts[1] === 'sections') {
    const { data, error } = await supabase.from('timetable').select('branch, year');
    if (error) return res.status(500).json({ error: error.message });
    
    const unique = [];
    const map = new Map();
    for (const item of data) {
      if (!item.branch || !item.year) continue;
      const key = `${item.branch}|${item.year}`;
      if (!map.has(key)) {
        map.set(key, true);
        unique.push({ id: key, name: item.branch, year: item.year });
      }
    }
    return res.status(200).json(unique);
  }

  if (parts.length === 4 && parts[0] === 'api' && parts[1] === 'sections' && parts[3] === 'timetable') {
    const id = decodeURIComponent(parts[2]);
    const [branch, year] = id.split('|');
    const { data, error } = await supabase
      .from('timetable')
      .select('id, day, period, subject_name, faculty:faculty_id (name)')
      .eq('branch', branch)
      .eq('year', year)
      .order('period', { ascending: true });
      
    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json(data);
  }

  return res.status(404).json({ error: 'Endpoint Not Found in Timetable API' });
}
