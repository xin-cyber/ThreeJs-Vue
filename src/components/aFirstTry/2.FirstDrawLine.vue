<template><div></div></template>

<script>
import * as THREE from "three";
export default {
    name: "FirstDrawLine",
    mounted() {
        const renderer = new THREE.WebGLRenderer();
        renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(renderer.domElement);

        const camera = new THREE.PerspectiveCamera(
            45,
            window.innerWidth / window.innerHeight,
            1,
            500
        );
        camera.position.set(0, 0, 100);
        camera.lookAt(0, 0, 0); // scene 位置

        const scene = new THREE.Scene();
        // 或者LineDashedMaterial.虚线
        const material = new THREE.LineBasicMaterial({ color: 0x0000ff });

        const points = [];
        // 三维向量，点的坐标
        points.push(new THREE.Vector3(-10, 0, 0));
        points.push(new THREE.Vector3(0, 10, 0));
        points.push(new THREE.Vector3(10, 0, 0));

        const geometry = new THREE.BufferGeometry().setFromPoints(points);

        const line = new THREE.Line(geometry, material);

        scene.add(line);
        renderer.render(scene, camera);
    },
};
</script>
<style scoped></style>
