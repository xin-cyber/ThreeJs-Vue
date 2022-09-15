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
    initDefaultLighting
} from "../../utils/tools";

export default {
    name: "UVMapping",
    mounted() {
        // stats面板
        let stats = initStats();
        // 初始化渲染器renderer
        let renderer = initRenderer();
        // 初始化Scene
        let scene = new THREE.Scene();
        // 初始化透视相机
        let camera = initCamera(new THREE.Vector3(0, 45, 100), scene.position);
        // 初始化Controls
        let control = initTrackballControls(camera, renderer);
        let clock = new THREE.Clock();
        // 初始化加载器
        let textureLoader = new THREE.TextureLoader();
        // 初始化灯光
        initDefaultLighting(scene);
        scene.add(new THREE.AmbientLight(0x444444));

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
        planeMaterial.map.repeat.set(80, 80); // 越大图越小

        let plane = new THREE.Mesh(planeGeometry, planeMaterial);
        plane.receiveShadow = true;

        // rotate and position the plane
        plane.rotation.x = -0.5 * Math.PI;
        plane.position.x = 0;
        plane.position.y = -8;
        plane.position.z = 0;
        scene.add(plane);


        let material = new THREE.MeshStandardMaterial({
            map: textureLoader.load(require("../../assets/textures/uv/ash_uvgrid01.jpg")),
            metalness: 0.02,
            roughness: 0.07,
            color: 0xffffff
        });

        // // Jsonloader已经弃用
        // let jsonLoader = new THREE.JSONLoader();
        // // jsonLoader.load("../../assets/models/uv/uv-changed.json", function(model) {
        // jsonLoader.load("../../assets/models/uv/uv-standard.json", function (model) {
        //     let mesh = new THREE.Mesh(model, material)
        //     mesh.scale.set(8, 8, 8);
        //     mesh.rotation.y += 0.3 * Math.PI;
        //     scene.add(mesh);
        // });

        let geom = new THREE.BoxGeometry(14, 14, 14)
        // geom.faceVertexUvs[0][0][0].x = 0.5;
        // geom.faceVertexUvs[0][0][0].y = 0.7;
        // geom.faceVertexUvs[0][0][1].x = 0.4;
        // geom.faceVertexUvs[0][0][1].y = 0.1;
        // geom.faceVertexUvs[0][0][2].x = 0.4;
        // geom.faceVertexUvs[0][0][2].y = 0.5;
        console.log(geom);
        let mesh = new THREE.Mesh(geom, material)
        mesh.scale.set(2, 2, 2);
        mesh.rotation.y += 0.3 * Math.PI;
        scene.add(mesh);

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
