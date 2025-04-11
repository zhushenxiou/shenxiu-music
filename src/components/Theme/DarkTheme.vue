<script setup lang="ts">
import { useDark, useToggle } from "@vueuse/core";

const isDark = useDark();
const toggleDark = useToggle(isDark);
</script>

<template>
  <el-icon @click="() => toggleDark()" :size="25">
    <Sunny v-show="!isDark" />
    <MoonNight v-show="isDark" />
  </el-icon>

</template>

<style scoped></style>
