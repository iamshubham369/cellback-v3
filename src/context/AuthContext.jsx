import React, { createContext, useContext, useState, useEffect } from 'react'
import { gSheets } from '../lib/google-sheets'
import { v4 as uuidv4 } from 'uuid'

const AuthContext = createContext({})

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null)
    const [profile, setProfile] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        // Retrieve local session signal
        const savedUser = localStorage.getItem('cellback_user')
        const savedProfile = localStorage.getItem('cellback_profile')

        if (savedUser) {
            setUser(JSON.parse(savedUser))
            if (savedProfile) {
                setProfile(JSON.parse(savedProfile))
            }
            fetchProfile(JSON.parse(savedUser).id)
        } else {
            setLoading(false)
        }
    }, [])

    const fetchProfile = async (id) => {
        try {
            const users = await gSheets.get('users')
            const data = users.find(u => u.id == id)
            if (data) {
                setProfile(data)
                // Sync profile back to storage
                localStorage.setItem('cellback_profile', JSON.stringify(data))
            }
        } catch (e) {
            console.error('Failed to sync environmental profile signal', e)
        } finally {
            setLoading(false)
        }
    }

    const login = async (email, password) => {
        const response = await gSheets.authenticate(email, password)
        if (response.error) throw new Error(response.error)

        const userData = response.user
        setUser(userData)
        setProfile(userData)
        localStorage.setItem('cellback_user', JSON.stringify(userData))
        localStorage.setItem('cellback_profile', JSON.stringify(userData))
        return { user: userData }
    }

    const register = async (name, email, password, role, storeData = null) => {
        const userId = uuidv4()
        const userPayload = {
            id: userId,
            name,
            email,
            password, // In a real app, hash this
            role,
            points: 0,
            created_at: new Date().toISOString()
        }

        const response = await gSheets.register(userPayload)
        if (response.error) throw new Error(response.error)

        if (role === 'store' && storeData) {
            const storeId = uuidv4()
            await gSheets.addRow('stores', {
                id: storeId,
                owner_id: userId,
                store_name: storeData.name,
                address: storeData.address,
                city: storeData.city,
                pincode: storeData.pincode,
                status: 'pending',
                current_box_count: 0,
                box_capacity: 1000,
                commission_points: 0
            })
        }

        return { user: userPayload }
    }

    const updatePoints = (newPoints) => {
        if (!profile) return
        const updatedProfile = { ...profile, points: newPoints }
        setProfile(updatedProfile)
        localStorage.setItem('cellback_profile', JSON.stringify(updatedProfile))
    }

    const logout = async () => {
        setUser(null)
        setProfile(null)
        localStorage.removeItem('cellback_user')
        localStorage.removeItem('cellback_profile')
    }

    return (
        <AuthContext.Provider value={{ user, profile, loading, login, register, logout, fetchProfile, updatePoints }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext)
