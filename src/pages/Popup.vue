<script setup>
import { computed, ref } from 'vue'
import Spinner from '../components/Spinner.vue'

let searchStr = ref('')
let inProcess = ref(false)
const historyFoundArray = ref([])
const checkboxDeleteCache = ref(false)
//const checkboxAutoDelete = ref(false)

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
  if (checkboxDeleteCache.value) {
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
  <main class="max-w-lg mx-auto p-3 bg-white shadow-md rounded-lg mt-1">
    <h1 class="text-2xl font-bold text-gray-800 mb-2">Filtered History</h1>
    <p class="text-gray-600 mb-2">What mentions do you want to remove?</p>
    <div class="flex space-x-2 mb-3 justify-between items-center">
      <input
        v-model="searchStr"
        placeholder="Anime"
        class="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
        @input="handleSearch"
        :disabled="inProcess"
      />
      <button
        @click="submitDelete"
        :disabled="countFound === 0 || inProcess"
        class="w-full bg-red-500 text-white py-2 rounded hover:bg-red-600 disabled:bg-gray-300 max-w-52 border border-red-400-300 "
      >
        <div v-if="inProcess">
          <Spinner class="h-0.5"/> Deleting...
        </div>
        <div v-else>
          Delete {{ countFound ? `${countFound} items` : '' }}
        </div>
      </button>
    </div>

    <div class="flex mb-4 justify-between items-center">
      <div class="flex items-center select-none w-52">
        <input v-model="checkboxDeleteCache" type="checkbox" id="deleteCacheCheckbox" class="form-checkbox h-5 w-5 text-blue-600">
        <label for="deleteCacheCheckbox" class="ml-2 text-gray-700">Also delete cache</label>
      </div>
<!--      <div class="flex items-center select-none w-52 ps-1">-->
<!--        <input v-model="checkboxAutoDelete" type="checkbox" id="deleteCacheCheckbox" class="form-checkbox h-5 w-5 text-blue-600">-->
<!--        <label for="deleteCacheCheckbox" class="ml-2 text-gray-700">Auto Delete</label>-->
<!--      </div>-->
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
