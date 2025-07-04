let hydraFeatures = {};

function hydraPatch() {

  const fxrand = () => $fx.rand();
  const randBetween = (a, b) => fxrand() * (b - a) + a;
  const sample = arr => arr[Math.floor(randBetween(0, arr.length))];
  const powerUp = (base = 1, boost = 2, chance = 0.82) => fxrand() > chance ? boost : base;
  const AR = height / width;


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
  const paletteObj = sample(paletteList);
  const [colorMain, colorAlt, colorTertiary] = paletteObj.colors;


  function pixelateModeFeature() {
    const r = fxrand();
    if (r < 0.1) {
      if (fxrand() > 0.5) {
        return { mode: 'SUPER-PIXEL', x: Math.floor(randBetween(4, 7)), y: Math.floor(randBetween(1, 3)) };
      } else {
        return { mode: 'SUPER-PIXEL', x: Math.floor(randBetween(1, 3)), y: Math.floor(randBetween(4, 7)) };
      }
    } else if (r < 0.5) {
      if (fxrand() > 0.5) {
        return { mode: 'MINI-PIXEL', x: Math.floor(randBetween(150, 250)), y: Math.floor(randBetween(10, 20)) };
      } else {
        return { mode: 'MINI-PIXEL', x: Math.floor(randBetween(10, 20)), y: Math.floor(randBetween(150, 250)) };
      }
    } else {
      let n = Math.floor(randBetween(15, 25));
      let variation1 = Math.floor(fxrand()*5)
      return { mode: 'REGULAR', x: n+variation1, y: n-variation1 };
    }
  }
  const pxMode = pixelateModeFeature();
  const shapeType      = Math.floor(randBetween(3, 10));
  const rotate         = randBetween(0, Math.PI);
  const blendIntensity = randBetween(0.02, 0.2);
  const ditherActive   = 1;
  const mainSaturate   = randBetween(1, 2.5);
  const hydraSpeed     = randBetween(0.05, 0.44);
  const colovar1 = fxrand()
  const colovar2 = fxrand()



  const scrollvar1 = fxrand()
  const scrollvar2 = fxrand()
  const scrollvar3 = fxrand()
  const scrollvar4 = fxrand()

  const noisevar1 = fxrand()
  const noisevar2 = fxrand()
  const noisevar3 = fxrand()
  const noisevar4 = fxrand()

  const rotatevar1 = fxrand()
  const rotatevar2 = fxrand()
  const rotatevar3 = fxrand()

  const brickvar1 = fxrand()
  const brickvar2 = fxrand()
  const brickvar3 = fxrand()
  
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


  let baseShape = shape(shapeType, randBetween(.13, .22), randBetween(.03, .13))
  .color(...colorAlt)
    .mult(noise(Math.floor(randBetween(3, 8)), randBetween(.12, noisevar1*.19), randBetween(.01, noisevar2*.09)).invert())
    .scale(1, AR)
    .rotate(rotate)
    .scroll(
      0, 0,
      (scrollvar1 * .28 + .13) * (scrollvar2 > 0.5 ? 1 : -1),
      (scrollvar2 * .28 + .13) * (scrollvar1 > 0.5 ? 1 : -1)
    )
    .modulateScrollY(
      noise(randBetween(5.5, noisevar4*10.2), randBetween(.11, noisevar3*.19))
        .scale(randBetween(2.1, 5.2), AR, 1, fxrand(), fxrand())
        .brightness(-.43)
        .modulate(noise(randBetween(7.5, noisevar2*13), .5, .22).scale(randBetween(2, 4.9), AR, 1, fxrand(), fxrand()))
    )
    .mult(
      solid()
        .add(noise(randBetween(1.1, noisevar3*2.9), randBetween(.05, noisevar4*.18))
        .rotate(randBetween(-.4, rotatevar1*.4))
        .color(...colorMain))

        // .add(brick(randBetween(1.1, brickvar1*2.9), randBetween(.05, brickvar2*.18))
        // .rotate(randBetween(-.4, rotatevar3*.4))
        // .color(...colorAlt))

        .add(osc(randBetween(1.1, 2.9), randBetween(.05, .18), 0)
        .rotate(randBetween(-.4, rotatevar2*.4))
        .color(...colorTertiary))
    )
    .modulate(noise(randBetween(4.1, noisevar1*7.9), .11).scale(randBetween(2, 5), AR, 1, fxrand(), fxrand()), .33)
    .modulateRotate(brick(randBetween(4.3, brickvar3*7.1), .15).scale(randBetween(2, 5), AR, 1, fxrand(), fxrand()), .13)
    .modulateScrollX(noise(randBetween(6.3, 11), -.12, fxrand()).scale(randBetween(2, 5), AR, 1, fxrand(), fxrand()), .09);

  if (ditherActive) baseShape = baseShape.dither4();
  baseShape.out(o1);

  function feedbackLoop() {
    let flipInvert = fxrand() > .5 ? 1 : 0;
    let pxl = fxrand() > .6 ? height : sample([8, 16, 4, 24, 12]);
    let angle = randBetween(0, Math.PI);
    let repX = Math.floor(randBetween(1, 7));
    let repY = Math.floor(randBetween(1, 7));

    src(o1)
      .add(
        src(o0)
          .modulate(noise(5000, 0.01), () => Math.abs(Math.sin(time*hydraSpeed) * 0.012))
          .scroll(.002 * (scrollvar3 > 0.5 ? 1 : -1) * (scrollvar4 + 1) * AR, .002 * (scrollvar4 > 0.5 ? 1 : -1) * (scrollvar3 + 1) * AR)
        , () => Math.abs(Math.sin(time*hydraSpeed)) * 0.18+0.8)
      .modulateHue(
        src(o0)
          .scroll((scrollvar1 > 0.5 ? 1 : -1) / width, (scrollvar2 > 0.5 ? 1 : -1) / height)
          .pixelate(width / 2, height / 2)
          .saturate(mainSaturate)
          .hue((colovar2 > 0.5 ? 1 : -1) * -randBetween(.011, .028))
          .mask(
            solid()
              .add(noise(randBetween(1, noisevar2*4), randBetween(.07, noisevar3*.21)).thresh(0, 0).invert(flipInvert, pxl, fxrand()), fxrand() < .333 ? 1 : (fxrand() > .666 ? 0 : 0))
              .add(shape(1, 0, 0).invert(flipInvert).rotate(angle).repeat(repX, repY), fxrand() < .333 ? 0 : (fxrand() > .666 ? 1 : 0))
              .add(voronoi(randBetween(.3, 3), randBetween(.02, .13), 0).thresh(.5, 0).invert(flipInvert), fxrand() < .333 ? 0 : (fxrand() > .666 ? 0 : 1))
              .pixelate(pxl / AR, pxl)
              .sepia(colovar2 * 0.2)
              .hue(colovar2 + 1)
          )
          .pixelate(),
        2.3 * AR
      )
      .blend(
        src(o0)
        //
          .modulate(noise(5000, 0.01)
          .dither4(), () => Math.abs(Math.sin(time*hydraSpeed) * 0.02))
          
          .scroll(.002 * (scrollvar4 > 0.5 ? 1 : -1) * (scrollvar3 + 1) * AR, .002 * (scrollvar2 > 0.5 ? 1 : -1) * (scrollvar1 + 1) * AR)
        , 0.4)
      .modulateHue(
        src(o0)
          .scroll((scrollvar1 > 0.5 ? 1 : -1) / width, (scrollvar2 > 0.5 ? 1 : -1) / height)
          .pixelate(width / 2, height / 2)
          .saturate(powerUp() * randBetween(1.3, 2.3))
          .hue((colovar1 > 0.5 ? 1 : -1) * powerUp() * -randBetween(.01, .027))
          .mask(
            solid()
              .add(brick(randBetween(1, 4), randBetween(.09, .21)).thresh(0, 0).invert(1 - flipInvert), fxrand() < .333 ? 1 : (fxrand() > .666 ? 0 : 0))
              .add(shape(2, 0, 0).invert(1 - flipInvert).rotate(angle).repeat(repX, repY), fxrand() < .333 ? 0 : (fxrand() > .666 ? 1 : 0))
              .add(noise(randBetween(.3, noisevar2*3), randBetween(.02, noisevar1*.13)).thresh(.5, 0).invert(1 - flipInvert), fxrand() < .333 ? 0 : (fxrand() > .666 ? 0 : 1))
              .pixelate(pxl / AR, pxl)
              .dither4()
          ),
       () => Math.abs(Math.sin(time*hydraSpeed) * 0.22 +blendIntensity)* AR + 0.2) 
      
      .blend(src(o0)
      .color(...colorMain)
        .pixelate(pxMode.x, pxMode.y)
        .modulate(src(o0),0.01)
        , () => Math.abs(Math.sin(time*hydraSpeed) * 0.22 +blendIntensity))
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
