<script setup>
import { computed, ref } from 'vue'

let origin = ref('')
let inProcess = ref(false)
const found = ref([])

let countFound = computed(() => {
  return found.value.length
})

const findItems = () => {
  chrome.history.search({ text: origin.value, startTime: 0 }, function (results) {
    found.value = results
  })
}

const clearHistory = () => {
  inProcess.value = true
  for (let item of found.value) {
    chrome.history.deleteUrl({ url: item.url }, () => {})
  }
  findItems();
  inProcess.value = false;
}

const submit = () => {
  findItems()
}

</script>

<template>
  <main class="max-w-lg mx-auto p-4 bg-white shadow-md rounded-lg mt-2">
    <h1 class="text-3xl font-bold text-gray-800 mb-4">Filtered History</h1>
    <p class="text-gray-600 mb-2">Enter what you want to delete:</p>
    <input
      v-model="origin"
      placeholder="google.com"
      class="w-full p-2 border border-gray-300 rounded mb-4 focus:outline-none focus:border-blue-500"
      @keyup.enter="submit"
    />
    <div class="flex space-x-2 mb-4">
      <button
        @click="submit"
        :disabled="inProcess"
        class="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 disabled:bg-gray-300"
      >
        Search
      </button>
      <button
        @click="clearHistory"
        :disabled="countFound === 0 || inProcess"
        class="w-full bg-red-500 text-white py-2 rounded hover:bg-red-600 disabled:bg-gray-300"
      >
        Delete {{ countFound ? `${countFound} items` : '' }}
      </button>
    </div>
    <p class="text-gray-600 mt-4">
      {{ countFound ? `Found ${countFound === 100 ? '100+' : countFound} items` : '' }}
    </p>

    <div v-if="countFound > 0" class="mt-4">
      <hr class="mb-4">
      <ul class="list-disc list-inside text-gray-700">
        <li v-for="item in found" :key="item.id">
          <a :href="item.url" class="text-blue-500 hover:underline">{{item.title}}</a>
        </li>
      </ul>
    </div>
  </main>
</template>

<style scoped>
main {
  min-width: 400px;
}
</style>
