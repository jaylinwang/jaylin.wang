---
title: 单选框和复选框与文本的垂直居中显示问题
tags:
  - html
  - css
categories:
  - web前端
toc: false
date: 2017-11-04 11:19:10
---

## 前言

工作三年，写了不少代码，也确实接触不少技术。但是仔细回顾，却又感一片空白，一脸茫然。故尝试揣摩业界大牛的一些历程，希望能得到不一样的收获。

张鑫旭前辈的博客是很不错的选择之一，对 html、css、jquery 这些基本技能阐述得十分透彻。本文是对其很早一篇文章[复选框或单选框与文字对齐的问题的深入研究](http://www.zhangxinxu.com/wordpress/2009/08/%E5%A4%8D%E9%80%89%E6%A1%86%E6%88%96%E5%8D%95%E9%80%89%E6%A1%86%E4%B8%8E%E6%96%87%E5%AD%97%E5%AF%B9%E9%BD%90%E7%9A%84%E9%97%AE%E9%A2%98%E7%9A%84%E6%B7%B1%E5%85%A5%E7%A0%94%E7%A9%B6%E4%B8%8E%E4%B8%80/)的再次实验，毕竟浏览器对css、html的支持多年来变化很大。

<!-- more -->

## 单选框/复选框与文本当前的表现

使用最新浏览器测试，在字体小于浏览器默认字体大小时，chrome、safari、firefox默认已经能够居中对齐了，ie和edge这对难兄难弟依旧出现了差强人意的效果，文字的位置偏下了：

![ie8对比效果](http://jaylinwang.oss-cn-beijing.aliyuncs.com/2017/radio-and-checkbox-with-text/compare_ie8.jpg)
![edge对比效果](http://jaylinwang.oss-cn-beijing.aliyuncs.com/2017/radio-and-checkbox-with-text/compare_edge.jpg)
![chrome对比效果](http://jaylinwang.oss-cn-beijing.aliyuncs.com/2017/radio-and-checkbox-with-text/compare_chrome.jpg)
![firefox对比效果](http://jaylinwang.oss-cn-beijing.aliyuncs.com/2017/radio-and-checkbox-with-text/compare_firefox.jpg)
![safari对比效果](http://jaylinwang.oss-cn-beijing.aliyuncs.com/2017/radio-and-checkbox-with-text/compare_safari.jpg)

## 修复

测试了原文中的方法，目前以`vertical-align:middle`表现最佳，其他方法在调整个别参数后也可达到效果，现整理了三个方法

1. 以`vertical-align:middle`为基础

  - 代码:

  ```css
    input{vertical-align: middle;margin-top: -3px;margin-bottom: 0px;}
  ```

  - 效果

  ![方法1-ie8-效果](http://jaylinwang.oss-cn-beijing.aliyuncs.com/2017/radio-and-checkbox-with-text/s1_ie8.jpg)
  ![方法1-chrome-效果](http://jaylinwang.oss-cn-beijing.aliyuncs.com/2017/radio-and-checkbox-with-text/s1_chrome.jpg)

2. 以`vertical-align:text-top`为基础

  - 代码:

  ```css
    input{height:13px;vertical-align:text-top;margin-top: 2px;padding-top: 0;}
  ```

  - 效果

  ![方法2-ie8-效果](http://jaylinwang.oss-cn-beijing.aliyuncs.com/2017/radio-and-checkbox-with-text/s2_ie8.jpg)
  ![方法2-chrome-效果](http://jaylinwang.oss-cn-beijing.aliyuncs.com/2017/radio-and-checkbox-with-text/s2_chrome.jpg)

3. 新增包裹元素

  - 代码:

  ```css
    input{vertical-align: middle;}
    span{display: inline-block;vertical-align:middle;line-height: 1.5;}
  ```

  - 效果

  ![方法3-ie8-效果](http://jaylinwang.oss-cn-beijing.aliyuncs.com/2017/radio-and-checkbox-with-text/s3_ie8.jpg)
  ![方法3-chrome-效果](http://jaylinwang.oss-cn-beijing.aliyuncs.com/2017/radio-and-checkbox-with-text/s3_chrome.jpg)

点击查看[示例效果](http://jaylin.wang/demo/checkbox-text-vertical-aligin/)

## 拓展知识

- 经过测试、IE（ie8+）、edge、chrome、safari默认字体大小为16px，firefox默认字体大小为15px

- checkbox和radio在不同浏览器下有不同的样式: ie为`height: 13px;width: 13px; padding:3px`; edge为`height:13px;width:13px;margin:3px 3px 3px 4px;`; chrome为`height:12px;width:12px;margin: 3px 2.895px;`;firefox为`height:9px;width:9px;border-width:2px;margin:3px 3px 3px 4px;`;safari为`heigth:12px;weight:12px;margin:3px 2px;`。

