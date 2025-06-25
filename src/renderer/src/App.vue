<script setup lang="ts">
import AuthView from './components/AuthView.vue'
import PlayView from './components/PlayView.vue'
import NicknameView from './components/NicknameView.vue'
import UpdateView from './components/UpdateView.vue'
import ReleaseView from './components/ReleaseView.vue'
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
      layers: { current: "update", auth: false, nickname: false, play: false, update: false, release: false },
      config: <Config>{},
      animation: { enabled: true, text: 'Запуск...' },
      release: {error: false, info: {}},
      debugMode: "false",
      randomTexts:[
        "Подгружаем кубики",
        "Ищем аксолотлей",
        "Тралалеро-тра-ла-ла",
        "Приручаем котиков",
        "Готовим тортики",
        "Бегаем от големов",
        "Заперщаем РКН",
        "Сука, как я заебался это писать..."
      ]
    }
  },
  methods: {
    async loadingAnim(enabled: boolean, text: string, error: any) {
      this.debugMode = <any>window.electron.process.env.DEBUG_MODE
      if (this.debugMode) {
        if(text.length > 1) console.log("moved to: " + text.substring(0, text.indexOf(":")))
        if(error.length > 1) console.log(error)
      }
    let mess = text.substring(text.indexOf(":")+1, text.length)
      this.animation.text = mess
      this.animation.enabled = enabled
    },

    openWindow(window: string) {
      if(this.layers.current === window) return;
      this.layers.current = window
      let rnd = Math.random()
      rnd = Math.floor(rnd*10)
      if(rnd > this.randomTexts.length-1)rnd = 1
        switch (window) {
          case 'auth':
            this.loadingAnim(true, window + ": " + this.randomTexts[rnd], "")
            setTimeout(() => {
              this.layers.auth = true
              this.layers.play = false
              this.layers.update = false
              this.layers.release = false
              this.layers.nickname = false
              setTimeout(() => {
                this.loadingAnim(false, "", {})
              }, 250);
            }, 250);
            break
          case 'play':
            this.loadingAnim(true, window + ": " + this.randomTexts[rnd], "")
            setTimeout(() => {
              this.layers.play = true
              this.layers.update = false
              this.layers.release = false
              this.layers.nickname = false
              this.layers.auth = false
              setTimeout(() => {
                this.loadingAnim(false, "", {})
              }, 250);
            }, 250);
            break
          case 'nickname':
            this.loadingAnim(true, window + ": " + this.randomTexts[rnd], "")
            setTimeout(() => {
              this.layers.nickname = true
              this.layers.auth = false
              this.layers.play = false
              this.layers.update = false
              this.layers.release = false
              setTimeout(() => {
                this.loadingAnim(false, "", {})
              }, 250);
            }, 250);
            break
          case 'update':
            this.loadingAnim(true, window + ": " + this.randomTexts[rnd], "")
            setTimeout(() => {
              this.layers.update = true
              this.layers.auth = false
              this.layers.play = false
              this.layers.release = false
              this.layers.nickname = false
              setTimeout(() => {
                this.loadingAnim(false, "", {})
              }, 250);
            }, 250);
            break
          case 'release':
            this.loadingAnim(true, window + ": " + this.randomTexts[rnd], "")
              setTimeout(() => {
              this.layers.release = true
              this.layers.auth = false
              this.layers.play = false
              this.layers.update = false
              this.layers.nickname = false
              setTimeout(() => {
                this.loadingAnim(false, "", {})
              }, 250);
            }, 250);
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
    this.loadingAnim(true, 'Проверка обновлений', {})
    console.log(typeof window.update.getUpdateFlag());
    if(window.update.getUpdateFlag()){
      this.loadingAnim(true, 'Настройка обновлений', {})
      let oldExe = await window.update.getUpdateFlag()
      this.release = await window.update.configureUpdate(oldExe)
      console.log(this.release);
      if(!this.release.error){
        this.openWindow("release")
        return;
      }
      this.openWindow("auth")
    }
    this.loadingAnim(true, 'Запуск приложения...', {})

    if(await window.update.getUpdate()){
      this.openWindow("update")
      window.update.installUpdate()
    }else{
      this.openWindow('auth')
      window.update.setPercentOfDownload(-1)
    }
    }
  }

</script>

<template>
    <div class="debug_section" v-if="debugMode">
    <div class="buttons">
      <button @click="openWindow('auth')">auth</button>
      <button @click="openWindow('release')">release</button>
      <button @click="openWindow('nickname')">nickname</button>
      <button @click="openWindow('update')">update</button>
      <button @click="openWindow('play')">play</button>
    </div>
  </div>
  <transition name="fade">
    <div class="overlay_loading" v-if="animation.enabled">
      <img src="./assets/output-onlinegiftools(1).gif" alt="" />
      <h2>{{ animation.text }}</h2>
    </div>
  </transition>
  <transition name="fade">
    <ReleaseView v-if="layers.release" :release="release.info" @openWindow="openWindow"/>
  </transition>
  <transition name="fade">
    <UpdateView v-if="layers.update" />
  </transition>
  <transition name="fade">
    <AuthView v-if="layers.auth" @openWindow="openWindow" @loadingAnim="loadingAnim" />
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
  top: 0;
  display: flex;
  position: absolute;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: #1b1b1f;
  z-index: 100;
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
.debug_section{
  height: 50px;
  width: 100%;
  top: 0;
  position: absolute;
  z-index: 100;
}
</style>
