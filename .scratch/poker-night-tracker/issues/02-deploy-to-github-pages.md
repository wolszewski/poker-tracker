# 02: Deploy to GitHub Pages

**What to build:** The app is published on GitHub Pages from a private GitHub repo, and republished automatically on every push to `main` by a GitHub Actions workflow. Because the repo is private, the Host's paid GitHub plan is needed; the published site is still publicly reachable, which is fine under ADR 0001. Creating the GitHub repo, pushing to it and turning on Pages (source: GitHub Actions) are steps only the owner can take. Walk them through those steps and don't guess credentials.

**Blocked by:** 01: Walking skeleton

**Status:** ready-for-agent

- [ ] A private GitHub repo exists with this repo pushed to it as its remote.
- [ ] A GitHub Actions workflow builds the app and deploys it to Pages on every push to `main`.
- [ ] The Vite base path matches the Pages URL, so scripts and styles load on the published site.
- [ ] The empty-Night screen loads at the Pages URL on both a phone and a laptop.
