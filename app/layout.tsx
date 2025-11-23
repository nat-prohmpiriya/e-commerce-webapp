import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import LayoutApp from "@/components/layout/LayoutApp";
import { AuthProvider } from '@/context/AuthContext';
import { CartProvider } from '@/context/CartContext';
import { WishlistProvider } from '@/context/WishlistContext';

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
							<LayoutApp>
								{children}
							</LayoutApp>
						</WishlistProvider>
					</CartProvider>
				</AuthProvider>
			</body>
		</html>
	);
}
