<script lang="ts">
export default {
  props: ['openWindow', 'loadingAnim'],
  data() {
    return {
        percent: 0
    }
  },
  mounted() {
    let interval = setInterval(()=>{
        let percent = window.update.getPercentOfDownload()
        if(percent == -1) interval.unref()
        this.percent = percent
    }, 100)
  },
  methods: {
    
  }
}
</script>
<template>
    <div class="update">
      <h1>Производится загрузка новой версии приложения.</h1>
      <h2>Обновление установится автоматически, если приложение не запустится самостоятельно...      Помогите ему)</h2>
      <h3>{{ percent }}%</h3>
      <div class="progress_bar">
        <div class="bar" :style="'width: ' + percent + '%;'"></div>
      </div>
    </div>
</template>
<style lang="scss" scoped>
.update{
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    .progress_bar{
        display: flex;
        justify-content: start;
        width: 800px;
        margin-top: 50px;
        border-color: aliceblue;
        border-width: 2px;
        border-radius: 5px;
        border-style:groove;
        
        .bar{
            height: 30px;
            border-radius: 2px;
            background-color: rgb(2, 194, 2);
        }
    }
    h1{
        margin-top: 100px;
        font-size: 36px;
        text-align: center;
    }
    h2{
        margin-top: 10px;
        font-size: 16px;
        text-align: center;
    }
    h3{
        margin-top: 50px;
        font-size: 36px;
        text-align: center;
    }
}
</style>
