import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import GUI from 'lil-gui';
import gsap from 'gsap';

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
<canvas class="webgl"></canvas>
`

const params = {
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
scene.add(group);

const colors = ["blue", "white", "red"];
const meshes: THREE.MeshBasicMaterial[] = [];

function createShapes() {
  group.clear()
  meshes.length = 0;
  colors.forEach((color, i) => {
    const count = params.shapeComplexity;
    const positionsArray = new Float32Array(count * 3 * 3);
    for (let i = 0; i < count * 3 * 3; i++) {
      positionsArray[i] = (Math.random() - 0.5) * 2
    }

    const positionsAttribute = new THREE.BufferAttribute(positionsArray, 3);
    const geometry = new THREE.BufferGeometry()
    geometry.setAttribute("position", positionsAttribute)
    const material = new THREE.MeshBasicMaterial({ color, wireframe: params.wireframe });
    meshes.push(material)
    const cube = new THREE.Mesh(
      geometry,
      material,
    )
    cube.position.x = i * 2 - 2 * Math.floor(colors.length / 2);
    group.add(cube)
  })
}
createShapes()

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
