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
function get$1() {
  return read();
}
function reset() {
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
    return reset();
  }
}
async function startup(token) {
  let resp_to_render = {
    error: false,
    data: ""
  };
  let cfg = get$1();
  if (cfg["PLAYER_TOKEN"] === "NULL") {
    if (process.env.DEBUG_MODE) console.log("First run with new config");
    resp_to_render.error = true, resp_to_render.data = "FIRST_RUN";
    return resp_to_render;
  } else {
    if (process.env.DEBUG_MODE) console.log("Check token in the config");
    let resp = await fetch(process.env.API_URL + "/player/token/" + cfg["PLAYER_TOKEN"], {
      method: "GET",
      headers: { "Content-Type": "application/json" }
    });
    let response = await resp.json();
    if (response.error) {
      if (process.env.DEBUG_MODE) console.log("token in the config incorrect!!!");
      reset();
      resp_to_render.error = true, resp_to_render.data = "CORRUPTED_CFG";
      return resp_to_render;
    } else {
      if (process.env.DEBUG_MODE) console.log("token in the config accepted");
      resp_to_render.error = false, resp_to_render.data = "ACCEPTED";
      return resp_to_render;
    }
  }
}
async function validate(token) {
  let resp_to_render = {
    error: false,
    data: ""
  };
  let resp = await fetch(process.env.API_URL + "/player/token/" + token, {
    method: "GET",
    headers: { "Content-Type": "application/json" }
  });
  let response = await resp.json();
  if (response.error) {
    resp_to_render.error = true, resp_to_render.data = "INCORRECT_TOKEN";
    return resp_to_render;
  }
}
async function get(token) {
  let resp_to_render = {
    error: false,
    data: ""
  };
  let resp = await fetch(process.env.API_URL + "/player/token/" + token, {
    method: "GET",
    headers: { "Content-Type": "application/json" }
  });
  let response = await resp.json();
  if (response.error) {
    resp_to_render.error = true, resp_to_render.data = "INCORRECT_TOKEN";
    return resp_to_render;
  } else {
    resp_to_render.error = false, resp_to_render.data = response.data;
    return resp_to_render;
  }
}
const auth = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  get,
  startup,
  validate
}, Symbol.toStringTag, { value: "Module" }));
if (process.env.DEBUG_MODE) console.log(process.env);
if (process.contextIsolated) {
  try {
    electron.contextBridge.exposeInMainWorld("electron", preload.electronAPI);
    electron.contextBridge.exposeInMainWorld("auth", auth);
  } catch (error) {
    console.error(error);
  }
} else {
  window.electron = preload.electronAPI;
  window.auth = auth;
}
