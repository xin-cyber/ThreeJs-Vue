<template>
    <div></div>
</template>

<script>
import * as THREE from "three";
import Stats from "stats-js";
import { initTrackballControls } from "../../utils/tools";
import { ConvexGeometry } from "three/examples/jsm/geometries/ConvexGeometry.js";
import { ParametricGeometries } from "three/examples/jsm/geometries/ParametricGeometries.js";
import { ParametricGeometry } from "three/examples/jsm/geometries/ParametricGeometry.js";
import { createMultiMaterialObject } from "three/examples/jsm/utils/SceneUtils.js";

export default {
    name: "Geometry",
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
        camera.position.x = -30;
        camera.position.y = 40;
        camera.position.z = 30;
        camera.lookAt(new THREE.Vector3(-10, 0, 0));

        // add subtle ambient lighting
        let ambientLight = new THREE.AmbientLight(0x555555);
        scene.add(ambientLight);

        // add spotlight for the shadows
        let spotLight = new THREE.SpotLight(
            0xffffff,
            1.2,
            150,
            Math.PI / 4,
            0,
            2
        );
        spotLight.shadow.mapSize.height = 1024;
        spotLight.shadow.mapSize.width = 1024;
        spotLight.position.set(-40, 30, 30);
        spotLight.castShadow = true;
        scene.add(spotLight);

        // add geometries
        addGeometries(scene);

        // add the output of the renderer to the html element
        document.body.appendChild(renderer.domElement);

        function addGeometries(scene) {
            var geoms = [];

            geoms.push(new THREE.CylinderGeometry(1, 4, 4));

            // basic cube
            geoms.push(new THREE.BoxGeometry(2, 2, 2));

            // basic spherer
            geoms.push(new THREE.SphereGeometry(2));

            geoms.push(new THREE.IcosahedronGeometry(4));

            // create a convex shape (a shape without dents)
            // using a couple of points
            // for instance a cube
            var points = [
                new THREE.Vector3(2, 2, 2),
                new THREE.Vector3(2, 2, -2),
                new THREE.Vector3(-2, 2, -2),
                new THREE.Vector3(-2, 2, 2),
                new THREE.Vector3(2, -2, 2),
                new THREE.Vector3(2, -2, -2),
                new THREE.Vector3(-2, -2, -2),
                new THREE.Vector3(-2, -2, 2),
            ];
            // ConvexGeometry可以用来为给定的3D points生成一个凸包
            geoms.push(new ConvexGeometry(points));

            // create a lathgeometry
            //http://en.wikipedia.org/wiki/Lathe_(graphics)
            var pts = []; //points array - the path profile points will be stored here
            var detail = 0.1; //half-circle detail - how many angle increments will be used to generate points
            var radius = 3; //radius for half_sphere
            for (
                var angle = 0.0;
                angle < Math.PI;
                angle += detail //loop from 0.0 radians to PI (0 - 180 degrees)
            )
                pts.push(
                    new THREE.Vector3(
                        Math.cos(angle) * radius,
                        0,
                        Math.sin(angle) * radius
                    )
                ); //angle/radius to x,z
            geoms.push(new THREE.LatheGeometry(pts, 12));

            // create a OctahedronGeometry
            geoms.push(new THREE.OctahedronGeometry(3));

            // create a geometry based on a function
            geoms.push(
                new ParametricGeometry(ParametricGeometries.mobius3d, 20, 10)
            );

            //
            geoms.push(new THREE.TetrahedronGeometry(3));

            geoms.push(new THREE.TorusGeometry(3, 1, 10, 10));

            geoms.push(new THREE.TorusKnotGeometry(3, 0.5, 50, 20));

            var j = 0;
            for (var i = 0; i < geoms.length; i++) {
                // var cubeMaterial = new THREE.MeshLambertMaterial({
                //     wireframe: true,
                //     color: Math.random() * 0xffffff
                // });

                var materials = [
                    new THREE.MeshLambertMaterial({
                        color: Math.random() * 0xffffff,
                    }),
                    new THREE.MeshBasicMaterial({
                        color: 0x000000,
                        wireframe: true,
                    }),
                ];

                var mesh = createMultiMaterialObject(geoms[i], materials);
                mesh.traverse(function (e) {
                    e.castShadow = true;
                });

                //var mesh = new THREE.Mesh(geoms[i],materials[i]);
                //mesh.castShadow=true;
                mesh.position.x = -24 + (i % 4) * 12;
                mesh.position.y = 4;
                mesh.position.z = -8 + j * 12;

                if ((i + 1) % 4 == 0) j++;
                scene.add(mesh);
            }
        }

        // attach them here, since appendChild needs to be called first
        let trackballControls = initTrackballControls(camera, renderer);
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
<style scoped>
</style>
