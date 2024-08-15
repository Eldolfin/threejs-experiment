import * as THREE from 'three';
import { setup3D } from '../common_setup';
import { GUI } from 'lil-gui';

/*
 ** Scene Setup
 */
let params = {
  onUpdate: (_: number) => {},
};
const { scene, camera } = setup3D(params);
const textureLoader = new THREE.TextureLoader();
const gui = new GUI();

/**
 * House
 */

// Floor
const floor = new THREE.Mesh(
  new THREE.PlaneGeometry(20, 20),
  new THREE.MeshStandardMaterial(),
);
floor.rotation.x = -Math.PI / 2;
scene.add(floor);

const houseGroup = new THREE.Group();
scene.add(houseGroup);

const wallsHeight = 2.5;
const walls = new THREE.Mesh(
  new THREE.BoxGeometry(4, wallsHeight, 4),
  new THREE.MeshStandardMaterial(),
);
walls.position.y += wallsHeight / 2;
houseGroup.add(walls);

const roofHeight = 1.5;
const roof = new THREE.Mesh(
  new THREE.ConeGeometry(3.5, roofHeight, 4),
  new THREE.MeshStandardMaterial(),
);
roof.rotation.y = Math.PI / 4;
roof.position.y += wallsHeight + roofHeight / 2;
houseGroup.add(roof);

const doorHeight = 2;
const door = new THREE.Mesh(
  new THREE.PlaneGeometry(1, doorHeight),
  new THREE.MeshStandardMaterial({ color: 'yellow' }),
);
door.position.y = 1;
door.position.z = 2 + 0.001;
houseGroup.add(door);

/**
 * Lights
 */
// Ambient light
const ambientLight = new THREE.AmbientLight('#ffffff', 0.5);
gui.add(ambientLight, 'intensity').min(0).max(1).step(0.001);
scene.add(ambientLight);

// Directional light
const moonLight = new THREE.DirectionalLight('#ffffff', 0.5);
moonLight.position.set(4, 5, -2);
gui.add(moonLight, 'intensity').min(0).max(1).step(0.001);
gui.add(moonLight.position, 'x').min(-5).max(5).step(0.001);
gui.add(moonLight.position, 'y').min(-5).max(5).step(0.001);
gui.add(moonLight.position, 'z').min(-5).max(5).step(0.001);
scene.add(moonLight);

/**
 * Sizes
 */

camera.position.x = 4;
camera.position.y = 2;
camera.position.z = 5;

/**
 * Animate
 */

params.onUpdate = (elapsedTime: number) => {
};
