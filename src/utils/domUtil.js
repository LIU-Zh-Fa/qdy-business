
export const setDocumentTitle = function (title) {
  document.title = title
  const ua = navigator.userAgent
  // eslint-disable-next-line
  const regex = /\bMicroMessenger\/([\d\.]+)/
  if (regex.test(ua) && /ip(hone|od|ad)/i.test(ua)) {
    const i = document.createElement('iframe')
    i.src = '/favicon.ico'
    i.style.display = 'none'
    i.onload = function () {
      setTimeout(function () {
        i.remove()
      }, 9)
    }
    document.body.appendChild(i)
  }
}

function createObjectURL(object) {
  return (window.URL) ? window.URL.createObjectURL(object) : window.webkitURL.createObjectURL(object);
}
/**
 * 导出数据
 * @param {Blob} blob 数据
 * @param {String} name 文件名
 */
export function exportDataByBlob (blob, name = '导出数据.xls') {
    const link = document.createElement('a')
    link.setAttribute('display', 'none')
    const url = createObjectURL(blob)
    link.download = name
    link.href = url
    document.body.appendChild(link)
    link.click()

    setTimeout(() => {
      URL.revokeObjectURL(url)
      document.body.removeChild(link)
    }, 150)
}

/**
 * 复制文本到剪贴板
 * @param {String} value 要复制的文本
 * @param {Event} event 点击复制按钮事件，用于处理safari点击scroll滑动问题
 * @return {Boolean} 是否复制成功 （部分移动端浏览器复制可执行成功，但不会有返回值）
 */
export function copyToClipboard (value, event) {
  const input = document.createElement('input')
  input.setAttribute('readonly', 'readonly')
  // fix safari not support { preventScroll: true }
  if (event && event.target) {
    const top = event.y
    top && input.setAttribute('style', `position: absolute; left: -99999px; top: ${top}px;`)
  }
  input.setAttribute('value', value)
  document.body.appendChild(input)
  input.focus({ preventScroll: true })
  input.setSelectionRange(0, 9999)

  const result = document.execCommand('Copy')
  document.body.removeChild(input)
  if (result) return true
}
