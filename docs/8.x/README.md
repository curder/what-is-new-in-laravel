---
sidebarDepth: 3
sidebar: auto
---


# 8.x

[Laravel 8](https://laravel.com/docs/8.x/releases) 是在 2022-09-08 发布并包含许多新功能。

其中包含许多新功能，包括 [Laravel Jetstream](#laravel-jetstream)、[模型目录](#models-directory)、[控制器路由命名空间](#controllers-routing-namespacing)、[路由缓存](#route-caching)、[匿名事件监听器队列](#queueable-anonymous-event-listeners)、[模型工厂类](#model-factory-classes)、[迁移压缩](#migration-squashing)、[限速改进](#improved-rate-limiting)、[时间测试助手](#time-testing-helpers)、[动态模版组件](#dynamic-blade-components)、[维护模式](#maintenance-mode-secrets)、[基于闭包的事件监听器](#cleaner-closure-based-event-listeners)、[Closure Dispatch “Catch”](#closure-dispatch-catch)、[Backoff Strategy](#backoff-strategy)和 [Laravel Sail](#laravel-sail)，以及更多功能。

<a name="laravel-jetstream"></a>
## Laravel Jetstream

[Laravel Jetstream](https://github.com/laravel/jetstream) 改进了之前版本中现有的 Laravel UI 脚手架。 

它为新项目提供了一个起点，包括登录、注册、电子邮件验证、双重身份验证、会话管理、通过 Laravel 提供的 API 支持和团队管理。

```bash
php artisan jetstream:install livewire
php artisan jetstream:install inertia
```

<a name="models-directory"></a>
## 模型目录

Laravel 8 的应用程序框架包含一个 `app/Models` 目录。

所有生成器命令都假定模型存在于 `app/Models` 中； 但是，如果此目录不存在，则框架将假定应用程序将模型保存在 `app/` 文件夹中（生成的模型文件路径将保持跟之前一致，在 `app/` 目录下）。


<a name="controllers-routing-namespacing"></a>
## 控制器路由命名空间

在之前的 Laravel 版本中，RouteServiceProvider 有一个名为 namespace 的属性，用于为路由文件中的控制器添加前缀。

当尝试在控制器上使用可调用语法时，这会产生问题，导致 Laravel 错误地为您添加双类命名空间前缀。

此属性已被删除，现在可以毫无问题地导入和使用它。

它也可以用于具有 `__invoke` 方法的[单处理方法的控制器](https://laravel.com/docs/8.x/controllers#single-action-controllers)。

```php
Route::get('/test', [TestsController::class, 'index'])->name('test');

Route::get('/test', TestsController::class);
```


<a name="route-caching"></a>
## 路由缓存 

Laravel 使用路由缓存将您的路由编译到一个 PHP 数组中，这样可以更有效地处理。

在 Laravel 8 中，即使将闭包作为路由的操作，也可以使用此功能。 这应该扩展路由缓存的使用以提高性能。

```php
Route::get('/components', function() {
    return view('button');
});
```


<a name="queueable-anonymous-event-listeners"></a>
## 匿名事件监听器队列

在 Laravel 8 中，可以从代码中的任何位置创建可排队的闭包。

这将创建一个匿名事件侦听器队列，这些侦听器将在后台执行。

此功能使执行此操作更容易，而在以前的 Laravel 版本中，您需要使用事件类和事件侦听器（使用 ShouldQueue 特征）。

```php{8}
<?php
namespace App\Models;
use function Illuminate\Events\queueable;
class User extends Authenticatable
{
    protected static function booting()
    {
        static::created(queueable(function (User $user) {
            logger('Oueued:' . $user-›name);
        }));
    }
}
```


<a name="model-factory-classes"></a>
## 模型工厂类 

从 Laravel 8 开始，Eloquent 模型工厂现在是基于类的，改进了对工厂之间关系的支持（即，一个用户有很多帖子）。

对于每个模型，还有一个工厂类，其中有一个定义方法，说明它将为该模型生成哪些属性。 而模型通过 `\Illuminate\Database\Eloquent\Factories\HasFactory` 特征使用该工厂。

并且默认不支持 `factory()` 函数的调用，

### 模型工厂类定义

```php {49-54}
<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class UserFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = User::class;

    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        return [
            'name' => $this->faker->name,
            'email' => $this->faker->unique()->safeEmail,
            'email_verified_at' => now(),
            'password' => '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password
            'remember_token' => Str::random(10),
            'is_suspended' => false,
        ];
    }

    /**
     * Indicate that the model's email address should be unverified.
     *
     * @return \Illuminate\Database\Eloquent\Factories\Factory
     */
    public function unverified()
    {
        return $this->state(function (array $attributes) {
            return [
                'email_verified_at' => null,
            ];
        });
    }
    
    public function suspended()
    {
        return $this->state([
            'is_suspended' => true,
        ])       
    }
}

```

### 使用模型工厂
```php
use App\Models\User;
 
User::factory()->count(50)->make();
 
// using a model state "suspended" defined within the factory class
User::factory()->count(5)->suspended()->create();
```

### 模型工厂关联关系

假定使用最常见的一个用户可以发布多个文章，一篇文章属于一个用户的模型关系，相关定义如下：

<CodeGroup>
  <CodeGroupItem title="User 模型">

```php {17-20}
<?php

namespace App\Models;

use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    use HasFactory, Notifiable;

    // ...

    // 定义关联关系
    public function posts()
    {
        return $this->hasMany(Post::class);
    }
}

```

  </CodeGroupItem>

  <CodeGroupItem title="Post 模型">

```php {13-16}
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Post extends Model
{
    use HasFactory;

    // Post 模型 定义关联关系
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}

```

  </CodeGroupItem>

  <CodeGroupItem title="post迁移文件">

```php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreatePostsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('posts', function (Blueprint $table) {
            $table->id();
            $table->foreignIdFor(\App\Models\User::class);
            $table->string('title');
            $table->text('body');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('posts');
    }
}
```

  </CodeGroupItem>

  <CodeGroupItem title="Post工厂文件">

```php
<?php

namespace Database\Factories;

use App\Models\Post;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class PostFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = Post::class;

    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        return [
            'user_id' => User::factory(),
            'title' => $this->faker->sentence(),
            'body' => $this->faker->paragraph(),
        ];
    }
}
```

  </CodeGroupItem>

</CodeGroup>


上面的定义后，可以通过下面的关联关系来创建数据：
```php
use App\Models\{User,Post};
// has* 通过 User 模型创建 Post 模型数据
User::factory()->has(Post::factory())->create(); // 创建1个User模型对应的同时关联创建1个Post模型对象数据
User::factory()->hasPosts()->create(); // 上面方式的简写，创建1个User模型对应的同时关联创建1个Post模型对象数据

User::factory()->has(Post::factory()->count(5))->create(); // 创建1个User模型对象的同时关联创建5个Post模型对象数据
User::factory()->hasPosts(5)->create(); // 上面方式的简写，创建1个User模型对象的同时关联创建5个Post模型对象数据
 
// for* 通过 Post 模型创建 User 模型数据
Post::factory()->for(User::factory())->create(); // 创建1个Post模型对应的同时关联创建1个User模型对象数据
Post::factory()->forUser()->create(); // 上面方式的简写，创建1个Post模型对应的同时关联创建1个User模型对象数据

Post::factory()->for(User::factory())->count(5)->create(); // 创建5个Post模型对应的同时关联创建1个User模型对象数据
Post::factory()->forUser()->count(5)->create(); // 上面方式的简写，创建5个Post模型对应的同时关联创建1个User模型对象数据
```


<a name="migration-squashing"></a>
## 压缩迁移文件

如果应用程序包含许多迁移文件，现在可以将它们压缩到单个 SQL 文件中。

该文件将在运行迁移时首先执行，然后是不属于压缩文件的任何剩余迁移文件。

压缩现有迁移可以减少迁移文件膨胀，并可能在运行测试时提高性能。

- 压缩迁移文件
```bash
php artisan schema:dump
```
> 通过上面的命令可以将现有迁移文件压缩成一个SQL文件`database/schema/mysql-schema.dump`。

- 压缩迁移文件并删除迁移文件
```bash
php artisan schema:dump --prune 
```


<a name="improved-rate-limiting"></a>
## 限速改进

Laravel 8 对现有速率限制功能进行了改进，同时支持与现有油门中间件的向后兼容性并提供更大的灵活性。 

Laravel 8 具有速率限制器的概念，可以通过 Facades 定义：

```php
// app/Providers/RouteServiceProvider 
use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Support\Facades\RateLimiter;
 
RateLimiter::for('global', function (Request $request) {
    return Limit::perMinute(1000);
});

RateLimiter::for('downloads', function(Request $request) {
    return $request->user()->isForever()
        ? Limit::none()
        : Limit::perMinute(30);
});
```

`for()` 方法采用 HTTP 请求实例，可以完全控制动态限制请求。

- 使用
```php {3,9}
// 在 app/Kernel.php 中配置
'api' => [
    'throttle:api',
    \Illuminate\Routing\Middleware\SubstituteBindings::class,
],
 
// 在路由中使用 
Route::get('/downloads', fn () => 'Downloads...')
    ->middleware(['throttle:downloads']);
```


<a name="time-testing-helpers"></a>
## 时间测试助手

Laravel 用户可以通过出色的 Carbon PHP 库完全控制时间修改。

Laravel 8 通过提供方便的测试助手来操纵测试中的时间，更进一步：

### 将时间设置到未来

```php
$this->travel(5)->milliseconds(); // 5毫秒后
$this->travel(5)->seconds(); // 5秒后
$this->travel(5)->minutes(); // 5分后
$this->travel(5)->hours(); // 5小时后
$this->travel(5)->days(); // 5天后
$this->travel(5)->weeks(); // 5星期后
$this->travel(5)->years(); // 5年后
````

### 将时间设置到过去

```php
$this->travel(-5)->milliseconds(); // 5毫秒前
$this->travel(-5)->seconds(); // 5秒前
$this->travel(-5)->minutes(); // 5分前
$this->travel(-5)->hours(); // 5小时前
$this->travel(-5)->days(); // 5天前
$this->travel(-5)->weeks(); // 5星期前
$this->travel(-5)->years(); // 5年前
```
 
### 将时间设置到准确的时间

```php
$this->travelTo(now()->subHours(6)); // 6个月前
```
 
### 将时间设置到现在

```php
$this->travelBack(); // now() 当前时间
```

使用这些方法时，每次测试之间的时间都会重置。


<a name="dynamic-blade-components"></a>
## 动态模版组件

有时需要在运行时动态渲染模版组件。 

Laravel 8 提供了 `<x-dynamic-component/>` 来渲染组件：

```php
<x-dynamic-component :component="$componentName" class="mt-4" />
```

<a name="maintenance-mode-secrets"></a>
## 维护模式

Laravel的维护模式特征在Laravel 8.x中得到了改进。

现在支持预渲染维护模式模板，并消除在维护模式期间遇到错误而反馈给用户。

```bash
php artisan down --secret=curder # 配置对应的密匙，执行命令后再访问 https://laravel8.test/curder 会允许正常访问，否则返回 503

php artisan down --render # 默认返回503
php artisan down --render="maintenance" # 也可以接受返回自定义视图，自定义视图在`resources/views/maintenance.blade.php`
```

<a name="cleaner-closure-based-event-listeners"></a>
## 基于闭包的事件监听器 

在之前的 Laravel 版本中，当创建一个基于闭包的事件监听器时，会有很多重复和繁琐的语法。

```php
use Illuminate\Support\Facades\Event;

Event::listen(ConferenceScheduled::class, function(ConferenceScheduled $event) {
    dd(get_class($event));
});
```

在 Laravel 8 中它更简单、更干净

```php
Event::listen(function(ConferenceScheduled $event) {
    dd(get_class($event));
});

// 使用箭头函数
Event::listen(fn (ConferenceScheduled $event) => dd(get_class($event)));
```
                           
<a name="closure-dispatch-catch"></a>
## Closure Dispatch “Catch”

Laravel 有一个非常健壮的队列系统，它接受一个将在后台序列化和执行的闭包队列。

现在有一种方法来处理失败，以防闭包中逻辑执行失败。

```php
Route::get('/queue-catch', function () {
    dispatch(function () {
        throw new Exception('Something went wrong...');
    })->catch(function () {
        logger('Caught dispatch exception from /queue-catch uri');
    });
});
```

<a name="backoff-strategy"></a>
## 重试策略

可以降低工作速度，以便逐渐找到可接受的速度。

现在 Laravel 也有了这个功能，这对于处理外部 API 的工作来说很方便，不想在相同的时间内再试一次。

也可以用来动态生成返回数组，设置不同的等待时间再重试。

```php
/**
* Calculate the number of seconds to wait before retrying the job.
*
* @return array
*/
public function backoff()
{
    return [1, 5, 10];
}
```

<a name="job-batching"></a>
## 任务批处理

当所有任务完成或执行有任何错误时，也很容易得到通知。 

```php
Bus::batch([
    new LoadImportBatch,
    new LoadImportBatch,
    new LoadImportBatch,
])->then(function (Batch $batch) {
    // All jobs completed successfully...
})->catch(function(Batch $batch) {
    // First jon failure detected
})->finnal(function(Batch $batch) {
    // All jobs have finished executing
})->name('Import Contacts')->dispatch();
```

可以查看添加此功能的 [PR](https://github.com/laravel/framework/pull/32830) 的更多详细信息。


<a name="laravel-sail"></a>
## [Laravel Sail](https://laravel.com/docs/8.x/sail)
