"use client";

import { useState, useCallback, useRef } from "react";

interface UploadZoneProps {
  onUpload: (file: File) => void;
  isProcessing: boolean;
}

export default function UploadZone({ onUpload, isProcessing }: UploadZoneProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
    
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      onUpload(files[0]);
    }
  }, [onUpload]);

  const handleClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      onUpload(files[0]);
    }
    // Reset input so same file can be selected again
    e.target.value = "";
  }, [onUpload]);

  // Prevent click propagation when clicking on the input itself
  const handleInputClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
  }, []);

  return (
    <div
      className={`upload-zone ${isDragOver ? "drag-over" : ""}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleClick();
        }
      }}
    >
      {/* File input - using inline styles instead of Tailwind hidden class for better browser compatibility */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/png,image/jpeg,image/jpg"
        onChange={handleFileChange}
        onClick={handleInputClick}
        style={{ display: "none" }}
        aria-label="上传图片"
      />
      
      {isProcessing ? (
        <div className="space-y-4">
          <div className="w-16 h-16 mx-auto border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-600 text-lg">正在移除背景...</p>
          <p className="text-gray-400 text-sm">预计需要几秒钟</p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="w-20 h-20 mx-auto bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full flex items-center justify-center">
            <span className="text-4xl">📤</span>
          </div>
          <div>
            <p className="text-xl font-semibold text-gray-700">
              拖拽图片到这里
            </p>
            <p className="text-gray-500 mt-2">或点击选择文件</p>
          </div>
          <div className="text-sm text-gray-400 space-y-1">
            <p>支持 PNG、JPG 格式</p>
            <p>文件大小不超过 10MB</p>
          </div>
        </div>
      )}
    </div>
  );
}
