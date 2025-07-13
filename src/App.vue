<script setup>
import { ref } from 'vue'
import { encodedSvg } from './utils.ts'
import Instance from './Instance.vue'
import Logo from '../images/icon.svg'

const imgSrc = `data:image/svg+xml,${encodedSvg(Logo)}`
const auth0Instances = ref(auth0?.auth0Instances)
</script>

<template>
  <div class="a0-container bg-[--hl-xs] notice surprise">
    <img class="a0-logo" :src="imgSrc" />
    <div v-if="auth0Instances?.length > 0" style="width:100%; padding-left: 5vh; padding-right: 5vh">
      <header class="a0-header border-b border-solid bg-[--color-bg] text-[--hl]">
        <div style="flex: 2;">Domain</div>
        <div style="flex: 1;">Status</div>
        <div style="flex: 2;">Action</div>
      </header>
        <Suspense>
          <Instance v-for="(instance, index) in auth0Instances" :instance :id="index" />
          <template #fallback>
            <div>Loading...</div>
          </template>
        </Suspense>
    </div>
    <div v-else class="a0-header">
      <h1>No Auth0 plugin configuration found.</h1>
    </div>
  </div>
</template>
