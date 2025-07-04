let hydraFeatures = {};

function hydraPatch() {
const fxrand = () => $fx.rand();
const AR = height / width;
const depth = $fx.depth;
const rootHash = $fx.lineage[0];
const familyStructure = generateFamilyStructure($fx.lineage[0]);
const isInfinite = familyStructure.length > 50; 
const familyType = isInfinite ? "infinite" : "finite";
const familySize = isInfinite ? "∞" : familyStructure.length;
const familyStructStr = familyStructure.join('-');
let role = getRole(depth, familyStructure);

hydraFeatures["Family Structure"] = familyStructure;
hydraFeatures["Family Size"] = familySize;
hydraFeatures["Role"] = role;

function getRole(depth, structure) {
  if (depth < structure.length) {
    return structure[depth];
  } else {
    return "lost";
  }
}

function generateFamilyStructure(
  rootHash,
  probs = {
    probShort: 0.20,
    probMedium: 0.3,
    probLong: 0.3,
    probInfinite: 0.2,
    earlyBastard: 0.3,
    earlyDeserter: 0.15,
    loopBastard: 0.1,
    loopDeserter: 0.1
  }
) {
  const prng = $fx.createFxRandom(rootHash);
  const r = prng();
  let minSize, maxSize, infinite = false;

  if (r < probs.probShort) {
    minSize = 2;
    maxSize = 4;
  } else if (r < probs.probShort + probs.probMedium) {
    minSize = 4;
    maxSize = 8;
  } else if (r < probs.probShort + probs.probMedium + probs.probLong) {
    minSize = 9;
    maxSize = 18;
  } else {
    minSize = 9999;
    maxSize = 9999;
    infinite = true;
  }

  const familySize = infinite ? 9999 : (Math.floor(prng() * (maxSize - minSize + 1)) + minSize);
  const structure = ["patriarch"];
  let terminated = false;

  // Early termination
  if (!infinite && familySize <= 4) {
    const r1 = prng();
    if (r1 < probs.earlyBastard) {
      structure.push("bastard");
      terminated = true;
    } else if (r1 < probs.earlyBastard + probs.earlyDeserter) {
      structure.push("deserter");
      terminated = true;
    } else {
      structure.push("primogenito");
    }
  } else {
    structure.push("primogenito");
  }

  for (let i = 2; i < familySize - 1 && !terminated; i++) {
    if (!infinite) {
      const r2 = prng();
      if (r2 < probs.loopBastard) {
        structure.push("bastard");
        terminated = true;
      } else if (r2 < probs.loopBastard + probs.loopDeserter) {
        structure.push("deserter");
        terminated = true;
      } else {
        structure.push("descendant");
      }
    } else {
      structure.push("descendant");
    }
  }

  if (!terminated && !infinite) {
    structure.push(prng() < 0.7 ? "bastard" : "deserter");
  } else if (!infinite) {
    // nada
  } else {
    for (let i = structure.length; i < familySize; i++) {
      structure.push("descendant");
    }
  }

  return structure;
}


const roleSettings = {
  patriarch:   { saturation: 1.15, modulation: 0, feedback: 0 },
  primogenito: { saturation: 1.05, modulation: 0, feedback: 0 },
  descendant:  { saturation: 1, modulation: 0, feedback: 0 },
  bastard:     { saturation: 0.7, modulation: 1, feedback: 1},
  deserter:    { saturation: 0.7, modulation: 0.5, feedback: 0.5 },
  lost:        { saturation: 0.0, modulation: 1.0, feedback: 0 }
};


const paletteList = [
  { name: "PATTERN1",  colors: [[1, .45, .38], [.44, .55, 1], [.88, .28, .52]] },
  { name: "PATTERN2",  colors: [[.22, .98, .64], [1, .95, .55], [.51, .13, 1]] },
  { name: "PATTERN3",  colors: [[1, .55, .3], [1, .85, .25], [.88, .28, .18]] },
  { name: "PATTERN4",  colors: [[1, 0.72, 0.33], [0.99, 0.42, 0.38], [0.39, 0.13, 0.44]] },
  { name: "PATTERN5",  colors: [[0.22, 0.68, 0.82], [0.27, 0.93, 0.8], [0.11, 0.45, 0.41]] },
  { name: "PATTERN6",  colors: [[0.98, 0.36, 0.66], [0.26, 0.98, 0.76], [0.77, 0.25, 0.54]] },
  { name: "PATTERN7",  colors: [[0.12, 0.97, 1], [0.98, 0.97, 0.13], [0.21, 0.09, 0.83]] },
  { name: "PATTERN8",  colors: [[0.89, 0.6, 0.27], [0.95, 0.91, 0.59], [0.46, 0.22, 0.12]] },
  { name: "PATTERN9",  colors: [[0.56, 0.19, 0.73], [0.95, 0.66, 1], [0.35, 0.23, 0.5]] },
  { name: "PATTERN10", colors: [[0.12, 1, 0.89], [1, 0.15, 0.51], [0.86, 0.04, 0.99]] },
  { name: "PATTERN11", colors: [[0.99, 0.83, 0.21], [0.11, 0.41, 0.99], [0.11, 0.93, 0.48]] },
  { name: "PATTERN12", colors: [[0.98, 0.98, 0.98], [0.2, 0.22, 0.22], [0.39, 0.63, 0.75]] },
  { name: "PATTERN13", colors: [[0.45, 0.94, 0.23], [0.96, 0.46, 0.64], [0.11, 0.57, 0.96]] },
  { name: "PATTERN14", colors: [[0.89, 0.14, 0.16], [0.98, 0.89, 0.39], [0.10, 0.74, 0.62]] },
  { name: "PATTERN15", colors: [[0.93, 0.72, 0.43], [0.13, 0.48, 0.72], [0.81, 0.94, 0.57]] },
  { name: "PATTERN16", colors: [[0.21, 0.24, 0.77], [0.92, 0.22, 0.32], [0.99, 0.79, 0.36]] },
  { name: "PATTERN17", colors: [[0.13, 0.85, 0.97], [0.51, 0.37, 0.99], [0.87, 0.11, 0.18]] },
  { name: "PATTERN18", colors: [[0.71, 0.21, 0.36], [0.12, 0.78, 0.45], [0.89, 0.47, 0.99]] },
  { name: "PATTERN19", colors: [[0.43, 0.19, 0.81], [0.96, 0.95, 0.77], [0.23, 0.87, 0.92]] },
  { name: "PATTERN20", colors: [[0.34, 0.99, 0.19], [0.95, 0.76, 0.34], [0.62, 0.31, 0.80]] },
  { name: "PATTERN21", colors: [[0.98, 0.84, 0.16], [0.17, 0.62, 0.94], [0.66, 0.18, 0.47]] },
  { name: "PATTERN22", colors: [[0.13, 0.89, 0.44], [0.99, 0.29, 0.19], [0.18, 0.18, 0.18]] },
  { name: "PATTERN23", colors: [[0.29, 0.21, 0.75], [0.78, 0.55, 0.21], [0.89, 0.94, 0.31]] },
  { name: "PATTERN24", colors: [[0.90, 0.53, 0.22], [0.23, 0.98, 0.86], [0.72, 0.17, 0.39]] },
  { name: "PATTERN25", colors: [[0.55, 0.92, 0.63], [0.81, 0.14, 0.97], [0.93, 0.95, 0.89]] },
  { name: "PATTERN26", colors: [[0.27, 0.87, 0.61], [0.98, 0.52, 0.17], [0.52, 0.09, 0.67]] },
  { name: "PATTERN27", colors: [[0.91, 0.37, 0.48], [0.21, 0.58, 0.97], [0.75, 0.90, 0.43]] },
  { name: "PATTERN28", colors: [[0.38, 0.92, 0.99], [0.98, 0.33, 0.44], [0.43, 0.41, 0.21]] },
  { name: "PATTERN29", colors: [[0.13, 0.11, 0.99], [0.97, 0.99, 0.56], [0.84, 0.34, 0.13]] },
  { name: "PATTERN30", colors: [[0.14, 0.14, 0.14], [0.84, 0.84, 0.84], [1, 1, 1]] } // monocromática B&W
];


let rootPaletteIdx;

if (depth === 0) {
  rootPaletteIdx = Math.floor($fx.rand() * paletteList.length);
} else {
  const rootPRNG = rootRand();
  rootPaletteIdx = Math.floor(rootPRNG() * paletteList.length);
}

const rootPaletteObj = paletteList[rootPaletteIdx];
const lostPaletteList = [
  { name: "LOST1", colors: [[1, 1, 1], [0.7, 0.7, 0.7], [0.4, 0.4, 0.4]] },
  { name: "LOST2", colors: [[0.95, 0.95, 0.97], [0.55, 0.56, 0.58], [0.13, 0.13, 0.15]] },
  { name: "LOST3", colors: [[0.88, 0.88, 0.88], [0.68, 0.68, 0.72], [0.23, 0.23, 0.23]] },
  { name: "LOST4", colors: [[0.94, 0.94, 0.90], [0.62, 0.61, 0.59], [0.29, 0.30, 0.33]] },
  { name: "LOST5", colors: [[0.82, 0.84, 0.86], [0.56, 0.57, 0.60], [0.16, 0.17, 0.19]] },
  { name: "LOST6", colors: [[0.93, 0.92, 0.92], [0.75, 0.75, 0.77], [0.11, 0.12, 0.13]] },
  { name: "LOST7", colors: [[0.99, 0.99, 0.99], [0.5, 0.51, 0.51], [0.07, 0.07, 0.08]] },
  { name: "LOST8", colors: [[0.92, 0.92, 0.93], [0.79, 0.77, 0.75], [0.33, 0.33, 0.36]] }
];


let paletteObj;

if (role === "bastard" || role === "deserter") {
  const paletteListNoRoot = paletteList.filter((_, i) => i !== rootPaletteIdx);
  const altPaletteIdx = Math.floor($fx.rand() * paletteListNoRoot.length);
  paletteObj = paletteListNoRoot[altPaletteIdx];
} 

else if (role === "lost") {
  const lostPaletteIdx = Math.floor($fx.rand() * lostPaletteList.length);
  paletteObj = lostPaletteList[lostPaletteIdx];
}

else {
 
  paletteObj = rootPaletteObj;
}

const colorMain = paletteObj.colors[0];
const colorAlt = paletteObj.colors[1];
const colorTertiary = paletteObj.colors[2];


// ----- Funções utilitárias -----
function clip(val, min, max) {
  return Math.max(min, Math.min(max, val));
}
function cappedIdx(idx) {
  return ((idx % (depth + 1)) + (depth + 1)) % (depth + 1);
}
function safeRandAt(n) {
  return $fx.randAt(cappedIdx(n));
}
function paramBetween(idx, a, b) {
  return clip(safeRandAt(idx) * (b - a) + a, a, b);
}
function paramFloor(idx, a, b) {
  return Math.floor(paramBetween(idx, a, b));
}
function evolutiveParam({
  min, max, deltaSteps = 10, idx = 0, lineage, depth
}) {
  let basePRNG;
  if (depth === 0) {
    basePRNG = $fx.rand();
  } else {
    const refIdx = (idx === -1) ? depth - 1 : idx;
    basePRNG = $fx.createFxRandom(lineage[refIdx])();
  }
  let delta = ((max - min) / deltaSteps) * depth;
  let val = min + (basePRNG * (max - min - delta)) + delta;
  return clip(val, min, max);
}
function pixelateModeFeature() {
  const prng = familyRand();
  const r = prng();
  const r2 = prng();
  const r3 = prng();
  if (r < 0.1) {
    if (r2 > 0.5) {
      return { mode: 'SUPER-PIXEL', x: 4, y: 1 };
    } else {
      return { mode: 'SUPER-PIXEL', x: 1, y: 4 };
    }
  } else if (r < 0.5) {
    if (r2 > 0.5) {
      return { mode: 'MINI-PIXEL', x: 150, y: 10 };
    } else {
      return { mode: 'MINI-PIXEL', x: 10, y: 150 };
    }
  } else {
    let n = 15;
    let variation1 = Math.floor(r3 * 5);
    return { mode: 'REGULAR', x: n + variation1, y: n - variation1 };
  }
}
function powerUp(base = 1, boost = 2, chance = 0.82, idx = 42) {
  return safeRandAt(idx) > chance ? boost : base;
}
function rootRand() {
  return $fx.createFxRandom($fx.lineage[0]);
}
function familyRand() {
  return $fx.createFxRandom($fx.lineage[0]);
}

// ----- Parâmetros visuais -----
const pxMode = pixelateModeFeature();
let shapeType = Math.round(evolutiveParam({
  min: 3, max: 10, deltaSteps: 10, idx: -1, lineage: $fx.lineage, depth: $fx.depth
}));
let blendIntensity = evolutiveParam({
  min: 0.052, max: 0.2, deltaSteps: 10, idx: -1, lineage: $fx.lineage, depth: $fx.depth
});
let rotate = evolutiveParam({
  min: 0, max: Math.PI, deltaSteps: 10, idx: -1, lineage: $fx.lineage, depth: $fx.depth
});

const prng = familyRand();
let modulationvar1 = prng() > 0.5 ? 1 : 0;
let modulationvar2 = prng() > 0.5 ? 1 : 0;
let modulationvar3 = prng() > 0.5 ? 1 : 0;

const hueShift = clip(1 * depth / 10, 0, 1);
const saturatevar1 = clip(1 + (0.5 * depth / 10), 1, 1.5);
const dithervar = clip(1.5 * depth / 10, 0, 1.5);
const pixelatevar = clip(2 * depth / 10, 0, 2);
const modulatevar = clip(1 * depth / 10, 0, 1);

const mainSaturate = clip($fx.rand() * (2.5 - 1) + 1, 1, 2.5);
const hydraSpeed = Math.min(0.44, $fx.rand() * (0.44 - 0.05) + 0.05 + 0.01 * depth);

const ditherActive = 1;

const colovar1 = clip($fx.rand(), 0, 1);
const colovar2 = clip($fx.rand(), 0, 1);
const scrollvar1 = clip($fx.rand(), 0, 1);
const scrollvar2 = clip($fx.rand(), 0, 1);
const scrollvar3 = clip($fx.rand(), 0, 1);
const scrollvar4 = clip($fx.rand(), 0, 1);
const noisevar1 = clip($fx.rand(), 0, 1);
const noisevar2 = clip($fx.rand(), 0, 1);
const noisevar3 = clip($fx.rand(), 0, 1);
const noisevar4 = clip($fx.rand(), 0, 1);
const brickvar3 = clip($fx.rand(), 0, 1);
const fxhashvar1 = $fx.rand();
const fxhashvar2 = $fx.rand();
const fxhashvar3 = $fx.rand();

function getFamilyPosition(depth, familyStructure, role) {
  return (role === "bastard" || role === "deserter" || role === "lost") ? 0 : depth;
}

let lostDNA;
lostDNA = getLostMutationDNA(depth, familyStructure, 4, 10)
let [dna1, dna2, dna3, dna4] = lostDNA

hydraFeatures = {
  "Role": role,
  "Position in Family": getFamilyPosition(depth, familyStructure, role),
  "Palette": paletteObj.name,
  "Shape": shapeType,
  "Blend": Number(blendIntensity.toFixed(3)),
  "Speed": Number(hydraSpeed.toFixed(3)),
  "Pixelate Mode": pxMode.mode,
  "Pixelate X": pxMode.x,
  "Pixelate Y": pxMode.y,
  "Glitch Intensity": ([modulationvar1,modulationvar2,modulationvar3].reduce((a,b)=>a+b,0) + "/3"
  ),
  "Lost DNA" : [dna1,dna2,dna3,dna4].reduce((a,b)=>(a+b/4),0)
};

Object.keys(hydraFeatures).forEach(k => hydraFeatures[k] === undefined && delete hydraFeatures[k]);

function getLostMutationDNA(depth, familyStructure, nGenes = 4, lostSpan = 10) {
  let dna = [];
  const lostCount = Math.max(0, depth - (familyStructure.length - 1));
  for (let i = 0; i < nGenes; i++) {
    let growth = 1 + i * 0.3;
    let value = Math.min(1, lostCount / (lostSpan * growth));
    dna.push(Number(value.toFixed(3))); 
  }
  return dna;
}

const isFxCapture = window.$fx && $fx.capture;
let varcapture
if (isFxCapture){varcapture = 1;} 
else varcapture = 0







  // PATCH HYDRA  ----------------------------------------------
  let baseShape = shape(
    shapeType, 
    paramBetween(35, .13, $fx.rand()*.22), 
    paramBetween(36, .03, $fx.rand()*.13)
  )
  .color(...colorAlt)
  .mult(
    noise(
      paramFloor(37, 3, noisevar1*8), 
      paramBetween(38, .12, noisevar2*.19), 
    )
    .invert()
  )
  .scale(1, AR)
  .rotate(rotate)
  // .scroll(
  //   0, 0,
  //   (scrollvar1 * .28 + .13) * (scrollvar2 > 0.5 ? 1 : -1),
  //   (scrollvar2 * .28 + .13) * (scrollvar1 > 0.5 ? 1 : -1)
  // )
  .modulateScrollY(
    noise(
      paramBetween(40, 5.5, noisevar4*10.2), 
      paramBetween(41, .11, noisevar3*.19)
    )
    .scale(paramBetween(42, 2.1, $fx.rand()*5.2), AR, 1, safeRandAt(43), safeRandAt(44))
    .brightness(-.43)
    .modulate(
      noise(paramBetween(45, 7.5, noisevar2*13), .5, .22)
        .scale(paramBetween(46, 2, 4.9), AR, 1, safeRandAt(47), safeRandAt(48))
    )
  )
  .mult(
    solid()
      .add(
        noise(
          paramBetween(49, 1.1, noisevar3*2.9), 
          paramBetween(50, .05, noisevar4*.18)
        )
        .scale(1, AR)
        .rotate(paramBetween(51, -0.4, .4))
        .color(...colorMain)
      )
      .add(
        osc(paramBetween(52, 1.1, 2.9), paramBetween(53, .05, .18), 0)
        .rotate(paramBetween(54, -0.4, .4))
        .color(...colorTertiary)
      )
      .invert()
  )
  .modulate(
    noise(paramBetween(55, 4.1, noisevar1*7.9), .11)
      .scale(paramBetween(56, 2, 5), AR, 1, safeRandAt(57), safeRandAt(58)), .33
  )
  .modulateRotate(
    brick(paramBetween(59, 4.3, brickvar3*7.1), .15)
      .scale(paramBetween(60, 2, 5), AR, 1, safeRandAt(61), safeRandAt(62)), .13
  )
  .modulate(src(o1)
.pixelate(pxMode.x / AR, pxMode.y)
,roleSettings[role].modulation*2)
  .modulateScrollX(
    noise(paramBetween(63, 6.3, 11), -.12, safeRandAt(64))
      .scale(paramBetween(65, 2, 5), AR, 1, safeRandAt(66), safeRandAt(67)), .09
  )
//   .modulate(noise(5000,0.1),
// roleSettings[role].feedback*0.041)
  ;

  baseShape.out(o1);

  // --------- feedbackLoop ----------------
  function feedbackLoop() {
    let flipInvert = safeRandAt(68) > 0.5 ? 1 : 0;
    let pxl = safeRandAt(69) > 0.6 ? height : [8, 16, 4, 24, 12][Math.floor(safeRandAt(70) * 5)];
    let angle = paramBetween(71, 0, Math.PI);
    let repX = paramFloor(72, 1, 7);
    let repY = paramFloor(73, 1, 7);
    showHydraFeaturesOverlay(hydraFeatures);



    
    src(o1)
      .add(src(o1)
  //.pixelate(pxMode.x, pxMode.y)
  .dither4()
  //.thresh()
  .color(...colorTertiary)
  ,modulationvar1*1.5
)
//   .modulate(src(o0)
//   .pixelate(pxMode.x, pxMode.y)
//   .dither4()
//   ,modulationvar2*0.5
// )
  .blend(src(o1)
  //.pixelate(pxMode.x, pxMode.y)
  .dither4()
  .luma()
  //.color(...colorMain)
  ,modulationvar3*0.2
)

      .add(
        src(o0)
          .modulate(noise(5000, 0.01), () => Math.abs(Math.sin(time*hydraSpeed) * 0.012))
          .scroll(.002 * (scrollvar3 > 0.5 ? 1 : -1) * (scrollvar4 + 1) * AR, .002 * (scrollvar4 > 0.5 ? 1 : -1) * (scrollvar3 + 1) * AR)
        , () => Math.abs(Math.sin(time*hydraSpeed)) * 0.18 + 0.8
      )

      .modulateHue(
        src(o0)
          .scroll((scrollvar1 > 0.5 ? 1 : -1) / width, (scrollvar2 > 0.5 ? 1 : -1) / height)
          .pixelate(width / 2, height / 2)
          .saturate(mainSaturate)
          .hue((colovar2 > 0.5 ? 1 : -1) * -paramBetween(74, .011, .028))
          .mask(
            solid()
              .add(
                noise(paramBetween(75, 0.1, noisevar2*4), paramBetween(76, .07, noisevar3*.21))
                .scale(1, AR)
                  .thresh(0, 0)
                  .invert(flipInvert, pxl, safeRandAt(77)),
                safeRandAt(78) < .333 ? 1 : (safeRandAt(79) > .666 ? 0 : 0)
              )
              .add(
                shape(2, 0.9, 0)
                  .invert(flipInvert)
                  .rotate(angle)
                  .repeat(repX, repY / AR),
                safeRandAt(80) < .333 ? 0 : (safeRandAt(81) > .666 ? 1 : 0)
              )
              .add(
                voronoi(paramBetween(82, .3, 3), paramBetween(83, .02, .13), 0)
                  .thresh(.5, 0)
                  .invert(flipInvert),
                safeRandAt(84) < .333 ? 0 : (safeRandAt(85) > .666 ? 0 : 1)
              )
              .pixelate(pxl / AR, pxl)
              .sepia(0.2)
              .hue(1)
          )
          .pixelate(),
        () => Math.abs(Math.sin(time*hydraSpeed) * 0.42 + blendIntensity)
      )

      .add(src(o1)
    .modulate(src(o0), blendIntensity*0.051+(fxhashvar1*0.05))
    .dither4()
    .modulate(noise(5000,0.1),0.0134*modulatevar+(fxhashvar2*0.01))
    .luma(0.3+(fxhashvar2*0.3),0.7+(fxhashvar3*0.15))
    ,dithervar+0.35)

     .add(src(o1)
    .pixelate(pxMode.x / AR, pxMode.y) //
    .modulate(src(o1), blendIntensity*0.051+(fxhashvar2*0.01))
    .dither4()
    .modulate(noise(5000,0.1),0.0134*modulatevar+(fxhashvar3*0.01))
    .luma(0.3+(fxhashvar1*0.3),0.7+(fxhashvar2*0.15))
    ,pixelatevar+0.35)

      .blend(
        src(o0)
          .modulate(noise(5000, 0.01).dither4(), () => Math.abs(Math.sin(time*hydraSpeed) * 0.02))
          .scroll(.002 * (scrollvar4 > 0.5 ? 1 : -1) * (scrollvar3 + 1) * AR, .002 * (scrollvar2 > 0.5 ? 1 : -1) * (scrollvar1 + 1) * AR)
          , 0.4+(modulatevar*0.4)
         )

      .modulateHue(
        src(o0)
          .scroll((scrollvar1 > 0.5 ? 1 : -1) / width, (scrollvar2 > 0.5 ? 1 : -1) / height)
          .pixelate(width / 2, height / 2)
          .saturate(Math.min(2.5, powerUp() * paramBetween(86, 1.3, 2.3) + 0.15 * depth))
          .hue((colovar1 > 0.5 ? 1 : -1) * powerUp() * -paramBetween(87, .01, .027))
          .mask(
            solid()
              .add(brick(paramBetween(88, 1, 4), paramBetween(89, .09, .21)).thresh(0, 0).invert(1 - flipInvert), safeRandAt(90) < .333 ? 1 : (safeRandAt(91) > .666 ? 0 : 0))
              .add(shape(2, 0, 0).invert(1 - flipInvert).rotate(angle).repeat(repX, repY / AR), safeRandAt(92) < .333 ? 0 : (safeRandAt(93) > .666 ? 1 : 0))
              .add(noise(paramBetween(94, .3, 3), paramBetween(95, .02, noisevar1*.93))
              .thresh(.5, 0)
              //.invert(1 - flipInvert)
              , safeRandAt(96) < .333 ? 0 : (safeRandAt(97) > .666 ? 0 : 1))
              .pixelate(pxl / AR, pxl)
              .dither4()
          ),
        () => Math.abs(Math.cos(time*hydraSpeed) * 0.22 + blendIntensity) + 0.2
      )

      .blend(
        src(o0)

          .color(...colorMain)
          .pixelate(pxMode.x / AR, pxMode.y)
          .modulate(src(o0), clip(dna1*0.2,0,0.5)+blendIntensity*0.051)
          .modulate(noise(5000,0.1),0.0248*modulatevar)
          //.grawave(0.2*hueShift)
          //.sepia(0.1*hueShift)
          ,() => Math.abs(Math.sin(time*hydraSpeed) * 0.12 + blendIntensity+0.005+clip(dna2*0.2,0,0.5))
      )

      .saturate(roleSettings[role].saturation+roleSettings[role].feedback)
      .contrast(0.9)
      .blend(src(o1)
          .mirrorX()
          .mirrorY()
          ,roleSettings[role].feedback*0.3)
      .luma(() => Math.abs(Math.sin(time*hydraSpeed)*
      (roleSettings[role].feedback*0.1)+0.10,0.55))
      .luma(0.1,0.9)

.out(o0)

src(o0)
// .grawave(dna4)
.contrast(0.9)
// .grawave(dna1)
.mask(src(o0)
.invert()
.grawave(dna1)
// .brightness(1)
.scale(1.2)
)

.blend(src(o0)
.scrollX(0.01,0)
// .grawave(dna2)
)

.add(src(o0)
//
)

.blend(src(o0 )
.pixelate(pxMode.x / AR, pxMode.y)
.modulate(noise(shapeType,0.2)
.pixelate(pxMode.x / AR, pxMode.y),(dna1*roleSettings[role].modulation)*0.15)
// .rotate(angle)

//.mirrorX()
.mirrorY()
.scroll(scrollvar1,scrollvar2,0,0)
.modulate(src(o2),dna4*0.1)
.scrollY(0.01,0)
.blend(src(o2)
.grawave(dna4*(-1+fxrand()*2))
.hue(clip(dna1*(-1+fxrand()*2),0,1.1))
,clip((dna4*roleSettings[role].modulation),0,0.9))

.modulate(noise(5000,0.1),0.0055*dna2)
,dna1*0.5+0.051)

//.brightness(varcapture*0.8)
//.contrast(varcapture)

.out(o2)

render(o2)
  }

  feedbackLoop();
  speed = hydraSpeed*
  (roleSettings[role].modulation+roleSettings[role].saturation
    +0.1);

  document.addEventListener("keyup", (event) => {
    if (event.key === "s" || event.key === "S") {
      event.preventDefault();
      screencap();
    }
  });
}
function showHydraFeaturesOverlay(hydraFeatures) {
  let oldOverlay = document.getElementById('hydra-features-overlay');
  if (oldOverlay) oldOverlay.remove();

  const overlay = document.createElement('pre');
  overlay.id = 'hydra-features-overlay';
  overlay.style.position = 'fixed';
  overlay.style.top = '10px';
  overlay.style.left = '10px';
  overlay.style.zIndex = 9999;
  overlay.style.background = 'rgba(0,0,0,0.7)';
  overlay.style.color = '#fff';
  overlay.style.fontFamily = 'monospace';
  overlay.style.fontSize = '14px';
  overlay.style.padding = '12px 18px';
  overlay.style.borderRadius = '8px';
  overlay.style.pointerEvents = 'none';
  overlay.style.maxWidth = '600px';
  overlay.style.whiteSpace = 'pre-wrap';
  overlay.style.userSelect = 'text';
  let txt = "";
  Object.entries(hydraFeatures).forEach(([k, v]) => {
    txt += `${k}: ${Array.isArray(v) ? JSON.stringify(v) : v}\n`;
  });
  overlay.textContent = txt;

  document.body.appendChild(overlay);
}


// document.addEventListener('keyup', e => {
//   if (e.key === "h" || e.key === "H") showHydraFeaturesOverlay(hydraFeatures);
// });

export { hydraPatch, hydraFeatures, };
