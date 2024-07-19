<script setup>
import { computed, ref } from 'vue'

let searchStr = ref('')
let inProcess = ref(false)
const historyFoundArray = ref([])

let countFound = computed(() => {
  return historyFoundArray.value.length
})

const searchInBrowserHistory = () => {
  chrome.history.search({ text: searchStr.value, startTime: 0 }, function (results) {
    historyFoundArray.value = results.map(el => {
      el.origin = new URL(el.url).origin;
      return el;
    })
  })

}

const clearHistory = () => {
  inProcess.value = true
  const origins = new Set;
  for (let item of historyFoundArray.value) {
    origins.add(item.origin)
    chrome.history.deleteUrl({ url: item.url }, () => {})
  }
  chrome.browsingData.remove({
    'since': 0,
    origins: [...origins],
  }, {
    appcache: true,
    cache: true,
  }, () => {})

  searchInBrowserHistory()
  inProcess.value = false
}

const submit = () => {
  searchInBrowserHistory()
}

const submitDelete = () => {
  clearHistory()
}


</script>

<template>
  <main class="max-w-lg mx-auto p-4 bg-white shadow-md rounded-lg mt-2">
    <h1 class="text-3xl font-bold text-gray-800 mb-4">Filtered History</h1>
    <p class="text-gray-600 mb-2">Enter what you want to delete:</p>
    <input
      v-model="searchStr"
      placeholder="anime"
      class="w-full p-2 border border-gray-300 rounded mb-4 focus:outline-none focus:border-blue-500"
      @keyup.enter="submit"
    />
    <div class="flex space-x-2 mb-4">
      <button
        @click="submit"
        :disabled="inProcess || !searchStr"
        class="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 disabled:bg-gray-300"
      >
        Search
      </button>
      <button
        @click="submitDelete"
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
      <hr class="m2-2">
      <ul class="text-gray-700 list-none">
        <li v-for="item in historyFoundArray" :key="item.id" class="my-1 border-b border-gray-200">
          <a :href="item.url" class="text-blue-500 hover:underline block">
            <span class="font-semibold">{{ item.origin }}</span>
            <span class="ml-2 text-gray-600">{{ item.title }}</span>
          </a>
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
