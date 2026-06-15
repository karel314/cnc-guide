# Van Tiny Touch Plate → XYZ Touch Probe (FluidNC / Jackpot)

Machine: Lowrider V4 · Controller: Jackpot (FluidNC) · Probe-pin: `gpio.36`

---

## TL;DR — wat moet je aanpassen?

| Onderdeel | Verandert? |
|-----------|-----------|
| **Bedrading** (signaal + massa/klem) | ❌ Nee — zelfde 2 draden op `gpio.36` |
| **FluidNC `config.yaml`** | ❌ Nee — `pin: gpio.36:low` blijft hetzelfde |
| **Probe-offset in je macro** | ✅ Ja — 0.5 mm (Tiny Plate) → afmetingen van je blok |
| **Mogelijkheid tot X/Y proben** | ✅ Nieuw — kan nu, maar zie waarschuwing onderaan |

> **Je hoeft dus niets in FluidNC te herconfigureren.** Trek de Tiny Touch Plate
> los, prik de XYZ-probe op dezelfde header (signaal + massa, **geen 5V**), en het
> werkt direct. Alleen je *getallen* in de probe-macro veranderen.

---

## Waarom de config niet verandert

Beide probes zijn passieve **normally-open** schakelaars:

- **Signaaldraad** → het metalen blok / de plaat
- **Massadraad (krokodillenklem)** → de frees/collet

Zodra de frees contact maakt sluit het circuit en wordt `gpio.36` laag getrokken.
FluidNC ziet exact hetzelfde signaal, ongeacht of dat van een 0.5 mm plaatje of
van een groot XYZ-blok komt. De relevante config-regel blijft:

```yaml
probe:
  pin: gpio.36:low
  toolsetter_pin: NO_PIN
  check_mode_start: true
```

Niets aan wijzigen.

---

## Stap 1 — Meet je blok (belangrijk!)

Goedkope XYZ-probes (AliExpress) variëren per exemplaar. Vertrouw **niet** blind op
de meegeleverde specsheet — pak je schuifmaat en meet zelf:

- **`Z_OFFSET`** = totale **hoogte** van het blok (van de onderkant, die op je
  werkstuk rust, tot het bovenvlak waarop je naar beneden proned).
  *Bij de Tiny Touch Plate was dit 0.5 mm. Bij een blok is dit typisch 5–15 mm.*
- **`XY_OFFSET`** = de **wanddikte** van het blok op de plek waar je zijwaarts
  tegenaan proned (alleen nodig als je X/Y wilt proben).

Schrijf je gemeten waarden hier op:

```
Z_OFFSET  = ______ mm   (hoogte blok)
XY_OFFSET = ______ mm   (wanddikte, voor X/Y)
```

---

## Stap 2 — Z-proben (dit gebruik je 90% van de tijd)

Leg het blok **op** je werkstuk, klem op de frees. Vervang `Z_OFFSET` door je
gemeten hoogte. Dit is je oude Tiny-Plate-macro met alleen een ander offset-getal:

```gcode
G21 G91                    ; mm, relatief
G38.2 Z-25 F150            ; snel zoeken tot contact
G0 Z2                      ; 2 mm terug
G38.2 Z-4 F40              ; langzaam opnieuw (nauwkeurig)
G90                        ; terug naar absoluut
G10 L20 P1 Z[Z_OFFSET]     ; <-- bv. Z10  i.p.v. Z0.5
G0 Z15                     ; veilig omhoog
M0 (Verwijder probe + klem)
```

Resultaat: **Z0 = bovenkant werkstuk**, precies zoals bij de Tiny Plate.
Het enige verschil met vroeger is dat `Z0.5` nu `Z[Z_OFFSET]` is.

---

## Stap 3 — X/Y proben (optioneel, lees eerst de waarschuwing)

Plaats het blok tegen de rand van je werkstuk, klem op de frees. Probe zijwaarts
ín de wand. Na contact reken je terug naar de werkstukrand met:

> verschuiving = `XY_OFFSET` + freesradius (R = halve freesdiameter)

**X-rand proben (blok aan de −X kant, probe in +X richting):**

```gcode
G21 G91
G38.2 X25 F100             ; probe naar +X tot contact met de wand
G90
G10 L20 P1 X[-(XY_OFFSET + R)]   ; zet X0 op de werkstukrand
G91
G38.2 X-5 F100             ; klein stukje vrij
G90
```

**Y-rand** is identiek met `X`→`Y`. Pas `R` aan je freesdiameter aan
(bv. 1/8" = 3.175 mm → R = 1.5875).

> ⚠️ **Eerlijke waarschuwing:** FluidNC op de Jackpot doet X/Y-proben niet echt
> netjes (geen edge-find routine; twee punten zeggen niets over of je materiaal
> haaks ligt). Veel V1E-gebruikers gebruiken het blok **alleen voor Z** en zetten
> X/Y handmatig op een bekende hoek. Begin met Z; voeg X/Y pas toe als je het echt
> nodig hebt, en controleer altijd met een testkras (zie stap 4).

---

## Stap 4 — Kalibratietest (vóór je een echt werkstuk maakt)

1. **Bedrading-check:** klem handmatig tegen het blok, stuur `?`. Je moet `Pn:P`
   in de status zien verschijnen, en verdwijnen als je loslaat. (Zo niet → polariteit
   omdraaien: `gpio.36:low` → `gpio.36:high`.)
2. **Z-test:** voer de Z-macro uit op een stuk schroot. Zet daarna de frees met de
   hand héél voorzichtig op het oppervlak en kijk of de Z-DRO ~0 leest. Wijkt het
   af → je `Z_OFFSET` klopt niet, hermeten.
3. **X/Y-test (alleen als je dat gebruikt):** probe X0 en Y0, jog dan naar X0 Y0 en
   kijk of de frees exact op de hoek staat. Stel `XY_OFFSET`/R bij tot het klopt.

---

## Veiligheid (zelfde regels als altijd)

- **Altijd eerst stap 4.1** (handmatige `?`-check) voordat je Z laat zakken — een
  verkeerd contact = frees die je spoilboard in boort.
- **Re-probe Z na elke bitwissel** — andere freeslengte.
- **Klem verwijderen** vóór je de job start.
- **Geen 5V** op de probe-header — alleen signaal + massa.

---

## Spiekbriefje — verschil in één regel

```
Tiny Touch Plate:   G10 L20 P1 Z0.5
XYZ Probe (blok):   G10 L20 P1 Z[gemeten hoogte blok]   + optioneel X/Y proben
```
</content>
</invoke>
