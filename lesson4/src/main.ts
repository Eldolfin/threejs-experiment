import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import GUI from 'lil-gui';
import gsap from 'gsap';
import { Config } from './config';
import { createShapes, meshes } from './createShapes';

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
<canvas class="webgl"></canvas>
`

export const params: Config = {
  doubleClickToggleFullscreen: false,
  spin: () => {
    gsap.to(group.rotation, { y: group.rotation.y + 2 * Math.PI })
  },
  shapeComplexity: 30,
  wireframe: true,
}
const canvas = document.querySelector('.webgl')!;

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x181818)

const group = new THREE.Group();
group.position.z = -5
scene.add(group);

createShapes(group, params);

const loadingManager = new THREE.LoadingManager(
  undefined,
  (_url, loaded, total) => console.log(`Loading: ${loaded}/${total}`),
  (url) => console.error(`failed to load texture: ${url}`)
);
const textureLoader = new THREE.TextureLoader(loadingManager);
const texture = textureLoader.load('/textures/minecraft.png');
texture.minFilter = THREE.NearestFilter
texture.magFilter = THREE.NearestFilter
texture.generateMipmaps = false
const cube = new THREE.Mesh(
  new THREE.BoxGeometry(),
  new THREE.MeshBasicMaterial({
    map: texture,
  }),
)
cube.position.z = -2
scene.add(cube)

// const doorColorTexture = textureLoader.load('/textures/door/color.jpg');
// const doorAlphaTexture = textureLoader.load('/textures/door/alpha.jpg');
// const doorAmbientOcclusionTexture = textureLoader.load('/textures/door/ambientOcclusion.jpg');
// const doorHeightTexture = textureLoader.load('/textures/door/height.jpg');
// const doorNormalTexture = textureLoader.load('/textures/door/normal.jpg');
// const doorMetalnessTexture = textureLoader.load('/textures/door/metalness.jpg');
// const doorRoughnessTexture = textureLoader.load('/textures/door/roughness.jpg');
// const matcapTexture = textureLoader.load('/textures/matcaps/1.png');
// const gradientTexture = textureLoader.load('/textures/matcaps/3.png');

const material = new THREE.MeshBasicMaterial();

const sphere = new THREE.Mesh(
  new THREE.SphereGeometry(0.5),
  material
)
sphere.position.x = -1.5
const plane = new THREE.Mesh(
  new THREE.PlaneGeometry(1, 1),
  material
)
const torus = new THREE.Mesh(
  new THREE.TorusGeometry(0.3, 0.2, 16, 32),
  material
)
torus.position.x = 1.5
scene.add(sphere, plane, torus)

const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};


const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height);
camera.position.set(0, 1, 5)
scene.add(camera);

const renderer = new THREE.WebGLRenderer({ canvas });
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
  if (!params.doubleClickToggleFullscreen) return;
  if (!document.fullscreenElement) {
    canvas.requestFullscreen()
  } else {
    document.exitFullscreen()
  }
})

const clock = new THREE.Clock();

const update = () => {
  window.requestAnimationFrame(update)
  const elapsedTime = clock.getElapsedTime();
  // const wave = Math.sin(elapsedTime);
  // group.rotation.y = 0.5 * wave;
  // group.rotation.z = 2 * wave;

  sphere.rotation.y = elapsedTime * 0.1
  plane.rotation.y = elapsedTime * 0.1
  torus.rotation.y = elapsedTime * 0.1

  sphere.rotation.x = elapsedTime * 0.15
  plane.rotation.x = elapsedTime * 0.15
  torus.rotation.x = elapsedTime * 0.15

  // camera.lookAt(group.position)
  controls.update()
  renderer.render(scene, camera)
}

update()

// #### DEBUG ####
const gui = new GUI();
gui.add(document, 'title')
gui.add(params, 'doubleClickToggleFullscreen')
gui
  .add(group.position, 'y')
  .min(-3)
  .max(3)
  .step(0.1)
  .name('group elevation')

gui
  .add(group, 'visible')

gui.add(params, 'wireframe')
  .onChange(createShapes)

gui.add(params, 'spin')
gui.add(params, 'shapeComplexity')
  .min(3)
  .max(300)
  .step(1)
  .onChange(createShapes)


gui.addColor(scene, 'background')
  .name("background color")

gui.add(camera, 'fov')
  .min(10)
  .max(180)
  .onChange(() => camera.updateProjectionMatrix())
const colorsGUI = gui.addFolder('Colors')
meshes.forEach((m, i) =>
  colorsGUI.addColor(m, 'color')
    .name(`Cube ${i} color`)
)
