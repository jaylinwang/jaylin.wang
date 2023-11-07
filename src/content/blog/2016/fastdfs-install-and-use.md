---
title: FastDFS的安装部署及使用
tags:
  - FastDFS
categories:
  - 项目实践
toc: false
date: 2016-11-23 20:18:59
---

依旧处于技术探索中，对很对技术处于一种浅尝的状态，这里记一篇关于分布式文件存储 FastDFS 的安装及使用的文章。

FastDFS是一个开源的分布式文件系统，她对文件进行管理，功能包括：文件存储、文件同步、文件访问（文件上传、文件下载）等，解决了大容量存储和负载均衡的问题。特别适合以文件为载体的在线服务，如相册网站、视频网站等。(详细介绍可以参考: https://www.oschina.net/p/fastdfs)

<!-- more -->

## 背景

- centos7 操作系统

## 安装

### 安装依赖

- 克隆 libfastcommon 源码的 master 分支(github 地址: https://github.com/happyfish100/libfastcommon)
  
- 进入 libfastcommon 目录，执行 `./make.sh` 及 `./make.sh install` 操作 

- 执行 `yum install -y libevent` 安装 libevent 

### 安装 FastDFS

- 克隆 FastDFS 源码的 master 分支(github 地址: https://github.com/happyfish100/fastdfs)

- 进入 FastDFS 目录，执行 `./make.sh` 及 `./make.sh install` 操作

- 安装后，FastDFS 会默认在 **/etc/fdfs** 目录下生成配置文件模版，命名为 ***.conf.sample**,我们需要复制为 **.conf**

## 配置 tracker 服务

- 编辑 tracker 配置文件 **/etc/tracker.conf**，当前只关注 `base_path`，配置为可访问的目录

- 启动 tracker 服务：`/usr/bin/fdfs_trackerd /etc/fdfs/tracker.conf`

- 重启 tracker 服务：`/usr/bin/fdfs_trackerd /etc/fdfs/tracker.conf restart`

- 查看是否有 tracker 进程：`ps aux | grep tracker`

## storage （存储节点）服务部署

- 编辑 storage 配置文件  **/etc/storage.conf**,当前只关注 `base_path`，`store_path0` 及 `tracker_server`。 其中， `base_path` 和 `store_path0` 配置为可访问的路径，`tracker_server` 配置为 tracker 的{服务器地址}:{端口}

- 启动 storage 服务：`/usr/bin/fdfs_storaged /etc/fdfs/storage.conf`

- 重启 storage 服务：`/usr/bin/fdfs_storaged /etc/fdfs/storage.conf restart`

- 查看是否有 storage 进程：`ps aux | grep storage`

## 测试是否部署成功

我们可以利用自带的 client 进行测试。

- 编辑 client 配置文件  **/etc/client.conf**，当前只关注 `base_path` 和 `tracker_server`，`base_path` 配置为可访问的路径，`tracker_server` 配置为 tracker 的{服务器地址}:{端口}

- 在终端中通过 shell 上传 opt 目录下的一个文件：/usr/bin/fdfs_test  /etc/fdfs/client.conf  upload /etc/fdfs/tracker.conf

- 如下图箭头所示，生成的文件地址为：http://192.168.1.201/group1/M00/00/00/wKgByVgwzzeATfFgAAAcnSBbh2A71_big.conf

![测试结果](http://jaylinwang.oss-cn-beijing.aliyuncs.com/201611/fastdfs-install-and-use/test_result.png)

此时可说明 FastDFS 已安装成功，关于上传文件的访问，可继续参照余庆老师的开源项目[fastdfs-nginx-module](https://github.com/happyfish100/fastdfs-nginx-module)

笔者也将记录一篇通过 openresty 模块实现文件的上传及访问...