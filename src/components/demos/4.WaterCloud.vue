<template>
    <div></div>
</template>

<script>
import * as THREE from "three";
import Three2 from '../../libs/three/three.js'
// 导入控制器
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
// 导入水面
import { Water } from "three/examples/jsm/objects/Water2";
// 导入gltf载入库
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
// 模型解压库
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader";
export default {
    name: "WaterCloud",
    mounted() {

        // 初始化场景
        const scene = new THREE.Scene();

        // 初始化相机
        const camera = new THREE.PerspectiveCamera(
            75,
            window.innerWidth / window.innerHeight,
            0.1,
            2000
        );

        // 设置相机位置
        camera.position.set(-50, 50, 130);
        // 更新摄像头宽高比例
        camera.aspect = window.innerWidth / window.innerHeight;
        // 更新摄像头投影矩阵
        camera.updateProjectionMatrix();

        scene.add(camera);

        // 初始化渲染器
        const renderer = new THREE.WebGLRenderer({
            // 设置抗锯齿
            antialias: true,
            //   对数深度缓冲区
            logarithmicDepthBuffer: true,
        });
        renderer.outputEncoding = THREE.sRGBEncoding;

        // 设置渲染器宽高
        renderer.setSize(window.innerWidth, window.innerHeight);

        // 监听屏幕的大小改变，修改渲染器的宽高，相机的比例
        window.addEventListener("resize", () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        });

        // 将渲染器添加到页面
        document.body.appendChild(renderer.domElement);

        // 实例化控制器
        const controls = new OrbitControls(camera, renderer.domElement);
        let clock = new THREE.Clock();

        function render() {
            controls.update(clock.getDelta());
            // 渲染场景
            renderer.render(scene, camera);
            // 引擎自动更新渲染器
            requestAnimationFrame(render);
        }
        render();

        // 创建一个巨大的天空球体
        let texture = new THREE.TextureLoader().load(require("./assets/sky.jpg"));
        const skyGeometry = new THREE.SphereGeometry(1000, 60, 60);
        const skyMaterial = new THREE.MeshBasicMaterial({
            map: texture,
        });
        skyGeometry.scale(1, 1, -1);
        const sky = new THREE.Mesh(skyGeometry, skyMaterial);
        scene.add(sky);

        // 视频纹理
        const video = document.createElement("video");
        video.src = require("./assets/sky.mp4");
        video.loop = true;

        window.addEventListener("click", () => {
            // 当鼠标移动的时候播放视频
            //   判断视频是否处于播放状态
            if (video.paused) {
                video.play();
                let texture = new THREE.VideoTexture(video);
                skyMaterial.map = texture;
                skyMaterial.map.needsUpdate = true;
            }
        });

        // 载入环境纹理hdr
        const hdrLoader = new RGBELoader();
        hdrLoader.loadAsync("/hdr/050.hdr").then((texture) => {
            // 球面映射
            texture.mapping = THREE.EquirectangularReflectionMapping;
            scene.background = texture;
            scene.environment = texture;
        });

        // 添加平行光
        const light = new THREE.DirectionalLight(0xffffff, 1);
        light.position.set(-100, 100, 10);
        scene.add(light);

        // 创建水面
        const waterGeometry = new Three2.CircleGeometry(300, 64);
        const water = new Water(waterGeometry, {
            textureWidth: 1024,
            textureHeight: 1024,
            color: 0xeeeeff,
            flowDirection: new THREE.Vector2(1, 1),
            scale: 1,
            flowSpeed: 0.5,
        });
        water.position.y = 3;
        // 水面旋转至水平
        water.rotation.x = -Math.PI / 2;
        scene.add(water);

        // 添加小岛模型
        // 实例化gltf载入库
        const loader = new GLTFLoader();
        // 实例化draco载入库 模型解压
        const dracoLoader = new DRACOLoader();
        // 添加draco载入库
        dracoLoader.setDecoderPath("/glb/");
        // 添加draco载入库
        loader.setDRACOLoader(dracoLoader);

        loader.load("/Models/island2.glb", (gltf) => {
            scene.add(gltf.scene);
        });

    },
};
</script>
<style scoped>

</style>
