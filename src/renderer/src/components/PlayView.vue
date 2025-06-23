<script lang="ts">
import { Player, ModPack, Params, Config } from '../env'
export default {
  props: ['loadingAnim'],
  data() {
    return {
      selectedPack: <ModPack>{},
      modPacks: new Array<ModPack>(),
      cfgDir: '',
      cacheDir: '',
      packsDir: '',
      MPDir: '',
      overlays: { player: false, params: false, pack: false },
      download: { progress: 0 },
      packsCfg: new Array<ModPack>(),
      config: <Config>{
        params: <Params>{ ram: { min: 4, max: 6 }, packsPath: '' },
        player: <Player>{ id: 0, token: '', nickname: '', uuid: '', role: '' },
        packs: new Array<ModPack>()
      }
    }
  }
  // async mounted() {
  //   this.$emit('loadingAnim', true, 'Ищем сборки...');
  //   this.config = await window.api.config.get()

  //   //получаем установленные сборки
  //   let installedPacks = await this.getInstalledPacks()

  //   //получаем сборки с сервера
  //   let interval = setInterval(async () => {
  //     let onlinePacks = await this.getOnlinePacks()
  //       if(onlinePacks.err.length !== 0){
  //         switch (onlinePacks.err) {
  //           case "ERR_UNEXPECTED":
  //             this.$emit('loadingAnim', true, "НЕОПОЗНАННАЯ ОШИБКА!!! СВЯЖИТЕСЬ С РАЗРАБОТЧИКОМ!!!")
  //             clearInterval(interval)
  //             break;
  //           case "ERR_NOT_FOUND":
  //             clearInterval(interval)
  //             this.$emit('loadingAnim', true, 'Сборки отсутствуют (так не должно быть)');
  //             break;
  //           case "ERR_CONNECTION":
  //             this.$emit('loadingAnim', true, 'Еще чуть-чуть...');
  //             break;
  //           }
  //       }else{
  //         this.$emit('loadingAnim', false, '');
  //         clearInterval(interval)
  //       }
  //     },700)
  //   // //read launcher config
  //   // this.config = <Config> await window.api.config.get()
  //   //   //getting online ModPacks
  //   // let interval = setInterval(async () => {
  //   //     let onlinePacks = await this.getOnlinePacks()
  //   //     let installedPacks = await window.api.config.get()
  //   //     console.log(installedPacks);
  //   //     switch (onlinePacks) {
  //   //       case "ERR_UNEXPECTED":
  //   //         this.$emit('loadingAnim', true, "НЕОПОЗНАННАЯ ОШИБКА!!! СВЯЖИТЕСЬ С РАЗРАБОТЧИКОМ!!!")
  //   //         clearInterval(interval)
  //   //         break;
  //   //       case "ERR_CONNECTION":
  //   //         this.$emit('loadingAnim', true, 'Еще чуть-чуть...');
  //   //         break;
  //   //       default:
  //   //         clearInterval(interval)
  //   //         this.$emit('loadingAnim', true, 'Ищем установленные сборки...');
  //   //         break;
  //   //     }
  //   //   },700)
  //     // await onlinePacks.forEach((onlinePack: ModPack) => {
  //     //         let installedOnlinePack: ModPack = installedPacks.find((installedPack: ModPack) => installedPack.id === onlinePack.id)
  //     //         if(typeof installedOnlinePack === "undefined"){
  //     //           onlinePack.installed = false
  //     //           if(onlinePack.abandoned !== true || this.config.player.role !== "default"){
  //     //             parsedModPacks.push(onlinePack)
  //     //           }
  //     //         }else{
  //     //           onlinePack.installed = true
  //     //           if(onlinePack.abandoned !== true){
  //     //             parsedModPacks.push(onlinePack)
  //     //           }
  //     //         }
  //     //         console.log(onlinePack);
  //     //       })
  //     //       this.modPacks = parsedModPacks
  //     //       this.$emit('loadingAnim', false, 'done');
  //   //получить установленные паки
  //   //вычеслить не установленные паки
  // //animation

  //   // //creating ModPacks config
  //   // if(!window.api.fs.existsSync(window.api.env.root + "\\packs.json")){
  //   //   await window.api.fs.writeFileSync(window.api.env.root + "\\packs.json", "[{}]")
  //   //   this.packsCfg = []
  //   // }else{
  //   //   try {
  //   //     //reading ModPack config
  //   //     let installedPacks = await window.api.fs.readFileSync(window.api.env.root + "\\packs.json", {encoding: "utf8"})
  //   //     return JSON.parse(installedPacks)
  //   //   } catch (error) {
  //   //     //If reading error - create new config
  //   //       this.$emit('loadingAnim', false, "Failed to read packs config!!!")
  //   //       await window.api.fs.writeFileSync(window.api.env.root + "\\packs.json","[{}]")
  //   //       console.log(error);
  //   //       return [];
  //   //     }
  //   // }

  // },
  // methods: {
  //   async getOnlinePacks(){ //getting it from server
  //     let resp = <AxiosResponse> {}
  //         try {
  //           await axios.get(window.api.env.url + `/modpacks/`+ this.config.player.token).then((response) => {resp = response});
  //         } catch (error) {
  //           console.log(error);
  //           return {err: "ERR_CONNECTION", resp: {}}
  //         }
  //         if(resp.status !== 200){
  //           return {err: "ERR_UNEXPECTED", resp: {}}
  //         }else{
  //           if(resp.data){
  //             return {err: "", resp: resp.data}
  //           }else{
  //             return {err: "ERR_NOT_FOUND", resp: {}}
  //           }
  //         }
  //   },
  //   async getInstalledPacks(){ //info about installed packs
  //     let config = await window.api.config.get()
  //     return config.packs
  //     },
  //     //download ModPack ZIP adn writing it to cache
  //     async downloadZip(modPack: ModPack){

  //     },
  //     //download modpack BASE
  //     async downloadPack(modPack: ModPack){

  //     },
  //     //fetching update and download
  //     async getUpdate(modPack: ModPack){

  //     },
  //     async getLoader(MPName){
  //     let response = <any>await fetch(this.apiUrl + "/loader/" + MPName);
  //         const reader = response.body.getReader();
  //         const contentLength = response.headers.get('Content-Length');
  //         let percent,receivedLength = 0; // received that many bytes at the moment
  //         let chunks = []; // array of received binary chunks (comprises the body)
  //       while(true) {
  //         const {done, value} = await reader.read();

  //         if (done) {
  //           let blob = new Blob(chunks);
  //           let zip = window.api.buffer(await blob.arrayBuffer())
  //           switch (modPack.loader) {
  //             case "fabric":
  //               if(!window.api.fs.existsSync(this.config.params.packsPath + "\\cache\\fabric")){window.api.fs.mkdirSync(this.config.params.packsPath + "\\cache\\fabric")}
  //               await window.api.fs.writeFileSync(this.config.params.packsPath + "\\cache\\" + modPack.loader + "\\" + modPack.loader + "-" + modPack.version + "-" + modPack.loader_ver +".json", zip)
  //               break;
  //             case "forge":
  //               if(!window.api.fs.existsSync(this.config.params.packsPath + "\\cache\\forge")){window.api.fs.mkdirSync(this.config.params.packsPath + "\\cache\\forge")}
  //               await window.api.fs.writeFileSync(this.config.params.packsPath + "\\cache\\" + modPack.loader + "\\" + modPack.loader + "-" + modPack.version + "-" + modPack.loader_ver +".jar", zip)
  //               break;
  //           }
  //           this.download.progress = 0
  //           break;
  //         }

  //         chunks.push(<never>value);
  //         receivedLength += value.length;
  //         if(percent !== Math.round(receivedLength / (contentLength / 100))){
  //           percent = Math.round(receivedLength / (contentLength / 100))
  //           this.download.progress = percent
  //         }
  //       }
  //     },
  //       async Start(){
  //       },
  //       selectModpack(id: number){
  //         // this.selectedPack = this.availablePacks[id]
  //         this.overlays.pack = true
  //       },
  //       showParams(){
  //         this.overlays.params = true
  //         this.overlays.player = false
  //         this.overlays.pack = false
  //       },
  //       showPlayer(){
  //         this.overlays.params = false
  //         this.overlays.player = true
  //         this.overlays.pack = false
  //       }
  //   },
}
</script>
<script setup lang="ts">
import PlayerOverlay from './PlayerOverlay.vue'
import ParamsOverlay from './ParamsOverlay.vue'
</script>
<template>
  <div class="wrapper">
    <transition name="fade">
      <div class="overlays" v-if="overlays.player || overlays.params">
        <img
          src="../assets/cross.svg"
          alt=""
          @click="
            overlays.player = false;
            overlays.params = false
          "
        />
        <PlayerOverlay
          :config="config"
          @startCheck="
            () => {
              $emit('startCheck')
            }
          "
          v-if="overlays.player"
        />
        <ParamsOverlay
          :config="config"
          @startCheck="
            () => {
              $emit('startCheck')
            }
          "
          v-if="overlays.params"
        />
      </div>
    </transition>
    <transition name="fade">
      <div class="packs_list">
        <div
          class="modpack_ico"
          :style="' --color-primary: #' + modPack.color"
          v-for="(modPack, index) in modPacks"
          :key="index"
        >
          <h1></h1>
        </div>
      </div>
    </transition>
    <transition name="fade">
      <div
        class="selected_pack"
        id="selected"
        :style="' --color-primary: #' + selectedPack.color + ';'"
        v-if="overlays.pack"
      >
        <div class="sel_pack__left">
          <img src="../assets/arrow2.svg" alt="" @click="overlays.pack = false" />
          <h4>{{ selectedPack.full_name }}</h4>
        </div>

        <div class="sel_pack__description">
          <h1>{{ selectedPack.full_name }} - {{ selectedPack.version }}</h1>
          <h2 v-if="!selectedPack.onServer" style="color: red">
            This ModPack is deprecated!!! Server for it is not exist!
          </h2>
          <h2>{{ selectedPack.name }}</h2>
          <h3>{{ selectedPack.description }}</h3>
        </div>
      </div>
    </transition>
    <div class="info_sect" :style="' --color-primary: white'">
      <div
        class="debug_sect"
        v-if="config.player.role === 'admin' || config.player.role === 'debugger'"
      >
        <h2></h2>
      </div>
    </div>
    <div class="control_sect" :style="' --color-primary: white'">
      <div class="player_btn" @click="showPlayer()">
        <h1>{{ config.player.nickname }}</h1>
      </div>
      <!-- <div class="play_btn" v-if="!overlays.pack">
         <h1 >Select modpack</h1>
        </div> -->
      <!-- <div class="play__sect_selected"  @click="Start()" v-if="overlays.pack && selectedPack.installed && !download.progress" :style="' --color-primary: #' + selectedPack.color + ';'">
         <h2 v-if="overlays.pack">Start</h2>
         <h3 v-if="overlays.pack">{{selectedPack.full_name}}</h3>
       </div>
       <div class="play__sect_selected"  @click="downloadPack(selectedPack)" v-if="overlays.pack && !selectedPack.installed && !download.progress" :style="' --color-primary: #' + selectedPack.color + '; filter: saturate(0.1);'">
         <h2 v-if="!download.progress">Install</h2>
         <h3 v-if="!download.progress">{{selectedPack.full_name}}</h3>
       </div>
       <div class="play__sect_selected install" v-if="overlays.pack && download.progress" :style="' --color-primary: #' + selectedPack.color + '; background-color: #32333a;'">
         <div class="progress_bar" :style="' --color-primary: #' + selectedPack.color + '; width: ' + download.progress + '%;'"></div>
       </div> -->
      <div class="config_btn" @click="showParams()">
        <div class="config_btn_line"></div>
        <div class="config_btn_line"></div>
        <div class="config_btn_line"></div>
      </div>
    </div>
  </div>
</template>
<style lang="scss">
.wrapper {
  height: auto;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: end;
  justify-content: start;
  .overlays {
    position: absolute;
    height: 100vh;
    width: 150vh;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    img {
      width: 30px;
      margin-left: -20px;
      margin-right: 20px;
      margin-bottom: 350px;
      cursor: pointer;
    }
  }
  .packs_list {
    display: flex;
    flex: wrap;
    align-items: center;
    justify-content: start;
    width: 100%;
    height: 285px;
    .modpack_ico {
      width: 150px;
      height: 150px;
      background-color: var(--color-primary);
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 30px;
      h1 {
        width: 150px;
        font-family: Montserrat;
        font-size: 50px;
        font-weight: 700;
        line-height: 30px;
        letter-spacing: -2px;
        text-align: center;
        white-space: pre-wrap;
        word-break: break-word;
      }
      transition: 0.3s;
      box-shadow: 0 0 5px 1px var(--color-primary);
      &:hover {
        box-shadow: 0 0 5px 0px var(--color-primary);
      }
      &:active {
        transition: 0.1s;
        box-shadow: 0 0 5px 2px var(--color-primary);
      }
    }
  }
  .info_sect {
    display: flex;
    background-color: #545763;
    height: 250px;
    width: 100%;
    box-shadow: 0px 5px 20px 5px var(--color-primary);
  }
  .control_sect {
    width: 100%;
    height: 100px;
    padding: 0 30px;
    background-color: #444753;
    box-shadow: 0px 5px 20px 0px black;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .player_btn {
      width: 180px;
      height: 50px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 10px;
      background-color: #6d6f7d;
      box-shadow: 0px 0px 6px 0px #32333a;
      h1 {
        font-family: Montserrat;
        font-size: 20px;
        font-weight: 500;
        color: #dbdce0;
      }
      transition: 0.3s;
      &:hover {
        background: rgb(142, 144, 158);
        box-shadow: 0px 0px 10px 0px #545561;
        h1 {
          font-family: Montserrat;
          font-size: 20px;
          font-weight: 700;
          color: #444753;
        }
      }
      &:active {
        transition: 0.3s;
        background: rgb(163, 164, 172);
        h1 {
          font-family: Montserrat;
          font-size: 20px;
          font-weight: 700;
          color: #32343d;
        }
      }
    }
    .play__sect {
      height: 75px;
      width: 275px;
      background-color: #6d6f7d;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      box-shadow: 0px 0px 6px 0px #32333a;
      transition: 0.3s;
      h1 {
        transition: 0.3s;
        font-family: Montserrat;
        font-size: 28px;
        font-weight: 400;
      }
      &:hover {
        background: rgb(142, 144, 158);
        box-shadow: 0px 0px 10px 0px #545561;
        h1 {
          font-family: Montserrat;
          font-size: 28px;
          font-weight: 700;
          color: #444753;
        }
      }
      &:active {
        background: rgb(163, 164, 172);
        h1 {
          font-family: Montserrat;
          font-size: 28px;
          font-weight: 700;
          color: #32343d;
        }
      }
    }
    .play__sect_selected {
      height: 75px;
      width: 275px;
      background-color: var(--color-primary);
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      box-shadow: 0px 0px 6px 0px #32333a;
      transition: 0.3s;
      h2 {
        transition: 0.3s;
        font-family: Montserrat;
        font-size: 28px;
        font-weight: 500;
        height: 35px;
      }
      h3 {
        transition: 0.3s;
        font-family: Montserrat;
        font-size: 20px;
        font-weight: 400;
        height: 35px;
      }
      &:hover {
        box-shadow: 0px 0px 10px 0px var(--color-primary);
        h2 {
          font-family: Montserrat;
          font-size: 28px;
          font-weight: 700;
        }
        h3 {
          font-family: Montserrat;
          font-weight: 500;
        }
      }
      &:active {
        background: rgb(163, 164, 172);
        box-shadow: 0px 0px 10px 0px rgb(163, 164, 172);
        h2 {
          font-family: Montserrat;
          font-size: 28px;
          font-weight: 700;
          color: #32343d;
        }
        h3 {
          font-family: Montserrat;
          font-weight: 500;
          color: #32343d;
        }
      }
    }
    .config_btn {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 50px;
      width: 50px;
      background-color: #6d6f7d;
      margin-left: 130px;
      transition: 0.3s;
      box-shadow: 0px 0px 6px 0px #32333a;
      .config_btn_line {
        height: 4px;
        width: 35px;
        margin: 5px 0px;
        border-radius: 10px;
        background-color: rgb(185, 186, 192);
        transition: 0.3s;
      }
      transition: 0.3s;
      &:hover {
        background: rgb(142, 144, 158);
        box-shadow: 0px 0px 10px 0px #545561;
        .config_btn_line {
          width: 35px;
          margin: 5px 0px;
          border-radius: 10px;
          background-color: #444753;
          transition: 0.3s;
        }
      }
      &:active {
        background: rgb(163, 164, 172);
        .params__sect__line {
          width: 35px;
          margin: 5px 0px;
          border-radius: 10px;
          background-color: #2e3036;
          transition: 0.3s;
        }
      }
    }
  }
  .debug_sect {
    width: 100%;
    height: 20px;
    padding: 0 10px;
    background-color: #c0c1c5;
    display: flex;
  }
  .install {
    display: flex !important;
    justify-content: start !important;
    align-items: start !important;
    width: 100%;
    .progress_bar {
      height: 100%;
      background-color: var(--color-primary);
    }
  }
  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.3s;
  }
  .fade-enter-from,
  .fade-leave-to {
    opacity: 0;
  }
}
</style>
