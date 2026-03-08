import React from 'react'
import { QRCodeSVG } from 'qrcode.react'
import Card from '../ui/Card'
import Button from '../ui/Button'
import { Download, Share2 } from 'lucide-react'

const QRGenerator = ({ value, title, subtitle }) => {
    const downloadQR = () => {
        const svg = document.getElementById('qr-ticket-svg')
        const svgData = new XMLSerializer().serializeToString(svg)
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')
        const img = new Image()
        img.onload = () => {
            canvas.width = img.width
            canvas.height = img.height
            ctx.drawImage(img, 0, 0)
            const pngFile = canvas.toDataURL('image/png')
            const downloadLink = document.createElement('a')
            downloadLink.download = 'cellback-ticket.png'
            downloadLink.href = `${pngFile}`
            downloadLink.click()
        }
        img.src = `data:image/svg+xml;base64,${btoa(svgData)}`
    }

    return (
        <Card className="flex flex-col items-center text-center p-8 bg-white text-slate-900 border-none shadow-2xl">
            <div className="mb-6">
                <h3 className="text-2xl font-bold mb-1">{title}</h3>
                <p className="text-slate-500 font-medium">{subtitle}</p>
            </div>

            <div className="p-6 bg-white border-4 border-slate-100 rounded-3xl mb-8">
                <QRCodeSVG
                    id="qr-ticket-svg"
                    value={value}
                    size={200}
                    level="H"
                    includeMargin={true}
                />
            </div>

            <div className="flex gap-4 w-full">
                <Button onClick={downloadQR} className="flex-1 bg-slate-900 hover:bg-black text-white flex items-center justify-center gap-2 py-4">
                    <Download className="w-5 h-5" /> Save Image
                </Button>
                <Button variant="outline" className="border-slate-300 text-slate-600 hover:bg-slate-50 flex-1 flex items-center justify-center gap-2 py-4">
                    <Share2 className="w-5 h-5" /> Share
                </Button>
            </div>

            <p className="mt-8 text-[11px] text-slate-400 uppercase tracking-widest font-bold">
                Valid for 24 hours at designated store
            </p>
        </Card>
    )
}

export default QRGenerator
