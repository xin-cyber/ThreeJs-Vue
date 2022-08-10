### 1.MeshBasicMaterial

> 无光照影响；
>
> side：材质应用于物体那一侧，plane旋转时有一半时间看不见，因为材质默认渲染在前面 ==> side:double
>
>  ===>影响性能

#### 应用场景

双面贴图，立方体、球体前后贴图，



### 2.MeshDepthMaterial

>其外观不是由光照或者属性决定，而是由物体于摄像机距离决定；camer.near / far

#### 应用场景

物体随着距离增大逐渐消失



###3.联合材质

> 重点



### 4.MeshNromalMaterial

> 将flatshading 设置为true时，每一个小方块面的颜色是由该面的法向量的方向决定的

