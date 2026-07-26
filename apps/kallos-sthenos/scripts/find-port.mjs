import { createServer } from "net";

const preferred = parseInt(process.argv[2] || "3000", 10);

function isPortFree(port) {
  return new Promise((resolve) => {
    const srv = createServer();
    srv.once("error", () => resolve(false));
    srv.once("listening", () => srv.close(() => resolve(true)));
    srv.listen(port);
  });
}

for (let port = preferred; port < preferred + 20; port++) {
  if (await isPortFree(port)) {
    process.stdout.write(String(port));
    process.exit(0);
  }
}
process.stderr.write("No available port found\n");
process.exit(1);
