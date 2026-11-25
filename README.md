# Haven Lagos – property website concept

A responsive real-estate showcase for Lagos built with HTML, CSS and vanilla JavaScript, plus a small Node.js server that saves contact enquiries to a private admin dashboard. All listings are **sample content** for a portfolio demo.

## Features
- Buy / Rent tabs, with area, property type and budget filters
- Property detail pop-ups with an "Ask about this home" link that pre-fills the contact form
- Saved favourites (stored in the visitor's browser)
- Neighbourhood shortcuts, mobile navigation, scroll animations
- Contact form that saves enquiries; password-protected dashboard at `/admin.html`

## Run locally
Requires Node.js 18 or newer. No packages to install.

```bash
node server.js
```

Open http://127.0.0.1:8000. If `ADMIN_PASSWORD` isn't set, a temporary admin password is printed in the terminal when the server starts.

(For front-end work only you can open `index.html` with VS Code Live Server, but the contact form and dashboard need `node server.js`.)

## Environment variables
| Variable | Purpose | Default |
|---|---|---|
| `ADMIN_PASSWORD` | Password for `/admin.html` (**required** when `NODE_ENV=production`) | random, printed at start-up |
| `NODE_ENV` | Set to `production` when live (enables Secure cookies) | – |
| `PORT` | Port to listen on | `8000` |
| `HOST` | Interface to bind | `127.0.0.1` locally, `0.0.0.0` when `PORT` is set |
| `DATA_DIR` | Folder for `inquiries.json` | `./data` |

## Deploying
Use any Node host (for example Render or Railway): start command `node server.js`, and set `NODE_ENV=production` and `ADMIN_PASSWORD`. Free plans often reset the disk on redeploy, so mount a persistent disk and point `DATA_DIR` at it if you want to keep enquiries.

## Security notes
- The server only serves the site's HTML, CSS, JS and the `image/` folder. `server.js` and the `data/` folder are never public.
- Login and enquiry endpoints are rate-limited.
- Replace the sample content and add a privacy notice before using it for real leads.

## Project structure
```
index.html  properties.html  about.html  contact.html  admin.html
styles.css  script.js (listings)  site.js (shared pages + contact form)
server.js   package.json
image/      (photos – add your own)
```
