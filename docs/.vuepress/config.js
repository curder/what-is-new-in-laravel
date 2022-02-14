module.exports = {
    base: "/what-is-new-in-laravel/",
    lang: 'zh-CN',
    title: 'What\'s New in Laravel',
    description: '记录 Laravel 发布稳定版本更新的新特性',
    themeConfig: {
        editLinks: true,
        docsBranch: 'master',
        docsDir: 'docs',
        editLinkPattern: ':repo/-/edit/:branch/:path',
        lastUpdated: true,
        lastUpdatedText: '最后更新时间',
        contributors: true,
        contributorsText: '贡献者列表',
        navbar: [
            {text: 'Home', link: '/'},
            {
                text: "Version",
                children: [
                    {text: 'Laravel 8.x', link: '/8.x'},
                    {text: 'Laravel 9.x', link: '/9.x'},
                ],
            },

        ],
        sidebar: {
            //
        },
    }
}
