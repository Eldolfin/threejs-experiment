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
floor.receiveShadow = true;

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
sphere.castShadow = true;
cube.castShadow = true;
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
pointLight.visible = false;
pointLight.castShadow = true;
lightGroup.add(pointLight);

// const rectAreaLight = new THREE.RectAreaLight(0x4e00ff, 3, 1, 1);
// lightGroup.add(rectAreaLight);
// rectAreaLight.position.set(-1.5, 0, 1.5);
// rectAreaLight.lookAt(0, 0, 0);

const spotLightGroup = new THREE.Group();
lightGroup.add(spotLightGroup);
const spotLight = new THREE.SpotLight(
  'white',
  0.5,
  10,
  Math.PI * 0.1,
  0.25,
  1,
);
spotLight.castShadow = true;
spotLight.position.set(0, 2, 3);
const spotLightHelper = new THREE.SpotLightHelper(spotLight);
spotLightHelper.visible = false;
spotLightGroup.add(spotLight, spotLightHelper);

/**
 * DEBUG
 */
const transformControls = new TransformControls(camera, canvas);
transformControls.attach(lightGroup);
transformControls.addEventListener('dragging-changed', (event) => {
  // Don't move the camera when moving the transform controls
  orbit.enabled = !event.value;
});
transformControls.visible = false;
transformControls.enabled = false;
scene.add(transformControls);

const gui = new GUI();
gui.close();
gui.add(transformControls, 'visible')
  .name('show helpers')
  .onChange((value: boolean) => {
    transformControls.enabled = value;
    spotLightHelper.visible = value;
  });

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

{
  const spotLightGUI = gui.addFolder('spotLight');
  spotLightGUI.add(spotLightGroup, 'visible').name('enabled');
  spotLightGUI.add(spotLight, 'intensity', 0, 10);
  spotLightGUI.add(spotLight, 'distance', 0, 10);
  spotLightGUI.add(spotLight, 'decay', 1, 10);
  spotLightGUI.add(spotLight, 'angle', 0, Math.PI / 2);
  spotLightGUI.add(spotLight, 'penumbra', 0, 1);
  spotLightGUI.add(spotLight, 'decay', 1, 10);
  spotLightGUI.addColor(spotLight, 'color');
}
