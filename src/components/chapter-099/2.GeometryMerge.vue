<template>
    <div></div>
</template>

<script>
import * as THREE from "three";
import * as dat from "dat.gui";
import {
    initCamera,
    initStats,
    initRenderer,
    initTrackballControls
} from "../../utils/tools";
import { mergeBufferGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils'
export default {
    name: "GeometryMerge",
    mounted() {
        // stats面板
        let stats = initStats();
        // 初始化渲染器renderer
        let renderer = initRenderer();
        // 初始化Scene
        let scene = new THREE.Scene();
        // 初始化透视相机
        let camera = initCamera(new THREE.Vector3(0, 40, 50), scene.position);
        // 初始化Controls
        let control = initTrackballControls(camera, renderer)
        let clock = new THREE.Clock()
        let cubeMaterial = new THREE.MeshNormalMaterial({
            transparent: true,
            opacity: 0.5
        });
        let controls = new function () {
            this.cameraNear = camera.near;
            this.cameraFar = camera.far;
            this.rotationSpeed = 0.02;
            this.combined = false;


            this.numberOfObjects = 500;

            this.redraw = function () {
                let toRemove = [];
                scene.traverse(function (e) {
                    if (e instanceof THREE.Mesh) toRemove.push(e);
                });
                toRemove.forEach(function (e) {
                    scene.remove(e)
                });

                // add a large number of cubes
                if (controls.combined) {
                    let geometryArray = []
                    for (let i = 0; i < controls.numberOfObjects; i++) {
                        let cubeMesh = addcube();

                        geometryArray.push(cubeMesh.geometry)
                    }

                    // 形状 ;第二个参数useGroup
                    let mergeGeometryArray = mergeBufferGeometries(geometryArray, true)
                    console.log(mergeGeometryArray);
                    // 变换矩阵
                    scene.add(new THREE.Mesh(mergeGeometryArray, cubeMaterial));

                } else {
                    for (let i = 0; i < controls.numberOfObjects; i++) {
                        scene.add(controls.addCube());
                    }
                }
            };


            this.addCube = addcube;

            this.outputObjects = function () {
                console.log(scene.children);
            }
        };

        let gui = new dat.GUI();

        gui.add(controls, 'numberOfObjects', 0, 20000);
        gui.add(controls, 'combined').onChange(controls.redraw);
        gui.add(controls, 'redraw');

        controls.redraw();
        render();
        var rotation = 0;

        function addcube() {
            let cubeSize = 1.0;
            let cubeGeometry = new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize);

            let cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
            cube.castShadow = true;

            // position the cube randomly in the scene
            cube.position.x = -60 + Math.round((Math.random() * 100));
            cube.position.y = Math.round((Math.random() * 10));
            cube.position.z = -150 + Math.round((Math.random() * 175));

            // add the cube to the scene
            return cube;
        }

        function render() {
            rotation += 0.005;
            control.update(clock.getDelta())
            stats.update();
            camera.position.x = Math.sin(rotation) * 50;
            // camera.position.y = Math.sin(rotation) * 40;
            camera.position.z = Math.cos(rotation) * 50;
            camera.lookAt(scene.position);
            requestAnimationFrame(render);
            renderer.render(scene, camera);
        }




    },
};
</script>
<style scoped>
</style>
