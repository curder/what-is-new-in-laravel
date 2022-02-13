---
sidebarDepth: 3
sidebar: auto
---


# 8.x

[Laravel 8](https://laravel.com/docs/8.x/releases) 是在 2022-09-08 发布并包含许多新功能。

其中包含许多新功能，包括 [Laravel Jetstream](#laravel-jetstream)、[模型目录](#models-directory)、[模型工厂类](#model-factory-classes)、[迁移压缩](#migration-squashing)、[限速改进](#improved-rate-limiting)、[时间测试助手](#time-testing-helpers)、[动态模版组件](#dynamic-blade-components)、[维护模式](#maintenance-mode-secrets)、[基于闭包的事件监听器](#cleaner-closure-based-event-listeners)和 [Laravel Sail](#laravel-sail)，以及更多功能。

<a name="laravel-jetstream"></a>
## Laravel Jetstream


<a name="models-directory"></a>
## 模型目录

Laravel 8 的应用程序框架包含一个 `app/Models` 目录。

所有生成器命令都假定模型存在于 `app/Models` 中； 但是，如果此目录不存在，则框架将假定应用程序将模型保存在 `app/` 文件夹中（生成的模型文件路径将保持跟之前一致，在 `app/` 目录下）。

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


<a name="time-testing-helpers"></a>
## 时间测试助手


<a name="dynamic-blade-components"></a>
## 动态模版组件


<a name="maintenance-mode-secrets"></a>
## 维护模式


<a name="cleaner-closure-based-event-listeners"></a>
## 基于闭包的事件监听器 


<a name="laravel-sail"></a>
## Laravel Sail 

