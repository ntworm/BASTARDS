let hydraFeatures = {};

function hydraPatch() {
  const fxrand = () => $fx.rand();
  const AR = height / width;
  const depth = $fx.depth;
function powerUp(base = 1, boost = 2, chance = 0.82, idx = 42) {
  // Usa um idx alto, mas faz cappedIdx para garantir
  return safeRandAt(idx) > chance ? boost : base;
}

  // Helper para limitar índice
  function clip(val, min, max) {
    return Math.max(min, Math.min(max, val));
  }
  // Mantém idx sempre dentro do range [0, depth]
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
  // Paleta fixa para a árvore
  const paletteIdx = Math.floor(safeRandAt(0) * paletteList.length);
  const paletteObj = paletteList[paletteIdx];
  const colorMain = paletteObj.colors[0];
  const colorAlt = paletteObj.colors[1];
  const colorTertiary = paletteObj.colors[2];

  // PIXELATE MODE (herdado fixo na árvore)
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

  // --- PARÂMETROS EVOLUTIVOS (herança real) ---
  // shapeType: evolui cumulativo pela lineage
  let shapeType = 3;
  for (let i = 1; i <= depth; i++) {
    shapeType += Math.floor($fx.randAt(i) * 2);
  }
  shapeType = clip(shapeType, 3, 10);

  // blendIntensity: evolui cumulativo
  let blendIntensity = 0.052;
  for (let i = 1; i <= depth; i++) {
    blendIntensity += $fx.randAt(i) * 0.01;
  }
  blendIntensity = clip(blendIntensity, 0.052, 0.2);

  // rotate: evolui cumulativo
  let rotate = 0;
  for (let i = 1; i <= depth; i++) {
    rotate += $fx.randAt(i) * (Math.PI / (depth + 1));
  }
  rotate = rotate % Math.PI;

  // hueShift: linear por geração (exemplo)
  const hueShift = (0.01 * depth) % 1;
  // saturatevar1: evolução suave por geração
  const saturatevar1 = clip(1 + 0.0005 * depth, 1, 1.5);

  // dither/pixelate intensidade evolutiva
  const dithervar = clip(0.002 * depth, 0, 2);
  const pixelatevar = clip(0.002 * depth, 0, 2);
  const modulatevar  = clip(2 - (0.002 * depth), 0, 2);
  // Parâmetros secundários: use cappedIdx para todos os indices "altos"
  const mainSaturate = clip(paramBetween(17, 1, 2), 1, 2.5);
  const hydraSpeed   = Math.min(0.44, paramBetween(18, 0.05, 0.44) + 0.01 * depth);

  const ditherActive = 1; // Sempre ativo!

  const colovar1 = clip(safeRandAt(19), 0, 1);
  const colovar2 = clip(safeRandAt(20), 0, 1);
  const scrollvar1 = clip(safeRandAt(21), 0, 1);
  const scrollvar2 = clip(safeRandAt(22), 0, 1);
  const scrollvar3 = clip(safeRandAt(23), 0, 1);
  const scrollvar4 = clip(safeRandAt(24), 0, 1);
  const noisevar1 = clip(safeRandAt(25), 0, 1);
  const noisevar2 = clip(safeRandAt(26), 0, 1);
  const noisevar3 = clip(safeRandAt(27), 0, 1);
  const noisevar4 = clip(safeRandAt(28), 0, 1);
  const rotatevar1 = clip(safeRandAt(29), 0, 1);
  const rotatevar2 = clip(safeRandAt(30), 0, 1);
  const brickvar3  = clip(safeRandAt(34), 0, 1);


  // Atualize os features expostos
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
  // PATCH HYDRA (NÃO ALTERADO) ----------------------------------------------
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
  )
  ;

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
              .sepia(0.2)
              .hue(1)
          )
          .pixelate(),
        () => Math.abs(Math.sin(time*hydraSpeed) * 0.42 + blendIntensity)
      )
      .add(src(o1)//aqui vamos adicionar o efeito dither com evolute para ficar mais forte a cada geracao
    .modulate(src(o0), blendIntensity*0.051)
      .dither4()//ele nao recebe nenhum parametro
    .luma(0.5,0.9)//aqui temos um filtro para o dither
    ,dithervar)//para o valor apos a virgula

     .add(src(o1)//aqui vamos adicionar o efeito pixelate com evolute para ficar mais forte a cada geracao
    .pixelate(pxMode.x, pxMode.y) //
    .modulate(src(o1), blendIntensity*0.051)
      .dither4()//ele nao recebe nenhum parametro
      .modulate(noise(5000,0.1),0.04*modulatevar)
    .luma(0.5,0.9)//aqui temos um filtro para o pixelate
    ,pixelatevar)




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
          .grawave(0.1*hueShift)
          .sepia(0.3*hueShift)
,
        () => Math.abs(Math.sin(time*hydraSpeed) * 0.42 + blendIntensity)
      )
      .saturate(saturatevar1*0.05+0.95)
      //.sepia(0.1*hueShift)
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
