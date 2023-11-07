---
title: 跨域HTTP请求解决方案
tags:
  - cross-origin
  - jsonp
  - cors
  - EmbedPing
categories:
  - web前端
toc: false
date: 2017-11-10 23:21:35
---

跨域HTTP请求是指当前文档访问其他源提供的资源。两个页面具有相同的协议，域名和端口，则两个页面属于相同的源，不同子域名之间也属于不同的源。这是浏览器端的同源策略的约束，同源策略则是浏览器隔离潜在恶意文件的安全机制。

目前常用的跨域解决方案有EmbedPing、JSONP、CORS。

<!-- more -->

## 一些知识点

1. 跨域限制是浏览器的一种行为

  当我们在浏览器的一个页面中尝试进行一次跨域操作，比如我们在 localhost 的一个页面通过 ajax 访问 127.0.0.1 的一个路由，127.0.0.1已经将数据返回给浏览器，浏览器禁止了获取响应数据行为。我们可以看一张图：

  ![跨越请求现象](http://jaylinwang.oss-cn-beijing.aliyuncs.com/2017/cross-origin-and-resolve/co_phenomenon.png)

2. 跨域请求的几种方式

  - 跨域写
    浏览器始终支持通过跨域写操作。例如通过表单提交方式向其他源提交数据，点击链接重定向到其他源。

  - 跨域嵌入
    浏览器始终支持跨域资源的嵌入。例如通过 img、script、video 等元素的 src 属性嵌入跨域资源。

  - 跨域读

## 跨域的解决方案

### EmbedPing

这是我自己瞎取的一个名字，大致是利用浏览器支持标签嵌入跨域属性实现的一种方案。img、script、link[rel='stylesheet']会在页面渲染过程中请求其src/href设置的资源地址，我们可以在访问的路由中做处理。例如使用img的src属性：

```html
  <script>
    var img = new Image()
    img.src = 'http://localhost:4000/check'
  </script>
```

因为无法获取到服务端返回的数据，EmbedPing是浏览器向服务器单向请求的过程。

我们可以使用 EmbedPing 做一些不严格统计。

### JSONP

JSONP也利用了 script 标签的 src 属性，浏览器会执行加载成功后的js。JSONP的局限是只能发送一个GET请求。

**应用示例**

看一个简单示例，我们希望在当前域的页面上打印服务器的一个状态，我们使用JSONP可以这样实现，前可以看一段简单代码（服务端使用koa构建的）：

当前域属于 `http://localhost:3000`,我们在页面上这请求

```html
<body>
  <script>
    var script = document.createElement('script')
    script.src = 'http://localhost:4000/jsonp/run'
    script.async = true
    document.body.appendChild(script)
  </script>
</body>
```

在 `http://localhost:4000/jsonp/run` 中，我们返回了一段打印状态的script

```js
var valForServerB = 'a'
router.get('/jsonp/run', (ctx) => {
  let script = `
    alert('我来自服务器b，我的值是${valForServerB}')
  `
  ctx.body = script
})
```

这样，我们可以在当前页面上显示 `valForServerB` 的值了。


**几种类型**

根据 JSONP 返回的代码片段不同，混入自己的情感，我将 JSONP 分为三种类型（这种带着情感的划分，需要各位大牛的指正）：

- 返回执行
  返回代码即执行代码，直接在页面上产生效果

- 返回定义
  返回代码是函数的定义，具体调用时机交给当前页面决定

- 返回调用
  函数的执行过程是在页面上所定义的，JSONP的返回只是函数的调用，当然包含传给函数的参数。

为了保持当前页面的的绝对控制权，返回调用应该是应用最广的

**错误处理**

JSONP使用过程中，会有两种常见错误：

- 请求失败或服务器返回失败
  捕获此类错误，我们是借用 script 的 onerror 处理

- 服务器返回内容错误
  针对这类错误，我们会在当前页面借用定时器去处理。在返回调用时，我们可以在页面上的函数定义中埋下时间因子；在返回定义时，我们可以设置时间点去检测期望调用的方法是否存在。当然，此方法会因为网络等因素变得不可靠。

### CORS(跨域资源共享)

CORS是当前页面与其他域执行的一种双方约束，需要浏览器应用和服务器程序之间的协调。

我们在服务器端可以通过设置CORS响应头部：

- Access-Control-Allow-Origin: <origin> | *
  允许访问的源

- Access-Control-Allow-Methods
  允许访问的方法

- Access-Control-Allow-Headers
  运行添加的请求头部

- Access-Control-Expose-Headers
  允许客户端可以访问的头部

- Access-Control-Max-Age
  预请求的缓存周期

- Access-Control-Allow-Credentials
  是否运行请求加入用户凭证信息

相应的，在请求头部中，我们可以加入：

- Origin
  告知服务器请求的源

- Access-Control-Request-Method
  告知服务器使用请求的的方法

- Access-Control-Request-Headers
  告知服务器，请求中携带的头部


## 结语

跨域请求好，安全第一位。在我们跨域请求时，我们要确保我们请求的服务器返回的数据是可信任的。


## 相关链接

[cross-origin-resolve-demo](https://github.com/jaylinwang/cross-origin-resolve-demo)

[MDN CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS)
