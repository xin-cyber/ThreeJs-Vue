<template>
    <div></div>
</template>

<script>
import * as THREE from "three";
import * as dat from "dat.gui";
import {
    initRenderer,
    initStats,
    addBasicMaterialSettings,
} from "../../utils/tools";

export default {
    name: "MeshDepthMaterial",
    mounted() {
        // stats面板
        let stats = initStats();
        // 初始化渲染器renderer
        let renderer = initRenderer();

        let scene = new THREE.Scene();
        // 覆盖材质
        scene.overrideMaterial = new THREE.MeshDepthMaterial();

        let camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 50, 110);
        camera.position.set(-50, 40, 50);
        camera.lookAt(scene.position);


        let controls = new function () {
            this.cameraNear = camera.near;
            this.cameraFar = camera.far;
            this.rotationSpeed = 0.02;
            this.numberOfObjects = scene.children.length;

            this.removeCube = function () {
                let allChildren = scene.children;
                let lastObject = allChildren[allChildren.length - 1];
                if (lastObject instanceof THREE.Mesh) {
                    scene.remove(lastObject);
                    this.numberOfObjects = scene.children.length;
                }
            };

            this.addCube = function () {

                let cubeSize = Math.ceil(3 + (Math.random() * 3));
                let cubeGeometry = new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize);
                let cubeMaterial = new THREE.MeshLambertMaterial({
                    color: Math.random() * 0xffffff
                });
                let cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
                cube.castShadow = true;

                // position the cube randomly in the scene
                cube.position.x = -60 + Math.round((Math.random() * 100));
                cube.position.y = Math.round((Math.random() * 10));
                cube.position.z = -100 + Math.round((Math.random() * 150));

                // add the cube to the scene
                scene.add(cube);
                this.numberOfObjects = scene.children.length;
            };

            this.outputObjects = function () {
                console.log(scene.children);
            }
        };
        let gui = new dat.GUI();
        addBasicMaterialSettings(gui, controls, scene.overrideMaterial);
        let spGui = gui.addFolder("THREE.MeshDepthMaterial");
        spGui.add(scene.overrideMaterial, 'wireframe');
        spGui.add(scene.overrideMaterial, 'wireframeLinewidth', 0, 20);

        gui.add(controls, 'rotationSpeed', 0, 0.5);
        gui.add(controls, 'addCube');
        gui.add(controls, 'removeCube');
        gui.add(controls, 'cameraNear', 0, 100).onChange(function (e) {
            camera.near = e;
            camera.updateProjectionMatrix();
        });
        gui.add(controls, 'cameraFar', 50, 200).onChange(function (e) {
            camera.far = e;
            camera.updateProjectionMatrix();
        });

        let i = 0;
        while (i < 10) {
            controls.addCube();
            i++;
        }


        render();

        function render() {
            stats.update();

            // rotate the cubes around its axes
            scene.traverse(function (e) {
                if (e instanceof THREE.Mesh) {

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
<style scoped>
</style>
