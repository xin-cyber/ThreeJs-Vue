<template>
    <div></div>
</template>

<script>
import * as THREE from "three";
import * as dat from "dat.gui";
import {
    initRenderer,
    initStats,
    initCamera,
    addLargeGroundPlane,
    applyMeshNormalMaterial,
    redrawGeometryAndUpdateUI,
    applyMeshStandardMaterial
} from "../../utils/tools";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader.js"
export default {
    name: "Fontloader",
    mounted() {
        // stats面板
        let stats = initStats();
        // 初始化渲染器renderer
        let renderer = initRenderer();
        // 初始化透视相机
        let camera = initCamera();

        // create a scene, that will hold all our elements such as objects, cameras and lights.
        let scene = new THREE.Scene();

        let groundPlane = addLargeGroundPlane(scene)
        groundPlane.position.y = -30;

        let font_bitstream;
        let font_helvetiker_bold;
        let font_helvetiker_regular;

        let step = 0;
        // let text1;
        // let text2;

        let fontload1 = new FontLoader();
        fontload1.load('../../assets/fonts/bitstream_vera_sans_mono_roman.typeface.json', function (response) {
            controls.font = response;
            font_bitstream = response;
            controls.redraw();
            render();
        });

        let fontload2 = new FontLoader();
        fontload2.load('../../assets/fonts/helvetiker_bold.typeface.json', function (response) {
            font_helvetiker_bold = response;
        });

        let fontload3 = new FontLoader();
        fontload3.load('../../assets/fonts/helvetiker_regular.typeface.json', function (response) {
            font_helvetiker_regular = response;
        });

        let controls = new function () {

            this.appliedMaterial = applyMeshNormalMaterial
            this.castShadow = true;
            this.groundPlaneVisible = true;

            this.size = 90;
            this.height = 90;
            this.bevelThickness = 2;
            this.bevelSize = 0.5;
            this.bevelEnabled = true;
            this.bevelSegments = 3;
            this.bevelEnabled = true;
            this.curveSegments = 12;
            this.steps = 1;
            this.fontName = "bitstream vera sans mono";

            // redraw function, updates the control UI and recreates the geometry.
            this.redraw = function () {

                switch (controls.fontName) {
                    case 'bitstream vera sans mono':
                        controls.font = font_bitstream
                        break;
                    case 'helvetiker':
                        controls.font = font_helvetiker_regular
                        break;
                    case 'helvetiker bold':
                        controls.font = font_helvetiker_bold
                        break;
                }

                redrawGeometryAndUpdateUI(gui, scene, controls, function () {
                    let options = {
                        size: controls.size,
                        height: controls.height,
                        weight: controls.weight,
                        font: controls.font,
                        bevelThickness: controls.bevelThickness,
                        bevelSize: controls.bevelSize,
                        bevelSegments: controls.bevelSegments,
                        bevelEnabled: controls.bevelEnabled,
                        curveSegments: controls.curveSegments,
                        steps: controls.steps
                    };

                    let geom = new THREE.TextGeometry("Learning Three.js", options)
                    geom.applyMatrix(new THREE.Matrix4().makeScale(0.05, 0.05, 0.05));
                    geom.center();

                    return geom
                });
            };
        };



        let gui = new dat.GUI();
        gui.add(controls, 'size', 0, 200).onChange(controls.redraw);
        gui.add(controls, 'height', 0, 200).onChange(controls.redraw);
        gui.add(controls, 'fontName', ['bitstream vera sans mono', 'helvetiker', 'helvetiker bold']).onChange(controls.redraw);
        gui.add(controls, 'bevelThickness', 0, 10).onChange(controls.redraw);
        gui.add(controls, 'bevelSize', 0, 10).onChange(controls.redraw);
        gui.add(controls, 'bevelSegments', 0, 30).step(1).onChange(controls.redraw);
        gui.add(controls, 'bevelEnabled').onChange(controls.redraw);
        gui.add(controls, 'curveSegments', 1, 30).step(1).onChange(controls.redraw);
        gui.add(controls, 'steps', 1, 5).step(1).onChange(controls.redraw);

        // add a material section, so we can switch between materials
        gui.add(controls, 'appliedMaterial', {
            meshNormal: applyMeshNormalMaterial,
            meshStandard: applyMeshStandardMaterial
        }).onChange(controls.redraw)

        gui.add(controls, 'castShadow').onChange(function (e) { controls.mesh.castShadow = e })
        gui.add(controls, 'groundPlaneVisible').onChange(function (e) { groundPlane.material.visible = e })

        function render() {
            stats.update();

            controls.mesh.rotation.y = step += 0.005
            controls.mesh.rotation.x = step
            controls.mesh.rotation.z = step

            // render using requestAnimationFrame
            requestAnimationFrame(render);
            renderer.render(scene, camera);
        }

    },
};
</script>
<style scoped>
</style>
