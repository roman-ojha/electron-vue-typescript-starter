"use strict";
import { app, protocol, BrowserWindow } from "electron";
import path from "path";
import electronIsDev from "electron-is-dev";

const isDev = electronIsDev;
if (isDev) {
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    require("electron-reloader")(module);
  } catch (err) {
    console.log(err);
  }
}

protocol.registerSchemesAsPrivileged([
  { scheme: "app", privileges: { secure: true, standard: true } },
]);

async function createWindow() {
  const win = new BrowserWindow({
    width: 1280,
    height: 800,
    title: "react-electron",
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: !process.env.ELECTRON_NODE_INTEGRATION,
      //   preload: path.join(__dirname, "../preload/preload.js"),
    },
    // icon: path.join(__dirname, "../../../../assets/icon/appicon.ico"),
  });

  if (isDev) {
    await win.loadURL("http://localhost:8080/");
  } else {
    await win.loadURL(
      `file://${path.resolve(__dirname, "../../../index.html")}`
    );
  }
}

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

app.on("ready", async () => {
  createWindow();
});

if (isDev) {
  if (process.platform === "win32") {
    process.on("message", (data) => {
      if (data === "graceful-exit") {
        app.quit();
      }
    });
  } else {
    process.on("SIGTERM", () => {
      app.quit();
    });
  }
}
