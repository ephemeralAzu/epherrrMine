<script setup lang="ts">
import AuthView from './components/AuthView.vue'
import PlayView from './components/PlayView.vue'
import NicknameView from './components/NicknameView.vue'
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
</script>
<script lang="ts">
export default {
  data() {
    return {
      layers: { auth: false, nickname: false, play: false },
      config: <Config>{},
      animation: { enabled: true, text: 'Starting...' }
    }
  },
  methods: {
    async loadingAnim(enabled: boolean, text: string, error: any) {
      let debug = window.electron.process.env.VITE_DEBUG_MODE
      if (debug === 'true') {
        console.log(text)
        console.log(error)
      }
      this.animation.text = text
      this.animation.enabled = enabled
    },

    openWindow(window: string) {
      this.layers.auth = false
      this.layers.play = false
      this.layers.nickname = false
      switch (window) {
        case 'auth':
          this.layers.auth = true
          break
        case 'play':
          this.layers.play = true
          break
        case 'nickname':
          this.layers.nickname = true
          break
      }
    },

    async startupCheck() {
      this.loadingAnim(true, 'Запуск приложения...', {})
      console.log()

      //   this.animation.enabled = true
      //   this.layers = {
      //     token: false,
      //     nickname: false,
      //     play: false,
      //   }
      //   console.log(await window.api.config.get());
      //   //get info from config
      //   this.config = <Config> await window.api.config.get()
      //   if(this.config.player.token.length === 0){
      //     this.showTokenWindow()
      //   }else{
      //     this.loadingAnim(true, "Проверяем токен...")
      //     let interval = setInterval(async () => {
      //       let player = await this.getUserByToken(this.config.player.token)
      //       switch (player) {
      //         //unknown error case
      //         case "ERR_UNEXPECTED":
      //           this.loadingAnim(true, "UNEXPECTED ERROR, CONTACT DEVELOPER!!!")
      //           clearInterval(interval)
      //           break;

      //         //connection error case
      //         case "ERR_CONNECTION":
      //           this.loadingAnim(true, 'It`s takes more time...');
      //           break;

      //         //not founded user case
      //         case false:
      //           clearInterval(interval)
      //           this.loadingAnim(true, 'Bad token in config!!! Removing it...');
      //           window.api.config.resConfig()
      //           this.showTokenWindow()
      //           break;
      //         //default (founded user) case
      //         default:
      //           clearInterval(interval)
      //           console.log(true);
      //           this.config.player = player
      //           await window.api.config.set(JSON.parse(JSON.stringify(this.config)))

      //         ///if player havent nickname
      //           if(this.config.player.nickname.length === 0){
      //             this.showNicknameWindow()
      //             break;
      //           }
      //           /// normal startup
      //           this.showPlayWindow()
      //           break;
      //       }
      //     },1000)
      //   }

      // },
    }
  },
  async mounted() {
    this.openWindow('auth')
    this.loadingAnim(true, 'Запуск приложения...', {})
    // console.log(import.meta.env.VITE_API_URL);
  }
}
</script>

<template>
  <transition name="fade">
    <AuthView v-if="true" @openWindow="openWindow" @loadingAnim="loadingAnim" />
  </transition>
  <transition name="fade">
    <NicknameView v-if="layers.nickname" @openWindow="openWindow" @loadingAnim="loadingAnim" />
  </transition>
  <transition name="fade">
    <PlayView
      v-if="layers.play"
      :config="config"
      @openWindow="openWindow"
      @loadingAnim="loadingAnim"
    />
  </transition>
  <transition name="fade">
    <div class="overlay_loading" v-if="animation.enabled">
      <img src="./assets/output-onlinegiftools(1).gif" alt="" />
      <h2>{{ animation.text }}</h2>
    </div>
  </transition>
</template>
<style lang="scss" scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}
.overlay_loading {
  padding-top: 190px;
  padding-bottom: 195px;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: rgba(0, 0, 0, 0.9);
  img {
    height: 180px;
    margin-bottom: 30px;
  }
}
@import url('https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100..900;1,100..900&display=swap');

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
