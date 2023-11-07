---
title: 聊一聊web开发中的session和cookie
tags:
  - 前端
  - cookie
  - session
  - 浏览器存储
categories:
  - web前端
toc: false
date: 2017-11-09 18:09:12
---

浏览器 cookie 主要保存服务端发送给用户浏览器和页面调用 `document.cookie=?` 所设置的小片数据。浏览器在磁盘上保存 cookie 并且在下一次请求时发送给相同的服务器。

session(也称为会话)，包含 session cookie 和 session content 两部分，客户端通过 session cookie 记录会话标识，服务端通过会话标识找到对应的 session content。

cookie 和 session 的初衷是不同，cookie 最初是普遍使用客户端存储方案，session 最初是想维持用户登录状态。session 巧妙的应用了服务端设置`Set-Cookie`响应头部的方式和网络请求携带`Cookie`请求头部的特性。

<!-- more -->

## Cookie的几种应用场景

- 会话管理
  用户登录状态、购物车列表等
- 个性化设置
  用户偏好，用户主题等
- 跟踪行为
  用户行为分析

## Cookie的组成部分

我们可以通过控制台查看到应用cookie内容，控制台是以表格形式展示：

![cookie控制台视图](http://jaylinwang.oss-cn-beijing.aliyuncs.com/2017/session-cookie-learn/console.png)

- name
- value
- expires
  过期时间，如国不设置，默认为Session（浏览器关闭后销毁）
- domain
  可访问cookie的域名，支持泛域名的配置(例如 .jaylin.wang)
- path
  可访问cookie的path
- httpOnly
  是否只允许服务端读取cookie内容
- secure
  是否加密处理

## Cookie使用注意事项

- 尽量减少 cookie 中的存储数据
  由于 cookie 每次会在请求头部，大量的 cookie 数据会导致 http 请求的速度。在现代浏览器中，我们可以首选[Web Storage API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API) (localStorage 和 sessionStorge) 和 [IndexedDB](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API)

- 不适用 cookie 中保存敏感信息
  虽然cookie支持 Secure 和 httpOnly两种模式，但浏览器不敢保证 cookie 绝对安全。黑客可以通过XSS注入和CSRF利用cookie中的信息。

## Session的补充

  服务端 session 默认是存储在内存之中，但是应用过程中，我们也会使用 mysql、redis、mongodb 等存储方案去持久化 session。


夜以深，这篇对 cookie 和 session 的轻描淡写到此为止吧，希望能给Web入门同学带来帮助，更希望有深入理解的朋友多多交流，good night～～

