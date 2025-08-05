//@ts-nocheck
import { contextBridge} from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

import * as config from '../functions/config'
import * as update from "../functions/update"
import * as auth from '../functions/auth'

  let cfg = config.read()

  if(cfg["DEBUG_MODE"] == "true" && cfg["DEBUG_MODE"] !== "false"){
    process.env.DEBUG_MODE = "true"
  }

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
    contextBridge.exposeInMainWorld('config', config)
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
  // @ts-ignore (define in dts)
  window.config = config
  // // @ts-ignore (define in dts)
  // window.user = userFunctions
}