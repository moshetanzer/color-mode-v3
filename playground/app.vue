<script setup>
const colorMode = useColorMode()
</script>

<template>
  <div>
    <div>
      Current mode:
      <p class="color-status-dark">
        Dark
      </p>
      <p class="color-status-light">
        Light
      </p>
    </div>

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
.color-status-dark,
.color-status-light {
  display: none;
}

html.dark-mode .color-status-dark {
  display: inline;
}

html.light-mode .color-status-light {
  display: inline;
}
.dark-mode {
  background-color: black;
  color: white;
}
.light-mode {
  background-color: white;
  color: black;
}
</style>
