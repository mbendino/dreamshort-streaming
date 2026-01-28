import express from 'express'
import axios from 'axios'
import { config } from 'dotenv'

config()

const app = express()
const API_URL = process.env.API_URL || 'https://captain.sapimu.au/dreamshort'
const TOKEN = process.env.AUTH_TOKEN

app.use('/api', async (req, res) => {
  const path = req.path
  
  // Proxy subtitle
  if (path === '/subtitle') {
    try {
      const response = await axios.get(req.query.url, { responseType: 'text' })
      res.setHeader('Content-Type', 'text/vtt')
      // Convert SRT to VTT
      const vtt = 'WEBVTT\n\n' + response.data.replace(/(\d{2}:\d{2}:\d{2}),(\d{3})/g, '$1.$2')
      res.send(vtt)
    } catch (err) {
      res.status(500).send('')
    }
    return
  }
  
  try {
    const response = await axios.get(`${API_URL}${path}`, {
      params: req.query,
      headers: { Authorization: `Bearer ${TOKEN}` }
    })
    
    // Lock episodes >= 30
    if (path.includes('/book/getChapterDetail')) {
      const chapterIndex = response.data?.chapter?.bookChapterResource?.name?.match(/\d+/)?.[0]
      if (parseInt(chapterIndex) >= 30) {
        return res.status(403).json({ 
          message: 'Episode locked',
          error: 'For full API access, check Telegram @sapitokenbot'
        })
      }
    }
    
    res.json(response.data)
  } catch (err) {
    res.status(err.response?.status || 500).json({ 
      error: 'For full API access, check Telegram @sapitokenbot' 
    })
  }
})

app.use(express.static('dist'))
app.get('/{*path}', (req, res) => res.sendFile('index.html', { root: 'dist' }))

app.listen(3000, () => console.log('Server running on port 3000'))
