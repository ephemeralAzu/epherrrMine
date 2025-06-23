<script setup lang="ts">
const fs = window.api.fs
</script>
<script lang="ts">
export default {
  props: ['config', 'startupCheck'],
  data() {
    return {
      changeNick: {
        value: '',
        isOn: false,
        err: '',
        color: 'green'
      }
    }
  }
  //   methods: {
  //     async updateNick(nick){
  //       let player = this.config.user
  //       player.nickname = nick
  //       if(await confirm("Change Nickname to " + nick + "? !!!You lose Your progress on servers, until You change nickname back!!!")){
  //         await axios.put(apiUrl + `/player/nickname/`, player)
  //             .then((response) => {
  //               console.log(typeof response.data)
  //               if(typeof response.data == "object"){
  //                 this.changeNick.err = "done"
  //                 this.changeNick.color = "green"
  //                 let config = window.api.fs.readFileSync(window.api.env.cfg, {encoding: "utf8"}, (err, data) => {return data})
  //                   config = JSON.parse(<any>config)
  //                   config.user.nickname = nick
  //                   console.log(config)
  //                   window.api.fs.writeFileSync(confFile, JSON.stringify(config))
  //                   this.$emit('startCheck')
  //               }else{
  //                 this.changeNick.err = "taken"
  //                 this.changeNick.color = "red"
  //               }
  //             });
  //       }
  //     },
  //     async exitAcc(){
  //       if(await confirm("You want to leave account?")){
  //         let config = await window.api.fs.readFileSync(window.api.env.cfg, {encoding: "utf8"}, (err, data) => {return data})
  //           config = JSON.parse(<any>config)
  //           config.user.token = ""
  //           config.user.nickname = ""
  //           config.user.uuid = ""
  //           console.log(config)
  //           window.api.fs.writeFileSync(window.api.env.cfg, JSON.stringify(config))
  //           this.$emit('startCheck')
  //     }
  //   },
  // }
}
</script>
<template>
  <div class="overlay_player">
    <h1 v-if="changeNick.err === 'done'" :style="'color: ' + changeNick.color">Done!</h1>
    <h1 v-if="changeNick.err === 'taken'" :style="'color: ' + changeNick.color">
      Nick already taken
    </h1>
    <form
      class="change_nickname"
      @submit.prevent="updateNick(changeNick.value)"
      @click="changeNick.err = ''"
    >
      <h1 v-if="!changeNick.isOn" @click="changeNick.isOn = true">Change Nickname</h1>
      <input
        v-if="changeNick.isOn"
        type="text"
        minlength="3"
        required
        placeholder="New Nickname"
        v-model="changeNick.value"
      />
      <button v-if="changeNick.isOn">Ok</button>
    </form>
    <h1 @click="exitAcc()" class="exit_btn">Logout</h1>
  </div>
</template>
<style lang="scss">
.overlay_player {
  width: 50%;
  height: 50%;
  background-color: #444753;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  z-index: 2;
  .change_nickname {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 60%;
    height: 35px;
    margin-bottom: 70px;
    h1 {
      font-family: Montserrat;
      text-align: center;
      font-size: 24px;
      font-weight: 600;
      padding: 0px 10px;
      width: 100%;
      height: 35px;
      background-color: #6d6f7d;
      box-shadow: 0px 0px 6px 0px #32333a;
      transition: 0.3s;
      border-radius: 2px;
      &:hover {
        background-color: rgb(142, 144, 158);
        box-shadow: 0px 0px 10px 0px #545561;
        font-family: Montserrat;
        font-size: 24px;
        font-weight: 700;
        color: #444753;
      }
      &:active {
        transition: 0.3s;
        background: rgb(186, 187, 194);
        color: #32343d;
      }
    }
    input {
      width: 80%;
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
    button {
      width: 20%;
      height: 35px;
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
      font-family: montserrat;
      font-weight: 700;
      fon &:hover {
        background: rgb(142, 144, 158);
      }
      &:active {
        transition: 0s;
        background: rgb(197, 198, 206);
      }
    }
  }
  .exit_btn {
    height: 35px;
    width: 120px;
    font-family: Montserrat;
    text-align: center;
    font-size: 24px;
    font-weight: 600;
    padding: 0px 10px;
    background-color: #6d6f7d;
    box-shadow: 0px 0px 6px 0px #32333a;
    transition: 0.3s;
    border-radius: 2px;
    &:hover {
      background-color: rgb(0, 0, 0);
      box-shadow: 0px 0px 10px 0px #770006;
      font-family: Montserrat;
      font-size: 24px;
      font-weight: 700;
      color: #ffffff;
    }
    &:active {
      transition: 0.3s;
      background: rgb(255, 0, 0);
      color: #000000;
    }
  }
}
</style>
