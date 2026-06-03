const { spawn } = require("node:child_process");

const commands = [
  { name: "server", command: "node", args: ["backend/src/server.js"] },
  { name: "client", command: "npm", args: ["--prefix", "frontend", "run", "dev"] },
  {
    name: "ml",
    command: "python",
    args: ["-m", "uvicorn", "app.main:app", "--app-dir", "ml-engine", "--host", "0.0.0.0", "--port", "8000"],
  },
];

const children = commands.map(({ name, command, args }) => {
  const child = spawn(command, args, { stdio: "pipe", shell: process.platform === "win32" });
  child.stdout.on("data", (data) => process.stdout.write(`[${name}] ${data}`));
  child.stderr.on("data", (data) => process.stderr.write(`[${name}] ${data}`));
  child.on("exit", (code) => {
    if (code && code !== 0) process.stderr.write(`[${name}] exited with ${code}\n`);
  });
  return child;
});

function shutdown() {
  for (const child of children) child.kill();
  process.exit(0);
}

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
