//@ts-ignore
import { ElectronAPI } from '@electron-toolkit/preload'

declare global {
  interface Window {
    electron: ElectronAPI
    auth: any
    env: any
    tokenFunctions: any
  }
}
