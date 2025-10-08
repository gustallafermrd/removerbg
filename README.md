## Run the application (Flask + static frontend)

This repository has been refactored to serve a static HTML/CSS/JS frontend from Flask.The Flask server also exposes the background removal API at `/api/remove-background`.

Recommended steps for macOS (zsh):

1. Create a Python virtual environment (if you haven't already):

```bash
python3 -m venv .venv
```

2. Activate the venv:

```bash
source .venv/bin/activate
```

3. Install dependencies:

```bash
pip install -r requirements.txt
```

4. Start the server (defaults to port 5003):

```bash
PORT=5003 python3.10 server.py
```

5. Open the UI in your browser:

http://127.0.0.1:5003/

Health check (once running):

```bash
curl http://127.0.0.1:5003/api/health
# expected response: {"status":"ok"}
```

Notes:

- The frontend lives in `templates/index.html` and `static/app.js`.
- Tailwind is loaded via CDN in the template to keep the original design without a build step.
- The Flask backend still uses `rembg` to remove image backgrounds and returns a base64 PNG in the JSON response.
