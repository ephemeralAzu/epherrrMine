//@ts-ignore
import { ElectronAPI } from '@electron-toolkit/preload'

declare global {
  interface Window {
    electron: ElectronAPI
    api: any
    env: any
    tokenFunctions: any
  }
}
