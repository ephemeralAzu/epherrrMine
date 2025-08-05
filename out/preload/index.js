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
let config_example = "DEBUG_MODE=false;\nPLAYER_ID=NULL;\nPLAYER_UUID=NULL;\nPLAYER_NICKNAME=NULL;\nPLAYER_TOKEN=NULL;\nUPDATE_CHANNEL=release;\nAPP_DIR=" + process.env.APP_DIR;
let config = new Object();
function get$1() {
  if (process.env.DEBUG_MODE) console.log(config);
  return config;
}
function set(name, value) {
  config[name] = value;
  let keys = Object.keys(config);
  let str = "";
  keys.forEach((key) => {
    str += key + "=" + config[key] + ";\n";
  });
  fs__namespace.writeFileSync(process.env.APP_DIR + "\\default.conf", str);
}
function reset() {
  if (process.env.DEBUG_MODE) console.log("Конфиг сломан - перезапись");
  fs__namespace.writeFileSync(process.env.APP_DIR + "\\default.conf", config_example);
  config = read();
  return config;
}
function read() {
  if (fs__namespace.existsSync(process.env.APP_DIR + "\\default.conf")) {
    let cfgStr = fs__namespace.readFileSync(process.env.APP_DIR + "\\default.conf").toString();
    let vars = cfgStr.replace(/\r?\n|\r/g, "");
    let variables = vars.split(";");
    let cfg2 = new Array();
    variables.forEach((variable) => {
      let string = variable.split("=");
      if (string[0].length > 0 && string[0].length) cfg2[string[0]] = string[1];
      config = cfg2;
    });
    return config;
  } else {
    return reset();
  }
}
const config$1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  get: get$1,
  read,
  reset,
  set
}, Symbol.toStringTag, { value: "Module" }));
async function startup() {
  let resp_to_render = { error: false, data: "" };
  let cfg2 = get$1();
  if (cfg2["PLAYER_TOKEN"] === "NULL") {
    if (process.env.DEBUG_MODE) console.log("Первый запуск с нулевым конфигом");
    resp_to_render.error = true, resp_to_render.data = "FIRST_RUN";
    return resp_to_render;
  } else {
    if (process.env.DEBUG_MODE) console.log("Проверка токена из конфига");
    let token = await validate(cfg2["PLAYER_TOKEN"]);
    if (token.error && token.data == "INCORRECT_TOKEN") {
      if (process.env.DEBUG_MODE) console.log("Токен в конфиге некорректен");
      reset();
      resp_to_render.error = true, resp_to_render.data = "CORRUPTED_CFG";
      return resp_to_render;
    } else {
      if (process.env.DEBUG_MODE) console.log("Токен из конфига принят");
      resp_to_render.error = false, resp_to_render.data = "SUCCESS";
      return resp_to_render;
    }
  }
}
async function validate(token) {
  let resp_to_render = { error: false, data: "" };
  let validate2 = await get(token);
  if (validate2.error) {
    resp_to_render.error = true, resp_to_render.data = "INCORRECT_TOKEN";
    return resp_to_render;
  } else {
    resp_to_render.error = false, resp_to_render.data = "SUCCESS";
    set("PLAYER_TOKEN", token);
    return resp_to_render;
  }
}
async function get(token) {
  let resp_to_render = { error: false, data: "" };
  let resp = await fetch(process.env.API_URL + "/player/token/" + token, {
    method: "GET",
    headers: { "Content-Type": "application/json" }
  });
  let response = await resp.json();
  if (process.env.DEBUG_MODE) console.log(response);
  if (response.error) {
    resp_to_render.error = true, resp_to_render.data = "INCORRECT_TOKEN";
    return resp_to_render;
  } else {
    resp_to_render.error = false, resp_to_render.data = response.data;
    return resp_to_render;
  }
}
async function nicknameCheck() {
  let resp_to_render = { error: false, data: "" };
  let cfg2 = get$1();
  if (cfg2["PLAYER_TOKEN"] === "NULL") {
    resp_to_render.error = true;
    resp_to_render.data = "NO_TOKEN";
    return resp_to_render;
  }
  let player = await get(cfg2["PLAYER_TOKEN"]);
  if (player.error && player.data === "INCORRECT_TOKEN") {
    reset();
    resp_to_render.error = true;
    resp_to_render.data = "INCORRECT_TOKEN";
    return resp_to_render;
  }
  if (!player.error && player.data["name"].length == 0) {
    resp_to_render.error = true;
    resp_to_render.data = "NO_NICKNAME";
    return resp_to_render;
  }
  if (!player.error && player.data["name"].length > 2) {
    resp_to_render.error = false;
    resp_to_render.data = "SUCCESS";
    return resp_to_render;
  }
}
const auth = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  get,
  nicknameCheck,
  startup,
  validate
}, Symbol.toStringTag, { value: "Module" }));
let cfg = read();
if (cfg["DEBUG_MODE"] == "true" && cfg["DEBUG_MODE"] !== "false") {
  process.env.DEBUG_MODE = "true";
}
if (process.env.DEBUG_MODE) console.log(process.env);
if (process.contextIsolated) {
  try {
    electron.contextBridge.exposeInMainWorld("electron", preload.electronAPI);
    electron.contextBridge.exposeInMainWorld("auth", auth);
    electron.contextBridge.exposeInMainWorld("config", config$1);
  } catch (error) {
    console.error(error);
  }
} else {
  window.electron = preload.electronAPI;
  window.auth = auth;
  window.config = config$1;
}
