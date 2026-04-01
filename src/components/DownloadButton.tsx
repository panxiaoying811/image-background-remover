"use client";

interface DownloadButtonProps {
  imageData: string;
}

export default function DownloadButton({ imageData }: DownloadButtonProps) {
  const handleDownload = () => {
    // Convert data URL to blob and download
    const link = document.createElement("a");
    link.href = imageData;
    link.download = `picremove-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <button onClick={handleDownload} className="btn-primary flex items-center gap-2">
      <span>⬇️</span>
      <span>下载图片</span>
    </button>
  );
}
