chrome.runtime.onInstalled.addListener(() => {
  chrome.alarms.create("autoDelete", {
    delayInMinutes: 60,
    periodInMinutes: 240
  });
});

chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === "autoDelete") {
    myFunction();
  }
});

const clearCache = (origins) => {
  chrome.browsingData.remove({
    'since': 0,
    origins: origins,
  }, {
    appcache: true,
    cache: true,
  })
}

function myFunction() {
  chrome.storage.sync.get(['autoRemoveList'], function (result) {
    const list = result.autoRemoveList || [];
    list.forEach((item) => {
      chrome.history.search({ text: item, startTime: 0 }, function (results) {
        const historyFoundArray =  results.map(el => {
          el.origin = new URL(el.url).origin
          return el
        })
        const origins = new Set
        for (let item of historyFoundArray.value) {
          origins.add(item.origin)
          chrome.history.deleteUrl({ url: item.url }, () => {})
        }
        clearCache([...origins])
      })
    });
  })
}
