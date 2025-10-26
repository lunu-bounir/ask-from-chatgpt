const Q = [
  'What does the following mean',
  'Translate this for me',
  'Reword this for me',
  'Explain this to me',
  'What do you know about the following'
];

chrome.storage.local.get({
  questions: Q,
  empty: true,
  custom: true,
  chatgpt: 'https://chatgpt.com/',
  gemini: 'https://gemini.google.com/app'
}, prefs => {
  console.log(prefs);

  document.getElementById('questions').value = prefs.questions.join('\n');
  document.getElementById('empty').checked = prefs.empty;
  document.getElementById('custom').checked = prefs.custom;
  document.getElementById('chatgpt').value = prefs.chatgpt;
  document.getElementById('gemini').value = prefs.gemini;
});

document.getElementById('save').addEventListener('click', () => {
  const questions = document.getElementById('questions').value.split('\n')
    .map(s => s.trim())
    .filter((s, i, l) => {
      return s && l.indexOf(s) === i;
    });

  chrome.storage.local.set({
    questions: questions.length ? questions : Q,
    empty: document.getElementById('empty').checked,
    custom: document.getElementById('custom').checked,
    chatgpt: document.getElementById('chatgpt').value || 'https://chatgpt.com/',
    gemini: document.getElementById('gemini').value || 'https://gemini.google.com/app'
  }, () => {
    const toast = document.getElementById('toast');
    toast.textContent = 'Options saved';
    setTimeout(() => toast.textContent = '', 750);
  });
});
