<script setup lang="ts">
const fs = window.api.fs
interface Player {
  id: number
  token: string
  nickname: string
  uuid: string
}
interface Config {
  user: Player
  params: {
    ram: {
      min: number
      max: number
    }
    packsPath: String
  }
}
</script>
<script lang="ts">
const apiUrl = 'https://mine.epher.su'
export default {
  props: ['startupCheck'],
  data() {
    return {
      maxRam: 4,
      config: <Config>{
        user: <Player>{ id: 0, token: '', nickname: '', uuid: '' },
        params: {
          ram: { min: 4, max: 6 },
          packsPath: this.defaultRootDir + '\\packs'
        }
      }
    }
  },
  methods: {
    changeDir() {
      let newPath = ''
      window.electron.ipcRenderer.invoke('showDialog', ['openDirectory']).then((response) => {
        this.config = JSON.parse(
          window.api.fs.readFileSync(window.api.env.cfg, { encoding: 'utf8' })
        )
        newPath = response.filePaths[0]
        this.config.params.packsPath = newPath
        window.api.fs.writeFileSync(window.api.env.cfg, JSON.stringify(this.config))
        // this.$emit('startCheck')
      })
    },
    changeRam() {
      if (this.maxRam < 4) {
        this.maxRam = 4
      }
      this.config = JSON.parse(window.api.fs.readFileSync(window.api.env.cfg, { encoding: 'utf8' }))
      this.config.params.ram.max = this.maxRam
      window.api.fs.writeFileSync(window.api.env.cfg, JSON.stringify(this.config))
    }
  },
  async mounted() {
    this.maxRam = this.config.params.ram.max
    this.config = {
      user: <Player>{ id: 0, token: '', nickname: '', uuid: '' },
      params: {
        ram: { min: 4, max: 6 },
        packsPath: window.api.env.root + '\\packs'
      }
    }
    this.config = <Config>(
      JSON.parse(await window.api.fs.readFileSync(window.api.env.cfg, { encoding: 'utf8' }))
    )
    console.log(this.config)
  }
}
</script>
<template>
  <div class="overlay_params">
    <div class="ram">
      <h1>Max RAM:</h1>
      <input type="number" min="4" max="32" v-model="maxRam" @change="changeRam()" />
      <h2>Gb</h2>
    </div>
    <div class="path">
      <div class="upper">
        <h1>Current packs path:</h1>
        <h3 @click="changeDir()">change</h3>
      </div>
      <h2>{{ config.params.packsPath }}</h2>
    </div>
  </div>
</template>
<style lang="scss">
.overlay_params {
  width: 50%;
  height: 50%;
  background-color: #9498aa;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  .ram {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    h1 {
      font-family: montserrat;
      height: 40px;
      font-weight: 700;
      font-size: 24px;
      margin-right: 10px;
    }
    h2 {
      font-family: montserrat;
      height: 40px;
      font-weight: 700;
      font-size: 24px;
      margin-left: 5px;
    }
    input {
      width: 50px;
      height: 35px;
      font-family: Montserrat;
      font-size: 20px;
      color: white;
      border: none;
      border-radius: 3px;
      background: rgb(49, 50, 54);
      padding-left: 10px;
      outline: none;
      border: none;
      outline-offset: 0;
    }
  }
  .path {
    width: 100%;
    padding: 15px;
    display: flex;
    align-items: start;
    justify-content: center;
    flex-direction: column;
    .upper {
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 100%;
      h3 {
        font-family: montserrat;
        height: 30px;
        font-weight: 700;
        font-size: 24px;
        margin-right: 10px;
        background: rgb(49, 50, 54);
        border-radius: 3px;
        padding: 0 10px;
        transition: 0.3s;
        line-height: 30px;
        &:hover {
          background: rgb(68, 69, 73);
        }
        &:active {
          transition: 0s;
          background: rgb(118, 118, 119);
          color: rgb(51, 49, 49);
        }
      }
    }
    h1 {
      font-family: montserrat;
      height: 40px;
      font-weight: 700;
      font-size: 24px;
      margin-right: 10px;
    }
    h2 {
      font-family: montserrat;
      height: 40px;
      font-weight: 700;
      font-size: 14px;
      margin-left: 5px;
    }
    input {
      width: 50px;
      height: 35px;
      font-family: Montserrat;
      font-size: 20px;
      color: white;
      border: none;
      border-radius: 2px;
      border-top-right-radius: 0px;
      border-bottom-right-radius: 0px;
      background: rgb(49, 50, 54);
      padding-left: 10px;
      outline: none;
      border: none;
      outline-offset: 0;
    }
  }
}
</style>
