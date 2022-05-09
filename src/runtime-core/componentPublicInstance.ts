import { hasOwn } from "../shared/index"

const publickPropertiesMap = {
  $el: (i)=> i.vnode.el
}

export const PublickInstanceProxyHandlers = {
  get({_:instance},key) {
    const { setupState,props } = instance
    
    if(hasOwn(setupState,key)) {
      return setupState[key]
    }else if(hasOwn(props,key)) {
      return props[key]
    }
    const publicGetter = publickPropertiesMap[key]
    if(publicGetter) {
      return publicGetter(instance)
    }
  }
}