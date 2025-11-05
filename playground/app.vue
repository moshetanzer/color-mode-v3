<script setup>
const colorMode = useColorMode()
</script>

<template>
  <div>
    <ClientOnly>
      <p>Current mode: {{ colorMode.value }}</p>
    </ClientOnly>
    <p>Preference: {{ colorMode.preference }}</p>

    <button @click="colorMode.setColorMode('light')">
      Light
    </button>
    <button @click="colorMode.setColorMode('dark')">
      Dark
    </button>
    <button @click="colorMode.setColorMode('system')">
      System
    </button>
  </div>
</template>

<style>
.dark-mode {
  background-color: black;
  color: white;
}
.light-mode {
  background-color: white;
  color: black;
}
</style>
