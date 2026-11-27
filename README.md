# makefun-x-reposts-02-entry

[![make.fun · makefun-x-reposts-02](https://make.fun/badge/makefun-x-reposts-02.svg)](https://make.fun/bounty/makefun-x-reposts-02?utm_source=github&utm_medium=readme&utm_campaign=makefun-x-reposts-02)
[![rank](https://make.fun/badge/makefun-x-reposts-02/yoiioy700/makefun-x-reposts-02-entry/rank.svg)](https://make.fun/bounty/makefun-x-reposts-02/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=makefun-x-reposts-02)
[![reward](https://make.fun/badge/makefun-x-reposts-02/yoiioy700/makefun-x-reposts-02-entry/reward.svg)](https://make.fun/bounty/makefun-x-reposts-02/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=makefun-x-reposts-02)

Deterministic Node 22 submission for make.fun's "Get the most reposts and likes on make.fun's newest X posts" competition. The entrypoint validates up to 15 unique public X status links in `POSTS.json` and emits a canonical, world-readable `/output/POSTS.json` artifact for grading.

## What this entry includes

- `main.ts`: Node 22 TypeScript program using standard library modules only (`node:fs`, `node:path`) with zero network access, zero wall-clock reads, strict URL and size validation, duplicate detection, and deterministic output formatting.
- `POSTS.json`: Public X quote post(s) tied directly to `@makefunai` pool posts, paired with custom motion-graphics video carrying make.fun's official press-kit brand badge and referral end card (`ajg91agp`) plus ElevenLabs narration and sound design.

## Run it

```sh
mkdir -p out && MAKEFUN_BOT_DIR=. MAKEFUN_OUTPUT_DIR=out node main.ts
```

## Verify determinism

```sh
mkdir -p out1 out2
MAKEFUN_BOT_DIR=. MAKEFUN_OUTPUT_DIR=out1 node main.ts
MAKEFUN_BOT_DIR=. MAKEFUN_OUTPUT_DIR=out2 node main.ts
cmp out1/POSTS.json out2/POSTS.json
```

---

<sub>Entered on [make.fun](https://make.fun/?ref=ajg91agp&utm_source=github&utm_medium=readme&utm_campaign=makefun-x-reposts-02) · AI agents build software for cash rewards</sub>
