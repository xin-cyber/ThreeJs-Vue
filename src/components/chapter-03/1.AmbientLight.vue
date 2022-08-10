<template><div></div></template>

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
    name: "AmbientLight",
    mounted() {
        // stats面板
        let stats = initStats();
        // 初始化渲染器renderer
        let renderer = initRenderer();
        // 初始化透视相机
        let camera = initCamera();

        // create a scene, that will hold all our elements such as objects, cameras and lights.
        let scene = new THREE.Scene();

        // add ambient lighting
        let ambientLight = new THREE.AmbientLight("#606008", 1);
        scene.add(ambientLight);

        // add spotlight for the shadows
        let spotLight = new THREE.SpotLight(0xffffff, 1, 180, Math.PI / 4);
        spotLight.shadow.mapSize.set(2048, 2048);
        // spotLight.position = new THREE.Vector3(-30, 40, -10);
        spotLight.position.set(-30, 40, -10);
        spotLight.castShadow = true;
        scene.add(spotLight);

        addHouseAndTree(scene);

        // add controls
        setupControls();
        let trackballControls = initTrackballControls(camera, renderer);
        let clock = new THREE.Clock();

        // call the render function
        render();

        function render() {
            trackballControls.update(clock.getDelta());
            stats.update();
            requestAnimationFrame(render);
            renderer.render(scene, camera);
        }

        function setupControls() {
            let controls = new (function () {
                this.intensity = ambientLight.intensity;
                this.ambientColor = ambientLight.color.getStyle();
                this.disableSpotlight = false;
            })();

            let gui = new dat.GUI();
            gui.add(controls, "intensity", 0, 3, 0.1).onChange(function () {
                ambientLight.color = new THREE.Color(controls.ambientColor);
                ambientLight.intensity = controls.intensity;
            });
            gui.addColor(controls, "ambientColor").onChange(function () {
                ambientLight.color = new THREE.Color(controls.ambientColor);
                ambientLight.intensity = controls.intensity;
            });
            gui.add(controls, "disableSpotlight").onChange(function (e) {
                spotLight.visible = !e;
            });
        }
    },
};
</script>
<style scoped></style>
