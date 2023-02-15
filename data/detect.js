// Document.prototype.addEventListener = new Proxy(Document.prototype.addEventListener, {
//   apply(target, self, args) {
//     console.log(target, self, args);
//     Reflect.apply(target, self, args);
//   }
// });

console.log(112);
document.addEventListener('loadeddata', () => console.log(1));
document.addEventListener('loadedmetadata', () => console.log(2));
document.addEventListener('emptied', () => console.log(3));
document.addEventListener('compositionend', () => console.log(4));
