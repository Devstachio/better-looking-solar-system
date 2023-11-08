import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';


const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 2000);

const canvas = document.querySelector('canvas.webgl')

const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true
});
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);

camera.position.set(0, 0, 20);

renderer.render(scene, camera);

const controls = new OrbitControls(camera, renderer.domElement);

const testMesh = new THREE.MeshLambertMaterial({ color: 0xf9d71c });

testMesh.emissive.setHex(0xf9d71c);

const loader = new GLTFLoader();

let sun = null;

// Load your model
loader.load(
    '/models/sun.glb', // replace with the path to your model file
    function (gltf) {
        // Add the loaded model to the scene
        gltf.scene.scale.set(0.005, 0.005, 0.005);

        const sunLight = new THREE.PointLight(0xffffff, 100, 100, 0.5);

        sunLight.position.set(0, 0, 0);

        sun = gltf.scene;

        scene.add(gltf.scene, sunLight);
    },
    undefined,
    function (error) {
        console.error(error);
    }
);




const tempLight = new THREE.AmbientLight(0xffffff, 1);
scene.add(tempLight);

let earth = null;
// add plantet
loader.load(
    '/models/earth.glb', // replace with the path to your model file
    function (gltf) {
        // Add the loaded model to the scene
        gltf.scene.scale.set(0.00004587155963, 0.00004587155963, 0.00004587155963);

        earth = gltf.scene;
        earth.position.set(0, 0, 10);


        scene.add(gltf.scene);
    },
    undefined,
    function (error) {
        console.error(error);
    }
);

//adds 4 rings to planet
const ring1 = new THREE.Mesh(new THREE.TorusGeometry(0.8, 0.05, 3, 100), new THREE.MeshStandardMaterial({ color: 0xffffff, transparent: true, opacity: 0.2 }));
ring1.position.set(0, 0, 10);
ring1.rotation.x = 1.5;

const ring2 = new THREE.Mesh(new THREE.TorusGeometry(0.8, 0.05, 3, 100), new THREE.MeshStandardMaterial({ color: 0xffffff, transparent: true, opacity: 0.2 }));
ring2.position.set(0, 0, 10);
ring2.rotation.x = 0.8;

const ring3 = new THREE.Mesh(new THREE.TorusGeometry(0.8, 0.05, 3, 100), new THREE.MeshStandardMaterial({ color: 0xffffff, transparent: true, opacity: 0.2 }));
ring3.position.set(0, 0, 10);
ring3.rotation.x = -0.8;

const ring4 = new THREE.Mesh(new THREE.TorusGeometry(0.8, 0.05, 3, 100), new THREE.MeshStandardMaterial({ color: 0xffffff, transparent: true, opacity: 0.2 }));
ring4.position.set(0, 0, 10);

//scene.add(ring1, ring2, ring3, ring4);

// add moon
const moon = new THREE.Mesh(new THREE.SphereGeometry(0.2, 25, 25), new THREE.MeshStandardMaterial({ color: 0xff0000 }));
moon.position.set(0, 0, 11.3);
//scene.add(moon);

// add moon orbit





// add stars
Array(100).fill().forEach(addStar);

function addStar() {
    const star = new THREE.Mesh(new THREE.SphereGeometry(0.2, 25, 25), new THREE.MeshStandardMaterial({ color: 0xffffff }));
    const light = new THREE.PointLight(0xffffff, 2, 0, 1);

    // Generate random spherical coordinates
    let radius = Math.random() * 300 + 300; // radius is not less than 200
    let polarAngle = Math.random() * Math.PI; // polar angle ranges from 0 to PI
    let azimuthalAngle = Math.random() * (2 * Math.PI); // azimuthal angle ranges from 0 to 2PI

    // Convert spherical to Cartesian coordinates
    let x = radius * Math.sin(polarAngle) * Math.cos(azimuthalAngle);
    let y = radius * Math.sin(polarAngle) * Math.sin(azimuthalAngle);
    let z = radius * Math.cos(polarAngle);

    light.position.set(x, y, z);
    star.position.set(x, y, z);
    scene.add(star, light);
}

const animate = function () {
    requestAnimationFrame(animate);

    //rotate the sun

    if (sun) {
        sun.rotation.y += 0.001;
        
    }

    //make the planet orbit the sun
    if (earth) {
        earth.rotation.y += 0.005;
        // earth.position.x = 10 * Math.cos(earth.rotation.y);
        // earth.position.z = 10 * Math.sin(earth.rotation.y);
    }




    controls.update();

    renderer.render(scene, camera);
}

animate();