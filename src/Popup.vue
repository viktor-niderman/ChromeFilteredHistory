<script setup>
import Main from './pages/Main.vue'
import RemoveList from './pages/RemoveList.vue'
import { ref } from 'vue'

let currentRoute = ref('Main')

const changeRoute = (route) => {
  currentRoute.value = route
}
</script>

<template>
  <main class="max-w-lg mx-auto p-3 bg-white shadow-md rounded-lg mt-1">
    <div class="flex justify-between">
      <h1 class="text-2xl font-bold text-gray-800">Filtered History
      <template v-if="currentRoute === 'RemoveList'"> - Auto Delete</template>
      </h1>
      <p>
        <a v-if="currentRoute !== 'RemoveList'" href="#" @click="changeRoute('RemoveList')"
           class="underline text-blue-600">Auto remove list</a>
        <a v-if="currentRoute !== 'Main'" href="#" @click="changeRoute('Main')" class="underline text-blue-600">Home</a>
      </p>
    </div>

    <Main v-if="currentRoute==='Main'"/>
    <RemoveList v-if="currentRoute==='RemoveList'"/>
  </main>
</template>

<style scoped>
main {
  width: 450px;
}
</style>
