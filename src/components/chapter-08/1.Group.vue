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
    initDefaultLighting,
    // addLargeGroundPlane,
} from "../../utils/tools";

export default {
    name: "Group",
    mounted() {
        // stats面板
        let stats = initStats();
        // 初始化渲染器renderer
        let renderer = initRenderer();
        // 初始化透视相机
        let camera = initCamera(new THREE.Vector3(30, 30, 30));
        let scene = new THREE.Scene();
        let control = initTrackballControls(camera, renderer)
        let clock = new THREE.Clock()
        initDefaultLighting(scene);
        // let groundPlane = addLargeGroundPlane(scene)

        // call the render function
        let step = 0.03;

        let sphere;
        let cube;
        let group;
        let bboxMesh;
        let arrow;

        // setup the control gui
        let controls = new function () {
            // we need the first child, since it's a multimaterial
            this.cubePosX = 0;
            this.cubePosY = 3;
            this.cubePosZ = 10;

            this.spherePosX = 10;
            this.spherePosY = 5;
            this.spherePosZ = 0;

            this.groupPosX = 10;
            this.groupPosY = 5;
            this.groupPosZ = 0;

            this.grouping = false;
            this.rotate = false;

            this.groupScale = 1;
            this.cubeScale = 1;
            this.sphereScale = 1;


            this.redraw = function () {
                // remove the old plane
                scene.remove(group);

                // create a new one
                sphere = createMesh(new THREE.SphereGeometry(5, 10, 10));
                cube = createMesh(new THREE.BoxGeometry(6, 6, 6));

                sphere.position.set(controls.spherePosX, controls.spherePosY, controls.spherePosZ);
                sphere.scale.set(controls.sphereScale, controls.sphereScale, controls.sphereScale);
                cube.position.set(controls.cubePosX, controls.cubePosY, controls.cubePosZ);
                cube.scale.set(controls.cubeScale, controls.cubeScale, controls.cubeScale);

                // also create a group, only used for rotating
                group = new THREE.Group();
                group.position.set(controls.groupPosX, controls.groupPosY, controls.groupPosZ);
                group.scale.set(controls.groupScale, controls.groupScale, controls.groupScale);
                group.add(sphere);
                group.add(cube);

                scene.add(group);
                controls.positionBoundingBox();

                if (arrow) scene.remove(arrow)
                arrow = new THREE.ArrowHelper(new THREE.Vector3(0, 1, 0), group.position, 10, 0x0000ff);
                scene.add(arrow);
            };

            this.positionBoundingBox = function () {
                scene.remove(bboxMesh);
                let box = setFromObject(group);
                let width = box.max.x - box.min.x;
                let height = box.max.y - box.min.y;
                let depth = box.max.z - box.min.z;

                let bbox = new THREE.BoxGeometry(width, height, depth);
                bboxMesh = new THREE.Mesh(bbox, new THREE.MeshBasicMaterial({
                    color: 0x000000,
                    // 高版本弃用
                    // vertexColors: THREE.VertexColors,
                    wireframeLinewidth: 2,
                    wireframe: true
                }));

                // scene.add(bboxMesh);

                bboxMesh.position.x = ((box.min.x + box.max.x) / 2);
                bboxMesh.position.y = ((box.min.y + box.max.y) / 2);
                bboxMesh.position.z = ((box.min.z + box.max.z) / 2);
            }
        };

        let gui = new dat.GUI();
        let sphereFolder = gui.addFolder("sphere");
        sphereFolder.add(controls, "spherePosX", -20, 20).onChange(function (e) {
            sphere.position.x = e;
            controls.positionBoundingBox()
            controls.redraw();
        });
        sphereFolder.add(controls, "spherePosZ", -20, 20).onChange(function (e) {
            sphere.position.z = e;
            controls.positionBoundingBox();
            controls.redraw();
        });
        sphereFolder.add(controls, "spherePosY", -20, 20).onChange(function (e) {
            sphere.position.y = e;
            controls.positionBoundingBox();
            controls.redraw();
        });
        sphereFolder.add(controls, "sphereScale", 0, 3).onChange(function (e) {
            sphere.scale.set(e, e, e);
            controls.positionBoundingBox();
            controls.redraw();
        });

        let cubeFolder = gui.addFolder("cube");
        cubeFolder.add(controls, "cubePosX", -20, 20).onChange(function (e) {
            cube.position.x = e;
            controls.positionBoundingBox();
            controls.redraw();
        });
        cubeFolder.add(controls, "cubePosZ", -20, 20).onChange(function (e) {
            cube.position.z = e;
            controls.positionBoundingBox();
            controls.redraw();
        });
        cubeFolder.add(controls, "cubePosY", -20, 20).onChange(function (e) {
            cube.position.y = e;
            controls.positionBoundingBox();
            controls.redraw();
        });
        cubeFolder.add(controls, "cubeScale", 0, 3).onChange(function (e) {
            cube.scale.set(e, e, e);
            controls.positionBoundingBox();
            controls.redraw();
        });

        let cubeFolders = gui.addFolder("group");
        cubeFolders.add(controls, "groupPosX", -20, 20).onChange(function (e) {
            group.position.x = e;
            controls.positionBoundingBox();
            controls.redraw();
        });
        cubeFolders.add(controls, "groupPosZ", -20, 20).onChange(function (e) {
            group.position.z = e;
            controls.positionBoundingBox();
            controls.redraw();
        });
        cubeFolders.add(controls, "groupPosY", -20, 20).onChange(function (e) {
            group.position.y = e;
            controls.positionBoundingBox();
            controls.redraw();
        });
        cubeFolders.add(controls, "groupScale", 0, 3).onChange(function (e) {
            group.scale.set(e, e, e);
            controls.positionBoundingBox();
            controls.redraw();
        });

        gui.add(controls, "grouping");
        gui.add(controls, "rotate");
        controls.redraw();
        render();

        function createMesh(geom) {

            // assign two materials
            let meshMaterial = new THREE.MeshNormalMaterial();
            meshMaterial.side = THREE.DoubleSide;

            // create a multimaterial
            let plane = new THREE.Mesh(geom, meshMaterial);

            return plane;
        }

        function render() {
            control.update(clock.getDelta())
            stats.update();


            if (controls.grouping && controls.rotate) {
                group.rotation.y += step;
            }

            if (controls.rotate && !controls.grouping) {
                sphere.rotation.y += step;
                cube.rotation.y += step;
            }

            //        controls.positionBoundingBox();
            // render using requestAnimationFrame
            requestAnimationFrame(render);
            renderer.render(scene, camera);
        }

        // http://jsfiddle.net/MREL4/
        function setFromObject(object) {
            let box = new THREE.Box3();
            let v1 = new THREE.Vector3();
            object.updateMatrixWorld(true);
            box.makeEmpty();
            object.traverse(function (node) {
                if (node.geometry !== undefined && node.geometry.vertices !== undefined) {
                    let vertices = node.geometry.vertices;
                    for (let i = 0, il = vertices.length; i < il; i++) {
                        v1.copy(vertices[i]);
                        v1.applyMatrix4(node.matrixWorld);
                        box.expandByPoint(v1);
                    }
                }
            });
            return box;
        }

    },
};
</script>
<style scoped>
</style>
