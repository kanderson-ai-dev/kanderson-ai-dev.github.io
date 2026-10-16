"""Clean, fixture-backed demo environment for the Supply Chain Compliance Co-Pilot (Python edition).

Mirrors the product's `scripts/record_demo.py` without modifying the product repo:
deterministic OpenAI fixture upstream + `python -m app.main` serving the built
`frontend/dist`, fresh temp SQLite/checkpoint DBs, `OPERATOR_API_KEY=demo-token`.
No real OPENAI_API_KEY or tracing keys are used.

Run from the product repo so its uv environment is used:
    uv run --project <product> python <this file> [--port-file <path>]
Prints `READY <base_url>` (also written to --port-file) and keeps running until Ctrl+C.
"""

from __future__ import annotations

import argparse
import os
import shutil
import socket
import subprocess
import sys
import tempfile
import time
import urllib.request
from pathlib import Path

PRODUCT = Path(os.environ.get("SCC_PRODUCT_DIR", r"C:\Users\kaars\Desktop\Projects\supply-chain-compliance-copilot-py"))
TOKEN = "demo-token"  # local demo credential, never a real key


def free_port() -> int:
    with socket.socket() as s:
        s.bind(("127.0.0.1", 0))
        return int(s.getsockname()[1])


def wait_http(url: str, timeout: float = 60.0) -> None:
    end = time.monotonic() + timeout
    while time.monotonic() < end:
        try:
            urllib.request.urlopen(url, timeout=1)  # noqa: S310
            return
        except Exception:
            time.sleep(0.2)
    raise RuntimeError(f"server did not start: {url}")


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--port-file")
    args = ap.parse_args()
    port_file = Path(args.port_file).resolve() if args.port_file else None
    if not (PRODUCT / "frontend" / "dist" / "index.html").exists():
        print("frontend/dist missing: run `npm --prefix frontend run build` first")
        return 1

    sys.path.insert(0, str(PRODUCT))
    os.chdir(PRODUCT)
    from scripts.record_demo import _start_upstream  # noqa: PLC0415  (reuses the product's fixture ASGI)

    up = free_port()
    _start_upstream(up)
    wait_http(f"http://127.0.0.1:{up}/health")

    data = Path(tempfile.mkdtemp(prefix="scc-video-data-"))
    port = free_port()
    env = {
        **os.environ,
        "OPENAI_API_KEY": "sk-demo-fixture",
        "OPENAI_BASE_URL": f"http://127.0.0.1:{up}/v1",
        "OPERATOR_API_KEY": TOKEN,
        "TRACING_PROVIDER": "none",
        "SQLITE_PATH": str(data / "app.db"),
        "CHECKPOINTS_PATH": str(data / "cp.db"),
        "HOST": "127.0.0.1",
        "PORT": str(port),
    }
    for k in ("LANGCHAIN_API_KEY", "LANGSMITH_API_KEY", "LANGFUSE_SECRET_KEY", "LANGFUSE_PUBLIC_KEY"):
        env.pop(k, None)
    proc = subprocess.Popen([sys.executable, "-m", "app.main"], cwd=PRODUCT, env=env,
                            stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    base = f"http://127.0.0.1:{port}"
    try:
        wait_http(f"{base}/health/live")
        if port_file:
            port_file.write_text(base)
        print(f"READY {base}", flush=True)
        proc.wait()
    except KeyboardInterrupt:
        pass
    finally:
        proc.terminate()
        shutil.rmtree(data, ignore_errors=True)
    return 0


if __name__ == "__main__":
    sys.exit(main())
