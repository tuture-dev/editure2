## editure2

![image-20210203233612141](https://tva1.sinaimg.cn/large/008eGmZEly1gnarsrwywnj312q0s6q52.jpg)

此项目使用 [remirror](https://github.com/remirror/remirror) 来重新实现 [editure](https://github.com/tuture-dev/editure) 的所有功能，目前主要参考 editure 的[线上例子](https://editure-preview.netlify.app/)实现了如下功能：

- 撤销
- 重做
- 加粗
- 斜体
- 下划线
- 删除线
- 行内代码
- 链接（部分）
- 一级标题
- 二级标题
- 引用
- 代码块
- 分割线

得益于 remirror 的完善的插件机制，上述的功能除了链接只支持点击工具栏插入链接外，其余的命令均支持工具栏+Markdown热键激活并插入对应的内容。

目前还有待完成的功能如下：

- 链接
  - 支持修改链接内容
  - 支持预览链接，并外链跳转到对应的网页
- 标题
  - 添加下拉框实现至少4-6级的标题支持
- 代码块
  - 支持语法高亮
  - 支持更换代码语言类型
- 有序列表
  - 有待配置插件
- 无序列表
  - 有待配置插件
- 图片
  - 可以点击工具栏上传图片
  - 可以复制、拖入上传图片等
- 个性化提示（default、warn、error等）
  - 需要自己理解 remirror 插件机制并实现

以上功能还需要添加快捷键支持，如链接（`cmd+k`)，得益于 remirror 的完善的插件机制，快捷键应该是内置的，只需要设置对应的选项激活即可。

## 一些感受

- remirror 代码方面做的比较完善，但是文档及其欠缺，好在作者维护比较活跃（如今天就有十几个提交）
- 在使用 remirror 之前，建议先将 [prosemirror](https://prosemirror.net/) 文档吃透，才能够很好的理解 remirror 的源码以及编写插件
- 如果需要完成现在 editure 的全部功能，有必要熟读 remirror 的源码，我更倾向于把 remirror 作为之后 editure 的一个基础参照物，后续应该要基于它编写插件甚至修改核心功能，但是帮助我们前进了很大一步，时隔两年，它已经做的比较好了

## 一些补充

- 此项目使用了我为学习前端工程化编写的脚手架初始化而来：[create-fps-app](https://github.com/pftom/create-fps-app)
- remirror 基于 TypeScript 实现，有必要学习 TypeScript 语法，同时也建议之后项目硬性要求 TypeScript
- 此项目额外使用了 [prosemirror-dev-tools](https://github.com/d4rkr00t/prosemirror-dev-tools)，用于 prosemirror 的方便调试，位于页面右下角，具体效果如下：

![image-20210203234145682](https://tva1.sinaimg.cn/large/008eGmZEly1gnarx0cf5dj31du0u0gtv.jpg)

### 如何开启项目

确保你安装了 [Node.js](http://nodejs.org/)（`>=v14.15.0`）以及 [yarn](https://yarnpkg.com/)，然后运行如下命令：

```bash
$ git clone https://github.com/tuture-dev/editure2.git
$ cd editure2 && yarn
$ yarn start
```



