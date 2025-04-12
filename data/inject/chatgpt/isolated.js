chrome.runtime.sendMessage({
  method: 'get-question'
}, async question => {
  if (!question) {
    return;
  }
  // Find textarea
  let textarea;
  for (let n = 0; n < 60; n += 1) {
    textarea = document.getElementById('prompt-textarea') ||
      document.querySelector('[data-id="root"]');
    if (textarea) {
      break;
    }
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  // Inset question
  if (textarea) {
    for (let m = 0; m < 20; m += 1) {
      textarea.click();
      textarea.focus();

      console.log(m);
      const a = document.execCommand('selectAll', false, null);
      if (!a) {
        continue;
      }
      const b = document.execCommand('delete', false, null);
      if (!b) {
        continue;
      }

      const c = document.execCommand('inserttext', null, question);
      // wait anyway
      await new Promise(resolve => setTimeout(resolve, 1000));
      if (c) {
        break;
      }
    }
  }
  // Submit
  for (let n = 0; n < 20; n += 1) {
    const button = document.getElementById('composer-submit-button');

    if (button) {
      button.click();
      break;
    }
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
});
