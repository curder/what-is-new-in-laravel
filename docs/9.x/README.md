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

有时可能需要将原始 Blade 模板字符串转换为有效的 HTML。

可以使用 Blade 门面提供的 `render` 方法来完成此操作。 

`render` 方法接受 Blade 模板字符串和提供给模板的可选数据数组：

```php
use Illuminate\Support\Facades\Blade;
 
return Blade::render('Hello, {{ $name }}', ['name' => 'Curder']); // 输出为：Hello, Curder
```


<a name="forced-scoped-bindings"></a>
## 强制范围绑定
 
在 Laravel 9.x 之前的版本中，可能希望在路由定义中限定第二个 Eloquent 模型，使其必须是之前 Eloquent 模型的子模型。 

例如，考虑这个通过 slug 为特定用户检索博客文章的路由定义：

```php
use App\Models\Post;
use App\Models\User;
 
Route::get('/users/{user}/posts/{post:slug}', function (User $user, Post $post) {
    return $post;
});
```

当使用自定义的隐式绑定作为嵌套路由参数时，Laravel 将自动限定查询范围以通过其父级检索嵌套模型，使用约定来猜测父级上的关系名称。 

但是，当自定义键用于子路由绑定时，Laravel 之前仅支持此行为。

然而，在 Laravel 9.x 中，即使没有提供自定义键，现在也可以指示 Laravel 限定“子”绑定。

为此，可以在定义路由时调用 `scopeBindings` 方法：
                                            
```php {6}
use App\Models\Post;
use App\Models\User;
 
Route::get('/users/{user}/posts/{post}', function (User $user, Post $post) {
    return $post; // 这里获取的文章必须是用户所属文章
})->scopeBindings();
```

或者，可以指定整个路由定义组使用范围绑定：

```php {1}
Route::scopeBindings()->group(function () {
    Route::get('/users/{user}/posts/{post}', function (User $user, Post $post) {
        return $post;
    });
});
```

<a name="test-coverage-report"></a>
## 测试覆盖率报告

一个新的 `artisan test --coverage` 选项将直接在终端上显示测试覆盖率。

它还包括一个 `--min` 选项，可以使用它来指示测试覆盖率的最小阈值强制执行。

> **注意：** 需要开启 xdebug

执行测试覆盖率命令

```bash
XDEBUG_MODE=coverage php artisan test --coverage
```

![测试覆盖率报告](/images/9.x/new-test-coverage-report.png)


<a name="laravel-scout-database-engine"></a>
## [Scout搜索数据库驱动](https://laravel.com/docs/9.x/scout#database-engine)

如果应用程序与中小型数据库交互或工作负载较轻，现在可以使用 Scout 的“数据库”引擎，而不是 Algolia 或 MeiliSerach 等专用搜索服务。

数据库引擎将在过滤现有数据库的结果时使用“where like”子句和全文索引，以确定查询的适用搜索结果。

值得注意的是，当前数据库驱动仅支持 `MySQL` 和 `PostgreSQL`。

- 配置驱动

在 `config/scote.php` 文件中定义了数据库检索驱动，默认为 `algolia`。 可以在 `.env` 文件中定义为：`database`

```dotenv
SCOUT_DRIVER=database
```

- 数据库定义

```php
// 引用搜索trait
use Laravel\Scout\Searchable; 

// 定义检索的字段映射关系
/**
 * Get the indexable data array for the model.
 *
 * @return array
 */
public function toSearchableArray()
{
    return [
        'description' => $this->description,
        'body' => $this->body,
    ];
}
```
                 
- 使用

```php
use App\Models\Post;

Post::search('illumn')->get();
```
                 
> 更多相关使用，可以查看 [laravel/scout 官方文档](https://laravel.com/docs/9.x/scout)

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


