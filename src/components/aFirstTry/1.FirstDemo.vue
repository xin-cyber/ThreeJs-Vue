<template>
    <div></div>
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
        const projection1 = d3.geoMercator().center([116.412318, 39.909843]).translate([0, 0])

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
        var axes = new THREE.AxesHelper(700)
        scene.add(axes)


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
                const color = 'yellow'
                // const color = ['重庆市', '上海市'].includes(feature.properties.name) ? 'blue' : 'yellow'

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
            scene.add(map)
        }

        // 计算 以画布 开始为（0，0）点 的鼠标坐标
        function getCanvasRelativePosition(event) {
            const rect = renderer.domElement.getBoundingClientRect()
            return {
                x: ((event.clientX - rect.left) * renderer.domElement.width) / rect.width,
                y: ((event.clientY - rect.top) * renderer.domElement.height) / rect.height
            }
        }
        /**
         * 获取鼠标在three.js 中归一化坐标
         * */
        function setPickPosition(event) {
            let pickPosition = { x: 0, y: 0 }
            // 计算后 以画布 开始为 （0，0）点
            const pos = getCanvasRelativePosition(event)
            // 数据归一化
            pickPosition.x = (pos.x / renderer.domElement.width) * 2 - 1
            pickPosition.y = (pos.y / renderer.domElement.height) * -2 + 1
            return pickPosition
        }

        // 监听鼠标
        window.addEventListener('click', onRay)
        // 全局对象
        let lastPick = null
        function onRay(event) {
            let pickPosition = setPickPosition(event)
            const raycaster = new THREE.Raycaster()
            raycaster.setFromCamera(pickPosition, camera)
            // 计算物体和射线的交点
            const intersects = raycaster.intersectObjects([map], true)
            // 数组大于0 表示有相交对象
            if (intersects.length > 0) {
                if (lastPick) {
                    if (lastPick.object.properties !== intersects[0].object.properties) {
                        lastPick.object.material.color.set('yellow')
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
                        lastPick.object.material.color.set('yellow')
                        lastPick = null
                    }
                }
            }
        }

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
                const color = 'yellow'
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

            requestAnimationFrame(render)
        }
        requestAnimationFrame(render)
    }
}
</script>
<style scoped>

</style>
