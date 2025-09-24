// mock-server.js - File này để test API (chạy riêng)
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Mock API endpoint
app.post('/api/intake', (req, res) => {
  console.log('Received upload request:', req.body);
  
  // Giả lập xử lý
  setTimeout(() => {
    // Giả lập 90% thành công, 10% thất bại để test
    const isSuccess = Math.random() > 0.1;
    
    if (isSuccess) {
      res.status(200).json({
        success: true,
        message: 'File uploaded successfully',
        data: {
          fileUrl: req.body.fileUrl,
          meta: req.body.meta,
          timestamp: new Date().toISOString(),
          processId: `PROC_${Date.now()}`
        }
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'Upload failed due to server error'
      });
    }
  }, 1000); // Giả lập delay 1 giây
});

app.listen(PORT, () => {
  console.log(`Mock server is running on http://localhost:${PORT}`);
});

// Để chạy mock server:
// 1. npm install express cors
// 2. node mock-server.js