"use strict";
const electron = require("electron");
const preload = require("@electron-toolkit/preload");
const fs = require("fs");
const child_process = require("child_process");
const net = require("net");
const semver = require("semver");
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
const child_process__namespace = /* @__PURE__ */ _interopNamespaceDefault(child_process);
const defaultConfig = new Array();
defaultConfig["PLAYER_ID"] = "-1;";
defaultConfig["PLAYER_UUID"] = "-1";
defaultConfig["PLAYER_NICKNAME"] = "-1;";
defaultConfig["PLAYER_TOKEN"] = "-1;";
defaultConfig["UPDATE_CHANNEL"] = "unset;";
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
  if (!fs__namespace.existsSync(process.env.APP_DIR)) fs__namespace.mkdirSync(process.env.APP_DIR);
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
  return;
}
async function reset() {
  if (!fs__namespace.existsSync(process.env.APP_DIR)) fs__namespace.mkdirSync(process.env.APP_DIR);
  if (process.env.DEBUG_MODE) console.log("Resetting config");
  defaultConfig.forEach((arg) => {
    fs__namespace.writeFileSync(process.env.APP_DIR + "\\default.conf", arg);
  });
}
const config$1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  get,
  read,
  reset
}, Symbol.toStringTag, { value: "Module" }));
let ready_to_install;
let selected_channel = process.env.UPDATE_CHANNEL;
let repo = "ephemeralAzu/epherrrMine";
let inst_type = typeof process.env.PORTABLE_EXECUTABLE_DIR == "undefined" ? "setup" : "portable";
let curr_build = process.env.BUILD_VERSION || "";
let curr_channel = curr_build.match(/[a-zA-z]/g)?.join("") || "release";
let curr_version = semver.coerce(curr_build);
if (process.env.DEBUG_MODE) console.log("selected channel: " + selected_channel + " current version: " + curr_build + " current channel: " + curr_channel);
let percent = 0;
async function getUpdate() {
  let resp = await fetch("https://api.github.com/repos/" + repo + "/releases", {
    method: "GET",
    headers: { "Content-Type": "application/json" }
  });
  let response = await resp.json();
  let releases = new Array();
  let portable_url, setup_url;
  if (process.env.DEBUG_MODE) console.log(response);
  response.forEach((release) => {
    release.assets.forEach((exe) => {
      if (exe.browser_download_url.split("-")[1] == "portable") {
        portable_url = exe.browser_download_url;
      } else {
        setup_url = exe.browser_download_url;
      }
    });
    releases.push({ version: semver.coerce(release.name)?.version, channel: release.target_commitish, artifacts: { portable: portable_url, setup: setup_url } });
  });
  let need_update = false;
  let update_to = "";
  releases.forEach((release) => {
    need_update = semver.gt(release.version, curr_version);
    if (need_update && update_to.length == 0) {
      if (selected_channel !== release.channel) {
        need_update = false;
      } else {
        update_to = release.version;
        release.version;
      }
    }
  });
  need_update = update_to.length == 0 ? false : true;
  if (process.env.DEBUG_MODE) console.log(curr_version + " -> " + update_to);
  if (need_update) {
    if (confirm("Доступно новое обновление " + update_to + "\nКанал обновления: " + selected_channel + "\nУстановить?")) {
      ready_to_install = await releases.find((release) => release.version === update_to);
      if (process.env.DEBUG_MODE) console.log(ready_to_install);
      return true;
    }
  }
  percent = -1;
  return false;
}
async function installUpdate() {
  let url = inst_type == "portable" ? ready_to_install.artifacts.portable : ready_to_install.artifacts.setup;
  if (inst_type == "portable") {
    let exeName = process.env.PORTABLE_EXECUTABLE_DIR + "\\EpherrrMine-" + ready_to_install.version + ready_to_install.channel + ".exe";
    if (fs.existsSync(exeName)) fs.unlinkSync(exeName);
    var writeStream = fs.createWriteStream(exeName, { flags: "a" });
    let response = await fetch(url, { method: "GET" });
    const reader = response.body.getReader();
    const contentLength = +response.headers.get("Content-Length");
    let receivedLength = 0;
    while (true) {
      const { done, value } = await reader.read();
      if (done) {
        writeStream.end();
        setTimeout(() => {
          const pipeName = "\\\\.\\pipe\\ready_pipe";
          const server = net.createServer((sock) => {
            sock.once("data", (buf) => {
              if (buf.toString() === "READY") {
                console.log("✅ B готов, закрываю A");
                sock.end();
                server.close();
                window.close();
                process.exit();
              }
            });
          }).listen(pipeName, () => {
            const args = [`--updated=${process.env.PORTABLE_EXECUTABLE_FILE.split("\\")[process.env.PORTABLE_EXECUTABLE_FILE.split("\\").length - 1]}`, `--pipe=${pipeName}`];
            const child = child_process__namespace.spawn(exeName, args, { detached: true, stdio: "ignore" });
            child.unref();
          });
        }, 500);
        break;
      }
      writeStream.write(value);
      percent = Math.round(receivedLength / contentLength * 100);
      receivedLength += value.length;
    }
  } else {
    if (fs.existsSync(process.env.APP_DIR + "\\installer.exe")) fs.unlinkSync(process.env.APP_DIR + "\\installer.exe");
    var writeStream = fs.createWriteStream(process.env.APP_DIR + "\\installer.exe", { flags: "a" });
    let response = await fetch(url, { method: "GET" });
    const reader = response.body.getReader();
    const contentLength = +response.headers.get("Content-Length");
    let receivedLength = 0;
    while (true) {
      const { done, value } = await reader.read();
      if (done) {
        writeStream.end();
        setTimeout(() => {
          let child = child_process__namespace.exec(process.env.APP_DIR + "\\installer.exe /S --force-run");
          setTimeout(() => {
            setTimeout(() => {
              window.close();
              process.exit();
            }, 2500);
            child.unref();
          }, 1e3);
        }, 1e3);
        break;
      }
      writeStream.write(value);
      percent = Math.round(receivedLength / contentLength * 100);
      receivedLength += value.length;
    }
  }
}
function getPercentOfDownload() {
  return percent;
}
function setPercentOfDownload(perc) {
  percent = perc;
}
function getUpdateFlag() {
  return process.env.UPDATED;
}
async function configureUpdate(version) {
  while (fs.existsSync(process.env.PORTABLE_EXECUTABLE_DIR + "\\" + version)) {
    try {
      fs.unlinkSync(process.env.PORTABLE_EXECUTABLE_DIR + "\\" + version);
    } catch (error) {
      console.log("trying delete old exe...");
      console.log(error);
    }
  }
  let response = await fetch(process.env.API_URL + "/launcher/" + curr_build, { method: "GET" });
  return response.json();
}
const update = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  configureUpdate,
  getPercentOfDownload,
  getUpdate,
  getUpdateFlag,
  installUpdate,
  setPercentOfDownload
}, Symbol.toStringTag, { value: "Module" }));
if (process.env.DEBUG_MODE) {
  console.log("Actual ENV");
}
if (process.env.DEBUG_MODE) {
  console.log(process.env);
}
if (process.env.DEBUG_MODE) {
  console.log("Actual CONFIG");
}
if (process.env.DEBUG_MODE) {
  console.log(get());
} else {
  get();
}
if (process.contextIsolated) {
  try {
    electron.contextBridge.exposeInMainWorld("electron", preload.electronAPI);
    electron.contextBridge.exposeInMainWorld("update", update);
    electron.contextBridge.exposeInMainWorld("config", config$1);
  } catch (error) {
    console.error(error);
  }
} else {
  window.electron = preload.electronAPI;
  window.update = update;
  window.config = config$1;
}
