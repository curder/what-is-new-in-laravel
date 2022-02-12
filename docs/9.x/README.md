---
sidebarDepth: 3
sidebar: auto
---

# 9.x

[Laravel 9](https://laravel.com/docs/9.x/releases) 是在 2022-02-08 发布并包含许多新功能，包括最低 [PHP v8.0](https://www.php.net/releases/8.0/zh.php) 版本、控制器路由组、刷新的默认 Ignition 错误页面、Laravel Scout 数据库引擎、Symfony 邮件集成、Flysystem 3.x、改进的 Eloquent 访问器/修改器 ，以及更多功能。

<a name="controller-route-group"></a>
## 控制器路由组

新版本的Laravel项目中可以使用控制器方法为组内的所有路由定义公共控制器。 

然后，在定义路由时，只需要提供它们调用的控制器方法：

<CodeGroup>
  <CodeGroupItem title="Laravel 9.x 版本">

```php
use App\Http\Controllers\PostsController;

Route::controller(PostsController::class)->group(function () {
    Route::get('posts', 'index'); // 文章列表
    Route::get('posts/{post}', 'show'); // 展示文章详情
    Route::post('posts', 'store'); // 保存文章
});
```

  </CodeGroupItem>

  <CodeGroupItem title="Laravel 8.x 或之前版本">

```php
use App\Http\Controllers\PostsController;

Route::get('posts', [PostsController::class, 'index']); // 文章列表
Route::get('posts/{post}', [PostsController::class, 'show']); // 展示文章详情
Route::post('posts', [PostsController::class, 'store']); // 保存文章
```

  </CodeGroupItem>

</CodeGroup>

<a name="new-design-for-routes:list"></a>
## 新的 `route:list` 命令输出结果
             
<a name="anonymous-stub-migrations"></a>
## 匿名迁移类
   
<a name="new-helper-functions"></a>
## 新助手函数
       
<a name="refreshed-ignition-error-page"></a>
## 新的错误页面
                                            
   
<a name="render-a-blade-string"></a>
## 渲染blade模版字符串
               
<a name="forced-scoped-bindings"></a>
## 强制范围绑定
   
<a name="test-coverage-report"></a>
## 测试覆盖率报告

<a name="laravel-scout-database-engine"></a>
## Scout搜索数据库驱动


<a name="full-text-indexing"></a>
## 全文索引


<a name="enum-attribute-casting"></a>
## 枚举属性转换


<a name="simplified-accessors-and-mutators"></a>
## 简化模型的访问器和修改器


<a name=""></a>
## 


<a name=""></a>
## 


