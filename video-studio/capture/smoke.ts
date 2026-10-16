// Smoke test of the capture helpers against an inline page. Usage: npx tsx capture/smoke.ts <videoDir>
import { clickOn, finish, pause, startSession } from "./lib";

const s = await startSession(process.argv[2] ?? "out/smoke", "http://localhost");
await s.page.setContent("<body style='background:#050709;color:#e8fffb;font:40px sans-serif'><button id=b style='margin:300px;font-size:40px' onclick=\"this.textContent='clicked'\">Run</button></body>");
await clickOn(s, "#b");
await pause(500);
console.log(await finish(s));
