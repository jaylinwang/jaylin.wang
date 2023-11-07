---
title: 浅谈Webpack的应用
tags:
  - webpack
categories:
  - 前端技术
toc: false
date: 2017-02-11
---

webpack 在前端工程中随处可见，当前流行的 vue, react, weex 等解决方案都推崇 webpack 作为打包工具。前端工具云集的时代，这是你值得选择的之一。

<!--more-->

## webpack的基本概念

webpack 是一个前端打包工具，希望解决前端工程中静态资源发版前的打包问题。以 javascript 作为载体，引入前端项目依赖的模块，最终通过 webpack 打包成为浏览器支持的文件。

webpack 官方示意图形象的表述了这一过程，在此借用：

![webpack示意图](http://jaylinwang.oss-cn-beijing.aliyuncs.com/201702/webpack.png)

## webpack不是为取代gulp之类的工具

在前端社区看到有人讨论 webpack 是否会取代 gulp 之类的工具。 当使用过 gulp 和 webpack 之后，才能体会到这是一个不恰当的对比。

使用过 grunt 或者 gulp 之类的工具的伙伴可以回忆一下我们的使用场景，我们将 sass 编译，图片压缩，js 压缩，hash文件名等工作编成不同的任务，最后顺序执行。

webpack 的核心在于静态资源打包。gulp 的核心在于任务集成。两个工具，解决了前端工程中不同的问题。

我们完全可以结合 gulp 和 webpack 使用。

## 简述webpack的核心

浏览器所支持的静态资源是有限的，webpack 旨在让项目中的静态资源都能得到支持。然而 webpack 只能识别 javascript，所有的文件(包含html,jpg,sass,etc.)都被作为模块。

- entry

webpack 通过 js 创建项目中所有静态资源的依赖映射。entry 定义了 webpack 打包的入口文件。

- output

output 定义了 webpack 打包文件的处理方式，output 配置指定了打包后文件的输出目录(output.path)，文件名(output.filename)。

- loader

模块加入项目依赖映射后，loader 定义了

- plugin

plugin 为 webpack 提供了更多的自定义功能。

## 新手从新版本开始

年初，webpack 发布了 v2.2 稳定版本，在文档质量，配置项的规范，打包效率等方面改进很多。且官方也不再建议使用 v1 版本。建议准备开始应用的伙伴直接选择 v2 版本。