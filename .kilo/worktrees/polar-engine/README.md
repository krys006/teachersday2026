# TEACH//APPRECIATION 2026
Static site: HTML + CSS + vanilla JS. No backend.
```
index.html   structure of every screen
style.css    look + animations
script.js    flow, particles, message animations
data/teachers.js   <- EDIT THIS
assets/photos/     <- put photos here
```
## Run locally
Open `index.html` in a browser, or run `python3 -m http.server` in this folder and visit http://localhost:8000.
## Edit content (all in data/teachers.js)
- Name / title: `name`, `title`  - Login: `username`, `password`
- Messages: `messages` array (`from`, `text`, `animation`: envelope, polaroid, sticky, terminal, flower, circuit, sparkle)
- Photos: copy into `assets/photos/`, then add `{image:"assets/photos/x.jpg", caption:"..."}` to `memories`
## Deploy to GitHub
`git init && git add . && git commit -m "Teachers Day" ` then create a repo on github.com and `git remote add origin <url> && git push -u origin main`.
Optional: Settings > Pages > deploy from `main` / root.
## Deploy to Vercel
vercel.com > Add New Project > import the GitHub repo > Framework "Other" > Deploy. No build command needed. Share the URL.
Note: passwords are visible in the source; it's a surprise gate, not real security.
