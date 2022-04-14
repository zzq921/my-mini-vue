import { createComponentInstance, setupComponent } from "./component"

export function render(vnode,container){
  //调用path方法
  path(vnode,container)
}

function path(vnode,container) {
  //去处理组件

  processComponent(vnode,container)
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