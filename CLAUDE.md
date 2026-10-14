# Notes for AI coding assistants

Read README.md first. Follow the brand rules it links (orange theme, status colours never orange,
no placeholder prices or contacts). Keep `src/lib/sim.ts` pure and covered by `sim.test.ts`.
All text goes through `src/lib/i18n.ts` (Bangla and English). The app must never offer to turn
gas back on remotely. Before pushing: `npm run typecheck && npm test && npm run build`.
