function init() {
    var scene = new THREE.Scene();

    var box = getBox(1, 1, 1);
    var plane = getPlane(6);
    var sphere = getSphere(0.5);
    var cone = getCone(0.4, 1); 
    var cylinder = getCylinder(0.3, 0.3, 1.2);
    var torus = getTorus(0.4, 0.15);

    var spotlight = getSpotlight(0xffffff, 2);
    var ambientLight = new THREE.AmbientLight(0xffffff, 2.0);
    
    // Đặt tên object
    plane.name = 'plane-1';
    sphere.name = 'sphere-1';

    // Đặt vị trí
    box.position.set(-1.5, 0.5, 0);
    sphere.position.set(0, 0.5, 2.5);
    cone.position.set(1.5, 0.5, -1);
    cylinder.position.set(0, 0.6, -1.5);
    torus.position.set(1.5, 0.4, 2);

    plane.rotation.x = -Math.PI / 2;
    plane.position.y = 0;

    scene.add(box);

    scene.add(plane);
    scene.add(sphere);
    scene.add(cone);
    scene.add(cylinder);
    scene.add(torus);
    scene.add(spotlight);
    scene.add(spotlight.target);
    scene.add(ambientLight);

    var camera = new THREE.PerspectiveCamera(
        45,
        window.innerWidth / window.innerHeight,
        1,
        1000
    );
    camera.position.set(4, 5, 7);
    camera.lookAt(new THREE.Vector3(0, 0, 0));

    var renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.getElementById("webgl").appendChild(renderer.domElement);

    function animate() {
        requestAnimationFrame(animate);
        // Sửa lại cơ chế render
        update(renderer, scene, camera);
    }

    animate();
}

function getBox(w, h, d) {
    var geometry = new THREE.BoxGeometry(w, h, d);
    var material = new THREE.MeshStandardMaterial({ color: 0x97feed });
    return new THREE.Mesh(geometry, material);
}

function getPlane(size) {
    var geometry = new THREE.PlaneGeometry(size, size);
    var material = new THREE.MeshStandardMaterial({
        color: 0x143f6b,
        side: THREE.DoubleSide
    });
    return new THREE.Mesh(geometry, material);
}

function getSphere(radius) {
    var geometry = new THREE.SphereGeometry(radius, 32, 32);
    var material = new THREE.MeshStandardMaterial({ color: 0xfaef5d }); 
    return new THREE.Mesh(geometry, material);
}

function getCone(radius, height) {
    var geometry = new THREE.ConeGeometry(radius, height, 32);
    var material = new THREE.MeshStandardMaterial({ color: 0xff204e }); 
    return new THREE.Mesh(geometry, material);
}

function getSpotlight(color, intensity) {
    var spotlight = new THREE.SpotLight(color, intensity);
    spotlight.position.set(5, 5, 5);
    spotlight.target.position.set(0, 0, 0);
    spotlight.angle = Math.PI / 4;
    spotlight.penumbra = 0.1;
    spotlight.decay = 2;
    spotlight.distance = 100;
    return spotlight;
}

function getCylinder(radiusTop, radiusBottom, height) {
    var geometry = new THREE.CylinderGeometry(radiusTop, radiusBottom, height, 32);
    var material = new THREE.MeshStandardMaterial({ color: 0x800080 }); 
    return new THREE.Mesh(geometry, material);
}

function getTorus(radius, tube) {
    var geometry = new THREE.TorusGeometry(radius, tube, 16, 100);
    var material = new THREE.MeshStandardMaterial({ color: 0xffa500 }); 
    return new THREE.Mesh(geometry, material);
}

// Hàm cập nhật
function update(renderer, scene, camera) {
    renderer.render (
        scene,
        camera
    );

    var plane = scene.getObjectByName('plane-1');
    // Xoay
    plane.rotation.y += 0.00001;
    plane.rotation.z += 0.0001;

    // Tỉ lệ
    plane.traverse(function(child) {
        child.scale.x += 0.0001;
    })

    var sphere = scene.getObjectByName('sphere-1');
    // Tịnh tiến
    sphere.position.x += 0.001;

    requestAnimationFrame(function(){
        update(renderer, scene, camera);
    })

    // Điều chỉnh VRP, LookAt
    camera.position.set(-12, 7, 7);
    camera.lookAt(new THREE.Vector3(1, 0.5, 1));

}

init();
