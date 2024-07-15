import * as THREE from 'three';
import { setup3D } from './common_setup';
import { TransformControls } from 'three/examples/jsm/Addons.js';
import { GUI } from 'lil-gui';

/*
 ** Scene Setup
 */
const { scene, camera, canvas, orbit } = setup3D({});

/*
 ** Shapes
 */
const material = new THREE.MeshStandardMaterial();

const floor = new THREE.Mesh(
  new THREE.PlaneGeometry(),
  material,
);

floor.position.set(0, -1, 0);
floor.rotation.x = -Math.PI / 2;
floor.scale.set(10, 10, 1);

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
scene.add(sphere, cube, floor);

/*
 ** Lights
 */

const lightGroup = new THREE.Group();
lightGroup.position.y = 1;
scene.add(lightGroup);

const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
ambientLight.visible = false;
lightGroup.add(
  ambientLight,
);

// const directionalLight = new THREE.DirectionalLight(0x00ffff, 0.5);
// lightGroup.add(directionalLight);

const hemisphereLight = new THREE.HemisphereLight(0xff00000, 0x0000ff, 3);
hemisphereLight.visible = false;
lightGroup.add(hemisphereLight);

const pointLight = new THREE.PointLight(0xf5e056, 3, 10);
lightGroup.add(pointLight);

/**
 * DEBUG
 */
const transformControls = new TransformControls(camera, canvas);
transformControls.mode = 'translate';
transformControls.attach(lightGroup);
transformControls.addEventListener('dragging-changed', (event) => {
  // Don't move the camera when moving the transform controls
  orbit.enabled = !event.value;
});
scene.add(transformControls);

const gui = new GUI();

{
  const ambientLightGUI = gui.addFolder('ambientLight');
  ambientLightGUI.add(ambientLight, 'visible').name('enabled');
  ambientLightGUI.add(ambientLight, 'intensity', 0, 3);
}

{
  const hemisphereLightGUI = gui.addFolder('hemisphereLight');
  hemisphereLightGUI.add(hemisphereLight, 'visible').name('enabled');
  hemisphereLightGUI.add(hemisphereLight, 'intensity', 0, 3);
}

{
  const pointLightGUI = gui.addFolder('pointLight');
  pointLightGUI.add(pointLight, 'visible').name('enabled');
  pointLightGUI.add(pointLight, 'intensity', 0, 10);
  pointLightGUI.add(pointLight, 'distance', 0, 10);
  pointLightGUI.add(pointLight, 'decay', 1, 10);
  pointLightGUI.addColor(pointLight, 'color');
}
