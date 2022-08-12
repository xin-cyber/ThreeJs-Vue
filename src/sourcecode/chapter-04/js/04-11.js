function init() {

    // use the defaults
    let stats = initStats();
    let renderer = initRenderer();
    let camera = initCamera();
    // create a scene, that will hold all our elements such as objects, cameras and lights.
    let scene = new THREE.Scene();


    let cubeGeometry = new THREE.BoxGeometry(20, 20, 20);

    let meshMaterial1 = createMaterial("vertex-shader",
        "fragment-shader-1");
    let meshMaterial2 = createMaterial("vertex-shader",
        "fragment-shader-2");
    let meshMaterial3 = createMaterial("vertex-shader",
        "fragment-shader-3");
    let meshMaterial4 = createMaterial("vertex-shader",
        "fragment-shader-4");
    let meshMaterial5 = createMaterial("vertex-shader",
        "fragment-shader-5");
    let meshMaterial6 = createMaterial("vertex-shader",
        "fragment-shader-6");


    let material = [meshMaterial1, meshMaterial2, meshMaterial3, meshMaterial4, meshMaterial5, meshMaterial6];
    let cube = new THREE.Mesh(cubeGeometry, material);

    // add the sphere to the scene
    scene.add(cube);

    // add subtle ambient lighting
    let ambientLight = new THREE.AmbientLight(0x0c0c0c);
    scene.add(ambientLight);

    // add spotlight for the shadows
    let spotLight = new THREE.SpotLight(0xffffff);
    spotLight.position.set(-40, 60, -10);
    spotLight.castShadow = true;
    scene.add(spotLight);

    // call the render function
    let step = 0;
    let oldContext = null;

    let controls = new function () {
        this.rotationSpeed = 0.02;
        this.bouncingSpeed = 0.03;

        this.opacity = meshMaterial1.opacity;
        this.transparent = meshMaterial1.transparent;

        this.visible = meshMaterial1.visible;
        this.side = "front";

        this.wireframe = meshMaterial1.wireframe;
        this.wireframeLinewidth = meshMaterial1.wireframeLinewidth;

        this.selectedMesh = "cube";

        this.shadow = "flat";

    };


    render();

    function render() {
        stats.update();

        cube.rotation.y = step += 0.01;
        cube.rotation.x = step;
        cube.rotation.z = step;

        cube.material.forEach(function (e) {
            e.uniforms.time.value += 0.01;
        });


        // render using requestAnimationFrame
        requestAnimationFrame(render);
        renderer.render(scene, camera);
    }

    function createMaterial(vertexShader, fragmentShader) {
        let vertShader = document.getElementById(vertexShader).textContent;
        let fragShader = document.getElementById(fragmentShader).textContent;

        let attributes = {};
        let uniforms = {
            time: {
                type: 'f',
                value: 0.2
            },
            scale: {
                type: 'f',
                value: 0.2
            },
            alpha: {
                type: 'f',
                value: 0.6
            },
            resolution: {
                type: "v2",
                value: new THREE.Vector2()
            }
        };

        uniforms.resolution.value.x = window.innerWidth;
        uniforms.resolution.value.y = window.innerHeight;

        let meshMaterial = new THREE.ShaderMaterial({
            uniforms: uniforms,
            // 在几何体每一个顶点执行，点位置几何变化
            vertexShader: vertShader,
            // 在几何体每一个片段执行，片段颜色渲染
            fragmentShader: fragShader,
            transparent: true

        });


        return meshMaterial;
    }
}
