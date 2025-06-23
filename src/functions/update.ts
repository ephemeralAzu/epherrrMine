
import fs from "fs"
import electron from 'electron'
export async function getUpdate(){
  let selected_channel = process.env.UPDATE_CHANNEL
  let repo = "ephemeralAzu/epherrrMine"
  let releases = await fetch("https://api.github.com/repos/" + repo + "/releases", {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' }
  })
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