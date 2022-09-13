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
    initTrackballControls,
} from "../../utils/tools";

export default {
    name: "basicTexture",
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
        let control = initTrackballControls(camera, renderer);
        let clock = new THREE.Clock();
        // 创建球体
        let a = require("../../assets/textures/general/brick-wall.jpg");
        let geometry = new THREE.SphereGeometry(9, 32, 16);
        let material = new THREE.MeshBasicMaterial({
            // color: new THREE.Color("#4ba2e2"),
            map: new THREE.TextureLoader().load(a),
            // metalness: 0.2,
            // roughness: 0.07,
        });
        let sphere = new THREE.Mesh(geometry, material);
        scene.add(sphere);
        render();

        function render() {
            control.update(clock.getDelta());
            stats.update();
            requestAnimationFrame(render);
            renderer.render(scene, camera);
        }
    },
};
</script>
<style scoped></style>
