<template>
    <div></div>
</template>

<script>
import * as THREE from "three";
export default {
    name: "Scene",
    mounted() {
        // create a scene, that will hold all our elements such as objects, cameras and lights.
        let scene = new THREE.Scene();

        // create a camera, which defines where we're looking at.
        let camera = new THREE.PerspectiveCamera(
            45,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        );

        // create a render and set the size
        let renderer = new THREE.WebGLRenderer(); // 还有例如canvas，css，svg
        renderer.setClearColor(new THREE.Color(0x000000)); // 背景色
        renderer.setSize(window.innerWidth, window.innerHeight);

        // show axes in the screen；红色x轴，绿色y轴，蓝色z轴，
        let axes = new THREE.AxesHelper(20); // 轴线粗细
        scene.add(axes);

        // create the ground plane
        let planeGeometry = new THREE.PlaneGeometry(60, 20);
        let planeMaterial = new THREE.MeshBasicMaterial({
            color: 0xaaaaaa,
        });
        let plane = new THREE.Mesh(planeGeometry, planeMaterial);

        // rotate and position the plane
        plane.rotation.x = -0.5 * Math.PI;
        plane.position.set(15, 0, 0);

        // add the plane to the scene
        scene.add(plane);

        // create a cube
        let cubeGeometry = new THREE.BoxGeometry(4, 4, 4);
        let cubeMaterial = new THREE.MeshBasicMaterial({
            color: 0xff0000,
            wireframe: true,
        });
        let cube = new THREE.Mesh(cubeGeometry, cubeMaterial);

        // position the cube
        cube.position.set(-4, 3, 0);
        // 声明一个三维向量用来保存世界坐标
        var worldPosition = new THREE.Vector3();
        // 执行getWorldPosition方法把模型的世界坐标保存到参数worldPosition中

        console.log(cube.getWorldPosition(worldPosition));
        // add the cube to the scene
        scene.add(cube);

        // create a sphere
        let sphereGeometry = new THREE.SphereGeometry(4, 20, 20);
        let sphereMaterial = new THREE.MeshBasicMaterial({
            color: 0x7777ff,
            wireframe: true,
        });
        let sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);

        // position the sphere
        sphere.position.set(20, 4, 2);

        // add the sphere to the scene
        scene.add(sphere);

        // position and point the camera to the center of the scene
        camera.position.set(-30, 40, 30);
        camera.lookAt(scene.position);

        // add the output of the renderer to the html element
        document.body.appendChild(renderer.domElement);

        // render the scene
        renderer.render(scene, camera);
    },
};
</script>
<style scoped>

</style>
