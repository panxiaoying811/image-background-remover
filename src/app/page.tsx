"use client";

import { useState, useCallback, useEffect } from "react";
import Header from "@/components/Header";
import UploadZone from "@/components/UploadZone";
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

  // Load usage count from localStorage
  useEffect(() => {
    const today = new Date().toDateString();
    const stored = localStorage.getItem("picremove_usage");
    
    if (stored) {
      const record: UsageRecord = JSON.parse(stored);
      if (record.date === today) {
        setUsageCount(record.count);
        if (record.count >= DAILY_LIMIT) {
          setIsLimitReached(true);
        }
      }
    }
  }, []);

  // Save usage count to localStorage
  const incrementUsage = () => {
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
  };

  const handleImageUpload = useCallback(async (file: File) => {
    // Validate file
    if (!file.type.includes("png") && !file.type.includes("jpeg") && !file.type.includes("jpg")) {
      setError("请上传 PNG 或 JPG 格式的图片");
      return;
    }
    
    if (file.size > 10 * 1024 * 1024) {
      setError("图片大小不能超过 10MB");
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

      // Call API
      const response = await fetch("/api/remove-bg", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ image: base64 }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "处理失败");
      }

      const data = await response.json();
      setResultImage(data.result);
      incrementUsage();
    } catch (err) {
      setError(err instanceof Error ? err.message : "处理失败，请重试");
      setOriginalImage(null);
    } finally {
      setIsProcessing(false);
    }
  }, [isLimitReached]);

  const handleReset = () => {
    setOriginalImage(null);
    setResultImage(null);
    setError(null);
  };

  return (
    <main className="min-h-screen">
      <Header usageCount={usageCount} dailyLimit={DAILY_LIMIT} />
      
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        {!originalImage && !resultImage ? (
          <UploadZone onUpload={handleImageUpload} isProcessing={isProcessing} />
        ) : (
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

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
  });
}
