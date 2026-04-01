import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { image } = body;

    if (!image) {
      return NextResponse.json(
        { error: "未提供图片" },
        { status: 400 }
      );
    }

    const apiKey = process.env.REMOVE_BG_API_KEY;

    if (!apiKey) {
      console.error("REMOVE_BG_API_KEY is not configured");
      return NextResponse.json(
        { error: "API 密钥未配置，请联系管理员" },
        { status: 500 }
      );
    }

    // Extract base64 data (remove data URL prefix if present)
    let base64Data = image;
    if (image.includes(",")) {
      base64Data = image.split(",")[1];
    }

    // Remove.bg API requires FormData
    const formData = new FormData();
    formData.append("image_file_b64", base64Data);
    formData.append("size", "auto");
    formData.append("format", "png");

    console.log("Calling Remove.bg API...");

    // Call Remove.bg API with extended timeout
    const response = await fetch("https://api.remove.bg/v1.0/removebg", {
      method: "POST",
      headers: {
        "X-Api-Key": apiKey,
      },
      body: formData,
    });

    console.log("Remove.bg response status:", response.status);

    if (!response.ok) {
      let errorMessage = "图片处理失败";
      
      try {
        const errorData = await response.json();
        console.error("Remove.bg API error:", errorData);
        
        // Check for specific error codes
        if (response.status === 402 || (errorData.errors && errorData.errors.some((e: { code: string }) => ["credit_low", "insufficient_credits"].includes(e.code)))) {
          errorMessage = "API 配额已用完，请明天再试或联系管理员";
        } else if (errorData.errors && errorData.errors.length > 0) {
          errorMessage = errorData.errors[0].title || errorMessage;
        }
      } catch (e) {
        errorMessage = `处理失败 (HTTP ${response.status})`;
      }
      
      return NextResponse.json(
        { error: errorMessage },
        { status: response.status }
      );
    }

    // Get response as array buffer
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const resultBase64 = `data:image/png;base64,${buffer.toString("base64")}`;

    console.log("Remove.bg success, result length:", resultBase64.length);

    return NextResponse.json({ result: resultBase64 });
  } catch (error) {
    console.error("Remove-bg route error:", error);
    
    let errorMessage = "服务器错误，请重试";
    if (error instanceof Error) {
      if (error.name === "AbortError") {
        errorMessage = "请求超时，请重试";
      } else {
        errorMessage = error.message;
      }
    }
    
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
