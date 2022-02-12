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
// Laravel 9.x 版本
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
// Laravel 8.x 或之前版本
use App\Http\Controllers\PostsController;

Route::get('posts', [PostsController::class, 'index']); // 文章列表
Route::get('posts/{post}', [PostsController::class, 'show']); // 展示文章详情
Route::post('posts', [PostsController::class, 'store']); // 保存文章
```

  </CodeGroupItem>

</CodeGroup>

<a name="new-design-for-route-list-command-output"></a>
## 新的路由列表命令输出结果

在之前版本中，当拥有众多路由定义的话，使用 `route:list` 命令会使得输出不易读。

![新的路由列表命令输出结果](/images/9.x/new-design-for-route-list-command-output.png)

 
<a name="anonymous-stub-migrations"></a>
## 匿名迁移类

Laravel 8.37 时推出了一个名为匿名迁移类的新功能，可以防止迁移类名称冲突。

在 Laravel 9.x 项目中运行 `php artisan make:migration` 时的默认设置。

```php {7}
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    // ...
};
```


<a name="new-str-and-to-router-helper-functions"></a>
## 新 [`str()`](https://laravel.com/docs/9.x/helpers#strings-method-list) 和 `to_route()` 函数

由于 PHP 8 将是Laravel支持的最低版本，[Tom Schlick](https://github.com/laravel/framework/pull/38011) 提交了一个 PR，在 `\Illuminate\Support\Str` 类内部使用 `str_contains()`、`str_starts_with()` 和 `str_ends_with()` 函数。
                                                   
- Laravel 9.x
```php
// str
str('hello world')->upper(); // 输出为：HELLO WORLD
str('hello world')->append(' and anything else. ');  // 输出为：hello world and anything else.

// to_route
to_route('index'); // 跳转到路由命名为 index 的地址
```

- Laravel 8.x 或之前版本

```php
use Illuminate\Support\Str;
// Str
Str::of('hello world')->upper(); // 输出为：HELLO WORLD
Str::of('hello world')->append(' and anything else.'); // 输出为：hello world and anything else.

// redirect
redirect()->route('index');  // 跳转到路由命名为 index 的地址
```
       
<a name="improved-ignition-error-page"></a>
## 新的错误页面

Spatie 创建的开源异常调试页面 [ignition](https://github.com/spatie/ignition) 已经从头开始重新设计。

更加优雅的错误页面随 Laravel 9.x 一起提供，包括浅色/深色主题、可定制的“在编辑器中打开”功能等等。

![新的错误页面](/images/9.x/improved-ignition-exception-page.png)                                            
   
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


