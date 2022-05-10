const execa = require("execa");

execa("rollup", ["-c"], {
  stdio: "inherit",
});
