<template>
    <div></div>
</template>

<script>
import * as THREE from "three";
import * as dat from "dat.gui";
import {
    initCamera,
    initStats,
    initRenderer,
    addLargeGroundPlane,
    initDefaultLighting,
    applyMeshNormalMaterial,
    applyMeshStandardMaterial,
    redrawGeometryAndUpdateUI
} from "../../utils/tools";

export default {
    name: "BufferGeometry",
    mounted() {
        // stats面板
        let stats = initStats();
        // 初始化渲染器renderer
        let renderer = initRenderer();
        // 初始化透视相机
        let camera = initCamera();
        let scene = new THREE.Scene();
        // 大平面receiveShadow
        let groundPlane = addLargeGroundPlane(scene)
        groundPlane.position.y = -30;
        // 初始化灯光，spotLight,AmbientLight
        initDefaultLighting(scene);

        // setup the control parts of the ui
        let controls = new function () {
            let self = this;
            this.curveSegments = 12;

            // MeshNormalMaterial
            this.appliedMaterial = applyMeshNormalMaterial
            this.castShadow = true;
            this.groundPlaneVisible = true;

            // redraw function, updates the control UI and recreates the geometry.
            this.redraw = function () {
                redrawGeometryAndUpdateUI(gui, scene, controls, function () {
                    return new THREE.ShapeGeometry(drawShape(), self.curveSegments).center();
                });
            };
        };

        // create the GUI with the specific settings for this geometry
        let gui = new dat.GUI();
        gui.add(controls, 'curveSegments', 1, 100, 1).onChange(controls.redraw);
        // add a material section, so we can switch between materials
        gui.add(controls, 'appliedMaterial', {
            // 各种material
            meshNormal: applyMeshNormalMaterial,
            meshStandard: applyMeshStandardMaterial
        }).onChange(controls.redraw)

        gui.add(controls, 'castShadow').onChange(function (e) { controls.mesh.castShadow = e })
        gui.add(controls, 'groundPlaneVisible').onChange(function (e) { groundPlane.material.visible = e })

        // initialize the first redraw so everything gets initialized
        controls.redraw();
        let step = 0;
        // call the render function
        render();
        function render() {
            stats.update();
            controls.mesh.rotation.y = step += 0.01
            controls.mesh.rotation.x = step
            controls.mesh.rotation.z = step
            requestAnimationFrame(render);
            renderer.render(scene, camera);
        }


        function drawShape() {

            // 实例化shape对象,路径定义任意2d形状平面
            let shape = new THREE.Shape();

            // 起始点位置
            shape.moveTo(10, 10);

            // 从起始点位置画一条线到该位置
            shape.lineTo(10, 40);

            // 画曲线到终点坐标（30，40）
            // 前四个是画曲线参数，后俩是终点坐标
            shape.bezierCurveTo(15, 25, 25, 25, 30, 40);

            // 设置一条通过当前所有顶点的光滑曲线
            shape.splineThru(
                [new THREE.Vector2(32, 30),
                new THREE.Vector2(28, 20),
                new THREE.Vector2(30, 10),
                ]);

            // 设置曲线回到顶点，后俩是终点坐标
            shape.quadraticCurveTo(20, 15, 10, 10);

            // 画第一个眼
            let hole1 = new THREE.Path();
            hole1.absellipse(16, 24, 2, 3, 0, Math.PI * 2, true);
            shape.holes.push(hole1);

            // 画第二个眼
            let hole2 = new THREE.Path();
            hole2.absellipse(23, 24, 2, 3, 0, Math.PI * 2, true);
            shape.holes.push(hole2);

            // 添加嘴巴
            let hole3 = new THREE.Path();
            hole3.absarc(20, 16, 2, 0, Math.PI, true);
            shape.holes.push(hole3);

            // return the shape
            return shape;
        }


    },
};
</script>
<style scoped>
</style>
