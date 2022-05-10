const execa = require("execa");

execa("rollup", ["-cw"], {
  stdio: "inherit",
});
