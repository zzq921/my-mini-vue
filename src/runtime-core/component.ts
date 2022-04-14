export function createComponentInstance(vnode) {
  const component = {
    vnode,
    type:vnode.type
  };
  return component;
}

export function setupComponent(instance) {
  //initProps();
  //initSlots();
  setupStatefulComponent(instance)
}

function setupStatefulComponent(instance:any) {
  const Component = instance.type


  const { setup } = Component

  if(setup) {
    const setupResult = setup();

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
  if(!Component.render) {
    instance.render = Component.render
  }
}