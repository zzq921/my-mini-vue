export default {
  input: "./src/index.ts",
  output: [
    {
      format: "cjs",
      file: "lib/zzq-mini-vue.cjs.js",
    },
    {
      format: "es",
      file: "lib/zzq-mini-vue.esm.js",
    },
  ],
};
