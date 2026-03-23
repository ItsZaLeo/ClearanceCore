const { execSync, spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
const readline = require('readline');

class ClearanceCore {
  constructor(sites = [], dir = __dirname) {
    this.sites = sites;
    this.dir = dir;
    this.pool = {};
    this.events = [];
    this.venv = path.join(this.dir, '.venv');
    this.pyPath = path.join(this.venv, 'bin/python3');
    this.uas = [
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36",
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:122.0) Gecko/20100101 Firefox/122.0",
      "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 Edge/120.0.0.0"
    ];
    this.solvingCount = 0;
    this.pyLogic = `import sys,json,time,cloudscraper
def s(u, ua):
 try:
  scr=cloudscraper.create_scraper(browser={'browser':'chrome','platform':'windows','desktop':True})
  scr.headers.update({
   'User-Agent':ua,
   'Accept':'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
   'Accept-Language':'en-US,en;q=0.9',
   'Referer':'https://www.google.com/'
  })
  url = u
  # 🧘 Attempt 1
  t=scr.get(url, timeout=30); time.sleep(2)
  if t.status_code == 200: res = t
  else:
   # 🚪 Attempt 2 (Verification/Retry)
   res=scr.get(url, timeout=30)
  
  if res.status_code != 200: return {"success":False,"error":f"Status {res.status_code}"}
  d=scr.cookies.get_dict()
  return {"success":True,"cookie":'; '.join([f'{k}={v}' for k,v in d.items()]),"ua":scr.headers.get('User-Agent',ua),"created":int(time.time()),"valid":True}
 except Exception as e: return {"success":False,"error":str(e)}
if __name__=='__main__':print(json.dumps(s(sys.argv[1], sys.argv[2])))`;
    this.checkSetup();
  }

  checkSetup() {
    if (!fs.existsSync(this.pyPath)) {
      process.stdout.write('\x1b[33m🛠️  Building solver engine...\x1b[0m');
      try {
        execSync(`python3 -m venv ${this.venv}`, { stdio: 'ignore' });
        execSync(`${this.venv}/bin/pip install cloudscraper`, { stdio: 'ignore' });
        console.log(' \x1b[32m✅ Ready.\x1b[0m');
      } catch (e) { console.error(' \x1b[31m❌ Install Failed.\x1b[0m'); process.exit(1); }
    }
  }

  logEvent(msg) {
    this.events.push({ msg, time: Date.now() });
  }

  async solve(domain) {
    this.solvingCount++;
    return new Promise(r => {
      const u = domain.startsWith('http') ? domain : `https://${domain}`;
      const ua = this.uas[Math.floor(Math.random() * this.uas.length)];
      const p = spawn(this.pyPath, ['-c', this.pyLogic, u, ua]);
      let out = '';
      let err = '';
      p.stdout.on('data', d => out += d);
      p.stderr.on('data', d => err += d);
      p.on('close', (code) => {
        this.solvingCount--;
        try {
          if (code !== 0) throw new Error(err || `Exit code ${code}`);
          const res = JSON.parse(out);
          if (res.success) {
            if (!this.pool[domain]) this.pool[domain] = { pool: [] };
            res.exp = res.created + (Math.floor(Math.random() * 6) + 10) * 60; // 10-15m random life
            this.pool[domain].pool.push(res);
            this.logEvent(`\x1b[32m✅ [${domain}]\x1b[0m Cookie Ready (\x1b[36m${this.pool[domain].pool.length}\x1b[0m in pool).`);
            this.lastError = false;
          } else {
            this.logEvent(`\x1b[33m⚠️  [${domain}]\x1b[0m Solve failed: \x1b[31m${res.error}\x1b[0m`);
            this.lastError = true;
          }
        } catch (e) { 
          this.logEvent(`\x1b[31m❌ [${domain}]\x1b[0m Runtime Error: ${e.message}`);
          this.lastError = true; 
        } r();
      });
    });
  }

  get(domain) {
    const list = (this.pool[domain]?.pool || []).filter(c => c.valid !== false && (!c.exp || Math.floor(Date.now() / 1000) < c.exp));
    return list.sort((a, b) => b.created - a.created)[0] || null;
  }

  invalidate(domain, cookieStr) {
    if (this.pool[domain]) {
      this.pool[domain].pool.forEach(c => { if (c.cookie === cookieStr) { c.valid = false; this.logEvent(`\x1b[31m🚫 [${domain}]\x1b[0m Cookie dead. Refilling...`); } });
    }
  }

  async run() {
    process.stdout.write('\x1B[?25l'); // Hide cursor
    process.stdout.write('\x1Bc'); // Clear terminal
    console.log(`\x1b[32m🚀 ClearanceCore Engine Online | By ItsZaLeo\x1b[0m\n`);
    
    let lastErrorRetry = 0;
    this.lastLineCount = 0;

    setInterval(async () => {
      const now = Math.floor(Date.now() / 1000);
      let statusLines = [];

      // Filter events (7s life)
      this.events = this.events.filter(e => Date.now() - e.time < 7000);
      this.events.forEach(e => {
        const timestamp = `\x1b[90m[${new Date(e.time).toLocaleTimeString()}]\x1b[0m`;
        statusLines.push(`${timestamp} ${e.msg}`);
      });

      if (this.events.length > 0) statusLines.push(''); // spacer

      for (const site of this.sites) {
        if (!this.pool[site.domain]) this.pool[site.domain] = { pool: [] };

        // Clean truly expired ones
        this.pool[site.domain].pool = this.pool[site.domain].pool.filter(c => c.valid !== false && (!c.exp || now < c.exp));
        
        // Count "Strong" cookies (those with > 30s left)
        const strongCookies = this.pool[site.domain].pool.filter(c => !c.exp || (c.exp - now) > 30);
        const count = this.pool[site.domain].pool.length;
        const target = site.size || 1; 

        // Add each cookie on its own line
        this.pool[site.domain].pool.forEach((c, i) => {
          const left = c.exp - now;
          const end = new Date(c.exp * 1000).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
          const color = left < 30 ? '\x1b[31m' : '\x1b[36m';
          statusLines.push(`📊 \x1b[34m[${site.domain}]\x1b[0m Cookie #${i+1} | Clock: ${color}${Math.floor(left / 60)}m ${String(left % 60).padStart(2, '0')}s (${end})\x1b[0m`);
        });

        // Add placeholder lines if fetching
        for (let i = 0; i < this.solvingCount; i++) {
          statusLines.push(`📊 \x1b[34m[${site.domain}]\x1b[0m Refilling Slot | \x1b[33mProactive Solve Active...\x1b[0m`);
        }
        for (let i = count + this.solvingCount; i < target; i++) {
          statusLines.push(`📊 \x1b[34m[${site.domain}]\x1b[0m Cookie Slot | \x1b[33mFetching Initial...\x1b[0m`);
        }

        // Proactive Refresh: Solve if we don't have enough "Strong" cookies
        if (strongCookies.length + this.solvingCount < target) {
          if (this.lastError && strongCookies.length === 0 && now - lastErrorRetry < 60) return;
          
          this.solve(site.domain);
          lastErrorRetry = Math.floor(Date.now() / 1000);
        }
      }

      // Update multi-line status
      if (this.lastLineCount > 0) {
        process.stdout.moveCursor(0, -this.lastLineCount);
      }
      process.stdout.clearScreenDown();
      statusLines.forEach(line => {
        process.stdout.clearLine(0);
        process.stdout.write(line + '\n');
      });
      this.lastLineCount = statusLines.length;

    }, 1000); // 1-second ticks
  }
}

module.exports = ClearanceCore;

if (require.main === module) {
  const core = new ClearanceCore([
    { domain: 'es.wallapop.com', size: 4 }
  ]);
  core.run();
}
