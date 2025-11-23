import React from 'react'
import BottomNav from './BottomNav'

interface LayoutAppProps {
    children: React.ReactNode
}

const LayoutApp = ({ children }: LayoutAppProps) => {
    return (
        <div className='bg-gray-50 min-h-screen'>
            {children}
            <BottomNav />
        </div>
    )
}

export default LayoutApp