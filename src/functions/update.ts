import * as child_process from "child_process"

import fs from "fs"
import { createServer } from "net"
import semver from "semver"
// import { app, shell, ipcMain } from 'electron'
// import { electron } from "process";
// import { arrayBuffer, buffer } from "stream/consumers";

let ready_to_install
let selected_channel = process.env.UPDATE_CHANNEL
let repo = "ephemeralAzu/epherrrMine"
let inst_type = typeof process.env.PORTABLE_EXECUTABLE_DIR == "undefined" ? "setup" : "portable";
// inst_type = "portable"
// process.env.PORTABLE_EXECUTABLE_DIR = "C:\\Users\\ephemeral\\Desktop\\234"
// process.env.PORTABLE_EXECUTABLE_FILE = process.env.PORTABLE_EXECUTABLE_DIR + "\\EpherrrMine-0.0.4dev.exe"
let curr_build = process.env.BUILD_VERSION || ""
let curr_channel = curr_build.match(/[a-zA-z]/g)?.join("") || "release"
let curr_version = <string> <unknown>semver.coerce(curr_build)
if(process.env.DEBUG_MODE) console.log("selected channel: " + selected_channel + " current version: " + curr_build + " current channel: " + curr_channel);
let percent = 0
let new_ver = ""
export async function getUpdate(){
  let resp = await fetch("https://api.github.com/repos/" + repo + "/releases", {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' }
  })

  let response = await resp.json()
  let releases = new Array()
  let portable_url: "", setup_url: ""
  if(process.env.DEBUG_MODE) console.log(response)
  response.forEach(release => {
    release.assets.forEach(exe => {
      if(exe.browser_download_url.split("-")[1] == "portable"){
        portable_url = exe.browser_download_url
      }else{
        setup_url = exe.browser_download_url
      }
    })
    releases.push({version: semver.coerce(release.name)?.version, channel: release.target_commitish, artifacts: {portable: portable_url, setup: setup_url}})
  });


  let need_update = false
  let update_to = ""
  releases.forEach(release => {
    need_update = semver.gt(release.version, curr_version)
    if(need_update && update_to.length == 0){
      if(selected_channel !== release.channel){
        need_update = false
      }else{
        update_to = release.version
        new_ver = release.version
      }
    }
  })
  need_update = update_to.length == 0 ? false : true
  if(process.env.DEBUG_MODE) console.log(curr_version + " -> " + update_to)
    if(need_update){
      if(confirm("Доступно новое обновление "  + update_to + "\nКанал обновления: " + selected_channel + "\nУстановить?")){
        ready_to_install = await releases.find(release => release.version === update_to)
        if(process.env.DEBUG_MODE) console.log(ready_to_install);
        return true
      }
    }
    percent = -1
    return false
} 

 export async function installUpdate(){
    let url = inst_type == "portable" ? ready_to_install.artifacts.portable : ready_to_install.artifacts.setup
    // Шаг 1: начинаем загрузку fetch, получаем поток для чтения
    if(inst_type == "portable"){
      let exeName = <any>process.env.PORTABLE_EXECUTABLE_DIR + "\\EpherrrMine-" + ready_to_install.version + ready_to_install.channel + ".exe"
      // let exeName = "C:\\Users\\ephemeral\\Desktop\\234\\EpherrrMine-0.0.4-dev.exe"
      if(fs.existsSync(exeName)) fs.unlinkSync(exeName)
      var writeStream = fs.createWriteStream(exeName, {flags: 'a'});
      let response = await fetch(url, { method: "GET"});
      const reader = response.body!.getReader();
      const contentLength = + <Number><unknown><String>response.headers.get('Content-Length');
      let receivedLength = 0; // количество байт, полученных на данный момент
      while(true) {
        const {done, value} = await reader!.read();
        if (done) {
        writeStream.end()
        setTimeout(() => {
          const pipeName = '\\\\.\\pipe\\ready_pipe';
          const server = createServer(sock => {
            sock.once('data', buf => {
              if (buf.toString() === 'READY') {
                console.log('✅ B готов, закрываю A');
                sock.end();
                server.close();
                 window.close()
                 process.exit()
              }
            });
          }).listen(pipeName, () => {
            const args = [`--updated=${process.env.PORTABLE_EXECUTABLE_FILE!.split("\\")[process.env.PORTABLE_EXECUTABLE_FILE!.split("\\").length-1]}`, `--pipe=${pipeName}`];
            const child = child_process.spawn(exeName, args, { detached: true, stdio: 'ignore' });
            child.unref();
          });
              
        }, 500);
        break;
        }
        writeStream.write(value)
        percent = Math.round(receivedLength/contentLength*100)
        receivedLength += value.length;
      }
    }else{
      if(fs.existsSync(<any>process.env.APP_DIR + "\\installer.exe"))fs.unlinkSync(<any>process.env.APP_DIR + "\\installer.exe")
      var writeStream = fs.createWriteStream(<any>process.env.APP_DIR + "\\installer.exe", {flags: 'a'});
      let response = await fetch(url, { method: "GET",});
      const reader = response.body!.getReader();
      const contentLength = + <Number><unknown><String>response.headers.get('Content-Length');
      let receivedLength = 0; // количество байт, полученных на данный момент
      while(true) {
        const {done, value} = await reader!.read();
        if (done) {
          writeStream.end()
          setTimeout(() => {
            let child = child_process.exec(<any>process.env.APP_DIR + "\\installer.exe /S --force-run")
              setTimeout(() => {
                setTimeout(() => {
                  window.close()
                  process.exit()
                }, 2500);
                child.unref()
              }, 1000);
          }, 1000);
         
          
          break;
        }
        writeStream.write(value)
        percent = Math.round(receivedLength/contentLength*100)
        receivedLength += value.length;
      }
    }
}
export function getPercentOfDownload(){
  return percent
}
export function setPercentOfDownload(perc){
  percent = perc
}
export function getUpdateFlag(){
  return process.env.UPDATED
}
export async function configureUpdate(version){
  // console.log("CONFIGUREEEE   " + version);
  while(fs.existsSync(process.env.PORTABLE_EXECUTABLE_DIR + "\\" + version)){
    try {
      fs.unlinkSync(process.env.PORTABLE_EXECUTABLE_DIR + "\\" + version)
    } catch (error) {
      console.log("trying delete old exe...");
      console.log(error);
    }
  }
  let response = await fetch(process.env.API_URL + "/launcher/" + curr_build, { method: "GET"});
  return response.json()
}
    // if(need_update){
    //   let cityId = cities.find(city => city.name === searchTerm).id
    //   console.log(cityId);
    // }
/// НУЖНО ТЕПЕРЬ РАЗДЕЛИТЬ ВЕРСИЮ(1.2.3dev) НА ПОКОЛЕНИЕ - 1, ВЕРСИЮ -2, ФИКС - 3, КАНАЛ - dev
/// СРАВНИТЬ С ПОЛУЧАЕМОЙ С ГИТА, И СПРОСИТЬ ЮЗЕРА НУЖНО ЛИ ОБНОВЛЯТЬ.
//ЕСЛИ ДА ТО МЫ КАЧАЕМ НОВУЮ ВЕРСИЮ, ПЕРЕМЕЩАЕМ НА РАБОЧИЙ СТОЛ С ПРИПИСКОЙ NEW shell.openExternal('https://www.google.com'); (ИЛИ ФЕТЧЕМ!!!)
// ДАЛЕЕ ЗАПУСКАЕМ С АРГУМЕТОМ ОБНОВЛЕНИЯ var oShell = new ActiveXObject("Shell.Application"); var commandtoRun = "C:/Program Files/WinRAR/WinRAR.exe";  oShell.ShellExecute(commandtoRun, "", "", "open", "1");
// В НОВОЙ СБОРКЕ ПРОВЕРЯЕМ ЕСЛИ ЕСТЬ АРГУМЕНТ ТО УДАЛЯЕМ ЭКСЕ ПЕРЕДАННЫЙ В АРГУМЕНТЕ
// ЕСЛИ ЭТО УСТАНОВЩИК ТО ПРОСТО ЗАПУСКАЕМ ЕГО C ПАРАМЕТРОМ /S И УМИРАЕМ

  //   const resp = await fetch(process.env.API_URL + '/updates/latest/' + process.env.UPDATE_CHANNEL, {
  //   method: 'GET',
  //   headers: { 'Content-Type': 'application/json' }
  // })
  //   let needUpdate = false
  //   let currVer = process.env.BUILD_VERSION?.split("-") || ""
  //   let latest = await resp.json()
  //   if(currVer[0].split(".")[0] < latest["release"]){
  //       needUpdate= true
  //   }else{
  //       if(currVer[0].split(".")[1] < latest["version"].split(".")[0]){
  //       needUpdate = true
  //       }else{
  //           if(currVer[0].split(".")[2] < latest["version"].split(".")[1]){
  //               needUpdate = true
  //           }
  //       }
  //   }


  // console.log(needUpdate);
  // console.log(currVer[0] + " -> " + latest["release"] + "."+ latest["version"]);
  //   if(needUpdate){
  //     alert("Необходимо установить обновление")
  //     const { shell } = require('electron');
  //     let url = await latest["url"];
  //     shell.openExternal(url);
  //   }
    //1 - скачиваем
    //2 - скидываем к текущему с припиской new
    //3 - запускаем с параметром обновления и умираем
  //4 - новый запускается и удаляет старый

