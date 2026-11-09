import express from 'express';
import { createServer as createViteServer } from 'vite';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  app.use(express.json());

  // Ensure data directory and messages.json exist
  const dataDir = path.join(__dirname, 'data');
  const messagesFile = path.join(dataDir, 'messages.json');

  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  if (!fs.existsSync(messagesFile)) {
    fs.writeFileSync(messagesFile, JSON.stringify([], null, 2));
  }

  // API endpoint to submit a message to Mohamed
  app.post('/api/messages', (req, res) => {
    try {
      const { name, message, wish } = req.body;
      if ((!message || !message.trim()) && (!wish || !wish.trim())) {
        return res.status(400).json({ error: 'Message or wish is required' });
      }

      const senderName = (name && typeof name === 'string' && name.trim()) ? name.trim() : 'أمل';
      const cleanMessage = (message && typeof message === 'string') ? message.trim() : '';
      const cleanWish = (wish && typeof wish === 'string') ? wish.trim() : '';
      
      let messages = [];
      try {
        const fileContent = fs.readFileSync(messagesFile, 'utf-8');
        messages = JSON.parse(fileContent || '[]');
      } catch {
        messages = [];
      }

      const newMsg = {
        id: Date.now().toString(),
        name: senderName,
        message: cleanMessage,
        wish: cleanWish,
        targetPhone: '01206821147',
        status: 'forwarded_to_whatsapp',
        createdAt: new Date().toISOString(),
      };

      messages.unshift(newMsg);
      // Automated attempt to CallMeBot WhatsApp Gateway for +201206821147
      const whatsappText = `💌 *رسالة وأمنية خاصة من ${senderName}*\n\n🕊️ *الأمنية:* "${cleanWish}"\n\n💖 *الرسالة:* "${cleanMessage}"\n\n✨ _مرسلة من موقع مخطوطة النبض_`;
      const callMeBotKey = process.env.CALLMEBOT_API_KEY || '';
      if (callMeBotKey) {
        fetch(`https://api.callmebot.com/whatsapp.php?phone=+201206821147&text=${encodeURIComponent(whatsappText)}&apikey=${callMeBotKey}`)
          .then(r => r.text())
          .then(t => console.log('[CallMeBot WhatsApp Gateway Result]:', t))
          .catch(e => console.log('[CallMeBot Gateway Notice]:', e?.message));
      }

      console.log(`[WhatsApp Forward to 01206821147] From: ${senderName} | Wish: ${cleanWish} | Message: ${cleanMessage}`);

      return res.json({ success: true, message: newMsg });
    } catch (err) {
      console.error('Error saving message:', err);
      return res.status(500).json({ error: 'Internal server error saving message' });
    }
  });

  // API endpoint for Mohamed to retrieve messages
  app.get('/api/messages', (_req, res) => {
    try {
      let messages = [];
      if (fs.existsSync(messagesFile)) {
        const fileContent = fs.readFileSync(messagesFile, 'utf-8');
        messages = JSON.parse(fileContent || '[]');
      }
      return res.json({ messages });
    } catch (err) {
      console.error('Error fetching messages:', err);
      return res.json({ messages: [] });
    }
  });

  // Mount Vite dev middleware in development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Production static serving
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server listening on port ${PORT}`);
  });
}

startServer();
