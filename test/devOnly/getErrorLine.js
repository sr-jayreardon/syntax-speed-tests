const a = (new Error())
  .stack
  .split('\n')[1]
  .substring(7)
  .match('(.*?\\((.*:\\d*:\\d*)\\)|(.*))');
const c = a[3] ? a[3] : a[2];
console.log(c);
