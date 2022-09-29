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
    name: "Curves",
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

        // 椭圆曲线
        const curve = new THREE.EllipseCurve(
            0, 0,            // ax, aY
            10, 10,           // xRadius, yRadius
            0, 2 * Math.PI,  // aStartAngle, aEndAngle
            false,            // aClockwise
            0                 // aRotation
        );
        const points = curve.getPoints(50); // 细分程度，点个数
        const geometry = new THREE.BufferGeometry().setFromPoints(points);  // 连接点
        const material = new THREE.LineBasicMaterial({ color: new THREE.Color('pink') });
        // Create the final object to add to the scene
        const ellipse = new THREE.Line(geometry, material); // 椭圆
        scene.add(ellipse);

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
<style scoped>

</style>
