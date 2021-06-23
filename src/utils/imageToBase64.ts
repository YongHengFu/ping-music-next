export default async function imageToBase64(url:string) {
  const Img = new Image()
  let base64 = ''
  Img.src = url + '?v=' + Math.random() // 处理缓存,fix缓存bug,有缓存，浏览器会报错;
  Img.setAttribute('crossOrigin', 'Anonymous') // 解决控制台跨域报错的问题
  Img.onload = await function() { // 要先确保图片完整获取到，这是个异步事件
    const canvas = document.createElement('canvas')
    canvas.width = Img.height
    canvas.height = Img.width
    canvas.getContext('2d')?.drawImage(Img, 0, 0, Img.width, Img.height) // 将图片绘制到canvas中
    base64 = canvas.toDataURL('image/jpeg') // 转换图片为dataURL
  }
  return base64
}
