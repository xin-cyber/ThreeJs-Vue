<template>
    <div id="app">
        <Cascader @on-change="change" style="width: 240px" :data="data" v-model="currentDemo"></Cascader>
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
            ],
        };
    },
    methods: {
        change() {
            if (this.currentDemo.length === 0) return;
            document.querySelector('body #stats') && document.querySelector('body #stats').remove()
            this.$nextTick(() => {
                document.querySelector('body canvas').remove()
                if (document.querySelector('.ac').childNodes.length > 1) {
                    document.querySelector('.ac').childNodes[0].remove()
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
