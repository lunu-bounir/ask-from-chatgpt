// dynamic menu
const menu = () => chrome.storage.local.get({
  mode: 'window',
  questions: [
    'What does the following mean',
    'Translate this for me',
    'Reword this for me',
    'Explain this to me',
    'What do you know about the following'
  ],
  empty: true,
  custom: true
}, prefs => {
  chrome.contextMenus.removeAll(() => {
    chrome.contextMenus.create({
      title: 'Mode',
      id: 'mode',
      contexts: ['action']
    });
    chrome.contextMenus.create({
      title: 'Window',
      id: 'mode:window',
      contexts: ['action'],
      parentId: 'mode',
      type: 'radio',
      checked: prefs.mode === 'window'
    });
    chrome.contextMenus.create({
      title: 'Tab',
      id: 'mode:tab',
      contexts: ['action'],
      parentId: 'mode',
      type: 'radio',
      checked: prefs.mode === 'tab'
    });

    for (const question of prefs.questions) {
      chrome.contextMenus.create({
        title: question,
        id: question,
        contexts: ['selection']
      });
    }
    if (prefs.empty || prefs.custom) {
      chrome.contextMenus.create({
        id: 'sep',
        contexts: ['selection'],
        type: 'separator'
      });
      if (prefs.empty) {
        chrome.contextMenus.create({
          title: 'Do not prepend anything',
          id: 'EMPTY',
          contexts: ['selection']
        });
        if (/Firefox/.test(navigator.userAgent) === false) {
          chrome.contextMenus.create({
            title: 'Enter custom question',
            id: 'CUSTOM',
            contexts: ['selection']
          });
        }
      }
    }
  });
});

chrome.runtime.onInstalled.addListener(menu);
chrome.runtime.onStartup.addListener(menu);
chrome.storage.onChanged.addListener(ps => {
  if (ps['questions'] || ps['custom'] || ps['empty']) {
    menu();
  }
});

const questions = new Map();
const customs = {};

const insert = (tabId, prefix, message) => message.trim() && questions.set(tabId, prefix + ':\n\n' + message.trim());

chrome.runtime.onMessage.addListener((request, sender, response) => {
  if (request.method === 'get-question') {
    response(questions.get(sender.tab.id));
    // questions.delete(sender.tab.id);
  }
  else if (request.method === 'custom-question') {
    customs[request.tabId](request.question);
  }
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId.startsWith('mode:')) {
    chrome.storage.local.set({
      mode: info.menuItemId.replace('mode:', '')
    });
  }
  else {
    chrome.storage.local.get({
      mode: 'window',
      width: 900,
      height: 700
    }, async prefs => {
      let prepend = info.menuItemId;

      if (info.menuItemId === 'EMPTY') {
        prepend = '';
      }
      if (info.menuItemId === 'CUSTOM') {
        prepend = await new Promise(resolve => {
          customs[tab.id] = resolve;
          chrome.offscreen.createDocument({
            url: chrome.runtime.getURL('data/prompt/index.html?tabId=' + tab.id),
            reasons: ['IFRAME_SCRIPTING'],
            justification: 'user prompt'
          });
        });
      }

      if (prefs.mode === 'window') {
        const win = await chrome.windows.getCurrent();
        const left = win.left + Math.round((win.width - prefs.width) / 2);
        const top = win.top + Math.round((win.height - prefs.height) / 2);


        chrome.windows.create({
          url: 'https://chat.openai.com/chat',
          width: prefs.width,
          height: prefs.height,
          left,
          top,
          type: 'popup'
        }, w => insert(w.tabs[0].id, prepend, info.selectionText));
      }
      else {
        chrome.tabs.create({
          url: 'https://chat.openai.com/chat',
          index: tab.index + 1
        }, tab => insert(tab.id, prepend, info.selectionText));
      }
    });
  }
});

chrome.action.onClicked.addListener(tab => {
  chrome.tabs.create({
    url: 'https://chat.openai.com/chat',
    index: tab.index + 1
  });
});


/* FAQs & Feedback */
{
  const {management, runtime: {onInstalled, setUninstallURL, getManifest}, storage, tabs} = chrome;
  if (navigator.webdriver !== true) {
    const page = getManifest().homepage_url;
    const {name, version} = getManifest();
    onInstalled.addListener(({reason, previousVersion}) => {
      management.getSelf(({installType}) => installType === 'normal' && storage.local.get({
        'faqs': true,
        'last-update': 0
      }, prefs => {
        if (reason === 'install' || (prefs.faqs && reason === 'update')) {
          const doUpdate = (Date.now() - prefs['last-update']) / 1000 / 60 / 60 / 24 > 45;
          if (doUpdate && previousVersion !== version) {
            tabs.query({active: true, currentWindow: true}, tbs => tabs.create({
              url: page + '?version=' + version + (previousVersion ? '&p=' + previousVersion : '') + '&type=' + reason,
              active: reason === 'install',
              ...(tbs && tbs.length && {index: tbs[0].index + 1})
            }));
            storage.local.set({'last-update': Date.now()});
          }
        }
      }));
    });
    setUninstallURL(page + '?rd=feedback&name=' + encodeURIComponent(name) + '&version=' + version);
  }
}
