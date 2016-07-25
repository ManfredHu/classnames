Classnames
===========

[![Version](http://img.shields.io/npm/v/classnames.svg)](https://www.npmjs.org/package/classnames)
[![Build Status](https://travis-ci.org/JedWatson/classnames.svg?branch=master)](https://travis-ci.org/JedWatson/classnames)

一个简单的用来处理有判断状态的classNames的javascript小工具

npm or Bower.

```sh
npm install classnames
```

node.js, browserify or webpack:

```js
var classNames = require('classnames');
classNames('foo', 'bar'); // => 'foo bar'
```

可以把 `index.js` 问价加到页面的 `<script>` 标签，它会暴露一个全局的 `classNames` 方法, 或者是定义一个 `classNames`模块

### 不同的地方
这个是修改后的版本，用在手Q和微信的时候发现安卓WebView不识别ES6的动态key的语法

```javascript
render: function() {
            var userChartText = this.props.userChartText;
            var list = userChartText.map(function(item,index){
                var textCss = cl({
                    'usercenter-chat-label':true,
                    ['usercenter-chat-label__'+(index+1)]:true //error!!
                });
                return (
                    <li className={textCss} key={index}>{item}</li>
                )
            },this);

            return (
                <div className="usercenter-chat">
                    <canvas className="usercenter-chat-canvas" id="myChart" width="130" height="130"></canvas>
                    <ul>
                        {list}
                    </ul>
                    <a href="javascript:;" className="usercenter-chat-q" data-pe="tap:center.showMask">
                        <i className="icon-game icon-game-question"></i>
                    </a>
                </div>

            )
        }
```

so,we change the classnames module and add three arguments——@1,@2,@3

```javascript
render: function() {
            var userChartText = this.props.userChartText;
            var list = userChartText.map(function(item,index){
                var textCss = cl({
                    'usercenter-chat-label':true,
                    'usercenter-chat-label__@1':true, //like a function,but it can work perfectly!!
                    '@1': index+1 //like pass a argument.
                });
                return (
                    <li className={textCss} key={index}>{item}</li>
                )
            },this);

            return (
                <div className="usercenter-chat">
                    <canvas className="usercenter-chat-canvas" id="myChart" width="130" height="130"></canvas>
                    <ul>
                        {list}
                    </ul>
                    <a href="javascript:;" className="usercenter-chat-q" data-pe="tap:center.showMask">
                        <i className="icon-game icon-game-question"></i>
                    </a>
                </div>

            )
        }
```
### 项目理念

We take the stability and performance of this package seriously, because it is run millions of times a day in browsers all around the world. Updates are thoroughly reviewed for performance impacts before being released, and we have a comprehensive test suite.

Classnames follows the [SemVer](http://semver.org/) standard for versioning.

There is also a [Changelog](https://github.com/JedWatson/classnames/blob/master/HISTORY.md).

## 用法

`classNames` 函数接受任意长度的string或object参数传入
参数 `'foo'` 是作为 `{ foo: true }` 的键，参数如果值为假值，包括 `false/0/null/undefined/''` 等，则不会被作为输出

```js
classNames('foo', 'bar'); // => 'foo bar'
classNames('foo', { bar: true }); // => 'foo bar'
classNames({ 'foo-bar': true }); // => 'foo-bar'
classNames({ 'foo-bar': false }); // => ''
classNames({ foo: true }, { bar: true }); // => 'foo bar'
classNames({ foo: true, bar: true }); // => 'foo bar'

// lots of arguments of various types
classNames('foo', { bar: true, duck: false }, 'baz', { quux: true }); // => 'foo bar baz quux'

// other falsy values are just ignored
classNames(null, false, 'bar', undefined, 0, 1, { baz: null }, ''); // => 'bar 1'
```

Arrays will be recursively flattened as per the rules above:

```js
var arr = ['b', { c: true, d: false }];
classNames('a', arr); // => 'a b c'
```

### Dynamic class names with ES2015

如果你的项目支持**计算的键** [computed keys](http://www.ecma-international.org/ecma-262/6.0/#sec-object-initializer) (available in ES2015 and Babel) 你可以动态的使用 class names

**ps:通常键/值对的键是不能动态变化的，React老版本会出错**

```js
let buttonType = 'primary';
classNames({ [`btn-${buttonType}`]: true });
```

### 在 React.js 中的使用

这个东东是官方御用的替代 `classSet` 的东西，`classSet` 就是老的 React.js Addons bundle.（不懂得可以忽略这一句，React v0.14还能找到这货）

一个简单的例子，在React中要通过状态判断className的时候，你会用的是字符串拼接的方法，这样不优雅-_-!!

```js
var Button = React.createClass({
  // ...
  render () {
    var btnClass = 'btn';
    if (this.state.isPressed) btnClass += ' btn-pressed';
    else if (this.state.isHovered) btnClass += ' btn-over';
    return <button className={btnClass}>{this.props.label}</button>;
  }
});
```

你可以用classnames来让代码可读性更高点，也不用老是if/else地判断

```js
var classNames = require('classnames');

var Button = React.createClass({
  // ...
  render () {
    var btnClass = classNames({
      'btn': true,
      'btn-pressed': this.state.isPressed,
      'btn-over': !this.state.isPressed && this.state.isHovered
    });
    return <button className={btnClass}>{this.props.label}</button>;
  }
});
```

因为你可以合并对象的属性（包括数组，字符串参数）到一起输出，则值为真的键会被加入到输出结果上：

```js
var btnClass = classNames('btn', this.props.className, {
  'btn-pressed': this.state.isPressed,
  'btn-over': !this.state.isPressed && this.state.isHovered
});
```

### `dedupe` 版本

这个版本的可以正确处理重复迭代属性以及属性覆盖的特别的情况，当然因为有迭代和判断的原因会与上面的版本存在性能上的区别，通常是5倍差异。这个版本的慢点。

To use the dedupe version with node, browserify or webpack:

```js
var classNames = require('classnames/dedupe');

classNames('foo', 'foo', 'bar'); // => 'foo bar'
classNames('foo', { foo: false, bar: true }); // => 'bar'
```

For standalone (global / AMD) use, include `dedupe.js` in a `<script>` tag on your page.


### `bind` 版本 (for [css-modules](https://github.com/css-modules/css-modules))

如果您使用[css-modules](https://github.com/css-modules/css-modules),或类似的方法,抽象类“名称”和真正的className DOM实际输出值,您可能需要使用绑定变量。

_注意,在ES2015环境中,它可能是更好的使用上面的“动态类名”的方法记录。_

```js
var classNames = require('classnames/bind');

var styles = {
  foo: 'abc',
  bar: 'def',
  baz: 'xyz'
};

var cx = classNames.bind(styles);

var className = cx('foo', ['bar'], { baz: true }); // => "abc def xyz"
```

Real-world example:

```js
/* components/submit-button.js */
import { Component } from 'react';
import classNames from 'classnames/bind';
import styles from './submit-button.css';

let cx = classNames.bind(styles);

export default class SubmitButton extends Component {
  render () {
    let text = this.props.store.submissionInProgress ? 'Processing...' : 'Submit';
    let className = cx({
      base: true,
      inProgress: this.props.store.submissionInProgress,
      error: this.props.store.errorOccurred,
      disabled: this.props.form.valid,
    });
    return <button className={className}>{text}</button>;
  }
};

```


## Polyfills needed to support older browsers

#### `classNames >=2.0.0`

`Array.isArray`: see [MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/isArray) for details about unsupported older browsers (e.g. <= IE8) and a simple polyfill.

`Object.keys`: see [MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/keys) for details about unsupported older browsers (e.g. <= IE8) and a simple polyfill. This is only used in `dedupe.js`.

## License

[MIT](LICENSE). Copyright (c) 2016 Jed Watson.
