<template>
    <div></div>
</template>

<script>
import * as THREE from "three";
import * as dat from "dat.gui";
import { createMultiMaterialObject } from "three/examples/jsm/utils/SceneUtils.js";
import {
    initRenderer,
    initStats,
} from "../../utils/tools";

export default {
    name: "CombineMaterial",
    mounted() {
        // stats面板
        let stats = initStats();
        // 初始化渲染器renderer
        let renderer = initRenderer();
        let scene = new THREE.Scene();

        // create a camera, which defines where we're looking at.
        let camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 50, 110);
        camera.position.set(-50, 40, 50);
        camera.lookAt(scene.position);

        // call the render function
        // let step = 0;

        let controls = new function () {
            this.cameraNear = camera.near;
            this.cameraFar = camera.far;
            this.rotationSpeed = 0.02;
            this.numberOfObjects = scene.children.length;
            this.color = 0x00ff00;


            this.removeCube = function () {
                let allChildren = scene.children;
                let lastObject = allChildren[allChildren.length - 1];
                if (lastObject instanceof THREE.Group) {
                    scene.remove(lastObject);
                    this.numberOfObjects = scene.children.length;
                }
            };

            this.addCube = function () {

                let cubeSize = Math.ceil(3 + (Math.random() * 3));
                let cubeGeometry = new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize);

                //let cubeMaterial = new THREE.MeshLambertMaterial({color:  Math.random() * 0xffffff });
                // 获取颜色变化，离相机远近变化
                let cubeMaterial = new THREE.MeshDepthMaterial();
                // 获取颜色
                let colorMaterial = new THREE.MeshBasicMaterial({
                    color: controls.color,
                    transparent: true, // 必要，否则会是纯绿色实心立方体，不执行融合操作
                    // 融合模式，前景色和背景色相乘，
                    blending: THREE.MultiplyBlending
                });
                // 复合材质创建Group对象；为materials数组每个材质创建一个实例，然后再把这些实例存放到一个three.object3d对象里面，使用方法类似于scene.children
                let cube = createMultiMaterialObject(cubeGeometry, [colorMaterial,
                    cubeMaterial
                ]);
                // 缩小MeshDepthMaterial对象，避免渲染闪烁问题
                cube.children[1].scale.set(0.99, 0.99, 0.99);
                cube.castShadow = true;
                console.log(cube);
                // position the cube randomly in the scene
                cube.position.x = -60 + Math.round((Math.random() * 100));
                cube.position.y = Math.round((Math.random() * 10));
                cube.position.z = -100 + Math.round((Math.random() * 150));

                // add the cube to the scene
                scene.add(cube);
                this.numberOfObjects = scene.children.length;
            };

            this.outputObjects = function () {
                console.log(scene.children);
            }
        };

        let gui = new dat.GUI();
        gui.addColor(controls, 'color');
        gui.add(controls, 'rotationSpeed', 0, 0.5);
        gui.add(controls, 'addCube');
        gui.add(controls, 'removeCube');
        gui.add(controls, 'cameraNear', 0, 50).onChange(function (e) {
            camera.near = e;
            camera.updateProjectionMatrix();
        });
        gui.add(controls, 'cameraFar', 50, 200).onChange(function (e) {
            camera.far = e;
            camera.updateProjectionMatrix();
        });

        let i = 0;
        while (i < 10) {
            controls.addCube();
            i++;
        }

        render();

        function render() {
            stats.update();

            // rotate the cubes around its axes
            scene.traverse(function (e) {
                if (e instanceof THREE.Group) {
                    e.rotation.x += controls.rotationSpeed;
                    e.rotation.y += controls.rotationSpeed;
                    e.rotation.z += controls.rotationSpeed;
                }
            });

            // render using requestAnimationFrame
            requestAnimationFrame(render);
            renderer.render(scene, camera);
        }
        console.log(scene);
    },
};
</script>
<style scoped>
</style>
