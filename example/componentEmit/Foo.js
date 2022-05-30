import { h } from "../../lib/zzq-mini-vue.esm.js";

export const Foo = {
  setup(props, { emit }) {
    const emitAdd = () => {
      console.log("123");
      emit("add", 1, 2);
      emit("add-foo");
    };
    return {
      emitAdd,
    };
  },
  render() {
    const btn = h(
      "button",
      {
        onClick: this.emitAdd,
      },
      "emitAdd"
    );

    const foo = h("div", {}, "foo");
    return h("div", {}, [foo, btn]);
  },
};
