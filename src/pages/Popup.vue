<script setup>
import { computed, ref } from 'vue'
import Spinner from '../components/Spinner.vue'

let searchStr = ref('')
let inProcess = ref(false)
const historyFoundArray = ref([])
const cacheShouldBeDeleted = ref(false)

let countFound = computed(() => {
  return historyFoundArray.value.length
})

const countFoundStr = computed(() => {
  if (!searchStr) return '';
  if (countFound.value === 0) return 'No items found';
  if (countFound.value === 100) return '100+ item found';
  return `${countFound.value} items found`
})

const searchInBrowserHistory = () => {
  chrome.history.search({ text: searchStr.value, startTime: 0 }, function (results) {
    if (searchStr.value === '') {
      historyFoundArray.value = []
      return
    } else {
      historyFoundArray.value = results.map(el => {
        el.origin = new URL(el.url).origin;
        return el;
      })
    }
    inProcess.value = false;
  })
}

const clearHistory = () => {
  inProcess.value = true
  const origins = new Set;
  for (let item of historyFoundArray.value) {
    origins.add(item.origin)
    chrome.history.deleteUrl({ url: item.url }, () => {})
  }
  if (cacheShouldBeDeleted.value) {
    clearCache([...origins]);
  } else {
    searchInBrowserHistory()
  }
}

const clearCache = (origins) => {
  chrome.browsingData.remove({
    'since': 0,
    origins: origins,
  }, {
    appcache: true,
    cache: true,
  }, () => {
    searchInBrowserHistory()
  })
}

const handleSearch = () => {
  searchInBrowserHistory()
}

const submitDelete = () => {
  clearHistory()
}


</script>

<template>
  <main class="max-w-lg mx-auto p-4 bg-white shadow-md rounded-lg mt-2">
    <h1 class="text-3xl font-bold text-gray-800 mb-4">Filtered History</h1>
    <p class="text-gray-600 mb-2">What mentions do you want to remove?</p>
    <input
      v-model="searchStr"
      placeholder="Anime"
      class="w-full p-2 border border-gray-300 rounded mb-4 focus:outline-none focus:border-blue-500"
      @input="handleSearch"
      :disabled="inProcess"
    />
    <div class="flex space-x-2 mb-4 justify-between items-center">
      <button
        @click="submitDelete"
        :disabled="countFound === 0 || inProcess"
        class="w-full bg-red-500 text-white py-2 rounded hover:bg-red-600 disabled:bg-gray-300 max-w-52 "
      >
        <div v-if="inProcess">
          <Spinner class="h-0.5"/> Deleting...
        </div>
        <div v-else>
          Delete {{ countFound ? `${countFound} items` : '' }}
        </div>
      </button>
      <div class="flex items-center select-none">
        <input v-model="cacheShouldBeDeleted" type="checkbox" id="deleteCacheCheckbox" class="form-checkbox h-5 w-5 text-blue-600">
        <label for="deleteCacheCheckbox" class="ml-2 text-gray-700">Also delete cache</label>
      </div>
    </div>

    <p class="text-gray-600 mt-4">
      {{ countFoundStr}}
    </p>

    <div v-if="countFound > 0" class="mt-4">
      <hr class="m2-2">
      <ul class="text-gray-700 list-none overflow-y-auto" id="foundList">
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
  width: 450px;
}
#foundList {
  max-height: 340px;
}
</style>
