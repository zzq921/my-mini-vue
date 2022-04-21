var publickPropertiesMap = {
    $el: function (i) { return i.vnode.el; }
};
var PublickInstanceProxyHandlers = {
    get: function (_a, key) {
        var instance = _a._;
        var setupState = instance.setupState;
        if (key in setupState) {
            return setupState[key];
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
        setupState: {}
    };
    return component;
}
function setupComponent(instance) {
    //initProps();
    //initSlots();
    setupStatefulComponent(instance);
}
function setupStatefulComponent(instance) {
    var Component = instance.type;
    instance.proxy = new Proxy({ _: instance }, PublickInstanceProxyHandlers);
    var setup = Component.setup;
    if (setup) {
        var setupResult = setup();
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
        el.setAttribute(key, val);
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
        vnode.shapeFlag != 8 /* ARRAY_CHILDREN */;
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

export { createApp, h };
