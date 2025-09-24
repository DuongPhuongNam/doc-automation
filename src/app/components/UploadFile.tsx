import React, { useState } from 'react';

interface FileInfo {
  name: string;
  size: number;
  file: File;
}

interface UploadResponse {
  success: boolean;
  message: string;
}

const UploadFile: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<FileInfo | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Xử lý khi người dùng chọn file
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Kiểm tra loại file (chỉ cho phép CSV và JSON)
      const allowedTypes = ['.csv', '.json'];
      const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
      
      if (!allowedTypes.includes(fileExtension)) {
        setMessage({
          type: 'error',
          text: 'Chỉ cho phép upload file CSV hoặc JSON!'
        });
        return;
      }

      setSelectedFile({
        name: file.name,
        size: file.size,
        file: file
      });
      setMessage(null);
    }
  };

  // Định dạng kích thước file
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Giả lập progress upload
  const simulateProgress = (): Promise<void> => {
    return new Promise((resolve) => {
      let progress = 0;
      const interval = setInterval(() => {
        progress += Math.random() * 30;
        if (progress >= 100) {
          progress = 100;
          setUploadProgress(100);
          clearInterval(interval);
          resolve();
        } else {
          setUploadProgress(progress);
        }
      }, 200);
    });
  };

  // Xử lý upload file
  const handleUpload = async () => {
    if (!selectedFile) {
      setMessage({
        type: 'error',
        text: 'Vui lòng chọn file để upload!'
      });
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);
    setMessage(null);

    try {
      // Giả lập progress
      await simulateProgress();

      // Tạo mock URL cho file (trong thực tế sẽ upload file lên storage trước)
      const mockFileUrl = `https://mock-storage.example.com/files/${selectedFile.name}`;

      // Cấu hình API URL cho production
      const apiUrl = import.meta.env.VITE_SERVER_URL || '/api';
      
      // Gọi API POST tới /api/intake
      const response = await fetch(`${apiUrl}/intake`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fileUrl: mockFileUrl,
          meta: {
            salesOrg: "1000",
            distChannel: "10",
            division: "00"
          }
        })
      });

      if (response.ok) {
        const result: UploadResponse = await response.json();
        setMessage({
          type: 'success',
          text: 'Upload thành công!'
        });
        
        // Reset form sau khi upload thành công
        setTimeout(() => {
          setSelectedFile(null);
          setUploadProgress(0);
          setMessage(null);
        }, 3000);
      } else {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error('Upload error:', error);
      setMessage({
        type: 'error',
        text: 'Upload thất bại!'
      });
    } finally {
      setIsUploading(false);
    }
  };

  // Reset form
  const handleReset = () => {
    setSelectedFile(null);
    setUploadProgress(0);
    setMessage(null);
    setIsUploading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">
          Upload File
        </h2>

        {/* File Input */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Chọn file CSV hoặc JSON
          </label>
          <input
            type="file"
            accept=".csv,.json"
            onChange={handleFileSelect}
            disabled={isUploading}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
          />
        </div>

        {/* File Info */}
        {selectedFile && (
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-medium text-gray-800 mb-2">Thông tin file:</h3>
            <div className="text-sm text-gray-600 space-y-1">
              <div className="flex justify-between">
                <span>Tên file:</span>
                <span className="font-medium">{selectedFile.name}</span>
              </div>
              <div className="flex justify-between">
                <span>Kích thước:</span>
                <span className="font-medium">{formatFileSize(selectedFile.size)}</span>
              </div>
            </div>
          </div>
        )}

        {/* Progress Bar */}
        {isUploading && (
          <div className="mb-6">
            <div className="flex justify-between text-sm text-gray-600 mb-1">
              <span>Đang upload...</span>
              <span>{Math.round(uploadProgress)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
          </div>
        )}

        {/* Message */}
        {message && (
          <div
            className={`mb-6 p-3 rounded-md text-sm font-medium ${
              message.type === 'success'
                ? 'bg-green-100 text-green-800 border border-green-200'
                : 'bg-red-100 text-red-800 border border-red-200'
            }`}
          >
            {message.text}
          </div>
        )}

        {/* Buttons */}
        <div className="space-y-3">
          <button
            onClick={handleUpload}
            disabled={!selectedFile || isUploading}
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-md font-medium hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            {isUploading ? 'Đang upload...' : 'Upload'}
          </button>

          {selectedFile && !isUploading && (
            <button
              onClick={handleReset}
              className="w-full bg-gray-500 text-white py-2 px-4 rounded-md font-medium hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
            >
              Hủy
            </button>
          )}
        </div>

        {/* Instructions */}
        <div className="mt-6 text-xs text-gray-500 text-center">
          <p>Chỉ hỗ trợ file CSV và JSON</p>
          <p>Kích thước tối đa: 10MB</p>
        </div>
      </div>
    </div>
  );
};

export default UploadFile;