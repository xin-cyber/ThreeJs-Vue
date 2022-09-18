<template>
    <div></div>
</template>

<script>
import * as THREE from "three";
import * as dat from "dat.gui";
// import Stats from "stats-js";
// import { TrackballControls } from 'three/examples/jsm/controls/TrackballControls.js';
import { initTrackballControls } from "../../utils/tools";

export default {
    name: "Geometry",
    mounted() {

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


        // create a cube
        let cubeGeometry = new THREE.BoxGeometry(4, 4, 4);
        console.log(cubeGeometry);
        let cubeMaterial = new THREE.MeshLambertMaterial({ color: 0xff0000 });
        let cube = new THREE.Mesh(cubeGeometry, cubeMaterial);

        // add the cube to the scene
        scene.add(cube);

        // 创建three坐标系
        let axes = new THREE.AxesHelper(20);
        scene.add(axes);


        // position and point the camera to the center of the scene
        camera.position.set(15, 10, 30);
        camera.lookAt(scene.position);

        // add subtle ambient lighting
        let ambienLight = new THREE.AmbientLight(0x353535);
        scene.add(ambienLight);

        // add the output of the renderer to the html element
        document.body.appendChild(renderer.domElement);


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
            // update the stats and the controls
            trackballControls.update(clock.getDelta()); // clock.getDelta()返回俩次调用时间间隔， // 相机更新
            // stats.update();

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
