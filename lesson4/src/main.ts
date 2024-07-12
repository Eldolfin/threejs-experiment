import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import GUI from 'lil-gui';
import gsap from 'gsap';
import { Config } from './config';
import { createShapes, meshes } from './createShapes';
import { getRandomInt } from './utils';

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
const cubeTextureLoader = new THREE.CubeTextureLoader(loadingManager);

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

const doorColorTexture = textureLoader.load('/textures/door/color.jpg');
const doorAlphaTexture = textureLoader.load('/textures/door/alpha.jpg');
const doorAmbientOcclusionTexture = textureLoader.load('/textures/door/ambientOcclusion.jpg');
const doorHeightTexture = textureLoader.load('/textures/door/height.jpg');
const doorNormalTexture = textureLoader.load('/textures/door/normal.jpg');
const doorMetalnessTexture = textureLoader.load('/textures/door/metalness.jpg');
const doorRoughnessTexture = textureLoader.load('/textures/door/roughness.jpg');
const gradientTexture = textureLoader.load('/textures/gradients/5.jpg');

const envMapPrefix = `/static/textures/environmentMaps/${getRandomInt(0, 3)}/`;
const environmentMapTexture = cubeTextureLoader.load([
  envMapPrefix + 'px.jpg',
  envMapPrefix + 'nx.jpg',
  envMapPrefix + 'py.jpg',
  envMapPrefix + 'ny.jpg',
  envMapPrefix + 'pz.jpg',
  envMapPrefix + 'nz.jpg',
])
gradientTexture.minFilter = THREE.NearestFilter
gradientTexture.magFilter = THREE.NearestFilter
gradientTexture.generateMipmaps = false

const doorMaterial = new THREE.MeshStandardMaterial({
  map: doorColorTexture,
  alphaMap: doorAlphaTexture,
  aoMap: doorAmbientOcclusionTexture,
  transparent: true,
  normalMap: doorNormalTexture,
  side: THREE.DoubleSide,
  displacementMap: doorHeightTexture,
  displacementScale: 0.05,
  roughnessMap: doorRoughnessTexture,
  metalnessMap: doorMetalnessTexture,
  envMap: environmentMapTexture,
});
doorMaterial.normalMap = doorNormalTexture

const metalMaterial = new THREE.MeshStandardMaterial({
  envMap: environmentMapTexture,
  metalness: 1,
  roughness: 0,
});
const sphere = new THREE.Mesh(
  new THREE.SphereGeometry(0.5, 64, 64),
  doorMaterial
)
sphere.position.x = -1.5
const plane = new THREE.Mesh(
  new THREE.PlaneGeometry(1, 1, 64, 64),
  doorMaterial
)
const torus = new THREE.Mesh(
  new THREE.TorusGeometry(0.3, 0.2, 64, 128),
  doorMaterial
)
torus.position.x = 1.5
scene.add(sphere, plane, torus)

const metalSphere = new THREE.Mesh(
  new THREE.SphereGeometry(0.5),
  metalMaterial,
);
metalSphere.position.set(0, 2, -2)
scene.add(metalSphere)

// useless ?
// plane.geometry.setAttribute("uv2", new THREE.BufferAttribute(plane.geometry.attributes.uv.array, 2));
// sphere.geometry.setAttribute("uv2", new THREE.BufferAttribute(sphere.geometry.attributes.uv.array, 2));
// torus.geometry.setAttribute("uv2", new THREE.BufferAttribute(torus.geometry.attributes.uv.array, 2));

const ambientLight = new THREE.AmbientLight("white", 0.5);
scene.add(ambientLight)

const pointLight = new THREE.PointLight(0xffffff, 50);
pointLight.position.set(2, 3, 4);
scene.add(pointLight)

scene.background = environmentMapTexture

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
  .onChange(() => createShapes(group, params))

gui.add(params, 'spin')
gui.add(params, 'shapeComplexity')
  .min(3)
  .max(300)
  .step(1)
  .onChange(() => createShapes(group, params))


gui.add(camera, 'fov')
  .min(10)
  .max(180)
  .onChange(() => camera.updateProjectionMatrix())
const colorsGUI = gui.addFolder('Colors').open(false)
meshes.forEach((m, i) =>
  colorsGUI.addColor(m, 'color')
    .name(`Cube ${i} color`)
)

const doorGUI = gui.addFolder("door shapes")

doorGUI.add(doorMaterial, 'aoMapIntensity', 0, 10)
doorGUI.add(doorMaterial, 'displacementScale', 0, 1)
doorGUI.add(doorMaterial.normalScale, 'x', 0, 5)
  .name("normal scale")
  .onChange((v: number) => doorMaterial.normalScale.set(v, v))

const metalGUI = gui.addFolder("Metal sphere")

metalGUI.add(metalMaterial, "metalness", 0, 1)
metalGUI.add(metalMaterial, "roughness", 0, 1)
