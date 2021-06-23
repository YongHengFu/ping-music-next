export default function imageToBase64(url:string) {
  return new Promise((resolve, reject) => {
    const Img = new Image()
    Img.setAttribute('crossOrigin', 'Anonymous')
    Img.src = url + '?v=' + Math.random()
    Img.onload = function() {
      const canvas = document.createElement('canvas')
      canvas.width = Img.width
      canvas.height = Img.height
      canvas.getContext('2d')?.drawImage(Img, 0, 0, Img.width, Img.height) // 将图片绘制到canvas中
      const base64 = canvas.toDataURL('image/jpeg') // 转换图片为dataURL
      resolve(base64)
    }
  })
}
