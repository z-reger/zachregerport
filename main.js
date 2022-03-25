import './style.css'

import * as THREE from 'three';
// import dat from "three-dat.gui";
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import gsap from 'gsap';
// GUI controls
// const gui = new dat.GUI()
const world = {
  plane: {
    width: 19,
    height: 19,
    widthSegments: 17,
    heightSegments: 17
  }
}

function generatePlane() {
  planeMesh.geometry.dispose()
  planeMesh.geometry = new THREE.PlaneGeometry(world.plane.width, world.plane.height, world.plane.widthSegments, world.plane.heightSegments);

  const { array } = planeMesh.geometry.attributes.position;

  for (let i = 0; i < array.length; i += 3) {
    const x = array[i]
    const y = array[i + 1]
    const z = array[i + 2]

    array[i + 2] = z + Math.random()
    const colors = []
    for (let i = 0; i < planeMesh.geometry.attributes.position.count; i++) {
      colors.push(0, .19, .4)
    }
    planeMesh.geometry.setAttribute('color', new THREE.BufferAttribute(new Float32Array(colors), 3))
  }
}
// gui.add(world.plane, 'width', 1, 50).onChange(generatePlane);
// gui.add(world.plane, 'height', 1, 50).onChange(generatePlane);
// gui.add(world.plane, 'widthSegments', 1, 50).onChange(generatePlane);
// gui.add(world.plane, 'heightSegments', 1, 50).onChange(generatePlane);
// Calling imports
const raycaster = new THREE.Raycaster();
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, innerWidth / innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();

renderer.setSize(innerWidth, innerHeight);
document.body.appendChild(renderer.domElement);
renderer.setPixelRatio(devicePixelRatio);

new OrbitControls(camera, renderer.domElement);
camera.position.z = 5
// Creating a Plane
const planeGeometry = new THREE.PlaneGeometry(world.plane.width, world.plane.height, world.plane.widthSegments, world.plane.heightSegments);
const planeMaterial = new THREE.MeshPhongMaterial({ side: THREE.DoubleSide, flatShading: THREE.FlatShading, vertexColors: true });
const planeMesh = new THREE.Mesh(planeGeometry, planeMaterial);
scene.add(planeMesh);

// Vertice position randomization
const { array } = planeMesh.geometry.attributes.position;
for (let i = 0; i < array.length; i += 3) {
  const x = array[i]
  const y = array[1 + 1]
  const z = array[i + 2]

  array[i + 2] = z + Math.random()
}

// background
const spaceTexture = new THREE.TextureLoader().load('space.jpg');
scene.background = spaceTexture;



// color attribute addition
const colors = []
for (let i = 0; i < planeMesh.geometry.attributes.position.count; i++) {
  colors.push(0, .19, .4)
}

planeMesh.geometry.setAttribute('color', new THREE.BufferAttribute(new Float32Array(colors), 3))
//  lighting of the plane
const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(0, 0, 1)
scene.add(light);

const backLight = new THREE.DirectionalLight(0xffffff, 1);
backLight.position.set(0, 0, -1)
scene.add(backLight);

const starGeometry = new THREE.BufferGeometry()
const starMaterial = new THREE.PointsMaterial({
  color: 0xffffff
})
const starVerticies = []
for (let i = 0; i < 2000; i++) {
  const x = (Math.random() - 0.5) * 2000
  const y = (Math.random() - 0.5) * 2000
  const z = (Math.random() - 0.5) * 2000
  starVerticies.push(x, y, z)
}
starGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starVerticies, 3))
const stars = new THREE.Points(starGeometry, starMaterial)
scene.add(stars)

const mouse = {
  x: undefined,
  y: undefined
}
//  animate function
function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
  planeMesh.rotation.x -= 0.001
  planeMesh.rotation.y -= 0.001
  raycaster.setFromCamera(mouse, camera)
  const intersects = raycaster.intersectObject(planeMesh)
  if (intersects.length > 0) {
    const { color } = intersects[0].object.geometry.attributes
    // vertice 1
    color.setX(intersects[0].face.a, 0.1)
    color.setY(intersects[0].face.a, 0.5)
    color.setZ(intersects[0].face.a, 1)
    // vertice 2
    color.setX(intersects[0].face.b, 0.1)
    color.setY(intersects[0].face.b, 0.5)
    color.setZ(intersects[0].face.b, 1)
    // verice 3
    color.setX(intersects[0].face.c, 0.1)
    color.setY(intersects[0].face.c, 0.5)
    color.setZ(intersects[0].face.c, 1)

    intersects[0].object.geometry.attributes.color.needsUpdate = true

    const initialColor = {
      r: 0,
      g: .19,
      b: .4
    }
    const hoverColor = {
      r: 0.1,
      g: .5,
      b: 1
    }
    gsap.to(hoverColor, {
      r: initialColor.r,
      g: initialColor.g,
      b: initialColor.b,
      onUpdate: () => {
        // vertice 1
        color.setX(intersects[0].face.a, hoverColor.r)
        color.setY(intersects[0].face.a, hoverColor.g)
        color.setZ(intersects[0].face.a, hoverColor.b)
        // vertice 2
        color.setX(intersects[0].face.b, hoverColor.r)
        color.setY(intersects[0].face.b, hoverColor.g)
        color.setZ(intersects[0].face.b, hoverColor.b)
        // verice 3
        color.setX(intersects[0].face.c, hoverColor.r)
        color.setY(intersects[0].face.c, hoverColor.g)
        color.setZ(intersects[0].face.c, hoverColor.b)
        color.neddsUpdate = true
      }
    })
  }

  stars.rotation.x += 0.0004

}

animate();

addEventListener('mousemove', (event) => {
  mouse.x = (event.clientX / innerWidth) * 2 - 1
  mouse.y = -(event.clientY / innerHeight) * 2 + 1
  // console.log(mouse)
})



// document.querySelector