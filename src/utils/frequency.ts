// eslint-disable-next-line no-undef
import Timer = NodeJS.Timer

export function throttle(fn: (arg0: any) => void, wait = 1000) {
  let timer: Timer | null = null
  return (...arg: any) => {
    if (!timer) {
      // @ts-ignore
      fn(...arg)
      timer = setTimeout(() => {
        timer = null
      }, wait)
    }
  }
}

export function debounce(fn: any, wait = 1000) {
  let timer: Timer | null = null
  return (...arg: any) => {
    if (timer) {
      clearTimeout(timer)
      timer = null
    }
    timer = setTimeout(() => {
      fn(...arg)
    }, wait)
  }
}
