# CNC Job Workflow — Step-by-Step Checklist

This is the complete workflow from design to finished part on the Lowrider V4 with Jackpot controller and Kress 800 FME-Q spindle.

---

## Phase 1: Design & CAM

### In Estlcam or MillMage:
1. Import or draw your design (SVG, DXF, or draw directly)
2. Select the correct bit/tool from your tool library
3. Set the operation type for each path:
   - **Profile/Contour** — cut around the outside or inside of a shape
   - **Pocket** — remove material from an enclosed area
   - **Drill** — plunge holes at specific points
   - **Engrave** — follow a path at a set depth (V-carving)
4. Set feeds & speeds (see feeds-and-speeds.md for your material)
5. Set depth per pass and total depth
6. For through-cuts: add **tabs** (small bridges that hold the part in place)
   - Tab width: 3-5mm
   - Tab height: 1-2mm (enough to hold, easy to cut/sand off)
7. Set the work origin (where X0/Y0 is) — typically front-left corner
8. Preview/simulate the toolpath — watch for collisions, verify cut order
9. Generate G-code
   - **Estlcam:** Select "GRBL" as output format
   - **MillMage:** Select FluidNC/GRBL device profile

### Multiple bits in one job:
- Generate **separate G-code files** for each tool
- Name them in order: `01_pocket_6mm.gcode`, `02_profile_3mm.gcode`, `03_vcarve_60deg.gcode`
- Plan the order: large material removal first, detail/finishing last

---

## Phase 2: Machine Setup

### 2a. Power On & Connect
- [ ] Power on the Jackpot controller
- [ ] Connect to the Jackpot WiFi network from your phone/tablet/PC
- [ ] Open the Web UI in your browser
- [ ] Verify connection (status should show "Idle")

### 2b. Homing
- [ ] Send `$H` to home all axes
- [ ] Wait for homing to complete (machine moves to endstops)
- [ ] Verify no alarms (send `$X` to clear if needed)

### 2c. Workpiece Setup
- [ ] Secure your workpiece to the spoilboard using your chosen method:
  - **Painter's tape + CA glue:** Tape on spoilboard, tape on workpiece bottom, apply thin CA glue between tapes, press together firmly, wait 30 seconds
  - **Wood screws:** Through waste areas only, outside the part geometry
  - **Clamps:** Position so they don't interfere with the toolpath or gantry
- [ ] Verify the workpiece cannot move (push/pull test)

### 2d. Install the Bit
- [ ] Select the correct bit for the first operation
- [ ] Insert the bit into the correct collet (match shank diameter exactly!)
- [ ] Tighten the collet nut firmly with two wrenches
- [ ] Verify the bit is straight and secure (no wobble)
- [ ] Check that the bit protrudes enough for the cut depth + clearance

### 2e. Set Work Origin (X/Y Zero)
- [ ] Jog the machine to where X0/Y0 should be on your workpiece
  - This MUST match what you set in your CAM software (usually front-left corner)
- [ ] Send `G92 X0 Y0` to set X/Y zero at current position
- [ ] Alternatively, use `G10 L20 P1 X0 Y0` for persistent zero

### 2f. Z-Probe (Set Z Zero)
- [ ] Clip the probe ground wire to the bit
- [ ] Place the touchplate on the TOP surface of the workpiece
- [ ] Measure your touchplate thickness with calipers if you haven't already
- [ ] Send `G38.2 Z-25 F100 P[thickness]` (replace [thickness] with your plate's mm)
- [ ] Verify the probe was successful: look for `[PRB:...:1]` (1 = success)
- [ ] Remove the touchplate from the workpiece
- [ ] Remove the ground wire from the bit
- [ ] Jog Z up slightly to confirm it moves freely

### 2g. Verify Setup (Dry Run)
- [ ] Jog to a few key positions on the workpiece to verify X/Y alignment
- [ ] Optionally: run the G-code with the spindle OFF and Z raised above the workpiece to verify the toolpath fits within your material (air cut)

---

## Phase 3: Running the Job

### Pre-Start Checklist
- [ ] Safety glasses ON
- [ ] Hearing protection ON (or nearby for when spindle starts)
- [ ] Dust mask ON (or dust collection running)
- [ ] Workpiece secure (re-check)
- [ ] Correct bit installed (matches the G-code file you're about to run)
- [ ] Collet is tight
- [ ] Nothing in the toolpath (cables, clamps, dust hose, tools)
- [ ] Know where your emergency stop is

### Start Cutting
1. [ ] Upload the G-code file to the Jackpot via Web UI
2. [ ] **TURN ON THE SPINDLE** — set the Kress dial to the correct position
   - The Jackpot does NOT control the Kress spindle!
   - If you forget this, the bit will plunge into the material without spinning = broken bit
3. [ ] Turn on dust collection / vacuum
4. [ ] Start the G-code from the Web UI
5. [ ] **STAY PRESENT** — watch the first few cuts closely
6. [ ] Listen for problems: chatter, squealing, unusual sounds
7. [ ] Watch the chips — are they the right size and shape? (see feeds-and-speeds.md)

### If Something Goes Wrong
- **Feed Hold:** Send `!` to pause immediately (or use the pause button in Web UI)
- **Resume:** Send `~` after fixing the issue
- **Emergency:** Kill power to the spindle and/or controller
- **Soft Reset:** `Ctrl+X` if the controller is unresponsive

### Common Mid-Job Issues
| Problem | Likely Cause | Action |
|---------|-------------|--------|
| Burning/smoke | RPM too high or feed too slow | Pause, reduce RPM or increase feed in CAM, restart |
| Chatter/vibration | Too deep or too fast | Pause, reduce depth per pass in CAM |
| Bit breaks | Too aggressive, dull bit, or material shifted | Stop, replace bit, reduce settings, re-probe Z |
| Workpiece moves | Insufficient holding | Stop, re-secure, may need to re-zero and restart |
| Gummy/melted chips (plastic) | RPM too high | Pause, lower the Kress dial |

---

## Phase 4: Bit Change (Multi-Tool Jobs)

When switching to the next G-code file with a different bit:

1. [ ] Let the current job finish completely
2. [ ] **TURN OFF THE SPINDLE** (Kress dial to 0 / unplug)
3. [ ] Loosen the collet nut, remove the old bit
4. [ ] Insert the new bit with the correct collet, tighten firmly
5. [ ] **RE-PROBE Z** — the new bit is a different length!
   - Place touchplate on the SAME reference surface as before
   - Send `G38.2 Z-25 F100 P[thickness]`
   - Remove touchplate and ground wire
6. [ ] **DO NOT re-zero X/Y** — those coordinates are still valid
7. [ ] **Set the Kress dial** to the correct RPM for the new bit/operation
8. [ ] **Turn on the spindle** before starting the next file
9. [ ] Upload and start the next G-code file

---

## Phase 5: Finishing

1. [ ] Let the last job complete fully
2. [ ] **Turn off the spindle** (Kress dial to 0)
3. [ ] Turn off dust collection
4. [ ] Jog the gantry out of the way
5. [ ] Remove the workpiece:
   - Tape+CA: Insert a putty knife between the tapes, twist gently
   - Screws: Unscrew and remove
   - Clamps: Release
6. [ ] Cut remaining tabs with a flush-cut saw or chisel
7. [ ] Sand tab nubs smooth
8. [ ] Clean up: vacuum chips from the machine, clean the bit

---

## Workholding Methods

| Method | Best For | Setup | Strength |
|--------|----------|-------|----------|
| Painter's tape + CA glue | Thin stock, no screw holes wanted | Tape both surfaces, CA between, press 30s | Medium |
| Wood screws | Sheet goods, large pieces | Screws through waste areas | Very strong |
| Edge clamps | Quick setup, repeated jobs | Clamp edges, keep out of toolpath | Strong |
| Double-sided carpet tape | Large flat pieces, light cuts | Apply to bottom of workpiece | Light-medium |
| T-track + hold-downs | Dedicated table setup | Install T-track, adjustable clamps | Very strong |

---

## Safety Rules

1. **ALWAYS** wear safety glasses when the spindle is running
2. **ALWAYS** use hearing protection (10,000+ RPM is loud)
3. **ALWAYS** use a dust mask or dust collection, especially with MDF (carcinogenic dust)
4. **NEVER** leave the machine running unattended
5. **NEVER** reach near the spinning bit or moving gantry
6. **NEVER** start G-code without the spindle running (manual Kress!)
7. Keep long hair tied back, remove loose clothing and jewelry
8. Know where your emergency stop is before starting any job
9. Keep a fire extinguisher nearby (wood dust + heat = fire risk)
10. First cut on a new material? Do a test piece first, not your final workpiece
