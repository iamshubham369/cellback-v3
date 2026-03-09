/**
 * Google Sheets API Client
 * Replaces Supabase for data persistence
 */

const API_URL = import.meta.env.VITE_APPS_SCRIPT_URL;

export const gSheets = {
    async get(sheetName) {
        const response = await fetch(`${API_URL}?action=getData&sheet=${sheetName}&t=${Date.now()}`);
        return response.json();
    },

    async post(action, data) {
        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                mode: 'cors', // Explicitly allow CORS
                body: JSON.stringify({ action, ...data }),
                headers: {
                    'Content-Type': 'text/plain;charset=utf-8'
                }
            });

            if (!response.ok) {
                throw new Error(`Server responded with ${response.status}`);
            }

            const text = await response.text();
            try {
                return JSON.parse(text);
            } catch (e) {
                console.error('Response was not valid JSON:', text);
                throw new Error('Invalid response from server');
            }
        } catch (error) {
            console.error('Fetch error:', error);
            throw error;
        }
    },

    async addRow(sheetName, data) {
        return this.post('addRow', { sheet: sheetName, data });
    },

    async updateRow(sheetName, id, data) {
        return this.post('updateRow', { sheet: sheetName, id, data });
    },

    async authenticate(email, password) {
        return this.post('auth', { email, password });
    },

    async register(data) {
        return this.post('register', { data });
    },

    async awardPoints(data) {
        return this.post('awardPoints', data);
    },

    async redeemReward(data) {
        return this.post('redeemReward', data);
    }
};
