const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('./db');
const path = require('path');

const JWT_SECRET = 'super-secret-jwt-key-replace-in-prod'; // Fixed secret for simplicity right now

const app = express();
app.use(cors());
app.use(express.json());

// Serve static frontend files from the dist directory
const distPath = path.join(__dirname, '..', 'dist');
app.use(express.static(distPath));

// =======================
// AUTH REST API
// =======================

app.post('/api/auth/register', (req, res) => {
  const { username, email, password } = req.body;
  
  if (!username || !email || !password) {
    return res.status(400).json({ error: 'Missing fields' });
  }

  try {
    const id = Date.now().toString(); // simple ID generation
    const hashedPassword = bcrypt.hashSync(password, 10);
    
    db.prepare(`
      INSERT INTO users (id, username, email, password, display_name) 
      VALUES (?, ?, ?, ?, ?)
    `).run(id, username, email, hashedPassword, username);

    // Create default settings
    db.prepare(`
      INSERT INTO user_settings (user_id) VALUES (?)
    `).run(id);

    const token = jwt.sign({ id }, JWT_SECRET, { expiresIn: '7d' });
    
    res.status(201).json({ token, user: { id, username, email, displayName: username } });
  } catch (err) {
    if (err.code === 'SQLITE_CONSTRAINT_UNIQUE') {
      return res.status(400).json({ error: 'Username or email already exists' });
    }
    res.status(500).json({ error: 'Database error' });
  }
});

app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  
  const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
  if (!user || !bcrypt.compareSync(password, user.password)) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '7d' });
  
  // Omit password from response
  const { password: _, ...safeUser } = user;
  res.json({ token, user: safeUser });
});

// Middleware to verify token
const requireAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.id;
    next();
  } catch (err) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

app.get('/api/auth/me', requireAuth, (req, res) => {
  const user = db.prepare('SELECT * FROM users WHERE id = ?').get(req.userId);
  if (!user) return res.status(404).json({ error: 'User not found' });
  
  const { password: _, two_factor_secret: __, ...safeUser } = user;
  const settingsRaw = db.prepare('SELECT * FROM user_settings WHERE user_id = ?').get(req.userId);
  
  // Parse JSON settings
  const settings = {};
  if (settingsRaw) {
    const jsonCols = [
      'appearance_settings', 'notification_settings', 'voice_video_settings', 
      'privacy_settings', 'chat_settings', 'storage_settings', 'language_settings', 
      'accessibility_settings', 'smart_features_settings', 'application_settings', 
      'advanced_settings'
    ];
    
    // Legacy columns
    settings.mic_sensitivity = settingsRaw.mic_sensitivity;
    settings.output_volume = settingsRaw.output_volume;
    settings.theme = settingsRaw.theme;
    
    // JSON columns
    for (const col of jsonCols) {
      if (settingsRaw[col]) {
        try {
          const parsed = JSON.parse(settingsRaw[col]);
          Object.assign(settings, parsed);
        } catch (e) {
          console.error(`Error parsing JSON for ${col}:`, e);
        }
      }
    }
  }
  
  res.json({ user: safeUser, settings });
});

// =======================
// SETTINGS REST API
// =======================

app.put('/api/settings/profile', requireAuth, (req, res) => {
  const { displayName, username, pronouns, bio, nameFont, avatarUrl, email, phone } = req.body;
  
  try {
    // Basic validation
    if (!username || !email) return res.status(400).json({ error: 'Username and email are required' });

    db.prepare(`
      UPDATE users 
      SET display_name = ?, username = ?, pronouns = ?, bio = ?, name_font = ?, avatar_url = ?, email = ?, phone = ?
      WHERE id = ?
    `).run(displayName, username, pronouns, bio, nameFont, avatarUrl, email, phone, req.userId);
    
    // Fetch updated user
    const updatedUser = db.prepare('SELECT id, username, email, display_name as displayName, phone, avatar_url as avatarUrl FROM users WHERE id = ?').get(req.userId);
    
    res.json({ success: true, user: updatedUser });
  } catch (err) {
    if (err.code === 'SQLITE_CONSTRAINT_UNIQUE') {
      return res.status(400).json({ error: 'Username or email already exists' });
    }
    res.status(500).json({ error: 'Database error' });
  }
});

app.delete('/api/users/me', requireAuth, (req, res) => {
  try {
    // Delete settings, sessions, friends, and the user
    db.prepare('DELETE FROM user_settings WHERE user_id = ?').run(req.userId);
    db.prepare('DELETE FROM sessions WHERE user_id = ?').run(req.userId);
    db.prepare('DELETE FROM friends WHERE user_id = ? OR friend_id = ?').run(req.userId, req.userId);
    db.prepare('DELETE FROM users WHERE id = ?').run(req.userId);
    
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Database error' });
  }
});

app.put('/api/settings/account', requireAuth, (req, res) => {
  const { currentPassword, newPassword } = req.body;
  
  const user = db.prepare('SELECT password FROM users WHERE id = ?').get(req.userId);
  if (!bcrypt.compareSync(currentPassword, user.password)) {
    return res.status(400).json({ error: 'Invalid current password' });
  }

  const hashedNew = bcrypt.hashSync(newPassword, 10);
  db.prepare('UPDATE users SET password = ? WHERE id = ?').run(hashedNew, req.userId);
  
  res.json({ success: true });
});

app.put('/api/settings/voice', requireAuth, (req, res) => {
  const { micSensitivity, outputVolume } = req.body;
  
  db.prepare(`
    UPDATE user_settings 
    SET mic_sensitivity = ?, output_volume = ?
    WHERE user_id = ?
  `).run(micSensitivity, outputVolume, req.userId);
  
  res.json({ success: true });
});

app.patch('/api/settings/:category', requireAuth, (req, res) => {
  const { category } = req.params;
  const updates = req.body; // Key-value object of settings to update
  
  const validCategories = [
    'appearance', 'notification', 'voice_video', 
    'privacy', 'chat', 'storage', 'language', 
    'accessibility', 'smart_features', 'application', 'advanced'
  ];
  
  if (!validCategories.includes(category)) {
    return res.status(400).json({ error: 'Invalid settings category' });
  }
  
  const colName = category + '_settings';
  
  try {
    // Get existing JSON
    const row = db.prepare(\`SELECT \${colName} FROM user_settings WHERE user_id = ?\`).get(req.userId);
    let existingSettings = {};
    if (row && row[colName]) {
      try {
        existingSettings = JSON.parse(row[colName]);
      } catch (e) {}
    }
    
    // Merge updates
    const newSettings = { ...existingSettings, ...updates };
    
    // Save back
    db.prepare(\`
      UPDATE user_settings 
      SET \${colName} = ? 
      WHERE user_id = ?
    \`).run(JSON.stringify(newSettings), req.userId);
    
    res.json({ success: true, settings: newSettings });
  } catch (err) {
    console.error('Settings save error:', err);
    res.status(500).json({ error: 'Database error' });
  }
});

// =======================
// ROOMS & FRIENDS REST API
// =======================

app.get('/api/rooms', requireAuth, (req, res) => {
  const rooms = db.prepare('SELECT * FROM rooms ORDER BY created_at DESC').all();
  res.json(rooms);
});

app.post('/api/rooms', requireAuth, (req, res) => {
  const { name, category, isPrivate } = req.body;
  const id = Date.now().toString();
  
  db.prepare(`
    INSERT INTO rooms (id, name, owner_id, category, is_private)
    VALUES (?, ?, ?, ?, ?)
  `).run(id, name, req.userId, category || 'general', isPrivate ? 1 : 0);
  
  const newRoom = db.prepare('SELECT * FROM rooms WHERE id = ?').get(id);
  res.json(newRoom);
});

app.get('/api/friends', requireAuth, (req, res) => {
  const friends = db.prepare(`
    SELECT u.id, u.username, u.display_name as displayName, u.avatar_url as avatarUrl, u.status
    FROM friends f
    JOIN users u ON (f.friend_id = u.id)
    WHERE f.user_id = ? AND f.status = 'accepted'
  `).all(req.userId);
  res.json(friends);
});

app.post('/api/friends', requireAuth, (req, res) => {
  const { username } = req.body;
  const friend = db.prepare('SELECT id FROM users WHERE username = ?').get(username);
  
  if (!friend) return res.status(404).json({ error: 'User not found' });
  if (friend.id === req.userId) return res.status(400).json({ error: 'Cannot add yourself' });

  try {
    db.prepare('INSERT INTO friends (user_id, friend_id, status) VALUES (?, ?, ?)')
      .run(req.userId, friend.id, 'accepted');
    // Also add reciprocal relation for simplicity in this demo
    db.prepare('INSERT INTO friends (user_id, friend_id, status) VALUES (?, ?, ?)')
      .run(friend.id, req.userId, 'accepted');
      
    res.json({ success: true });
  } catch (err) {
    res.status(400).json({ error: 'Already friends' });
  }
});


// =======================
// SESSIONS API
// =======================

app.get('/api/sessions', requireAuth, (req, res) => {
  try {
    const sessions = db.prepare('SELECT id, device_name as name, device_type as type, location, last_active as lastActive, ip_address as ip, created_at as createdAt FROM sessions WHERE user_id = ? ORDER BY last_active DESC').all(req.userId);
    
    // Determine the current session using the token
    const authHeader = req.headers.authorization;
    const currentToken = authHeader ? authHeader.split(' ')[1] : null;

    const mapped = sessions.map(s => {
      const dbToken = db.prepare('SELECT token FROM sessions WHERE id = ?').get(s.id)?.token;
      return {
        ...s,
        isCurrent: currentToken === dbToken
      };
    });
    
    res.json(mapped);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

app.delete('/api/sessions/:id', requireAuth, (req, res) => {
  try {
    const { id } = req.params;
    
    const session = db.prepare('SELECT user_id FROM sessions WHERE id = ?').get(id);
    if (!session || session.user_id !== req.userId) {
      return res.status(403).json({ error: 'Forbidden' });
    }
    
    db.prepare('DELETE FROM sessions WHERE id = ?').run(id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Database error' });
  }
});

app.delete('/api/sessions', requireAuth, (req, res) => {
  try {
    // Delete all sessions EXCEPT the current one
    const authHeader = req.headers.authorization;
    const currentToken = authHeader ? authHeader.split(' ')[1] : null;
    
    db.prepare('DELETE FROM sessions WHERE user_id = ? AND token != ?').run(req.userId, currentToken);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Database error' });
  }
});

// =======================
// WEBSOCKET SERVER
// =======================

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

// In-memory data store
const users = new Map(); // socket.id -> { userId, username, roomId }
const rooms = new Map(); // roomId -> Set of socket.ids

// Socket authentication middleware
io.use((socket, next) => {
  const token = socket.handshake.auth.token;
  if (!token) {
    return next(new Error('Authentication error'));
  }
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    socket.userId = decoded.id;
    next();
  } catch (err) {
    next(new Error('Authentication error'));
  }
});

io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id} (DB ID: ${socket.userId})`);

  socket.on('join-room', ({ roomId, user }) => {
    // BUG FIX: Prevent duplicate users in the same room
    for (const [existingSocketId, existingData] of users.entries()) {
      if (existingData.id === user.id && existingData.roomId === roomId) {
        console.log(`Disconnecting duplicate user ${user.id}`);
        // Notify the old socket to disconnect or forcefully kick them from tracking
        const oldSocket = io.sockets.sockets.get(existingSocketId);
        if (oldSocket) {
          oldSocket.leave(roomId);
        }
        users.delete(existingSocketId);
        rooms.get(roomId)?.delete(existingSocketId);
        // We notify the room that they left before they rejoin
        socket.to(roomId).emit('user-left', { socketId: existingSocketId, userId: user.id });
      }
    }

    socket.join(roomId);
    users.set(socket.id, { ...user, roomId });

    if (!rooms.has(roomId)) {
      rooms.set(roomId, new Set());
    }
    rooms.get(roomId).add(socket.id);

    const usersInRoom = Array.from(rooms.get(roomId))
      .filter(id => id !== socket.id)
      .map(id => ({ socketId: id, user: users.get(id) }));

    socket.emit('room-users', usersInRoom);
    socket.to(roomId).emit('user-joined', { socketId: socket.id, user });
    
    try {
      const targetSettingsRaw = db.prepare('SELECT privacy_settings FROM user_settings WHERE user_id = ?').get(user.id);
      let hideActivity = false;
      if (targetSettingsRaw && targetSettingsRaw.privacy_settings) {
        const privacy = JSON.parse(targetSettingsRaw.privacy_settings);
        hideActivity = !!privacy.hideActivity;
      }
      
      if (!hideActivity) {
        io.to(roomId).emit('chat-message', {
          id: Date.now().toString(),
          userId: 'system',
          username: 'System',
          content: `${user.displayName || user.username} joined the room.`,
          timestamp: Date.now()
        });
      }
    } catch(e) {}
  });

  socket.on('send-message', (data) => {
    const user = users.get(socket.id);
    if (user && user.roomId) {
      // If it's a direct message room, we would check privacy here.
      // For now, if the room is not 'general', we can check the owner's privacy, but rooms are simpler.
      // Since DMs are not fully implemented, we'll just demonstrate the privacy check pattern:
      /*
      const targetSettingsRaw = db.prepare('SELECT privacy_settings FROM user_settings WHERE user_id = ?').get(targetId);
      if (targetSettingsRaw && targetSettingsRaw.privacy_settings) {
        const privacy = JSON.parse(targetSettingsRaw.privacy_settings);
        if (privacy.whoCanMessage === 'nobody') return;
        if (privacy.whoCanMessage === 'friends') {
          const isFriend = db.prepare('SELECT 1 FROM friends WHERE user_id = ? AND friend_id = ?').get(targetId, user.id);
          if (!isFriend) return;
        }
      }
      */

      const message = {
        id: Date.now().toString(),
        userId: user.id,
        username: user.displayName || user.username,
        content: data.content,
        timestamp: Date.now()
      };
      io.to(user.roomId).emit('chat-message', message);
    }
  });

  // WebRTC Signaling
  socket.on('webrtc-offer', ({ targetSocketId, offer }) => {
    const fromUser = users.get(socket.id);
    const targetUser = users.get(targetSocketId);
    
    if (fromUser && targetUser) {
      try {
        const targetSettingsRaw = db.prepare('SELECT privacy_settings FROM user_settings WHERE user_id = ?').get(targetUser.id);
        if (targetSettingsRaw && targetSettingsRaw.privacy_settings) {
          const privacy = JSON.parse(targetSettingsRaw.privacy_settings);
          if (privacy.whoCanCall === 'nobody') return;
          if (privacy.whoCanCall === 'friends') {
            const isFriend = db.prepare('SELECT 1 FROM friends WHERE user_id = ? AND friend_id = ?').get(targetUser.id, fromUser.id);
            if (!isFriend) return; // Block call
          }
        }
      } catch(e) {}
    }

    socket.to(targetSocketId).emit('webrtc-offer', {
      fromSocketId: socket.id,
      fromUser: fromUser,
      offer
    });
  });

  socket.on('webrtc-answer', ({ targetSocketId, answer }) => {
    socket.to(targetSocketId).emit('webrtc-answer', {
      fromSocketId: socket.id,
      answer
    });
  });

  socket.on('webrtc-ice-candidate', ({ targetSocketId, candidate }) => {
    socket.to(targetSocketId).emit('webrtc-ice-candidate', {
      fromSocketId: socket.id,
      candidate
    });
  });

  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.id}`);
    const user = users.get(socket.id);
    if (user) {
      const roomId = user.roomId;
      socket.to(roomId).emit('user-left', { socketId: socket.id, userId: user.id });
      
      try {
        const targetSettingsRaw = db.prepare('SELECT privacy_settings FROM user_settings WHERE user_id = ?').get(user.id);
        let hideActivity = false;
        if (targetSettingsRaw && targetSettingsRaw.privacy_settings) {
          const privacy = JSON.parse(targetSettingsRaw.privacy_settings);
          hideActivity = !!privacy.hideActivity;
        }
        
        if (!hideActivity) {
          io.to(roomId).emit('chat-message', {
            id: Date.now().toString(),
            userId: 'system',
            username: 'System',
            content: `${user.displayName || user.username} left the room.`,
            timestamp: Date.now()
          });
        }
      } catch(e) {}

      users.delete(socket.id);
      if (rooms.has(roomId)) {
        rooms.get(roomId).delete(socket.id);
        if (rooms.get(roomId).size === 0) {
          rooms.delete(roomId);
        }
      }
    }
  });
});

// SPA Catch-all route for React Router
app.get('*', (req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Signaling server running on port ${PORT}`);
});