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

## 🥷 Ninja Rules: Staying Unbannable
To maintain a perfect IP reputation and avoid Cloudflare 403/429 blocks, follow these expert-tested recommendations:

1.  **Slot Size (4-8 per Site):** On a standard home IP, avoid running more than 8 slots per domain. 4-6 is the "Sweet Spot" for stealth.
2.  **Rotation (15+ Minutes):** Never rotate faster than 10 minutes for prolonged periods. Our default 10-15m range is highly recommended.
3.  **The Golden Rule (2-5s Delay):** Even with a valid cookie, **NEVER** spam requests. Add a 2-5 second delay between your actual scraping calls to simulate human browsing patterns.
4.  **IP Quality:** If you plan on scaling beyond 20+ cookies, always use **Residential Proxies** to distribute the solver load.

### 🛡️ Example: Safe Home-IP Config
```javascript
const sites = [
  { domain: 'es.wallapop.com', size: 4 }, // Safe & stealthy
  { domain: 'vinted.es', size: 4 }       // Balanced for home IP
];
```

---

## 📦 Integration
ClearanceCore is designed to be a drop-in engine for your larger projects.
```javascript
const ClearanceCore = require('./bypass.js');

// Initialize with a 4-cookie buffer and optional Residential Proxy
const core = new ClearanceCore([
  { 
    domain: 'es.wallapop.com', 
    size: 4,
    proxy: 'http://user:pass@p.proxy.com:8000' // Optional Proxy Support
  }
]);
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
