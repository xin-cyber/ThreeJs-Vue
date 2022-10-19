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

其实对相机对象一些参数的设置本质上就是设置相机对象的视图矩阵`.matrixWorldInverse`和投影矩阵`.projectionMatrix`属性

改变相机的参数后，注意需要执行相机对象`.updateProjectionMatrix ()`方法更新相机对象的投影矩阵，之所以需要手动更新，是因为Threejs为了提高渲染效率，Threejs系统每次执行渲染器`WebGLRenderer`渲染方法`.render()`的时候不会读取相机相关的参数重新计算一次投影矩阵`.projectionMatrix`，Threejs系统只会首次渲染的时候计算一次投影矩阵，所以当你改变影响相机投影矩阵的属性，自然需要调用`.updateProjectionMatrix ()`更新相机对象的投影矩阵`.projectionMatrix`。

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

#### 1.LatheGeometry（二维旋转变为三维）

> 几何体具备旋转特征，比如球体，常见杯子, 
>
> `LatheGeometry`可以利用已有的二维数据生成三维顶点数据，二维数据可以通过二维向量对象`Vector2`定义，也可以通过3D曲线或2D线条轮廓生成。 `LatheGeometry`的二维坐标数据默认绕y轴旋转。

![image-20220930141934403](https://picgo-1307940198.cos.ap-nanjing.myqcloud.com/image-20220930141934403.png)



#### 2.ExtrudeGeometry（二维拉伸变为三维）

```js
/**
 * 创建拉伸网格模型
 */
var shape = new THREE.Shape();
/**四条直线绘制一个矩形轮廓*/
shape.moveTo(0,0);//起点
shape.lineTo(0,100);//第2点
shape.lineTo(100,100);//第3点
shape.lineTo(100,0);//第4点
shape.lineTo(0,0);//第5点
var geometry = new THREE.ExtrudeGeometry(//拉伸造型
    shape,//二维轮廓
    //拉伸参数
    {
        amount:120,//拉伸长度
        bevelEnabled:false//无倒角
    }
);
```



#### 3.⭐TubeGeometry（管状物体）

> 通过一条曲线生成一个圆管 ；曲线实现方式
>
> 它的本质就是以曲线上顶点为基准，生成一系列曲线等径分布的顶点数据， 具体算法如何实现的可以查看three.js引擎源码。
>
> demos / curves

#### 4.ParametricGeometry（波浪平面）

> 基于等式的几何体

#### 5.shape对象和shapeGeometry (轮廓填充)

> 三角形自动填充shape内轮廓和外轮廓中间的中部。
>
> 通过下面代码定义了6个顶点坐标，也可以说是5个，最后一个和第一个是重合的，构成一个五边形区域。然后使用这一组二维顶点坐标作为`Shape`的参数构成一个五边形轮廓。把五边形轮廓`Shape`作为`ShapeGeometry`的参数，可以根据轮廓坐标计算出一系列三角形面填充轮廓，形成一个平面几何体。

```js
// 通过shpae基类path的方法绘制轮廓（本质也是生成顶点）
var shape = new THREE.Shape();
// 四条直线绘制一个矩形轮廓
shape.moveTo(0,0);//起点
shape.lineTo(0,100);//第2点
shape.lineTo(100,100);//第3点
shape.lineTo(100,0);//第4点
shape.lineTo(0,0);//第5点
```

![image-20220930155842364](https://picgo-1307940198.cos.ap-nanjing.myqcloud.com/image-20220930155842364.png)

```js
// 圆弧与直线连接 ，从左到右，左上角坐标系
var shape = new THREE.Shape(); //Shape对象
var R = 50;
// 绘制一个半径为R、圆心坐标(0, 0)的半圆弧
shape.absarc(0, 0, R, 0, Math.PI); // x,y中心点 ； 半径  ；起始角 ； 终止角 .默认逆时针
//从圆弧的一个端点(-R, 0)到(-R, -200)绘制一条直线
shape.lineTo(-R, -200); // 在当前路径上，从.currentPoint连接一条直线到x,y。
// 绘制一个半径为R、圆心坐标(0, -200)的半圆弧
shape.absarc(0, -200, R, Math.PI, 2 * Math.PI);
//从圆弧的一个端点(R, -200)到(-R, -200)绘制一条直线
shape.lineTo(R, 0);
var geometry = new THREE.ShapeGeometry(shape, 30);


// 样条曲线生成更多的点
points = [new THREE,Vector2(10,10),new THREE,Vector2(20,10)]
var SplineCurve = new THREE.SplineCurve(points)  // 三维曲线
var shape = new THREE.Shape(SplineCurve.getPoints(300)); // 二维平面形状
```

**⭐Shape填充 ， Path取消填充**

![image-20220930160336949](https://picgo-1307940198.cos.ap-nanjing.myqcloud.com/image-20220930160336949.png)



#### 5.曲线曲面⭐

> **demos / Curves**

+ **EllipseCurve**: 二维椭圆曲线

+ **CatmullRomCurve3**：不规则曲线

+ **TubeGeometry**：管道三维曲线，需要传入curve，例如CatmullRomCurve3，LineCurve3

+ **LatheGeometry**：旋转几何体

+ **⭐shape和shapeGeometry** : 平面自定义shape

  ```js
  var ponits = [点坐标]
  var geometry = new THREE.ShapeGeometry(new THREE.Shape(points) , 25)
  var mesh = new THREE.Mesh(geometry, material)
  ```

+ **⭐shape和shapeGeometry**

  ```js
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
  ```

  

![image-20220929204332219](https://picgo-1307940198.cos.ap-nanjing.myqcloud.com/image-20220929204332219.png)

+ **圆弧线 ArcCurve**

  > 圆弧线[ArcCurve](http://www.yanhuangxueyuan.com/threejs/docs/index.html#api/zh/extras/curves/ArcCurve)的基类是椭圆弧线[EllipseCurve](http://www.yanhuangxueyuan.com/threejs/docs/index.html#api/zh/extras/curves/EllipseCurve)  ; 椭圆弧线的基类是曲线`Curve`

  ```js
  //参数：    圆弧原心坐标(x,y)； 圆弧半径radius  ； 圆弧起始角度(x,y)
  var arc = new THREE.ArcCurve(0, 0, 100, 0, 2 * Math.PI);
  ```

  **方法：**

  + getPoints()

    > 通过方法`.getPoints()`可以从圆弧线按照一定的细分精度返回沿着圆弧线分布的顶点坐标。细分数越高返回的顶点数量越多，自然轮廓越接近于圆形。方法`.getPoints()`的返回值是一个由二维向量[Vector2](http://www.yanhuangxueyuan.com/threejs/docs/index.html#api/zh/math/Vector2)或三维向量[Vector3](http://www.yanhuangxueyuan.com/threejs/docs/index.html#api/zh/math/Vector3)构成的数组，`Vector2`表示位于同一平面内的点，`Vector3`表示三维空间中一点。
  >
    > **从曲线上批量返回顶点数据**
  
    ```js
    var arc = new THREE.ArcCurve(0, 0, 100, 0, 2 * Math.PI);
    //getPoints是基类Curve的方法，返回一个vector2对象作为元素组成的数组
  var points = arc.getPoints(50);//分段数50，返回51个顶点
    ```

  + .setFromPoints ( points )
  
    > 通过该方法可以把数组points中顶点数据提取出来赋值给几何体的顶点位置属性geometry.attributes.position，数组points的元素是二维向量Vector2或三维向量Vector3。
  
+ **CatmullRomCurve3**(不规则曲线)

  > 在三维空间中设置5个顶点，输入三维样条曲线[CatmullRomCurve3](http://www.yanhuangxueyuan.com/threejs/docs/index.html#api/zh/extras/curves/CatmullRomCurve3)作为参数，然后返回更多个顶点，通过返回的顶点数据，构建一个几何体，通过`Line`可以绘制出来一条沿着5个顶点的光滑样条曲线。

+ **贝塞尔曲线**(不规则曲线)

  ![image-20220930095716984](https://picgo-1307940198.cos.ap-nanjing.myqcloud.com/image-20220930095716984.png)

+ **CurvePath**

  > 一个扩展了Curve的抽象基类。多个圆弧线、样条曲线、直线等多个曲线合并成一个曲线。
  >

#### 6.三维文本

1. 使用ExtrudeGeometry将二维文本转化为三维

####  7.文字创建

+  css2DObject   css2DRenderer
+ css3DObject     css3DSprite    css3DRenderer

#### 8.旋转平移缩放

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

### 4.层级模型封装

> 根节点场景对象`Scene`和它的子孙对象构成的树结构。

+ **基类Object3D**

  > 基类`Object3D`封装了用于构建树结构的方法`.add()`和属性`.children`
  >
  > 场景对象`Scene`、组对象`Group`、网格Mesh、点Points、线Line等模型对象基类是`Object3D`

  网格模型插入组对象，组对象插入场景中。

  ```JavaScript
  var leftEyeMesh = new THREE.Mesh();
  var rightEyeMesh = new THREE.Mesh();
  
  var headGroup = new THREE.Group();
  headGroup.add(leftEyeMesh, rightEyeMesh);
  
  scene.add(headGroup);
  console.log('查看场景子对象',scene.children);
  console.log('查看headGroup的子对象',headGroup.children);
  ```

+ ### WebGL渲染器函数projectObject

  WebGLRenderer.js源码,在render函数中会调用projectObject函数

  ```JavaScript
  function projectObject(object, camera, sortObjects) {
  ...
  // 封装了递归算法，可以用来遍历树结构对象，比如场景对象Scene
    var children = object.children;
    // 递归算法遍历场景对象
    for (var i = 0, l = children.length; i < l; i++) {
  projectObject(children[i], camera, sortObjects);
    }
  }
  ```

  WebGLRenderer.js源码,projectObject函数会递归遍历场景对象进行分类

  ```JavaScript
  this.render=function(){
    ...
    // 遍历场景对象，并对场景对象中的节点进行分类，比如光源对象，比如模型对象
    projectObject(scene, camera, _this.sortObjects);
    ...
  }
  ```

  projectObject函数对象递归遍历到的子对象节点进行分类处理，然后WebGL渲染器在对象分类好的不同对象进行渲染器解析，关于进一步的渲染解析过程这里不讲解。

  ```JavaScript
  // currentRenderList对象用于存储点、线和和网格模型的对象
  var currentRenderList = renderLists = new WebGLRenderLists();
  currentRenderList = renderLists.get(scene, camera);
  // currentRenderList对象用于存储光源、点精灵等对象
  var currentRenderStaterenderStates = new WebGLRenderStates();
  currentRenderState = renderStates.get(scene, camera);
  
  // 对象Scene的后代节点对象进行分类处理
  function projectObject(object, camera, sortObjects) {
  ...
    if (visible) {
  // 判断对象是不是光源对象，是的话插入WebGL渲染状态对象的state属性中
  if (object.isLight) {
    //光源信息插入到currentRenderState对象的.state.lightsArray属性中
    currentRenderState.pushLight(object);
  }
  // 判断对象是不是精灵对象
  else if (object.isSprite) {
  //光源信息插入到currentRenderState对象的.state.spritesArray属性中
  currentRenderState.pushSprite(object);
  }
   else if (object.isMesh || object.isLine || object.isPoints) {
    // 把模型对象相关信息批量存储到currentRenderList对象
    currentRenderList.push(object, geometry, material, _vector3.z, null);
  }
  
    }
  }
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

  > 来控制在远处或近距离观察时如何过滤纹理 ，换句话说，这些设置控制用于放大或缩小图像的算法。
  >
  > 设置magFilter来指定纹理如何放大 ；设置minFilter设置纹理如何缩小；

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

  > texture.wrapS = THREE.RepeatWrapping; 
  >
  > texture.wrapT = THREE.RepeatWrapping;
  >
  > offset 纹理的平移
  >
  > rotation 纹理旋转 ；center:旋转中心点，默认是（0，0）即左下角 ====> 中心点是（0.5，0.5）

### 2.凹凸贴图创建褶皱

> 为材质添加厚度

+ 普通凹凸贴图增加细节凹凸感

+ 法向量贴图细节更强（可代替凹凸贴图）

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

![image-20221009174307580](https://picgo-1307940198.cos.ap-nanjing.myqcloud.com/image-20221009174307580.png)

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



## 16 .核心要点

### 0.向量

> vector : 可以表示标量或者矢量

+ Vector2 ： UV ,
+ Vector3：顶点坐标 , 顶点的法向量  , 光线的方向

```js
向量function
let v1 = new THREE.Vector3(10,20,15);
var v1 = p1.clone(); // ⭐返回一个新的对象，和原来对象属性的值一样

var p2 = new THREE.Vector3();
p2.copy(p1); // p2复制p1向量

// ⭐.sub()：向量减法运算
// ⭐.length()：返回向量的长度
var L = v1.clone().sub(p2).length(); 
console.log('两点之间距离',L);


// ⭐.dot点乘
// 三角形的三个点坐标p1，p2，p3
var p1 = new THREE.Vector3(0,0,0);// 点1坐标
var p2 = new THREE.Vector3(20,0,0);// 点2坐标
var p3 = new THREE.Vector3(0,40,0);// 点3坐标
// p1，p2两个点确定一个向量
var v1 = p1.clone().sub(p2);
// p1，p3两个点确定一个向量
var v2 = p1.clone().sub(p3);
// .dot()计算两个向量点积.length()计算向量长度
// 返回三角形顶点p1对应夹角余弦值
var CosineValue = v1.dot( v2 ) /(v1.length()*v2.length())
console.log('三角形两条边夹角余弦值',CosineValue);
// .acos()：反余弦函数，返回结果是弧度
console.log('三角形两条边夹角',Math.acos(CosineValue)*180/Math.PI);


// ⭐.cross叉乘
//三角形面积计算
function AreaOfTriangle(p1, p2, p3){
  var v1 = new THREE.Vector3();
  var v2 = new THREE.Vector3();
  // 通过两个顶点坐标计算其中两条边构成的向量
  v1 = p1.clone().sub(p2);
  v2 = p1.clone().sub(p3);

  var v3 = new THREE.Vector3();
  // 三角形面积计算
  v3.crossVectors(v1,v2);
  var s = v3.length()/2;
  return s
}
```



### 1.Float32Array⭐

![image-20221007195021696](https://picgo-1307940198.cos.ap-nanjing.myqcloud.com/image-20221007195021696.png)

> `Float32Array` 固定长度，存储浮点类型数据的数组，别的数据类型转为NAN，默认为0
>
> 使用场景 : 数组数量大，操作频繁，操作二进制数据
>
> ⭐数组放在堆中，ArrayBuffer则把数据放在栈中（所以取数据时后者快）
>
> 向下需要先设置长度，例如new Float32Array（9）或者new  Float32Array([10.,1.0,1.0,2.0,2.0,2.0])
>
> ⭐不能使用push操作

### 2.Matrix4(矩阵)

+ **用法**

+ set / 属性  行优先 ； elements列优先

+ ![image-20221013152519016](https://picgo-1307940198.cos.ap-nanjing.myqcloud.com/image-20221013152519016.png)

  ```js
  var mat4 = new THREE.Matrix4()
  // 默认值单位矩阵
  // 1, 0, 0, 0,
  // 0, 1, 0, 0,
  // 0, 0, 1, 0,
  // 0, 0, 0, 1
  
  // .elements
  mat4.elements   ===> [....]
  
  // .set 按行设置元素
  mat4.set(
    1, 0, 0, 5,
    0, 1, 0, 3,
    0, 0, 1, 9,
    0, 0, 0, 1
  )
  
  // .transpose() 转置矩阵
  var mat4T = mat4.clone()
  mat4T.transpose() // 改变原矩阵
  
  // .multiplyScalar(m) 矩阵的每个元素乘以m
  mat4.multiplyScalar(10)
  
  // 矩阵乘法
  c.multiplyMatrices(a,b):参数中两个矩阵相乘axb，结果保存在c中
  a.multiply(b):矩阵相乘axb，结果保存在a
  a.premultiply(b):矩阵相乘bxa，结果保存在a
  
  // getInverse 逆矩阵
  // mat4I用来保存mat4逆矩阵计算结果
  // ⭐行列式为零的都不可逆
  var mat4I = new THREE.Matrix4();
  mat4I.getInverse(mat4, true);
  
  // .determinant() 行列式
  
  // 矩阵对象`Matrix4`的`.lookAt()`方法的主要作用就是用于构建相机对象的视图矩阵`.matrixWorldInverse`。
  ```

+ **概述**：

> ⭐每一个object3d对象都有一个三个关联的matrix对象
>
> Object3D.matrix: 存储物体的本地变换矩阵，旋转缩放平移。 这是对象相对于其父对象的变换矩阵。
>
> Object3D.matrixWorld: 对象的全局或世界变换矩阵。如果对象没有父对象，那么这与存储在矩阵matrix中的本地变换矩阵相同。
>
> Object3D.modelViewMatrix: 表示对象相对于摄像机坐标系的变换矩阵， 一个对象的 modelViewMatrix 是物体世界变换矩阵乘以摄像机相对于世界空间变换矩阵的逆矩阵。
>
> <img src="https://picgo-1307940198.cos.ap-nanjing.myqcloud.com/image-20221011144502682.png" alt="image-20221011144502682" style="zoom:150%;" />

![image-20220829164236064](https://picgo-1307940198.cos.ap-nanjing.myqcloud.com/image-20220829164236064.png)

+ **作用**：

  > 在WebGL中对一个对象进行平移、旋转或缩放本质就是对对象的顶点坐标进行平移、旋转、缩放矩阵变换。

- 绕x轴旋转`.makeRotationX(theta)`
- 绕y轴旋转`.makeRotationY(theta)`
- 绕z轴旋转`.makeRotationZ(theta)`
- 缩放`.makeScale(Sx,Sy,Sz)`
- 平移`.makeTranslation(Tx,Ty,Tz)`
- 剪切`.makeShear`

+ ⭐向量矩阵变换`.applyMatrix4()`

`.applyMatrix4()`是三维向量`Vector3`的一个方法，

```JavaScript
var T = new THREE.Matrix4()
// 创建一个平移矩阵，顶点坐标沿着X、Y、Z轴分别平移5,3,9
T.makeTranslation(5, 3, 9)
// 三维向量表示一个顶点坐标
var v1 = new THREE.Vector3(10,10,10);
// 向量进行矩阵变换
var v2 = v1.clone().applyMatrix4(T);
console.log('查看平移后坐标', v2);
```

顶点进行两次平移变换代码

```JavaScript
// 创建平移矩阵T1：x轴平移100
var T1 = new THREE.Matrix4().makeTranslation(100, 0, 0)
// 创建平移矩阵T2：y轴平移100
var T2 = new THREE.Matrix4().makeTranslation(0, 100, 0)

// 两个变换矩阵相乘表示顶点先后经过两次
var M = new THREE.Matrix4()
M.multiplyMatrices(T2,T1)
// 三维向量表示一个顶点坐标
var v1 = new THREE.Vector3(10, 10, 10);
// 向量进行矩阵变换
var v2 = v1.clone().applyMatrix4(M);
console.log('查看平移后坐标', v2);
```

### 3.投影矩阵、视图矩阵（camera）

#### 物体渲染流程（三个步骤）

+ 局部坐标系转化为世界坐标系
+ 世界坐标系转化为视图坐标系（相机坐标系）
+ 视图坐标系转化为裁剪坐标系（投影坐标系）

> :star: 相机对象本质就是视图矩阵和投影矩阵，顶点坐标经过平移旋转缩放模型变换以后，还需要经过视图、投影变换才能显示到画布上。

![image-20221011143500553](https://picgo-1307940198.cos.ap-nanjing.myqcloud.com/image-20221011143500553.png)



**`Matrix4`方法：正投影`.makeOrthographic()`**

**正投影公式：**

![image-20221013172616623](https://picgo-1307940198.cos.ap-nanjing.myqcloud.com/image-20221013172616623.png)

矩阵对象`Matrix4`的方法`.makeOrthographic()`封装了正投影的算法，该方法用来创建一个正投影矩阵，在正投影相机对象`OrthographicCamera`中会调用该方法更新相机对象的投影矩阵属性`.projectionMatrix`

方法参数：.makeOrthographic( left,right,top,bottom,near,far)

**正投影相机`OrthographicCamera`**

正投影相机`OrthographicCamera`类封装调用了矩阵对象`Matrix4`的正投影矩阵变换方法`.makeOrthographic()`。执行该方法用来改变正投影相机对象的投影矩阵属性`.projectionMatrix`。

```JavaScript
// OrthographicCamera.js源码
this.projectionMatrix.makeOrthographic( left, right, top, bottom, this.near, this.far )
```

构造函数`PerspectiveCamera(left,right,top,bottom,near,far)`

正投影相机设置例子

```JavaScript
var width = window.innerWidth; //窗口宽度
var height = window.innerHeight; //窗口高度
var k = width / height; //窗口宽高比
var s = 150; //三维场景显示范围控制系数，系数越大，显示的范围越大
//创建相机对象
var camera = new THREE.OrthographicCamera(-s * k, s * k, s, -s, 1, 1000);
camera.position.set(200, 300, 200); //设置相机位置
camera.lookAt(scene.position); //设置相机方向(指向的场景对象)
```



**`Matrix4`方法：透视投影矩阵`.makePerspective()`**

透视投影公式：

![image-20221013173920186](https://picgo-1307940198.cos.ap-nanjing.myqcloud.com/image-20221013173920186.png)

矩阵对象`Matrix4`的方法`.makePerspective()`封装了透视投影的算法，该方法用来创建一个透视投影矩阵，在透视投影相机对象`PerspectiveCamera`中会调用该方法更新相机对象的投影矩阵属性`.projectionMatrix`。

方法参数：.makePerspective( left,right,top,bottom,near,far)

**透视投影相机`PerspectiveCamera`**

透视投影相机`PerspectiveCamera`类封装调用了矩阵对象`Matrix4`的透视投影矩阵变换方法`.makePerspective()`。执行该方法用来改变透视投影相机对象的投影矩阵属性`.projectionMatrix`。

```JavaScript
// PerspectiveCamera.js源码
this.projectionMatrix.makePerspective(...);
```

构造函数`PerspectiveCamera(fov,aspect,near,far)`

透视投影相机使用例子

```JavaScript
var width = window.innerWidth; //窗口宽度
var height = window.innerHeight; //窗口高度
/**透视投影相机对象*/
var camera = new THREE.PerspectiveCamera(60, width / height, 1, 1000);
camera.position.set(200, 300, 200); //设置相机位置
camera.lookAt(scene.position); //设置相机方向(指向的场景对象)
```



**`Matrix4`方法：`.lookAt()`**

矩阵对象`Matrix4`的`.lookAt()`方法对图形学中投影矩阵算法进行了封装，也就是通过给定的参数生成变换矩阵，视图矩阵和模型矩阵一样会用于场景中对象的平移旋转等变换，该方法通常用于构建相机对象的视图矩阵`.matrixWorldInverse`属性。

参数：`.lookAt(eye,center, up )`

三个参数都是三维向量对象`Vector3`，eye是视点也就是观察位置，center表示被观察的位置，up表示向上的方向。

**`Object3D`方法`.lookAt(x,y,z)`**

`Object3D`类封装了矩阵对象`Matrix4`的`.lookAt()`方法，得到一个新的方法`.lookAt(x,y,z)`,参数表示xyz是相机的目标观察点。

通过`Object3D`对象的`.lookAt(x,y,z)`方法可以改变自身的四元数属性`.quaternion`,四元数属性`.quaternion`和对象角度属性`rotaion`一样表示对象的旋转变换，可以转化为旋转矩阵，进而改变对象的本地矩阵属性`.matrix`和世界矩阵属性`.matrixWorld`。

```JavaScript
// Object3D.js源码
// `.lookAt()`方法计算得到的旋转矩阵对象m1改变对象的四元数属性.quaternion
this.quaternion.setFromRotationMatrix( m1 );
```



**相机对象**

透视投影相机`PerspectiveCamera`和正投影相机`OrthographicCamera`的基类是相机对象`Camera`，相机对象的基类是`Object3D`，所以相机对象会继承`Object3D`的`.lookAt(x,y,z)`方法，勇于改变自身的矩阵属性。

> object3d 的lookAt 是Matrix的lookat的继续封装

```
Object3D` → `Camera` → `PerspectiveCamera
Object3D` → `Camera` → `OrthographicCamera
```

相机对象的视图矩阵属性`matrixWorldInverse`，字面意思是世界矩阵逆矩阵的意思，这可以看书来相机对象的视图矩阵属性就是自身世界矩阵`matrixWorld`的逆矩阵。

:star: 设置相机对象的位置属性和lookAt方法本质就是改变自身的视图矩阵属性`matrixWorldInverse`。

```JavaScript
var camera = new THREE.OrthographicCamera(...);
//设置相机位置
camera.position.set(200, 300, 200);
//设置相机对象的观察目标的位置
camera.lookAt(scene.position);
```



### 4.欧拉角（Euler）and 四元数（Quaternion）

> 欧拉角缺点，在创建动画或进行涉及旋转的数学时会变得很明显。特别是，我们不能将两个欧拉角相加（更著名的是，它们还存在一种叫做万向节锁定的问题）。四元数没有这些缺点。另一方面，它们比欧拉角更难使用，所以现在我们将坚持使用更简单的`Euler`类。
>
> ⭐Euler 和 Quaternion 相互影响，一个改 变另一个也改变

![image-20221015213847596](https://picgo-1307940198.cos.ap-nanjing.myqcloud.com/image-20221015213847596.png)

+ **Euler**

  > 欧拉角描述一个旋转变换，通过指定轴顺序和其各个轴向上的指定旋转角度来旋转一个物体

  ```js
  // Euler(x,y,z,order) 参数xyz分别表示绕xyz轴旋转的角度值，角度单位是弧度。参数order表示旋转顺序,默认值XYZ，也可以设置为YXZ、YZX等值
  var Euler = new THREE.Euler( Math.PI/4,0, Math.PI/2); || Euler.x = Math.PI/4;
  ```

  

+ **Quaternion**

  > 两个四元数相乘可以表示两次旋转的结果
  >
  > .multiply 
  >
  > **四元数**相对于其他形式的**优点**，大略为：
  >
  > 1. 解决**万向节死锁**
  > 2. 仅需4个浮点数，相比矩阵更轻量
  > 3. 无论求逆、串联等操作，相比矩阵更高效

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

### 5.顶点与BufferGeometry

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
  
  /**纹理坐标*/
     var uvs = new Float32Array([
     	 0,0, //图片左下角
       1,0, //图片右下角
       1,1, //图片右上角
       0,1, //图片左上角
     ]);
     // 设置几何体attributes属性的位置normal属性
     geometry.attributes.uv = new THREE.BufferAttribute(uvs, 2); //2个为一组,表示一个顶点的纹理坐标
  ```

  ![image-20220926212817183](https://picgo-1307940198.cos.ap-nanjing.myqcloud.com/image-20220926212817183.png)

  

  


### 6.position和世界坐标(scale同理)

> `position`获得模型在本地坐标系或者说模型坐标系下的三维坐标，
>
> 通过模型的`.getWorldPosition()`方法获得该模型在世界坐标下的三维坐标。
>
> :star: mesh的世界坐标是mesh位置属性`.position`和mesh父对象group位置属性`.position`的累加。⭐
>
> 总结:
>
> 所谓本地坐标系，就是相对模型的父对象而言，模型位置属性`.position`表示的坐标值就是以本地坐标系为参考，表示子对象相对本地坐标系原点(0,0,0)的偏移量。
>
> Threejs场景Scene是一个树结构，一个模型对象可能有多个父对象节点。世界坐标系默认就是对Threejs整个场景Scene建立一个坐标系，一个模型相对世界坐标系的坐标值就是该模型对象所有父对象以及模型本身位置属性`.position`的叠加。

  ```

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

### 7.世界矩阵**matrixWorld**和局部矩阵**matrix**

> 当我们创建网格或任何其他场景对象时，局部矩阵和世界矩阵都会自动创建。
>
> 对象父对象是scene,则俩个对象是相同的

```js
meshA.updateMatrix();
meshA.updateMatrixWorld();
获取对象最新的矩阵，或者直接render，所有对象矩阵更新
```

<img src="https://picgo-1307940198.cos.ap-nanjing.myqcloud.com/%E6%9C%AC%E5%9C%B0%E7%9F%A9%E9%98%B5%E5%92%8C%E4%B8%96%E7%95%8C%E7%9F%A9%E9%98%B5.jpg" alt="本地矩阵和世界矩阵" style="zoom: 44%;" />

**更新本地矩阵属性`.updateMatrix()`**

执行`Object3D`的`.updateMatrix()`方法可以提取位置`.position`、缩放`.scale`和四元数`.quaternion`的属性值转化为变换矩阵设置本地矩阵属性`.matrix`。

```JavaScript
// Object3D.js源码
updateMatrix: function () {
  // 把位置、四元数、缩放属性转化为平移、旋转、缩放矩阵，三个矩阵的乘积是本地矩阵
  this.matrix.compose( this.position, this.quaternion, this.scale );
  this.matrixWorldNeedsUpdate = true;
},
    
// Matrix4.js源码
// 通过属性值设置变换矩阵
compose: function ( position, quaternion, scale ) {
  // 四元数矩阵转化为旋转矩阵，然后改变本地矩阵
  this.makeRotationFromQuaternion( quaternion );
  // 缩放属性转化为缩放矩阵，然后改变本地矩阵
  this.scale( scale );
  // 位置属性转化为平移矩阵，然后改变本地矩阵
  this.setPosition( position );
  return this;
},
    
// 一个网格模型对象，基类是Object3D
var mesh = new THREE.Mesh()
// 缩放网格模型
mesh.scale.set(900,900,900)
// 位置、角度、缩放属性值更新到矩阵属性matrix
mesh.updateMatrix();
console.log('查看本地矩阵属性matrix',mesh.matrix.elements);
```

**更新世界矩阵属性`.updateMatrixWorld()`**

调用`.updateMatrixWorld()`方法首先会更新对象的本地矩阵属性，然后更新对象的世界矩阵属性。

`.updateMatrixWorld()`方法封装了递归算法，会遍历对象的所有子对象，对象本身和

```JavaScript
// Object3D.js源码
updateMatrixWorld: function ( force ) {
  // 更新对象的本地矩阵属性
  if ( this.matrixAutoUpdate ) this.updateMatrix();
  ...
  if ( this.parent === null ) {
// 如果一个对象没有父对象，也就是树结构对象的根节点对象，世界矩阵就等于本地矩阵
this.matrixWorld.copy( this.matrix );

  } else {
// 更新对象的世界矩阵，父对象的世界矩阵和对象本地矩阵的乘积
this.matrixWorld.multiplyMatrices( this.parent.matrixWorld, this.matrix );
  }
  ...
 // 通过递归算法遍历一个对象的所有子对象，执行与根对象一样的操作更新本地和世界矩阵属性
  var children = this.children;
  for ( var i = 0, l = children.length; i < l; i ++ ) {
children[ i ].updateMatrixWorld( force );
  }
},
```

**WebGL渲染器**

场景对象的`.autoUpdate`属性默认值是true，执行`.render()`方法的时候`scene.updateMatrixWorld()`默认执行，也就是说执行 Threejs执行渲染器渲染方法的时候，场景对象所有子孙对象的世界矩阵属性和本地矩阵属性才会更新。

```JavaScript
// WebGLRenderer.js源码
this.render=function(){
  ...
  // WebGL渲染器中执行场景对象的updateMatrixWorld()方法，更新场景和场景所有子孙对象的本地矩阵
  if (scene.autoUpdate === true) scene.updateMatrixWorld();
  ...
}
```

**世界坐标和本地坐标**

位置属性`.position`表示本地坐标，也就是说该对象相对父对象的偏移位置。通过`Object3D`的`.getWorldPosition()`方法可以返回一个模型的世界坐标，是模型对象相对坐标原点的位置坐标，也就是该对象位置属性`.position`及其所有祖宗对象的`.position`相加。

```JavaScript
var worldPosition = new THREE.Vector3();
mesh.getWorldPosition(worldPosition)
console.log('世界坐标',worldPosition);
console.log('本地坐标',mesh.position);
// Object3D.js源码
getWorldPosition: function ( target ) {
  if ( target === undefined ) {
console.warn( 'THREE.Object3D: .getWorldPosition() target is now required' );
target = new Vector3();
  }
  this.updateMatrixWorld( true );
  通过矩阵对象setFromMatrixPosition方法从世界矩阵中提取平移矩阵分量，然后转化为position属性
  return target.setFromMatrixPosition( this.matrixWorld );
},
```

### 8.贝塞尔曲线

> https://blog.csdn.net/cfan927/article/details/104649623
>
> 贝塞尔曲线完全由其控制点决定其形状,　**ｎ个控制点对应着ｎ－１阶的贝塞尔曲线**，并且可以通过递归的方式来绘制

+ **一阶曲线**

  ![image-20221008111126089](https://picgo-1307940198.cos.ap-nanjing.myqcloud.com/image-20221008111126089.png)

+ **二阶曲线**

+ ![在这里插入图片描述](https://picgo-1307940198.cos.ap-nanjing.myqcloud.com/20200304113229429.gif)

  <img src="https://picgo-1307940198.cos.ap-nanjing.myqcloud.com/image-20221008112845687.png" alt="image-20221008112845687"  />

+ **三阶曲线**

  ![image-20221008113135724](https://picgo-1307940198.cos.ap-nanjing.myqcloud.com/image-20221008113135724.png)
  
  ![img](https://picgo-1307940198.cos.ap-nanjing.myqcloud.com/20200304113511298.gif)
  
+ **四阶曲线**

  ![在这里插入图片描述](https://picgo-1307940198.cos.ap-nanjing.myqcloud.com/20200304113852783.gif)

+ **五阶曲线**

  <img src="https://picgo-1307940198.cos.ap-nanjing.myqcloud.com/20200304113741561.gif" alt="在这里插入图片描述" style="zoom: 67%;" />

+ **n阶曲线**

+ > C30 ,排列组合

  ![image-20221008113258904](https://picgo-1307940198.cos.ap-nanjing.myqcloud.com/image-20221008113258904.png)

递归表示法

![image-20221008113344891](https://picgo-1307940198.cos.ap-nanjing.myqcloud.com/image-20221008113344891.png)

### 9. Three 和WebGL封装

#### 1.render

> Three.js渲染器的渲染方法`.render()`，执行该方法就相当于执行WebGL 绘制方法`gl.drawArrays()`。
>
> 在原生WebGL代码中，执行绘制方法`gl.drawArrays()`就会在Canvas画布上绘制一帧图片，自然Threejs的渲染方法`.render()`同理，周期性执行 绘制方法`gl.drawArrays()`可以更新帧缓冲区数据，也就是更新Canvas画布显示图像，`.render()`方法同理可以实现一样的效果。

+ .domElement : 添加一个canvas dom 元素

  ```js
  // 局部渲染
  document.getElementById('pos').appendChild(renderer.domElement);
  ```

+ .setSize 

  > 设置canvas画布宽高

  ```js
  // pixelRatio：像素比率
  _pixelRatio = 1,
  ...
  this.setSize = function(width, height, updateStyle) {
  ...
    _canvas.width = width * _pixelRatio;
    _canvas.height = height * _pixelRatio;
  
    if (updateStyle !== false) {
  _canvas.style.width = width + 'px';
  _canvas.style.height = height + 'px';
    }
  ...
  };
      
  // 窗口宽高    
  renderer.setSize(window.innerWidth, window.innerHeight);  
  ```

+ .clear 

  <img src="https://picgo-1307940198.cos.ap-nanjing.myqcloud.com/image-20221016194916944.png" alt="image-20221016194916944" style="zoom:50%;" />

  ```js
  // 学习Three.js与帧缓冲区相关的封装，首先要了解WebGL中帧缓冲区的概念，
  // 帧缓冲区包含颜色缓冲区、深度缓冲区、模板缓冲区，
  // 颜色缓冲区存储片元的颜色数据，也就是像素数据，
  // 深度缓冲存储片元的深度数据，用于WebGL渲染流程中的深度测试环节，被遮挡的片元会被剔除，不会显示在canvas画布上。
  
  // 清除颜色缓冲区数据
  gl.clear(gl.COLOR_BUFFER_BIT)
  // 清除深度缓冲区数据
  gl.clear(gl.DEPTH_BUFFER_BIT)
  // 清除模板缓冲区数据
  gl.clear(gl.STENCIL_BUFFER_BIT)
  ```

  WebGLRenderer.js源码对渲染器方法`.clear()`的封装

  ```JavaScript
  this.clear = function(color, depth, stencil) {
    // “&” 和 “|” 是位运算操作符
    var bits = 0;
  
    if (color === undefined || color) bits |= _gl.COLOR_BUFFER_BIT;
    if (depth === undefined || depth) bits |= _gl.DEPTH_BUFFER_BIT;
    if (stencil === undefined || stencil) bits |= _gl.STENCIL_BUFFER_BIT;
  
    _gl.clear(bits);
  
  };
  ```

+ .clearDepth()

  > 清除深度缓冲区
  >
  > gl.clear(gl.DEPTH_BUFFER_BIT)
  >
  > // 清除上一帧深度缓冲区数据，深度测试的时候不会删除被遮挡的片元数据

+ .autoClear()

  Three.js渲染器默认情况下，本次执行render方法之前，会把上次执行render方法后帧缓冲区中的数据清除

  autoClear默认值true，设置为false，执行render方法的时候不会自动清除上次渲染帧缓冲区中的数据

  > ⭐设置为false，第二个render渲染时不会清除上一帧画面，也就是第一个render
  >
  > clear 清除缓冲区数据，不清楚会溢出

  ```js
   function render() {
      // 清除上次执行render()函数得到的两帧图像帧缓冲区中数据
      renderer.clear(true, true, true);
  
      // Three.js渲染器默认情况下，本次执行render方法之前，会把上次执行render方法后帧缓冲区中的数据清除
      // autoClear默认值true，设置为false，执行render方法的时候不会自动清除上次渲染帧缓冲区中的数据
      renderer.autoClear = false;
      // 渲染场景1，得到一帧图像，帧缓冲区中存储片元的颜色、深度等数据
      renderer.render(scene, camera);
  
      // 清除上一帧深度缓冲区数据，深度测试的时候不会删除被遮挡的片元数据
      renderer.clearDepth();
  
      // 第二次渲染场景2，得到新的像素数据
      renderer.render(scene2, camera); //执行渲染操作
  
      requestAnimationFrame(render);
      mesh2.rotateX(0.01);
  }
  ```


#### 2.顶点

+ **BufferAttribute**

  > 顶点数据需要传入WebGL API`gl.createBuffer()`创建顶点缓冲区中

  ```js
  //类型数组创建顶点数据
  var vertices = new Float32Array([
    0, 0, 0, //顶点1坐标
    50, 0, 0, //顶点2坐标
    0, 100, 0, //顶点3坐标
    0, 0, 10, //顶点4坐标
    0, 0, 100, //顶点5坐标
    50, 0, 10, //顶点6坐标
  ]);
  // 创建属性缓冲区对象表示一组顶点坐标
  // 参数3表示类型化数组vertices中的顶点数据3个为一组，表示一个顶点的xyz坐标
  geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3))
  ```

#### 3.**⭐解析几何体流程**

![Threejs解析流程图](https://picgo-1307940198.cos.ap-nanjing.myqcloud.com/Threejs%E8%A7%A3%E6%9E%90%E6%B5%81%E7%A8%8B%E5%9B%BE.png)

**原生WebGL**

原生WebGL通过`gl.createBuffer()`创建一个顶点缓冲区对象，用来存储顶点位置、顶点颜色、顶点法向量等数据。如果你理解了这一段代码，自然就很容易理解Three.js的几何体对象和相应的缓冲区。

```JavaScript
// 顶点位置数据
var data=new Float32Array([0.5,0.5,0.3...]);
 // 创建缓冲区buffer，传入顶点位置数据data
var buffer=gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER,buffer);
gl.bufferData(gl.ARRAY_BUFFER,data,gl.STATIC_DRAW);
gl.vertexAttribPointer(aposLocation,3,gl.FLOAT,false,0,0);
```

**`Geometry`转化为`BufferGeometry`**

通过`BufferGeometry.setFromObject(object)`方法可以把参数可以把object模型对象的几何体geometry转化为BufferGeometry，点模型Points和线模型Line使用一套解析转化规则，网格模型Mesh使用一种转化规则。

对于网格模型的几何体Geometry转化为BufferGeometry的时候，需要先把Geometry对象转化为直接几何体对象DirectGeometry，然后再转化为BufferGeometry对象。

**相关函数**

WebGLAttributes.js、WebGLGeometries.js和WebGLObjects.js是工厂函数，执行这三个函数都会返回一个具有特定方法的对象，WebGLObjects.js会调用WebGLGeometries对象的方法，WebGLGeometries.js会调用WebGLAttributes对象的方法。

<img src="https://picgo-1307940198.cos.ap-nanjing.myqcloud.com/%E8%A7%A3%E6%9E%90%E8%A7%84%E5%88%99.png" alt="解析规则" style="zoom: 67%;" />

+ **WebGLAttributes.js**

`.update(BufferAttribute)`方法

解析BufferAttribute对象，也就是说从BufferAttribute对象的`.array`属性提取顶点数据，把顶点数据传入WebGL顶点缓冲区，对`gl.createBuffer()`、`gl.bufferData()`等WebGL API进行了封装。

+ **WebGLGeometries.js**

`.get()`方法

参数:`.get(Object,Object.geometry)`

如果Object.geometry是BufferGeometry直接返回，如果是Geometry，会转化为BufferGeometry，点线模型和网格模型的Geometry转化规则不同，所以参数需要传入Object，代码需要判断Object是Points和Line还是Mesh。

`.update(BufferGeometry)`方法

通过BufferGeometry的`.index`和`.attributes`属性，获得包含顶点数据的BufferAttribute对象，然后BufferAttribute作为参数调用`WebGLAttributes.update()`方法，提取顶点数据并传入顶点缓冲区。

+ **WebGLObjects.js**

`.update(Object)`方法

从模型对象Object提取几何体数据，也就是模型的几何体属性 `Object.geometry`，然后调用WebGLGeometries.get()方法，并把Object和Object.geometry作为参数，直接get方法后返回BufferGeometry，然后调用WebGLGeometries.update()方法，把BufferGeometry作为参数。

+ **WebGLRenderer.js**

场景中遍历获得的对象object，如果是Points、Line或Mesh模型，调用WebGLObjects.update()方法，并把object作为参数。

+ **WebGLRenderer.js**

```JavaScript
import {WebGLAttributes} from './webgl/WebGLAttributes.js';
import {WebGLGeometries} from './webgl/WebGLGeometries.js';
import {WebGLObjects} from './webgl/WebGLObjects.js';

var attributes, geometries, objects;

attributes = new WebGLAttributes(_gl);
// WebGLAttributes作为WebGLGeometries参数
geometries = new WebGLGeometries(_gl, attributes, info);
// WebGLGeometries作为WebGLObjects参数
objects = new WebGLObjects(geometries, info);


function projectObject(object, camera, sortObjects) {
...
else if (object.isMesh || object.isLine || object.isPoints) {
var geometry = objects.update(object);
}
...
  // 递归算法：遍历对象
var children = object.children;
for (var i = 0, l = children.length; i < l; i++) {
projectObject(children[i], camera, sortObjects);
}
}
// 渲染方法中调用projectObject
this.render = function(scene, camera, renderTarget, forceClear) {
...
// 递归遍历场景对象，对于其中的点、线和网格模型需要解析它们的几何体，提取顶点数据，并传入顶点缓冲区
projectObject(scene, camera, _this.sortObjects);
...
}
```

+ **对象分类**

  > Three.js渲染器执行渲染方法`.render()`时候会遍历场景对象，然后对场景对象的后代进行分类，然后把同类的对象进行集中存储，然后再渲染分类好的对象。

  <img src="https://picgo-1307940198.cos.ap-nanjing.myqcloud.com/%E6%B8%B2%E6%9F%93%E5%99%A8%E6%B8%B2%E6%9F%93%E5%87%BD%E6%95%B0.png" alt="渲染器渲染函数" style="zoom: 50%;" />

<img src="https://picgo-1307940198.cos.ap-nanjing.myqcloud.com/%E5%AF%B9%E8%B1%A1%E5%88%86%E7%B1%BB.png" alt="对象分类" style="zoom:50%;" />

#### 4.点线绘制模式

<img src="https://picgo-1307940198.cos.ap-nanjing.myqcloud.com/%E6%A8%A1%E5%9E%8B%E5%AF%B9%E5%BA%94%E7%BB%98%E5%88%B6%E6%A8%A1%E5%BC%8F.png" alt="模型对应绘制模式" style="zoom: 50%;" />

Three.js点Points、线Line、网格Mesh模型都有几何体geometry数据，对于这些不同类别的模型对象Threejs渲染的时候调用WebGL绘制函数`gl.drawArrays()`或`gl.drawElements()`的时候系统设置的绘制模式不同。

学习本节课的内容需要先简单阅读以下源码：

- WebGLRenderer.js源码封装的的`.renderBufferDirect()`方法
- WebGLBufferRenderer.js源码
- WebGLIndexedBufferRenderer.js源码

**WebGLRenderer.js**

WebGLRenderer.js封装了WebGL绘制函数`gl.drawArrays( mode, start, count );`  ⭐无索引index

`.setMode()`方法,设置`gl.drawArrays();`的绘制模式mode。

```
.render()`方法，封装了WebGL API`gl.drawArrays();
```

**WebGLIndexedBufferRenderer.js**

WebGLIndexedBufferRenderer.js封装了WebGL绘制函数`gl.drawElements();`  ⭐有索引index

`.setMode()`方法,设置`gl.drawElements();`的绘制模式mode。

```
.render()`方法，封装了WebGL API`gl.drawElements();
```

**`.renderBufferDirect()`方法**

执行`.renderBufferDirect()`方法会调用WebGL绘制函数`gl.drawArrays()`或`gl.drawElements()`绘制顶点数据，渲染点Points、线Line、网格Mesh模型的时候，在执行绘制函数之前需要根据模型的类别设置绘制函数的绘制模式mode。

```JavaScript
import {WebGLBufferRenderer} from './webgl/WebGLBufferRenderer.js';
import {WebGLIndexedBufferRenderer} from './webgl/WebGLIndexedBufferRenderer.js';
bufferRenderer = new WebGLBufferRenderer(_gl, extensions, info);
indexedBufferRenderer = new WebGLIndexedBufferRenderer(_gl, extensions, info);
this.renderBufferDirect = function(camera, fog, geometry, material, object, group) {
...

  var renderer = bufferRenderer;

  // 如果存在顶点索引数据，把渲染器设置为WebGLIndexedBufferRenderer
  if (index !== null) {
  attribute = attributes.get(index);
  renderer = indexedBufferRenderer;
  renderer.setIndex(attribute);
  }
  ...
  if (object.isMesh) {
  // wireframe默认false
  if (material.wireframe === true) {
// 开启材质线框显示效果，使用线绘制模式gl.LINES
state.setLineWidth(material.wireframeLinewidth * getTargetPixelRatio());
renderer.setMode(_gl.LINES);
  } else {
// 网格模型对象具有drawMode属性，默认值为TrianglesDrawMode
switch (object.drawMode) {
  case TrianglesDrawMode:
renderer.setMode(_gl.TRIANGLES);
break;
  case TriangleStripDrawMode:
renderer.setMode(_gl.TRIANGLE_STRIP);
break;
  case TriangleFanDrawMode:
renderer.setMode(_gl.TRIANGLE_FAN);
break;
}
  }
} else if (object.isLine) {
  var lineWidth = material.linewidth;
  if (lineWidth === undefined) lineWidth = 1; // Not using Line*Material
  state.setLineWidth(lineWidth * getTargetPixelRatio());
  if (object.isLineSegments) {
// LineSegments模型对象
renderer.setMode(_gl.LINES);
  } else if (object.isLineLoop) {
// LineLoop模型对象
renderer.setMode(_gl.LINE_LOOP);
  } else {
// Line模型对象
renderer.setMode(_gl.LINE_STRIP);
  }
} else if (object.isPoints) {
 // 点模型对象Points
  renderer.setMode(_gl.POINTS);
}else if (object.isPoints) {
  // 点模型对象使用点绘制模式
  renderer.setMode(_gl.POINTS);

}
...

// 设置好绘制模式后，调用WebGLRenderer.js封装的render函数，相当于执行`gl.drawArrays();`
renderer.render(drawStart, drawCount);
}
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



### 13.包围盒BOX2，BOX3，Sphere

[包围盒](https://baike.baidu.com/item/包围盒/4562345?fr=aladdin)是一种计算一系列顶点最优包围空间的算法，比如一个不规则几何体的所有顶点坐标都被包围在一个最小的长方体盒子中，需要一个算法来求解这个最小的长方体包围盒。Three.js封装与包围盒算法相关的三个API，分别是三维包围盒Box3、包围球Sphere、包围矩形Box2。

+ **包围矩形Box2**

包围矩形对象Box2表示一个矩形区域，使用min和max两个属性来描述该矩形区域，属性值都是二维向量对象Vector2，通过Box2的构造函数可以直接设置min和max属性值，也可以通过Box2的一些方法来设置。

描述一个矩形区域需要通过xy坐标来表示，X范围[Xmin,Xmax],Y范围[Ymin,Ymax],`.min`属性值是`Vector2(Xmin, Ymin)`,`.max`属性值是`Vector2(Xmax, Ymax)`.

通过参数设置min和max属性

```JavaScript
// 参数1对应min属性值，参数2对应max属性值
var box2 = new THREE.Box2(new THREE.Vector2(0, 0), new THREE.Vector2(25, 25))
console.log('box2',box2);
box2.min=new THREE.Vector2(0, 0);
box2.max=new THREE.Vector2(25, 25);
```

+ **包围盒Box3**

包围盒Box3表示三维长方体包围区域，使用min和max两个属性来描述该包围区域，Box3的min和max属性值都是三维向量对象Vector3。

描述一个长方体包围盒需要通过xyz坐标来表示，X范围[Xmin,Xmax],Y范围[Ymin,Ymax],Z范围[Zmin,Zmax],`.min`属性值是`Vector3(Xmin, Ymin, Zmin)`,`.max`属性值是`Vector3(Xmax, Ymax, Zmin)`.

```JavaScript
var box3 = new THREE.Box3()
console.log('box3',box3);
box3.min = new THREE.Vector3(-10, -10,0);
box3.max = new THREE.Vector3(100, 20,50);
```

+ **包围球Sphere**

包围球Sphere是一个球形的包围区域，通过球心坐标`.center`和半径`.radius`两个属性来描述.

```JavaScript
// 创建一个包围球对象，球心默认坐标原点，半径默认0.
var sphere = new THREE.Sphere()
console.log('sphere', sphere);
// 设置球心坐标
sphere.center=new THREE.Vector3(-10, -10,0);
// 设置包围球半径
sphere.radius=20;
```

#### Box3方法`.setFromPoints()`

包围盒Box3方法`.setFromPoints()`用来计算一系列顶点集合的最小包围盒，参数是表示顶点坐标的三维向量`Vector3`作为元素构成的数组对象。

```JavaScript
// 通过球体API创建一个几何体，本质上就是一系列沿着球面分布的顶点
var geometry = new THREE.SphereGeometry(50, 100, 100);
// 创建一个包围盒对象Box3
var box3 = new THREE.Box3()
// 计算点集geometry.vertices的包围盒
box3.setFromPoints(geometry.vertices);
console.log('box3', box3);
```

#### 几何体方法`.computeBoundingBox()`

几何体`Geometry`调用`Box3`的方法`.setFromPoints()`封装了一个方法`.computeBoundingBox()`，用来计算几何体的包围盒属性`.boundingBox`。

几何体包围盒属性`.boundingBox`默认值为空null，执行`.computeBoundingBox()`方法才会计算该几何体的包围盒Box3，然后赋值给`.boundingBox`属性。

几何体包围球属性`.boundingSphere`使用方式和包围盒属性`.boundingBox`一样。

```JavaScript
var geometry = new THREE.SphereGeometry(50, 100, 100); // 球体
// .computeBoundingBox()方法计算.boundingBox的属性值
geometry.computeBoundingBox();
console.log('包围盒属性', geometry.boundingBox);
// 包围球相关属性和计算方法和包围盒一样
geometry.computeBoundingSphere();
console.log('包围球属性', geometry.boundingSphere);
```

+ **几何体居中方法center()**

在空间坐标系中把几何体居中，也就是几何体对应的包围盒中心平移到坐标原点。

```JavaScript
// 几何体的中心默认与坐标原点重合
var geometry = new THREE.BoxGeometry(50, 50, 50);
// 几何体沿着x轴平移50，几何体的顶点坐标变化
geometry.translate(50, 0, 0);
// 居中：偏移的几何体居中
geometry.center();
```

#### Box3方法`.expandByObject()`

获得层级模型的包围盒，一个层级模型可能包含多个子孙后代，具体点说，比如一个Group对象有多个网格模型Mesh作为子对象。

加载一个层级模型，并计算它的包围盒

```JavaScript
 loader.load('./group.json', function (group) {
     // 一般来说一个三维场景中，不可能几何中心刚好是原点坐标
     // 所以这里设置一个偏移，表示一个在三维空间中任意位置的层级模型
     group.position.set(30, -10, 50)
     
    scene.add(group); //加载返回的模型对象插入场景
    var box3 = new THREE.Box3();
    // ⭐计算层级模型group包围盒
    box3.expandByObject(group);
    console.log('查看包围盒box3', box3);
    // 缩放包围盒，尺寸放大1.5倍
    box3.expandByScalar(1.5);

    var v3 = new THREE.Vector3();
    // ⭐获得包围盒长宽高尺寸，结果保存在参数三维向量对象v3中
    box3.getSize(v3);
    console.log('查看返回的包围盒尺寸', v3);

    /**
     * 创建一个半透明的网格模型可视化展示包围盒效果
     */
    // 通过包围盒返回的长宽高尺寸设置几何体长宽高尺寸
    var geometry = new THREE.BoxGeometry(v3.x, v3.y, v3.z);
    var material = new THREE.MeshPhongMaterial({
        color: 0xffffff,
        // wireframe:true,//将几何图形渲染为线框
        transparent: true, //开启透明
        opacity: 0.3, //透明度0.5
    });
    var mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);
     
    // ⭐ 计算一下包围盒的中心点
     let center = new THREE.Vector3()
     box.getCenter(center)
     mesh.position.copy(center)
});
```

#### Box3方法`.expandByScalar()`

包围盒整体尺寸放大

```JavaScript
// 缩放包围盒，尺寸放大1.5倍
box3.expandByScalar(1.5)
```

#### Box3方法`.getSize()`

返回包围盒具体的长宽高尺寸

```JavaScript
var v3 = new THREE.Vector3()
// 获得包围盒长宽高尺寸，结果保存在参数三维向量对象v3中
box3.getSize(v3)
console.log('查看返回的包围盒尺寸', v3);
```

#### Box3方法`.getCenter()`

计算返回包围盒几何中心

```JavaScript
// 计算一个层级模型对应包围盒的几何体中心
var center = new THREE.Vector3()
box3.getCenter(center)
console.log('查看几何体中心坐标', center);
```

#### Sphere方法`.getBoundingSphere()`

包围盒Box3和包围球Sphere可以相互等价转化，通过包围盒对象来计算包围球对象

```JavaScript
loader.load('group.json', function(group) {
  scene.add(group)
  var box3 = new THREE.Box3()
  // 计算层级模型的包围盒
  box3.expandByObject(group)
  // 包围盒缩放
  box3.expandByScalar(1.5)

  // 通过包围盒对象来计算包围球对象
  var sphere = new THREE.Sphere()
  box3.getBoundingSphere(sphere)
  console.log('sphere', sphere);
  /**
   * 创建网格模型
   */
  var geometry = new THREE.SphereGeometry(sphere.radius, 25, 25); //创建一个立方体几何对象Geometry
  var material = new THREE.MeshPhongMaterial({
    color: 0xffffff,
    transparent: true, //开启透明
    opacity: 0.3, //透明度0.5
  });
  var mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);
})
```



### 14.广告牌（精灵文字）

> http://localhost:8080/manual/#zh/canvas-textures