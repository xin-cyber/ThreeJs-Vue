import * as THREE from "three";
// import * as dat from 'dat.gui';
// import Stats from 'stats-js';
import {
    TrackballControls
} from "three/examples/jsm/controls/TrackballControls.js";
import Stats from "stats-js";
import {
    OBJLoader
} from 'three/examples/jsm/loaders/OBJLoader.js';

/**
 * Initialize trackball controls to control the scene ,初始化相机视角控制
 *
 * @param {THREE.Camera} camera
 * @param {THREE.Renderer} renderer
 */
export const initTrackballControls = (camera, renderer) => {
    let trackballControls = new TrackballControls(camera, renderer.domElement);
    trackballControls.rotateSpeed = 1.0;
    trackballControls.zoomSpeed = 1.2;
    trackballControls.panSpeed = 0.8;
    trackballControls.noZoom = false;
    trackballControls.noPan = false;
    trackballControls.staticMoving = true;
    trackballControls.dynamicDampingFactor = 0.3;
    trackballControls.keys = [65, 83, 68];

    return trackballControls;
};

/**
 * Initialize the statistics domelement 初始化左上角stats-js面板
 *
 * @param {Number} type 0: fps, 1: ms, 2: mb, 3+: custom
 * @returns stats javascript object
 */
export const initStats = (type) => {
    let panelType =
        typeof type !== "undefined" && type && !isNaN(type) ?
        parseInt(type) :
        0;
    let stats = Stats();

    stats.showPanel(panelType); // 0: fps, 1: ms, 2: mb, 3+: custom
    stats.dom.style.marginTop = "35px";
    stats.dom.setAttribute("id", "stats");

    document.body.appendChild(stats.dom);

    return stats;
};

/**
 * Initialize a simple default renderer and binds it to the dom 初始化renderer
 *
 *
 * @param additionalProperties Additional properties to pass into the renderer
 */
export const initRenderer = (additionalProperties) => {
    let props =
        typeof additionalProperties !== "undefined" && additionalProperties ?
        additionalProperties : {};
    let renderer = new THREE.WebGLRenderer(props);
    // 阴影更加柔和
    renderer.shadowMapSoft = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    renderer.setClearColor(new THREE.Color(0x000000));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    document.body.appendChild(renderer.domElement);

    return renderer;
};

/**
 * Initialize a simple camera and point it at the center of a scene 初始化透视投影相机
 *
 * @param {THREE.Vector3} [initialPosition]
 */
export const initCamera = (initialPosition) => {
    let position =
        initialPosition !== undefined ?
        initialPosition :
        new THREE.Vector3(-30, 40, 30);

    let camera = new THREE.PerspectiveCamera(
        45,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
    );
    camera.position.copy(position);
    camera.lookAt(new THREE.Vector3(0, 0, 0));

    return camera;
};

/**
 *@param {Object}  THREE.scene
 *@description Creates a House and Tree
 */
export const addHouseAndTree = (scene) => {
    createBoundingWall(scene);
    createGroundPlane(scene);
    createHouse(scene);
    createTree(scene);

    function createBoundingWall(scene) {
        let wallLeft = new THREE.BoxGeometry(70, 2, 2);
        let wallRight = new THREE.BoxGeometry(70, 2, 2);
        let wallTop = new THREE.BoxGeometry(2, 2, 50);
        let wallBottom = new THREE.BoxGeometry(2, 2, 50);

        let wallMaterial = new THREE.MeshPhongMaterial({
            color: 0xa0522d,
        });

        let wallLeftMesh = new THREE.Mesh(wallLeft, wallMaterial);
        let wallRightMesh = new THREE.Mesh(wallRight, wallMaterial);
        let wallTopMesh = new THREE.Mesh(wallTop, wallMaterial);
        let wallBottomMesh = new THREE.Mesh(wallBottom, wallMaterial);

        wallLeftMesh.position.set(15, 1, -25);
        wallRightMesh.position.set(15, 1, 25);
        wallTopMesh.position.set(-19, 1, 0);
        wallBottomMesh.position.set(49, 1, 0);

        scene.add(wallLeftMesh);
        scene.add(wallRightMesh);
        scene.add(wallBottomMesh);
        scene.add(wallTopMesh);
    }

    function createGroundPlane(scene) {
        // create the ground plane
        let planeGeometry = new THREE.PlaneGeometry(70, 50);
        let planeMaterial = new THREE.MeshPhongMaterial({
            color: 0x9acd32,
        });
        let plane = new THREE.Mesh(planeGeometry, planeMaterial);
        plane.receiveShadow = true;

        // rotate and position the plane
        plane.rotation.x = -0.5 * Math.PI;
        plane.position.x = 15;
        plane.position.y = 0;
        plane.position.z = 0;

        scene.add(plane);
    }

    function createHouse(scene) {
        let roof = new THREE.ConeGeometry(5, 4);
        let base = new THREE.CylinderGeometry(5, 5, 6);

        // create the mesh
        let roofMesh = new THREE.Mesh(
            roof,
            new THREE.MeshPhongMaterial({
                color: 0x8b7213,
            })
        );
        let baseMesh = new THREE.Mesh(
            base,
            new THREE.MeshPhongMaterial({
                color: 0xffe4c4,
            })
        );

        roofMesh.position.set(25, 8, 0);
        baseMesh.position.set(25, 3, 0);

        // roofMesh.receiveShadow = true;
        // baseMesh.receiveShadow = true;
        roofMesh.castShadow = true;
        baseMesh.castShadow = true;

        scene.add(roofMesh);
        scene.add(baseMesh);
    }

    /**
     * Add the tree to the scene
     * @param scene The scene to add the tree to
     */
    function createTree(scene) {
        let trunk = new THREE.BoxGeometry(1, 8, 1);
        let leaves = new THREE.SphereGeometry(4);

        // create the mesh
        let trunkMesh = new THREE.Mesh(
            trunk,
            new THREE.MeshPhongMaterial({
                color: 0x8b4513,
            })
        );
        let leavesMesh = new THREE.Mesh(
            leaves,
            new THREE.MeshPhongMaterial({
                color: 0x00ff00,
            })
        );

        // position the trunk. Set y to half of height of trunk
        trunkMesh.position.set(-10, 4, 0);
        leavesMesh.position.set(-10, 12, 0);

        trunkMesh.castShadow = true;
        // trunkMesh.receiveShadow = true;
        leavesMesh.castShadow = true;
        // leavesMesh.receiveShadow = true;

        scene.add(trunkMesh);
        scene.add(leavesMesh);
    }
};

/**
 * Add a simple cube and sphere to the provided scene
 *
 * @param {THREE.Scene} scene
 */
export const addDefaultCubeAndSphere = (scene) => {
    // create a cube
    let cubeGeometry = new THREE.BoxGeometry(4, 4, 4);
    let cubeMaterial = new THREE.MeshLambertMaterial({
        color: 0xff0000,
    });
    let cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
    cube.castShadow = true;

    // position the cube
    cube.position.x = -4;
    cube.position.y = 3;
    cube.position.z = 0;

    // add the cube to the scene
    scene.add(cube);

    let sphereGeometry = new THREE.SphereGeometry(4, 20, 20);
    let sphereMaterial = new THREE.MeshLambertMaterial({
        color: 0x7777ff,
    });
    let sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);

    // position the sphere
    sphere.position.x = 20;
    sphere.position.y = 0;
    sphere.position.z = 2;
    sphere.castShadow = true;

    // add the sphere to the scene
    scene.add(sphere);

    return {
        cube,
        sphere,
    };
}

/**
 * Add a simple ground plance to the provided scene
 *
 * @param {THREE.Scene} scene
 */
export const addGroundPlane = (scene) => {
    // create the ground plane
    let planeGeometry = new THREE.PlaneGeometry(60, 20, 120, 120);
    let planeMaterial = new THREE.MeshPhongMaterial({
        color: 0xffffff,
    });
    let plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.receiveShadow = true;

    // rotate and position the plane
    plane.rotation.x = -0.5 * Math.PI;
    plane.position.x = 15;
    plane.position.y = 0;
    plane.position.z = 0;

    scene.add(plane);

    return plane;
}

/**
 * Add a folder to the gui containing the basic material properties.
 * 初始化遍历Material基类的属性并且添加到GUI中
 * @param gui the gui to add to
 * @param controls the current controls object
 * @param material the material to control
 * @param geometry the geometry we're working with
 * @param name optionally the name to assign to the folder
 */
export const addBasicMaterialSettings = (gui, controls, material, name) => {

    let folderName = (name !== undefined) ? name : 'THREE.Material';

    controls.material = material;
    console.log(material);
    let folder = gui.addFolder(folderName);
    folder.add(controls.material, 'id');
    folder.add(controls.material, 'uuid');
    folder.add(controls.material, 'name');
    folder.add(controls.material, 'opacity', 0, 1, 0.01);
    folder.add(controls.material, 'transparent');
    // 145版本three.js不存在
    controls.material.overdraw && folder.add(controls.material, 'overdraw', 0, 1, 0.01);
    folder.add(controls.material, 'visible');
    folder.add(controls.material, 'side', {
        FrontSide: 0,
        BackSide: 1,
        BothSides: 2
    }).onChange(function (side) {
        controls.material.side = parseInt(side)
    });

    folder.add(controls.material, 'colorWrite');
    if (controls.material.flatShading !== undefined) {
        folder.add(controls.material, 'flatShading').onChange(function (shading) {
            controls.material.flatShading = shading;
            controls.material.needsUpdate = true;
        });
    }

    folder.add(controls.material, 'premultipliedAlpha');
    folder.add(controls.material, 'dithering');
    folder.add(controls.material, 'shadowSide', {
        FrontSide: 0,
        BackSide: 1,
        BothSides: 2
    });
    folder.add(controls.material, 'vertexColors', {
        NoColors: THREE.NoColors,
        FaceColors: THREE.FaceColors,
        VertexColors: THREE.VertexColors
    }).onChange(function (vertexColors) {
        material.vertexColors = parseInt(vertexColors);
    });
    controls.material.fog && folder.add(controls.material, 'fog');

    return folder;
}

/**
 * Load a gopher, and apply the material
 * @param material if set apply this material to the gopher
 * @returns promise which is fullfilled once the goher is loaded
 */
export const loadGopher = (material) => {
    let loader = new OBJLoader();
    let mesh = null;
    let p = new Promise(function (resolve) {
        loader.load('../../../assets/models/gopher/gopher.obj', function (loadedMesh) {
            // this is a group of meshes, so iterate until we reach a THREE.Mesh
            mesh = loadedMesh;
            if (material) {
                // material is defined, so overwrite the default material.
                computeNormalsGroup(mesh);
                setMaterialGroup(material, mesh);
            }
            resolve(mesh);
        });
    });

    return p;
}

function setMaterialGroup(material, group) {
    if (group instanceof THREE.Mesh) {
        group.material = material;
    } else if (group instanceof THREE.Group) {
        group.children.forEach(function (child) {
            setMaterialGroup(material, child)
        });
    }
}

function computeNormalsGroup(group) {
    if (group instanceof THREE.Mesh) {
        let tempGeom = new THREE.Geometry();
        tempGeom.fromBufferGeometry(group.geometry)
        tempGeom.computeFaceNormals();
        tempGeom.mergeVertices();
        tempGeom.computeVertexNormals();

        tempGeom.normalsNeedUpdate = true;

        // group = new THREE.BufferGeometry();
        // group.fromGeometry(tempGeom);
        group.geometry = tempGeom;

    } else if (group instanceof THREE.Group) {
        group.children.forEach(function (child) {
            computeNormalsGroup(child)
        });
    }
}

/**
 * Add a simple ground plance to the provided scene
 * 
 * @param {THREE.Scene} scene 
 */
export const addLargeGroundPlane = (scene, useTexture) => {

    let withTexture = (useTexture !== undefined) ? useTexture : false;

    // create the ground plane
    let planeGeometry = new THREE.PlaneGeometry(10000, 10000);
    let planeMaterial = new THREE.MeshPhongMaterial({
        color: 0xffffff
    });
    if (withTexture) {
        let textureLoader = new THREE.TextureLoader();
        planeMaterial.map = textureLoader.load("../../../assets/textures/general/floor-wood.jpg");
        planeMaterial.map.wrapS = THREE.RepeatWrapping;
        planeMaterial.map.wrapT = THREE.RepeatWrapping;
        planeMaterial.map.repeat.set(80, 80)
    }
    let plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.receiveShadow = true;

    // rotate and position the plane
    plane.rotation.x = -0.5 * Math.PI;
    plane.position.x = 0;
    plane.position.y = 0;
    plane.position.z = 0;

    scene.add(plane);

    return plane;
}


/**
 * 
 * 
 * @param gui the gui to add to
 * @param controls the current controls object
 * @param material material for the meshes
 */
export const addMeshSelection = (gui, controls, material, scene) => {
    let sphereGeometry = new THREE.SphereGeometry(10, 20, 20);
    let cubeGeometry = new THREE.BoxGeometry(16, 16, 15);
    let planeGeometry = new THREE.PlaneGeometry(14, 14, 4, 4);

    let sphere = new THREE.Mesh(sphereGeometry, material);
    let cube = new THREE.Mesh(cubeGeometry, material);
    let plane = new THREE.Mesh(planeGeometry, material);

    sphere.position.x = 0;
    sphere.position.y = 11;
    sphere.position.z = 2;

    cube.position.y = 8;

    controls.selectedMesh = "cube";
    // loadGopher(material).then(function (gopher) {

    //     gopher.scale.x = 5;
    //     gopher.scale.y = 5;
    //     gopher.scale.z = 5;
    //     gopher.position.z = 0
    //     gopher.position.x = -10
    //     gopher.position.y = 0

    gui.add(controls, 'selectedMesh', ["cube", "sphere", "plane"]).onChange(function (e) {

        scene.remove(controls.selected);

        switch (e) {
            case "cube":
                scene.add(cube);
                controls.selected = cube;
                break;
            case "sphere":
                scene.add(sphere);
                controls.selected = sphere;
                break;
            case "plane":
                scene.add(plane);
                controls.selected = plane;
                break;
                // case "gopher":
                //     scene.add(gopher);
                //     controls.selected = gopher;
                //     break;
        }
    });
    // });

    controls.selected = cube;
    scene.add(controls.selected);
}
