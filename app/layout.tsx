import "./globals.css";
import Link from "next/link";
export const metadata={title:"WSD Office Market",description:"Don't eat it. Sell it. 😋"};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="en"><body>
<header className="sticky top-0 z-20 border-b border-orange-100 bg-white/95 backdrop-blur"><div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
<Link href="/" className="text-xl font-black tracking-tight">WSD <span className="text-orange-500">Office Market</span></Link>
<nav className="hidden gap-5 text-sm font-bold md:flex"><Link href="/">Home</Link><Link href="/browse">Browse</Link><Link href="/sell">Sell</Link><Link href="/my-listings">My Listings</Link><Link href="/my-bids">My Bids</Link><Link href="/my-purchases">My Purchases</Link><Link href="/profile">Profile</Link></nav>
<Link href="/login" className="btn btn-primary text-sm">Sign In</Link></div></header>{children}</body></html>}