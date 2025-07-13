<script setup>
import { ref } from 'vue'
import halRed from '../images/HAL9000.png'
import halGreen from '../images/HAL9000-green.png'
import { Auth0Instance } from 'util/types'
import ButtonAuth from 'ButtonAuth.vue'

const props = defineProps({
  instance: {
    type: Auth0Instance,
    require: true
  }
})

const authenticated = ref(await props.instance.auth0.isAuthenticated())

</script>

<template>
  <div class="a0-instance notice info">
    <div style="flex: 2;">{{ props.instance.domain }}</div>
    <div style="flex: 1;"><img :src="authenticated ? halGreen : halRed"></div>
    <div style="flex: 2;">
      <ButtonAuth :authenticated v-if="authenticated != null" />
    </div>
  </div>
</template>
