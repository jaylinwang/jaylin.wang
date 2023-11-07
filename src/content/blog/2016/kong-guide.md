---
title: Kong的折腾笔记之相关技术清单
date: 2016-10-25
tags:
- Kong 
- 技术清单
- 工程化
categories:
- 项目实践
toc: true
---

## 背景

公司准备更好的实现微服务架构，我前期的任务主要是 API 开发相关的技术学习，微服务会随着业务的增加不断增加，客户端调用微服务的 API 也随着增加，这时，一个统一 API 的中间件就有必要了。瞄准了 Kong 这个解决方案，接下来的几天时间就来折腾这个东西。 

## Kong的基本概念

Kong 是 Mashape 开源的一个 API 中间件项目，基于 Nginx 构建，支持 PostgreSQL 和 Apache Cassandra 存储。支持通过集群实现性能扩展，支持通过插件实现功能扩展，并且可以运行于现在主流的运行环境。

<!-- more -->

我们可以用 Kong 官方提供的一张图来表述客户端 - Kong - API 之间的请求关系：

![client - kong - api](http://jaylinwang.oss-cn-beijing.aliyuncs.com/201610/kong-guide/kong-simple.png)

Kong 会代理来自不同地方的 API， 并且转发所有来自客户端的 API 请求。

## 捣腾进行时...

准备依靠阿里云 RDS for PostgreSQL 方便对 API 存储的管理，所以本地搭建 Kong 服务的时候也是选择在 Centos7 上安装 PostgreSQL。

Kong 本身的安装并不复杂，但所依赖的技术需要仔细学习一番，我也是被周围的东西秀了一脸～，列出一个自己在搭建过程中用到的相关技术，有一些仔细看了一番，也有一些浅尝而止，从此篇慢慢发散、完善补吧～

- 进程管理工具：Supervisord。( [官方网站](http://supervisord.org/) )

- NoSQL 的代表：Apache Cassandra。( [官方网站](http://cassandra.apache.org/) )

- 与MySQL齐头并进的数据库：PostgreSQL。( [官方网站](https://www.postgresql.org) )

- 为性能而生的 Server：Nginx。( [官方网站](http://nginx.org/) )

- 基于 Nginx 的高性能 Web 平台：OpenResty。( [官方网站](https://openresty.org/en/) )

## 血的教训

因为忽略的一个之前没注意的 warning 导致自己花一天时间去解决一个错误，浪费一大把陪媳妇儿的时间，不开森～～～

warning 是这样的:

```bash
perl: warning: Setting locale failed.
perl: warning: Please check that your locale settings:
LANGUAGE = (unset),
LC_ALL = (unset),
LANG = "en_US.UTF-8"
    are supported and installed on your system.
perl: warning: Falling back to the standard locale ("C").
```

相信大家也是遇到过，之前貌似没造成什么影响，这次就栽了... 解决方案是在 profile/.bashrc 中指定 LC_ALL：

```bash
echo "export LC_ALL=en_US.UTF-8"  >>  /etc/profile
source /etc/profile
```

最后流一句小林名言：

> Warning is error，not ok，let‘s kill it


