# PicRemove - 图片背景移除工具

轻量级在线图片背景移除工具，基于 Next.js + Tailwind CSS 构建。

## ✨ 功能特点

- 📤 拖拽/点击上传图片
- ✂️ AI 自动移除背景（基于 Remove.bg API）
- 👁️ 处理前后对比预览
- ⬇️ 一键下载透明背景图片
- 📊 每日使用限制（50次/天）

## 🛠️ 技术栈

- **框架**: Next.js 14 (App Router)
- **样式**: Tailwind CSS
- **AI 服务**: Remove.bg API
- **部署**: Vercel / Cloudflare Pages

## 📦 安装

```bash
# 克隆项目
git clone <your-repo-url>
cd image-background-remover

# 安装依赖
npm install

# 复制环境变量配置
cp .env.local.example .env.local

# 编辑 .env.local，填入你的 Remove.bg API Key
```

### 获取 Remove.bg API Key

1. 访问 [remove.bg](https://www.remove.bg/) 注册账号
2. 进入 API 页面获取 API Key
3. 将 API Key 填入 `.env.local` 文件

## 🚀 运行

```bash
# 开发模式
npm run dev

# 构建生产版本
npm run build

# 启动生产服务
npm start
```

## 📁 项目结构

```
image-background-remover/
├── src/
│   ├── app/
│   │   ├── api/remove-bg/route.ts  # Remove.bg API 路由
│   │   ├── globals.css             # 全局样式
│   │   ├── layout.tsx              # 根布局
│   │   └── page.tsx                # 首页
│   └── components/
│       ├── Header.tsx              # 页头
│       ├── UploadZone.tsx          # 上传区域
│       ├── Preview.tsx             # 预览组件
│       └── DownloadButton.tsx      # 下载按钮
├── .env.local.example              # 环境变量示例
├── package.json
├── tailwind.config.ts
└── tsconfig.json
```

## 🔒 环境变量

| 变量 | 描述 |
|------|------|
| `REMOVE_BG_API_KEY` | Remove.bg API 密钥 |
| `DAILY_LIMIT` | 每日使用次数限制（默认 50） |

## 📄 License

MIT
