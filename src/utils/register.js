//'@com/global/globalcomponents.js' 上面components的路径
//ps：@com 是我们自定义的路径别名

//require.context webpack的api用来创建上下文作用域
//三个参数分别为：目录，是否搜索子文件夹，匹配文件名的正则
const component = require.context('../components', true, /\.vue$/);

//将得到的上下文作用域转为数组方便遍历
const requireAll = (context) => context.keys().map(context);

//es6 模块抛出写法
export default {
  //app.use()默认调用install处理实例
  install: function (Vue) {
    requireAll(component).forEach((item) => {
      //注意：组件抛出方式为 export default
      let name = item.default.name;

      //vue的全局注册API
      Vue.component(`${name}`, item.default);
    });
  },
};
