<script setup>
import { ref } from 'vue'

const msg = ref('Hello World!')
</script>

<template>
  <h1>{{ msg }}</h1>
  <hr/>
  <input v-model="msg" style="background-color: #8efcff; color: black"/>
</template>
