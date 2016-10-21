fis.set('project.fileType.text', 'html');
// 采用 commonjs 模块化方案。
fis.hook('commonjs', {
    extList: ['.js', '.jsx']
});


fis.match('{**.re.js,**.jsx}', {
    //parser: fis.plugin('typescript'),
    // typescript 就是编译速度会很快，但是对一些 es7 的语法不支持，可以用 babel 来解决。用以下内容换掉 typescript 的parser配置就好了。
     parser: fis.plugin('babel-5.x', {
         sourceMaps: true,
         optional: ["es7.decorators", "es7.classProperties"]
     }),
    rExt: '.js'
});

fis.match('*.html', {
    extras: {
        isPage: true
    }
});

// 改用 npm 方案，而不是用 fis-components
fis.unhook('components');
fis.hook('node_modules');

// 设置成是模块化 js
fis.match('/**.{js,jsx}', {
    isMod: true,
    release: '/static/$0'
});
// 设置成是模块化 js
fis.match('/**.{less,css}', {
    isMod: true,
    release: '/static/$0'
});

fis.match('/**.{png,gif,jpeg,jpg}', {
    isMod: true,
    release: '/static/$0'
});

// 设置成是模块化 js
fis.match('mod.js', {
    isMod: false
});

fis.match('server.conf', {
    release: '/config/server.conf'
});

fis.match('/**.{html,vm,jsp}', {
    isMod: true
});

fis.match('**.less', {
    rExt: '.css', // from .less to .css
    parser: fis.plugin('less-2.x', {
        // fis-parser-less-2.x option
    })
});

fis.match('::package', {
    packager: fis.plugin('map'),
    // npm install [-g] fis3-postpackager-loader
    // 分析 __RESOURCE_MAP__ 结构，来解决资源加载问题
    postpackager: fis.plugin('loader', {
        resourceType: 'commonJs',
        useInlineMap: true // 资源映射表内嵌
    })
});

// 请用 fis3 release production 来启用。
const production = fis.media('production');

production.match('::package', {
    packager: fis.plugin('map'),
    // 分析 __RESOURCE_MAP__ 结构，来解决资源加载问题
    postpackager: fis.plugin('loader', {
        resourceType: 'commonJs',
        allInOne: true, // 零散资源包合并
        useInlineMap: true // 资源映射表内嵌
    })
}).match('*.js', {
    optimizer: fis.plugin('uglify-js')
}).match('**.{css,less}', {
    optimizer: fis.plugin('clean-css')
}).match('/**.{html,vm,jsp}', {
    isMod: true,
    release: '/WEB-INF/views/$0'
});

['docs/**', '**.sh', '/test/**', '**.json', '**.md', '/package.json', '/server.conf'].forEach(function (key) {
    production.match(key, {
        release: false
    });
});
