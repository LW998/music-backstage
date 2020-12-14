// 自搭建的一个缓存机制
String.prototype.formatTime = function formatTime(template) {
  typeof template === 'undefined' ? template = '{0}年{1}月{2}日 {3}时{4}分{5}秒' : null;
  let matchAry = this.match(/\d+/g);
  template = template.replace(/\{(\d+)\}/g, (x, y) => {
    let val = matchAry[y] || '00';
    //不足十补零
    val = val.padStart(2, '0');
    // val.length < 2 ? val = '0' + val : null;
    return val;
  });
  return template;
};
class Cache {
  constructor() {
    this.map = {};
    this.timeMap = {};
  }

  clear() {
    const nowKey = new Date().toLocaleString().formatTime(`{0}{1}{2}{3}{4}`);
    // const nowKey = moment().format('YYYYMMDDHHmm');
    if (this.lastClear === nowKey) {
      return;
    }
    const clearTime = Object.keys(this.timeMap).filter((v) => v <= nowKey);
    clearTime.forEach((timeKey) => {
      this.timeMap[timeKey].forEach((k) => {
        delete this.map[k];
      })
      delete this.timeMap[timeKey];
    })
    this.lastClear = nowKey;
  }

  get(key) {
    this.clear();
    return this.map[key];
  }

  set(key, value, time = 90) {
    this.clear();
    const timeKye = new Date().toLocaleString().formatTime(`{0}{1}{2}{3}{4}{5}`).substr(2);
    this.map[key] = value;
    this.timeMap[timeKye] = this.timeMap[timeKye] || [];
    this.timeMap[timeKye].push(key);
  }
}

module.exports = Cache;