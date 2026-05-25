# SoundboardMe

> Web app: maak een soundboard "van" iemand, deel met één link, anderen luisteren.

---

## STATUS — 2026-05-25

**Fase:** 2 — Bugfixing op live deploy (iOS upload issues)
**Stack:** Next.js 15 (App Router) + Tailwind v4 + TypeScript
**Storage:** Vercel Blob (audio + metadata JSON, geen DB)
**Hosting:** https://soundboard-me.vercel.app
**Repo:** https://github.com/w1ckedxt/soundboardMe.git

---

## 🚨 OPEN PUNT — iOS Chrome upload werkt niet (volgende sessie pickup)

**Symptoom:** Thomas neemt clip op via Chrome iPhone → opslaan lijkt te slagen in UI → andere device opent share-URL → 0 clips zichtbaar. Ook eigen refresh toont 0 clips.

**Bewijs dat server flow zelf OK is:**
- Curl-test (commit `7d47876`) tegen live API → clip wordt correct gepersisteerd in board JSON. Volledige flow werkt server-side.

**Aanname:** iOS WebKit (Chrome iOS = Safari engine) FormData+Blob quirk waardoor audio body leeg aankomt op server. Server slaat dan een lege/corrupte clip op of crasht silent.

**Fix gepusht in commit `9fb88a2`:**
- Upload via raw POST body ipv FormData (omzeilt WebKit FormData bug)
- `audio/mp4` bovenaan in mime detection (iOS preferred)
- `recorder.mimeType` als source of truth voor blob construction
- Audio size limit 2MB → 5MB
- Server lenient mime mapping (aac, m4a aliases)
- Console.error op audio play failures (was silent)

**Niet getest na fix.** Volgende sessie: vraag Thomas of na nieuwste deploy iOS clip upload werkt. Zo niet → vraag slug, hit `/api/board/<slug>` om te zien of clip in storage staat. Als clip er WEL is maar niet afspeelt → playback issue. Als clip er NIET is → upload issue dieper.

---

## ACTIVE WORK

### Fase 1 — MVP (KLAAR ✅)
- [x] Tech keuzes (Next.js, no-auth, `/s/x7k2p`, playful vibe)
- [x] Landing + `/new` + `/s/[slug]` + `/s/[slug]/edit?t=`
- [x] Mic recording (MediaRecorder, cross-browser MIME)
- [x] Vercel Blob storage (boards JSON + clip audio)
- [x] Edit token + SHA-256 hashing
- [x] Share via Web Share API + clipboard fallback
- [x] Modulaire file structuur (~25 kleine files)

### Fase 2 — Live bugfixes (IN PROGRESS)
- [x] **Build fix:** bump `@vercel/blob` naar `^2.4.0` voor `allowOverwrite` support (commit `6171e1a`)
- [x] **CDN cache fix:** `cacheControlMaxAge: 0` + cache-buster op fetch — nieuwe clips zichtbaar voor viewers zonder 30d wachten (commit `7d47876`)
- [x] **iOS Safari fix:** raw-body upload ipv FormData, mp4-first mime (commit `9fb88a2`)
- [ ] **iOS test verificatie** ← Thomas moet bevestigen of fix werkt
- [ ] Loading skeletons ipv "laden…"
- [ ] Optimistische UI bij clip toevoegen
- [ ] Edit-link kopiëren badge na board create
- [ ] Mobile keyboard "Done" → submit form
- [ ] Open Graph image (dynamic, per soundboard)

### Fase 3 — Sharing improvements
- [ ] View counter "X keer geluisterd"
- [ ] Per-clip play counter
- [ ] PWA manifest
- [ ] "Save audio" download knop op clips

### Fase 4 — Premium (toekomst)
- [ ] Vanity URL claim (`/yasmijn` ipv `/s/x7k2p`) als paid feature
- [ ] Account systeem voor vanity URL eigendom
- [ ] Stripe integratie

---

## CONTEXT — Beslissingen

**URL pattern:** `/s/x7k2p` (kort + uniek nanoid). Schaalbaar zonder naam-collisions. Naam zit in pagina-titel, niet in URL. YouTube-model.

**Auth:** Geen accounts. Edit-link bevat geheim 24-char token, share-link is read-only. Token SHA-256 gehasht opgeslagen. Verloren edit-link = verloren control over board.

**Storage:** Vercel Blob voor alles. `boards/<slug>.json` voor metadata, `clips/<slug>/<id>.<ext>` voor audio. Geen DB nodig.

**Stable share URL:** Clips toevoegen verandert de URL NOOIT. Edit page update lokale React state + persist via API, geen redirect.

**Vibe:** Playful & meme-y. Felle gradients, bouncy buttons, emoji-heavy. Fredoka font.

---

## BEKENDE STATE

**Corrupt board:** `8bmbeg` (Yasmijn) — gemaakt vóór de `@vercel/blob` v2.4 fix. Audio-bestanden bestaan in storage maar zijn niet gelinkt in board JSON. Niet redbaar zonder veel werk (labels/emoji ook verloren). Negeren.

**Working test board:** `djxvfb` (commit `9fb88a2`) — bewijs dat curl flow werkt. Niet productie-waardig (fake audio).

---

## DEPLOY CHECKLIST (eenmalig gedaan)

- [x] Repo gepushed naar GitHub
- [x] Vercel project gekoppeld aan repo
- [x] Vercel Blob store gemaakt (Public access)
- [x] `BLOB_READ_WRITE_TOKEN` env var auto-injected door Vercel
- [x] Live op https://soundboard-me.vercel.app

---

## KEY FILES

```
app/
  page.tsx                        # Landing
  layout.tsx                      # Root + Fredoka font
  globals.css                     # Tailwind v4 + gradient bg
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
        route.ts                  # POST add clip (raw body sinds 9fb88a2)
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
  slug.ts                         # nanoid generators + SHA-256
  storage.ts                      # @vercel/blob helpers (server-only)
  audio.ts                        # MediaRecorder + playback (client, mp4-first)
  api.ts                          # Client fetch wrappers (raw body upload)
```

---

## IDEAS / IJSKAST

- Browser mic met live waveform
- YouTube/URL trimmer voor clips
- "Reactie" emoji-stempels van luisteraars
- Embeddable widget `<iframe src="/embed/x7k2p">`
- Multi-user collab
- Audio file upload als alternatief op mic recording
- Cleanup endpoint voor orphan audio files (corrupt boards opruimen)

---

## ARCHIEF

- **2026-05-25 sessie 1** — Volledige MVP gebouwd + gedeployed naar Vercel. 3 bugfixes na live test: build error (@vercel/blob version), CDN cache (clips niet zichtbaar voor viewers), iOS Safari upload (raw body fix). Laatste fix nog niet door Thomas geverifieerd op iPhone.
