<script setup>
import { ref } from 'vue'
import Instance from './Instance.vue'
const auth0Instances = ref(auth0.auth0Instances)
</script>

<template>
  <div class="a0-container bg-[--hl-xs] notice surprise">
    <img class="a0-logo" src="/home/maat/Development/js/auth0/insomnia-auth0/images/icon.svg" />
    <div v-if="auth0Instances.length > 0">
      <header class="a0-header border-b border-solid bg-[--color-bg] text-[--hl]">
        <div>Domain</div>
        <div>Status</div>
        <div>Action</div>
      </header>
      <div v-for="instance in auth0Instances">
        <Suspense>
          <Instance :instance="instance" />
          <template #fallback>
            <div>Loading...</div>
          </template>
        </Suspense>
      </div>
    </div>
    <div v-else class="a0-header">
      <h1>No Auth0 plugin configuration found.</h1>
    </div>
  </div>
</template>
