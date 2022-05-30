import { h } from "../../lib/zzq-mini-vue.esm.js";
import { Foo } from "./Foo.js";

export const App = {
  render() {
    return h("div", {}, [
      h("div", {}, "APP"),
      h(Foo, {
        onAdd(a, b) {
          console.log("onAdd", a, b);
        },
        onAddFoo() {
          console.log("onAddFoo");
        },
      }),
    ]);
  },
  setup() {
    return {};
  },
};
