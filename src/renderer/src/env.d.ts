/// <reference types="vite/client" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/ban-types
  const component: DefineComponent<{}, {}, any>
  export default component
}
export interface Config {
  player: Player
  params: Params
  packs: Array<ModPack>
}
export interface Player {
  id: number
  token: string
  nickname: string
  uuid: string
  role: string
}
export interface ModPack {
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
export interface Params {
  ram: { min: Number; max: Number }
  packsPath: String
}
