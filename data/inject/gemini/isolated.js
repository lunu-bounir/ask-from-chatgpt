chrome.runtime.sendMessage({
  method: 'get-question'
}, async question => {
  if (!question) {
    return;
  }

  for (let n = 0; n < 60; n += 1) {
    const send = document.querySelector('.send-button-container');
    const editor = document.querySelector('.ql-editor');

    if (send && editor) {
      for (let m = 0; m < 5; m += 1) {
        editor.click();
        editor.focus();

        const b = document.execCommand('inserttext', null, question);
        if (b) {
          for (let p = 0; p < 5; p += 1) {
            if (send.classList.contains('disabled')) {
              await new Promise(resolve => setTimeout(resolve, 1000));
            }
            else {
              send.querySelector('button').click();
              break;
            }
          }
          break;
        }
        else {
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }
      break;
    }

    await new Promise(resolve => setTimeout(resolve, 1000));
  }
});
