# 02: Deploy to GitHub Pages

**What to build:** The app is published on GitHub Pages from a private GitHub repo, and republished automatically on every push to `main` by a GitHub Actions workflow. Because the repo is private, the Host's paid GitHub plan is needed; the published site is still publicly reachable, which is fine under ADR 0001. Creating the GitHub repo, pushing to it and turning on Pages (source: GitHub Actions) are steps only the owner can take. Walk them through those steps and don't guess credentials.

**Blocked by:** 01: Walking skeleton

**Status:** ready-for-human

- [ ] A private GitHub repo exists with this repo pushed to it as its remote.
- [x] A GitHub Actions workflow builds the app and deploys it to Pages on every push to `main`.
- [x] The Vite base path matches the Pages URL, so scripts and styles load on the published site.
- [ ] The empty-Night screen loads at the Pages URL on both a phone and a laptop.

## Comments

- The repo is https://github.com/wolszewski/poker-tracker, pushed as `origin`. It is **public**, not private: the owner's GitHub plan can't publish Pages from a private repo, so the owner made it public. This fits ADR 0001, because the code holds no Night data. The first box stays unticked because it asks for a private repo.
- Pages uses GitHub Actions as its source. The first run passed tests, built and deployed, and https://wolszewski.github.io/poker-tracker/ serves the page with its script, styles and icon. The Vite base is `./`, so assets load from the repo's Pages path.
- Status is `ready-for-human`: all that remains is the last box, where the Host opens the app on a phone and a laptop to check it by hand. Tick it and set `Status: done` once checked.
