let BITS = [];
let MATERIALS = [];
let wizState = { step: 1, material: null, operation: null, selectedBit: null, settings: null };

async function init() {
  const [bitsRes, matsRes] = await Promise.all([
    fetch('./data/bits.json').then(r => r.json()),
    fetch('./data/materials.json').then(r => r.json())
  ]);
  BITS = bitsRes;
  MATERIALS = matsRes;

  renderMaterialList();
  renderBitsScreen();
  setupNav();
  setupOperationButtons();
}

function setupNav() {
  document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.addEventListener('click', () => showScreen(btn.dataset.screen));
  });
}

function showScreen(name) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById('screen-' + name).classList.add('active');
  document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
  document.querySelector(`.nav-btn[data-screen="${name}"]`).classList.add('active');
  if (name === 'wizard' && wizState.step === 1) wizRestart();
}

function renderMaterialList() {
  const list = document.getElementById('material-list');
  list.innerHTML = MATERIALS.map(m => `
    <button class="option-btn" data-mat="${m.id}">
      <strong>${m.name}</strong>
      <span>${m.category}</span>
    </button>
  `).join('');
  list.querySelectorAll('.option-btn').forEach(btn => {
    btn.addEventListener('click', () => selectMaterial(btn.dataset.mat));
  });
}

function selectMaterial(matId) {
  wizState.material = MATERIALS.find(m => m.id === matId);
  document.querySelectorAll('#material-list .option-btn').forEach(b => b.classList.remove('selected'));
  document.querySelector(`#material-list [data-mat="${matId}"]`).classList.add('selected');
  document.getElementById('thickness-group').style.display = 'block';
  setTimeout(() => wizGoTo(2), 300);
}

function setupOperationButtons() {
  document.querySelectorAll('#wiz-step-2 .option-btn').forEach(btn => {
    btn.addEventListener('click', () => selectOperation(btn.dataset.op));
  });
}

function selectOperation(op) {
  wizState.operation = op;
  document.querySelectorAll('#wiz-step-2 .option-btn').forEach(b => b.classList.remove('selected'));
  document.querySelector(`#wiz-step-2 [data-op="${op}"]`).classList.add('selected');
  setTimeout(() => {
    recommendBit();
    wizGoTo(3);
  }, 300);
}

function recommendBit() {
  const mat = wizState.material;
  const op = wizState.operation;
  let rec = null;
  let reason = '';
  let alternatives = [];

  if (op === 'vcarve') {
    rec = BITS.find(b => b.id === 4);
    reason = 'V-carving requires a V-bit. Your 60-degree V-bit is the right tool for lettering and engraving.';
  } else if (op === 'surface') {
    rec = BITS.find(b => b.id === 5);
    reason = 'Surfacing needs a wide bit for coverage. Your 1" surfacing bit is purpose-built for this.';
  } else if (op === 'engrave') {
    rec = BITS.find(b => b.id === 2);
    reason = 'The small 2mm downcut is perfect for shallow line engraving with clean edges.';
    alternatives = [BITS.find(b => b.id === 4)];
  } else if (op === 'drill') {
    rec = BITS.find(b => b.id === 3);
    reason = 'Drilling needs an upcut bit to evacuate chips from the hole. Your 1/8" upcut is ideal.';
  } else if (op === 'pocket') {
    if (mat && ['hardwood', 'plywood'].includes(mat.id)) {
      rec = BITS.find(b => b.id === 1);
      reason = 'The 1/4" downcut gives clean pocket surfaces and keeps chips in the pocket for chip clearing.';
      alternatives = [BITS.find(b => b.id === 3)];
    } else {
      rec = BITS.find(b => b.id === 3);
      reason = 'The 1/8" upcut has good chip evacuation for pocketing. Use for general materials.';
      alternatives = [BITS.find(b => b.id === 1)];
    }
  } else {
    if (mat && mat.id === 'plywood') {
      rec = BITS.find(b => b.id === 1);
      reason = 'The 1/4" downcut gives a clean top edge on plywood. For clean both sides, you\'d need a compression bit (not in your inventory).';
      alternatives = [BITS.find(b => b.id === 3)];
    } else if (mat && mat.id === 'hardwood') {
      rec = BITS.find(b => b.id === 3);
      reason = 'The 1/8" upcut with good chip evacuation works well for hardwood profiles. Take lighter passes.';
      alternatives = [BITS.find(b => b.id === 1)];
    } else {
      rec = BITS.find(b => b.id === 3);
      reason = 'Your workhorse 1/8" upcut is the best general-purpose choice for profile cuts.';
      alternatives = [BITS.find(b => b.id === 1)];
    }
  }

  wizState.selectedBit = rec;

  const container = document.getElementById('bit-recommendation');
  container.innerHTML = `
    <div class="bit-card" style="border-color: var(--primary); border-width: 2px;">
      <div class="bit-card-header">
        <h3>${rec.name}</h3>
        <div>
          <span class="bit-nr">NR ${rec.id}</span>
          <span class="bit-qty">${rec.qty}x in stock</span>
        </div>
      </div>
      <div class="bit-specs">
        <span>Shank: <strong>${rec.shank_label}</strong></span>
        <span>Cut dia: <strong>${rec.cut_diameter_label}</strong></span>
        <span>Flutes: <strong>${rec.flutes}</strong></span>
        <span>Collet: <strong>${rec.collet_mm}mm</strong></span>
      </div>
      <p style="font-size:0.85rem; margin-top:8px;">${reason}</p>
    </div>
    ${alternatives.length ? `
      <p style="font-size:0.8rem; color: var(--text-light); margin-top:12px;">
        <strong>Alternative:</strong> ${alternatives.map(a => `${a.name} (NR ${a.id})`).join(', ')}
      </p>
    ` : ''}
    <button class="btn btn-primary" style="margin-top:16px; width:100%;" onclick="generateSettings()">
      Generate Settings
    </button>
  `;
}

function generateSettings() {
  const mat = wizState.material;
  const bit = wizState.selectedBit;
  const op = wizState.operation;
  const thickness = parseFloat(document.getElementById('material-thickness').value) || 18;

  let dial, rpm, feed, plunge, depth, totalDepth, passes, stepover, tabs, camNotes;

  if (op === 'surface') {
    dial = '1-2';
    rpm = '~12,000';
    feed = 800;
    plunge = 200;
    depth = 0.5;
    totalDepth = 1;
    passes = 2;
    stepover = '70% (18mm)';
    tabs = 'No';
    camNotes = ['Set origin to front-left of spoilboard', 'Use a raster/zigzag pattern', 'Overlap passes slightly to avoid ridges'];
  } else if (op === 'vcarve') {
    dial = '3';
    rpm = '~17,600';
    feed = 800;
    plunge = 200;
    depth = 0;
    totalDepth = 0;
    passes = 0;
    stepover = 'N/A (V-carve follows path)';
    tabs = 'No';
    camNotes = ['V-carve depth is controlled by letter/design width', 'Wider text = deeper cut', 'Preview depth in CAM before cutting'];
  } else {
    const matSettings = mat ? mat.settings.find(s => s.bit_id === bit.id) : null;
    if (matSettings) {
      dial = matSettings.dial;
      rpm = matSettings.rpm;
      feed = matSettings.feed;
      plunge = matSettings.plunge;
      depth = matSettings.depth;
    } else {
      dial = '2-3';
      rpm = '~16,000';
      feed = 480;
      plunge = 180;
      depth = 2;
    }

    if (op === 'profile') {
      totalDepth = thickness + 1;
      passes = Math.ceil(totalDepth / depth);
      stepover = 'N/A (profile cut)';
      tabs = 'Yes -- 4mm wide, 1.5mm tall, every 80-100mm';
      camNotes = [
        'Set origin to front-left corner of workpiece',
        `Total depth: ${totalDepth}mm (${thickness}mm material + 1mm into spoilboard)`,
        'Use tabs to prevent parts from flying loose',
        'Climb milling recommended (conventional if edges tear)'
      ];
    } else if (op === 'pocket') {
      totalDepth = Math.min(thickness - 2, thickness * 0.6);
      passes = Math.ceil(totalDepth / depth);
      stepover = `${Math.round(bit.cut_diameter_mm * 0.45 * 10) / 10}mm (45% of bit diameter)`;
      tabs = 'No';
      camNotes = [
        'Set origin to front-left corner of workpiece',
        `Pocket depth: adjust to your design (max ${thickness - 2}mm to keep bottom intact)`,
        'Leave 0.1mm finishing pass for clean pocket floor (optional)'
      ];
    } else if (op === 'drill') {
      totalDepth = thickness + 1;
      passes = Math.ceil(totalDepth / depth);
      stepover = 'N/A';
      tabs = 'No';
      camNotes = [
        'Use peck drilling: plunge, retract, plunge deeper',
        `Total depth: ${totalDepth}mm for through-holes`
      ];
    } else {
      totalDepth = 1;
      passes = 1;
      stepover = 'N/A';
      tabs = 'No';
      camNotes = ['Adjust depth for desired engraving depth (0.5-2mm typical)'];
    }
  }

  wizState.settings = { dial, rpm, feed, plunge, depth, totalDepth, passes, stepover, tabs };

  const card = document.getElementById('settings-card');
  card.innerHTML = `
    <h4>Your CNC Settings</h4>
    <div class="settings-row"><span class="label">Material</span><span class="value">${mat ? `${thickness}mm ${mat.name}` : 'N/A'}</span></div>
    <div class="settings-row"><span class="label">Operation</span><span class="value">${formatOp(op)}</span></div>
    <div class="settings-row"><span class="label">Bit</span><span class="value">${bit.name} (NR ${bit.id})</span></div>
    <div class="settings-row"><span class="label">Collet needed</span><span class="value">${bit.collet_mm}mm${bit.collet_mm === 8 ? ' (included)' : ''}</span></div>

    <div class="settings-section settings-highlight">
      <div class="settings-row"><span class="label">Kress Dial</span><span class="value">${dial} (${rpm})</span></div>
      <div class="settings-row"><span class="label">Feed Rate</span><span class="value">${feed} mm/min</span></div>
      <div class="settings-row"><span class="label">Plunge Rate</span><span class="value">${plunge} mm/min</span></div>
      <div class="settings-row"><span class="label">Depth per Pass</span><span class="value">${depth}mm</span></div>
      ${totalDepth ? `<div class="settings-row"><span class="label">Total Depth</span><span class="value">${totalDepth}mm</span></div>` : ''}
      ${passes ? `<div class="settings-row"><span class="label">Passes</span><span class="value">${passes}</span></div>` : ''}
    </div>

    <div class="settings-row" style="margin-top:12px"><span class="label">Stepover</span><span class="value">${stepover}</span></div>
    <div class="settings-row"><span class="label">Tabs</span><span class="value">${tabs}</span></div>

    <div class="cam-notes">
      <strong>CAM Notes:</strong>
      <ul>${camNotes.map(n => `<li>${n}</li>`).join('')}</ul>
    </div>
  `;

  const warningBox = document.getElementById('material-warning');
  if (mat && mat.warning) {
    warningBox.textContent = mat.warning;
    warningBox.style.display = 'block';
  } else {
    warningBox.style.display = 'none';
  }

  wizGoTo(4);
}

function formatOp(op) {
  const map = {
    profile: 'Profile / Through-Cut',
    pocket: 'Pocket',
    vcarve: 'V-Carve / Lettering',
    drill: 'Drill Holes',
    surface: 'Surfacing',
    engrave: 'Line Engraving'
  };
  return map[op] || op;
}

function wizGoTo(step) {
  wizState.step = step;
  document.querySelectorAll('.wiz-step').forEach(s => s.classList.remove('active'));
  document.getElementById('wiz-step-' + step).classList.add('active');
  document.getElementById('wiz-back').style.display = step > 1 ? 'inline-block' : 'none';
  document.getElementById('wiz-restart').style.display = step > 1 ? 'inline-block' : 'none';

  if (step === 4) {
    setTimeout(() => {
      renderWorkflowChecklist();
      const goBtn = document.createElement('button');
      goBtn.className = 'btn btn-primary';
      goBtn.style.cssText = 'margin-top:16px; width:100%;';
      goBtn.textContent = 'Start Workflow Checklist';
      goBtn.onclick = () => wizGoTo(5);
      const existing = document.querySelector('#wiz-step-4 .btn-primary:last-child');
      if (!existing || existing.textContent !== 'Start Workflow Checklist') {
        document.getElementById('wiz-step-4').appendChild(goBtn);
      }
    }, 100);
  }
}

function wizBack() {
  if (wizState.step > 1) wizGoTo(wizState.step - 1);
}

function wizRestart() {
  wizState = { step: 1, material: null, operation: null, selectedBit: null, settings: null };
  document.querySelectorAll('.option-btn').forEach(b => b.classList.remove('selected'));
  document.getElementById('thickness-group').style.display = 'none';
  document.querySelectorAll('#wiz-step-4 .btn-primary').forEach(b => {
    if (b.textContent === 'Start Workflow Checklist') b.remove();
  });
  wizGoTo(1);
}

function renderWorkflowChecklist() {
  const bit = wizState.selectedBit;
  const mat = wizState.material;
  const s = wizState.settings;
  const op = wizState.operation;

  const phases = [
    {
      title: 'CAM Setup',
      items: [
        { text: `Open Estlcam or MillMage` },
        { text: `Import your design (SVG, DXF, or draw)` },
        { text: `Select tool: ${bit.name} (NR ${bit.id})` },
        { text: `Set feeds & speeds: ${s.feed} mm/min feed, ${s.plunge} mm/min plunge` },
        { text: `Set depth per pass: ${s.depth}mm` },
        ...(s.totalDepth ? [{ text: `Set total depth: ${s.totalDepth}mm` }] : []),
        ...(op === 'profile' ? [{ text: `Add tabs: 4mm wide, 1.5mm tall, every 80-100mm` }] : []),
        { text: `Preview/simulate toolpath — verify it fits your workpiece` },
        { text: `Generate G-code (GRBL format for Jackpot)` }
      ]
    },
    {
      title: 'Machine Setup',
      items: [
        { text: 'Power on Jackpot controller' },
        { text: 'Connect to Jackpot WiFi, open Web UI' },
        { text: 'Home all axes: send $H' },
        { text: 'Secure workpiece to spoilboard (tape+CA, screws, or clamps)' },
        { text: 'Verify workpiece cannot move (push/pull test)' },
        { text: `Install bit: ${bit.name} into ${bit.collet_mm}mm collet`, warning: bit.collet_mm !== 8 ? `Make sure you have the ${bit.collet_mm}mm collet!` : null },
        { text: 'Tighten collet firmly with two wrenches' },
        { text: 'Jog to X/Y zero position on workpiece' },
        { text: 'Set X/Y zero: G92 X0 Y0', warning: 'Must match your CAM origin (usually front-left corner)!' },
        { text: 'Clip probe wire to bit' },
        { text: 'Place touchplate on workpiece surface' },
        { text: 'Z-probe: G38.2 Z-25 F100 P[plate thickness]' },
        { text: 'Verify probe success: [PRB:...:1]' },
        { text: 'Remove touchplate and probe wire' }
      ]
    },
    {
      title: 'Pre-Start Safety Check',
      items: [
        { text: 'Safety glasses ON' },
        { text: 'Hearing protection ON' },
        ...(mat && mat.id === 'mdf' ? [{ text: 'Respirator ON (MDF dust is carcinogenic!)', warning: 'A paper mask is NOT enough for MDF. Use a proper P2/N95 respirator.' }] : [{ text: 'Dust mask ON or dust collection running' }]),
        { text: 'Workpiece still secure (re-check)' },
        { text: `Correct bit installed: ${bit.name} (NR ${bit.id})` },
        { text: 'Collet is tight' },
        { text: 'Nothing in the toolpath (cables, clamps, tools)' },
        { text: 'Emergency stop is accessible' }
      ]
    },
    {
      title: 'Run the Job',
      items: [
        { text: 'Upload G-code file to Jackpot via Web UI' },
        { text: `TURN ON THE SPINDLE — Kress dial to ${s.dial}`, warning: 'The Jackpot does NOT control the Kress! You must turn the dial manually.' },
        { text: 'Turn on dust collection / vacuum' },
        { text: 'Start the G-code from Web UI' },
        { text: 'Watch the first cuts closely — listen for chatter' },
        { text: 'Monitor chip quality (clean curls = good)' },
        { text: 'Stay present until job completes' }
      ]
    },
    {
      title: 'Finishing',
      items: [
        { text: 'Wait for job to complete fully' },
        { text: 'Turn OFF the Kress spindle (dial to 0)' },
        { text: 'Turn off dust collection' },
        { text: 'Jog gantry out of the way' },
        { text: 'Remove workpiece' },
        ...(op === 'profile' ? [{ text: 'Cut remaining tabs with flush-cut saw or chisel' }, { text: 'Sand tab nubs smooth' }] : []),
        { text: 'Vacuum chips from machine' },
        { text: 'Clean the bit before storing' }
      ]
    }
  ];

  const container = document.getElementById('workflow-checklist');
  container.innerHTML = phases.map((phase, pi) => `
    <div class="checklist-phase" data-phase="${pi}">
      <div class="phase-header ${pi === 0 ? 'active' : ''}" onclick="togglePhase(${pi})">
        <span class="phase-num">${pi + 1}</span>
        <h4>${phase.title}</h4>
        <span class="phase-progress" id="phase-prog-${pi}">0/${phase.items.length}</span>
      </div>
      <div class="phase-body ${pi === 0 ? 'open' : ''}" id="phase-body-${pi}">
        ${phase.items.map((item, ii) => `
          <div class="check-item" data-phase="${pi}" data-item="${ii}" onclick="toggleCheck(this)">
            <div class="check-box"></div>
            <div>
              <span class="check-text">${item.text}</span>
              ${item.warning ? `<span class="check-warning">${item.warning}</span>` : ''}
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `).join('');
}

function togglePhase(pi) {
  const body = document.getElementById('phase-body-' + pi);
  body.classList.toggle('open');
}

function toggleCheck(el) {
  el.classList.toggle('checked');
  const pi = parseInt(el.dataset.phase);
  const phaseItems = document.querySelectorAll(`.check-item[data-phase="${pi}"]`);
  const checked = document.querySelectorAll(`.check-item[data-phase="${pi}"].checked`).length;
  const total = phaseItems.length;
  document.getElementById('phase-prog-' + pi).textContent = `${checked}/${total}`;

  const header = el.closest('.checklist-phase').querySelector('.phase-header');
  if (checked === total) {
    header.classList.add('completed');
    header.classList.remove('active');
    const nextPhase = document.querySelector(`.checklist-phase[data-phase="${pi + 1}"]`);
    if (nextPhase) {
      nextPhase.querySelector('.phase-header').classList.add('active');
      nextPhase.querySelector('.phase-body').classList.add('open');
      nextPhase.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  } else {
    header.classList.remove('completed');
    header.classList.add('active');
  }
}

function renderBitsScreen() {
  const list = document.getElementById('bits-list');
  list.innerHTML = BITS.map(b => `
    <div class="bit-card">
      <div class="bit-card-header">
        <h3>${b.name}</h3>
        <div>
          <span class="bit-nr">NR ${b.id}</span>
          <span class="bit-qty">${b.qty}x</span>
        </div>
      </div>
      <div class="bit-specs">
        <span>Type: <strong>${b.type}</strong></span>
        <span>Shank: <strong>${b.shank_label}</strong></span>
        <span>Cut dia: <strong>${b.cut_diameter_label}</strong></span>
        <span>Flutes: <strong>${b.flutes}</strong></span>
        <span>Coating: <strong>${b.coating}</strong></span>
        <span>Collet: <strong>${b.collet_mm}mm</strong></span>
        ${b.flute_length_mm ? `<span>Flute len: <strong>${b.flute_length_mm}mm</strong></span>` : ''}
      </div>
      <div class="bit-notes">${b.notes}</div>
    </div>
  `).join('');
}

init();
