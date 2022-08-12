<template>
    <div></div>
</template>

<script>
import * as THREE from "three";
// import * as dat from "dat.gui";
import {
    initCamera,
    initStats,
    initRenderer,
    initTrackballControls
} from "../../utils/tools";

export default {
    name: "LineBasicMaterial",
    mounted() {
        // stats面板
        let stats = initStats();
        // 初始化渲染器renderer
        let renderer = initRenderer();
        // 初始化透视相机
        let camera = initCamera();
        let scene = new THREE.Scene();
        // add subtle ambient lighting
        var ambientLight = new THREE.AmbientLight(0x0c0c0c);
        scene.add(ambientLight);

        // add spotlight for the shadows
        var spotLight = new THREE.SpotLight(0xffffff);
        spotLight.position.set(-40, 60, -10);
        spotLight.castShadow = true;
        scene.add(spotLight);

        let points = [];
        // for (let i = 0; i < 10; i++) {
        //     points.push(new THREE.Vector3(Math.floor(Math.random() * 10), Math.floor(Math.random() * 10), Math.floor(Math.random() * 10)));
        // }
        for (let x = 0; x < 2; x++) {
            for (let y = 0; y < 2; y++) {
                for (let z = 0; z < 2; z++) {
                    points.push(new THREE.Vector3(x, y, z))
                }
            }
        }
        let geometry = new THREE.BufferGeometry().setFromPoints(points);
        let material = new THREE.MeshBasicMaterial({
            color: 'red'
        })

        let line = new THREE.Line(geometry, material);
        scene.add(line);

        let control = initTrackballControls(camera, renderer)
        let clock = new THREE.Clock()
        render();

        function render() {
            control.update(clock.getDelta())
            stats.update();

            requestAnimationFrame(render);
            renderer.render(scene, camera);
        }


    },
};
</script>
<style scoped>
</style>
