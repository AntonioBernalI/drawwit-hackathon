// src/server/index.js
import express from 'express';
import { createServer, getServerPort, reddit, redis, context} from '@devvit/web/server';
import { media } from '@devvit/media';
import emptyPixelData from './defaultPixelData.js';

const app = express();
app.use(express.json());

const router = express.Router();


router.post('/api/log-message', async (req, res) => {
  console.log('Received message:', req.body.message);
  res.status(200).json({ status: 'ok' });
});

router.get('/api/get-post-id', async (req, res) => {
  try {
    const { postId } = context;
    if (!postId) {
      return res.status(400).json({ error: 'No post ID in context' });
    }
    res.status(200).json({ postId });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch post ID' });
  }
});

app.post('/api/get-hash', async (req, res) => {
  const key = req.body.key;
  if (typeof key !== 'string') {
    return res.status(400).json({ error: 'Key must be a string' });
  }
  try {
    const record = await redis.hGetAll(`${key}-match`);
    res.json(record);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch hash from Redis' });
  }
});

app.post("/api/publish-match", async (req, res) => {
  const now = new Date();
  const expireDate = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate() + 7,
    now.getHours(),
    now.getMinutes(),
    now.getSeconds(),
    now.getMilliseconds()
  );

  const { prompt } = req.body;
  const username = await reddit.getCurrentUsername();
  const { subredditName } = context;

  if (!subredditName) return res.status(400).json({ ok: false, error: 'subredditName is required' });
  if (!username) return res.status(400).json({ ok: false, error: 'username is required' });

  const post = await reddit.submitCustomPost({
    splash: { appDisplayName: `Which one looks more like ${prompt}?` },
    subredditName,
    title: `Which one looks more like ${prompt}?`,
  });

  await redis.set(`${post.id}-screen`, "match");

  await redis.hSet(`${post.id}-match`, {
    prompt: prompt,
    canvasA: JSON.stringify(emptyPixelData),
    canvasB: JSON.stringify(emptyPixelData),
    expiresAt: expireDate.toISOString(),
    status: 'active',
    votesA: '0',
    votesB: '0',
    factionA: JSON.stringify([]),
    factionB: JSON.stringify([]),
    topCollaborators: JSON.stringify([]),
    totalInkSpentOnFactionA: JSON.stringify([]),
    totalInkSpentOnFactionB: JSON.stringify([]),
    votingUsers: JSON.stringify({
      upa: [],
      dowa: [],
      upb: [],
      dowb: []
    }),
  });

  console.log(prompt);
  console.log(JSON.stringify(post));

  const exists = await redis.exists(`${post.id}-match`);
  if (exists > 0) {
    res.json({
      ok: true,
      error: "none",
      id: post.id,
      url: post.url
    });
  } else {
    res.status(500).json({
      ok: false,
      error: "Failed to save hash to Redis"
    });
  }
});



app.use(router);

const server = createServer(app);
server.listen(getServerPort(), () => {});
