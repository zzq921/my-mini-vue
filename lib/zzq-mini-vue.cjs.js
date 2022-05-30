'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var extend = Object.assign;
var isObject = function (val) {
    return val !== null && typeof val === 'object';
};
var hasOwn = function (val, key) { return Object.prototype.hasOwnProperty.call(val, key); };
var capitalize = function (str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
};
var toHandlerKey = function (str) {
    return str ? "on" + capitalize(str) : "";
};
var camelize = function (str) {
    return str.replace(/-(\w)/g, function (_, c) {
        return c ? c.toUpperCase() : '';
    });
};

//创建targetMap的map数据结构存储结构为  target --  key  --  dep
var targetMap = new Map();
function trigger(target, key) {
    //通过目标值target，依赖的key值，获取所有与此依赖有关的集合dep
    var depsMap = targetMap.get(target);
    var dep = depsMap.get(key);
    //触发依赖的方法，把dep当作参数传入，封装成一个triggerEffects方法，方便后续进行复用
    triggerEffects(dep);
}
function triggerEffects(dep) {
    //循环set结构的dep数组
    for (var _i = 0, dep_1 = dep; _i < dep_1.length; _i++) {
        var effect_1 = dep_1[_i];
        //取出每一个effect，判断effect是否有第二个参数传入
        if (effect_1.scheduler) {
            //如果存在，调用scheduler方法，也就是用户传过来的第二个回调函数fn2。即effect(function fn1(){},function fn2(){})
            effect_1.scheduler();
        }
        else {
            //如果没有第二个参数，直接进行依赖触发，执行run方法，run方法里会调用fn
            effect_1.run();
        }
    }
}

var get = createGetter();
var set = createSetter();
var readonlyGet = createGetter(true);
var shallowReadonlyGet = createGetter(true, true);
//抽象出createGetter 方法，相当于get方法收集依赖
function createGetter(isReadonly, shallow) {
    if (isReadonly === void 0) { isReadonly = false; }
    if (shallow === void 0) { shallow = false; }
    return function get(target, key) {
        if (key === "__v_isReactive" /* IS_REACTIVE */) {
            //isReactive的实现，如果匹配到且不是只读属性，则返回true，即!isReadonly
            return !isReadonly;
        }
        else if (key === "__v_isReadonly" /* IS_READONLY */) {
            //isReadonly的实现，如果匹配到是只读属性，则返回
            return isReadonly;
        }
        var res = Reflect.get(target, key);
        //判断是否为shallow，直接返回值就好
        if (shallow) {
            return res;
        }
        //数据嵌套判断，如果是isReadonly，就用readonly包裹嵌套的深层数据，如果不是，就用reactive嵌套深层，使其成为响应式数据
        if (isObject(res)) {
            return isReadonly ? readonly(res) : reactive(res);
        }
        return res;
    };
}
//createSetter 方法，相当于set方法触发依赖
function createSetter(isReadonly) {
    return function get(target, key, val) {
        var res = Reflect.set(target, key, val);
        //触发依赖
        trigger(target, key);
        return res;
    };
}
var mutableHandlers = {
    get: get,
    set: set
};
var readonlyHandlers = {
    get: readonlyGet,
    set: function (target, key, val) {
        console.warn("key:".concat(key, " set \u5931\u8D25\uFF0C\u56E0\u4E3A target\u662Freadonly"), target);
        return true;
    }
};
var shallowReadonlyHandlers = extend({}, readonlyHandlers, {
    get: shallowReadonlyGet,
});

//导出reactive对象
function reactive(raw) {
    return createActiveObject(raw, mutableHandlers);
}
function readonly(raw) {
    return createActiveObject(raw, readonlyHandlers);
}
function shallowReadonly(raw) {
    return createActiveObject(raw, shallowReadonlyHandlers);
}
//创建reactive对象的方法
function createActiveObject(raw, baseHandlers) {
    if (!isObject(raw)) {
        console.warn("target:".concat(raw, "\u5FC5\u987B\u662F\u4E00\u4E2A\u5BF9\u8C61"));
        return;
    }
    //通过Proxy实现对象数据的响应式监听
    return new Proxy(raw, baseHandlers);
}

function emit(instance, event) {
    var args = [];
    for (var _i = 2; _i < arguments.length; _i++) {
        args[_i - 2] = arguments[_i];
    }
    var props = instance.props;
    var handler = props[toHandlerKey(camelize(event))];
    handler && handler.apply(void 0, args);
}

function initProps(instance, rawProps) {
    instance.props = rawProps || {};
}

var publickPropertiesMap = {
    $el: function (i) { return i.vnode.el; }
};
var PublickInstanceProxyHandlers = {
    get: function (_a, key) {
        var instance = _a._;
        var setupState = instance.setupState, props = instance.props;
        if (hasOwn(setupState, key)) {
            return setupState[key];
        }
        else if (hasOwn(props, key)) {
            return props[key];
        }
        var publicGetter = publickPropertiesMap[key];
        if (publicGetter) {
            return publicGetter(instance);
        }
    }
};

function createComponentInstance(vnode) {
    var component = {
        vnode: vnode,
        type: vnode.type,
        setupState: {},
        props: {},
        emit: function () { }
    };
    component.emit = emit.bind(null, component);
    return component;
}
function setupComponent(instance) {
    initProps(instance, instance.vnode.props);
    //initSlots();
    setupStatefulComponent(instance);
}
function setupStatefulComponent(instance) {
    var Component = instance.type;
    instance.proxy = new Proxy({ _: instance }, PublickInstanceProxyHandlers);
    var setup = Component.setup;
    if (setup) {
        var setupResult = setup(shallowReadonly(instance.props), {
            emit: instance.emit,
        });
        handleSetupResult(instance, setupResult);
    }
}
function handleSetupResult(instance, setupResult) {
    if (typeof setupResult === 'object') {
        instance.setupState = setupResult;
    }
    finishComponentSetup(instance);
}
function finishComponentSetup(instance) {
    var Component = instance.type;
    //if(Component.render) {
    instance.render = Component.render;
    //}
}

function render(vnode, container) {
    //调用path方法
    path(vnode, container);
}
function path(vnode, container) {
    //去处理组件
    //判断vnode是不是element
    //如何区分是element或者component类型
    //processElement()
    //解构vnode，通过判断type的类型来区分是element或者component
    vnode.type; var shapeFlag = vnode.shapeFlag;
    if (shapeFlag & 1 /* ELEMENT */) {
        //处理元素类型
        processElement(vnode, container);
    }
    else if (shapeFlag & 2 /* STATEFUL_COMPONENT */) {
        //处理组件类型
        processComponent(vnode, container);
    }
}
function processElement(vnode, container) {
    mountElement(vnode, container);
}
function mountElement(vnode, container) {
    var type = vnode.type, props = vnode.props, children = vnode.children, shapeFlag = vnode.shapeFlag;
    //如果是元素，则type就是元素本身，创建一个元素
    var el = (vnode.el = document.createElement(type));
    //元素的子节点children 有可能是string类型和array类型，也就是说子节点有可能是文本类型或者是一个数组。
    if (shapeFlag & 4 /* TEXT_CHILDREN */) {
        //如果是文本类型，直接赋值textContent
        el.textContent = children;
    }
    else if (shapeFlag & 8 /* ARRAY_CHILDREN */) {
        //如果children是数组，循环遍历数组
        mountChildren(children, el);
    }
    // props 通过循环props，设置元素自身的属性
    for (var key in props) {
        var val = props[key];
        var isOn = function (key) { return /^on[A-Z]/.test(key); };
        if (isOn(key)) {
            var event_1 = key.slice(2).toLowerCase();
            el.addEventListener(event_1, val);
        }
        else {
            el.setAttribute(key, val);
        }
    }
    //最后把元素插入到容器container里面
    container.append(el);
}
function mountChildren(children, container) {
    //数组的元素为一个虚拟节点，需要重新进行调用path()
    children.forEach(function (v) {
        path(v, container);
    });
}
function processComponent(vnode, container) {
    mountComponent(vnode, container);
}
//initinalVNode初始化节点
function mountComponent(initinalVNode, container) {
    var instance = createComponentInstance(initinalVNode);
    setupComponent(instance);
    setupRenderEffect(instance, container, initinalVNode);
}
function setupRenderEffect(instance, container, initinalVNode) {
    var proxy = instance.proxy;
    var subTree = instance.render.call(proxy); //虚拟节点树
    path(subTree, container);
    initinalVNode.el = subTree.el;
}

function createVNode(type, props, children) {
    var vnode = {
        type: type,
        props: props,
        children: children,
        shapeFlag: getShapeFlag(type),
        el: null
    };
    if (typeof children === 'string') {
        vnode.shapeFlag |= 4 /* TEXT_CHILDREN */;
    }
    else if (Array.isArray(children)) {
        vnode.shapeFlag |= 8 /* ARRAY_CHILDREN */;
    }
    return vnode;
}
function getShapeFlag(type) {
    return typeof type === 'string'
        ? 1 /* ELEMENT */
        : 2 /* STATEFUL_COMPONENT */;
}

function createApp(rootComponent) {
    return {
        mount: function (rootContainer) {
            var vnode = createVNode(rootComponent);
            render(vnode, rootContainer);
        }
    };
}

function h(type, props, children) {
    return createVNode(type, props, children);
}

exports.createApp = createApp;
exports.h = h;
