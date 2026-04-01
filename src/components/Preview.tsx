"use client";

interface PreviewProps {
  originalImage: string | null;
  resultImage: string | null;
  isProcessing: boolean;
}

export default function Preview({ originalImage, resultImage, isProcessing }: PreviewProps) {
  return (
    <div className="grid md:grid-cols-2 gap-6">
      {/* Original Image */}
      <div className="preview-card">
        <h3 className="text-sm font-medium text-gray-500 mb-3 text-center">原图</h3>
        <div className="relative bg-gray-100 rounded-xl overflow-hidden aspect-square flex items-center justify-center min-h-[250px]">
          {originalImage ? (
            <img
              src={originalImage}
              alt="原图"
              className="max-w-full max-h-full object-contain"
            />
          ) : (
            <div className="w-16 h-16 border-4 border-dashed border-gray-300 rounded-xl" />
          )}
        </div>
      </div>

      {/* Result Image */}
      <div className="preview-card">
        <h3 className="text-sm font-medium text-gray-500 mb-3 text-center">移除背景后</h3>
        <div className="relative bg-gray-100 rounded-xl overflow-hidden aspect-square flex items-center justify-center min-h-[250px]">
          {/* Checkerboard pattern for transparency */}
          <div 
            className="absolute inset-0 opacity-30"
            style={{
              backgroundImage: `linear-gradient(45deg, #ccc 25%, transparent 25%), 
                               linear-gradient(-45deg, #ccc 25%, transparent 25%), 
                               linear-gradient(45deg, transparent 75%, #ccc 75%), 
                               linear-gradient(-45deg, transparent 75%, #ccc 75%)`,
              backgroundSize: `16px 16px`,
              backgroundPosition: `0 0, 0 8px, 8px -8px, -8px 0px`,
            }}
          />
          
          {isProcessing ? (
            <div className="relative z-10 space-y-3">
              <div className="w-12 h-12 mx-auto border-4 border-primary border-t-transparent rounded-full animate-spin" />
              <p className="text-gray-500 text-sm">处理中...</p>
            </div>
          ) : resultImage ? (
            <img
              src={resultImage}
              alt="结果"
              className="relative z-10 max-w-full max-h-full object-contain"
            />
          ) : (
            <div className="relative z-10 w-16 h-16 border-4 border-dashed border-gray-300 rounded-xl" />
          )}
        </div>
      </div>
    </div>
  );
}
