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
  
  if (parts.length === 2 && parts[0] === 'api' && parts[1] === 'faculty') {
    const { data, error } = await supabase.from('faculty').select('*');
    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json(data);
  }

  if (parts.length === 3) {
    const id = parts[2];
    const { data, error } = await supabase.from('faculty').select('*').eq('id', id).single();
    if (error) return res.status(404).json({ error: 'Faculty not found' });
    return res.status(200).json(data);
  }

  if (parts.length === 4 && parts[3] === 'timetable') {
    const id = parts[2];
    const { data, error } = await supabase
      .from('timetable')
      .select('id, day, period, subject_name, branch, year')
      .eq('faculty_id', id)
      .order('period', { ascending: true });
    
    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json(data);
  }

  if (parts.length === 5 && parts[3] === 'day') {
    const id = parts[2];
    const day = parts[4];
    const { data, error } = await supabase
      .from('timetable')
      .select('id, day, period, subject_name, branch, year')
      .eq('faculty_id', id)
      .ilike('day', day)
      .order('period', { ascending: true });
      
    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json(data);
  }

  return res.status(404).json({ error: 'Endpoint Not Found in Faculty API' });
}
