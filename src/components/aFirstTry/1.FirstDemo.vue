<template>
    <div id="tooltip"></div>
</template>

<script>
import * as THREE from "three";
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as d3 from "d3";
export default {
    name: "FirstDemo",
    mounted() {
        const renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(renderer.domElement);

        // 以北京为中心 修改坐标
        const projection1 = d3.geoMercator().center([116.405285, 39.904989]).translate([0, 0])

        // 透视投影相机
        const camera = new THREE.PerspectiveCamera(
            45,
            window.innerWidth / window.innerHeight,
            1,
            500
        );
        camera.position.set(0, 0, 300)
        camera.lookAt(0, 0, 0)
        // 控制相机
        const controls = new OrbitControls(camera, renderer.domElement)
        controls.update()

        // 场景
        const scene = new THREE.Scene()
        // 坐标轴 辅助
        let axes = new THREE.AxesHelper(700)
        scene.add(axes)

        const helper = new THREE.GridHelper(1000, 100);
        scene.add(helper);


        const color = 0xffffff
        const intensity = 1
        // 环境光
        const light = new THREE.AmbientLight(color, intensity)
        // 加入场景
        scene.add(light)


        const loader = new THREE.FileLoader()
        loader.load('/json/100000_full.json', (data) => {
            const jsondata = JSON.parse(data)
            console.log('jsondata', jsondata)
            operationData(jsondata)
        })
        /**
         * 立体几何图形
         * @param polygon 多边形 点数组
         * @param color 材质颜色
         * */
        function drawExtrudeMesh(polygon, color, projection) {
            const shape = new THREE.Shape()
            polygon.forEach((row, i) => {
                const [x, y] = projection(row)
                if (i === 0) {
                    shape.moveTo(x, -y)
                }
                shape.lineTo(x, -y)
            })

            // 拉伸
            const geometry = new THREE.ExtrudeGeometry(shape, {
                depth: 10,
                bevelEnabled: false
            })
            const material = new THREE.MeshBasicMaterial({
                color: color,
                transparent: true,
                opacity: 0.5
            })
            return new THREE.Mesh(geometry, material)
        }

        /**
         * 边框 图形绘制
         * @param polygon 多边形 点数组
         * @param color 材质颜色
         * */
        function lineDraw(polygon, color, projection) {
            const lineGeometry = new THREE.BufferGeometry()
            const pointsArray = new Array()
            polygon.forEach((row) => {
                const [x, y] = projection(row)
                // 创建三维点
                pointsArray.push(new THREE.Vector3(x, -y, 9))
            })
            // 放入多个点
            lineGeometry.setFromPoints(pointsArray)

            const lineMaterial = new THREE.LineBasicMaterial({
                color: color
            })
            return new THREE.Line(lineGeometry, lineMaterial)
        }

        function makeLabelCanvas(size, name) {
            const borderSize = 15;
            const ctx = document.createElement('canvas').getContext('2d');
            const font = `${size}px bold sans-serif`;
            ctx.font = font;
            const doubleBorderSize = borderSize * 2;
            const width = ctx.measureText(name).width + doubleBorderSize;
            const height = size + doubleBorderSize;
            ctx.canvas.width = width;
            ctx.canvas.height = height;

            // 注意，调整画布后需要重新修改字体
            ctx.font = font;
            ctx.textBaseline = 'top';
            ctx.fillStyle = '#167780';
            ctx.fillRect(0, 0, width, height);
            ctx.fillStyle = 'black';
            ctx.fillText(name, borderSize, borderSize);
            return ctx.canvas;
        }

        function makeTextSprite(center, name, projection) {
            if (!center) return
            const [x, y] = projection(center)
            const canvas = makeLabelCanvas(40, name);
            const texture = new THREE.Texture(canvas)
            texture.needsUpdate = true;
            texture.minFilter = THREE.LinearFilter;
            texture.wrapS = THREE.ClampToEdgeWrapping;
            texture.wrapT = THREE.ClampToEdgeWrapping;

            const spriteMaterial = new THREE.SpriteMaterial({
                map: texture,
                transparent: true,
            });
            spriteMaterial.depthTest = false;
            // spriteMaterial.blending = THREE.AdditiveBlending;
            const sprite = new THREE.Sprite(spriteMaterial);
            sprite.position.set(x, -y, 13);
            sprite.scale.set(canvas.width > 280 ? 10 : 5, 2.5, 1);
            return sprite
        }
        /**
         * 渐变色圆柱体
         * */
        function createGradientCylinder(center, name, projection, height, colorArray) {
            if (!center) return
            const [x, y] = projection(center)
            const geometry = new THREE.CylinderGeometry(1, 1, height, 32, 10);
            const material = new THREE.ShaderMaterial({
                vertexShader: `
                    varying vec2 v_uv;
                    void main () {
                        v_uv = uv;
                        gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);
                    }
                `,
                fragmentShader: `
                    varying vec2 v_uv;
                    uniform vec3 start_color;
                    uniform vec3 end_color;

                    void main () {
                        gl_FragColor = mix(vec4(start_color,1.0), vec4(end_color,1.0), smoothstep(0.0, 1.0, v_uv.y > 0.1 ? v_uv.y - 0.1 : v_uv.y));
                    }
                    // 或者v_uv.y
                `,
                //  varying vec3 vNormal;
                //  varying vec3 vPosition;
                //     如果只有一个颜色用下面这个
                //    float cy = (fract((vPosition.z - 5.0) / 10.0) + 0.7) * 0.7;
                //    vec3 color = color1;
                //    if(vNormal.x==0.0&&vNormal.y==1.0&&vNormal.z==0.0){
                //        cy = 1.0;
                //    }
                //    gl_FragColor = vec4(color, cy);
                uniforms: {
                    start_color: { value: colorArray[0] },
                    end_color: { value: colorArray[1] },
                },
            })
            const material2 = new THREE.MeshBasicMaterial({
                color: colorArray[0],
            })
            const cylinder = new THREE.Mesh(geometry, [
                material,
                material2
            ]);
            cylinder.position.set(x, -y, height / 2 + 10);
            // cylinder.scale.set(5, 2.5, 1);
            cylinder.rotation.x = Math.PI / 2
            return cylinder
        }


        let changeNum = 25
        // 绘制线条函数
        function drawMetapLine(v0, v3) {
            let v1 = {};
            v1.x = (v0.x + v3.x) / 2;
            v1.y = (v0.y + v3.y) / 2;
            v1.z = 23;
            // 绘制贝塞尔曲线
            let curve = new THREE.QuadraticBezierCurve3(v0, v1, v3);
            let geometry = new THREE.BufferGeometry().setFromPoints(curve.getPoints(100));
            let material = new THREE.LineBasicMaterial({
                // color: 'red',
                // transparent: true,
                // opacity: 0.5
                linewidth: 3,
                vertexColors: true
            });
            const colors = [];

            for (let i = 0; i < 101; i++) {
                if (changeNum < i && i < changeNum + 10) {
                    colors.push(0.99);
                    colors.push(0);
                    colors.push(0.01);
                } else {
                    colors.push(0.9);
                    colors.push(0.72);
                    colors.push(0.5);
                }
            }
            geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
            geometry.colorsNeedUpdate = true;
            let line = new THREE.Line(geometry, material);
            return line
        }

        const map = new THREE.Object3D()
        // 解析数据
        function operationData(jsondata) {
            // 全国信息
            const features = jsondata.features

            features.forEach((feature) => {
                // 单个省份 对象
                const province = new THREE.Object3D()
                // 地址
                province.properties = feature.properties.name
                const coordinates = feature.geometry.coordinates
                const centerPosition = feature.properties.center
                const length = feature.properties.subFeatureIndex + 1
                const color = '#2defff'
                // const color = ['重庆市', '上海市'].includes(feature.properties.name) ? 'blue' : 'yellow'

                // const lable = makeTextSprite(centerPosition, feature.properties.name, projection1)
                const lable = createGradientCylinder(centerPosition, feature.properties.name, projection1, length, [new THREE.Color('red'), new THREE.Color('green')])
                console.log(lable);
                lable && province.add(lable)
                if (feature.geometry.type === 'MultiPolygon') {
                    // 多个，多边形
                    coordinates.forEach((coordinate) => {
                        // coordinate 多边形数据
                        coordinate.forEach((rows) => {
                            const mesh = drawExtrudeMesh(rows, color, projection1)
                            const line = lineDraw(rows, color, projection1)

                            // 唯一标识
                            mesh.properties = feature.properties.name

                            province.add(line)
                            province.add(mesh)
                        })
                    })
                }

                if (feature.geometry.type === 'Polygon') {
                    // 多边形
                    coordinates.forEach((coordinate) => {
                        const mesh = drawExtrudeMesh(coordinate, color, projection1)
                        const line = lineDraw(coordinate, color, projection1)
                        // 唯一标识
                        mesh.properties = feature.properties.name

                        province.add(line)
                        province.add(mesh)
                    })
                }
                map.add(province)
            })
            const [x, y] = projection1([116.405285, 39.904989])
            const [x1, y1] = projection1([103.823557, 36.058039])

            let line = drawMetapLine(new THREE.Vector3(x, -y, 10), new THREE.Vector3(x1, -y1, 10))
            line.name = 'curveLinkOne'
            map.add(line)
            scene.add(map)
        }



        /**
         * 获取鼠标在three.js 中归一化坐标
         * */
        function setPickPosition(event) {
            let pickPosition = { x: 0, y: 0 }
            pickPosition.x = (event.clientX / renderer.domElement.width) * 2 - 1
            pickPosition.y = (event.clientY / renderer.domElement.height) * -2 + 1
            return pickPosition
        }

        // 全局对象
        let lastPick = null

        // 监听鼠标
        // window.addEventListener('click', onRay)
        // window.addEventListener('mousemove', onMove)

        function onRay(event) {
            let pickPosition = setPickPosition(event)
            const raycaster = new THREE.Raycaster()
            raycaster.setFromCamera(pickPosition, camera)
            // 计算物体和射线的交点
            const intersects = raycaster.intersectObjects([map], true)
            console.log(intersects);
            // 数组大于0 表示有相交对象
            if (intersects.length > 0) {
                if (lastPick) {
                    if (lastPick.object.properties !== intersects[0].object.properties) {
                        lastPick.object.material.color.set('#2defff')
                        lastPick = null
                    }
                }
                if (intersects[0].object.properties) {
                    intersects[0].object.material.color.set('blue')
                }
                lastPick = intersects[0]
            } else {
                if (lastPick) {
                    // 复原
                    if (lastPick.object.properties) {
                        lastPick.object.material.color.set('#2defff')
                        lastPick = null
                    }
                }
            }
        }

        // function onMove(event) {
        //     let mousePosition = setPickPosition(event)
        //     let tooltip = document.getElementById('tooltip')
        //     tooltip.style.left = event.clientX + 2 + 'px'
        //     tooltip.style.top = event.clientY + 2 + 'px'
        //     const raycaster = new THREE.Raycaster()
        //     raycaster.setFromCamera(mousePosition, camera)
        //     // 计算物体和射线的交点
        //     const intersects = raycaster.intersectObjects([map], true)
        //     // 数组大于0 表示有相交对象
        //     if (intersects.length > 0) {

        //         if (intersects[0].object.properties) {
        //             tooltip.textContent = intersects[0].object.properties
        //         }
        //         tooltip.style.visibility = 'visible'
        //     } else {
        //         tooltip.style.visibility = 'hidden'
        //     }
        // }

        // 重庆市为中心
        const projection2 = d3.geoMercator().center([106.557691, 29.559296]).translate([0, 0])
        // 重庆市地图
        loader.load('/json/500000_full.json', (data) => {
            const jsondata = JSON.parse(data)
            operationData2(jsondata)
        })
        // 场景2
        const scene2 = new THREE.Scene()
        const map2 = new THREE.Object3D()
        // 解析数据
        function operationData2(jsondata) {
            // 全国信息
            const features = jsondata.features

            features.forEach((feature) => {
                // 单个省份 对象
                const province = new THREE.Object3D()
                // 地址
                province.properties = feature.properties.name
                const coordinates = feature.geometry.coordinates
                const color = '#2defff'
                // const color = ['重庆市', '上海市'].includes(feature.properties.name) ? 'blue' : 'yellow'

                if (feature.geometry.type === 'MultiPolygon') {
                    // 多个，多边形
                    coordinates.forEach((coordinate) => {
                        // coordinate 多边形数据
                        coordinate.forEach((rows) => {
                            const mesh = drawExtrudeMesh(rows, color, projection2)
                            const line = lineDraw(rows, color, projection2)
                            // 唯一标识
                            mesh.properties = feature.properties.name

                            province.add(line)
                            province.add(mesh)
                        })
                    })
                }

                if (feature.geometry.type === 'Polygon') {
                    // 多边形
                    coordinates.forEach((coordinate) => {
                        const mesh = drawExtrudeMesh(coordinate, color, projection2)
                        const line = lineDraw(coordinate, color, projection2)
                        // 唯一标识
                        mesh.properties = feature.properties.name

                        province.add(line)
                        province.add(mesh)
                    })
                }
                map2.add(province)
            })
            map2.scale.set(8, 8, 1)
            scene2.add(map2)
        }


        // 渲染
        function render() {
            if (lastPick && lastPick.object.properties === '重庆市') {
                renderer.render(scene2, camera)
            } else {
                renderer.render(scene, camera)
            }
            changeNum++
            if (changeNum > 75) {
                changeNum = 0
            }
            var curve = scene.getObjectByName("curveLinkOne");
            if (curve) {
                let color = curve.geometry.getAttribute('color')

                let colors = [];
                for (let i = 0; i < 101; i++) {
                    if (changeNum < i && i < changeNum + 10) {
                        colors.push(0.9);
                        colors.push(0.72);
                        colors.push(0.5);
                    } else {
                        colors.push(0.99);
                        colors.push(0);
                        colors.push(0.01);
                    }
                }
                curve.geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
                color.needsUpdate = true;
            }

            requestAnimationFrame(render)
        }
        requestAnimationFrame(render)
    }
}
</script>
<style scoped>
#tooltip {
    position: absolute;
    z-index: 2;
    background: white;
    padding: 6px;
    border-radius: 3px;
    visibility: hidden;
}
</style>
