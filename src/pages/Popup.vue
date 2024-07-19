<script setup>
import { ref } from 'vue'

let origin = ref('');

const clear = () => {
//   chrome.browsingData.remove({
//     "since": 0,
//     "origins": ['https://' + origin, 'http://' + origin]
//   }, {
//     appcache: true,
//     cache: true,
//   }, () => {});

  chrome.history.search({text: origin.value, startTime: 0}, function(results) {
    for (let item of results) {
      chrome.history.deleteUrl({url: item.url}, function() {
        console.log(`Deleted: ${item.url}`);
      });
    }
  });
}


</script>

<template>
  <div>
      <h1>Filtered History</h1>
    <p>Enter Origin:</p>
    <input v-model="origin" placeholder="google.com">
    <button @click="clear()">Ok</button>
  </div>
</template>

<style>

</style>
