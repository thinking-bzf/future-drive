<script setup lang="ts"></script>

<template>
  <div class="basic-layout">
    <router-view />
  </div>
</template>

<style scoped>
.basic-layout {
  background-image: url("@/assets/background.png");
  background-size: cover;
  background-position: center;
  height: 100vh;
  width: 100vw;
}
</style>
