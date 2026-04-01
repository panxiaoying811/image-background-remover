"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import Header from "@/components/Header";
import Preview from "@/components/Preview";
import DownloadButton from "@/components/DownloadButton";

const DAILY_LIMIT = 50;

interface UsageRecord {
  count: number;
  date: string;
}

export default function Home() {
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [usageCount, setUsageCount] = useState(0);
  const [isLimitReached, setIsLimitReached] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load usage count from localStorage
  useEffect(() => {
    const today = new Date().toDateString();
    const stored = localStorage.getItem("picremove_usage");
    
    if (stored) {
      try {
        const record: UsageRecord = JSON.parse(stored);
        if (record.date === today) {
          setUsageCount(record.count);
          if (record.count >= DAILY_LIMIT) {
            setIsLimitReached(true);
          }
        }
      } catch (e) {
        console.error("Failed to parse usage record:", e);
      }
    }
  }, []);

  // Save usage count to localStorage
  const incrementUsage = useCallback(() => {
    const today = new Date().toDateString();
    const newCount = usageCount + 1;
    setUsageCount(newCount);
    localStorage.setItem("picremove_usage", JSON.stringify({
      count: newCount,
      date: today
    }));
    
    if (newCount >= DAILY_LIMIT) {
      setIsLimitReached(true);
    }
  }, [usageCount]);

  // Validate file before processing
  const validateFile = useCallback((file: File): string | null => {
    const validTypes = ["image/png", "image/jpeg", "image/jpg", "image/webp"];
    if (!validTypes.includes(file.type)) {
      return "请上传 PNG、JPG 或 WebP 格式的图片";
    }
    if (file.size > 10 * 1024 * 1024) {
      return "图片大小不能超过 10MB";
    }
    return null;
  }, []);

  // Process the image
  const processImage = useCallback(async (file: File) => {
    const validationError = validateFile(file);
    if (validationError) {
      setError(validationError);
      return;
    }

    if (isLimitReached) {
      setError(`今日使用次数已用完（${DAILY_LIMIT}次/天）`);
      return;
    }

    setError(null);
    setIsProcessing(true);
    setOriginalImage(null);
    setResultImage(null);

    try {
      // Create preview URL for original image
      const previewUrl = URL.createObjectURL(file);
      setOriginalImage(previewUrl);

      // Convert file to base64
      const base64 = await fileToBase64(file);

      // Call API with timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 60000); // 60s timeout

      const response = await fetch("/api/remove-bg", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ image: base64 }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.error || `处理失败 (${response.status})`);
      }

      const data = await response.json();
      
      if (!data.result) {
        throw new Error("处理返回结果为空");
      }

      setResultImage(data.result);
      incrementUsage();
    } catch (err) {
      console.error("Upload error:", err);
      if (err instanceof Error) {
        if (err.name === "AbortError") {
          setError("处理超时，请重试");
        } else {
          setError(err.message);
        }
      } else {
        setError("处理失败，请重试");
      }
      setOriginalImage(null);
      setResultImage(null);
    } finally {
      setIsProcessing(false);
    }
  }, [isLimitReached, validateFile, incrementUsage]);

  // File input change handler
  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      processImage(files[0]);
    }
    // Reset input so same file can be selected again
    e.target.value = "";
  }, [processImage]);

  // Drag and drop handlers
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
      processImage(files[0]);
    }
  }, [processImage]);

  // Click to open file dialog
  const handleUploadClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  // Keyboard support
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleUploadClick();
    }
  }, [handleUploadClick]);

  const handleReset = useCallback(() => {
    setOriginalImage(null);
    setResultImage(null);
    setError(null);
  }, []);

  return (
    <main className="min-h-screen">
      <Header usageCount={usageCount} dailyLimit={DAILY_LIMIT} />
      
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        {!originalImage && !resultImage ? (
          /* Upload Zone */
          <div
            className={`upload-zone ${isDragOver ? "drag-over" : ""} ${isProcessing ? "opacity-50 pointer-events-none" : ""}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={handleUploadClick}
            onKeyDown={handleKeyDown}
            role="button"
            tabIndex={0}
            aria-label="上传图片区域"
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/png,image/jpeg,image/jpg,image/webp"
              onChange={handleFileChange}
              style={{ display: "none" }}
            />
            
            {isProcessing ? (
              <div className="space-y-4">
                <div className="w-16 h-16 mx-auto border-4 border-primary border-t-transparent rounded-full animate-spin" />
                <p className="text-gray-600 text-lg">正在处理...</p>
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
                  <p>支持 PNG、JPG、WebP 格式</p>
                  <p>文件大小不超过 10MB</p>
                </div>
              </div>
            )}
          </div>
        ) : (
          /* Preview and Result */
          <div className="space-y-6">
            <Preview
              originalImage={originalImage}
              resultImage={resultImage}
              isProcessing={isProcessing}
            />
            
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl">
                {error}
              </div>
            )}
            
            <div className="flex flex-wrap gap-4 justify-center">
              {resultImage && <DownloadButton imageData={resultImage} />}
              <button onClick={handleReset} className="btn-primary bg-gray-500 hover:bg-gray-600">
                处理下一张
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

// Helper function to convert file to base64
function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error("文件读取失败"));
    reader.onabort = () => reject(new Error("文件读取被中断"));
  });
}
