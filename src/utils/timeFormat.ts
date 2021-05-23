export default function timeFormat(time:number):string {
  const timeM = time / 60
  const timeS = time % 60
  let timeMinute = ''
  let timeSeconds = ''
  if (timeM < 10) {
    timeMinute = `0${timeM}`
  } else {
    timeMinute = `${timeM}`
  }
  if (timeS < 10) {
    timeSeconds = `0${timeS}`
  } else {
    timeSeconds = `${timeS}`
  }
  timeMinute = timeMinute.substr(0, 2)
  timeSeconds = timeSeconds.substr(0, 2)
  return `${timeMinute}:${timeSeconds}`
}
