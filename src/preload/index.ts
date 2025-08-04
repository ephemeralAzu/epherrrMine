//@ts-nocheck
import { contextBridge} from 'electron'
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
import * as auth from '../functions/auth'

if(process.env.DEBUG_MODE) console.log(process.env);

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

//вывод в мир АПИШНИКА
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('auth', auth)
    // // contextBridge.exposeInMainWorld('api', api)
    // contextBridge.exposeInMainWorld('env', enviroment)
    // contextBridge.exposeInMainWorld('user', userFunctions)
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI
  // @ts-ignore (define in dts)
   window.auth = auth
  // // @ts-ignore (define in dts)
  // window.env = enviroment
  // // @ts-ignore (define in dts)
  // window.user = userFunctions
}