<script lang="ts">
export default {
  props: ['openWindow', 'loadingAnim'],
  data() {
    return {
      already_registered: true,
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
    console.log();
    this.user.token = window.user
  // this.$emit('loadingAnim', true, "Проверяем токен...")
  //   this.config = await window.api.config.get()
  //   if(this.config.player.token.length === 0){
  //     this.show = true
  //     this.$emit('loadingAnim', false, "")
  //   }else{
  //     let interval = setInterval(async () => {
  //     let player = await this.checkToken(this.config.player.token)
  //     if(player.err.length !== 0){
  //       switch (player.err) {
  //         case "ERR_UNEXPECTED":
  //         this.$emit('loadingAnim', true, "НЕОПОЗНАННАЯ ОШИБКА!!! СВЯЖИТЕСЬ С РАЗРАБОТЧИКОМ!!!")
  //           clearInterval(interval)
  //           break;
  //         case "ERR_NOT_FOUND":
  //           clearInterval(interval)
  //           this.err = true
  //           this.show = true
  //           this.$emit('loadingAnim', false, 'Неверный токен');
  //           break;
  //         case "ERR_CONNECTION":
  //           this.$emit('loadingAnim', true, 'Еще чуть-чуть...');
  //           break;
  //       }
  //     }else{
  //       player = player.data
  //       this.$emit('loadingAnim', true, 'Токен верный!');
  //       clearInterval(interval)
  //       if(this.config.player !== player){
  //         this.$emit('loadingAnim', true, 'Обновление данных');
  //         await window.api.config.set("player", player)
  //       }
  //       // this.$emit('openWindow', 'nickname');
  //     }

  //   },1000)
  //   }
  },
  methods: {
    async sendToken(token: String) {
      this.$emit('loadingAnim', true, 'Валидация токена...', token)
      this.lock_form = 70
      let data = await window.user.validate(token)
      console.log(data)
      if (data.valid) {
        this.lock_form = 100
        this.$emit('loadingAnim', false, 'Валидация токена...', data)
      } else {
        this.show_error = true
        this.lock_form = 100
        this.$emit('loadingAnim', false, 'Валидация токена...', data)
      }
    },
    async auth(login: string, password: string) {
      this.$emit('loadingAnim', true, 'Выполняется вход...', token)
      this.lock_form = 70
      let data = await window.user.auth(login, password)
      console.log(data)
      if (data.valid) {
        this.lock_form = 100
        this.$emit('loadingAnim', false, 'Выполняется вход...', data)
      } else {
        this.show_error = true
        this.lock_form = 100
        this.$emit('loadingAnim', false, 'Выполняется вход...', data)
      }
    }
    // async insertNewToken(newToken: string){
    //   this.$emit('loadingAnim', true, "Проверяем новый токен...")
    //   let interval = setInterval(async () => {
    //     let player = await this.checkToken(newToken)
    //     if(player.err.length !== 0){
    //       switch (player.err) {
    //         case "ERR_UNEXPECTED":
    //         this.$emit('loadingAnim', true, "НЕОПОЗНАННАЯ ОШИБКА!!! СВЯЖИТЕСЬ С РАЗРАБОТЧИКОМ!!!")
    //           clearInterval(interval)
    //           break;
    //         case "ERR_NOT_FOUND":
    //           clearInterval(interval)
    //           this.err = true
    //           this.show = true
    //           this.$emit('loadingAnim', false, 'Неверный токен');
    //           break;
    //         case "ERR_CONNECTION":
    //           this.$emit('loadingAnim', true, 'Еще чуть-чуть...');
    //           break;
    //       }
    //     }else{
    //       player = player.data
    //       this.$emit('loadingAnim', true, 'Токен верный!');
    //       clearInterval(interval)
    //       await window.api.config.set("player", player)
    //       // this.$emit('openWindow', 'nickname');
    //     }

    //   },1000)
    // },
  }
}
</script>
<template>
  <transition name="fade" mode="out-in">
    <div class="wrapper_token" v-if="!already_registered" @click="show_error = false">
      <h1 class="head_text">Введите одноразовый токен {{ user.token }}</h1>
      <h2 class="error_text" v-show="show_error">Токен не найден или уже использован</h2>
      <form @submit.prevent="sendToken(user.token)">
        <input
          type="text"
          placeholder="Token"
          v-model="user.token"
          required
          :style="'opacity:' + lock_form + '%;'"
          :disabled="100 !== lock_form"
        />
        <button :style="'opacity:' + lock_form + '%;'" v-show="100 == lock_form">
          <img src="../assets/arrow.svg" alt="" />
        </button>
      </form>
      <h1 class="switch_text" v-show="100 == lock_form" @click="already_registered = true">
        Уже смешарик?
      </h1>
    </div>
  </transition>

  <transition name="fade" mode="out-in">
    <div class="wrapper_token login" v-if="already_registered" @click="show_error = false">
      <h1 class="head_text">Введите учетные данные</h1>
      <h2 class="error_text" v-show="show_error">Неверный логин или пароль</h2>

      <form @submit.prevent="insertNewToken(token)">
        <input
          type="text"
          placeholder="Login"
          v-model="user.login"
          required
          :style="'opacity:' + lock_form + '%;'"
          :disabled="100 !== lock_form"
        />
        <input
          type="password"
          placeholder="Password"
          v-model="user.password"
          required
          :style="'opacity:' + lock_form + '%;'"
          :disabled="100 !== lock_form"
        />
        <button :style="'opacity:' + lock_form + '%;'" v-show="100 == lock_form">
          <img src="../assets/arrow.svg" alt="" />
        </button>
      </form>

      <h1
        class="switch_text"
        :style="'opacity:' + lock_form + '%;'"
        v-show="100 == lock_form"
        @click="already_registered = false"
      >
        Еще не смешарик?
      </h1>
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
      width: 80%;
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
