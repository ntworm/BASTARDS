import { hydraPatch, hydraFeatures } from './hydraPatch.js';

let hydra;
function fxReady(cb) {
  if (window.$fx && $fx.hash && $fx.lineage) {
    cb();
  } else {
    setTimeout(() => fxReady(cb), 20);
  }
}

function setup() {
  if (document.getElementById('hydracanvas')) return;

  // Detecta modo de captura FXHash
  const isFxCapture = window.$fx && $fx.capture;

  // Define resolução: 2000x2000 para captura, tela física para uso normal
  const canvasWidth = isFxCapture ? 2000 : window.screen.width;
  const canvasHeight = isFxCapture ? 2000 : window.screen.height;

  // Cria container da janela
  const container = document.createElement('div');
  container.id = 'hydra-viewport';
  Object.assign(container.style, {
    position: 'fixed',
    top: '0', left: '0',
    width: '100vw', height: '100vh',
    overflow: 'hidden',
    margin: '0', padding: '0',
    zIndex: '0',
    background: '#000',
    outline: 'none',
    border: 'none'
  });
  document.body.style.margin = '0';
  document.body.style.padding = '0';
  document.body.style.overflow = 'hidden';
  document.body.style.background = '#000';
  document.documentElement.style.background = '#000';
  document.body.appendChild(container);

  // Cria o canvas
  const canvas = document.createElement('canvas');
  canvas.id = 'hydracanvas';
  canvas.width = canvasWidth;
  canvas.height = canvasHeight;
  canvas.style.position = 'absolute';
  canvas.style.top = '0';
  canvas.style.left = '0';
  canvas.style.margin = '0';
  canvas.style.padding = '0';
  canvas.style.pointerEvents = 'none';
  canvas.style.outline = 'none';
  canvas.style.border = 'none';

  // PREENCHE SEMPRE 100% DA ABA (sem manter proporção!)
  canvas.style.width = "100vw";
  canvas.style.height = "100vh";
  canvas.style.transform = ""; // nenhuma transformação, só preenchimento total

  container.appendChild(canvas);

  hydra = new Hydra({
    detectAudio: false,
    canvas: canvas,
  });

  hydra.setResolution(canvasWidth, canvasHeight);

  fxReady(() => {
    if (isFxCapture) {
      setTimeout(() => {
        render();
        $fx.preview();
      }, 5000); // timeout para garantir renderização FXHash
    } else {
      render();
    }
  });
}

function render() {
  hydraPatch();
  $fx.features(hydraFeatures);
}

export { setup, render };
