# three.js

> https://threejs.org/docs/index.html#manual/en/introduction/Useful-links
>
> webgl : 支持3d，gpu并行计算和渲染，速度快，有利于大数据量和复杂物体渲染

## 1.total

+ we need three things: **scene**, **camera** and **renderer**, so that we can render the scene with camera.（场景空间，相机，渲染器）

+ objects further away from the camera than the value of `far` or closer than `near` **won't be rendered**.

+ except WebGLRenderer we use here, three.js comes with a few others, often used as fallbacks for users with older browsers or for those who don't have WebGL support for some reason.

+ ```html
  <!DOCTYPE html>
  <html>
    <head>
      <meta charset="utf-8" />
      <title>My first three.js app</title>
      <style>
        body {
          margin: 0;
        }
      </style>
    </head>
    <body>
      <script src="./js/three,js"></script>
      <script>
        const scene = new THREE.Scene();
        // 远景相机
        // 第一个属性75设置的是视角（field of view）。
        // 第二个属性设置的是相机拍摄面的长宽比（aspect ratio）。我们几乎总是会使用元素的宽除以高，否则会出现挤压变形。
  	  // 接下来的2个属性是近裁剪面（near clipping plane） 和 远裁剪面（far clipping plane）
        const camera = new THREE.PerspectiveCamera(
          75,
          window.innerWidth / window.innerHeight,
          0.1,
          1000,
        );
  	 // 也支持其他render方式
        const renderer = new THREE.WebGLRenderer();
       // 设置大小
        renderer.setSize(window.innerWidth, window.innerHeight);
       // 加入页面是canvas
        document.body.appendChild(renderer.domElement);
  
        // 形状
        const geometry = new THREE.BoxGeometry(1, 1, 1);
        // 材料
        const material = new THREE.MeshBasicMaterial({ color: 0x00ffff });
        // mesh网格汇合
        const cube = new THREE.Mesh(geometry, material);
        // 默认添加到（0,0）
        scene.add(cube);
  	  // 物体和相机都是(0,0); 要给camera一点z距离
        camera.position.z = 5;
  
        function animate() {
          // it pauses when the user navigates to another browser tab
          requestAnimationFrame(animate);
  
          cube.rotation.x += 0.01;
          cube.rotation.y += 0.01;
  
          renderer.render(scene, camera);
        }
  
        animate();
      </script>
    </body>
  </html>
  
  ```

  **ps  :   requestAnimationFrame **

  > requestAnimationFrame() 他的作用就是代替定时器做更加流畅高性能的动画，做可以匹配设备刷新率的动画，他解决了定时器做动画时间间隔不稳定的问题（也就是解决定时器做动画不流畅的问题）
  >
  > ⭐帧——就是**影像动画中最小单位的单幅影像画面**，相当于电影胶片上的每一格镜头。
  >
  > 切换tab页会停止

  ```js
  （120帧就每秒执行120次,60帧就执行60次）。
  ```

+ render text
  + html+css  => z-index覆盖
  + Use CSS2DRenderer or CSS3DRenderer
  + texture 纹理
  + new THREE.TextGeometry( text, parameters );
  + Bitmap Fonts
  + Troika Text

## 2.camera

### PerspectiveCamera ( 透视相机 )

> PerspectiveCamera( fov, aspect, near, far )

**Arguments: ( number )**

![899901-20160727081844778-301622290](https://picgo-1307940198.cos.ap-nanjing.myqcloud.com/899901-20160727081844778-301622290.png)

![899901-20160727081858981-1447408348](https://picgo-1307940198.cos.ap-nanjing.myqcloud.com/899901-20160727081858981-1447408348.png)

- fov——fov表示视场，所谓视场就是能够看到的角度范围，人的眼睛大约能够看到180度的视场，视角大小设置要根据具体应用，一般游戏会设置60~90度。 默认值45
- aspect——aspect表示渲染窗口的长宽比，如果一个网页上只有一个全屏的canvas画布且画布上只有一个窗口，那么aspect的值就是网页窗口客户区的宽高比 window.innerWidth/window.innerHeight
- near——near属性表示的是从距离相机多远的位置开始渲染，一般情况会设置一个很小的值。 默认值0.1
- far——far属性表示的是距离相机多远的位置截止渲染，如果设置的值偏小小，会有部分场景看不到。过大会影响渲染性能； 默认值1000
- ![551694448-5d0466003ec34](https://picgo-1307940198.cos.ap-nanjing.myqcloud.com/551694448-5d0466003ec34.webp)

```js
/**
 * 透视投影相机设置
 */
var width = window.innerWidth; //窗口宽度
var height = window.innerHeight; //窗口高度
/**透视投影相机对象*/
var camera = new THREE.PerspectiveCamera(60, width / height, 1, 1000);
camera.position.set(200, 300, 200); //设置相机位置
camera.lookAt(scene.position); //设置相机方向(指向的场景对象)

lookAt方法用来指定相机拍摄对象的坐标位置，.lookAt()方法的参数是Vector3对象，可以手动定义new THREE.Vector3(x,y,z), 实际开发的时候，你希望相机对准那个对象，就返回那个对象的位置属性值，比如上面代码中的scene.position， 就表示返回scene的位置坐标，如果把scene换成网格模型对象就是mesh.position，上面的网格模型是一个立方体， 具体的position属性值就是立方体的几何中心。通过观察点的位置和lookAt方法指向的位置就可以计算出相机的拍摄角度。

对于的透视投影，相机位置与lookAt指向的观察目标位置越小，场景中的三维模型放大倍数越大，同时超出的部分会被剪裁掉， 比如更改上面代码camera.position.set(100,200,200);为(20,20,20)，测试结果你会发现立方体几何体放大显示，超出区域被剪裁。
```

## 3.Geometry

> 关于立方体、二十面体或由 Three.js 几何方法创建的任何其他对象都是相同的东西——**几何**——它们只是在**不同的位置有不同数量的顶点**。
>
> 几何对象有一个名为 vertices 的属性——它包含代表每个顶点的对象数组。您可以修改这些顶点的位置，甚至可以在顶点数组中添加或删除它们。



### BufferGeometry ( 缓存几何模型 )

> 该类是一个 [几何模型(Geometry)](javascript:window.parent.goTo('几何模型(Geometry)')) 的高效替代，因为它使用缓存（buffer）来保存所有数据，包括顶点位置、面索引、法向量、颜色、UVs以及自定义属性。 这节约了向GPU传递全部这些数据的成本。但同时也使得BufferGeometry要比 [几何模型(Geometry)]) 更难以处理，不是以对象的方式来访问，比如使用[Vector3](javascript:window.parent.goTo('Vector3'))来访问位置数据， 以[Color](javascript:window.parent.goTo('Color'))对象来访问颜色数据，你得从相应的[attribute](javascript:window.parent.goTo('缓存属性(BufferAttribute)'))缓存中访问原始数据。 这使得BufferGeometry很适合用来存储静态对象，也就是当我们创建完模型实例后不太需要去操作它。

## 4.Color

```js
// 转化16进制颜色，例如0x000000
// use hex string
var color = new THREE.Color("#6f4171");
// use rgba string
var color = new THREE.Color("rgba(188, 141, 190, 1)");
// 转化成例如0x000000
var hex = color.getHex()
```

## 5.Lights

> 阴影更加柔和
>
> + spotLight.shadow.mapSize = new THREE.Vector2(1024, 1024)，提高mapSize
>
> +   renderer.shadowMapSoft = true;
>
>     renderer.shadowMap.type = THREE.PCFSoftShadowMap;

### 0.Light Camera

![image-20220924220747474](https://picgo-1307940198.cos.ap-nanjing.myqcloud.com/image-20220924220747474.png)

### 1.AmbientLights (环境光)

>不能作为唯一光源，会将物体渲染成一个颜色
>
>不需要指定位置

### 2.PointLIght (点光源)

> 从一点向所有方向发射光线

### 3.SpotLIght (聚光灯）

> 锥型光，最常用 (color,intensity,distance,fov)
>
> p58 ; 薄对象渲染阴影 ====> 渲染失真  ===> shadow.bias

```js
spotlight.shadow.mapSize = new Three.Vector2(512,512) // default; 增加可以看起来更顺滑，减少锯齿
```

### 4.DirectionalLight (平行光)

> 模拟太阳光；不会随着距离越远光线变暗

![image-20220927211256488](https://picgo-1307940198.cos.ap-nanjing.myqcloud.com/image-20220927211256488.png)

### 5.HemisphereLight (半球光)

> 一种直接位于场景上方的光源，颜色从天空颜色淡化到地面颜色。模拟真实太阳光，贴合户外光照效果

```js
new THREE.HemisphereLight( 0xffffbb, 0x080820, 1 ) /// skyColor; groundColor ; intensity  
```

### 6.RectAreaLight (区域光)

> RectAreaLight 在面部均匀地发射出一个矩形平面。这种类型的光可以用来模拟光源，如明亮的窗户或条形照明。

### 7.Lensflare (光晕)

> LensflareElement ( texture : Texture, size : Float, distance : Float, color : Color )



## 6.Material

> 基础属性：p72
>
> 融合属性：p73
>
> 高级属性：p74 

### 0.顶点颜色

![image-20220926210041046](https://picgo-1307940198.cos.ap-nanjing.myqcloud.com/image-20220926210041046.png)

```js
// 创建属性缓冲区对象
var attribue = new THREE.BufferAttribute(vertices, 3); //3个为一组，作为一个顶点的xyz坐标
// 设置几何体attributes属性的位置position属性
geometry.attributes.position = attribue;
//类型数组创建顶点颜色color数据
var colors = new Float32Array([
  1, 0, 0, //顶点1颜色
  0, 1, 0, //顶点2颜色
  0, 0, 1, //顶点3颜色

  1, 1, 0, //顶点4颜色
  0, 1, 1, //顶点5颜色
  1, 0, 1, //顶点6颜色
]);
// 设置几何体attributes属性的颜色color属性
geometry.attributes.color = new THREE.BufferAttribute(colors, 3); //3个为一组,表示一个顶点的颜色数据RGB
//材质对象
var material = new THREE.PointsMaterial({
  // 使用顶点颜色数据渲染模型，不需要再定义color属性
  // color: 0xff0000,
  vertexColors: THREE.VertexColors, //以顶点颜色为准
  size: 10.0 //点对象像素尺寸
});
// 点渲染模式  点模型对象Points
var points = new THREE.Points(geometry, material); //点模型对象
scene.add(points); //点对象添加到场景
```

![image-20220927202330596](https://picgo-1307940198.cos.ap-nanjing.myqcloud.com/image-20220927202330596.png)

### 1.简单网格材质

> 对于three.js而言漫反射、镜面反射分别对应两个构造函数 MeshLambertMaterial  ， MeshPhongMaterial

> 无光照影响；
>
> side：材质应用于物体哪一侧，plane旋转时有一半时间看不见，因为材质默认渲染在前面 ==> 但是side:double ===> 影响性能
>

#### 应用场景（side）

​	双面贴图，立方体、球体前后贴图，



#### 2.MeshDepthMaterial

>其外观不是由光照或者属性决定，而是由物体于摄像机距离决定；camer.near / far;决定所见区域范围

#### 应用场景

​	物体随着距离增大逐渐消失



#### 3.联合材质

> 重点



#### 4.MeshNromalMaterial

> 将flatshading 设置为true时，每一个小方块面的颜色是由该面的法向量的方向决定的



#### 5.MeshLambertMaterial

> 感光，石头木材等，
>
> emisssive:无法被光源照射到的暗处显示的颜色，默认为黑色



#### 最佳材质⭐6.MeshStandardMaterial

> metalness设置金属质感表面
>
> roughness设置木制或者塑料质感表面

+ displacementMap 位移贴图

  > 几何体例如boxgeometry（1，1，1，200，200）点数增加才有效果
  >
  > displacementMapScale设置这个图突出来部分的比例



## 7.Geometry

### 1.二维几何体

#### 1.BufferGeometry（新几何基类⭐）

> 内部数据组织形式和GPU所期待的数据结构保持一致，提高了运行效率
>
> 将数据放在一块连续的内存空间中, 有效减少向 GPU 传输上述数据所需的开销

```js
旧几何基类：Geometry({vertices:[] , face:[new THREE.Face3()]})
```

```js
新几何基类：attribute(分量) index(索引)
```

attribute属性 以BoxGeometry为例 

+ normal ：法向量 

  > 24个值；俩个一组，itemSize
  >
  > 当前面的朝向，例如计算当前面的光线反射

+  position：顶点位置 

  > 六个面，每个面四个点，一共24组，每个组（坐标）由(x,y,z)三个值构成，一共72个值

+ UV

  > 24个值；俩个一组，itemSize
  >
  > 立方体展开的坐标 (x,y)

  ![image-20220918221652823](https://picgo-1307940198.cos.ap-nanjing.myqcloud.com/image-20220918221652823.png)

  ![image-20220918222034390](https://picgo-1307940198.cos.ap-nanjing.myqcloud.com/image-20220918222034390.png)

#### 2.PlaneGeometry(正方形平面)

> (width ,  height ,  widthSegments ,  heightSegments )
>
> 宽 ， 高 ，宽度划分为几段，高度划分为几段
>
> ⭐访问宽度 ：plane.parameters.width(不能直接时plane.width)

#### 3.CircleGeometry(圆形平面)

> (radius , segments, thetaStart , thetaLength )
>
> 半径 ， 创建圆需要的三角面数量 ， 从哪里开始画圆 ， 圆画多大默认2Π

#### 4.RingGeometry(同心圆)

> innerRadius , outerRadius, thetaSegments , phiSegments , thetaStart , thetaLength 
>
> 内径 ， 外径  ，对角线段数量 ， 面数量，开始位置 ， 圆画多大默认2Π

#### 5.ShapeGeometry(自定义二维图形形状)

![image-20220813134559226](https://picgo-1307940198.cos.ap-nanjing.myqcloud.com/image-20220813134559226.png)

> 详见demo

### 2.三维几何体

#### 1.BoxGeometry (立方体)

#### 2.SphereGeometry (球体)

#### 3.CylinderGeometry (圆柱体)

#### 4.ConeGeometry (圆锥体)

#### 5.TorusGeometry (圆环，甜甜圈)

#### 6.TorusKnotGeometry (环形纽结，管子绕几圈)

#### 7.PolyhedronGeometry (自定义多面几何体)

#### 8.TetrahedronGeometry (正四面体)

#### 9.OctahedronGeometry (正八面体)

#### 10.DodecahedronGeometry (正十二面体)

### 3.高级几何体

#### 1.LatheGeometry（花瓶）

![image-20220821145904945](https://picgo-1307940198.cos.ap-nanjing.myqcloud.com/image-20220821145904945.png)

#### 2.ExtrudeGeometry（二维拉伸变为三维）

#### 3.TubeGeometry（管状物体）

#### 4.ParametricGeometry（波浪平面）

> 基于等式的几何体

#### 5.三维文本

1. 使用ExtrudeGeometry将二维文本转化为三维

####  6.文字创建

+  css2DObject   css2DRenderer
+ css3DObject     css3DSprite    css3DRenderer

### 4.旋转平移缩放

![image-20220927204459899](https://picgo-1307940198.cos.ap-nanjing.myqcloud.com/image-20220927204459899.png)

```js
//向量Vector3对象表示方向
var axis = new THREE.Vector3(1, 1, 1);
axis.normalize(); //向量归一化
//沿着axis轴表示方向平移100
mesh.translateOnAxis(axis, 100);
// 执行.translateX()、.translateY()、.translateOnAxis()等方法本质上改变的都是模型的位置属性.position。

var axis = new THREE.Vector3(0,1,0);//向量axis
mesh.rotateOnAxis(axis,Math.PI/8);//绕axis轴旋转π/8
// 旋转方法改变的是表示模型角度状态的角度属性.rotation或者四元数属性.quaternion。
```



## 8.精灵和粒子

> 精灵始终面向相机

```js
let sprite = new THREE.Sprite(material);
```

## 9.Group

> 与Three.Mesh 和 Three.Scene 的基类Three.Object3D非常接近，唯一不同是它本身没有任何可渲染的数据
>
> 旋转缩放都是相对于自身，08-group，一个整体

## 10.加载外部资源

- JSON

  > 导出单个mesh的json文件

  ```js
  // 保存json格式文件
  let result = new THREE.mesh( geometry , material ).toJSON();
  localStorage.setItem("json", JSON.stringify(result));
  
  // 加载json格式文件
  let loadedGeometry = JSON.parse(json);
  let loadedMesh = new THREE.ObjectLoader().parse(loadedGeometry);
  ```

  > 导出所有场景信息的json文件

  ```js
  // 保存json格式文件
  let result = scene.toJSON();
  localStorage.setItem("json", JSON.stringify(result));
  
  // 加载json格式文件
  let loadedGeometry = JSON.parse(json);
  let loadedMesh = new THREE.ObjectLoader().parse(loadedGeometry);
  ```

  > blender 导出json文件

  ```js
  let loader = new THREE.JSONLoader();
  loader.load('../../assets/models/house/house.json', function (geometry, mat) {
  
      let mesh = new THREE.Mesh(geometry, mat[0]);
      mesh.castShadow = true;
      mesh.receiveShadow = true;
  
      // call the default render loop.
      loaderScene.render(mesh, camera);
  });
  ```

- OBJ / MTL

  > OBJ定义几何体，MTL定义材质，基于文本的材质
  >
  > ps：blender导出OBJ / MTL 文件

  ```js
  import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js'
  let loader = new OBJLoader();
  loader.load('../../assets/models/pinecone/pinecone.obj', function (mesh) {
  
  let material = new THREE.MeshLambertMaterial({
    color: 0x5C3A21
  });
  
  // loadedMesh is a group of meshes. For 
  // each mesh set the material, and compute the information 
  // three.js needs for rendering.
  mesh.children.forEach(function (child) {
    child.material = material;
    child.geometry.computeVertexNormals();
    child.geometry.computeFaceNormals();
  });
  
  mesh.scale.set(120,120,120)
  
  // call the default render loop.
  loaderScene.render(mesh, camera);
  });
  ```

  ```js
  var mtlLoader = new THREE.MTLLoader();
  mtlLoader.setPath("../../assets/models/butterfly/")
  mtlLoader.load('butterfly.mtl', function (materials) {
  materials.preload();
  
  var objLoader = new THREE.OBJLoader();
  objLoader.setMaterials(materials);
  objLoader.load('../../assets/models/butterfly/butterfly.obj', function (object) {
  
    // move wings to more horizontal position 同层次位置
    [0, 2, 4, 6].forEach(function (i) {
      object.children[i].rotation.z = 0.3 * Math.PI
    });
  
    [1, 3, 5, 7].forEach(function (i) {
      object.children[i].rotation.z = -0.3 * Math.PI
    });
  
    // configure the wings,
    var wing2 = object.children[5];
    var wing1 = object.children[4];
  
    wing1.material.opacity = 0.9;
    wing1.material.transparent = true;
    wing1.material.depthTest = false;
    // 两侧都可以看见  
    wing1.material.side = THREE.DoubleSide;
  
    wing2.material.opacity = 0.9;
    wing2.material.depthTest = false;
    wing2.material.transparent = true;
    wing2.material.side = THREE.DoubleSide;
  
    object.scale.set(140, 140, 140);
    mesh = object;
  
    object.rotation.x = 0.2;
    object.rotation.y = -1.3;
  
    loaderScene.render(mesh, camera);
  });
  });
  ```

## 11.动画animation

### 1.物体选中Raycaster

> 这个类用于进行[raycasting](https://link.juejin.cn/?target=https%3A%2F%2Fen.wikipedia.org%2Fwiki%2FRay_casting)（光线投射）。 光线投射用于进行鼠标拾取（在三维空间中计算出鼠标移过了什么物体）。

![image-20220829223004697](https://picgo-1307940198.cos.ap-nanjing.myqcloud.com/image-20220829223004697.png)

![image-20220829223034707](https://picgo-1307940198.cos.ap-nanjing.myqcloud.com/image-20220829223034707.png)

```js
// 官网实例
https://threejs.org/docs/index.html?q=ray#api/en/core/Raycaster

let raycaster = new THREE.Raycaster();

// 鼠标的默认位置是一个二维向量
var mouse = new THREE.Vector3()
document.addEventListener("mousemove", onDocumentMouseMove, false);

// 监听鼠标移动，记录坐标信息
function onDocumentMouseMove(event) {
    event.preventDefault();

    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    mouse.z = 0.5
}
// 计算出相机照射到鼠标的光线
// 归一化坐标 ； 光线起源位置
raycaster.setFromCamera(mouse, camera);
// 找到 和射线相交的对象，返回数组(相交的物体不只有一个)
let intersects = raycaster.intersectObjects(scene.children);
// your logic
...
```

### 2.Tween.js的使用

> 通过这个库可以很容易地实现某个属性在两个值之间的进行过渡，而且起始值和结束值之间的所有中间值都会自动计算出来，这个过程叫作`tweening`（补间）, 产生平滑的动画效果。
>
> [ tween.js 中文使用指南 - 掘金 ](https://juejin.cn/post/6844903545053921293)

### 3.摄像机

![image-20220901221248725](https://picgo-1307940198.cos.ap-nanjing.myqcloud.com/image-20220901221248725.png)

## 12.Loader

### 1.OBJLoader

> 用于加载.obj 资源的加载程序。
>
> OBJ 文件格式是一种简单的数据格式，它以人类可读的格式表示三维几何图形，如每个顶点的位置，每个纹理坐标顶点的 UV 位置，顶点法线，以及使每个多边形定义为顶点列表的面，和纹理顶点。

```
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js'
```

### 2.GLTFLoader

> ⭐路径问题
>
> 用于载入*glTF 2.0*资源的加载器
>
> gl传输格式，更高效地传输、加载3D内容；该类文件以JSON（.gltf）格式或二进制（.glb）格式提供， 外部文件存储贴图（.jpg、.png）和额外的二进制数据（.bin）。一个glTF组件可传输一个或多个场景， 包括网格、材质、贴图、蒙皮、骨架、变形目标、动画、灯光以及摄像机。

### 3.DRACOLoader

> ⭐路径问题
>
> 压缩解压模型loader

### 4.RGBELoader

> 加载hdr文件

## 13.纹理加载⭐

### 1.引入纹理文件

+ **加载方式**

  > // src目录下需要require , 其他直接写路径，图片可以是jpg，jpeg，png
  >
  > ⭐图片长宽最好是2的次方，`256*256`、`512*512`、`1024*1024`
  >
  > let a = require('../../assets/textures/particles/raindrop-3.png')
  >
  > let texture = new THREE.TextureLoader().load(a);

+ **⭐纹理加载是异步的**

  > load ( '../../位置路径'，loadFunction ,  onProgressFunction , onErrorFunction)
  >
  > 成功回调 ， 加载进度回调 ， 解析错误回调

  ```js
  const loadingManager = new THREE.loadingManager()
  const textureLoader = new THREE.TextureLoader(loadingManager)
  const aTexture = textureLoader.load('path',onSuccess,onProgress,onError)
  ```

+ HDR

  > DataTextureLoader()加载rgba，hdr，内部使用FileLoader
  >
  > RGBEloader
  >
  > 经纬度贴图

  ![image-20220922221637470](https://picgo-1307940198.cos.ap-nanjing.myqcloud.com/image-20220922221637470.png)

+ **纹理处理**

  > 纹理不会是刚刚好的，通常需要放大缩小，设置magFilter来指定纹理如何放大 ；设置minFilter设置纹理如何缩小；

  ![image-20220906223417907](https://picgo-1307940198.cos.ap-nanjing.myqcloud.com/image-20220906223417907.png)

  > 除了上面俩，还可以设置mipmap，mipmap是将纹理按照2的倍数缩小（光滑过滤效果，正方形）

  ![image-20220906223837171](https://picgo-1307940198.cos.ap-nanjing.myqcloud.com/image-20220906223837171.png)

  > 默认值 magFilter ： Three.LinearFilter ;  minFilter : Three.LinearMIpMapLinearFilter
  >
  > 放大缩小时候的像素计算逻辑，默认是线性求知，有模糊效果

+ UV贴图

  > 纹理可以很好的贴合，是通过UV贴图实现的，可以告诉渲染器将纹理的哪部分应用到指定的面上
  
+ 纹理属性

  ![image-20220919203803563](https://picgo-1307940198.cos.ap-nanjing.myqcloud.com/image-20220919203803563.png)

  > offset 纹理的平移
  >
  > rotation 纹理旋转 ；center:旋转中心点，默认是（0，0）即左下角 ====> 中心点是（0.5，0.5）

### 2.凹凸贴图创建褶皱

> 为材质添加厚度

+ 普通凹凸贴图增加细节凹凸感

+ 法向量贴图细节更强

+ 位移贴图真正改变物体表面形状

+ 环境光遮挡贴图

  > 重复渲染阴影消耗性能，静态的阴影可以使用一次性的环境光遮挡贴图
  >
  > aomap ,并且设置第二组uv
  >
  > ![image-20220919212131004](https://picgo-1307940198.cos.ap-nanjing.myqcloud.com/image-20220919212131004.png)

+ 光照贴图，光照遮挡产生阴影，

+ 金属贴图和粗糙贴图，金属光泽和粗糙（木制塑料）表面

+ 透明贴图

  > 普通的map和alphamap可以一起使用，再加上transparent属性可以实现普通纹理部分隐藏
  >
  > 黑色透明，白色不透明，灰色中间

+ 自发光贴图，自己不会成为光源

+ 环境贴图，伪造镜面反射

+ UV映射

  > 2d图片加载到3d物体上面；指定纹理的哪部分显示在物体的表面；uv映射一般是在类似于Blender的软件中完成，

  ![image-20220915204106728](https://picgo-1307940198.cos.ap-nanjing.myqcloud.com/image-20220915204106728.png)

![image-20220915204209214](https://picgo-1307940198.cos.ap-nanjing.myqcloud.com/image-20220915204209214.png)

![image-20220915204352950](https://picgo-1307940198.cos.ap-nanjing.myqcloud.com/image-20220915204352950.png)

## 14.Core

### 1.clock

> `Clock`本质上就是对 JS 的`Date`对象进行封装，

+ .getDelta ()

  获得前后两次执行该方法的时间间隔

  > 假设你执行一次`.getDelta ()`方法，再执行一次`.getDelta ()`方法，第二次执行`.getDelta ()`方法时候，可以返回上次调用该方法到本次调用之间的时间间隔，返回间隔时间单位是秒，

## 15.controls

### 1.TrackballControls

> 只能出现在appendchild之后

```js
document.body.appendChild(renderer.domElement);

let trackballControls = initTrackballControls(camera, renderer);
```

### 

## 16 .核心要点

### 1.Float32Array⭐

> `Float32Array` 固定长度，存储浮点类型数据的数组，别的数据类型转为NAN，默认为0
>
> 使用场景 : 数组数量大，操作频繁，操作二进制数据
>
> ⭐数组放在堆中，ArrayBuffer则把数据放在栈中（所以取数据时后者快）
>
> 向下需要先设置长度，例如new Float32Array（9）或者new  Float32Array([10.,1.0,1.0,2.0,2.0,2.0])

### 2.Matrix4(矩阵)

+ **概述**：

> 每一个object3d对象都有一个matrix对象（变换矩阵）旋转缩放平移

![image-20220829164236064](https://picgo-1307940198.cos.ap-nanjing.myqcloud.com/image-20220829164236064.png)

+ **作用**：

  > 旋转3d物体,三阶矩阵

![image-20220829164414806](https://picgo-1307940198.cos.ap-nanjing.myqcloud.com/image-20220829164414806.png)

![image-20220829164658843](https://picgo-1307940198.cos.ap-nanjing.myqcloud.com/image-20220829164658843.png)

### 3.欧拉角（Euler）and 四元数（Quaternion）

+ **Euler**

  > 欧拉角描述一个旋转变换，通过指定轴顺序和其各个轴向上的指定旋转角度来旋转一个物体

  ```js
  // Euler(x,y,z,order) 参数xyz分别表示绕xyz轴旋转的角度值，角度单位是弧度。参数order表示旋转顺序,默认值XYZ，也可以设置为YXZ、YZX等值
  var Euler = new THREE.Euler( Math.PI/4,0, Math.PI/2); || Euler.x = Math.PI/4;
  ```

  

+ **Quaternion**

  ![image-20220829172716828](https://picgo-1307940198.cos.ap-nanjing.myqcloud.com/image-20220829172716828.png)

  ```
  一个四元数可以表示为q = w + xi + yj + zk ; 我们下面使用q = ((x, y, z)，w) = (v, w)，其中v是向量，w是实数，这样的式子来表示一个四元数。
  我们可以使用一个四元数q=((x,y,z)sinθ2, cosθ2) 来执行一个旋转
  ```

  

  > 旋转的一种表示方法
  >
  > 四元数对象`Quaternion`使用x、y、z和w四个分量表示。

  ```js
  var quaternion = new THREE.Quaternion();
  console.log('查看四元数结构',quaternion);
  console.log('查看四元数w分量',quaternion.w);
  ```

  + **.setFromAxisAngle()**

    > 四元数的方法`.setFromAxisAngle(axis, angle)`通过旋转轴axis和旋转角度angle设置四元数数据，也就是x、y、z和w四个分量。
    >
    > 绕单位向量Vector3(x,y,z)表示的轴旋转θ度

    ```js
    var quaternion = new THREE.Quaternion();
    // 旋转轴new THREE.Vector3(0,1,0)
    // 旋转角度Math.PI/2
    quaternion.setFromAxisAngle(new THREE.Vector3(0,1,0),Math.PI/2)
    ```

  + **.multiply()**

    > 四元数乘法, 俩次连续旋转

    ```js
    // 四元数q1、q2分别表示一个旋转，两个四元数进行乘法运算，相乘结果保存在q2中
    // 在q1表示的旋转基础在进行q2表示的旋转操作
    q1.quaternion.multiply( q2 );
    ```

    

+ ### 欧拉角、四元数和矩阵转化

  #### `Matrix4.makeRotationFromQuaternion(q)`

  通过矩阵对象`Matrix4`的`.makeRotationFromQuaternion(q)`方法可以把四元数转化对应的矩阵对象。

  #### `quaternion.setFromEuler(Euler)`

  通过欧拉对象设置四元数对象

  #### `Euler.setFromQuaternion(quaternion)`

  四元数转化为欧拉对象

### ⭐Object3D

+ **rotation** ：Euler对象
+ **quaternion** ：Quaternion对象

执行`Object3D`对象旋转方法，会同时改变对象的角度属性和四元数属性。

四元数属性和位置`.position`、缩放属性`.scale`一样会转化为对象的本地矩阵属性

**⭐`.matrix`,本地矩阵属性值包含了旋转矩阵、缩放矩阵、平移矩阵。**

`Object3D`对象角度属性`.rotation`和四元数属性`.quaternion`是相互关联的**⭐一个改变会同时改变另一个**。

### 4.顶点与BufferGeometry

+ 面法向量

  > WebGL中为了计算光线与物体表面入射角，你首先要计算物体表面每个位置的法线方向
  >
  > 没有法向量数据，点光源、平行光等带有方向性的光源不会起作用，三角形平面整个渲染效果相对暗淡，而且两个三角形分界位置没有棱角感。

  ![image-20220926211126429](https://picgo-1307940198.cos.ap-nanjing.myqcloud.com/image-20220926211126429.png)

  ![image-20220926211352678](https://picgo-1307940198.cos.ap-nanjing.myqcloud.com/image-20220926211352678.png)

     ```js
  var normals = new Float32Array([
    0, 0, 1, //顶点1法向量
    0, 0, 1, //顶点2法向量
    0, 0, 1, //顶点3法向量
  
    0, 1, 0, //顶点4法向量
    0, 1, 0, //顶点5法向量
    0, 1, 0, //顶点6法向量
  ]);
  // 设置几何体attributes属性的位置normal属性
  geometry.attributes.normal = new THREE.BufferAttribute(normals, 3); //3个为一组,表示一个顶点的法向量数据
     ```

+ 顶点索引复用

  ![image-20220926211827522](https://picgo-1307940198.cos.ap-nanjing.myqcloud.com/image-20220926211827522.png)

  ```js
  var geometry = new THREE.BufferGeometry(); //声明一个空几何体对象
  //类型数组创建顶点位置position数据
  var vertices = new Float32Array([
    0, 0, 0, //顶点1坐标
    80, 0, 0, //顶点2坐标
    80, 80, 0, //顶点3坐标
  
    0, 0, 0, //顶点4坐标   和顶点1位置相同
    80, 80, 0, //顶点5坐标  和顶点3位置相同
    0, 80, 0, //顶点6坐标
  ]);
  // 创建属性缓冲区对象
  var attribue = new THREE.BufferAttribute(vertices, 3); //3个为一组
  // 设置几何体attributes属性的位置position属性
  geometry.attributes.position = attribue
  var normals = new Float32Array([
    0, 0, 1, //顶点1法向量
    0, 0, 1, //顶点2法向量
    0, 0, 1, //顶点3法向量
  
    0, 0, 1, //顶点4法向量
    0, 0, 1, //顶点5法向量
    0, 0, 1, //顶点6法向量
  ]);
  // 设置几何体attributes属性的位置normal属性
  geometry.attributes.normal = new THREE.BufferAttribute(normals, 3); //3个为一组,表示一个顶点的xyz坐标
  ```

  + 因为矩形的两个三角形有两个顶点位置重复，所以顶点位置数据、顶点法向量数据都只需要定义4个就可以。
  + 创建顶点索引数组的时候，可以根据顶点的数量选择类型数组`Uint8Array`、`Uint16Array`、`Uint32Array`。对于顶点索引而言选择整型类型数组，对于非索引的顶点数据，需要使用浮点类型数组`Float32Array`等。

  ```js
  var geometry = new THREE.BufferGeometry(); //声明一个空几何体对象
  //类型数组创建顶点位置position数据
  var vertices = new Float32Array([
    0, 0, 0, //顶点1坐标
    80, 0, 0, //顶点2坐标
    80, 80, 0, //顶点3坐标
    0, 80, 0, //顶点4坐标
  ]);
  // 创建属性缓冲区对象
  var attribue = new THREE.BufferAttribute(vertices, 3); //3个为一组
  // 设置几何体attributes属性的位置position属性
  geometry.attributes.position = attribue
  var normals = new Float32Array([
    0, 0, 1, //顶点1法向量
    0, 0, 1, //顶点2法向量
    0, 0, 1, //顶点3法向量
    0, 0, 1, //顶点4法向量
  ]);
  // 设置几何体attributes属性的位置normal属性
  geometry.attributes.normal = new THREE.BufferAttribute(normals, 3); //3个为一组,表示一个顶点的xyz坐标
  
  // Uint16Array类型数组创建顶点索引数据,16位整型
  var indexes = new Uint16Array([
    // 0对应第1个顶点位置数据、第1个顶点法向量数据
    // 1对应第2个顶点位置数据、第2个顶点法向量数据
    // 索引值3个为一组，表示一个三角形的3个顶点
    0, 1, 2,
    0, 2, 3,
  ])
  // 索引数据赋值给几何体的index属性
  geometry.index = new THREE.BufferAttribute(indexes, 1); //1个为一组
  ```

  ![image-20220926212817183](https://picgo-1307940198.cos.ap-nanjing.myqcloud.com/image-20220926212817183.png)

  

### 5.position和世界坐标(scale同理)

> `position`获得模型在本地坐标系或者说模型坐标系下的三维坐标，
>
> 通过模型的`.getWorldPosition()`方法获得该模型在世界坐标下的三维坐标。
>
> :star: mesh的世界坐标是mesh位置属性`.position`和mesh父对象group位置属性`.position`的累加。
>
> 总结:
>
> 所谓本地坐标系，就是相对模型的父对象而言，模型位置属性`.position`表示的坐标值就是以本地坐标系为参考，表示子对象相对本地坐标系原点(0,0,0)的偏移量。
>
> Threejs场景Scene是一个树结构，一个模型对象可能有多个父对象节点。世界坐标系默认就是对Threejs整个场景Scene建立一个坐标系，一个模型相对世界坐标系的坐标值就是该模型对象所有父对象以及模型本身位置属性`.position`的叠加。

```js
var mesh = new THREE.Mesh(geometry, material);
// mesh的本地坐标设置为(50, 0, 0)
mesh.position.set(50, 0, 0);
var group = new THREE.Group();
// group本地坐标设置和mesh一样设置为(50, 0, 0)
// mesh父对象设置position会影响得到mesh的世界坐标
group.position.set(50, 0, 0);
group.add(mesh);
scene.add(group);

// .position属性获得本地坐标
console.log('本地坐标', mesh.position);

// getWorldPosition()方法获得世界坐标
//该语句默认在threejs渲染的过程中执行,如果渲染之前想获得世界矩阵属性、世界位置属性等属性，需要通过代码更新
scene.updateMatrixWorld(true);
var worldPosition = new THREE.Vector3();
mesh.getWorldPosition(worldPosition);
console.log('世界坐标', worldPosition);
```



## 17.other

### 1.stats.js

> **JavaScript Performance Monitor**

This class provides a simple info box that will help you monitor your code performance.

- **FPS** Frames rendered in the last second. The higher the number the better. 
  + 每秒帧数
- **MS** Milliseconds needed to render a frame. The lower the number the better.
  + 渲染一帧花费时间
- **MB** MBytes of allocated memory. (Run Chrome with `--enable-precise-memory-info`)
  + 内存占用量
- **CUSTOM** User-defined panel support.

### 2.dat.gui

> **gui.add(object, key, min, max, step);**
>
> 对象，key，最小值，最大值，单位

```js
let testObj = {
    x: 10,
    y: "20",
    z: 30,
    color: '#66ccff',
};

let gui = new dat.GUI();
// 折叠
let f = gui.addFolder('入门');
f.add(testObj, "x", 5, 175, 1);
f.add(testObj, "y");
f.add(testObj, "z");
f.addColor(testObj, "color");
f.add(testObj, "type", ['one', 'two', '三']); // 下拉
f.add(testObj, "speed", {slow: 1, '中速': 20, fast: 50});

.listen()双向绑定
// 如果你想从外部控制选项，你可以为选项调用 listen 方法，则你改变option时，也会同步到面板里
```

### 4.Three框选

> https://threejs.org/examples/#misc_boxselection
>
> https://blog.csdn.net/qq_40147088/article/details/120860635

### 5.Material.depthTest

> depthTest:深度渲染，俩个物体重合时设为false只渲染前面

用于去除纹理的黑色背景，



### 8.PBR

> 基于物理引擎模仿光的实际行为，让图像看起来更真实

+ 组成部分

![image-20220920213223463](https://picgo-1307940198.cos.ap-nanjing.myqcloud.com/image-20220920213223463.png)

+ 灯光属性

  + 1.光线类型

    > 直射光；环境光
    >
    > 入射   === >  反射

    ![image-20220920214238414](https://picgo-1307940198.cos.ap-nanjing.myqcloud.com/image-20220920214238414.png)

  + ![image-20220920214417842](https://picgo-1307940198.cos.ap-nanjing.myqcloud.com/image-20220920214417842.png)

![image-20220920214724375](https://picgo-1307940198.cos.ap-nanjing.myqcloud.com/image-20220920214724375.png)

![image-20220920214940190](https://picgo-1307940198.cos.ap-nanjing.myqcloud.com/image-20220920214940190.png)

![image-20220920215556311](https://picgo-1307940198.cos.ap-nanjing.myqcloud.com/image-20220920215556311.png)

### 9.HDR

> 高动态对比度技术，更广泛的色彩范围，照片效果更好，

### 10.缩略图

> https://github.com/mrdoob/three.js/blob/master/examples/webgl_framebuffer_texture.html
>
> https://github.com/mrdoob/three.js/blob/master/examples/webgl_lines_fat.html
>
> http://localhost:8080/examples/#webgl_lines_fat_wireframe

### 11.圆锥体指向

> https://github.com/mrdoob/three.js/blob/master/examples/webgl_math_orientation_transform.html

### 12.碰撞检测 + 2d四叉树+3d八叉树

https://blog.csdn.net/zhanxinhang/article/details/6706217

> https://threejs.org/examples/?q=tree#webgl_raycaster_bvh



### 13.BOX3

> Box3在3D空间中表示一个包围盒。其主要用于表示物体在世界坐标中的边界框。它方便我们判断物体和物体、物体和平面、物体和点的关系等等。

+ 