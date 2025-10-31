import { jsPDF } from 'jspdf'
import domtoimage from 'dom-to-image-more'

const PAGE_WIDTH_MM = 297
const PAGE_HEIGHT_MM = 210
const PX_TO_MM_RATIO = 3.78

const pxToMm = (px: number) => px / PX_TO_MM_RATIO

export const captureComponentAsPdf = async (
  ref: HTMLDivElement
): Promise<jsPDF> => {
  try {
    const imgWidthPx = ref.offsetWidth
    const imgHeightPx = ref.offsetHeight
    const imgWidthMm = pxToMm(imgWidthPx)
    const imgHeightMm = pxToMm(imgHeightPx)

    const scale = Math.min(
      PAGE_WIDTH_MM / imgWidthMm,
      PAGE_HEIGHT_MM / imgHeightMm,
      1
    )

    const renderWidthMm = imgWidthMm * scale
    const renderHeightMm = imgHeightMm * scale

    const xMm = (PAGE_WIDTH_MM - renderWidthMm) / 2
    const yMm = (PAGE_HEIGHT_MM - renderHeightMm) / 2

    const dataUrl = await domtoimage.toPng(ref)
    const pdf = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: [PAGE_WIDTH_MM, PAGE_HEIGHT_MM],
    })

    pdf.addImage(dataUrl, 'PNG', xMm, yMm, renderWidthMm, renderHeightMm)
    return pdf
  } catch (error) {
    throw error
  }
}
