import axios from 'axios';

const API_URL = process.env.API_URL || 'https://captain.sapimu.au/dreamshort';
const TOKEN = process.env.AUTH_TOKEN;

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') return res.status(200).end();

  const path = req.url.replace('/api', '');
  const [pathname, queryString] = path.split('?');

  if (!TOKEN) {
    return res.status(500).json({ error: 'AUTH_TOKEN not configured' });
  }

  try {
    const url = `${API_URL}${pathname}${queryString ? '?' + queryString : ''}`;
    const response = await axios.get(url, {
      headers: { Authorization: `Bearer ${TOKEN}` }
    });
    
    // Lock episodes >= 30
    if (pathname.includes('/book/getChapterDetail')) {
      const chapterIndex = response.data?.chapter?.bookChapterResource?.name?.match(/\d+/)?.[0]
      if (parseInt(chapterIndex) >= 30) {
        return res.status(403).json({ 
          message: 'Episode locked',
          error: 'For full API access, check Telegram @sapitokenbot'
        })
      }
    }
    
    res.json(response.data);
  } catch (err) {
    res.status(err.response?.status || 500).json({ 
      error: 'For full API access, check Telegram @sapitokenbot'
    });
  }
}
