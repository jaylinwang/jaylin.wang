---
title: 进程管理工具Supervisor的安装及使用
tags:
  - supervisor
  - 工程化
categories:
  - 项目实践
date: 2016-11-10 13:26:19
toc: true
---

Supervisor 是基于 Python ，运行于 Unix-Like 系统的进程管理工具。

Supervisor 为需要以守护进程方式执行的程序提供了不错的管理方式，也能很友好的管理程序在命令行上输出的日志，将日志重定向到自定义的日志文件中，按文件大小对日志进行分割。

<!-- more -->

Supervisor 有两个主要的组成部分：
- `supervisord`，运行 Supervisor 时会启动一个进程 supervisord，负责启动所管理的进程，并将所管理的进程作为自己的子进程来启动，而且可以在所管理的进程出现崩溃时自动重启。
- `supervisorctl`，命令行管理工具，用来执行 stop、start、restart 等命令，实现对 supervisord 子进程进行管理。

## 安装

- 使用 pip install 安装 supervisor 程序

```
pip install supervisor
```

- 生成 supervisor 的运行配置文件

```
echo_supervisord_conf > /etc/supervisord.conf
```

## 配置文件说明

### 默认配置

默认的配置文件是下面这样的，但是这里有个坑需要注意，supervisord.pid 以及 supervisor.sock 是放在 /tmp 目录下，但是 /tmp 目录是存放临时文件，里面的文件是会被 Linux 系统删除的，一旦这些文件丢失，就无法再通过 supervisorctl 来执行 restart 和 stop 命令了，将只会得到 unix:///tmp/supervisor.sock 不存在的错误 。

```yaml
[unix_http_server]
;file=/tmp/supervisor.sock   ; (the path to the socket file)
;可以修改为 /var/run 目录，避免被系统删除
file=/var/run/supervisor.sock   ; (the path to the socket file)
;chmod=0700                 ; socket file mode (default 0700)
;chown=nobody:nogroup       ; socket file uid:gid owner
;username=user              ; (default is no username (open server))
;password=123               ; (default is no password (open server))

;[inet_http_server]         ; inet (TCP) server disabled by default
;port=127.0.0.1:9001        ; (ip_address:port specifier, *:port for ;all iface)
;username=user              ; (default is no username (open server))
;password=123               ; (default is no password (open server))
...

[supervisord]
;logfile=/tmp/supervisord.log ; (main log file;default $CWD/supervisord.log)
;可以修改为 /var/log 目录，避免被系统删除
logfile=/var/log/supervisor/supervisord.log ; (main log file;default $CWD/supervisord.log)
logfile_maxbytes=50MB        ; (max main logfile bytes b4 rotation;default 50MB)
logfile_backups=10           ; (num of main logfile rotation backups;default 10)
loglevel=info                ; (log level;default info; others: debug,warn,trace)
;pidfile=/tmp/supervisord.pid ; (supervisord pidfile;default supervisord.pid)
;修改为 /var/run 目录，避免被系统删除
pidfile=/var/run/supervisord.pid ; (supervisord pidfile;default supervisord.pid)
...
;设置启动supervisord的用户，一般情况下不要轻易用root用户来启动，除非你真的确定要这么做
;user=user                 ; (default is current user, required if root)
...

[supervisorctl]
; 必须和'unix_http_server'里面的设定匹配
;serverurl=unix:///tmp/supervisor.sock ; use a unix:// URL  for a unix socket
;修改为 /var/run 目录，避免被系统删除
serverurl=unix:///var/run/supervisor.sock ; use a unix:// URL  for a unix socket
;serverurl=http://127.0.0.1:9001 ; use an http:// url to specify an inet socket
;username=user              ; should be same as http_username if set
;password=123                ; should be same as http_password if set
...
```

### 使用浏览器来管理

supervisor 提供了通过浏览器来管理进程的方法，只需解开 `/etc/supervisord.conf` 如下几行的注释.

```
;[inet_http_server]         ; inet (TCP) server disabled by default
;port=127.0.0.1:9001        ; (ip_address:port specifier, *:port for ;all iface)
;username=user              ; (default is no username (open server))
;password=123               ; (default is no password (open server))

[supervisorctl]
...
;serverurl=http://127.0.0.1:9001 ; use an http:// url to specify an inet socket
;username=chris              ; should be same as http_username if set
;password=123                ; should be same as http_password if set
```

### 使用 include

在配置文件的最后，有一个 [include] 的配置项，跟 Nginx 一样，可以 include 某个文件夹下的所有配置文件，这样我们就可以为每个进程或相关的几个进程的配置单独写成一个文件。

```yaml
[include]
files = /etc/supervisord.d/*.conf
```

### 子进程配置

参照 `/etc/supervisord.conf` 中 program 配置进行子进程的配置

```yaml
;[program:theprogramname]
;command=/bin/cat              ; the program (relative uses PATH, can take ar\
gs)
;process_name=%(program_name)s ; process_name expr (default %(program_name)s)
;numprocs=1                    ; number of processes copies to start (def 1)
;directory=/tmp                ; directory to cwd to before exec (def no cwd)
;umask=022                     ; umask for process (default None)
;priority=999                  ; the relative start priority (default 999)
;autostart=true                ; start at supervisord start (default: true)
;startsecs=1                   ; # of secs prog must stay up to be running (d\
ef. 1)
;startretries=3                ; max # of serial start failures when starting\
 (default 3)
;autorestart=unexpected        ; when to restart if exited after running (def\
: unexpected)
```
## 启动 supervisord

执行 supervisord 命令，将会启动 supervisord 进程，同时我们在配置文件中设置的进程也会相应启动。

```yaml
# 使用默认的配置文件 /etc/supervisord.conf
supervisord
# 明确指定配置文件
supervisord -c /etc/supervisord.conf
```

## supervisorctl 命令介绍

```yaml
# 停止某一个进程，program_name 为 [program:x] 里的 x
supervisorctl stop program_name
# 启动某个进程
supervisorctl start program_name
# 重启某个进程
supervisorctl restart program_name
# 结束所有属于名为 groupworker 这个分组的进程 (start，restart 同理)
supervisorctl stop groupworker:
# 结束 groupworker:name1 这个进程 (start，restart 同理)
supervisorctl stop groupworker:name1
# 停止全部进程，注：start、restart、stop 都不会载入最新的配置文件
supervisorctl stop all
# 载入最新的配置文件，停止原有进程并按新的配置启动、管理所有进程
supervisorctl reload
# 根据最新的配置文件，启动新配置或有改动的进程，配置没有改动的进程不会受影响而重启
supervisorctl update
```