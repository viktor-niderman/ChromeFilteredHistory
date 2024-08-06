<script setup>
import { ref } from 'vue'

const autoRemoveList = ref([])
const input = ref('')

chrome.storage.sync.get(['autoRemoveList'], function (result) {
  autoRemoveList.value = result.autoRemoveList || []
})

const addToAutoRemoveList = () => {
  if (!input.value) return
  const value = input.value
  input.value = ''
  if (autoRemoveList.value.includes(value)) return
  autoRemoveList.value.push(value)
  saveToStorage();
}

const removeFromAutoRemoveList = (el) => {
  autoRemoveList.value.splice(autoRemoveList.value.indexOf(el), 1)
  saveToStorage();
}

const saveToStorage = () => {
  chrome.storage.sync.set({ autoRemoveList: [...autoRemoveList.value] })
}

</script>

<template>
  <div class="max-w-md mx-auto">
    <p class="text-gray-600 mb-2">List for Constant Automatic Deletion:</p>
    <div class="flex space-x-2 mb-3 justify-between items-center">
      <input
        v-model="input"
        v-on:keyup.enter="addToAutoRemoveList"
        placeholder="Add item to list"
        class="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
      />
      <button
        @click="addToAutoRemoveList"
        class="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 disabled:bg-gray-300 max-w-52 border border-blue-400-300"
      >
        Add
      </button>
    </div>
    <ul class="text-gray-700 list-none overflow-y-auto" id="autoRemoveList">
      <li v-for="el in autoRemoveList" :key="el" class="my-1 border-b border-gray-200">
        <div class="flex justify-between">
          <span>{{ el }}</span>
          <button @click="removeFromAutoRemoveList(el)" class="text-red-500">Remove</button>
        </div>
      </li>
    </ul>
  </div>
</template>


<style scoped>
</style>
