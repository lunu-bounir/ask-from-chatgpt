chrome.runtime.sendMessage({
  method: 'get-question'
}, async question => {
  console.log('here', question);

  if (!question) {
    return;
  }
  for (let n = 0; n < 60; n += 1) {
    console.log(n);
    const textarea = document.querySelector('[data-id="root"]');
    const button = document.querySelector('[data-id="root"] + button');

    if (textarea && button) {
      console.log(textarea, button);
      textarea.click();
      document.execCommand('inserttext', null, question);

      button.click();
      break;
    }

    await new Promise(resolve => setTimeout(resolve, 1000));
  }
});
