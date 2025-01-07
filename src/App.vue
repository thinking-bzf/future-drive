<template>
  <BasicLayout />
</template>

<script lang="ts">
import { defineComponent } from "vue";
import BasicLayout from "@/layouts/BasicLayout.vue";

export default defineComponent({
  name: "App",
  components: { BasicLayout },
});
</script>

<style>
#app {
}

body {
  padding: 0;
  margin: 0;
}
</style>
