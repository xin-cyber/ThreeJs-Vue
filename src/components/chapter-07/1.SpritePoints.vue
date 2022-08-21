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
    initTrackballControls
} from "../../utils/tools";

export default {
    name: "SpritePoints",
    mounted() {
        // stats面板
        let stats = initStats();
        // 初始化渲染器renderer
        let renderer = initRenderer();
        // 初始化透视相机
        let camera = initCamera(new THREE.Vector3(0, 0, 150));
        let scene = new THREE.Scene();
        // position and point the camera to the center of the scene

        let control = initTrackballControls(camera, renderer)
        let clock = new THREE.Clock()
        // createSprites();
        createPoints()
        render();

        function render() {
            control.update(clock.getDelta())
            stats.update();
            requestAnimationFrame(render);
            renderer.render(scene, camera);
        }

        function createSprites() {
            for (let x = -15; x < 15; x++) {
                for (let y = -10; y < 10; y++) {
                    let material = new THREE.SpriteMaterial({
                        color: Math.random() * 0xffffff
                    });
                    // 永远面向相机
                    // Theww.Objece3D的扩展,类似于Mesh
                    let sprite = new THREE.Sprite(material);
                    sprite.position.set(x * 4, y * 4, 0);
                    scene.add(sprite);
                }
            }
        }
        // three需要单独管理每个sprite对象
        // 使用大量sprite会存在性能问题，需要使用THREE.Points，集中管理Three.Points
        // geometry弃用,改用BufferGeometry基类
        function createPoints() {
            const gemo = new THREE.BufferGeometry()
            const material = new THREE.PointsMaterial({
                'size': 2,
                'vertexColors': true,
                'color': 0xffffff
            })
            let veticsFloat32Array = []
            let veticsColors = []
            for (let x = -15; x < 15; x++) {
                for (let y = -15; y < 15; y++) {
                    veticsFloat32Array.push(x * 4, y * 4, 0)
                    // 生成随机颜色
                    const randomColor = new THREE.Color(Math.random() * 0xffffff)
                    // 必要值
                    veticsColors.push(randomColor.r, randomColor.g, randomColor.b)
                }
            }
            // 坐标
            const vertices = new THREE.Float32BufferAttribute(veticsFloat32Array, 3)
            const colors = new THREE.Float32BufferAttribute(veticsColors, 3)
            gemo.attributes.position = vertices
            gemo.attributes.color = colors

            const cloud = new THREE.Points(gemo, material)
            scene.add(cloud)
        }

    },
};
</script>
<style scoped>
</style>
