<script lang="ts">
import { Config } from '@renderer/env';

export default {
  props: ['openWindow', 'loadingAnim'],
  data() {
    return {
      user: {
        token: '',
        login: '',
        password: ''
      },
      lock_form: 100,
      show_error: false,
      show: true,
      config: <Config>{}
    }
  },
  async mounted() {
    let token_check = await window.auth.startup()
    //stay on token page
    if(token_check.error && token_check.data == "FIRST_RUN"){
      this.$emit('loadingAnim', false, "Нуловой конфиг. Требуется настройка конфигурации", token_check)
    }
    //stay on token page
    if(token_check.error && token_check.data == "CORRUPTED_CFG"){
      this.$emit('loadingAnim', false, "Конфиг имеет неправильный токен", token_check)
    }
    //open nickname page
    if(!token_check.error && token_check.data == "SUCCESS"){
      this.$emit('loadingAnim', true, "Проверка аккаунта...", token_check)
      this.$emit('openWindow',"nickname")
    }
  },
  methods: {
    async sendToken(token: String) {
      this.$emit('loadingAnim', true, 'Проверка токена...', token)
      let token_check = await window.auth.validate(token)

      //stay on token page
      if(token_check.error && token_check.data == "INCORRECT_TOKEN"){
        this.show_error = true
        this.$emit('loadingAnim', false, 'Токен не принят', token_check)
      }

      //stay on token page
      if(!token_check.error && token_check.data == "SUCCESS"){
        this.show_error = false
        this.$emit('loadingAnim', true, 'Токен принят', token_check)
        this.$emit('openWindow', "nickname")
      }
    },
  }
}
</script>
<template>
  <transition name="fade" mode="out-in">
    <div class="wrapper_token" v-if="!already_registered" @click="show_error = false">
      <h1 class="head_text">Введите ваш токен</h1>
      <h2 class="error_text" v-show="show_error">Токен не найден</h2>
      <form @submit.prevent="sendToken(user.token)">
        <input
          type="text"
          placeholder="Токен"
          v-model="user.token"
          required
          minlength="3"
        />
        <button>
          <img src="../assets/arrow.svg" alt="" />
        </button>
      </form>
    </div>
  </transition>
</template>
<style lang="scss" scoped>
.fade-enter-active,
.fade-leave-active .wrapper_token {
  transition: opacity 0.7s ease;
}
.fade-enter-from,
.fade-leave-to .wrapper_token {
  opacity: 0;
}
.fade-enter-to,
.fade-leave-from .wrapper_token {
  opacity: 1;
}
.wrapper_token {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
  .head_text {
    color: rgb(255, 255, 255);
    font-family: Montserrat;
    font-size: 36px;
    font-weight: 400;
    line-height: 44px;
    letter-spacing: 0px;
    text-align: center;
    margin-top: 200px;
    margin-bottom: 30px;
  }
  .error_text {
    color: rgb(172, 38, 38);
    font-family: Montserrat;
    font-size: 24px;
    font-weight: 700;
    line-height: 44px;
    letter-spacing: 0px;
    text-align: center;
  }
  .switch_text {
    color: rgb(172, 172, 172);
    font-family: Montserrat;
    font-size: 20px;
    font-weight: 400;
    line-height: 44px;
    letter-spacing: 0px;
    text-align: center;
    margin-top: 30px;
    cursor: pointer;
    &:hover {
      color: rgb(255, 255, 255);
    }
  }
  form {
    width: 80%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 10px;
    input {
      width: 50%;
      height: 50px;
      font-family: Montserrat;
      font-size: 20px;
      color: white;
      border: none;
      border-radius: 2px;
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
      outline: none;
      border: none;
      outline-offset: 0;
      cursor: pointer;
      &:hover {
        background: rgb(142, 144, 158);
      }
      &:active {
        background: rgb(197, 198, 206);
      }
    }
  }
}

.login {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  .head_text {
    color: rgb(255, 255, 255);
    font-family: Montserrat;
    font-size: 36px;
    font-weight: 400;
    line-height: 44px;
    letter-spacing: 0px;
    text-align: center;
    margin-top: 150px;
  }
  .error_text {
    color: rgb(172, 38, 38);
    font-family: Montserrat;
    font-size: 24px;
    font-weight: 700;
    line-height: 44px;
    letter-spacing: 0px;
    text-align: center;
    margin-top: 30px;
  }
  .switch_text {
    color: rgb(172, 172, 172);
    font-family: Montserrat;
    font-size: 20px;
    font-weight: 400;
    line-height: 44px;
    letter-spacing: 0px;
    text-align: center;
    margin-top: 30px;
    cursor: pointer;
    &:hover {
      color: rgb(255, 255, 255);
    }
  }
  form {
    width: 70%;
    display: flex;
    align-items: flex-end;
    justify-content: center;
    flex-direction: column;
    gap: 5px;
    margin-top: 10px;
    input {
      width: 100%;
      height: 50px;
      font-family: Montserrat;
      font-size: 20px;
      color: white;
      border: none;
      border-radius: 2px;
      background: rgb(57, 58, 69);
      padding-left: 10px;
      outline: none;
      border: none;
      outline-offset: 0;
    }
    button {
      width: 100px;
      height: 50px;
      border: none;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 2px;
      background: rgb(109, 111, 125);
      outline: none;
      border: none;
      outline-offset: 0;
      &:hover {
        background: rgb(142, 144, 158);
      }
      &:active {
        background: rgb(197, 198, 206);
      }
    }
  }
}
</style>
