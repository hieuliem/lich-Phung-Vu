import type { Metadata } from 'next';
import { Lora, Be_Vietnam_Pro } from 'next/font/google';
import './globals.css';

const sans = Be_Vietnam_Pro({ variable: '--font-vietnam', subsets: ['vietnamese'], weight: ['400', '500', '600', '700'] });
const heading = Lora({ variable: '--font-lora', subsets: ['vietnamese'], weight: ['500', '600', '700'] });

const title = 'Thánh Ca & Lời Chúa | Thư viện Phụng Vụ';
const description = 'Tra cứu bài đọc và thánh nhạc cho các Chúa Nhật và Lễ Trọng theo Lịch Phụng Vụ.';

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'),
  title,
  description,
  openGraph: { title, description, images: [{ url: '/og.png', width: 1200, height: 630, alt: 'Thánh Ca & Lời Chúa' }] },
  twitter: { card: 'summary_large_image', title, description, images: ['/og.png'] },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="vi"><body className={`${sans.variable} ${heading.variable} antialiased`}>{children}</body></html>; }
