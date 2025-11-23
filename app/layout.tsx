import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import LayoutApp from "@/components/layout/LayoutApp";
import { AuthProvider } from '@/context/AuthContext';
import { CartProvider } from '@/context/CartContext';
import { WishlistProvider } from '@/context/WishlistContext';
import { AddressProvider } from '@/context/AddressContext';
import { OrderProvider } from '@/context/OrderContext';
import { SettingsProvider } from '@/context/SettingsContext';
import { Toaster } from 'react-hot-toast';

const inter = Inter({
	subsets: ["latin"],
	variable: "--font-inter",
});

export const metadata: Metadata = {
	title: "E-Commerce Store",
	description: "Modern shopping experience for small businesses",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body className='w-[432px] mx-auto'>
				<AuthProvider>
					<CartProvider>
						<WishlistProvider>
							<AddressProvider>
								<OrderProvider>
									<SettingsProvider>
										<LayoutApp>
											{children}
										</LayoutApp>
										<Toaster
											position="top-center"
											reverseOrder={false}
											toastOptions={{
												duration: 3000,
												style: {
													background: '#363636',
													color: '#fff',
													borderRadius: '12px',
													padding: '12px 20px',
												},
												success: {
													iconTheme: {
														primary: '#10b981',
														secondary: '#fff',
													},
												},
												error: {
													iconTheme: {
														primary: '#ef4444',
														secondary: '#fff',
													},
												},
											}}
										/>
									</SettingsProvider>
								</OrderProvider>
							</AddressProvider>
						</WishlistProvider>
					</CartProvider>
				</AuthProvider>
			</body>
		</html>
	);
}
