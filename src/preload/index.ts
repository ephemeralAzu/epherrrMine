//@ts-nocheck
import { contextBridge } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'
// import * as fs from 'fs'
// import { Authenticator, Client } from 'minecraft-launcher-core'
// import extract from 'extract-zip'
// import axios from 'axios'
// import { electronApp } from '@electron-toolkit/utils'
// import { EventEmitter } from 'node:events'
// import { electron, env } from 'node:process'
// import os from 'node:os'


import * as config from '../functions/config'
import * as update from "../functions/update"
// let Emitter = EventEmitter
// import * as enviroment from '../functions/environment.ts'
// import * as userFunctions from '../functions/auth'
import { updateElectronApp, UpdateSourceType } from 'update-electron-app'
if(process.env.DEBUG_MODE){console.log(process.env);}
config.get()

update.getUpdate()

interface Player {
  id: number
  token: string
  nickname: string
  uuid: string
  role: string
}
interface ModPack {
  id: number
  name: string
  full_name: string
  version: string
  loader: string
  loader_ver: string
  actuality: string
  color: string
  description: string
  abandoned: boolean
  installed: boolean
  ram: { min: number; max: number }
}
interface Params {
  ram: { min: Number; max: Number }
  packsPath: String
}
interface Config {
  player: Player
  params: Params
  packs: ModPack
}

// console.log(import.meta.env.VITE_DEFAULT_ROOT);
// //////////
// let totmem = os.totalmem()
// totmem = totmem/1024/1024/1024
// totmem = Math.round(totmem)

// let configExample = <Config>{
//   player: <Player>{id: 0, token: "", nickname: "", uuid: "", role: ""},
//   params: <Params>{ram: {min: 4, max: 6}, packsPath: packs},
//   packs: <ModPack>[]
// }

// let config = <Config>{
//   player: <player>{id: 0, token: "", nickname: "", uuid: "", role: ""},
//   params: <Params>{ram: {min: 4, max: 6}, packsPath: packs},
//   packs: <ModPack>[]
// }

// ///////STARTUP
// console.log("Читаем конфигурацию...");
//   if(!fs.existsSync(root)){
//     console.log("Корневая папка не существует, создем...")
//     fs.mkdirSync(root)
//   }
//   if(!fs.existsSync(cfg_path)){
//     console.log("Создаем стартовую конфигурацию...");
//     fs.writeFileSync(cfg_path, JSON.stringify(configExample))
//     config = Object.assign(configExample)
//   }else{
//     try {
//       config = JSON.parse(fs.readFileSync(cfg_path))
//       config.params.ram.max = totmem
//       packs = config.params.packsPath
//     }catch(err){
//       console.log("Конфигурация сломана!!! Перезаписываем!");
//       resConfig()
//     }

//     if(typeof JSON.parse(fs.readFileSync(cfg_path)).player === "undefined"){
//       console.log("Конфигурация сломана!!! Перезаписываем!");
//       resConfig()
//     }
//   }
//   switch (config.player.role) {
//     case "admin":
//       debug = true
//       break;
//     case "debug":
//       debug = true
//       break;
//     default:
//       debug = false
//       break;
//   }
//   console.log("---------------------------- env variables ------------------------------");
//   console.log("Current version:  " + buildVer);
//   console.log("Root Directory:  " + root);
//   console.log("Config file path:  " + cfg_path);
//   console.log("Default directory for packs :  " + packs);
//   console.log("Api URL:  " + url);
//   console.log("Maximum available RAM:  " + totmem + "Gb");
//   console.log("Debug mode:  " + debug);
//   console.log("-------------------------------------------------------------------------");

// //config get-settersы
// async function resConfig(){
//   fs.writeFileSync(cfg_path, JSON.stringify(configExample))
//   config = Object.assign(configExample)
// }

// async function updConfig(fieldName: string, field: Player | Params | ModPack){
//   console.log("Обновление конфигурации...");
//   let newCfg = {}
//   switch (fieldName) {
//     case "player":
//       newCfg = await JSON.parse(fs.readFileSync(cfg_path))
//       newCfg.player = field
//       break;
//     case "params":
//       newCfg = await JSON.parse(fs.readFileSync(cfg_path))
//       newCfg.params = field
//       break;
//     case "packs":
//       newCfg = await JSON.parse(fs.readFileSync(cfg_path))
//       newCfg.packs = field
//       break;
//   }
//   fs.writeFileSync(cfg_path, JSON.stringify(newCfg))
//   config = newCfg
// }

// async function getConfig(){
//   return config
// }

// let loadingstat = true
// let api = {
//   fs: fs,
//   uuid: uuid.v4,
//   // load: Start,
//   dialog: dialog,
//   buffer: Buffer.from,
//   zip: extract,
//   status: status,
//   config:{
//     get: getConfig,
//     set: updConfig,
//     reset: resConfig
//   },
//   env:{
//     buildVer: buildVer,
//     //default settings
//     root: root,
//     packs: packs,
//     url: url
//   }
//  }

//вывод в мир АПИШНИКА
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    // // contextBridge.exposeInMainWorld('api', api)
    // contextBridge.exposeInMainWorld('env', enviroment)
    // contextBridge.exposeInMainWorld('user', userFunctions)
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI
  // // @ts-ignore (define in dts)
  // // window.api = api
  // // @ts-ignore (define in dts)
  // window.env = enviroment
  // // @ts-ignore (define in dts)
  // window.user = userFunctions
}