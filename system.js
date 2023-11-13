import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';


const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 50000);


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

const tempLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(tempLight);

let earth = null;
// add plantet
loader.load(
    '/models/earth.glb', // replace with the path to your model file
    function (gltf) {
        // Add the loaded model to the scene
        gltf.scene.scale.set(0.05, 0.05, 0.05);

        earth = gltf.scene;
        earth.position.set(5000, 0, 0);


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
        moon.position.set(5000, 0, 0);


        scene.add(gltf.scene);
    },
    undefined,
    function (error) {
        console.error(error);
    }
);

let mercury = null;
loader.load(
    '/models/mercury.glb', 
    function (gltf) {
        // Add the loaded model to the scene
        gltf.scene.scale.set(0.05, 0.05, 0.05);

        mercury = gltf.scene;
        mercury.position.set(1000, 0, 0);
        
        scene.add(gltf.scene);
    },
    undefined,
    function (error) {
        console.error(error);
    }
);

let venus = null;
loader.load(
    '/models/venus.glb',
    function (gltf) {
        // Add the loaded model to the scene
        gltf.scene.scale.set(0.05, 0.05, 0.05);

        venus = gltf.scene;
        venus.position.set(2000, 0, 0);

        scene.add(gltf.scene);
    },
    undefined,
    function (error) {
        console.error(error);
    }
);

let mars = null;
loader.load(
    '/models/mars.glb',
    function(gltf){
        gltf.scene.scale.set(0.05, 0.05, 0.05);

        mars = gltf.scene;
        mars.position.set(4000, 0, 0);

        scene.add(gltf.scene);
    },
    undefined, 
    function(error){
        console.error(error);
    }
);




// add star
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
let mercuryAngle = 0;
let venusAngle = 0;
let marsAngle = 0;

const animate = function () {
    requestAnimationFrame(animate);

    //rotate the sun

    if (sun) {
        sun.rotation.y += 0.00005;
        
    }

    //make the planet orbit the sun
    if (earth) {
        earth.rotation.y += 0.1;
        earthAngle -= 0.002;
        earth.position.x = 3000 * Math.cos(earthAngle);
        earth.position.z = 2700 * Math.sin(earthAngle);
    }

    if( moon){
        moon.rotation.y += 0.01;
        moonAngle -= 0.05; 
        try{
            moon.position.x = earth.position.x + 75 * Math.cos(moonAngle);
            moon.position.z = earth.position.z + 75 * Math.sin(moonAngle);
        }catch{
            console.log("earth not loaded yet");
            console.log("moonPos: ", moon.position.x, " ", moon.position.z);
            moon.position.x = 0 + 75 * Math.cos(moonAngle);
            moon.position.z = 0 + 75 * Math.sin(moonAngle);
        }
        
    }

    if(mercury){
        mercury.rotation.y += 0.03;
        mercuryAngle -= 0.01;
        mercury.position.x = 1000 * Math.cos(mercuryAngle);
        mercury.position.z = 1000 * Math.sin(mercuryAngle);
    }

    if(venus){
        venus.rotation.y += 0.003;
        venusAngle -= 0.004;
        venus.position.x = 2000 * Math.cos(venusAngle);
        venus.position.z = 2000 * Math.sin(venusAngle);
    }  
    
    if(mars){
        mars.rotation.y += 0.009;
        marsAngle -= 0.0019;
        mars.position.x = 4000 * Math.cos(marsAngle);
        mars.position.z = 4000 * Math.sin(marsAngle);
    }




    controls.update();

    renderer.render(scene, camera);
}

animate();