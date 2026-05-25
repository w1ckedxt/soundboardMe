# SoundboardMe

> Web app: maak een soundboard "van" iemand, deel met één link, anderen luisteren.

---

## STATUS — 2026-05-25

**Fase:** 1 — Werkende MVP gebouwd, klaar voor eerste Vercel deploy
**Stack:** Next.js 15 (App Router) + Tailwind v4 + TypeScript
**Storage:** Vercel Blob (audio + metadata JSON, geen aparte DB)
**Hosting:** Vercel (Thomas deployt zelf)
**Repo:** https://github.com/w1ckedxt/soundboardMe.git

---

## DEPLOY CHECKLIST (Thomas doet dit)

1. `npm install` (genereert `package-lock.json`)
2. `git push` naar GitHub
3. Vercel: New Project → import `w1ckedxt/soundboardMe`
4. Vercel: Storage tab → Create Blob store → Connect to project
   - Dit injecteert `BLOB_READ_WRITE_TOKEN` als env var automatisch
5. Vercel: Redeploy (zodat de env var in de runtime zit)
6. Live testen → maak nieuwe soundboard via `/new`

> Voor lokale dev (later, niet nu): `vercel env pull .env.local`, dan `npm run dev`.

---

## ACTIVE WORK

### Fase 1 — MVP (KLAAR ✅)
- [x] Tech keuzes (Next.js, no-auth, `/s/x7k2p`, playful vibe)
- [x] Landing page met CTA
- [x] `/new` — create soundboard met naam + emoji
- [x] `/s/[slug]` — view (read-only, share knop, random shuffle)
- [x] `/s/[slug]/edit?t=<token>` — edit (record clips, delete clips)
- [x] Mic recording in browser (MediaRecorder API, cross-browser MIME detect)
- [x] Vercel Blob storage (boards JSON + clip audio)
- [x] Edit token + SHA-256 hashing
- [x] Share via Web Share API + clipboard fallback
- [x] Custom 404
- [x] Modulaire file structuur (geen god-files)

### Fase 2 — Polish & Bugfixes (NEXT)
- [ ] Thomas eerste live test → bugs/UX feedback
- [ ] Loading skeletons ipv "laden…"
- [ ] Optimistische UI bij clip toevoegen (instant feedback)
- [ ] Edit-link kopiëren badge na board create
- [ ] Mobile keyboard "Done" → submit form
- [ ] Open Graph image (dynamic, per soundboard)

### Fase 3 — Sharing improvements
- [ ] View counter "X keer geluisterd"
- [ ] Per-clip play counter
- [ ] Mobile install prompt (PWA manifest)
- [ ] "Save audio" download knop op clips

### Fase 4 — Premium (toekomst)
- [ ] Vanity URL claim (`/yasmijn` ipv `/s/x7k2p`) als betaalde feature
- [ ] Account systeem voor vanity URL eigendom + dashboard
- [ ] Stripe integratie

---

## IDEAS / IJSKAST

- Browser mic met live waveform
- YouTube/URL trimmer voor clips
- "Reactie" emoji-stempels van luisteraars
- Embeddable widget `<iframe src="/embed/x7k2p">`
- Multi-user collab (meer mensen kunnen aan zelfde board toevoegen)
- Audio file upload als alternatief op mic recording

---

## ARCHITECTUUR

### Storage model (Vercel Blob)
```
boards/x7k2p.json          # Board metadata + clips array (clip URLs erin)
clips/x7k2p/abc123.webm    # Audio file per clip
```

### URL patroon
- View (publiek): `/s/x7k2p`
- Edit (geheim): `/s/x7k2p/edit?t=<24-char-token>`
- Token wordt SHA-256 gehasht opgeslagen; alleen wie de URL heeft kan editen

### Stabiele share URL
De share-URL (`/s/x7k2p`) verandert NOOIT na create — clips toevoegen update alleen het bestaande board JSON, geen nieuwe URL.

---

## KEY FILES

```
app/
  page.tsx                        # Landing
  layout.tsx                      # Root + Fredoka font
  globals.css                     # Tailwind v4 + theme + gradient bg
  not-found.tsx                   # 404
  new/page.tsx                    # Create form
  s/[slug]/
    page.tsx                      # View (server)
    ViewBoard.tsx                 # View (client)
    edit/page.tsx                 # Edit (client, token-gated)
  api/board/
    route.ts                      # POST create
    [slug]/
      route.ts                    # GET board
      clip/
        route.ts                  # POST add clip
        [clipId]/route.ts         # DELETE clip

components/
  SoundButton.tsx                 # Bouncy gradient knop
  BoardHeader.tsx                 # Titel + emoji + meta
  ShareBar.tsx                    # Random + Share fixed bottom
  AddClipFAB.tsx                  # + knop voor opnemen
  RecordModal.tsx                 # Record/preview/save flow
  EmojiPicker.tsx                 # Curated 24-emoji grid
  EmptyState.tsx                  # Lege board state

lib/
  types.ts                        # Board, Clip, PublicBoard
  slug.ts                         # nanoid generators + SHA-256 hash
  storage.ts                      # @vercel/blob helpers (server-only)
  audio.ts                        # MediaRecorder + playback (client)
  api.ts                          # Client fetch wrappers
```

---

## ARCHIEF

*Fase 1 voltooid op 2026-05-25 — eerste werkende MVP.*
