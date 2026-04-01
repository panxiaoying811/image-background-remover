import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { image } = await request.json();

    if (!image) {
      return NextResponse.json(
        { error: "未提供图片" },
        { status: 400 }
      );
    }

    const apiKey = process.env.REMOVE_BG_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: "API 密钥未配置，请联系管理员" },
        { status: 500 }
      );
    }

    // Call Remove.bg API
    const response = await fetch("https://api.remove.bg/v1.0/removebg", {
      method: "POST",
      headers: {
        "X-Api-Key": apiKey,
      },
      body: JSON.stringify({
        image_file_b64: image.split(",")[1], // Remove data URL prefix
        size: "auto",
        format: "png",
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error("Remove.bg API error:", errorData);
      
      if (response.status === 402) {
        return NextResponse.json(
          { error: "API 配额已用完" },
          { status: 402 }
        );
      }
      
      return NextResponse.json(
        { error: "图片处理失败，请重试" },
        { status: response.status }
      );
    }

    // Convert response to base64
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64 = `data:image/png;base64,${buffer.toString("base64")}`;

    return NextResponse.json({ result: base64 });
  } catch (error) {
    console.error("Remove-bg route error:", error);
    return NextResponse.json(
      { error: "服务器错误，请重试" },
      { status: 500 }
    );
  }
}
