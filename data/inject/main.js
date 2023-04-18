const port = document.createElement('span');
port.id = 'ask-from-chatgpt-port';
document.documentElement.append(port);

self.fetch = new Proxy(self.fetch, {
  apply(target, self, args) {
    const [href] = args;

    if (href.includes('rgstr') || href.includes('conversations')) {
      port.dispatchEvent(new Event('ask'));
    }
    return Reflect.apply(target, self, args);
  }
});

// in case the loading method does not work
setTimeout(() => port.dispatchEvent(new Event('ask')), 10000);
