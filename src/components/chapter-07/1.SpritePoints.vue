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
        let camera = initCamera();
        let scene = new THREE.Scene();
        // position and point the camera to the center of the scene
        camera.position.x = 0;
        camera.position.y = 0;
        camera.position.z = 150;
        camera.lookAt(new THREE.Vector3(0, 0, 0))

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
        // geometry弃用
        function createPoints() {
            let geom = new THREE.BufferGeometry();
            let material = new THREE.PointsMaterial({
                size: 2,
                vertexColors: true,
                color: 0xffffff
            });

            for (let x = -15; x < 15; x++) {
                for (let y = -10; y < 10; y++) {
                    const vertices = new Float32Array([
                        // JavaScript 类型化数组是一种类似数组的对象，并提供了一种用于访问原始二进制数据的机制。
                        // -5.0, -5.0, 5.0,
                        // 5.0, -5.0, 5.0,
                        // 5.0, 5.0, 5.0,

                        // 5.0, 5.0, 5.0,
                        // -5.0, 5.0, 5.0,
                        // -5.0, -5.0, 5.0
                    ]);
                    let particle = new THREE.Vector3(x * 4, y * 4, 0);
                    vertices.set(particle);
                    console.log(vertices);
                    // ⭐数组 vertices 中每三个元素构成一个点
                    geom.setAttribute('position', new THREE.BufferAttribute(vertices, 3));

                    var colors = new Uint8Array([

                    ]);
                    let particle2 = new THREE.Vector3(255, 125, 250);

                    colors.set(particle2)
                    // Don't forget to normalize the array! (third param = true)
                    geom.setAttribute('color', new THREE.BufferAttribute(colors, 3, true));
                    // geom.setAttribute('color', new THREE.Color(Math.random() * 0xffffff));

                    // geom.colors.push(new THREE.Color(Math.random() * 0xffffff));
                }
            }

            let cloud = new THREE.Points(geom, material);
            scene.add(cloud);
        }


    },
};
</script>
<style scoped>
</style>
