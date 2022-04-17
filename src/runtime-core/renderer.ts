import { isObject } from "../shared"
import { createComponentInstance, setupComponent } from "./component"

export function render(vnode,container){
  //调用path方法
  path(vnode,container)
}

function path(vnode,container) {
  debugger;
  //去处理组件
  //判断vnode是不是element
  //如何区分是element或者component类型
  //processElement()
  const { type } = vnode
  if(typeof type == "string") {
    processElement(vnode,container)
  }else if(isObject(type)) {
    processComponent(vnode,container)
  }
  
}
function processElement(vnode:any ,container:any) {
  mountElement(vnode,container)
}

function mountElement(vnode:any,container:any) {
  const {type,props,children} = vnode
  const el = document.createElement(type)
  //有可能是string类型和array类型
  if(typeof children === 'string') {
    el.textContent = children
  }else if(Array.isArray(children)) {
    //如果children是数组，循环遍历数组，数组的元素为一个虚拟节点，需要重新进行调用path()
    mountChildren(children,el)
  }
  // props
  for(const key in props){
    const val = props[key]
    el.setAttribute(key,val)
  }
  container.append(el)
  
}
function mountChildren(children:any,container:any) {
  children.forEach((v)=>{
    path(v,container)
  })
}

function processComponent(vnode:any ,container:any) {
  mountComponent(vnode,container)
}

function mountComponent(vnode:any,container:any) {
  const instance = createComponentInstance(vnode)
  setupComponent(instance)
  setupRenderEffect(instance,container)
}

function setupRenderEffect(instance:any,container:any) {
  const subTree = instance.render() //虚拟节点树

  path(subTree,container)
}