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
    addGroundPlane,
    addDefaultCubeAndSphere,
} from "../../utils/tools";

export default {
    name: "SpotLight",
    mounted() {
        // stats面板
        let stats = initStats();
        // 初始化渲染器renderer
        let renderer = initRenderer();
        // 初始化透视相机
        let camera = initCamera();

        // create a scene, that will hold all our elements such as objects, cameras and lights.
        let scene = new THREE.Scene();

        // add a cube and a sphere
        let cubeAndSphere = addDefaultCubeAndSphere(scene);
        let cube = cubeAndSphere.cube;
        let sphere = cubeAndSphere.sphere;

        // add a plane
        let plane = addGroundPlane(scene);

        // add ambient lighting
        let ambientLight = new THREE.AmbientLight("#1c1c1c");
        scene.add(ambientLight);

        // add spotlight for a bit of light, 让环境亮一点
        let spotLight0 = new THREE.SpotLight(0xcccccc);
        spotLight0.position.set(-40, 30, -10);
        spotLight0.lookAt(plane);
        scene.add(spotLight0);

        // add target and light
        // let target = new THREE.Object3D();
        // target.position = new THREE.Vector3(5, 0, 0);

        let spotLight = new THREE.SpotLight("#ffffff");
        spotLight.position.set(-40, 60, -10);
        spotLight.castShadow = true;
        spotLight.shadow.camera.near = 1;
        spotLight.shadow.camera.far = 100;
        spotLight.target = plane;
        spotLight.distance = 0;
        spotLight.angle = 0.4; // 光束宽度默认是Math.PI / 3
        spotLight.shadow.camera.fov = 120;
        scene.add(spotLight);

        // 可视化相机视角
        let debugCamera = new THREE.CameraHelper(spotLight.shadow.camera);
        // 可视化light辅助线（初始化的线）
        let pp = new THREE.SpotLightHelper(spotLight)
        scene.add(pp)

        // add a small sphere simulating the pointlight
        let sphereLight = new THREE.SphereGeometry(0.2);
        let sphereLightMaterial = new THREE.MeshBasicMaterial({
            color: 0xac6c25
        });
        let sphereLightMesh = new THREE.Mesh(sphereLight, sphereLightMaterial);
        sphereLightMesh.castShadow = true;
        // sphereLightMesh.position = new THREE.Vector3(3, 20, 3);
        scene.add(sphereLightMesh);

        let trackballControls = initTrackballControls(camera, renderer);
        let clock = new THREE.Clock();

        // for controlling the rendering
        let step = 0;
        let invert = 1;
        let phase = 0;

        let controls = setupControls();
        render();

        function render() {
            trackballControls.update(clock.getDelta());
            stats.update();
            // rotate the cube around its axes
            cube.rotation.x += controls.rotationSpeed;
            cube.rotation.y += controls.rotationSpeed;
            cube.rotation.z += controls.rotationSpeed;

            // bounce the sphere up and down
            step += controls.bouncingSpeed;
            sphere.position.x = 20 + (10 * (Math.cos(step)));
            sphere.position.y = 2 + (10 * Math.abs(Math.sin(step)));

            // move the light simulation
            if (!controls.stopMovingLight) {
                if (phase > 2 * Math.PI) {
                    invert = invert * -1;
                    phase -= 2 * Math.PI;
                } else {
                    phase += controls.rotationSpeed;
                }
                sphereLightMesh.position.z = +(7 * (Math.sin(phase)));
                sphereLightMesh.position.x = +(14 * (Math.cos(phase)));
                sphereLightMesh.position.y = 15;

                if (invert < 0) {
                    let pivot = 14;
                    sphereLightMesh.position.x = (invert * (sphereLightMesh.position.x - pivot)) + pivot;
                }

                spotLight.position.copy(sphereLightMesh.position);
            }

            pp.update();
            // render using requestAnimationFrame
            requestAnimationFrame(render);
            renderer.render(scene, camera);
        }

        function setupControls() {
            let controls = new function () {
                this.rotationSpeed = 0.03;
                this.bouncingSpeed = 0.03;
                this.ambientColor = '#1c1c1c';
                this.pointColor = spotLight.color.getStyle();
                this.intensity = 1;
                this.distance = 0;
                this.angle = 0.1;
                this.shadowDebug = false;
                this.castShadow = true;
                this.target = "Plane";
                this.stopMovingLight = false;
                this.penumbra = 0;
            };

            let gui = new dat.GUI();
            gui.addColor(controls, 'ambientColor').onChange(function (e) {
                ambientLight.color = new THREE.Color(e);
            });

            gui.addColor(controls, 'pointColor').onChange(function (e) {
                spotLight.color = new THREE.Color(e);
            });

            gui.add(controls, 'angle', 0, Math.PI * 2).onChange(function (e) {
                spotLight.angle = e;
            });

            gui.add(controls, 'intensity', 0, 5).onChange(function (e) {
                spotLight.intensity = e;
            });

            // 光在平面上的投影（椭圆）的边模糊度 |
            gui.add(controls, 'penumbra', 0, 1).onChange(function (e) {
                spotLight.penumbra = e;
            });

            gui.add(controls, 'distance', 0, 200).onChange(function (e) {
                spotLight.distance = e;
            });

            gui.add(controls, 'shadowDebug').onChange(function (e) {
                if (e) {
                    scene.add(debugCamera);
                } else {
                    scene.remove(debugCamera);
                }
            });

            gui.add(controls, 'castShadow').onChange(function (e) {
                spotLight.castShadow = e;
            });

            gui.add(controls, 'target', ['Plane', 'Sphere', 'Cube']).onChange(function (e) {
                switch (e) {
                    case "Plane":
                        spotLight.target = plane;
                        break;
                    case "Sphere":
                        spotLight.target = sphere;
                        break;
                    case "Cube":
                        spotLight.target = cube;
                        break;
                }

            });

            gui.add(controls, 'stopMovingLight').onChange(function (e) {
                controls.stopMovingLight = e;
            });

            return controls;
        }

    },
};
</script>
<style scoped>
</style>
