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
    name: "RoughMetalMappig",
    mounted() {
        // stats面板
        let stats = initStats();
        // 初始化渲染器renderer
        let renderer = initRenderer();
        // 初始化Scene
        let scene = new THREE.Scene();
        // 初始化透视相机
        let camera = initCamera(new THREE.Vector3(0, 20, 50), scene.position);
        // 初始化Controls
        let control = initTrackballControls(camera, renderer);
        let clock = new THREE.Clock();
        // 创建平行光
        let pointLight = new THREE.PointLight("#ffffff");
        scene.add(pointLight);
        scene.add(new THREE.AmbientLight(0x888888));
        // 初始化加载器
        let textureLoader = new THREE.TextureLoader();

        // 小原点光源
        let sphereLight = new THREE.SphereGeometry(0.2);
        let sphereLightMaterial = new THREE.MeshStandardMaterial({ color: 0xff5808 });
        let sphereLightMesh = new THREE.Mesh(sphereLight, sphereLightMaterial);
        scene.add(sphereLightMesh);

        // 前后上下右左
        let urls = [
            require('../../assets/textures/cubemap/car/right.png'),
            require('../../assets/textures/cubemap/car/left.png'),
            require('../../assets/textures/cubemap/car/top.png'),
            require('../../assets/textures/cubemap/car/bottom.png'),
            require('../../assets/textures/cubemap/car/front.png'),
            require('../../assets/textures/cubemap/car/back.png')
        ];
        // 创建由六个图像组成的立方体纹理。
        let cubeLoader = new THREE.CubeTextureLoader();
        // ⭐如果不为空，则设置渲染场景时使用的背景，并且总是首先渲染。可以设置为设置清晰颜色的 Color，覆盖画布的 Texture，立方体贴图作为 CubeTexture 或等矩形作为 Texture。默认为空。
        scene.background = cubeLoader.load(urls);

        // 球体
        let sphere = new THREE.SphereGeometry(8, 50, 50)
        let cubeMaterial = new THREE.MeshStandardMaterial({
            // 环境贴图。为确保物理上正确的呈现，应仅添加由 PMREM生成器预处理的环境映射。默认值为空。
            // 球面产生反射金属光泽越高，反射越清晰，粗糙度越高越浑浊
            envMap: scene.background,

            color: 0xffffff,
            // 金属程度
            metalness: 1,
            // 塑料程度
            roughness: 0.5
        });
        // 设置这俩个值的时候，metalness和roughness实际值是属性本身值和相应贴图中值的乘积

        let cubeMaterialWithMetalMap = cubeMaterial.clone();
        // 粗糙表面指定局部闪亮 ， metalnessMap设置金属质感贴图
        cubeMaterialWithMetalMap.metalnessMap = textureLoader.load(require("../../assets/textures/engraved/roughness-map.jpg"))

        let cubeMaterialWithRoughnessMap = cubeMaterial.clone();
        // 光滑表面指定局部粗糙 ， roughnessMap设置局部粗糙
        cubeMaterialWithRoughnessMap.roughnessMap = textureLoader.load(require("../../assets/textures/engraved/roughness-map.jpg"))

        let cube1 = new THREE.Mesh(sphere, cubeMaterialWithMetalMap)
        scene.add(cube1)
        cube1.position.x = -10;
        cube1.rotation.y = 1 / 3 * Math.PI;

        let cube2 = new THREE.Mesh(sphere, cubeMaterialWithRoughnessMap)
        scene.add(cube2)
        cube2.position.x = 10;
        cube2.rotation.y = -1 / 3 * Math.PI;


        render();
        var invert = 1;
        var phase = 0;
        function render() {
            control.update(clock.getDelta());
            stats.update();
            requestAnimationFrame(render);
            renderer.render(scene, camera);
            if (phase > 2 * Math.PI) {
                invert = invert * -1;
                phase -= 2 * Math.PI;
            } else {
                phase += 0.02;
            }

            sphereLightMesh.position.z = +(21 * (Math.sin(phase)));
            sphereLightMesh.position.x = -14 + (14 * (Math.cos(phase)));
            sphereLightMesh.position.y = 5;

            if (invert < 0) {
                let pivot = 0;
                sphereLightMesh.position.x = (invert * (sphereLightMesh.position.x - pivot)) + pivot;
            }
            pointLight.position.copy(sphereLightMesh.position);
        }
    },
};
</script>
<style scoped>

</style>
