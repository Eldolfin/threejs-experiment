import * as THREE from 'three';
import { Config } from './config';

export const colors = ["blue", "white", "red"];
export const meshes: THREE.MeshBasicMaterial[] = [];

export function createShapes(group: THREE.Group, params: Config) {
  group.clear();
  meshes.length = 0;
  colors.forEach((color, i) => {
    const count = params.shapeComplexity;
    const positionsArray = new Float32Array(count * 3 * 3);
    for (let i = 0; i < count * 3 * 3; i++) {
      positionsArray[i] = (Math.random() - 0.5) * 2;
    }

    const positionsAttribute = new THREE.BufferAttribute(positionsArray, 3);
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", positionsAttribute);
    const material = new THREE.MeshBasicMaterial({ color, wireframe: params.wireframe });
    meshes.push(material);
    const cube = new THREE.Mesh(
      geometry,
      material
    );
    cube.position.x = i * 2 - 2 * Math.floor(colors.length / 2);
    group.add(cube);
  });
}
