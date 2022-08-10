<template><div></div></template>

<script>
import * as THREE from "three";
export default {
    name: "FirstDemo",
    mounted() {
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(
            75,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        );
        // true => 背景透明白色
        const renderer = new THREE.WebGLRenderer({ alpha: false });
        renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(renderer.domElement);

        const geometry = new THREE.BoxGeometry(1, 1, 1);

        var color = new THREE.Color("#7833aa");

        const material = new THREE.MeshBasicMaterial({
            color: color.getHex(),
            // 线框
            wireframe: true,
        });

        const cube = new THREE.Mesh(geometry, material);
        scene.add(cube);

        camera.position.z = 5;

        function animate() {
            requestAnimationFrame(animate);

            cube.rotation.x += 0.01;
            cube.rotation.y += 0.01;

            renderer.render(scene, camera);
        }

        animate();
    },
};
</script>
<style scoped></style>
