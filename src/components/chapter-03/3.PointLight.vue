<template>
    <div></div>
</template>

<script>
import * as THREE from "three";
import * as dat from "dat.gui";
import {
    initTrackballControls,
    initStats,
    initRenderer,
    initCamera,
    addHouseAndTree,
} from "../../utils/tools";

export default {
    name: "PointLight",
    mounted() {
        // stats面板
        let stats = initStats();
        // 初始化渲染器renderer
        let renderer = initRenderer();
        // 初始化透视相机
        let camera = initCamera();

        // create a scene, that will hold all our elements such as objects, cameras and lights.
        let scene = new THREE.Scene();

        // add a simple scene
        addHouseAndTree(scene)

        // add ambient lighting
        let ambientLight = new THREE.AmbientLight("#0c0c0c");
        scene.add(ambientLight);

        // the point light where working with
        let pointColor = "#ccffcc";
        let pointLight = new THREE.PointLight(pointColor);
        pointLight.decay = 0.1
        pointLight.castShadow = true;
        scene.add(pointLight);

        // 顶上白色立方体
        let helper = new THREE.PointLightHelper(pointLight);
        scene.add(helper);

        let shadowHelper = new THREE.CameraHelper(pointLight.shadow.camera)
        scene.add(shadowHelper)


        // add a small sphere simulating the pointlight
        let sphereLight = new THREE.SphereGeometry(0.2);
        let sphereLightMaterial = new THREE.MeshBasicMaterial({
            color: 0xac6c25
        });
        let sphereLightMesh = new THREE.Mesh(sphereLight, sphereLightMaterial);
        // sphereLightMesh.position = new THREE.Vector3(3, 0, 5);
        scene.add(sphereLightMesh);

        let trackballControls = initTrackballControls(camera, renderer);
        let clock = new THREE.Clock();

        // for controlling the rendering
        // let step = 0;
        let invert = 1;
        let phase = 0;

        let controls = setupControls();
        render();
        function render() {
            helper.update();
            shadowHelper.update();
            // 对象复制
            pointLight.position.copy(sphereLightMesh.position);
            trackballControls.update(clock.getDelta());
            stats.update();

            // move the light simulation
            if (phase > 2 * Math.PI) {
                invert = invert * -1;
                phase -= 2 * Math.PI;
            } else {
                phase += controls.rotationSpeed;
            }
            sphereLightMesh.position.z = +(25 * (Math.sin(phase)));
            sphereLightMesh.position.x = +(14 * (Math.cos(phase)));
            sphereLightMesh.position.y = 5;

            if (invert < 0) {
                let pivot = 14;
                sphereLightMesh.position.x = (invert * (sphereLightMesh.position.x - pivot)) + pivot;
            }

            // render using requestAnimationFrame
            requestAnimationFrame(render);
            renderer.render(scene, camera);
        }
        function setupControls() {
            let controls = new function () {
                this.rotationSpeed = 0.01;
                this.bouncingSpeed = 0.03;
                this.ambientColor = ambientLight.color.getStyle();
                this.pointColor = pointLight.color.getStyle();
                this.intensity = 1;
                this.distance = pointLight.distance;
            };

            let gui = new dat.GUI();
            gui.addColor(controls, 'ambientColor').onChange(function (e) {
                ambientLight.color = new THREE.Color(e);
            });

            gui.addColor(controls, 'pointColor').onChange(function (e) {
                pointLight.color = new THREE.Color(e);
            });

            gui.add(controls, 'distance', 0, 100).onChange(function (e) {
                pointLight.distance = e;
            });

            gui.add(controls, 'intensity', 0, 3).onChange(function (e) {
                pointLight.intensity = e;
            });

            return controls;
        }

    },
};
</script>
<style scoped>
</style>
