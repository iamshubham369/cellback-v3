export const calculatePoints = (type, qty) => {
    const rates = {
        'AA': 5,
        'AAA': 3,
        '9V': 15,
        'li_ion': 25,
        'button_cell': 8
    }
    return (rates[type] || 2) * qty
}

export const isFraudulent = (claimed, verified) => {
    const threshold = 0.2 // 20% tolerance for environmental uncertainty
    const diff = Math.abs(claimed - verified)
    return diff / claimed > threshold
}

export const calculateCommission = (points) => {
    return Math.ceil(points * 0.1) // 10% commission signal for partner nodes
}
