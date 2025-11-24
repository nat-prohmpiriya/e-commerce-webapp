'use client'

import React from 'react'
import { usePathname } from 'next/navigation'
import BottomNav from './BottomNav'
import SideNav from './SideNav'

interface LayoutAppProps {
    children: React.ReactNode
}

const LayoutApp = ({ children }: LayoutAppProps) => {
    const pathname = usePathname()
    const isAdminPage = pathname.startsWith('/admin')

    return (
        <div className='bg-gray-50 min-h-screen'>
            {/* Desktop Sidebar - Only for customer pages */}
            <SideNav />

            {/* Main Content */}
            <div className={isAdminPage ? 'min-h-screen' : 'md:ml-64 min-h-screen'}>
                <div className={isAdminPage ? 'w-full' : 'mx-auto max-w-7xl'}>
                    {children}
                </div>
            </div>

            {/* Mobile Bottom Navigation - Only for customer pages */}
            <BottomNav />
        </div>
    )
}

export default LayoutApp