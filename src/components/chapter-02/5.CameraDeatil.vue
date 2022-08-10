<template><div></div></template>

<script>
import * as THREE from "three";
import * as dat from "dat.gui";
import Stats from "stats-js";
import { initTrackballControls } from "../../utils/tools";

export default {
    name: "CameraDetail",
    mounted() {
        // stats
        let stats = Stats();
        stats.dom.style.marginTop = "35px";
        document.body.appendChild(stats.dom);

        // create a scene, that will hold all our elements such as objects, cameras and lights.
        let scene = new THREE.Scene();

        // create a camera, which defines where we're looking at.
        let camera = new THREE.PerspectiveCamera(
            45,
            window.innerWidth / window.innerHeight,
            0.1,
            100
        );
        // position and point the camera to the center of the scene
        camera.position.x = 120;
        camera.position.y = 60;
        camera.position.z = 180;

        // create a render and set the size
        let renderer = new THREE.WebGLRenderer();

        renderer.setClearColor(new THREE.Color(0x000000));
        renderer.setSize(window.innerWidth, window.innerHeight);

        // create the ground plane
        let planeGeometry = new THREE.PlaneGeometry(60, 40, 1, 1);
        let planeMaterial = new THREE.MeshLambertMaterial({
            color: 0xffffff,
        });
        let plane = new THREE.Mesh(planeGeometry, planeMaterial);

        // rotate and position the plane
        plane.rotation.x = -0.5 * Math.PI;
        plane.position.x = 0;
        plane.position.y = 0;
        plane.position.z = 0;

        // add the plane to the scene
        scene.add(plane);

        var cubeGeometry = new THREE.BoxGeometry(4, 4, 4);

        for (var j = 0; j < planeGeometry.parameters.height / 5; j++) {
            for (var i = 0; i < planeGeometry.parameters.width / 5; i++) {
                var rnd = Math.random() * 0.75 + 0.25;
                var cubeMaterial = new THREE.MeshLambertMaterial();
                cubeMaterial.color = new THREE.Color(rnd, 0, 0);
                var cube = new THREE.Mesh(cubeGeometry, cubeMaterial);

                cube.position.z =
                    -(planeGeometry.parameters.height / 2) + 2 + j * 5;
                cube.position.x =
                    -(planeGeometry.parameters.width / 2) + 2 + i * 5;
                cube.position.y = 2;

                scene.add(cube);
            }
        }

        var directionalLight = new THREE.DirectionalLight(0xffffff, 0.7);
        directionalLight.position.set(-20, 40, 60);
        scene.add(directionalLight);

        // add subtle ambient lighting
        var ambientLight = new THREE.AmbientLight(0x292929);
        scene.add(ambientLight);

        // add the output of the renderer to the html element
        document.body.appendChild(renderer.domElement);

        // call the render function
        // let step = 0;
        var trackballControls;
        var controls = new (function () {
            this.perspective = "Perspective";
            this.switchCamera = function () {
                if (camera instanceof THREE.PerspectiveCamera) {
                    // ⭐距离相机远近都一样的大小，二维游戏
                    // 左边界，有边界，上边界，下边界，near,far,zoom
                    camera = new THREE.OrthographicCamera(
                        window.innerWidth / -16,
                        window.innerWidth / 16,
                        window.innerHeight / 16,
                        window.innerHeight / -16,
                        -200,
                        500
                    );
                    camera.position.x = 120;
                    camera.position.y = 60;
                    camera.position.z = 180;
                    camera.lookAt(scene.position);
                    // 等价于
                    // camera.lookAt(new THREE.Vector3(0, 0, 0));

                    trackballControls = initTrackballControls(camera, renderer);
                    this.perspective = "Orthographic";
                } else {
                    // ⭐距离相机越远物体就越小
                    // fov,aspect,near,far,zoom
                    camera = new THREE.PerspectiveCamera(
                        45,
                        window.innerWidth / window.innerHeight,
                        0.1,
                        1000
                    );
                    camera.position.x = 120;
                    camera.position.y = 60;
                    camera.position.z = 180;

                    camera.lookAt(scene.position);
                    trackballControls = initTrackballControls(camera, renderer);
                    this.perspective = "Perspective";
                }
            };
        })();
        var gui = new dat.GUI();
        gui.add(controls, "switchCamera");
        gui.add(controls, "perspective").listen();

        // make sure that for the first time, the
        // camera is looking at the scene
        camera.lookAt(scene.position);

        // attach them here, since appendChild needs to be called first
        trackballControls = initTrackballControls(camera, renderer);
        let clock = new THREE.Clock();

        render();

        function render() {
            trackballControls.update(clock.getDelta());
            stats.update();

            // render using requestAnimationFrame
            requestAnimationFrame(render);
            renderer.render(scene, camera);
        }
    },
};
</script>
<style scoped></style>
