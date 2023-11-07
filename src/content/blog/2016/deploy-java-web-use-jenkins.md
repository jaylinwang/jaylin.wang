---
title: 使用Jenkins部署JavaWeb项目
tags:
  - Jenkins
  - 自动化部署
categories:
  - 项目实践
toc: false
date: 2016-11-13
---

修改代码，打包，上传，重启... 大把的时间花费在这些重复无味的工作上。笔者与当前主流的价值观保持一致：我们应该把时间花费在更有意义的事情上。我们可以尝试借助一些工具，让这些重复机械的工作交给计算机去完成，这也是我们做软件开发的核心思想。

借用 Jenkins 持续集成重复工作是一个很不错的选择。

研究 Jenkins 的最终目的是解决公司中 Java Web 项目的自动化部署，公司项目本身是由几个服务，一个 API  项目以及不同客户端组，希望部署到不同服务器。初次使用 Jenkins 应用于现有的项目，一般规律是这样的：第一次总是困难的，困难的事情结合困难的事情就叫难上加难，我们需要先把问题化小。笔者最终将问题暂时转化为如下问题：

基于 **Maven** 构建的 **Java Web 项目**，使用 Jenkins 部署到另一台机器上。

<!-- more -->

## 部署准备

- 在本地测试通过，可以通过 `maven` 构建的项目
- 项目提交至远程 `git` 服务器
- Java Web 项目的运行服务器上具有项目所需要的运行环境
- Supervisor 进程管理工具

笔者已将此次工作的项目提交至 Github（项目名称是 testweb,[项目地址](https://github.com/jaylinwang/testweb)）,并提前整理了两篇工具安装及使用的教程: [进程管理工具Supervisor的安装及使用](http://jaylin.wang/2016/11/10/supervisor-guide/)，[Jenkins的安装及部署](http://jaylin.wang/2016/11/10/jenkins-install-and-use/)。

## Jenkins 配置

- Jenkins 插件依赖

Jenkins 需要具备的插件：`Publish Over SSH`,`Maven Integration plugin`,`Git plugin`

- 构建环境配置

进入 **主界面 > 系统管理 > Global Tool Configuration** 配置构建所需的 Maven 执行环境，Java 运行环境，Git 执行环境，所涉及的 `JAVA_HOME`、` Git executable`、`MAVEN_HOME` 的内容与 Jenkins 运行机器配置同步。

- SSH 配置

进入 **主界面 > 系统管理 > 系统设置** 编辑 **Publish over SSH** 配置项：

![ssh服务器配置](http://jaylinwang.oss-cn-beijing.aliyuncs.com/201611/deploy-java-web-use-jenkins/ssh_config.png)

其中，`Key` 的填入值是运行 Jenkins 用户对应的 `/home/{username}/.ssh/id_rsa` 

## 项目运行进程配置

使用 maven 构建后，项目可以通过 `java -jar {projectName}.war` 运行，我们使用 Supervisor 确保此命令已守护进程方式运行。在 Supervisor 子进程配置文件下加入 `testweb.conf`，内容大致如下：

```yaml
[program:testweb]
command=java -jar /{ssh配置的目录}/testweb.war
stdout_logfile={日志输出目录}/testweb.log
user=root
autostart=true
autorestart=true
startsecs=30
startretries=5
```

## 创建 Jenkins 集成部署项

进入 **主界面 > 新建** 创建新的部署项，我们选择**构建一个Maven项目**，做以下配置：

- 项目基本配置

  基本配置包括项目的名称，项目简介

- 项目源码来源

  我们源码来源是远程 git 仓库，选择 **git** ，然后填入项目的 git 地址

- 构建触发器、构建环境、前置构建工作暂时不用修改，保持默认即可

- build 配置

  我们的 JavaWeb 项目是基于 Maven 构建，所以我们需要填入 Maven 构建的 root pom 地址

- 构建后的操作

  构建后的操作是部署到其他服务器的关键步骤,项目最终配置如下：

![构建后配置](http://jaylinwang.oss-cn-beijing.aliyuncs.com/201611/deploy-java-web-use-jenkins/after_build.png)

  将 **Source files** 传输到 **SSH Server**,删除  **Remove prefix** 前缀，然后在 **SSH Server** 执行 **Exec command**。

## 执行构建

进入 **项目面板**，点击立即构建，开始一次构建任务，项目面板效果如下：

![项目面板](http://jaylinwang.oss-cn-beijing.aliyuncs.com/201611/deploy-java-web-use-jenkins/build_result.png)

确保最终构建是蓝色，如果是红色或者黄色，我们就需要进入构建日志，排查问题了

> 想办法提高自己的工作效率，多一点陪伴家人和朋友的时间


