// 导出页面为PDF格式
import html2Canvas from 'html2canvas'
import JsPDF from 'jspdf'
export class HtmlToPdf{
    constructor(dom) {
        this.dom = dom;
    }
    init(title,size) {
        html2Canvas(this.dom, {
            allowTaint: true
        }).then(function (canvas) {
            let contentWidth = canvas.width
            let contentHeight = canvas.height
            let pageHeight = contentWidth / 210 * 297
            let leftHeight = contentHeight
            let position = 0
            let imgWidth = 210
            let imgHeight = 210 / contentWidth * contentHeight
            let pageData = canvas.toDataURL('image/jpeg', 1.0)
            let pdfSize = 'a4'
            if(size){
                pdfSize = size
                if(size == 'a3'){
                    pageHeight = contentWidth / 297 * 420
                    imgWidth = 297
                    imgHeight = 297 / contentWidth * contentHeight
                }
            }
            let PDF = new JsPDF('', 'mm', pdfSize)
            if (leftHeight < pageHeight) {
                PDF.addImage(pageData, 'JPEG', 0, 0, imgWidth, imgHeight)
            } else {
                while (leftHeight > 0) {
                    PDF.addImage(pageData, 'JPEG', 0, position, imgWidth, imgHeight)
                    leftHeight -= pageHeight
                    position -= 297
                    if(size == 'a3'){
                        position -= 420
                    }
                    if (leftHeight > 0) {
                        PDF.addPage()
                    }
                }
            }
            let pdfTitle = '文件'
            if(title){
                pdfTitle = title
            }
            PDF.save(pdfTitle + '.pdf')
        })
    }
}
