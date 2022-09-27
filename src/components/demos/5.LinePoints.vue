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
    name: "LinePoints",
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

        // // 8个点，每个点是方形的面
        // var geometry = new THREE.BoxGeometry(100, 100, 100); //创建一个立方体几何对象Geometry
        // // 点渲染模式
        // var material = new THREE.PointsMaterial({
        //     color: 0xff0000,
        //     size: 5.0 //点对象像素尺寸
        // }); //材质对象
        // var points = new THREE.Points(geometry, material); //点模型对象
        // scene.add(points); //点对象添加到场景中


        var geometry = new THREE.BoxGeometry(100, 100, 100); //创建一个立方体几何对象Geometry
        // 线条渲染模式
        var material = new THREE.LineBasicMaterial({
            color: 0xff0000 //线条颜色
        });//材质对象
        // 创建线模型对象   构造函数：Line、LineLoop、LineSegments
        var line = new THREE.Line(geometry, material);//线条模型对象
        scene.add(line); //线条对象添加到场景中

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
