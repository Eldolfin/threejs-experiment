import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
<canvas class="webgl"></canvas>
`

const canvas = document.querySelector('.webgl')!;


const scene = new THREE.Scene();

const group = new THREE.Group();
scene.add(group);

const colors = ["black", "blue", "white", "red", "black"];


colors.forEach((color, i) => {
  const count = 30;
  const positionsArray = new Float32Array(count * 3 * 3);
  for (let i = 0; i < count * 3 * 3; i++) {
    positionsArray[i] = (Math.random() - 0.5) * 2
  }

  const positionsAttribute = new THREE.BufferAttribute(positionsArray, 3);
  const geometry = new THREE.BufferGeometry()
  geometry.setAttribute("position", positionsAttribute)
  const cube = new THREE.Mesh(
    geometry,
    new THREE.MeshBasicMaterial({ color, wireframe: true }),
  )
  cube.position.x = i * 2 - 2 * Math.floor(colors.length / 2);
  group.add(cube)
})

const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};


const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height);
camera.position.set(0, 1, 5)
scene.add(camera);

const renderer = new THREE.WebGLRenderer({ canvas });
renderer.setClearColor(0x181818)
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true
// controls.enabled = false
controls.update()

window.addEventListener('resize', () => {
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix()

  renderer.setSize(sizes.width, sizes.height);
})

window.addEventListener("dblclick", () => {
  if (!document.fullscreenElement) {
    canvas.requestFullscreen()
  } else {
    document.exitFullscreen()
  }
})

// const clock = new THREE.Clock();

const update = () => {
  window.requestAnimationFrame(update)
  // const elapsedTime = clock.getElapsedTime();
  // const wave = Math.sin(elapsedTime);
  // group.rotation.y = 0.5 * wave;
  // group.rotation.z = 2 * wave;

  // camera.lookAt(group.position)
  controls.update()
  renderer.render(scene, camera)
}

update()
