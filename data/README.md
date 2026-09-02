# Dữ liệu Lịch Phụng Vụ

Mỗi file JSON là một phiên bản nhập dữ liệu cho một năm hoặc một nhóm năm A/B/C.

Chạy nhập dữ liệu bằng:

```bash
npm run db:import -- data/liturgical-a.json
```

Trình nhập dùng `slug` làm khóa ổn định: chạy lại cùng file sẽ cập nhật ngày, nội dung và liên kết thánh ca thay vì tạo bản ghi trùng. Không đưa nội dung toàn văn Kinh Thánh hoặc thông tin bí mật vào Git repository.
