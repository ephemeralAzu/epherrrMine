//@ts-ignore
import { ElectronAPI } from '@electron-toolkit/preload'

declare global {
  interface Window {
    electron: ElectronAPI
    update: any,
    config: any
  }
}
