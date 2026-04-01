interface HeaderProps {
  usageCount: number;
  dailyLimit: number;
}

export default function Header({ usageCount, dailyLimit }: HeaderProps) {
  return (
    <header className="bg-white shadow-sm border-b border-gray-100">
      <div className="container mx-auto px-4 py-4 max-w-5xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center">
              <span className="text-white text-xl">✂️</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-800">
              Pic<span className="text-primary">Remove</span>
            </h1>
          </div>
          
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span>今日使用:</span>
            <span className={`font-semibold ${usageCount >= dailyLimit ? "text-red-500" : "text-primary"}`}>
              {usageCount}/{dailyLimit}
            </span>
            {usageCount < dailyLimit && (
              <span className="text-xs text-gray-400">次</span>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
