<template>
    <div></div>
</template>

<script>
import * as THREE from "three";
// import * as dat from "dat.gui";
import {
    initCamera,
    initStats,
    initRenderer,
    initTrackballControls,
} from "../../utils/tools";

export default {
    name: "Curves",
    mounted() {
        // stats面板
        let stats = initStats();
        // 初始化渲染器renderer
        let renderer = initRenderer();
        // 初始化Scene
        let scene = new THREE.Scene();
        // 初始化透视相机
        let camera = initCamera(new THREE.Vector3(0, 40, 80), scene.position);
        // 初始化Controls
        let control = initTrackballControls(camera, renderer);
        let clock = new THREE.Clock();

        // show axes in the screen；红色x轴，绿色y轴，蓝色z轴，
        let axes = new THREE.AxesHelper(20); // 轴线粗细
        scene.add(axes);

        // ⭐椭圆曲线
        // const curve = new THREE.EllipseCurve(
        //     0, 0,            // ax, aY
        //     10, 10,           // xRadius, yRadius
        //     0, 2 * Math.PI,  // aStartAngle, aEndAngle
        //     false,            // aClockwise
        //     0                 // aRotation
        // );
        // const points = curve.getPoints(50); // 细分程度，点个数
        // const geometry = new THREE.BufferGeometry().setFromPoints(points);  // 连接点
        // const material = new THREE.LineBasicMaterial({ color: new THREE.Color('pink') });
        // // Create the final object to add to the scene
        // const ellipse = new THREE.Line(geometry, material); // 椭圆
        // scene.add(ellipse);

        // // ⭐不规则曲线
        // let geometry = new THREE.BufferGeometry(); //声明一个几何体对象Geometry
        // // 三维样条曲线  Catmull-Rom算法
        // let curve = new THREE.CatmullRomCurve3([
        //     new THREE.Vector3(-50, 20, 90),
        //     new THREE.Vector3(-10, 40, 40),
        //     new THREE.Vector3(0, 0, 0),
        //     new THREE.Vector3(60, -60, 0),
        //     new THREE.Vector3(70, 0, 80)
        // ]);
        // //getPoints是基类Curve的方法，返回一个vector3对象作为元素组成的数组
        // let points = curve.getPoints(100); //分段数100，返回101个顶点
        // geometry.setFromPoints(points);
        // //材质对象
        // let material = new THREE.LineBasicMaterial({
        //     color: new THREE.Color('pink')
        // });
        // //线条模型对象
        // let line = new THREE.Line(geometry, material);
        // scene.add(line); //线条对象添加到场景中


        // // ⭐曲线直线组合 不如shape
        // var geometry = new THREE.BufferGeometry(); //声明一个几何体对象Geometry
        // // 绘制一个U型轮廓
        // var R = 80;//圆弧半径
        // var arc = new THREE.EllipseCurve(0, 0, 10, 10, 0, Math.PI, false);
        // console.log(arc);
        // // 半圆弧的一个端点作为直线的一个端点
        // var line1 = new THREE.LineCurve(new THREE.Vector2(R, 200, 0), new THREE.Vector2(R, 0, 0));
        // var line2 = new THREE.LineCurve(new THREE.Vector2(-R, 0, 0), new THREE.Vector2(-R, 200, 0));
        // // 创建组合曲线对象CurvePath
        // var CurvePath = new THREE.CurvePath();
        // console.log(CurvePath);
        // // 把多个线条插入到CurvePath中
        // CurvePath.curves.push(line1, arc, line2);
        // //分段数200
        // var points = CurvePath.getPoints(200);
        // // setFromPoints方法从points中提取数据改变几何体的顶点属性vertices
        // geometry.setFromPoints(points);
        // console.log(geometry);
        // //材质对象
        // var material = new THREE.LineBasicMaterial({
        //     color: new THREE.Color('pink')
        // });
        // //线条模型对象
        // var line = new THREE.Line(geometry, material);
        // scene.add(line); //线条对象添加到场景中


        // ⭐管道几何体
        // var path = new THREE.CatmullRomCurve3([
        //     new THREE.Vector3(-10, 0, 10),
        //     new THREE.Vector3(-5, 5, 5),
        //     new THREE.Vector3(0, 0, 0),
        //     new THREE.Vector3(5, -5, 5),
        //     new THREE.Vector3(10, 0, 10)
        // ]);
        // var path = new THREE.LineCurve3(new THREE.Vector3(0, 100, 0), new THREE.Vector3(0, 0, 0));
        // var tubeGeometry = new THREE.TubeGeometry(path, 20, 2, 8, false); // 可以选择CurvePath
        // var tubeMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00, side: THREE.DoubleSide });
        // var tube = new THREE.Mesh(tubeGeometry, tubeMaterial);
        // scene.add(tube);


        // // ⭐LatheGeometry旋转几何体
        // var shape = new THREE.Shape();//创建Shape对象
        // var points = [];
        // for (let i = 0; i < 10; i++) {
        //     points.unshift(new THREE.Vector2(Math.sin(i * 0.2) * 10 + 5, (i - 5) * 2));
        // }
        // shape.splineThru(points);//顶点带入样条插值计算函数,旋转曲面更加光滑
        // var splinePoints = shape.getPoints(20);//插值计算细分数20
        // var geometry = new THREE.LatheGeometry(splinePoints, 30);
        // var material = new THREE.MeshBasicMaterial({
        //     color: 0x0000ff,//三角面颜色
        //     side: THREE.DoubleSide//两面可见
        // });//材质对象
        // material.wireframe = true;//线条模式渲染(查看细分数)
        // var mesh = new THREE.Mesh(geometry, material);//旋转网格模型对象
        // scene.add(mesh);//旋转网格模型添加到场景中


        // // ⭐shape和shapeGeometry轮廓填充
        // var points = [
        //     new THREE.Vector2(-25, -25),
        //     new THREE.Vector2(-30, 0),
        //     new THREE.Vector2(0, 25),
        //     new THREE.Vector2(30, 0),
        //     new THREE.Vector2(25, -25),
        //     new THREE.Vector2(-25, -25),
        // ]
        // // 通过顶点定义轮廓
        // var shape = new THREE.Shape(points);  // 五边形
        // shape.absarc(0, 0, 100, 0, 2 * Math.PI);//圆弧轮廓
        // // shape可以理解为一个需要填充轮廓
        // // 所谓填充：ShapeGeometry算法利用顶点计算出三角面face3数据填充轮廓
        // var geometry = new THREE.ShapeGeometry(shape, 25);
        // const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
        // const mesh = new THREE.Mesh(geometry, material);
        // scene.add(mesh);


        // ⭐圆弧与直线连接 ，从左到右，左上角坐标系
        var shape = new THREE.Shape(); //Shape对象
        var R = 5;
        // 绘制一个半径为R、圆心坐标(0, 0)的半圆弧
        shape.absarc(0, 0, R, 0, Math.PI); // x,y中心点 ； 半径  ；起始角 ； 终止角 .默认逆时针
        //从圆弧的一个端点(-R, 0)到(-R, -10)绘制一条直线
        shape.lineTo(-R, -10); // 在当前路径上，从.currentPoint连接一条直线到x,y。
        // 绘制一个半径为R、圆心坐标(0, -10)的半圆弧
        shape.absarc(0, -10, R, Math.PI, 2 * Math.PI);
        //从圆弧的一个端点(R, -10)到(-R, -10)绘制一条直线
        shape.lineTo(R, 0);
        var geometry = new THREE.ShapeGeometry(shape, 30);
        var material = new THREE.MeshBasicMaterial({
            color: 0x0000ff,
            side: THREE.DoubleSide,
            transparent: true,
            opacity: 0.5
        });
        var mesh = new THREE.Mesh(geometry, material);
        scene.add(mesh);

        // // 河南边界轮廓坐标
        // let arr = [
        //     [110.3906, 34.585],
        //     [110.8301, 34.6289],
        //     [110.6543, 34.1455],
        //     [110.4785, 34.2334],
        //     [110.3906, 34.585]
        // ]
        // var points = [];
        // // 转化为Vector2构成的顶点数组
        // arr.forEach(elem => {
        //     points.push(new THREE.Vector2(elem[0], elem[1]))
        // });
        // // 样条曲线生成更多的点
        // var SplineCurve = new THREE.SplineCurve(points)
        // var shape = new THREE.Shape(SplineCurve.getPoints(300));
        // // var shape = new THREE.Shape(points);
        // var geometry = new THREE.ShapeGeometry(shape);
        // geometry.center();//几何体居中
        // geometry.scale(30, 30, 30);//几何体缩放
        // var material = new THREE.MeshPhongMaterial({
        //     color: 0x0000ff,
        //     side: THREE.DoubleSide //两面可见
        // }); //材质对象
        // var mesh = new THREE.Mesh(geometry, material); //网格模型对象
        // scene.add(mesh); //网格模型添加到场景中

        render();

        function render() {
            control.update(clock.getDelta());
            stats.update();
            requestAnimationFrame(render);
            renderer.render(scene, camera);
        }
    },
};
</script>
<style scoped>

</style>
