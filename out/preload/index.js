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
const defaultConfig = new Array();
defaultConfig["PLAYER_ID"] = "-1;";
defaultConfig["PLAYER_UUID"] = "-1";
defaultConfig["PLAYER_NICKNAME"] = "-1;";
defaultConfig["PLAYER_TOKEN"] = "-1;";
defaultConfig["UPDATE_CHANNEL"] = "release;";
defaultConfig["APP_DIR"] = "unset;";
let config = new Object();
function get() {
  if (JSON.stringify(config).length <= 3) {
    read();
  }
  return config;
}
function globalize(config2) {
  if (process.env.DEBUG_MODE) console.log("Globalizing config");
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
  if (process.env.DEBUG_MODE) console.log("Reading config");
  if (!fs__namespace.existsSync(process.env.APP_DIR + "\\default.conf")) {
    reset();
    return;
  }
  let cfgStr = fs__namespace.readFileSync(process.env.APP_DIR + "\\default.conf").toString();
  let vars = cfgStr.replace(/\r?\n|\r/g, "");
  let variables = vars.split(";");
  let cfg = new Array();
  variables.forEach((variable) => {
    cfg[variable.split("=")[0]] = variable.split("=")[1];
  });
  cfg = globalize(cfg);
  config = cfg;
  if (process.env.DEBUG_MODE) console.log(cfg);
  return;
}
async function reset() {
  if (process.env.DEBUG_MODE) console.log("Resetting config");
  defaultConfig.forEach((arg) => {
    fs__namespace.writeFileSync(process.env.APP_DIR + "\\default.conf", arg);
  });
}
async function getUpdate() {
  console.log(process);
}
if (process.env.DEBUG_MODE) {
  console.log(process.env);
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
