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
    name: "WorldPosition",
    mounted() {
        // stats面板
        let stats = initStats();
        // 初始化渲染器renderer
        let renderer = initRenderer();
        // 初始化Scene
        let scene = new THREE.Scene();
        // 初始化透视相机
        let camera = initCamera(new THREE.Vector3(0, 40, 50), scene.position);
        // 初始化Controls
        let control = initTrackballControls(camera, renderer);
        let clock = new THREE.Clock();
        // 初始化灯光，spotLight,AmbientLight
        initDefaultLighting(scene);

        // 创建球体
        let geometry = new THREE.SphereGeometry(9, 32, 16);
        let material = new THREE.MeshBasicMaterial({
            color: new THREE.Color("#4ba2e2"),
        });
        var mesh = new THREE.Mesh(geometry, material);
        // mesh的本地坐标设置为(50, 0, 0)
        mesh.position.set(50, 0, 0);
        var group = new THREE.Group();
        // group本地坐标设置和mesh一样设置为(50, 0, 0)
        // mesh父对象设置position会影响得到mesh的世界坐标
        group.position.set(50, 0, 0);
        group.add(mesh);
        scene.add(group);

        // .position属性获得本地坐标
        console.log('本地坐标', mesh.position);

        // getWorldPosition()方法获得世界坐标
        //该语句默认在threejs渲染的过程中执行,如果渲染之前想获得世界矩阵属性、世界位置属性等属性，需要通过代码更新
        scene.updateMatrixWorld(true);
        var worldPosition = new THREE.Vector3();
        mesh.getWorldPosition(worldPosition);
        console.log('世界坐标', worldPosition);

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
