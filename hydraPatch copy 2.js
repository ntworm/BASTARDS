let hydraFeatures = {};

function hydraPatch() {
  const fxrand = () => $fx.rand();
  const randBetween = (a, b) => fxrand() * (b - a) + a;
  const sample = arr => arr[Math.floor(randBetween(0, arr.length))];
  const powerUp = (base = 1, boost = 2, chance = 0.82) => fxrand() > chance ? boost : base;
  const AR = height / width;
  const lineage = $fx.lineage;
  const depth = $fx.depth;


  // Helper seguro
  function safeRandAt(n) {
    return $fx.randAt(Math.min(Math.max(n, 0), depth));
  }
  function paramBetween(idx, a, b) {
    return safeRandAt(idx) * (b - a) + a;
  }
  function paramFloor(idx, a, b) {
    return Math.floor(paramBetween(idx, a, b));
  }

  // --- PALETA ---
  const paletteList = [
    { name: "PATTERN1", colors: [[1, .45, .38], [.44, .55, 1], [.88, .28, .52]] },
    { name: "PATTERN2", colors: [[.22, .98, .64], [1, .95, .55], [.51, .13, 1]] },
    { name: "PATTERN3", colors: [[1, .55, .3], [1, .85, .25], [.88, .28, .18]] },
    { name: "PATTERN4", colors: [[1, 0.72, 0.33], [0.99, 0.42, 0.38], [0.39, 0.13, 0.44]] },
    { name: "PATTERN5", colors: [[0.22, 0.68, 0.82], [0.27, 0.93, 0.8], [0.11, 0.45, 0.41]] },
    { name: "PATTERN6", colors: [[0.98, 0.36, 0.66], [0.26, 0.98, 0.76], [0.77, 0.25, 0.54]] },
    { name: "PATTERN7", colors: [[0.12, 0.97, 1], [0.98, 0.97, 0.13], [0.21, 0.09, 0.83]] },
    { name: "PATTERN8", colors: [[0.89, 0.6, 0.27], [0.95, 0.91, 0.59], [0.46, 0.22, 0.12]] },
    { name: "PATTERN9", colors: [[0.56, 0.19, 0.73], [0.95, 0.66, 1], [0.35, 0.23, 0.5]] },
    { name: "PATTERN10", colors: [[0.12, 1, 0.89], [1, 0.15, 0.51], [0.86, 0.04, 0.99]] }
  ];
  const paletteIdx = Math.floor(safeRandAt(0) * paletteList.length);
  const paletteObj = paletteList[paletteIdx];

  // Função para shift suave de cor
function evolveColor(rgb, shift) {
  return rgb.map(x => Math.min(1, Math.max(0, x + shift)));
}

  const colorShift = 0.05 * depth; // quanto maior a árvore, mais shift
  const colorMain = evolveColor(paletteObj.colors[0], colorShift);
  const colorAlt = evolveColor(paletteObj.colors[1], colorShift);
  const colorTertiary = evolveColor(paletteObj.colors[2], colorShift);

  // --- PIXELATE MODE (sem alteração, só parametrizado) ---
  function pixelateModeFeature() {
    const r = safeRandAt(1);
    if (r < 0.1) {
      if (safeRandAt(2) > 0.5) {
        return { mode: 'SUPER-PIXEL', x: paramFloor(3, 4, 7), y: paramFloor(4, 1, 3) };
      } else {
        return { mode: 'SUPER-PIXEL', x: paramFloor(5, 1, 3), y: paramFloor(6, 4, 7) };
      }
    } else if (r < 0.5) {
      if (safeRandAt(7) > 0.5) {
        return { mode: 'MINI-PIXEL', x: paramFloor(8, 150, 250), y: paramFloor(9, 10, 20) };
      } else {
        return { mode: 'MINI-PIXEL', x: paramFloor(10, 10, 20), y: paramFloor(11, 150, 250) };
      }
    } else {
      let n = paramFloor(12, 15, 25);
      let variation1 = Math.floor(safeRandAt(13) * 5);
      return { mode: 'REGULAR', x: n + variation1, y: n - variation1 };
    }
  }
  const pxMode = pixelateModeFeature();

  // --- PARÂMETROS EVOLUTIVOS ---
  const shapeType      = paramFloor(14, 3, 10);
  const rotate         = paramBetween(15, 0, Math.PI);

  // Progressão controlada pelos limites definidos no código
  const blendIntensity = Math.min(0.2, paramBetween(16, 0.052, 0.2) + 0.03 * depth); // cresce, mas nunca passa de 0.2
  const mainSaturate   = Math.min(2.5, paramBetween(17, 1, 2.5) + 0.15 * depth);    // idem, max 2.5
  const hydraSpeed     = Math.min(0.44, paramBetween(18, 0.05, 0.44) + 0.01 * depth); // idem

  const ditherActive   = 1; // Sempre ativo!

  // Outras variáveis randomizadas
  const colovar1 = safeRandAt(19);
  const colovar2 = safeRandAt(20);

  const scrollvar1 = safeRandAt(21);
  const scrollvar2 = safeRandAt(22);
  const scrollvar3 = safeRandAt(23);
  const scrollvar4 = safeRandAt(24);

  const noisevar1 = safeRandAt(25);
  const noisevar2 = safeRandAt(26);
  const noisevar3 = safeRandAt(27);
  const noisevar4 = safeRandAt(28);

  const rotatevar1 = safeRandAt(29);
  const rotatevar2 = safeRandAt(30);
  const rotatevar3 = safeRandAt(31);

  const brickvar1 = safeRandAt(32);
  const brickvar2 = safeRandAt(33);
  const brickvar3 = safeRandAt(34);

  hydraFeatures = {
    "Shape Type": shapeType,
    "Blend Intensity": blendIntensity.toFixed(3),
    "Dither": ditherActive,
    "Main Saturate": mainSaturate.toFixed(2),
    "Hydra Speed": hydraSpeed.toFixed(3),
    "Palette": paletteObj.name,
    "Pixelate Mode": pxMode.mode,
    "Pixelate X": pxMode.x,
    "Pixelate Y": pxMode.y
  };

  // -------- PATCH PRINCIPAL (mantém igual, mas usa as cores e parâmetros evoluídos) ------------
  let baseShape = shape(
    shapeType, 
    paramBetween(35, .13, .22), 
    paramBetween(36, .03, .13)
  )
  .color(...colorAlt)
  .mult(
    noise(
      paramFloor(37, 3, 8), 
      paramBetween(38, .12, noisevar1*.19), 
      paramBetween(39, .01, noisevar2*.09)
    ).invert()
  )
  .scale(1, AR)
  .rotate(rotate)
  .scroll(
    0, 0,
    (scrollvar1 * .28 + .13) * (scrollvar2 > 0.5 ? 1 : -1),
    (scrollvar2 * .28 + .13) * (scrollvar1 > 0.5 ? 1 : -1)
  )
  .modulateScrollY(
    noise(
      paramBetween(40, 5.5, noisevar4*10.2), 
      paramBetween(41, .11, noisevar3*.19)
    )
    .scale(paramBetween(42, 2.1, 5.2), AR, 1, safeRandAt(43), safeRandAt(44))
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
        .rotate(paramBetween(51, -0.4, rotatevar1*.4))
        .color(...colorMain)
      )
      //.add(brick(...)) // destrave se quiser usar brickvarN
      .add(
        osc(paramBetween(52, 1.1, 2.9), paramBetween(53, .05, .18), 0)
        .rotate(paramBetween(54, -0.4, rotatevar2*.4))
        .color(...colorTertiary)
      )
  )
  .modulate(
    noise(paramBetween(55, 4.1, noisevar1*7.9), .11)
      .scale(paramBetween(56, 2, 5), AR, 1, safeRandAt(57), safeRandAt(58)), .33
  )
  .modulateRotate(
    brick(paramBetween(59, 4.3, brickvar3*7.1), .15)
      .scale(paramBetween(60, 2, 5), AR, 1, safeRandAt(61), safeRandAt(62)), .13
  )
  .modulateScrollX(
    noise(paramBetween(63, 6.3, 11), -.12, safeRandAt(64))
      .scale(paramBetween(65, 2, 5), AR, 1, safeRandAt(66), safeRandAt(67)), .09
  );

  if (ditherActive) baseShape = baseShape.dither4();
  baseShape.out(o1);

  // --------- feedbackLoop ----------------
  function feedbackLoop() {
    let flipInvert = safeRandAt(68) > 0.5 ? 1 : 0;
    let pxl = safeRandAt(69) > 0.6 ? height : [8, 16, 4, 24, 12][Math.floor(safeRandAt(70) * 5)];
    let angle = paramBetween(71, 0, Math.PI);
    let repX = paramFloor(72, 1, 7);
    let repY = paramFloor(73, 1, 7);

    src(o1)
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
                noise(paramBetween(75, 1, noisevar2*4), paramBetween(76, .07, noisevar3*.21))
                  .thresh(0, 0)
                  .invert(flipInvert, pxl, safeRandAt(77)),
                safeRandAt(78) < .333 ? 1 : (safeRandAt(79) > .666 ? 0 : 0)
              )
              .add(
                shape(1, 0, 0)
                  .invert(flipInvert)
                  .rotate(angle)
                  .repeat(repX, repY),
                safeRandAt(80) < .333 ? 0 : (safeRandAt(81) > .666 ? 1 : 0)
              )
              .add(
                voronoi(paramBetween(82, .3, 3), paramBetween(83, .02, .13), 0)
                  .thresh(.5, 0)
                  .invert(flipInvert),
                safeRandAt(84) < .333 ? 0 : (safeRandAt(85) > .666 ? 0 : 1)
              )
              .pixelate(pxl / AR, pxl)
              // .sepia(0.2)
              // .hue(1)
          )
          .pixelate(),
        () => Math.abs(Math.sin(time*hydraSpeed) * 0.42 + blendIntensity)
      )
      .blend(
        src(o0)
          .modulate(noise(5000, 0.01).dither4(), () => Math.abs(Math.sin(time*hydraSpeed) * 0.02))
          .scroll(.002 * (scrollvar4 > 0.5 ? 1 : -1) * (scrollvar3 + 1) * AR, .002 * (scrollvar2 > 0.5 ? 1 : -1) * (scrollvar1 + 1) * AR),
        0.4
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
              .add(shape(2, 0, 0).invert(1 - flipInvert).rotate(angle).repeat(repX, repY), safeRandAt(92) < .333 ? 0 : (safeRandAt(93) > .666 ? 1 : 0))
              .add(noise(paramBetween(94, .3, noisevar2*3), paramBetween(95, .02, noisevar1*.13)).thresh(.5, 0).invert(1 - flipInvert), safeRandAt(96) < .333 ? 0 : (safeRandAt(97) > .666 ? 0 : 1))
              .pixelate(pxl / AR, pxl)
              .dither4()
          ),
        () => Math.abs(Math.cos(time*hydraSpeed) * 0.22 + blendIntensity) + 0.2
      )
      .blend(
        src(o0)
          .color(...colorMain)
          .pixelate(pxMode.x, pxMode.y)
          .modulate(src(o0), blendIntensity*0.051)
          
          //.grawave(0.1*colovar1)
          // .sepia(0.5)
          
          ,
        () => Math.abs(Math.sin(time*hydraSpeed) * 0.42 + blendIntensity)
      )
      .out(o0)
  }

  feedbackLoop();
  speed = hydraSpeed;

  document.addEventListener("keyup", (event) => {
    if (event.key === "s" || event.key === "S") {
      event.preventDefault();
      screencap();
    }
  });
}

export { hydraPatch, hydraFeatures };
