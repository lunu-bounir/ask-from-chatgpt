chrome.runtime.sendMessage({
  method: 'get-question'
}, async question => {
  if (!question) {
    return;
  }
  for (let n = 0; n < 60; n += 1) {
    // console.log('n', n);
    const textarea = document.getElementById('prompt-textarea') ||
      document.querySelector('[data-id="root"]');
    let button;
    {
      const c = textarea?.parentElement?.nextElementSibling;
      if (c && c.tagName === 'BUTTON') {
        button = c;
      }
    }
    if (!button) {
      const c = textarea?.nextElementSibling;
      if (c && c.tagName === 'BUTTON') {
        button = c;
      }
    }
    if (!button) {
      const c = document.querySelector('form button[disabled]');
      if (c && c.tagName === 'BUTTON') {
        button = c;
      }
    }

    if (textarea && button) {
      for (let m = 0; m < 5; m += 1) {
        textarea.click();
        textarea.focus();
        textarea.value = '';
        const b = document.execCommand('inserttext', null, question);
        if (b) {
          break;
        }
        else if (!b && m === 4) {
          textarea.value = question;
          textarea.dispatchEvent(new Event('input'));
          textarea.dispatchEvent(new Event('change'));
        }
        else {
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }
      button.click();

      break;
    }

    await new Promise(resolve => setTimeout(resolve, 1000));
  }
});
