<script setup lang="ts">
import { ref } from 'vue'
import { mc } from 'magic-color'
import Container from './components/Container.vue'

const color = ref(import.meta.env.DEV ? '#30db9d' : mc.random())
// const color = ref(import.meta.env.DEV ? '#529e82' : randomColor())
const alpha = ref(1)

// @ts-expect-error mc in window
window.mc = mc
</script>

<template>
  <header fc py-4>
    <h1 text-4xl fw-600 text-transparent bg-clip-text bg-gradient-to-r from-purple to-red>
      <a href="https://github.com/zyyv/magic-color" target="_blank">
        <img inline-block w-10 src="/logo.svg" alt="logo">
        Magic Color
      </a>
      <span text-sm>palette.</span>
    </h1>
  </header>
  <Container v-model:color="color" v-model:alpha="alpha" font-sans mt-8 />
</template>
