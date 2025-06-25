<script lang="ts">
import { emit } from 'process'

export default {
  props: ['release'],
  data() {
    return {
        info: {
            notes: [],
            version: "",
            channel: ""
        }
    }
  },
  async mounted() {
    this.info.version = this.release.version
    this.info.channel = this.release.channel
    this.info.notes = this.release.notes.split(";")
  },
  methods: {
    
  }
}
</script>
<template>
    <div class="release">
        <h1>Обновление {{ info.version }} установлено!</h1>
        <h2>Канал данного обновления: {{ info.channel }}</h2>
        <div class="notes">
            <h3>Список изменений:</h3>
            <h4 v-for="(item, index) in info.notes" :key="index">- {{ item }}</h4>
        </div>
        
        <button @click="$emit('openWindow', 'auth')">ОК</button>
    </div>
    
</template>
<style lang="scss" scoped>
.release{
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    h1{
        margin-top: 30px;
    }
    .notes{
        h3{
            font-size: 24px;
        }
        h4{
            font-size: 20px;
        }
        display: flex;
        flex-direction: column;
        justify-content: start;
        align-items: start;
        width: 100%;
        margin-top: 20px;
    }
    button{
        width: 140px;
        height: 45px;
        font-size: 24px;
        font-family: montserrat;
        font-weight: 700;
        border: none;
        margin-top: 50px;
        background-color: #c4c4c4;
        cursor: pointer;
        box-shadow: black 0 0 5px 0;
        transition: 0.3s;
        &:hover{
            transition: 0.3s;
            background-color: #c4c4c4;
            box-shadow: rgb(255, 255, 255) 0 0 5px 0;
        }
    }
}
</style>
