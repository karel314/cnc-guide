# MillMage Setup — Lowrider V4 + Jackpot + FluidTouch

Configured 2026-07-12. MillMage is **LightBurn's CNC software**. The user runs **MillMage Core**.

## The big picture: MillMage is CAM-ONLY

The user has a **FluidTouch pendant** (Elecrow CrowPanel 7" ESP32-S3, jeyeager65/FluidTouch)
that talks to FluidNC over WiFi/WebSocket. It runs G-code **files** straight off the Jackpot's
SD/flash or the panel's own SD card, and covers jogging, homing, probing, macros and feed override.

So the division of labour is:

| Tool | Job |
|------|-----|
| **MillMage** | Design + toolpaths + generate G-code file. Never streams a job. |
| **FluidTouch** | Home, zero X/Y, probe Z, pick the file, start/stop the job. |

Firmware-side file execution can't be broken by a WiFi drop or a sleeping laptop — that's why
this is better than PC streaming. **Never have MillMage and FluidTouch both sending commands at
once**; FluidNC accepts both channels and they will interleave.

**File handoff:** save the `.nc` from MillMage → either drag it onto the Jackpot's filesystem in
the FluidNC Web UI, or copy it to a microSD for the CrowPanel → select in FluidTouch → run.

> **UNVERIFIED:** whether FluidTouch's file browser lists `.nc` or filters for `.gcode`. If a file
> doesn't appear in the pendant, change **Save File Extension** in the device profile to `gcode`.

## MillMage Core has NO V-carving

V-Carving (and Relief Carving) are **Pro** features, and **Pro is not released** as of 2026-07.
In Core the 60° V-bit can only cut fixed-depth grooves (fluting/engraving), not variable-depth
carved lettering.

**=> For V-carving and sign lettering, use Estlcam.** MillMage handles pockets, profiles, drills,
dogbone slots, fluting, surfacing. This is a split, not a replacement.

## Device profile

Created from the **built-in V1 Engineering bundle** (New Device Wizard → V1 Engineering →
LowRider3 — LR3 is the only bundle offered; the Jackpot/FluidNC side is identical to LR4, and the
geometry gets overridden anyway). The bundle is Jackpot-era: it carries a Network Port and a
"Fetch configuration on connect" toggle, neither of which a Marlin/SKR-era profile would have.

| Setting | Value |
|---------|-------|
| Work area | X **610**, Y **1220**, Z **50** mm |
| Zero Point (X0/Y0 corner) | **Front Left** (+X right, +Y away) |
| GCode Flavor | **FluidNC** |
| Connection | Ethernet/WiFi/TCP → Jackpot IP, **Network Port 23** (telnet). USB fallback: baud 115200 |
| Ignore Automatic Zero Point Detection | **OFF** — docs say leave alone when using a bundled profile |
| Target Buffer Size / Transfer mode | 127 / Buffered (GRBL's 128-byte RX buffer) |
| **Spindle Manual Start / Stop** | **ON** — the V1 bundle sets this. No M3/M5 is emitted; the Kress is hand-operated |
| Output Tool Change / Save to Single File | **OFF** — gives one G-code file per tool, no M6 |
| Has Tool Length Probe / ATC / Vacuum / Coolant | OFF |
| Fetch configuration on connect | ON (this is FluidNC's YAML config — what the FluidNC *flavor* is for) |
| Save File Extension | `nc` |

Note: the machine homes front-left too, so zero point and homing corner coincide — **a coincidence
of this build, not a rule.** MillMage warns "this may not be the same corner that the machine homes to."

**GRBL vs FluidNC flavor:** the emitted G-code is identical either way (FluidNC is "~100% GRBL
compatible" and keeps the GRBL send/response protocol). The flavor affects how MillMage
*interrogates* the controller — FluidNC keeps machine config in YAML, not GRBL `$`-numbers. Either
setting works; FluidNC is the truthful one.

## Tool library

Saved as `Lowrider.tools`. Categories by material: **Plywood**, **MDF - Spoilboard**.

**Conventions:**
- **Tool name carries the Kress dial position** — e.g. `#3 1/8 Upcut [Dial 2]`. MillMage has no
  field for it and the dial is manual, so the name is the only place it can live.
- **Tool Number = the `id` in `bits.json`**, so the app, the skill and MillMage all agree.
- **ALWAYS set Spindle Speed**, even though MillMage never commands the Kress: **Chip Load is
  computed from it** and reads "Invalid" at RPM 0.
- Fill **Tool Spec URL** with the product link (mirrors `url` in `bits.json`).

| Tool | Ø | Flutes | RPM (dial) | Feed | Plunge | Ramp | Depth/pass | Stepover | Chip load |
|------|---|--------|-----------|------|--------|------|-----------|----------|-----------|
| `#1 1/4 Downcut Finisher [Dial 2]` | 6.35mm | 2 | 13,800 | 1200 | 300 | 1200 @ 15° | 2mm | 2.54mm (40%) | 0.043 |
| `#2 1/8 Downcut 2mm [Dial 2]` | **2mm** | 2 | 13,800 | 600 | 150 | 600 @ 15° | 1.5mm | 0.8mm (40%) | 0.022 |
| `#3 1/8 Upcut [Dial 2]` | 3.175mm | 2 | 13,800 | 800 | 250 | 800 @ 22.5° | 2mm | 1.27mm (40%) | 0.029 |
| `#4 60° V-Bit [Dial 3]` | 8mm, 60° | 3 | 17,600 | 800 | 200 | 800 @ 15° | 1mm | — | 0.015 |
| `#5 1in Surfacing [Dial 1]` | 25.4mm | 3 | 10,000 | 2000 | 150 | 500 @ 5° | **0.5mm** | 12.7mm (50%) | 0.067 |

Feeds in mm/min. Bits #1/#2/#3 all run at **dial 2**, so the dial rarely moves.

### Why these feeds are ~2x V1's "golden rule"

The famous V1 starting point (480 mm/min, dial 2-3) is quoted for a **single-flute** bit. The
user's 1/8" bits are **2-flute**, so at the same RPM they need **double the feed** to take the same
bite per tooth. Chip load ends up at ~0.029mm/tooth either way — identical physics, corrected for
the actual tooling. A feed that's too *low* makes the bit rub instead of cut: heat, dulled edge,
scorched wood.

**Chip load = feed ÷ (RPM × flutes).** Depth of cut is NOT in it — which is why **depth is the safe
knob to back off** and feed is the dangerous one.

### Per-tool cautions

- **#1** is the highest-force cut in the library, and as a downcut it packs chips *down* into a
  slot. **Ramp, don't plunge.** If chatter or scorching: drop depth to 2mm before touching anything else.
- **#2** has a **2mm cutting diameter on a 1/8" shank** — it LOOKS like a 1/8" endmill and isn't.
  Entering 3.175 makes every pocket 1.2mm undersized. Its 12mm flute **cannot through-cut 18mm ply.**
- **#3** at 17mm flute **also cannot through-cut 18mm ply.**
- **=> #1 (25.4mm flute) is the ONLY bit with the reach for an 18mm through-cut.**
- **#5**: dial 1 only (a 25mm cutter has huge rim speed), 0.5mm max per pass (force scales with
  width — this is the one bit that can flex the gantry), and **never plunge it into material** —
  start off the edge. MDF dust is carcinogenic: dust collection + respirator.

## Useful bits from the V1 forum (thread 53418, MillMage/LightBurn category)

- Put init G-code in the **job header** and end G-code in **job end** — a user hit conflicts using
  the user start/end script section and moved it; Ryan (V1) confirmed the approach.
- Add `G0 X0 Y0` to the **job end** G-code so the gantry returns to the work origin when a file
  finishes. Makes multi-file bit-change jobs much less fiddly.
