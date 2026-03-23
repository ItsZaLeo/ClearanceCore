# 🛡️ BypassCore 1-FILE MASTER
The ultimate minimalist engine for Cloudflare & Bot detection.

---

## 🛠️ Features
- **Live Clock Display:** Real-time ticking countdown showing cookie life.
- **Auto-UA Rotation:** Randomly switches between 5 modern User-Agents for stealth.
- **Automatic Pool Management:** Self-refilling cookie pools (size adjustable).
- **Silent & Generic:** No site-specific hacks; works for any target.
- **Zero Setup:** Automatically builds its own Python virtual environment.

---

## 🚀 Setup & Running
1.  **Just Run:**
    ```bash
    node bypass.js
    ```
2.  **Add Your Target Website:**
    Go to the bottom of `bypass.js` and edit the sites list.
    ```javascript
    const core = new BypassCore([{ domain: 'example.com', size: 1 }]);
    ```

---

## 🌐 Compatibility
- ✅ **Cloudflare (Level 2):** Bypasses standard site protection and challenges.
- ✅ **Browser Emulation:** Automatically handles headers & User-Agent syncing.

---

## 🏗️ Integration
To use this engine in your other scripts, just `require` it:
```javascript
const BypassCore = require('./bypass.js');
const core = new BypassCore([{ domain: 'example.com', size: 3 }]);
core.run(); // Starts the ticking solver loop

// Later, retrieve the latest valid cookie & UA:
setInterval(() => {
  const session = core.get('example.com');
  if (session) {
    console.log(`Using cookie: ${session.cookie}`);
    console.log(`With UA: ${session.ua}`);
  }
}, 5000);
```
