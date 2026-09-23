const db = require('./db');

const migrate = () => {
  console.log('Running migrations...');

  try {
    // Add new columns to users if they don't exist
    try {
      db.exec(`ALTER TABLE users ADD COLUMN phone TEXT;`);
    } catch (e) { /* Ignore if exists */ }
    
    try {
      db.exec(`ALTER TABLE users ADD COLUMN two_factor_enabled BOOLEAN DEFAULT 0;`);
    } catch (e) { /* Ignore if exists */ }
    
    try {
      db.exec(`ALTER TABLE users ADD COLUMN two_factor_secret TEXT;`);
    } catch (e) { /* Ignore if exists */ }

    // Create sessions table
    db.exec(`
      CREATE TABLE IF NOT EXISTS sessions (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        token TEXT UNIQUE NOT NULL,
        device_name TEXT,
        device_type TEXT,
        location TEXT,
        ip_address TEXT,
        last_active DATETIME DEFAULT CURRENT_TIMESTAMP,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      );
    `);

    // For user_settings, since there are 80+ settings, the easiest and most robust approach in SQLite
    // without creating a massive 80-column schema is to serialize each section into a JSON string,
    // OR create categories. Since SQLite supports JSON functions, let's use categoric JSON text columns.
    
    const settingsColumns = [
      'appearance_settings',
      'notification_settings',
      'voice_video_settings',
      'privacy_settings',
      'chat_settings',
      'storage_settings',
      'language_settings',
      'accessibility_settings',
      'smart_features_settings',
      'application_settings',
      'advanced_settings'
    ];

    for (const col of settingsColumns) {
      try {
        db.exec(`ALTER TABLE user_settings ADD COLUMN ${col} TEXT DEFAULT '{}';`);
      } catch (e) { /* Ignore if exists */ }
    }

    // Optional: Migrate existing user_settings rows to use the JSON columns
    // We can just leave them as '{}' since the server will merge defaults.

    console.log('Migrations completed successfully.');
  } catch (err) {
    console.error('Migration failed:', err);
  }
};

migrate();
