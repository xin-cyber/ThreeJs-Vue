<template><div></div></template>

<script>
import * as THREE from "three";
import * as dat from "dat.gui";
import Stats from "stats-js";
import { initTrackballControls } from "../../utils/tools";

export default {
    name: "SceneDetail",
    mounted() {
        // stats
        let stats = Stats();
        stats.dom.style.marginTop = "35px";
        document.body.appendChild(stats.dom);

        // create a scene, that will hold all our elements such as objects, cameras and lights.
        let scene = new THREE.Scene();

        // 雾化：离相机越远越模糊
        // 颜色，浓度；指数级别增长
        // scene.fog = new THREE.FogExp2(0xffffff, 0.015);
        // (near, far) : 雾化开始和结束的位置，线性增长
        scene.fog = new THREE.Fog(0xffffff, 10, 100);

        // create a camera, which defines where we're looking at.
        let camera = new THREE.PerspectiveCamera(
            45,
            window.innerWidth / window.innerHeight,
            0.1,
            100
        );

        // create a render and set the size
        let renderer = new THREE.WebGLRenderer();

        renderer.setClearColor(new THREE.Color(0x000000));
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.shadowMap.enabled = true;

        // create the ground plane
        let planeGeometry = new THREE.PlaneGeometry(60, 40, 1, 1);
        let planeMaterial = new THREE.MeshLambertMaterial({
            color: 0xffffff,
        });
        let plane = new THREE.Mesh(planeGeometry, planeMaterial);
        plane.receiveShadow = true;

        // rotate and position the plane
        plane.rotation.x = -0.5 * Math.PI;
        plane.position.x = 0;
        plane.position.y = 0;
        plane.position.z = 0;

        // add the plane to the scene
        scene.add(plane);

        // position and point the camera to the center of the scene
        camera.position.x = -30;
        camera.position.y = 40;
        camera.position.z = 30;
        camera.lookAt(scene.position);

        // add subtle ambient lighting
        let ambientLight = new THREE.AmbientLight(0x3c3c3c);
        scene.add(ambientLight);

        // add spotlight for the shadows
        let spotLight = new THREE.SpotLight(0xffffff, 1.2, 150, 120);
        spotLight.position.set(-40, 60, -10);
        spotLight.castShadow = true;
        scene.add(spotLight);

        // add the output of the renderer to the html element
        document.body.appendChild(renderer.domElement);

        // call the render function
        // let step = 0;

        let controls = {
            rotationSpeed: 0.02,
            numberOfObjects: scene.children.length,
            removeCube: () => {
                let allChildren = scene.children;
                let lastObject = allChildren[allChildren.length - 1];
                // 防止删除spotLight 和 planeGeometry
                if (lastObject instanceof THREE.Mesh) {
                    scene.remove(lastObject);
                    controls.numberOfObjects = scene.children.length;
                }
            },
            addCube: () => {
                // math.random => [0,1]
                let cubeSize = Math.ceil(Math.random() * 3);
                let cubeGeometry = new THREE.BoxGeometry(
                    cubeSize,
                    cubeSize,
                    cubeSize
                );
                let cubeMaterial = new THREE.MeshLambertMaterial({
                    color: Math.random() * 0xffffff,
                });
                let cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
                cube.castShadow = true;
                // scene.get
                cube.name = "cube-" + scene.children.length;

                // position the cube randomly in the scene
                // plane内部xyz坐标 , math.round => 四舍五入取整
                cube.position.x =
                    -30 +
                    Math.round(Math.random() * planeGeometry.parameters.width);
                cube.position.y = Math.round(Math.random() * 5);
                cube.position.z =
                    -20 +
                    Math.round(Math.random() * planeGeometry.parameters.height);

                // add the cube to the scene
                scene.add(cube);
                controls.numberOfObjects = scene.children.length;
            },
            outputObjects: () => {
                console.log(scene.children);
            },
        };

        let gui = new dat.GUI();
        gui.add(controls, "rotationSpeed", 0, 0.5);
        gui.add(controls, "addCube");
        gui.add(controls, "removeCube");
        gui.add(controls, "outputObjects");
        gui.add(controls, "numberOfObjects").listen();

        // attach them here, since appendChild needs to be called first
        let trackballControls = initTrackballControls(camera, renderer);
        let clock = new THREE.Clock();

        render();

        function render() {
            trackballControls.update(clock.getDelta());
            stats.update();

            // rotate the cubes around its axes
            // scene对象是对象树，traverse方法会在所有子对象上执行，直至遍历完所有对象为止
            // 或者使用foreach遍历scene.children
            scene.traverse(function (e) {
                if (e instanceof THREE.Mesh && e != plane) {
                    e.rotation.x += controls.rotationSpeed;
                    e.rotation.y += controls.rotationSpeed;
                    e.rotation.z += controls.rotationSpeed;
                }
            });

            // render using requestAnimationFrame
            requestAnimationFrame(render);
            renderer.render(scene, camera);
        }
    },
};
</script>
<style scoped></style>
