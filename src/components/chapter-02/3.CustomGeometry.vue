<template>
    <div></div>
</template>

<script>
import * as THREE from "three";
import * as dat from "dat.gui";
import Stats from "stats-js";
import { initTrackballControls } from "../../utils/tools";
import { createMultiMaterialObject } from "three/examples/jsm/utils/SceneUtils.js";

export default {
    name: "CustomGeometry",
    mounted() {
        // stats
        let stats = Stats();
        stats.dom.style.marginTop = "35px";
        stats.dom.setAttribute("id", "stats");
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

        // create a render and set the size
        let renderer = new THREE.WebGLRenderer();

        renderer.setClearColor(new THREE.Color(0x000000));
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.shadowMap.enabled = true;

        // create the ground plane
        let planeGeometry = new THREE.PlaneGeometry(60, 40, 1, 1);
        let planeMaterial = new THREE.MeshLambertMaterial({
            color: 0xffffff,
        });
        let plane = new THREE.Mesh(planeGeometry, planeMaterial);
        plane.receiveShadow = true;

        // rotate and position the plane
        plane.rotation.x = -0.5 * Math.PI;
        plane.position.x = 0;
        plane.position.y = 0;
        plane.position.z = 0;

        // add the plane to the scene
        scene.add(plane);

        // position and point the camera to the center of the scene
        camera.position.x = -20;
        camera.position.y = 25;
        camera.position.z = 20;
        camera.lookAt(new THREE.Vector3(5, 0, 0));

        // add subtle ambient lighting
        let ambientLight = new THREE.AmbientLight(0x494949);
        scene.add(ambientLight);

        // add the output of the renderer to the html element
        document.body.appendChild(renderer.domElement);

        // faces3 弃用：126+版本后
        let vertices = [
            new THREE.Vector3(1, 3, 1),
            new THREE.Vector3(1, 3, -1),
            new THREE.Vector3(1, -1, 1),
            new THREE.Vector3(1, -1, -1),
            new THREE.Vector3(-1, 3, -1),
            new THREE.Vector3(-1, 3, 1),
            new THREE.Vector3(-1, -1, -1),
            new THREE.Vector3(-1, -1, 1),
        ];

        let faces = [
            new THREE.Face3(0, 2, 1),
            new THREE.Face3(2, 3, 1),
            new THREE.Face3(4, 6, 5),
            new THREE.Face3(6, 7, 5),
            new THREE.Face3(4, 5, 1),
            new THREE.Face3(5, 0, 1),
            new THREE.Face3(7, 6, 2),
            new THREE.Face3(6, 3, 2),
            new THREE.Face3(5, 7, 0),
            new THREE.Face3(7, 2, 0),
            new THREE.Face3(1, 3, 4),
            new THREE.Face3(3, 6, 4),
        ];

        let geom = new THREE.Geometry();
        geom.vertices = vertices;
        geom.faces = faces;
        geom.computeFaceNormals();

        let materials = [
            new THREE.MeshBasicMaterial({ color: 0x000000, wireframe: true }),
            new THREE.MeshLambertMaterial({
                opacity: 0.6,
                color: 0x44ff44,
                transparent: true,
            }),
        ];

        // 复合材质创建mesh；为materials数组每个材质创建一个实例，然后再把这些实例存放到一个three.object3d对象里面，使用方法类似于scene.children
        let mesh = createMultiMaterialObject(geom, materials);
        mesh.castShadow = true;
        mesh.children.forEach(function (e) {
            e.castShadow = true;
        });

        scene.add(mesh);

        // add spotlight for the shadows
        let spotLight = new THREE.SpotLight(0xffffff, 1, 180, Math.PI / 4);
        spotLight.shadow.mapSize.height = 2048;
        spotLight.shadow.mapSize.width = 2048;
        spotLight.position.set(-40, 30, 30);
        spotLight.castShadow = true;
        spotLight.lookAt(mesh);
        scene.add(spotLight);
        function addControl(x, y, z) {
            let controls = new (function () {
                this.x = x;
                this.y = y;
                this.z = z;
            })();

            return controls;
        }

        let controlPoints = [];
        controlPoints.push(addControl(3, 5, 3));
        controlPoints.push(addControl(3, 5, 0));
        controlPoints.push(addControl(3, 0, 3));
        controlPoints.push(addControl(3, 0, 0));
        controlPoints.push(addControl(0, 5, 0));
        controlPoints.push(addControl(0, 5, 3));
        controlPoints.push(addControl(0, 0, 0));
        controlPoints.push(addControl(0, 0, 3));

        let gui = new dat.GUI();
        gui.add(
            new (function () {
                this.clone = function () {
                    let clonedGeometry = mesh.children[0].geometry.clone();
                    let materials = [
                        new THREE.MeshLambertMaterial({
                            opacity: 0.8,
                            color: 0xff44ff,
                            transparent: true,
                        }),
                        new THREE.MeshBasicMaterial({
                            color: 0x000000,
                            wireframe: true,
                        }),
                    ];
                    // 复合材质创建mesh(包含俩个three.mesh对象)；为materials数组每个材质创建一个实例，然后再把这些实例存放到一个three.object3d对象里面，使用方法类似于scene.children
                    let mesh2 = createMultiMaterialObject(
                        clonedGeometry,
                        materials
                    );
                    mesh2.children.forEach(function (e) {
                        e.castShadow = true;
                    });

                    // 移动
                    mesh2.translateX(5);
                    mesh2.translateZ(5);
                    mesh2.name = "clone";
                    scene.remove(scene.getChildByName("clone"));
                    scene.add(mesh2);
                };
            })(),
            "clone"
        );

        for (let i = 0; i < 8; i++) {
            let f1 = gui.addFolder("Vertices " + (i + 1));
            f1.add(controlPoints[i], "x", -10, 10);
            f1.add(controlPoints[i], "y", -10, 10);
            f1.add(controlPoints[i], "z", -10, 10);
        }
        // attach them here, since appendChild needs to be called first
        let trackballControls = initTrackballControls(camera, renderer);
        let clock = new THREE.Clock();

        render();

        function render() {
            trackballControls.update(clock.getDelta());
            stats.update();

            let vertices = [];
            for (let i = 0; i < 8; i++) {
                vertices.push(
                    new THREE.Vector3(
                        controlPoints[i].x,
                        controlPoints[i].y,
                        controlPoints[i].z
                    )
                );
            }

            mesh.children.forEach(function (e) {
                e.geometry.vertices = vertices;
                e.geometry.verticesNeedUpdate = true;
                e.geometry.computeFaceNormals();
                delete e.geometry.__directGeometry;
            });

            // render using requestAnimationFrame
            requestAnimationFrame(render);
            renderer.render(scene, camera);
        }
    },
};
</script>
<style scoped>
</style>
