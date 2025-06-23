"use strict";
const electron = require("electron");
const preload = require("@electron-toolkit/preload");
const fs = require("fs");
function _interopNamespaceDefault(e) {
  const n = Object.create(null, { [Symbol.toStringTag]: { value: "Module" } });
  if (e) {
    for (const k in e) {
      if (k !== "default") {
        const d = Object.getOwnPropertyDescriptor(e, k);
        Object.defineProperty(n, k, d.get ? d : {
          enumerable: true,
          get: () => e[k]
        });
      }
    }
  }
  n.default = e;
  return Object.freeze(n);
}
const fs__namespace = /* @__PURE__ */ _interopNamespaceDefault(fs);
let config = new Object();
function get() {
  if (JSON.stringify(config).length <= 3) {
    read();
  }
  return config;
}
function globalize(config2) {
  if (config2.APP_DIR === "unset") {
    config2.APP_DIR = process.env.APP_DIR;
  }
  if (config2.UPDATE_CHANNEL === "unset") {
    config2.UPDATE_CHANNEL = "release";
    process.env.UPDATE_CHANNEL = "release";
  } else {
    process.env.UPDATE_CHANNEL = config2.UPDATE_CHANNEL;
  }
  return config2;
}
function read() {
  let cfgStr = fs__namespace.readFileSync(process.env.APP_DIR + "\\default.conf").toString();
  let vars = cfgStr.replace(/\r?\n|\r/g, "");
  let variables = vars.split(";");
  let cfg = new Array();
  variables.forEach((variable) => {
    cfg[variable.split("=")[0]] = variable.split("=")[1];
  });
  cfg = globalize(cfg);
  config = cfg;
  if (process.env.DEBUG_MODE) {
    console.log(cfg);
  }
  return;
}
async function getUpdate() {
  const resp = await fetch(process.env.API_URL + "/updates/latest/" + process.env.UPDATE_CHANNEL, {
    method: "GET",
    headers: { "Content-Type": "application/json" }
  });
  let needUpdate = false;
  let currVer = process.env.BUILD_VERSION?.split("-") || "";
  let latest = await resp.json();
  if (currVer[0].split(".")[0] < latest["release"]) {
    needUpdate = true;
  } else {
    if (currVer[0].split(".")[1] < latest["version"].split(".")[0]) {
      needUpdate = true;
    } else {
      if (currVer[0].split(".")[2] < latest["version"].split(".")[1]) {
        needUpdate = true;
      }
    }
  }
  console.log(needUpdate);
  console.log(currVer[0] + " -> " + latest["release"] + "." + latest["version"]);
  if (needUpdate) {
    alert("Необходимо установить обновление");
    const { shell } = require("electron");
    let url = await latest["url"];
    shell.openExternal(url);
  }
}
get();
getUpdate();
if (process.contextIsolated) {
  try {
    electron.contextBridge.exposeInMainWorld("electron", preload.electronAPI);
  } catch (error) {
    console.error(error);
  }
} else {
  window.electron = preload.electronAPI;
}
