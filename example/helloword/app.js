export const app = {
  render() {
    return h("div", "hi," + this.msg);
  },
  setup() {
    return {
      msg: "mini-vue",
    };
  },
};
