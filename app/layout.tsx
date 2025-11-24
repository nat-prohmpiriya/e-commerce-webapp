import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from '@/context/AuthContext';
import { CartProvider } from '@/context/CartContext';
import { WishlistProvider } from '@/context/WishlistContext';
import { AddressProvider } from '@/context/AddressContext';
import { OrderProvider } from '@/context/OrderContext';
import { SettingsProvider } from '@/context/SettingsContext';
import { ProductProvider } from '@/context/ProductContext';
import { CategoryProvider } from '@/context/CategoryContext';
import { DiscountProvider } from '@/context/DiscountContext';
import { StoreSettingsProvider } from '@/context/StoreSettingsContext';
import { ReviewProvider } from '@/context/ReviewContext';
import { Toaster } from 'react-hot-toast';
import ErrorBoundary from '@/components/ErrorBoundary';

const inter = Inter({
	subsets: ["latin"],
	variable: "--font-inter",
});

export const metadata: Metadata = {
	title: {
		default: "E-Commerce Store | Modern Shopping Experience",
		template: "%s | E-Commerce Store"
	},
	description: "Discover the latest fashion trends with our modern e-commerce platform. Shop clothing, accessories, and more with secure payment and fast shipping.",
	keywords: ["e-commerce", "online shopping", "fashion", "clothing", "streetwear", "accessories"],
	authors: [{ name: "E-Commerce Store" }],
	creator: "E-Commerce Store",
	publisher: "E-Commerce Store",
	formatDetection: {
		email: false,
		address: false,
		telephone: false,
	},
	metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'),
	openGraph: {
		title: "E-Commerce Store | Modern Shopping Experience",
		description: "Discover the latest fashion trends with our modern e-commerce platform.",
		type: "website",
		locale: "en_US",
		siteName: "E-Commerce Store",
	},
	twitter: {
		card: "summary_large_image",
		title: "E-Commerce Store | Modern Shopping Experience",
		description: "Discover the latest fashion trends with our modern e-commerce platform.",
	},
	robots: {
		index: true,
		follow: true,
		googleBot: {
			index: true,
			follow: true,
			'max-video-preview': -1,
			'max-image-preview': 'large',
			'max-snippet': -1,
		},
	},
	verification: {
		// Add Google Search Console verification if needed
		// google: 'your-verification-code',
	},
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body className=''>
				<ErrorBoundary>
					<AuthProvider>
						<StoreSettingsProvider>
							<CategoryProvider>
								<ProductProvider>
									<ReviewProvider>
										<DiscountProvider>
											<CartProvider>
												<WishlistProvider>
													<AddressProvider>
														<OrderProvider>
															<SettingsProvider>
																{children}
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
										</DiscountProvider>
									</ReviewProvider>
								</ProductProvider>
							</CategoryProvider>
						</StoreSettingsProvider>
					</AuthProvider>
				</ErrorBoundary>
			</body>
		</html>
	);
}
