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
    name: "AlphaMapping",
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
        // 初始化加载器
        let textureLoader = new THREE.TextureLoader();

        // 创建一个大平面
        let planeGeometry = new THREE.PlaneGeometry(10000, 10000);
        let planeMaterial = new THREE.MeshPhongMaterial({
            color: 0xffffff,
        });
        planeMaterial.map = textureLoader.load(
            require("../../assets/textures/general/floor-wood.jpg")
        );
        // 水平方向纹理包裹方式，=> UV映射中的U
        planeMaterial.map.wrapS = THREE.RepeatWrapping; // 重复平铺
        // 垂直方向纹理包裹方式，=> UV映射中的V
        planeMaterial.map.wrapT = THREE.RepeatWrapping; // 重复平铺
        // 在UV方向上重复多少次，x轴和y轴上多久重复一次，大于1纹理重复平铺
        planeMaterial.map.repeat.set(80, 80);  // 越大图越小

        let plane = new THREE.Mesh(planeGeometry, planeMaterial);
        plane.receiveShadow = true;
        // rotate and position the plane
        plane.rotation.x = -0.5 * Math.PI;
        plane.position.x = 0;
        plane.position.y = -8;
        plane.position.z = 0;
        scene.add(plane);

        // ⭐创建球体
        let sphere = new THREE.SphereGeometry(8, 180, 180);
        let sphereMaterial = new THREE.MeshStandardMaterial({
            // Alpha 贴图是一个灰度纹理，它控制整个表面的不透明度(黑色: 完全透明; 白色: 完全不透明)。默认为空。
            alphaMap: textureLoader.load(
                require("../../assets/textures/alpha/partial-transparency.png")
            ),
            // 这种材料有多像金属。非金属材料，如木材或石材使用0.0，金属使用1.0，没有(通常)之间。默认值是0.0。一个介于0.0和1.0之间的值可用于生锈的金属外观。如果还提供了 metalnessMap，则两个值相乘。
            metalness: 0.02,
            // 材料看起来有多粗糙。0.0表示镜面反射平滑，1.0表示完全漫射。默认值为 1.0。如果还提供了roughnessMap，则两个值都相乘。
            roughness: 0.07,
            color: 0xffffff,
            // 设置运行 alpha 测试时使用的 alpha 值。如果不透明度低于这个值，材质将不会被渲染。默认值为0。
            // 越大越白黑白（0，1）
            alphaTest: 0.5,
            // side: THREE.DoubleSide
        });
        sphereMaterial.alphaMap.wrapS = THREE.RepeatWrapping;
        sphereMaterial.alphaMap.wrapT = THREE.RepeatWrapping;
        sphereMaterial.alphaMap.repeat.set(8, 8); // 越大图越小

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
