
import fs from "fs"
import electron from 'electron'
export async function getUpdate(){
  let selected_channel = process.env.UPDATE_CHANNEL
  let repo = "ephemeralAzu/epherrrMine"

  let inst_type 
  if(typeof process.env.PORTABLE_EXECUTABLE_DIR == "undefined"){
    inst_type = "setup"
  }else{
    inst_type = "portable"
  }

  let response = await fetch("https://api.github.com/repos/" + repo + "/releases", {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' }
  })
  let releases =  await response.json()
  let versions = new Array()
  await releases.forEach(release => {
    let portable
    let setup

    release.assets.forEach(exe => {
      if(exe.browser_download_url.split("-")[1] == "portable"){
        portable = exe.browser_download_url
      }else{
        setup = exe.browser_download_url
      }
    })
    versions.push({version: release.name, channel: release.target_commitish, artifacts: {portable: portable, setup: setup}})
  });

  if(process.env.DEBUG_MODE){console.log(versions);}

  versions.forEach(version => {

  })

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

}