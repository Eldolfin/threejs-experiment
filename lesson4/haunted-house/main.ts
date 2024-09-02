import * as THREE from 'three';
import { setup3D } from '../common_setup';
import { GUI } from 'lil-gui';

/*
 ** Scene Setup
 */
const fogColor = 0x262837;
let params = {
  onUpdate: (_: number) => {},
  bgColor: fogColor,
};
const { scene, camera } = setup3D(params);
const textureLoader = new THREE.TextureLoader();
const gui = new GUI();

// Textures
const textures = {
  doorColor: textureLoader.load('/textures/door/color.jpg'),
  doorAlpha: textureLoader.load('/textures/door/alpha.jpg'),
  doorAmbientOcculsion: textureLoader.load(
    '/textures/door/ambientOcculsion.jpg',
  ),
  doorHeight: textureLoader.load('/textures/door/height.jpg'),
  doorNormal: textureLoader.load('/textures/door/normal.jpg'),
  doorMetalness: textureLoader.load('/textures/door/metalness.jpg'),
  doorRoughness: textureLoader.load('/textures/door/roughness.jpg'),
};

/**
 * House
 */

// Floor
const floor = new THREE.Mesh(
  new THREE.PlaneGeometry(20, 20),
  new THREE.MeshStandardMaterial({ color: 'lightgreen' }),
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
  new THREE.MeshStandardMaterial({ color: 0xFFF21010 }),
);
roof.rotation.y = Math.PI / 4;
roof.position.y += wallsHeight + roofHeight / 2;
houseGroup.add(roof);

const doorHeight = 2;
const door = new THREE.Mesh(
  new THREE.PlaneGeometry(1, doorHeight),
  new THREE.MeshStandardMaterial({
    map: textures.doorColor,
    alphaMap: textures.doorAlpha,
    aoMap: textures.doorAmbientOcculsion,
    roughnessMap: textures.doorRoughness,
    metalnessMap: textures.doorMetalness,
  }),
);
door.position.y = 1;
door.position.z = 2 + 0.001;
houseGroup.add(door);

const bushGeometry = new THREE.SphereGeometry(1, 16, 16);
const bushMaterial = new THREE.MeshStandardMaterial({ color: 'green' });

const bush1 = new THREE.Mesh(bushGeometry, bushMaterial);
bush1.position.set(0.8, 0.2, 2.2);
bush1.scale.setScalar(0.5);

const bush2 = new THREE.Mesh(bushGeometry, bushMaterial);
bush2.position.set(1.4, 0.1, 2.1);
bush2.scale.setScalar(0.25);

const bush3 = new THREE.Mesh(bushGeometry, bushMaterial);
bush3.position.set(-0.8, 0.1, 2.2);
bush3.scale.setScalar(0.4);

const bush4 = new THREE.Mesh(bushGeometry, bushMaterial);
bush4.position.set(-1, 0.15, 2.6);
bush4.scale.setScalar(0.15);

houseGroup.add(bush1, bush2, bush3, bush4);

// Graves
const graves = new THREE.Group();
scene.add(graves);

const graveGeometry = new THREE.BoxGeometry(0.6, 1, 0.2);
const graveMaterial = new THREE.MeshStandardMaterial({ color: 0xb2b6b1 });
const MIN_GRAVE_DIST = 3;
const MAX_GRAVE_DIST = 9;
const GRAVES_COUNT = 20;

for (let i = 0; i < GRAVES_COUNT; i++) {
  const angle = Math.random() * Math.PI * 2;
  const distance = Math.random() * (MAX_GRAVE_DIST - MIN_GRAVE_DIST) +
    MIN_GRAVE_DIST;
  const x = Math.sin(angle) * distance;
  const z = Math.cos(angle) * distance;

  const grave = new THREE.Mesh(graveGeometry, graveMaterial);
  grave.position.set(x, 0.3, z);
  grave.rotateY(Math.random() * Math.PI * 2);
  grave.rotateZ(Math.random() * 0.4);

  graves.add(grave);
}

// Door light
const doorLight = new THREE.PointLight(0xff7d46, 1, 7);
doorLight.position.set(0, 2.2, 2.7);
houseGroup.add(doorLight);

// fog
scene.fog = new THREE.Fog(fogColor, 1, 15);

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

// params.onUpdate = (elapsedTime: number) => {
// };
