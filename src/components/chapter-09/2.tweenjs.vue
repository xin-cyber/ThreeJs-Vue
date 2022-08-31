<template>
    <div></div>
</template>

<script>
import * as THREE from "three";
import Tween from '@tweenjs/tween.js'
// import * as dat from "dat.gui";
import {
    initCamera,
    initStats,
    initRenderer,
    initTrackballControls
} from "../../utils/tools";

export default {
    name: "tweenjs",
    mounted() {
        console.log(Tween);
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
