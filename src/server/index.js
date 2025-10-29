// src/server/index.js
import express from 'express';
import { createServer, getServerPort, reddit, redis, context} from '@devvit/web/server';
import emptyPixelData from './defaultPixelData.js';

const app = express();
app.use(express.json());

const router = express.Router();

async function initializeInk(username){
  const now = new Date();
  await redis.set(`${username}-lastInkCheck`, now.toString());
  await redis.set(`${username}-ink`, '30');
  await redis.set(`${username}-pixelsPlaced`, "0");
  await redis.hSet(`${username}-powers`, {
    pepper: "0",
    flashlight: "0",
    smudge: "0",
    invert: "0",
    mirror: "0",
    blackout: "0"
  });
}

async function initializePowers(username){
  await redis.hSet(`${username}-powers`, {
    pepper: "0",
    flashlight: "0",
    smudge: "0",
    invert: "0",
    mirror: "0",
    blackout: "0"
  });
}

router.post('/api/set-power', async (req, res) => {
  try {
    console.log("=== /api/set-power START ===");

    const username = await reddit.getCurrentUsername();
    if (!username) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const { requestedPower } = req.body;

    if (!requestedPower) {
      return res.status(400).json({ error: 'Power not specified' });
    }

    const validPowers = ['pepper', 'flashlight', 'smudge', 'invert', 'mirror', 'blackout'];
    if (!validPowers.includes(requestedPower)) {
      return res.status(400).json({ error: 'Invalid power type' });
    }

    const powerKey = `${username}-powers`;

    const exists = await redis.exists(powerKey);
    if (exists === 0) {
      await initializePowers(username);
    }

    const newValue = await redis.hIncrBy(powerKey, requestedPower, 1);
    console.log(`[OK] ${username} bought ${requestedPower} → new count: ${newValue}`);
    return res.status(200).json({
      success: true,
      username,
      power: requestedPower,
      newCount: newValue,
    });
  } catch (error) {
    console.error("[ERROR] /api/set-power:", error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});


router.post('/api/decrement-power', async (req, res) => {
  try {
    console.log("=== /api/decrement-power START ===");

    const username = await reddit.getCurrentUsername();
    if (!username) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const { requestedPower } = req.body;

    if (!requestedPower) {
      return res.status(400).json({ error: 'Power not specified' });
    }

    const validPowers = ['pepper', 'flashlight', 'smudge', 'invert', 'mirror', 'blackout'];
    if (!validPowers.includes(requestedPower)) {
      return res.status(400).json({ error: 'Invalid power type' });
    }

    const powerKey = `${username}-powers`;

    const exists = await redis.exists(powerKey);
    if (exists === 0) {
      await initializePowers(username);
    }

    const currentValueStr = await redis.hGet(powerKey, requestedPower);
    const currentValue = parseInt(currentValueStr, 10) || 0;

    if (currentValue <= 0) {
      return res.status(400).json({
        success: false,
        error: 'Cannot decrement. Power quantity is zero or less.',
        username,
        power: requestedPower,
        currentCount: currentValue,
      });
    }
    const newValue = await redis.hIncrBy(powerKey, requestedPower, -1);
    console.log(`[OK] ${username} used ${requestedPower} → new count: ${newValue}`);
    return res.status(200).json({
      success: true,
      username,
      power: requestedPower,
      newCount: newValue,
    });
  } catch (error) {
    console.error("[ERROR] /api/decrement-power:", error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});


router.post('/api/get-power', async (req, res) => {
  try {
    const username = await reddit.getCurrentUsername();
    if (!username) {
      return res.status(401).json({ error: 'User not authenticated' });
    }
    const powerKey = `${username}-powers`;
    const exists = await redis.exists(powerKey);
    if (exists === 0) {
      await initializePowers(username);
    }
    const powers = await redis.hGetAll(powerKey);
    return res.status(200).json({
      success: true,
      username,
      powers,
    });
  } catch (error) {
    console.error("[ERROR] /api/get-power:", error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});


router.get('/api/get-pixels-placed', async (_req, res) => {
  try {
    const username = await reddit.getCurrentUsername();
    if (!username) {
      res.status(401).json({ error: 'User not authenticated' });
      return;
    }

    const key = `${username}-pixelsPlaced`;
    const exists = await redis.exists(key);
    let pixelsPlaced;
    if (exists === 0) {
      await initializeInk(username);
      pixelsPlaced = '0';
    } else {
      pixelsPlaced = await redis.get(key);
    }
    res.status(200).json({ pixelsPlaced });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/api/add-pixels', async (req, res) => {
  try {
    console.log("=== /api/add-pixels START ===");

    const username = await reddit.getCurrentUsername();
    if (!username) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const { amount } = req.body;
    const pixelsToAdd = Number(amount);

    if (isNaN(pixelsToAdd) || pixelsToAdd <= 0) {
      return res.status(400).json({ error: 'Invalid amount' });
    }

    let currentPixels = await redis.get(`${username}-pixelsPlaced`);
    currentPixels = Number(currentPixels) || 0;

    const newTotal = currentPixels + pixelsToAdd;
    await redis.set(`${username}-pixelsPlaced`, String(newTotal));

    console.log(`[OK] ${username} placed +${pixelsToAdd} pixels → total: ${newTotal}`);

    return res.status(200).json({
      success: true,
      username,
      added: pixelsToAdd,
      total: newTotal,
    });
  } catch (error) {
    console.error("[ERROR] /api/add-pixels:", error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});


router.post('/api/spend-ink', async (req, res) => {
  try {
    const username = await reddit.getCurrentUsername();
    if (!username) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const { quantity } = req.body;
    if (typeof quantity !== 'number' || quantity <= 0) {
      return res.status(400).json({ error: 'Invalid quantity' });
    }

    const key = `${username}-ink`;
    let ink = await redis.get(key);

    if (!ink) {
      await initializeInk(username);
      ink = await redis.get(key);
    }

    ink = parseInt(ink, 10);

    if (ink === 0) {
      return res.status(400).json({ error: 'Ink is 0 — cannot spend.' });
    }

    const updatedInk = await redis.incrBy(key, -quantity);

    return res.status(200).json({ ink: updatedInk });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

function gamma(x) {
  return Math.ceil((-1 + Math.sqrt(1 + (4 * x) / 50)) / 2);
}

async function addInk(username, quantity) {
  let pixelsPlaced = await redis.get(`${username}-pixelsPlaced`);
  pixelsPlaced = Number(pixelsPlaced);

  let ink = await redis.get(`${username}-ink`);
  let level = gamma(pixelsPlaced);
  const limit = (20 * level + 1) + 30;

  console.log(`user's level: ${level} user's ink limit: ${limit} user's ink: ${ink}`);

  if (ink >= limit) {
    console.log(`limit passed user's level: ${level} user's ink limit: ${limit} user's ink: ${ink}`);
    await redis.set(`${username}-ink`, String(limit - 1));
    return limit - 1;
  }

  const key = `${username}-ink`;
  const exists = await redis.exists(key);
  if (exists === 0) {
    await initializeInk(username);
  }

  const updatedInk = await redis.incrBy(key, quantity);
  return updatedInk;
}

router.post('/api/add-ink', async (req, res) => {
  try {
    const username = await reddit.getCurrentUsername();
    if (!username) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const { amount } = req.body;

    if (typeof amount !== 'number' || amount <= 0) {
      return res.status(400).json({ error: 'Invalid ink amount' });
    }

    const key = `${username}-ink`;
    const exists = await redis.exists(key);

    if (exists === 0) {
      await initializeInk(username);
    }

    let currentInk = Number(await redis.get(key));

    const updatedInk = await addInk(username, amount);

    let pixelsPlaced = Number(await redis.get(`${username}-pixelsPlaced`));
    const level = gamma(pixelsPlaced);
    const limit = (20 * level + 1) + 30;

    if (updatedInk > limit) {
      await redis.set(key, String(limit - 1));
      return res.status(200).json({ ink: limit - 1 });
    }

    return res.status(200).json({ ink: updatedInk });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


router.get('/api/get-ink', async (_req, res) => {
  try {
    const username = await reddit.getCurrentUsername();
    if (!username) {
      return res.status(401).json({ error: 'User not authenticated' });
    }
    const key = `${username}-ink`;
    const exists = await redis.exists(key);
    let ink;
    if (exists === 0) {
      await initializeInk(username);
      ink = "30";
    } else {
      ink = await redis.get(key);
    }
    return res.status(200).json({ ink });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/api/update-ink', async (_req, res) => {
  function thirtySecondIntervals(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;

    if (isNaN(date.getTime()) || diffMs < 30000) return 0;
    return Math.floor(diffMs / 30000);
  }

  try {
    console.log("=== /api/update-ink START ===");

    const username = await reddit.getCurrentUsername();
    if (!username) return res.status(401).json({ error: 'User not authenticated' });

    const exists = await redis.exists(`${username}-ink`);
    let ink;

    if (exists === 0) {
      await initializeInk(username);
      ink = 30;
    } else {
      const tempInk = await redis.get(`${username}-ink`);
      const lastInkCheckDate = await redis.get(`${username}-lastInkCheck`);
      const intervals = thirtySecondIntervals(lastInkCheckDate);

      let pixelsPlaced = await redis.get(`${username}-pixelsPlaced`);
      pixelsPlaced = Number(pixelsPlaced) || 0;
      const level = gamma(pixelsPlaced);
      const limit = (20 * level + 1) + 30;

      if (intervals === 0) {
        ink = Number(tempInk);
      } else {
        const regenAmount = intervals;
        const newInk = Math.min(limit, Number(tempInk) + regenAmount);
        ink = newInk;
        await redis.set(`${username}-ink`, String(ink));
        console.log(`[INK] +${regenAmount} → ${ink}/${limit}`);
      }

      if (ink > limit) {
        ink = limit;
        await redis.set(`${username}-ink`, String(ink));
      }
    }

    const now = new Date();
    await redis.set(`${username}-lastInkCheck`, now.toString());
    console.log(`[OK] ${username} ink: ${ink}`);

    return res.status(200).json({ success: true, username, ink });
  } catch (error) {
    console.error("[ERROR] /api/update-ink:", error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/api/update-last-ink-check', async (_req, res) => {
  try {
    console.log("=== /api/update-last-ink-check START ===");

    const username = await reddit.getCurrentUsername();
    if (!username) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const now = new Date();
    await redis.set(`${username}-lastInkCheck`, now.toString());

    console.log(`[OK] Updated lastInkCheck for ${username}: ${now}`);
    return res.status(200).json({ success: true, username, lastInkCheck: now });
  } catch (error) {
    console.error("[ERROR] /api/update-last-ink-check:", error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});


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

app.post("/api/update-canvasA", async (req, res) => {
  const { postId, canvasA } = req.body;
  if (!postId || !canvasA) {
    return res.status(400).json({ ok: false, error: 'postId and canvasA are required' });
  }

  await redis.hSet(`${postId}-match`, {
    canvasA: JSON.stringify(canvasA)
  });
  res.json({ ok: true, updated: 'canvasA' });
});

app.post("/api/update-canvasB", async (req, res) => {
  const { postId, canvasB } = req.body;
  if (!postId || !canvasB) {
    return res.status(400).json({ ok: false, error: 'postId and canvasB are required' });
  }
  await redis.hSet(`${postId}-match`, {
    canvasB: JSON.stringify(canvasB)
  });
  res.json({ ok: true, updated: 'canvasB' });
});


app.post("/api/expire-match", async (req, res) => {
  const { postId } = context;
  if (!postId) {
    return res.status(400).json({ ok: false, error: 'failed to fetch post Id' });
  }
  await redis.hSet(`${postId}-match`, {
    status: 'expired'
  });
  res.json({ ok: true, updated: 'status' });
});

router.get('/api/get-expires-at', async (req, res) => {
  try {
    const { postId } = context;
    if (!postId) {
      return res.status(400).json({ error: 'No post ID in context' });
    }

    const expiresAt = await redis.hGet(`${postId}-match`, 'expiresAt');

    if (!expiresAt) {
      return res.status(404).json({ error: 'Expiration date not found' });
    }

    res.status(200).json({ expiresAt });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch expiration date' });
  }
});

app.post("/api/publish-match", async (req, res) => {
  const now = new Date();
  const expireDate = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    now.getHours(),
    now.getMinutes() + 1,
    now.getSeconds(),
    now.getMilliseconds()
  );

  const { prompt } = req.body;
  const username = await reddit.getCurrentUsername();
  const { subredditName } = context;

  if (!subredditName) return res.status(400).json({ ok: false, error: 'subredditName is required' });
  if (!username) return res.status(400).json({ ok: false, error: 'username is required' });

  const post = await reddit.submitCustomPost({
    userGeneratedContent: {
      text: `Which one looks more like ${prompt}?`
    },
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
    status: 'active', // active || expired
    votesA: '0',
    votesB: '0',
    factionA: JSON.stringify([]),
    factionB: JSON.stringify([]),
    topCollaborators: JSON.stringify([]),
    totalInkSpentOnFactionA: JSON.stringify([]),
    totalInkSpentOnFactionB: JSON.stringify([])
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

