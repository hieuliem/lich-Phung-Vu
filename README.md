# Thánh Ca & Lời Chúa

Thư viện Lịch Phụng Vụ tiếng Việt, xây dựng bằng Next.js, Drizzle ORM và Neon Postgres để triển khai trên Vercel.

## Chạy tại máy

1. Sao chép `.env.example` thành `.env.local` và điền chuỗi kết nối Neon.
2. Chạy `npm install`.
3. Chạy `npm run db:migrate` để tạo schema và dữ liệu mẫu.
4. Chạy `npm run dev`.

## Triển khai Vercel

Kết nối repository này với Vercel và đặt các biến môi trường `DATABASE_URL`, `DATABASE_URL_UNPOOLED`, và `NEXT_PUBLIC_SITE_URL`. Không commit file `.env.local` hoặc chuỗi kết nối database.
