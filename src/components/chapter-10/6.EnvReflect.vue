<template>
    <div></div>
</template>

<script>
import * as THREE from "three";
// import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
// import * as dat from "dat.gui";
import {
    initCamera,
    initStats,
    initRenderer,
    initTrackballControls,
    initDefaultLighting,
} from "../../utils/tools";

export default {
    name: "EnvReflect",
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
        let spotLight = scene.getObjectByName("spotLight");
        spotLight.intensity = 0.15;
        scene.remove(scene.getObjectByName("ambientLight"))
        // 初始化加载器
        let textureLoader = new THREE.TextureLoader();

        // 前后上下右左
        let urls = [
            require('../../assets/textures/cubemap/flowers/right.png'),
            require('../../assets/textures/cubemap/flowers/left.png'),
            require('../../assets/textures/cubemap/flowers/top.png'),
            require('../../assets/textures/cubemap/flowers/bottom.png'),
            require('../../assets/textures/cubemap/flowers/front.png'),
            require('../../assets/textures/cubemap/flowers/back.png')
        ];
        // 创建由六个图像组成的立方体纹理。
        let cubeLoader = new THREE.CubeTextureLoader();
        // ⭐如果不为空，则设置渲染场景时使用的背景，并且总是首先渲染。可以设置为设置清晰颜色的 Color，覆盖画布的 Texture，立方体贴图作为 CubeTexture 或等矩形作为 Texture。默认为空。
        scene.background = cubeLoader.load(urls);
        // 给所有物体添加环境贴图，等级与envMap
        scene.environment = cubeLoader.load(urls)

        // const environment = new RoomEnvironment();
        // const pmremGenerator = new THREE.PMREMGenerator(renderer);
        // scene.environment = pmremGenerator.fromScene(environment).texture;

        // ⭐创建球体
        let cubeMaterial = new THREE.MeshStandardMaterial({
            // 环境贴图。为确保物理上正确的呈现，应仅添加由 PMREM生成器预处理的环境映射。默认值为空。
            // 球面产生反射金属光泽越高，反射越清晰，粗糙度越高越浑浊
            // envMap: scene.background,
            color: 0xffffff,
            // 金属程度
            metalness: 1,
            // 塑料程度
            roughness: 0
        });

        let sphereMaterial = cubeMaterial.clone();
        sphereMaterial.normalMap = textureLoader.load(require("../../assets/textures/engraved/Engraved_Metal_003_NORM.jpg"));
        sphereMaterial.aoMap = textureLoader.load(require("../../assets/textures/engraved/Engraved_Metal_003_OCC.jpg"));
        sphereMaterial.shininessMap = textureLoader.load(require("../../assets/textures/engraved/Engraved_Metal_003_ROUGH.jpg"));

        let cube = new THREE.BoxGeometry(16, 12, 12)
        let cube1 = new THREE.Mesh(cube, cubeMaterial);
        cube1.castShadow = true
        cube1.position.x = -15;
        cube1.rotation.y = -1 / 3 * Math.PI;
        scene.add(cube1);

        let sphere = new THREE.SphereGeometry(10, 50, 50)
        let sphere1 = new THREE.Mesh(sphere, sphereMaterial);
        scene.add(sphere1);
        sphere1.position.x = 15;


        render();

        function render() {
            control.update(clock.getDelta());
            stats.update();
            requestAnimationFrame(render);
            renderer.render(scene, camera);
            cube1.rotation.y += 0.01;
            sphere1.rotation.y -= 0.01;
        }
    },
};
</script>
<style scoped>

</style>
