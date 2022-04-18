
const publickPropertiesMap = {
  $el: (i)=> i.vnode.el
}

export const PublickInstanceProxyHandlers = {
  get({_:instance},key) {
    const { setupState } = instance
    if(key in setupState){
      return setupState[key]
    }  
    const publicGetter = publickPropertiesMap[key]
    if(publicGetter) {
      return publicGetter(instance)
    }
  }
}