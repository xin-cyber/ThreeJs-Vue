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
    initDefaultLighting,
} from "../../utils/tools";

export default {
    name: "LightMapping",
    mounted() {
        // stats面板
        let stats = initStats();
        // 初始化渲染器renderer
        let renderer = initRenderer();
        // 初始化Scene
        let scene = new THREE.Scene();
        // 初始化透视相机
        let camera = initCamera(new THREE.Vector3(0, 20, 40), scene.position);
        // 初始化Controls
        let control = initTrackballControls(camera, renderer);
        let clock = new THREE.Clock();
        // 初始化灯光
        initDefaultLighting(scene);
        scene.add(new THREE.AmbientLight(0x444444));
        var spotLight = scene.getObjectByName("spotLight");
        spotLight.intensity = 0.15;
        scene.remove(scene.getObjectByName("ambientLight"))
        // 初始化加载器
        let textureLoader = new THREE.TextureLoader();

        // ⭐创建球体
        let sphere = new THREE.BoxGeometry(16, 16, 16);
        let sphereMaterial = new THREE.MeshStandardMaterial({
            emissive: 0xffffff,
            // 自发光贴图，自己不会成为光源
            emissiveMap: textureLoader.load(require("../../assets/textures/emissive/lava.png")),
            // 法线贴图
            normalMap: textureLoader.load(require("../../assets/textures/emissive/lava-normals.png")),
            // 金属贴图
            metalnessMap: textureLoader.load(require("../../assets/textures/emissive/lava-smoothness.png")),
            metalness: 0.7,
            roughness: 0.4,
            // 凹凸程度，x轴和y轴进行缩放，最好设置一样
            normalScale: new THREE.Vector2(4, 4)
        });

        let cube1 = new THREE.Mesh(sphere, sphereMaterial);
        scene.add(cube1);

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
