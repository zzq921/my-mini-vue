import { h } from "../../lib/zzq-mini-vue.esm.js";
import { Foo } from "./Foo.js";
window.self = null;
export const App = {
  render() {
    window.self = this;
    return h(
      "div",
      {
        id: "root",
        class: ["red", "blue"],
        onClick() {
          console.log("click");
        },
        onMousedown() {
          console.log("Mousedown");
        },
      },
      [
        h("div", {}, "hi:" + this.msg),
        h(Foo, {
          count: 1,
        }),
      ]
      //"hi," + this.msg //字符串类型
      //[h("p", { class: "red" }, "hi"), h("p", { class: "blue" }, "mini-vue")]
    );
  },
  setup() {
    return {
      msg: "mini-vue",
    };
  },
};
