<template>
    <div id="app">
        <Cascader @on-change="change" style="width: 270px" :data="data" v-model="currentDemo"></Cascader>
        <component :is="currentDemo[1]"> </component>
    </div>
</template>

<script>
export default {
    name: "App",
    data() {
        return {
            currentDemo: [],
            data: [
                {
                    value: "go",
                    label: "官网入门",
                    children: [
                        {
                            value: "FirstDemo",
                            label: "FirstDemo",
                        },
                        {
                            value: "FirstDrawLine",
                            label: "线",
                        },
                    ],
                },
                {
                    value: "第一章创建场景",
                    label: "第一章创建场景",
                    children: [
                        {
                            value: "Scene",
                            label: "创建场景",
                        },
                        {
                            value: "Lights",
                            label: "Lights",
                        },
                        {
                            value: "Animation",
                            label: "动画+stats+dat.gui+自适应大小",
                        },
                    ],
                },
                {
                    value: "第二章基本组件",
                    label: "第二章基本组件",
                    children: [
                        {
                            value: "SceneDetail",
                            label: "Scene添加删除box",
                        },
                        {
                            value: "Geometry",
                            label: "各种Geometry",
                        },
                        {
                            value: "CustomGeometry",
                            label: "自定义Geometry(face3弃用)",
                        },
                        {
                            value: "MeshDetail",
                            label: "Mesh属性方法",
                        },
                        {
                            value: "CameraDetail",
                            label: "Camera属性方法",
                        },
                    ],
                },
                {
                    value: "第三章光源Lights",
                    label: "第三章光源Lights",
                    children: [
                        {
                            value: "AmbientLight",
                            label: "AmbientLight",
                        },
                        {
                            value: "SpotLight",
                            label: "SpotLight",
                        },
                        {
                            value: "PointLight",
                            label: "PointLight",
                        },
                        {
                            value: "DirectionalLight",
                            label: "DirectionalLight",
                        },
                        {
                            value: "CameraDetail",
                            label: "Camera属性方法",
                        },
                    ],
                },
                {
                    value: "第四章材质Materials",
                    label: "第四章材质Materials",
                    children: [
                        {
                            value: "MeshBasicMaterial",
                            label: "MeshBasicMaterial",
                        },
                        {
                            value: "MeshDepthMaterial",
                            label: "MeshDepthMaterial",
                        },
                        {
                            value: "CombineMaterial",
                            label: "联合材质",
                        },
                        {
                            value: "MeshNromalMaterial",
                            label: "MeshNromalMaterial",
                        },
                        {
                            value: "ManyMaterials",
                            label: "立方体六个面不同材质",
                        },
                        {
                            value: "MeshLambertMaterial",
                            label: "MeshLambertMaterial",
                        },
                        {
                            value: "MeshPhongMaterial",
                            label: "MeshPhongMaterial",
                        },
                        {
                            value: "ShaderMaterial",
                            label: "ShaderMaterial",
                        },
                        {
                            value: "LineBasicMaterial",
                            label: "LineBasicMaterial",
                        },
                    ],
                },
                {
                    value: "第五章创建场景",
                    label: "第五章创建场景",
                    children: [
                        {
                            value: "BufferGeometry",
                            label: "自定义几何体",
                        },
                        {
                            value: "Lights",
                            label: "Lights",
                        },
                        {
                            value: "Animation",
                            label: "动画+stats+dat.gui+自适应大小",
                        },
                    ],
                },
                {
                    value: "第六章高级几何体",
                    label: "第六章高级几何体",
                    children: [
                        {
                            value: "ConvexGeometry",
                            label: "ConvexGeometry",
                        },
                        {
                            value: "Fontloader",
                            label: "三维文本",
                        },
                    ],
                },
                {
                    value: "第七章精灵和粒子",
                    label: "第七章精灵和粒子",
                    children: [
                        {
                            value: "SpritePoints",
                            label: "SpritePoints",
                        },
                    ],
                },
                {
                    value: "第八章Group和merge",
                    label: "第八章Group和merge",
                    children: [
                        {
                            value: "Group",
                            label: "Group",
                        },
                        {
                            value: "GeometryMerge",
                            label: "GeometryMerge",
                        },
                    ],
                },
                {
                    value: "第九章动画",
                    label: "第九章动画",
                    children: [
                        {
                            value: "SelectObject",
                            label: "SelectObject",
                        },
                        {
                            value: "tweenjs",
                            label: "tweenjs",
                        },
                        {
                            value: "EffectComposer",
                            label: "EffectComposer物体边框动画",
                        },
                    ],
                },
                {
                    value: "第十纹理",
                    label: "第十纹理",
                    children: [
                        {
                            value: "basicTexture",
                            label: "初次简单require引入纹理图片",
                        },
                        {
                            value: "BumpMapping",
                            label: "凹凸贴图",
                        },
                        {
                            value: "RoughMetalMappig",
                            label: "粗糙金属贴图",
                        },
                        {
                            value: "AlphaMapping",
                            label: "Alpha贴图",
                        },
                        {
                            value: "LightMapping",
                            label: "自发光贴图",
                        },
                        {
                            value: "EnvReflect",
                            label: "环境反射贴图",
                        },
                        {
                            value: "UVMapping",
                            label: "UV贴图",
                        },

                    ],
                },
            ],
        };
    },
    methods: {
        change() {
            if (this.currentDemo.length === 0) return;
            document.querySelector("body #stats") &&
                document.querySelector("body #stats").remove();
            this.$nextTick(() => {
                document.querySelector("body canvas").remove();
                if (document.querySelector(".ac").childNodes.length > 1) {
                    document.querySelector(".ac").childNodes[0].remove();
                }
            });
        },
    },
};
</script>

<style>
#app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    margin-top: 2px;
}

.dg {
    margin-top: 18px;
}
</style>
