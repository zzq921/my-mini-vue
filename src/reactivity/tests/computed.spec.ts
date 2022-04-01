import { computed } from "../computed"
import { reactive } from "../reactive"

describe('computed',()=>{
  it('happy path',()=>{
    const user = reactive({age:1})
    const age = computed(()=>{
      return user.age
    })
    expect(age.value).toBe(1)
  })

  it('should coputed lazily',()=>{
    const user = reactive({
      foo:2
    })
    const getter = jest.fn(()=>{
      return user.foo
    })

    const cValue = computed(getter)
    expect(getter).not.toHaveBeenCalled()

    expect(cValue.value).toBe(2)
    expect(getter).toHaveBeenCalledTimes(1)

    cValue.value
    expect(getter).toHaveBeenCalledTimes(1)

    user.foo = 3
    expect(getter).toHaveBeenCalledTimes(1)

    expect(cValue.value).toBe(3)
    expect(getter).toHaveBeenCalledTimes(2)



  })
})
