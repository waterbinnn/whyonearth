import { toPng } from 'html-to-image'

export async function nodeToFile(node: HTMLElement, name: string): Promise<File> {
  await document.fonts.ready
  const opts = { pixelRatio: 3, cacheBust: true }
  // First pass warms up font and image embedding; Safari often drops them otherwise.
  await toPng(node, opts)
  const dataUrl = await toPng(node, opts)
  const blob = await (await fetch(dataUrl)).blob()
  return new File([blob], name, { type: 'image/png' })
}

export async function shareOrDownload(file: File) {
  if (navigator.canShare?.({ files: [file] })) {
    try {
      await navigator.share({ files: [file] })
      return
    } catch (e) {
      if ((e as Error).name === 'AbortError') return
    }
  }
  const a = document.createElement('a')
  a.href = URL.createObjectURL(file)
  a.download = file.name
  a.click()
  setTimeout(() => URL.revokeObjectURL(a.href), 2000)
}
