<script setup>
import { computed, toValue } from 'vue'
import fingerPrint from '../images/fingerprint.svg'
import logOut from '../images/logout.svg'

const props = defineProps({
    authenticated: {
        type: Boolean,
        require: true
    }
})

const elementChildren = computed(() => {
    const authenticated = toValue(props.authenticated)
    const icon = authenticated ? logOut : fingerPrint
    const text = authenticated ? 'Logout' : 'Authenticate'
    return `${icon}\n<span class="truncate">${text}</span>`
})

const emit = defineEmits(['auth0-login','auth0-logout'])

const click = () => {
  if (toValue(props.authenticated)) return emit('auth0-logout')
  emit('auth0-login')
}
</script>

<template>
    <button @click="click" type="button" tabindex="0"
        class="btn btn--clicky"
        data-rac="" id="react-aria7835462272-:r24:" style="touch-action: pan-x pan-y pinch-zoom;"
        v-html="elementChildren">
    </button>
</template>
