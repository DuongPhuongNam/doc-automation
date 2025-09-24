# Upload File Feature

## Mô tả
Giao diện upload file đơn giản cho phép người dùng upload file CSV hoặc JSON và gọi API backend.

## Cấu trúc Files

```
src/
├── components/
│   └── UploadFile.tsx          # Component chính xử lý upload
├── App.tsx                     # App component render UploadFile
└── main.tsx                    # Entry point

mock-server.js                  # Mock API server để test
vite.config.ts                  # Cấu hình Vite với proxy API
```

## Tính năng

### 1. Upload File
- Chỉ cho phép file CSV và JSON
- Hiển thị thông tin file (tên, kích thước) sau khi chọn
- Kiểm tra loại file trước khi upload

### 2. Progress Tracking
- Progress bar hiển thị % upload
- Trạng thái loading khi đang upload
- Vô hiệu hóa controls khi đang upload

### 3. API Integration
- Gọi POST `/api/intake` với payload:
```json
{
  "fileUrl": "mock-url-hoặc-tạm-thời",
  "meta": {
    "salesOrg": "1000", 
    "distChannel": "10",
    "division": "00"
  }
}
```

### 4. Error Handling
- Thông báo lỗi khi file không hợp lệ
- Thông báo khi upload thành công/thất bại
- Auto reset form sau khi thành công

## Cách chạy

### 1. Cài đặt dependencies
```bash
npm install
```

### 2. Chạy mock server (terminal 1)
```bash
# Cài đặt dependencies cho mock server
npm install express cors

# Chạy mock server
node mock-server.js
```

### 3. Chạy ứng dụng (terminal 2)
```bash
npm run dev
```

### 4. Test
- Mở trình duyệt tại `http://localhost:5173`
- Chọn file CSV hoặc JSON để upload
- Nhấn nút "Upload" và xem kết quả

## Customization

### Thay đổi API endpoint
Trong `UploadFile.tsx`, tìm dòng:
```typescript
const response = await fetch('/api/intake', {
```

### Thay đổi meta data
Trong `UploadFile.tsx`, tìm object:
```typescript
meta: {
  salesOrg: "1000",
  distChannel: "10", 
  division: "00"
}
```

### Thay đổi file types được phép
Trong `UploadFile.tsx`, tìm:
```typescript
const allowedTypes = ['.csv', '.json'];
```

## UI/UX Features

- **Responsive design**: Hoạt động tốt trên mobile và desktop
- **Loading states**: Visual feedback trong quá trình upload
- **Progress indicator**: Progress bar với phần trăm
- **File validation**: Kiểm tra loại file ngay khi chọn
- **Error handling**: Hiển thị lỗi rõ ràng
- **Auto reset**: Tự động reset form sau khi thành công
- **Accessibility**: Hỗ trợ keyboard navigation và screen readers

## Technology Stack

- **Frontend**: React 19 + TypeScript + Vite
- **Styling**: TailwindCSS
- **HTTP Client**: Fetch API
- **Mock Server**: Express.js (for testing)

## Notes

- Mock server giả lập 90% thành công, 10% thất bại để test cả hai trường hợp
- Progress bar được giả lập vì chưa có real upload endpoint
- File URL hiện tại là mock, trong production cần upload file lên storage trước
- Component có thể dễ dàng tích hợp vào các layout khác nhau