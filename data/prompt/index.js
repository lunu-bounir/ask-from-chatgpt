const args = new URLSearchParams(location.search);

chrome.runtime.sendMessage({
  method: 'custom-question',
  question: prompt('What is the custom question', ''),
  tabId: Number(args.get('tabId'))
});
