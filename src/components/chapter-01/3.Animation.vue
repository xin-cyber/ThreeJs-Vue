<template>
    <div></div>
</template>

<script>
import * as THREE from "three";
import * as dat from "dat.gui";
import Stats from "stats-js";
// import { TrackballControls } from 'three/examples/jsm/controls/TrackballControls.js';
import { initTrackballControls } from "../../utils/tools";

export default {
    name: "Animation",
    mounted() {
        // stats
        let stats = Stats();
        stats.dom.style.marginTop = "35px";
        stats.dom.setAttribute("id", "stats");
        document.body.appendChild(stats.dom);

        // listen to the resize events
        window.addEventListener("resize", onResize, false);

        // default setup
        let scene = new THREE.Scene();
        let camera = new THREE.PerspectiveCamera(
            45,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        );
        let renderer = new THREE.WebGLRenderer();

        renderer.setClearColor(new THREE.Color(0x000000));
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.shadowMap.enabled = true;

        // create the ground plane
        let planeGeometry = new THREE.PlaneGeometry(60, 20, 1, 1);
        let planeMaterial = new THREE.MeshLambertMaterial({ color: 0xffffff });
        let plane = new THREE.Mesh(planeGeometry, planeMaterial);
        plane.receiveShadow = true;

        // rotate and position the plane
        plane.rotation.x = -0.5 * Math.PI;
        plane.position.x = 15;
        plane.position.y = 0;
        plane.position.z = 0;

        // add the plane to the scene
        scene.add(plane);

        // create a cube
        let cubeGeometry = new THREE.BoxGeometry(4, 4, 4);
        let cubeMaterial = new THREE.MeshLambertMaterial({ color: 0xff0000 });
        let cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
        cube.castShadow = true;

        // position the cube
        cube.position.x = -4;
        cube.position.y = 4;
        cube.position.z = 0;

        // add the cube to the scene
        scene.add(cube);

        let sphereGeometry = new THREE.SphereGeometry(4, 20, 20);
        let sphereMaterial = new THREE.MeshLambertMaterial({ color: 0x7777ff });
        let sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);

        // position the sphere
        sphere.position.x = 20;
        sphere.position.y = 0;
        sphere.position.z = 2;
        sphere.castShadow = true;

        // add the sphere to the scene
        scene.add(sphere);

        // position and point the camera to the center of the scene
        camera.position.x = -30;
        camera.position.y = 40;
        camera.position.z = 30;
        camera.lookAt(scene.position);

        // add subtle ambient lighting
        let ambienLight = new THREE.AmbientLight(0x353535);
        scene.add(ambienLight);

        // add spotlight for the shadows
        let spotLight = new THREE.SpotLight(0xffffff);
        spotLight.position.set(-10, 20, -5);
        spotLight.castShadow = true;
        scene.add(spotLight);

        // add the output of the renderer to the html element
        document.body.appendChild(renderer.domElement);

        // call the render function
        let step = 0;

        let controls = {
            rotationSpeed: 0.02,
            bouncingSpeed: 0.03,
        };

        let gui = new dat.GUI();
        gui.add(controls, "rotationSpeed", 0, 0.5);
        gui.add(controls, "bouncingSpeed", 0, 0.5);

        // attach them here, since appendChild needs to be called first
        let trackballControls = initTrackballControls(camera, renderer);

        let clock = new THREE.Clock();

        renderScene();

        function renderScene() {
            console.log(clock.getDelta())
            // update the stats and the controls
            trackballControls.update(clock.getDelta()); // clock.getDelta()返回俩次调用时间间隔， // 相机更新
            stats.update();

            // rotate the cube around its axes
            cube.rotation.x += controls.rotationSpeed;
            cube.rotation.y += controls.rotationSpeed;
            cube.rotation.z += controls.rotationSpeed;

            // bounce the sphere up and down
            step += controls.bouncingSpeed; // 小球速度
            sphere.position.x = 20 + 10 * Math.cos(step);
            sphere.position.y = 2 + 10 * Math.abs(Math.sin(step));

            // render using requestAnimationFrame
            requestAnimationFrame(renderScene);
            renderer.render(scene, camera);
        }

        function onResize() {
            camera.aspect = window.innerWidth / window.innerHeight; //camera第二个参数；渲染窗口的长宽比
            camera.updateProjectionMatrix(); // 更新相机
            renderer.setSize(window.innerWidth, window.innerHeight); // 更新canvas大小，renderer
        }
    },
};
</script>
<style scoped>

</style>
