<template>
    <div></div>
</template>

<script>
import * as THREE from "three";
import * as dat from "dat.gui";
import Stats from "stats-js";
// import { TrackballControls } from 'three/examples/jsm/controls/TrackballControls.js';
import { initTrackballControls } from "../../utils/tools";
import { FXAAShader } from "three/examples/jsm/shaders/FXAAShader";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass";
import { OutlinePass } from "three/examples/jsm/postprocessing/OutlinePass";

export default {
    name: "EffectComposer",
    mounted() {
        let composer = null,
            outlinePass = null,
            renderPass = null;
        // stats
        let stats = Stats();
        stats.dom.style.marginTop = "35px";
        stats.dom.setAttribute("id", "stats");
        document.body.appendChild(stats.dom);

        // listen to the resize events
        window.addEventListener("resize", onResize, false);

        // default setup
        let scene = new THREE.Scene();
        let camera = new THREE.PerspectiveCamera(
            45,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        );
        let renderer = new THREE.WebGLRenderer({
            antialias: true,
            alpha: true,
        });

        renderer.setClearColor(new THREE.Color(0xffffff), 0.1);
        // console.log(renderer.setClearColor());
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.shadowMap.enabled = true;
        console.log(renderer);

        // create the ground plane
        let planeGeometry = new THREE.PlaneGeometry(60, 20, 1, 1);
        let planeMaterial = new THREE.MeshLambertMaterial({ color: 0xffffff });
        let plane = new THREE.Mesh(planeGeometry, planeMaterial);
        plane.receiveShadow = true;

        // rotate and position the plane
        plane.rotation.x = -0.5 * Math.PI;
        plane.position.x = 15;
        plane.position.y = 0;
        plane.position.z = 0;

        // add the plane to the scene
        scene.add(plane);

        // create a cube
        let cubeGeometry = new THREE.BoxGeometry(4, 4, 4);
        let cubeMaterial = new THREE.MeshLambertMaterial({ color: 0xff0000 });
        let cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
        cube.castShadow = true;

        // position the cube
        cube.position.x = -4;
        cube.position.y = 4;
        cube.position.z = 0;

        // add the cube to the scene
        scene.add(cube);

        let sphereGeometry = new THREE.SphereGeometry(4, 20, 20);
        let sphereMaterial = new THREE.MeshLambertMaterial({ color: 0x7777ff });
        let sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);

        // position the sphere
        sphere.position.x = 20;
        sphere.position.y = 0;
        sphere.position.z = 2;
        sphere.castShadow = true;

        // add the sphere to the scene
        scene.add(sphere);

        // position and point the camera to the center of the scene
        camera.position.x = -30;
        camera.position.y = 40;
        camera.position.z = 30;
        camera.lookAt(scene.position);

        // add subtle ambient lighting
        let ambienLight = new THREE.AmbientLight(0x353535);
        scene.add(ambienLight);

        // add spotlight for the shadows
        let spotLight = new THREE.SpotLight(0xffffff);
        spotLight.position.set(-10, 20, -5);
        spotLight.castShadow = true;
        scene.add(spotLight);

        // add the output of the renderer to the html element
        document.body.appendChild(renderer.domElement);

        // call the render function
        let step = 0;

        let controls = {
            rotationSpeed: 0.02,
            bouncingSpeed: 0.03,
        };

        let gui = new dat.GUI();
        gui.add(controls, "rotationSpeed", 0, 0.5);
        gui.add(controls, "bouncingSpeed", 0, 0.5);

        // attach them here, since appendChild needs to be called first
        let trackballControls = initTrackballControls(camera, renderer);

        let clock = new THREE.Clock();

        // 创建一个EffectComposer（效果组合器）对象，然后在该对象上添加后期处理通道。
        composer = new EffectComposer(renderer);
        // 新建一个场景通道  为了覆盖到原理来的场景上
        renderPass = new RenderPass(scene, camera);
        composer.addPass(renderPass);
        // 物体边缘发光通道
        outlinePass = new OutlinePass(
            new THREE.Vector2(window.innerWidth, window.innerHeight),
            scene,
            camera,
            [sphere]
        );
        outlinePass.selectedObjects = [sphere];
        outlinePass.edgeStrength = 10.0; // 边框的亮度
        outlinePass.edgeGlow = 1; // 光晕[0,1]
        outlinePass.usePatternTexture = false; // 是否使用父级的材质
        outlinePass.edgeThickness = 1.0; // 边框宽度
        outlinePass.downSampleRatio = 1; // 边框弯曲度
        outlinePass.pulsePeriod = 5; // 呼吸闪烁的速度
        outlinePass.visibleEdgeColor.set(parseInt(0x00ff00)); // 呼吸显示的颜色
        outlinePass.hiddenEdgeColor = new THREE.Color(0, 0, 0); // 呼吸消失的颜色
        outlinePass.clear = true;
        composer.addPass(outlinePass);
        // 自定义的着色器通道 作为参数
        var effectFXAA = new ShaderPass(FXAAShader);
        effectFXAA.uniforms.resolution.value.set(
            1 / window.innerWidth,
            1 / window.innerHeight
        );
        effectFXAA.renderToScreen = true;
        composer.addPass(effectFXAA);

        renderScene();

        function renderScene() {
            // update the stats and the controls
            trackballControls.update(clock.getDelta()); // clock.getDelta()返回俩次调用时间间隔， // 相机更新
            stats.update();

            // rotate the cube around its axes
            cube.rotation.x += controls.rotationSpeed;
            cube.rotation.y += controls.rotationSpeed;
            cube.rotation.z += controls.rotationSpeed;

            // bounce the sphere up and down
            step += controls.bouncingSpeed; // 小球速度
            sphere.position.x = 20 + 10 * Math.cos(step);
            sphere.position.y = 2 + 10 * Math.abs(Math.sin(step));

            // render using requestAnimationFrame
            requestAnimationFrame(renderScene);

            renderer.render(scene, camera);
            if (composer) {
                composer.render();
            }
        }

        function onResize() {
            camera.aspect = window.innerWidth / window.innerHeight; //camera第二个参数；渲染窗口的长宽比
            camera.updateProjectionMatrix(); // 更新相机
            renderer.setSize(window.innerWidth, window.innerHeight); // 更新canvas大小，renderer
        }
    },
};
</script>
<style scoped></style>
