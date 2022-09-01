<template>
    <div></div>
</template>

<script>
import * as THREE from "three";
import Tween from "@tweenjs/tween.js";
// import * as dat from "dat.gui";
import {
    initCamera,
    initStats,
    initRenderer,
    initTrackballControls,
} from "../../utils/tools";

export default {
    name: "tweenjs",
    mounted() {
        // stats面板
        let stats = initStats();
        // 初始化渲染器renderer
        let renderer = initRenderer();
        // 初始化Scene
        let scene = new THREE.Scene();
        // 初始化透视相机
        let camera = initCamera(new THREE.Vector3(0, 40, 250), scene.position);
        // 初始化Controls
        let control = initTrackballControls(camera, renderer);
        let clock = new THREE.Clock();

        let geometry = new THREE.SphereGeometry(9, 32, 16);
        let material = new THREE.MeshBasicMaterial({
            color: new THREE.Color("#4ba2e2"),
        });
        let sphere = new THREE.Mesh(geometry, material);
        scene.add(sphere);

        // 从sphere.position到（50，50，50）花费10秒,补间动画
        let tweenStart = new Tween.Tween(sphere.position)
            .to({ x: 50, y: 50, z: 50 }, 10000)
            .start()
            // 补间动画期间运行logic
            .onUpdate((obj) => {
                // obj为sphere.position
                // console.log(obj);
            })
            //动画开始回调
            .onStart(() => {
                console.log("start");
            });

        let tweenBack = new Tween.Tween(sphere.position).to(
            { x: 0, y: 0, z: 0 },
            10000
        );

        // 重复次数
        // tween.repeat(Infinity)
        // 缓慢地开始，中间加速，
        tweenStart.easing(Tween.Easing.Quadratic.In);
        // 一开始会加速，但随着值的接近最终放缓
        tweenBack.easing(Tween.Easing.Quadratic.Out);
        // 一个补间结束的时候立即启动另外一个补间。我们称这为链式补间
        tweenStart.chain(tweenBack);
        tweenBack.chain(tweenStart);

        render();

        function render() {
            control.update(clock.getDelta());
            stats.update();
            Tween.update();
            requestAnimationFrame(render);
            renderer.render(scene, camera);
        }
    },
};
</script>
<style scoped></style>
