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
    name: "SelectObject",
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

        document.addEventListener('mousedown', onDocumentMouseDown, false);

        let geometry = new THREE.SphereGeometry(9, 32, 16)
        let material = new THREE.MeshBasicMaterial({
            color: new THREE.Color('#4ba2e2')
        })
        let sphere = new THREE.Mesh(geometry, material)
        scene.add(sphere)

        render();

        function render() {
            control.update(clock.getDelta())
            stats.update();
            requestAnimationFrame(render);
            renderer.render(scene, camera);
        }

        function onDocumentMouseDown(event) {
            console.log(123);
            var vector = new THREE.Vector3((event.clientX / window.innerWidth) * 2 - 1, -(event.clientY / window.innerHeight) * 2 + 1, 0.5);
            vector = vector.unproject(camera); //用摄像机的投影矩阵解压矢量

            // 光线投射Raycaster,光线投射用于进行鼠标拾取（在三维空间中计算出鼠标移过了什么物体）
            var raycaster = new THREE.Raycaster(camera.position, vector.sub(camera.position).normalize());
            //多个几何体 [sphere, cylinder, cube]
            var intersects = raycaster.intersectObjects(scene.children);
            console.log(intersects);
            if (intersects.length > 0) {
                console.log(intersects[0]);
                intersects[0].object.material.color = new THREE.Color('#fff');
                intersects[0].object.material.opacity = 0.1;
            }
        }

    },
};
</script>
<style scoped>
</style>
