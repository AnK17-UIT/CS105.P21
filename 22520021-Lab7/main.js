import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

function init() {
    const scene = new THREE.Scene();
    const gui = new dat.GUI();

    // Thiết lập fog
    const enableFog = true;
    if (enableFog) {
        scene.fog = new THREE.FogExp2(0xffffff, 0.01);
    }

    const planeMaterial = getMaterial('standard', 0xfdfdfd);
    const plane = getPlane(planeMaterial, 300);

    const sphereMaterial = getMaterial('standard', 0xfdfdfd);
    const sphere = getSphere(sphereMaterial, 0.2, 32);

    const boxMaterial = getMaterial('standard', 0xfdfdfd);
    const box = getBox(boxMaterial, 1, 1, 1);

    // Định nghĩa các loại ánh sáng
    const spotlight = getSpotlight(0xffffff, 0.3);
    const ambientLight = new THREE.AmbientLight(0xfdfdff, 0.3);
    const pointLight = getPointLight(1.0);

    // Load environment map

    const cubeTextureLoader = new THREE.CubeTextureLoader();
    const environmentMap = cubeTextureLoader.load([
        '/Standard-Cube-Map/nx.png',
        '/Standard-Cube-Map/px.png',
        '/Standard-Cube-Map/ny.png',
        '/Standard-Cube-Map/py.png',
        '/Standard-Cube-Map/nz.png',
        '/Standard-Cube-Map/pz.png'
    ]);
    scene.background = environmentMap;

    // Tạo textures
    const textureLoader = new THREE.TextureLoader();

    planeMaterial.map = textureLoader.load('https://cdn.polyhaven.com/asset_img/renders/plastered_wall_04/clay.png?height=760https://cdn.polyhaven.com/asset_img/renders/plastered_wall_04/clay.png?height=760');
    planeMaterial.bumpMap = textureLoader.load('https://cdn.polyhaven.com/asset_img/renders/plastered_wall_04/clay.png?height=760https://cdn.polyhaven.com/asset_img/renders/plastered_wall_04/clay.png?height=760');
    planeMaterial.roughnessMap = textureLoader.load('https://cdn.polyhaven.com/asset_img/renders/plastered_wall_04/clay.png?height=760');

    // Tạo reflection box
    var reflectionBox = new THREE.CubeTextureLoader().load([
        'https://threejs.org/examples/textures/cube/skybox/px.jpg',
        'https://threejs.org/examples/textures/cube/skybox/nx.jpg',
        'https://threejs.org/examples/textures/cube/skybox/py.jpg',
        'https://threejs.org/examples/textures/cube/skybox/ny.jpg',
        'https://threejs.org/examples/textures/cube/skybox/pz.jpg',
        'https://threejs.org/examples/textures/cube/skybox/nz.jpg'
    ]);
    reflectionBox.format = THREE.RGBFormat;

    boxMaterial.map = textureLoader.load('https://cdn.polyhaven.com/asset_img/primary/painted_concrete_02.png?height=760');
    boxMaterial.bumpMap = textureLoader.load('https://cdn.polyhaven.com/asset_img/primary/painted_concrete_02.png?height=760');   
    boxMaterial.roughnessMap = textureLoader.load('https://cdn.polyhaven.com/asset_img/primary/painted_concrete_02.png?height=760');
    boxMaterial.metalnessMap = textureLoader.load('https://cdn.polyhaven.com/asset_img/primary/painted_concrete_02.png?height=760');
    boxMaterial.envMap = reflectionBox;

    // Đặt vị trí
    box.position.set(0, 0.5, 0); // Đặt box lên trên mặt đất
    sphere.position.set(0, 2, 0); // Đặt sphere lại ngay chỗ của pointLight
    plane.rotation.x = -Math.PI / 2;
    plane.position.y = 0;
    pointLight.position.y = 2;
    pointLight.intensity = 0.5;

    const maps = ['map', 'bumpMap', 'roughnessMap', 'metalnessMap'];
    maps.forEach(function (mapName) {
        const texture = planeMaterial[mapName];
        if (texture) {
            texture.wrapS = THREE.RepeatWrapping;
            texture.wrapT = THREE.RepeatWrapping;
            texture.repeat.set(15, 15);
        }
    });

    // Thêm giao diện chỉnh sửa cho PointLight
    const folder1 = gui.addFolder('Point Light');
    folder1.add(pointLight, 'intensity', 0, 10).name('PLight Intensity');
    folder1.add(pointLight.position, 'x', -10, 10).name('PLight X');
    folder1.add(pointLight.position, 'y', -10, 10).name('PLight Y');
    folder1.add(pointLight.position, 'z', -10, 10).name('PLight Z');

    const folder2 = gui.addFolder('Spot Light');
    folder2.add(spotlight, 'intensity', 0, 10).name('SLight Intensity');
    folder2.add(spotlight.position, 'x', -10, 10).name('SLight X');
    folder2.add(spotlight.position, 'y', -10, 10).name('SLight Y');
    folder2.add(spotlight.position, 'z', -10, 10).name('SLight Z');
    folder2.add(spotlight, 'angle', 0, Math.PI / 2).name('SLight Angle');
    folder2.add(spotlight, 'penumbra', 0, 1).name('SLight Penumbra');
    folder2.add(spotlight, 'decay', 0, 2).name('SLight Decay');

    // Thêm giao diện chỉnh sửa material
    const folder3 = gui.addFolder('Materials');
    folder3.add(sphereMaterial, 'roughness', 0, 1).name('Sphere Roughness');
    folder3.add(planeMaterial, 'roughness', 0, 1).name('Plane Roughness');
    folder3.add(boxMaterial, 'roughness', 0, 1).name('Box Roughness');
    folder3.add(sphereMaterial, 'metalness', 0, 1).name('Sphere Metalness');
    folder3.add(planeMaterial, 'metalness', 0, 1).name('Plane Metalness');
    folder3.add(boxMaterial, 'metalness', 0, 1).name('Box Metalness');

    scene.add(plane);
    scene.add(box);
    scene.add(ambientLight);
    scene.add(pointLight);
    scene.add(spotlight);
    scene.add(spotlight.target);

    pointLight.add(sphere); // Đặt sphere làm con của pointLight để sphere di chuyển theo và mô phỏng bóng đèn

    const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 1000);
    camera.position.set(4, 5, 7);
    camera.lookAt(new THREE.Vector3(0, 0, 0));

    const renderer = new THREE.WebGLRenderer();
    renderer.shadowMap.enabled = true; // Bật đổ bóng
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000);
    document.getElementById("webgl").appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);

    animate();

    function animate() {
        requestAnimationFrame(animate);
        update(renderer, scene, camera, controls);
    }
}

// Sửa lại các hàm getBoxm getPlane, getSphere, getMaterial

function getBox(material, w, h, d) {
    const geometry = new THREE.BoxGeometry(w, h, d);
    const mesh = new THREE.Mesh(geometry, material);
    mesh.castShadow = true;
    return mesh;
}

function getPlane(material, size) {
    const geometry = new THREE.PlaneGeometry(size, size);
    material.side = THREE.DoubleSide;
    const mesh = new THREE.Mesh(geometry, material);
    mesh.receiveShadow = true;
    return mesh;
}

function getSphere(material, radius, segments) {
    const geometry = new THREE.SphereGeometry(radius, segments, segments);
    const mesh = new THREE.Mesh(geometry, material);
    mesh.castShadow = true;
    return mesh;
}

// Thêm hàm getMaterial để dễ chỉnh material cho objects
function getMaterial(type, color) {
    var selectedMaterial;
    var materialOptions = {
        color: color === undefined ? 0xffffff : color,
    }

    switch (type) {
        case 'basic':
            selectedMaterial = new THREE.MeshBasicMaterial(materialOptions);
            break;
        case 'lambert':
            selectedMaterial = new THREE.MeshLambertMaterial(materialOptions);
            break;
        case 'phong':
            selectedMaterial = new THREE.MeshPhongMaterial(materialOptions);
            break;
        case 'standard':
            selectedMaterial = new THREE.MeshStandardMaterial(materialOptions);
            break;
        case 'physical':
            selectedMaterial = new THREE.MeshPhysicalMaterial(materialOptions);
            break;
        default:
            selectedMaterial = new THREE.MeshStandardMaterial(materialOptions);
            break;
    }

    return selectedMaterial;
}

// Tạo hàm ánh sáng
function getPointLight(intensity) {
    const light = new THREE.PointLight(0xffffff, intensity);
    light.castShadow = true;
    return light;
}

function getSpotlight(color, intensity) {
    const spotlight = new THREE.SpotLight(color, intensity);
    spotlight.castShadow = true;
    spotlight.position.set(5, 5, 5);
    spotlight.target.position.set(0, 0, 0);
    spotlight.angle = Math.PI / 4;
    spotlight.penumbra = 0.1;
    spotlight.decay = 2;
    spotlight.distance = 100;
    return spotlight;
}

function update(renderer, scene, camera, controls) {
    renderer.render(scene, camera);
    controls.update();
}

// Bỏ đi các hàm Camera LookAt để không bị conflict với OrbitControls

init();

