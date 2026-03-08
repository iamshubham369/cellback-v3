import React, { useEffect, useRef } from 'react'
import { Html5QrcodeScanner } from 'html5-qrcode'

const QRScanner = ({ onScanSuccess, onScanError }) => {
    const scannerRef = useRef(null)

    useEffect(() => {
        const config = {
            fps: 10,
            qrbox: { width: 250, height: 250 },
            aspectRatio: 1.0,
            showTorchButtonIfSupported: true
        }

        const scanner = new Html5QrcodeScanner('reader', config, false)

        scanner.render(
            (decodedText, decodedResult) => {
                onScanSuccess(decodedText, decodedResult)
                scanner.clear()
            },
            onScanError
        )

        return () => {
            scanner.clear().catch(e => console.error('Failed to clear scanner', e))
        }
    }, [onScanSuccess, onScanError])

    return (
        <div className="w-full max-w-lg mx-auto overflow-hidden rounded-3xl border-4 border-slate-800 bg-slate-900 shadow-2xl relative">
            <div id="reader" className="w-full overflow-hidden" />
            <div className="absolute inset-0 pointer-events-none border-2 border-accent/20 rounded-3xl m-8 border-dashed opacity-50" />
        </div>
    )
}

export default QRScanner
