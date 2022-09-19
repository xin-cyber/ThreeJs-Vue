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
    name: "BufferGeometry",
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

        const geometry = new THREE.BufferGeometry();
        // 六个点坐标，每三个点组成一个面（⭐三角面）
        const vertices = new Float32Array([
            // JavaScript 类型化数组是一种类似数组的对象，并提供了一种用于访问原始二进制数据的机制。
            -5.0, -5.0, 5.0,
            5.0, -5.0, 5.0,
            5.0, 5.0, 5.0,

            5.0, 5.0, 5.0,
            -5.0, 5.0, 5.0,
            -5.0, -5.0, 5.0
        ]);

        // ⭐数组 vertices 中每三个元素构成一个点
        geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3)); // 缓冲区属性对象
        // attribut 的position属性里面是顶点坐标
        console.log(geometry);
        const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
        const mesh = new THREE.Mesh(geometry, material);
        scene.add(mesh);

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
