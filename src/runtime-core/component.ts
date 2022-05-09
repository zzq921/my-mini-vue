import { shallowReadonly } from "../reactivity/reactive";
import { initProps } from "./componentProps";
import { PublickInstanceProxyHandlers } from "./componentPublicInstance";

export function createComponentInstance(vnode) {
  const component = {
    vnode,
    type:vnode.type,
    setupState:{}
  };
  return component;
}

export function setupComponent(instance) {
  initProps(instance,instance.vnode.props);
  //initSlots();
  setupStatefulComponent(instance)
}

function setupStatefulComponent(instance:any) {
  const Component = instance.type
  instance.proxy = new Proxy({_:instance},PublickInstanceProxyHandlers)
  const { setup } = Component

  if(setup) {
    const setupResult = setup(shallowReadonly(instance.props));

    handleSetupResult(instance,setupResult)
  }
}

function handleSetupResult(instance,setupResult:any) {
  if(typeof setupResult === 'object') {
    instance.setupState = setupResult
  }
  finishComponentSetup(instance)
}


function finishComponentSetup(instance:any) {
  const Component = instance.type
  //if(Component.render) {
    instance.render = Component.render
  //}
}