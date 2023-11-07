---
title: Jenkins的安装及部署
tags:
  - 自动化部署
  - Jenkins
  - 工程化
categories:
  - 项目实践
date: 2016-11-10 22:24:38
---

Jenkins 是开源的自动化集成部署应用，具有强大的社区支撑，丰富的插件支持。

<!-- more -->

## 安装

安装之前，确保你拥有以下最基本的环境保障:

- Java 7
- 256MB free memory
- 1GB+ free disk space

Jenkins 官方推荐的环境是:

- Java 8
- 1GB+ free memory
- 50GB+ free disk space

笔者采用 war 的方式,在 centos7／jdk8u111 环境下安装 Jenkins 应用，首先需要在官方下载[官方网站](https://jenkins.io/):

```yaml
# 切换至目标安装目录
cd /opt/jenkins
# 下载程序war
wget http://mirrors.jenkins-ci.org/war/latest/jenkins.war
```
使用 `java -jar` 运行 war 文件,Jenkins 会使用内置的 Jetty 作为容器运行:

```
java -jar http://mirrors.jenkins-ci.org/war/latest/jenkins.war --httpPort {port}
```
访问验证是否安装成功:

```
curl localhost:{port}
```

## 使用 Supervisor 管理 Jenkins 进程

Supervisor 是 Unix-Like 下一种优雅的进程管理方式，安装及使用可以参照[进程管理工具Supervisor的安装及使用](http://jaylin.wang/2016/11/10/supervisor-guide/)。添加配置：

新增配置文件:

```yaml
emacs /etc/supervisord.d/jenkins.conf
```

内容如下:

```yaml
[program:jenkins]
command=java -jar /opt/jenkins/jenkins.war --httpPort={port}
user=root
autostart=true
autorestart=true
startsecs=30
startretries=5
```
重启 supervisord :

```
supervisorctl reload
```
## Jenkins 初始化

在浏览器中访问 Jenkins Web 站点，访问地址是 `{Host address}:{port}`，接下来是一系列按部就班的操作。

首先会看到输入初始验证密码的界面:

![输入初始验证密码界面](http://jaylinwang.oss-cn-beijing.aliyuncs.com/201611/jenkins_install_and_use/jenkins_install_auth.png)

再者是进入用户自定义插件界面，建议选择安装官方推荐插件，因为安装后自己也得安装:

![自定义插件界面](http://jaylinwang.oss-cn-beijing.aliyuncs.com/201611/jenkins_install_and_use/jenkins_install_suggested_plugins.png)

接下来是进入插件安装进度界面:

![插件安装进度界面](http://jaylinwang.oss-cn-beijing.aliyuncs.com/201611/jenkins_install_and_use/jenkinst_install_plugins.png)

初始化成功后进入 Jenkins 首页:

![Jenkins首页](http://jaylinwang.oss-cn-beijing.aliyuncs.com/201611/jenkins_install_and_use/jenkins_install_ok.png)

到此为止，Jenkins 的安装结束，准备开始一键部署项目...