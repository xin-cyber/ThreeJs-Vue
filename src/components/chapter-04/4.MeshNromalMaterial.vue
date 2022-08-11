<template>
    <div></div>
</template>

<script>
import * as THREE from "three";
import * as dat from "dat.gui";
import {
    initCamera,
    initStats,
    addBasicMaterialSettings,
    loadGopher
} from "../../utils/tools";

export default {
    name: "MeshNromalMaterial",
    mounted() {
        // stats面板
        let stats = initStats();
        // 初始化透视相机
        let camera = initCamera();
        let scene = new THREE.Scene();

        // create a camera, which defines where we're looking at.
        // let camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
        // camera.position.set(-20, 30, 40);
        // camera.lookAt(new THREE.Vector3(10, 0, 0));

        // create a render and set the size
        let renderer;
        let webGLRenderer = new THREE.WebGLRenderer();
        webGLRenderer.setClearColor(new THREE.Color(0x000000));
        webGLRenderer.setSize(window.innerWidth, window.innerHeight);

        // let canvasRenderer = new THREE.CanvasRenderer();
        // canvasRenderer.setSize(window.innerWidth, window.innerHeight);
        renderer = webGLRenderer;

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


        let meshMaterial = new THREE.MeshNormalMaterial();
        let sphere = new THREE.Mesh(sphereGeometry, meshMaterial);
        let cube = new THREE.Mesh(cubeGeometry, meshMaterial);
        let plane = new THREE.Mesh(planeGeometry, meshMaterial);

        let selectedMesh = cube;

        // position the sphere
        sphere.position.x = 0;
        sphere.position.y = 3;
        sphere.position.z = 2;
        console.log(sphere);
        // for (let f = 0, fl = sphere.geometry.faces.length; f < fl; f++) {
        //     let face = sphere.geometry.faces[f];
        //     let centroid = new THREE.Vector3(0, 0, 0);
        //     centroid.add(sphere.geometry.vertices[face.a]);
        //     centroid.add(sphere.geometry.vertices[face.b]);
        //     centroid.add(sphere.geometry.vertices[face.c]);
        //     centroid.divideScalar(3);

        //     let arrow = new THREE.ArrowHelper(
        //         face.normal,
        //         centroid,
        //         2,
        //         0x3333FF,
        //         0.5,
        //         0.5);
        //     sphere.add(arrow);
        // }


        cube.position.copy(sphere.position)
        plane.position.copy(sphere.position)


        // add the sphere to the scene
        scene.add(cube);



        // add subtle ambient lighting
        let ambientLight = new THREE.AmbientLight(0x0c0c0c);
        scene.add(ambientLight);

        // add spotlight for the shadows
        let spotLight = new THREE.SpotLight(0xffffff);
        spotLight.position.set(-40, 60, -10);
        spotLight.castShadow = true;
        scene.add(spotLight);

        // add the output of the renderer to the html element
        document.body.appendChild(renderer.domElement);

        // call the render function
        let step = 0;
        // let oldContext = null;

        let controls = new function () {
            this.rotationSpeed = 0.02;
            this.bouncingSpeed = 0.03;
            this.selectedMesh = "cube";
        };

        let gui = new dat.GUI();
        addBasicMaterialSettings(gui, controls, meshMaterial);

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
