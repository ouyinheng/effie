<template>
  <div class="home-page">
    <RouterView />
  </div>
</template>
<script setup lang="ts">
import { RouterView } from "vue-router";
</script>
<style scoped>
.home-page {
  width: 100%;
  height: 100%;
  background-color: #e0e0e0;
  overflow: hidden;
}
</style>
