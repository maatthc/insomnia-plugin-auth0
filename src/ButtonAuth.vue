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

const emit = defineEmits(['auth0-login'])
const login = () => {
  emit('auth0-login')
}
</script>

<template>
    <button @click="login" type="button" tabindex="0"
        class="border border-solid border-[--hl-md] bg-[rgba(var(--color-success-rgb),var(--tw-bg-opacity))] bg-opacity-100 font-semibold text-[--color-font-success] flex h-full items-center justify-center gap-2 rounded-md px-4 py-2 text-sm ring-1 ring-transparent transition-all hover:bg-opacity-80 focus:ring-inset focus:ring-[--hl-md] aria-pressed:opacity-80"
        data-rac="" id="react-aria7835462272-:r24:" style="touch-action: pan-x pan-y pinch-zoom;"
        v-html="elementChildren">
    </button>
</template>
