# Feeds & Speeds Reference — Lowrider V4 + Kress 800 FME-Q

## Starting Point (V1 Engineering Official)

When in doubt, start here and work up:
- **Bit:** Single flute 1/8" upcut endmill
- **Feed rate:** 480 mm/min (8 mm/s)
- **Plunge rate:** 180 mm/min (3 mm/s)
- **Depth per pass:** 1-2mm
- **RPM:** Dial 2-3 (~14,000-17,600)

This is deliberately conservative. Increase once you verify your build is solid.

---

## Wood

| Material | Bit Type | Bit Dia | Flutes | Dial (RPM) | Feed mm/min | Plunge mm/min | Depth/Pass | Notes |
|----------|----------|---------|--------|------------|-------------|---------------|------------|-------|
| Softwood (pine, cedar) | Upcut spiral | 1/8" | 1 | 2-3 (~16,000) | 750-1000 | 250 | 3-4mm | Watch for tearout on soft grain |
| Softwood | Upcut spiral | 1/4" | 2 | 2-3 (~16,000) | 1200-1800 | 400 | 4-6mm | Can be more aggressive |
| Hardwood (oak, maple) | Upcut spiral | 1/8" | 1 | 2-3 (~16,000) | 500-750 | 180 | 1.5-2.5mm | Lighter passes, listen for chatter |
| Hardwood | Upcut spiral | 1/4" | 2 | 2-3 (~16,000) | 800-1200 | 300 | 2-4mm | Reduce if chatter occurs |
| Plywood (Baltic birch) | Compression | 1/4" | 2 | 2-3 (~17,000) | 1000-1500 | 300 | 3-5mm | Clean edges both sides |
| Plywood | Downcut spiral | 1/8" | 1 | 2-3 (~16,000) | 600-900 | 200 | 2-3mm | Clean top surface only |
| MDF | Upcut spiral | 1/4" | 2 | 2-3 (~16,000) | 1200-1800 | 400 | 3-6mm | VERY dusty, use dust collection |
| MDF | Upcut spiral | 1/8" | 1 | 2-3 (~16,000) | 700-1000 | 250 | 2-4mm | Fine dust is carcinogenic |

## Plastics

| Material | Bit Type | Bit Dia | Flutes | Dial (RPM) | Feed mm/min | Plunge mm/min | Depth/Pass | Notes |
|----------|----------|---------|--------|------------|-------------|---------------|------------|-------|
| Acrylic (cast) | O-flute | 1/8" | 1 | 1 (~10,000) | 800-1200 | 200 | 1-2mm | LOWEST RPM; melts easily |
| Acrylic (cast) | O-flute | 1/4" | 1 | 1 (~10,000) | 1200-1500 | 300 | 1.5-3mm | Leave protective film on |
| HDPE | O-flute/upcut | 1/8" | 1 | 1 (~10,000) | 1000-1500 | 300 | 2-3mm | Feed fast to prevent melting |
| HDPE | O-flute/upcut | 1/4" | 1 | 1 (~10,000) | 1500-2000 | 400 | 3-5mm | Melts at high RPM |
| Delrin/Acetal | Upcut/O-flute | 1/8" | 1-2 | 1-2 (~12,000) | 800-1200 | 250 | 2-3mm | Clean chips = good settings |

## Aluminum (6061) — Advanced, Use With Care

| Bit Type | Bit Dia | Flutes | Dial (RPM) | Feed mm/min | Plunge mm/min | Depth/Pass | Notes |
|----------|---------|--------|------------|-------------|---------------|------------|-------|
| Single flute carbide | 1/8" | 1 | 1 (~10,000) | 300-500 | 60-100 | 0.3-0.5mm | Use cutting fluid or WD-40 |
| Single flute carbide | 1/4" | 1 | 1 (~10,000) | 400-700 | 80-120 | 0.5-1.0mm | Air blast for chip clearing |

**Aluminum rules:**
- ALWAYS dial 1 (lowest RPM). Higher RPM = heat = welded chips = broken bits
- Single flute ONLY for chip evacuation
- NO AlTiN-coated bits (aluminum sticks to the coating). Uncoated or ZrN coated.
- Use cutting fluid, isopropyl spray, or WD-40
- Adaptive/trochoidal toolpaths strongly recommended
- Secure workpiece EXTREMELY well
- Shallow depth per pass (0.3-1mm), stepover up to 40% bit diameter

## Foam

| Material | Bit Type | Bit Dia | Flutes | Dial (RPM) | Feed mm/min | Plunge mm/min | Depth/Pass | Notes |
|----------|----------|---------|--------|------------|-------------|---------------|------------|-------|
| XPS insulation | Upcut/straight | 1/8" | 1-2 | 1 (~10,000) | 1500-2500 | 500 | 5-10mm | Low RPM to avoid melting |
| EPS styrofoam | Upcut | 1/4" | 1 | 1 (~10,000) | 2000-3000 | 800 | Full depth OK | Very easy to cut |
| EVA foam | Upcut | 1/8" | 1 | 1-2 (~12,000) | 1500-2500 | 500 | 3-6mm | Sharp bits essential |

## V-Carving / Engraving

| Operation | Bit Type | Angle | Dial (RPM) | Feed mm/min | Plunge mm/min | Notes |
|-----------|----------|-------|------------|-------------|---------------|-------|
| V-carve in softwood | V-bit | 60 or 90 deg | 3 (~17,600) | 800-1200 | 200 | Slower = cleaner detail |
| V-carve in hardwood | V-bit | 60 or 90 deg | 2-3 (~16,000) | 500-800 | 150 | Reduce speed for clean edges |
| V-carve in MDF | V-bit | 60 or 90 deg | 2-3 (~16,000) | 800-1200 | 200 | Good results, very dusty |
| Fine engraving | V-bit | 30 or 60 deg | 3-4 (~19,000) | 400-600 | 100 | Small tips are fragile |

---

## How to Read Chip Quality

The chips coming off the bit tell you if your settings are right:

| Chip Appearance | What It Means | Action |
|----------------|---------------|--------|
| Small clean chips/curls | Settings are good | Keep going |
| Fine dust (wood) | Feed too slow or RPM too high | Increase feed or lower RPM |
| Melted/gummy chips (plastic) | RPM too high or feed too slow | Lower RPM, increase feed |
| Large chunks, machine vibrating | Too aggressive (deep or fast) | Reduce depth per pass or feed |
| Burnt edges on workpiece | RPM too high for feed rate | Lower RPM or increase feed |
| Bit chattering/squealing | Too deep, too fast, or dull bit | Reduce depth/feed, check bit |
