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
let config_example = "DEBUG_MODE=false;\nPLAYER_ID=NULL;\nPLAYER_UUID=NULL;\nPLAYER_NICKNAME=NULL;\nPLAYER_TOKEN=NULL;\nUPDATE_CHANNEL=release;\nAPP_DIR=" + process.env.APP_DIR + ";";
let config = new Array();
function get() {
  return read();
}
function resetConfig() {
  if (process.env.DEBUG_MODE) console.log("Config corrupted - resetting");
  fs__namespace.writeFileSync(process.env.APP_DIR + "\\default.conf", config_example);
  config = read();
  return config;
}
function read() {
  if (fs__namespace.existsSync(process.env.APP_DIR + "\\default.conf")) {
    let cfgStr = fs__namespace.readFileSync(process.env.APP_DIR + "\\default.conf").toString();
    let vars = cfgStr.replace(/\r?\n|\r/g, "");
    let variables = vars.split(";");
    let cfg = new Array();
    variables.forEach((variable) => {
      cfg[variable.split("=")[0]] = variable.split("=")[1];
      config = cfg;
    });
    if (typeof config["DEBUG_MODE"] !== "undefined" && config["DEBUG_MODE"] !== "false") {
      process.env.DEBUG_MODE = "true";
    }
    return config;
  } else {
    return resetConfig();
  }
}
async function startup(token) {
  let resp_to_render = {
    error: false,
    data: ""
  };
  let cfg = get();
  if (cfg["PLAYER_TOKEN"] === "NULL") {
    resp_to_render.error = true, resp_to_render.data = "FIRST_AUTH";
    return resp_to_render;
  } else {
    let resp = await fetch(process.env.API_URL + "/player/token/" + cfg["PLAYER_TOKEN"], {
      method: "GET",
      headers: { "Content-Type": "application/json" }
    });
    let response = await resp.json();
    if (response.error) {
      console.log(response.data);
    }
    return await resp.json();
  }
}
async function validate(token) {
}
async function auth(login, password, string) {
}
const auth$1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  auth,
  startup,
  validate
}, Symbol.toStringTag, { value: "Module" }));
if (process.env.DEBUG_MODE) console.log(process.env);
if (process.contextIsolated) {
  try {
    electron.contextBridge.exposeInMainWorld("electron", preload.electronAPI);
    electron.contextBridge.exposeInMainWorld("auth", auth$1);
  } catch (error) {
    console.error(error);
  }
} else {
  window.electron = preload.electronAPI;
  window.auth = auth$1;
}
