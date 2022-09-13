<template>
    <div>
        <p>07-10.js</p>
    </div>
</template>

<script>
export default {
    name: "Object3DGroup",
};
</script>
<style scoped></style>
<script>
function init() {
    // use the defaults
    var stats = initStats();
    var webGLRenderer = initRenderer();
    var scene = new THREE.Scene();
    var camera = initCamera(new THREE.Vector3(20, 0, 150));
    camera.lookAt(new THREE.Vector3(20, 30, 0));

    createSprites();
    render();

    var group;

    function getTexture() {
        var texture = new THREE.TextureLoader().load(
            "../../assets/textures/particles/sprite-sheet.png"
        );
        return texture;
    }

    function createSprites() {
        group = new THREE.Object3D();
        var range = 200;
        for (var i = 0; i < 400; i++) {
            group.add(createSprite(10, false, 0.6, 0xffffff, i % 5, range));
        }
        scene.add(group);
    }

    function createSprite(
        size,
        transparent,
        opacity,
        color,
        spriteNumber,
        range
    ) {
        var spriteMaterial = new THREE.SpriteMaterial({
            opacity: opacity,
            color: color,
            transparent: transparent,
            map: getTexture(),
        });

        // we have 1 row, with five sprites
        // 平移
        spriteMaterial.map.offset = new THREE.Vector2(
            (1 / 5) * spriteNumber,
            0
        );
        // 缩放 ,前1/5 ;如果没有上面就只是白色
        spriteMaterial.map.repeat = new THREE.Vector2(1 / 5, 1);
        // 用于去除纹理的黑色背景，
        spriteMaterial.depthTest = false;
        // 设置元素与背景的融合模式
        spriteMaterial.blending = THREE.AdditiveBlending;

        var sprite = new THREE.Sprite(spriteMaterial);
        sprite.scale.set(size, size, size);
        sprite.position.set(
            Math.random() * range - range / 2,
            Math.random() * range - range / 2,
            Math.random() * range - range / 2
        );

        return sprite;
    }
    console.log(group, scene);

    function render() {
        stats.update();
        group.rotation.x += 0.01;

        requestAnimationFrame(render);
        webGLRenderer.render(scene, camera);
    }
}
</script>
