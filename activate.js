const activate = async () => {
  if (activate.busy) {
    return;
  }
  activate.busy = true;

  const engine = await new Promise(resolve => chrome.storage.local.get({
    engine: 'chatgpt'
  }, prefs => resolve(prefs.engine)));

  await chrome.scripting.unregisterContentScripts();

  if (engine === 'chatgpt') {
    await chrome.scripting.registerContentScripts([{
      'id': 'isolated-chatgpt',
      'js': ['/data/inject/chatgpt/isolated.js'],
      'runAt': 'document_start',
      'world': 'ISOLATED',
      'matches': ['https://chatgpt.com/*']
    }]);
  }
  else if (engine === 'gemini') {
    await chrome.scripting.registerContentScripts([{
      'id': 'isolated-gemini',
      'js': ['/data/inject/gemini/isolated.js'],
      'runAt': 'document_start',
      'world': 'ISOLATED',
      'matches': ['https://gemini.google.com/*']
    }]);
  }

  activate.busy = false;
};

chrome.runtime.onStartup.addListener(activate);
chrome.runtime.onInstalled.addListener(activate);
chrome.storage.onChanged.addListener(ps => {
  if (ps.engine) {
    activate();
  }
});
