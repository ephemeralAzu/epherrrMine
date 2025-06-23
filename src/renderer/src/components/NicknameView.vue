<script lang="ts">
export default {
  props: ['openWindow', 'loadingAnim'],
  data() {
    return {
      config: <Config>{
        player: <Player>{ id: 0, token: '', nickname: '', uuid: '', role: '' },
        params: <Params>{ ram: { min: 4, max: 6 }, packsPath: '' },
        packs: new Array<ModPack>()
      },
      show: false,
      err: false
    }
  }
  // async mounted() {
  //   this.$emit('loadingAnim', true, "Верифицируем никнейм...")
  //   this.config = await window.api.config.get()
  //   let interval = setInterval(async () => {
  //     let player = await this.getPlayer(this.config.player.token)
  //     if(player.err.length !== 0){
  //       switch (player.err) {
  //         case "ERR_UNEXPECTED":
  //           this.$emit('loadingAnim', true, "НЕОПОЗНАННАЯ ОШИБКА!!! СВЯЖИТЕСЬ С РАЗРАБОТЧИКОМ!!!")
  //           clearInterval(interval)
  //           break;
  //         case "ERR_NOT_FOUND":
  //           clearInterval(interval)
  //           this.err = true
  //           this.$emit('loadingAnim', false, 'Неверный токен');
  //           this.$emit('openWindow', 'token');
  //           break;
  //         case "ERR_CONNECTION":
  //           this.$emit('loadingAnim', true, 'Еще чуть-чуть...');
  //           break;
  //         }
  //     }else{
  //       this.$emit('loadingAnim', true, 'Ого! Я нашел тебя)');
  //       clearInterval(interval)

  //       if(player.resp.nickname.length == 0){
  //         this.show = true
  //         this.$emit('loadingAnim', false, 'Требуется ввести никнейм');
  //         clearInterval(interval)
  //       }else{
  //         console.log(player.resp);
  //         await window.api.config.set("player", player.resp)
  //         clearInterval(interval)
  //         this.$emit('openWindow', 'play');
  //       }
  //     }
  //   },700)
  // },
  // methods: {
  //   async getPlayer(token: String) {
  //     let resp = <AxiosResponse> {}
  //       try {
  //         await axios.get(window.api.env.url + `/player/`+ token).then((response) => {resp = response});
  //       } catch (error) {
  //         console.log(error);
  //         return {err: "ERR_CONNECTION", resp: {}}
  //       }
  //       if(resp.status !== 200){
  //         return {err: "ERR_UNEXPECTED", resp: {}}
  //       }else{
  //         if(resp.data){
  //           return {err: "", resp: resp.data}
  //         }else{
  //           return {err: "ERR_NOT_FOUND", resp: {}}
  //         }
  //       }
  //   },
  //   async postNickname(){
  //     this.$emit('loadingAnim', true, 'Отправляем новый никнейм');
  //     let player = {token: this.config.player.token, nickname: this.config.player.nickname, uuid: window.api.uuid(), role: this.config.player.role}
  //     await axios.post(window.api.env.url + `/player/nickname/`, player).then(async (response) => {
  //       if((typeof response.data) !== "boolean"){
  //         this.$emit('loadingAnim', true, 'Никнейм принят');
  //         player = response.data
  //         await window.api.config.set("player", player)
  //         this.$emit('openWindow', 'play');
  //       }else{
  //         this.err = true
  //         this.$emit('loadingAnim', false, 'Никнейм уже занят');
  //       }
  //     });
  //   }
  // },
}
</script>
<template>
  <div class="wrapper_nickname" v-if="show">
    <h1 class="head_text">Введите никнейм</h1>
    <h2 v-if="err">{{ config.player.nickname }} уже занят!!!</h2>
    <form @submit.prevent="postNickname()" @click="err = false">
      <input type="text" placeholder="Никнейм" v-model="config.player.nickname" />
      <button><img src="../assets/arrow.svg" alt="" /></button>
    </form>
  </div>
</template>
<style lang="scss">
.wrapper_nickname {
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  .head_text {
    color: rgb(255, 255, 255);
    font-family: Montserrat;
    font-size: 36px;
    font-weight: 700;
    line-height: 44px;
    letter-spacing: 0px;
    text-align: center;
    margin-bottom: 100px;
  }
  h2 {
    color: rgb(172, 38, 38);
    font-family: Montserrat;
    font-size: 24px;
    font-weight: 700;
    line-height: 44px;
    letter-spacing: 0px;
    text-align: center;
    margin-top: 20%;
  }
  form {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    input {
      width: 80%;
      height: 50px;
      font-family: Montserrat;
      font-size: 20px;
      color: white;
      border: none;
      border-radius: 2px;
      border-top-right-radius: 0px;
      border-bottom-right-radius: 0px;
      background: rgb(57, 58, 69);
      padding-left: 10px;
      outline: none;
      border: none;
      outline-offset: 0;
    }
    button {
      width: 50px;
      height: 50px;
      border: none;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 2px;
      border-top-left-radius: 0px;
      border-bottom-left-radius: 0px;
      background: rgb(109, 111, 125);
      transition: 0.3s;
      outline: none;
      border: none;
      outline-offset: 0;
      &:hover {
        background: rgb(142, 144, 158);
      }
      &:active {
        transition: 0s;
        background: rgb(197, 198, 206);
      }
    }
  }
}
</style>
