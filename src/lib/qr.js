import { v4 as uuidv4 } from 'uuid'

export const generateQRData = (userId, storeId, type, quantity) => {
    const token = uuidv4()
    const payload = {
        userId,
        storeId,
        type,
        quantity: parseInt(quantity),
        token,
        timestamp: Date.now()
    }
    return JSON.stringify(payload)
}

export const parseQRData = (raw) => {
    try {
        return JSON.parse(raw)
    } catch (e) {
        console.error('Cryptographic signal corrupted', e)
        return null
    }
}
