import { spawn } from "child_process";

export const createPrivateKey = (privateKeyPath: string) => {
  return new Promise<void>((resolve, reject) => {
    const cmd = spawn("ssh-keygen", [
      "-t",
      "rsa",
      "-b",
      "4096",
      "-m",
      "PEM",
      "-f",
      privateKeyPath,
      "-N",
      "",
    ]);

    cmd.stdout.on("data", data => {
      console.log(`stdout: ${data}`);
    });

    cmd.stderr.on("data", data => {
      console.error(`stderr: ${data}`);
    });

    cmd.on("error", error => {
      reject(error);
    });

    cmd.on("close", code => {
      if (code !== 0) {
        reject(
          `Could not create JWT key file. Child process exited with code ${code}`,
        );
      }

      resolve();
    });
  });
};

export const createPublicKey = (
  privateKeyPath: string,
  publicKeyPath: string,
) => {
  return new Promise<void>((resolve, reject) => {
    const cmd = spawn("openssl", [
      "rsa",
      "-in",
      privateKeyPath,
      "-pubout",
      "-outform",
      "PEM",
      "-out",
      publicKeyPath,
    ]);

    cmd.stdout.on("data", data => {
      console.log(`stdout: ${data}`);
    });

    cmd.stderr.on("data", data => {
      console.error(`stderr: ${data}`);
    });

    cmd.on("error", error => {
      reject(error);
    });

    cmd.on("close", code => {
      if (code !== 0) {
        reject(
          `Could not create JWT key file. Child process exited with code ${code}`,
        );
      }

      resolve();
    });
  });
};
