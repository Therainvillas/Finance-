import { spawn } from "node:child_process";

const npmCommand = process.platform === "win32" ? "npm.cmd" : "npm";
const children = [
  spawn(process.execPath, ["server/index.js"], { stdio: "inherit" }),
  spawn(npmCommand, ["run", "dev", "--", "--host", "127.0.0.1", "--port", "5173"], {
    stdio: "inherit",
    shell: process.platform === "win32",
  }),
];

const stopAll = () => {
  for (const child of children) {
    if (!child.killed) child.kill();
  }
};

for (const child of children) {
  child.on("exit", (code) => {
    if (code) {
      stopAll();
      process.exit(code);
    }
  });
}

process.on("SIGINT", () => {
  stopAll();
  process.exit(0);
});

process.on("SIGTERM", () => {
  stopAll();
  process.exit(0);
});
