import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';


const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(100, window.innerWidth / window.innerHeight, 0.1, 50000);


const renderer = new THREE.WebGLRenderer({
    canvas: document.querySelector('canvas.webgl'),
    alpha: true
});
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);

camera.position.set(0, 0, 1500);

renderer.render(scene, camera);

const controls = new OrbitControls(camera, renderer.domElement);

const loader = new GLTFLoader();

let sun = null;

// Load your model
loader.load(
    '/models/sun.glb', // replace with the path to your model file
    function (gltf) {
        // Add the loaded model to the scene
        gltf.scene.scale.set(0.5, 0.5, 0.5);

        sun = gltf.scene;

        scene.add(gltf.scene, new THREE.PointLight(0xffffff, 150, 0, 0.3));
    },
    undefined,
    function (error) {
        console.error(error);
    }
);




const tempLight = new THREE.AmbientLight(0xffffff, 2);
scene.add(tempLight);

let earth = null;
// add plantet
loader.load(
    '/models/earth.glb', // replace with the path to your model file
    function (gltf) {
        // Add the loaded model to the scene
        gltf.scene.scale.set(0.05, 0.05, 0.05);

        earth = gltf.scene;
        earth.position.set(1000, 0, 0);


        scene.add(gltf.scene);
    },
    undefined,
    function (error) {
        console.error(error);
    }
);

// add moon
let moon = null;
loader.load(
    '/models/earth-moon.glb', // replace with the path to your model file
    function (gltf) {
        // Add the loaded model to the scene
        gltf.scene.scale.set(0.01, 0.01, 0.01);

        moon = gltf.scene;
        moon.position.set(1000, 0, 0);


        scene.add(gltf.scene);
    },
    undefined,
    function (error) {
        console.error(error);
    }
);



// add stars
Array(100).fill().forEach(addStar);

function addStar() {
    const star = new THREE.Mesh(new THREE.SphereGeometry(0.5, 25, 25), new THREE.MeshStandardMaterial({ color: 0xffffff }));
    const light = new THREE.PointLight(0xffffff, 2, 0, 0.8);

    // Generate random spherical coordinates
    let radius = Math.random() * 300 + 2000; // radius is not less than 900
    let polarAngle = Math.random() * Math.PI; // polar angle ranges from 0 to PI
    let azimuthalAngle = Math.random() * (2 * Math.PI); // azimuthal angle ranges from 0 to 2PI

    // Convert spherical to Cartesian coordinates
    let x = radius * Math.sin(polarAngle) * Math.cos(azimuthalAngle);
    let y = radius * Math.sin(polarAngle) * Math.sin(azimuthalAngle);
    let z = radius * Math.cos(polarAngle);

    light.position.set(x, y, z);
    star.position.set(x, y, z);
}
let earthAngle = 0;
let moonAngle = 0; 

const animate = function () {
    requestAnimationFrame(animate);

    //rotate the sun

    if (sun) {
        sun.rotation.y += 0.0005;
        
    }

    //make the planet orbit the sun
    if (earth) {
        earth.rotation.y += 0.1;
        earthAngle -= 0.0005;
        earth.position.x = 1000 * Math.cos(earthAngle);
        earth.position.z = 1000 * Math.sin(earthAngle);
    }

    if( moon){
        moon.rotation.y += 0.01;
        moonAngle -= 0.05; 
        moon.position.x = earth.position.x + 75 * Math.cos(moonAngle);
        moon.position.z = earth.position.z + 75 * Math.sin(moonAngle);
    }




    controls.update();

    renderer.render(scene, camera);
}

animate();