<script setup>
import { ref } from 'vue'

let origin = ref('');
let output = ref('');
let inProcess = ref(false);

const clear = (count) => {
  chrome.history.search({text: origin.value, startTime: 0}, function(results) {
    count += results.length;
    for (let item of results) {
      chrome.history.deleteUrl({url: item.url}, () => {});
    }
    output.value = 'Deleted ' + count + ' items';
    if (results.length === 100) {
      clear(count);
    } else {
      inProcess.value = false;
    }
  });
}

const submit = () => {
  inProcess.value = true;
  clear(0)
}

</script>

<template>
  <div>
      <h1>Filtered History</h1>
    <p>Enter What you want to delete:</p>
    <input v-model="origin" placeholder="google.com">
    <button @click="submit()" :disabled="inProcess">Ok</button>
    <p>
      {{output}}
    </p>
  </div>
</template>

<style>

</style>
