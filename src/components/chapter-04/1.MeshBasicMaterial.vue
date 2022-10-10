<template>
    <div></div>
</template>

<script>
import * as THREE from "three";
import * as dat from "dat.gui";
import {
    initTrackballControls,
    initStats,
    initCamera,
    addBasicMaterialSettings,
    loadGopher
} from "../../utils/tools";

export default {
    name: "MeshBasicMaterial",
    mounted() {
        // stats面板
        let stats = initStats();
        // 初始化透视相机
        let camera = initCamera();

        // create a scene, that will hold all our elements such as objects, cameras and lights.
        let scene = new THREE.Scene();

        // create a render and set the size
        let webGLRenderer = new THREE.WebGLRenderer();
        webGLRenderer.setClearColor(new THREE.Color(0x000000));
        webGLRenderer.setSize(window.innerWidth, window.innerHeight);
        webGLRenderer.shadowMap.enabled = true;

        // 不再支持canvasRenderer
        // let canvasRenderer = new THREE.CanvasRenderer();
        // canvasRenderer.setSize(window.innerWidth, window.innerHeight);
        let renderer = webGLRenderer;

        let groundGeom = new THREE.PlaneGeometry(100, 100, 4, 4);
        let groundMesh = new THREE.Mesh(groundGeom, new THREE.MeshBasicMaterial({
            color: 0x777777
        }));
        groundMesh.rotation.x = -Math.PI / 2;
        groundMesh.position.y = -20;
        scene.add(groundMesh);

        let sphereGeometry = new THREE.SphereGeometry(14, 20, 20);
        let cubeGeometry = new THREE.BoxGeometry(15, 15, 15);
        let planeGeometry = new THREE.PlaneGeometry(14, 14, 4, 4);

        let meshMaterial = new THREE.MeshBasicMaterial({
            color: 0x7777ff,
            name: 'Basic Material',
            flatShading: true
        });

        // let meshMaterial2 = new THREE.MeshBasicMaterial({
        //     color: new THREE.Color('pink'),
        //     name: 'Basic Material',
        //     flatShading: true,
        //     side: THREE.DoubleSide
        // });
        // let materialArray = [meshMaterial, meshMaterial2]

        let sphere = new THREE.Mesh(sphereGeometry, meshMaterial);
        let cube = new THREE.Mesh(cubeGeometry, meshMaterial);
        let plane = new THREE.Mesh(planeGeometry, meshMaterial);

        // position the sphere
        sphere.position.x = 0;
        sphere.position.y = 3;
        sphere.position.z = 2;


        cube.position.copy(sphere.position);
        plane.position.copy(sphere.position);

        // add the sphere to the scene
        scene.add(cube);

        // position and point the camera to the center of the scene
        camera.position.x = -20;
        camera.position.y = 50;
        camera.position.z = 40;
        camera.lookAt(new THREE.Vector3(10, 0, 0));

        // add ambient lighting
        let ambientLight = new THREE.AmbientLight("#0x0c0c0c");
        scene.add(ambientLight);

        // add spotlight for the shadows
        // let spotLight = new THREE.SpotLight(0xffffff, 1, 180, Math.PI / 4);
        // spotLight.shadow.mapSize.set(2048, 2048);
        // // spotLight.position = new THREE.Vector3(-40, 60, -10);
        // spotLight.position.set(-40, 60, -10);
        // spotLight.castShadow = true;
        // scene.add(spotLight);

        document.body.appendChild(renderer.domElement);

        // add controls
        let trackballControls = initTrackballControls(camera, renderer);
        let clock = new THREE.Clock();

        // call the render function
        let step = 0;

        let controls = {
            rotationSpeed: 0.02,
            bouncingSpeed: 0.03,
            color: meshMaterial.color.getStyle(),
            selectedMesh: "cube",
            // this.switchRenderer = function () {
            //     if (renderer instanceof THREE.WebGLRenderer) {
            //         renderer = canvasRenderer;
            //         document.getElementById("webgl-output").innerHTML = "";
            //         document.getElementById("webgl-output").appendChild(renderer.domElement);
            //     } else {
            //         renderer = webGLRenderer;
            //         document.getElementById("webgl-output").innerHTML = "";
            //         document.getElementById("webgl-output").appendChild(renderer.domElement);
            //     }
            // }
        };

        let gui = new dat.GUI();
        let selectedMesh = cube;
        addBasicMaterialSettings(gui, controls, meshMaterial);

        let spGui = gui.addFolder("THREE.MeshBasicMaterial");
        spGui.addColor(controls, 'color').onChange(function (e) {
            meshMaterial.color.setStyle(e)
        });
        spGui.add(meshMaterial, 'wireframe');
        spGui.add(meshMaterial, 'wireframeLinewidth', 0, 20);
        spGui.add(meshMaterial, 'wireframeLinejoin', ['round', 'bevel', 'miter']).onChange(function (e) {
            meshMaterial.wireframeLinejoin = e
        });
        spGui.add(meshMaterial, 'wireframeLinecap', ['butt', 'round', 'square']).onChange(function (e) {
            meshMaterial.wireframeLinecap = e
        });

        loadGopher(meshMaterial).then(function (gopher) {
            gopher.scale.x = 4;
            gopher.scale.y = 4;
            gopher.scale.z = 4;
            gui.add(controls, 'selectedMesh', ["cube", "sphere", "plane", "gopher"]).onChange(function (e) {

                scene.remove(plane);
                scene.remove(cube);
                scene.remove(sphere);
                scene.remove(gopher);

                switch (e) {
                    case "cube":
                        scene.add(cube);
                        selectedMesh = cube;
                        break;
                    case "sphere":
                        scene.add(sphere);
                        selectedMesh = sphere;
                        break;
                    case "plane":
                        scene.add(plane);
                        selectedMesh = plane;
                        break;
                    case "gopher":
                        scene.add(gopher);
                        selectedMesh = gopher;
                        break;
                }
            });
        });


        render();

        function render() {
            trackballControls.update(clock.getDelta());
            stats.update();

            selectedMesh.rotation.y = step += 0.01;

            // render using requestAnimationFrame
            requestAnimationFrame(render);
            renderer.render(scene, camera);
        }

    },
};
</script>
<style scoped>

</style>
