
import { isObject } from "../shared/index"
import { ShapeFlags } from "../shared/ShapeFlags"
import { createComponentInstance, setupComponent } from "./component"

export function render(vnode,container){
  //调用path方法
  path(vnode,container)
}

function path(vnode,container) {
  //去处理组件
  //判断vnode是不是element
  //如何区分是element或者component类型
  //processElement()
  //解构vnode，通过判断type的类型来区分是element或者component
  const { type,shapeFlag } = vnode
  if(shapeFlag & ShapeFlags.ELEMENT) {
    //处理元素类型
    processElement(vnode,container)
  }else if(shapeFlag & ShapeFlags.STATEFUL_COMPONENT) {
    //处理组件类型
    processComponent(vnode,container)
  }
}
function processElement(vnode:any ,container:any) {
  mountElement(vnode,container)
}

function mountElement(vnode:any,container:any) {
  const {type,props,children,shapeFlag} = vnode
  //如果是元素，则type就是元素本身，创建一个元素
  const el = (vnode.el = document.createElement(type));
  //元素的子节点children 有可能是string类型和array类型，也就是说子节点有可能是文本类型或者是一个数组。
  if(shapeFlag & ShapeFlags.TEXT_CHILDREN) {
    //如果是文本类型，直接赋值textContent
    el.textContent = children
  }else if(shapeFlag & ShapeFlags.ARRAY_CHILDREN) {
    //如果children是数组，循环遍历数组
    mountChildren(children,el)
  }
  // props 通过循环props，设置元素自身的属性
  for(const key in props){
    const val = props[key]
    el.setAttribute(key,val)
  }
  //最后把元素插入到容器container里面
  container.append(el)
}
function mountChildren(children:any,container:any) {
  //数组的元素为一个虚拟节点，需要重新进行调用path()
  children.forEach((v)=>{
    path(v,container)
  })
}

function processComponent(vnode:any ,container:any) {
  mountComponent(vnode,container)
}
//initinalVNode初始化节点
function mountComponent(initinalVNode:any,container:any) { 
  const instance = createComponentInstance(initinalVNode)
  setupComponent(instance)
  setupRenderEffect(instance,container,initinalVNode)
}

function setupRenderEffect(instance:any,container:any,initinalVNode:any) {
  const { proxy } = instance
  
  const subTree = instance.render.call(proxy) //虚拟节点树
  path(subTree,container)
  initinalVNode.el = subTree.el

}