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
    initDefaultLighting,
    addLargeGroundPlane,
    initTrackballControls,
    applyMeshNormalMaterial,
    redrawGeometryAndUpdateUI,
    applyMeshStandardMaterial
} from "../../utils/tools";
import { ConvexGeometry } from "three/examples/jsm/geometries/ConvexGeometry.js"
export default {
    name: "ConvexGeometry",
    mounted() {
        // stats面板
        let stats = initStats();
        // 初始化渲染器renderer
        let renderer = initRenderer();
        // 初始化透视相机
        let camera = initCamera();

        // create a scene, that will hold all our elements such as objects, cameras and lights.
        let scene = new THREE.Scene();

        // add a simple scenelight
        initDefaultLighting(scene);

        var groundPlane = addLargeGroundPlane(scene)
        groundPlane.position.y = -30;

        var step = 0;
        var spGroup;

        // setup the control gui
        var controls = new function () {
            this.appliedMaterial = applyMeshNormalMaterial
            this.castShadow = true;
            this.groundPlaneVisible = true;

            this.redraw = function () {
                redrawGeometryAndUpdateUI(gui, scene, controls, function () {
                    return generatePoints()
                });
            };
        };
        var gui = new dat.GUI();
        gui.add(controls, 'appliedMaterial', {
            meshNormal: applyMeshNormalMaterial,
            meshStandard: applyMeshStandardMaterial
        }).onChange(controls.redraw)

        gui.add(controls, 'redraw');
        gui.add(controls, 'castShadow').onChange(function (e) { controls.mesh.castShadow = e })
        gui.add(controls, 'groundPlaneVisible').onChange(function (e) { groundPlane.material.visible = e })

        controls.redraw();
        render();

        let trackballControls = initTrackballControls(camera, renderer);
        let clock = new THREE.Clock();


        render();

        function generatePoints() {

            if (spGroup) scene.remove(spGroup)
            // add 10 random spheres
            var points = [];
            for (var i = 0; i < 20; i++) {
                var randomX = -15 + Math.round(Math.random() * 30);
                var randomY = -15 + Math.round(Math.random() * 30);
                var randomZ = -15 + Math.round(Math.random() * 30);

                points.push(new THREE.Vector3(randomX, randomY, randomZ));
            }

            spGroup = new THREE.Object3D();
            var material = new THREE.MeshBasicMaterial({
                color: 0xff0000,
                transparent: false
            });
            points.forEach(function (point) {

                var spGeom = new THREE.SphereGeometry(0.2);
                var spMesh = new THREE.Mesh(spGeom, material);
                spMesh.position.copy(point);
                spGroup.add(spMesh);
            });
            // add the points as a group to the scene
            scene.add(spGroup);

            // use the same points to create a convexgeometry
            var convexGeometry = new ConvexGeometry(points);
            // not defined 
            convexGeometry.computeVertexNormals();
            convexGeometry.computeFaceNormals();
            convexGeometry.normalsNeedUpdate = true;
            return convexGeometry;
        }
        function render() {

            trackballControls.update(clock.getDelta());
            stats.update();

            controls.mesh.rotation.y = step += 0.005
            controls.mesh.rotation.x = step
            controls.mesh.rotation.z = step

            if (spGroup) {
                spGroup.rotation.y = step
                spGroup.rotation.x = step
                spGroup.rotation.z = step
            }

            // render using requestAnimationFrame
            requestAnimationFrame(render);
            renderer.render(scene, camera);
        }

    },
};
</script>
<style scoped>
</style>
