
export function createOptions(hours : number, divisor : number) {
  const DIV = 4;
  const length = hours * DIV;
  const HOUR = 60;
  const options = [];
  for (let value = 4; value <= length; value++) {
      let minutes = HOUR / DIV * value;
      const hour = Math.floor(minutes / HOUR);
      minutes = minutes % HOUR;
      let label = '';
      if (hour > 0) {
          label += hour + ' hour';
          if (hour > 1) {
              label += 's';
          }
      }
      if (minutes > 0) {
          label += ' ' + minutes + ' minutes';
      }
      options.push({
          text: label,
          value: value * (divisor / DIV)
      });
  }
  return options;
}
export function basicPluralize(number : number, string : string) {
  if (number === 1) {
      return string;
  } else {
      return string + 's';
  }
}



