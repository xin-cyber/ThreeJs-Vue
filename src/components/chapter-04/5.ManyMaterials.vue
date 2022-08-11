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
} from "../../utils/tools";

export default {
    name: "ManyMaterials",
    mounted() {
        // stats面板
        let stats = initStats();
        // 初始化渲染器renderer
        let renderer = initRenderer();
        // 初始化透视相机
        let camera = initCamera();
        let scene = new THREE.Scene();

        // add spotlight for the shadows
        let spotLight = new THREE.SpotLight(0xffffff);
        spotLight.position.set(-40, 60, -10);
        spotLight.castShadow = true;
        scene.add(spotLight);

        let group = new THREE.Mesh();
        // add all the rubik cube elements
        // 立方体12个面，(三角面)，每俩俩一组渲染一种材质
        let mats = [];
        mats.push(new THREE.MeshBasicMaterial({
            color: 0x009e60
        }));

        mats.push(new THREE.MeshBasicMaterial({
            color: 0x0051ba
        }));

        mats.push(new THREE.MeshBasicMaterial({
            color: 0xffd500
        }));

        mats.push(new THREE.MeshBasicMaterial({
            color: 0xff5800
        }));

        mats.push(new THREE.MeshBasicMaterial({
            color: 0xC41E3A
        }));

        mats.push(new THREE.MeshBasicMaterial({
            color: 0xffffff
        }));

        for (let x = 0; x < 3; x++) {
            for (let y = 0; y < 3; y++) {
                for (let z = 0; z < 3; z++) {
                    let cubeGeom = new THREE.BoxGeometry(2.9, 2.9, 2.9);
                    // 每个面都有一个materialIndex
                    let cube = new THREE.Mesh(cubeGeom, mats);
                    cube.position.set(x * 3 - 3, y * 3 - 3, z * 3 - 3);
                    group.add(cube);
                }
            }
        }
        // ⭐一个小方块六面不同颜色，所有小方块都是一样的颜色分布
        // let cubeGeom = new THREE.BoxGeometry(2.9, 2.9, 2.9);
        // let cube = new THREE.Mesh(cubeGeom, mats);
        // group.add(cube);



        group.scale.copy(new THREE.Vector3(2, 2, 2))
        console.log(group);
        // call the render function
        scene.add(group);
        let step = 0;

        let controls = new function () {
            this.rotationSpeed = 0.01;
            this.numberOfObjects = scene.children.length;
        };

        let gui = new dat.GUI();
        gui.add(controls, 'rotationSpeed', 0, 0.5);

        render();


        function render() {
            stats.update();

            group.rotation.y = step += controls.rotationSpeed;
            group.rotation.z = step -= controls.rotationSpeed;
            group.rotation.x = step += controls.rotationSpeed;
            // render using requestAnimationFrame
            requestAnimationFrame(render);
            renderer.render(scene, camera);
        }
    },
};
</script>
<style scoped>
</style>
