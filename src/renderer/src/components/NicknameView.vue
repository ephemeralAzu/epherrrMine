<script lang="ts">
import { Player, ModPack } from '@renderer/env';
import { Config, Params } from 'electron';

export default {
  props: ['openWindow', 'loadingAnim'],
  data() {
    return {
      config: <Config>{
        player: <Player>{ id: 0, token: '', nickname: '', uuid: '', role: '' },
        params: <Params><unknown>{ ram: { min: 4, max: 6 }, packsPath: '' },
        packs: new Array<ModPack>()
      },
      show: false,
      err: false
    }
  },
  async mounted() {
    this.$emit('loadingAnim', false, "Верифицируем никнейм...")
    console.log(await window.auth.get("aaa"));
  },
  methods: {
  }
}
</script>
<template>
  <div class="wrapper_nickname">
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
      width: 40%;
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
      cursor: pointer;
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
