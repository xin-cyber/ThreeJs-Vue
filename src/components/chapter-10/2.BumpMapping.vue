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
    name: "BumpMapping",
    mounted() {
        // stats面板
        let stats = initStats();
        // 初始化渲染器renderer
        let renderer = initRenderer();
        // 初始化Scene
        let scene = new THREE.Scene();
        // 初始化透视相机
        let camera = initCamera(new THREE.Vector3(0, 20, 70), scene.position);
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
        // 在UV方向上重复多少次，x轴和y轴上重复多少次，大于1纹理重复平铺
        planeMaterial.map.repeat.set(80, 80); // 越大图越小

        let plane = new THREE.Mesh(planeGeometry, planeMaterial);
        plane.receiveShadow = true;

        // rotate and position the plane
        plane.rotation.x = -0.5 * Math.PI;
        plane.position.x = 0;
        plane.position.y = -8;
        plane.position.z = 0;
        scene.add(plane);

        // ⭐创建立方体
        let cube = new THREE.BoxGeometry(10, 10, 10);
        let cubeMaterial = new THREE.MeshStandardMaterial({
            map: textureLoader.load(
                require("../../assets/textures/stone/stone.jpg")
            ),
            // 这种材料有多像金属。非金属材料，如木材或石材使用0.0，金属使用1.0，没有(通常)之间。默认值是0.0。一个介于0.0和1.0之间的值可用于生锈的金属外观。如果还提供了 metalnessMap，则两个值相乘。
            metalness: 0.2,
            // 材料看起来有多粗糙。0.0表示镜面反射平滑，1.0表示完全漫射。默认值为 1.0。如果还提供了roughnessMap，则两个值都相乘。
            roughness: 0.07,
        });
        let cube1 = new THREE.Mesh(cube, cubeMaterial);
        scene.add(cube1);
        cube1.position.x = -25;
        cube1.rotation.y = (1 / 3) * Math.PI;

        // ⭐创建纹理贴图立方体
        let cubeMaterialWithBumpMap = cubeMaterial.clone();
        // 创建凹凸贴图的纹理。黑色和白色的数值映射到相对于光的感知深度。⭐凹凸不会影响物体的几何形状，只会影响光线。如果定义了法线贴图，这将被忽略。
        cubeMaterialWithBumpMap.bumpMap = textureLoader.load(
            require("../../assets/textures/stone/stone-bump.jpg")
        );
        // bumpScale [0,1] default:1 ; 纹理的高度
        let cube2 = new THREE.Mesh(cube, cubeMaterialWithBumpMap);
        scene.add(cube2);
        cube2.position.x = -10;
        cube2.rotation.y = (1 / 3) * Math.PI;

        // ⭐创建法向量贴图，细节更加丰富
        let cubeMaterialWithNormalMap = cubeMaterial.clone();
        cubeMaterialWithNormalMap.normalMap = textureLoader.load(
            require("../../assets/textures/general/plaster-normal.jpg")
        );
        // normalScale new THREE.Vector2(1,1)凹凸程度，x轴和y轴进行缩放，最好设置一样
        // 创建法线贴图的纹理。RGB 值影响每个像素片段的表面法线并改变颜色的亮度。⭐法线贴图不改变表面的实际形状，只改变光照。覆盖基本纹理贴图bumpMap
        let cube3 = new THREE.Mesh(cube, cubeMaterialWithNormalMap);
        scene.add(cube3);
        cube3.position.x = 5;
        cube3.rotation.y = (1 / 3) * Math.PI;
        console.log(cube3);

        // ⭐创建位移贴图,改变物体形状
        // ⭐顶点数必须足够多(180),否则移动效果不明显，无顶点可以移动
        // let cubeX = new THREE.BoxGeometry(10, 10, 10, 180, 180, 180);
        let sphere = new THREE.SphereGeometry(8, 180, 180);
        let moveMaterial = new THREE.MeshStandardMaterial({
            map: textureLoader.load(
                require("../../assets/textures/uv-move/w_c.jpg")
            ),
            // 设置纹理对象,位移贴图
            displacementMap: textureLoader.load(
                require("../../assets/textures/uv-move/w_d.png")
            ),
            // displacementScale and displacementOffset 控制顶点的移动程度
            metalness: 0.02,
            roughness: 0.07,
            color: 0xffffff,
        });
        let cube4 = new THREE.Mesh(sphere, moveMaterial);
        cube4.castShadow = true;
        scene.add(cube4);
        cube4.position.x = 22;
        cube4.rotation.y = (1 / 3) * Math.PI;

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
