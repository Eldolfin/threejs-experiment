import * as THREE from 'three';
import { setup3D } from './common_setup';
import { TransformControls } from 'three/examples/jsm/Addons.js';
import { GUI } from 'lil-gui';

const { scene, camera, canvas, orbit } = setup3D({});

const material = new THREE.MeshStandardMaterial();

const floor = new THREE.Mesh(
  new THREE.PlaneGeometry(),
  material,
);

floor.position.set(0, -1, 0);
floor.rotation.x = -Math.PI / 2;
floor.scale.set(10, 10, 1);

scene.add(floor);

const sphere = new THREE.Mesh(
  new THREE.SphereGeometry(0.5),
  material,
);
const cube = new THREE.Mesh(
  new THREE.BoxGeometry(),
  material,
);
cube.position.set(1, 0, 0);
sphere.position.set(-1, 0, 0);
scene.add(sphere, cube);

// scene.add(
//   new THREE.AmbientLight(0xffffff, 0.5),
// );

// const directionalLight = new THREE.DirectionalLight(0x00ffff, 0.5);
// directionalLight.position.set(1, 0.25, 0);
// scene.add(directionalLight);

// const hemisphereLight = new THREE.HemisphereLight(0xff00000, 0x0000ff, 3);
// const hemisphereLightHelper = new THREE.HemisphereLightHelper(
//   hemisphereLight,
//   0.3,
// );
// scene.add(hemisphereLight, hemisphereLightHelper);

const pointLight = new THREE.PointLight(0xffffff, 3, 10);
const pointLightHelper = new THREE.PointLightHelper(pointLight, 0.1);
pointLight.position.set(0, 1, 0);
const transformControls = new TransformControls(camera, canvas);
transformControls.attach(pointLight);
transformControls.addEventListener('dragging-changed', (event) => {
  orbit.enabled = !event.value;
});

scene.add(pointLight, pointLightHelper, transformControls);

/**
 * DEBUG GUI
 */
const gui = new GUI();
gui.add(pointLight, 'intensity', 0, 10);
gui.add(pointLight, 'distance', 0, 10);
gui.add(pointLight, 'decay', 1, 10);
gui.addColor(pointLight, 'color');
