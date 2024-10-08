import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { Timer } from 'three/addons/misc/Timer.js';

export const setup3D = (
  params: {
    onUpdate?: (elapsedTime: number) => void;
    bgColor: THREE.ColorRepresentation;
  },
) => {
  document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
<canvas class="webgl"></canvas>
`;
  const sizes = {
    width: window.innerWidth,
    height: window.innerHeight,
  };

  window.addEventListener('resize', () => {
    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight;

    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix();

    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  });

  const scene = new THREE.Scene();

  const canvas = document.querySelector<HTMLCanvasElement>('.webgl')!;
  const renderer = new THREE.WebGLRenderer({
    canvas,
  });

  renderer.shadowMap.enabled = true;
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setClearColor(params.bgColor);

  const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height);
  camera.position.set(0, 1, 5);
  scene.add(camera);

  const orbit = new OrbitControls(camera, renderer.domElement);
  orbit.enableDamping = true;
  orbit.update();

  const timer = new Timer();
  const update = () => {
    timer.update();
    const elapsedTime = timer.getElapsed();
    window.requestAnimationFrame(update);
    orbit.update();

    if (params.onUpdate) {
      params.onUpdate(elapsedTime);
    }

    renderer.render(scene, camera);
  };

  update();

  return {
    scene,
    camera,
    renderer,
    canvas,
    orbit,
  };
};
