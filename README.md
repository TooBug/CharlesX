# CharlesX

HTTP/HTTPS代理工具，类似Charles、Fiddler。

## 特性

- 支持HTTP/HTTPS代理
- 支持自定义hosts

## 安装

```sh
npm install -g charlesx
```

## 使用

```sh
# 以默认端口8888启动
charlesx

# 以端口9999启动
charlesx -p 9999

# 自定义hosts
charlesx -s www.toobug.net=127.0.0.1 -s toobug.net=127.0.0.1
```


## TODO

- [ ] GUI
- [x] 自定义hosts
- [ ] 本地文件替换
- [ ] 查看请求和响应内容
- [ ] HTTPS解码

## History

### 1.1.2/1.1.1 2016-09-14

- 兼容Node低版本

### 1.1.0 2016-08-27

- 支持自定义hosts
- 代理出错时返回错误信息

### 1.0.0 2016-08-27

- 支持HTTP/HTTPS代理