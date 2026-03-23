# 🛡️ ClearanceCore 1-FILE MASTER
The ultimate minimalist engine for Cloudflare Clearance Cookie generation. **Engineered for zero-latency rotation and premium terminal aesthetics.**

---

## ⚡ Quick Setup & Run
```bash
git clone https://github.com/ItsZaLeo/bypass-core.git && cd bypass-core && node bypass.js
```

---

## 🛠️ Key Technologies
- **Slot-Centric Architecture:** Monitors fixed slots for a steady-state dashboard.
- **Buffered Proactive Rotation:** Prefetches cookies 30s before expiry; swaps instantly at `0s`.
- **Temporal Event Logging:** Dynamic event logs that automatically fade after 4 seconds to keep your workspace clean.
- **Zero-Setup VENV:** Self-managing Python virtual environment for `cloudscraper`.
- **UA-Sync:** Perfectly synchronizes modern User-Agents with Cloudflare tokens.

---

## 🚀 Proactive Lifecycle
1.  **Preparation (30s left):** Clock turns **RED** and pre-fetching begins.
2.  **Ready Stage:** New cookie is buffered and waits for the old one to die.
3.  **Instant Swap (0s):** The handoff happens in a millisecond—zero delay for your scraper.

---

## 📦 Integration
ClearanceCore is designed to be a drop-in engine for your larger projects.
```javascript
const ClearanceCore = require('./bypass.js');

// Initialize with a 4-cookie buffer for es.wallapop.com
const core = new ClearanceCore([{ domain: 'es.wallapop.com', size: 4 }]);
core.run(); // Start the background solver

// Retrieve the freshest cookie anytime
setInterval(() => {
  const session = core.get('es.wallapop.com');
  if (session) {
    console.log(`📡 Using: ${session.cookie}`);
  }
}, 5000);
```

---

## 🌐 Author & Vision
**Developed by ItsZaLeo**
*Focusing on high-performance, minimalist tools for the modern web.*
