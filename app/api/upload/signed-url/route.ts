import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import { getUserIdFromRequest } from "@/lib/auth/get-user";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request: NextRequest) {
  try {
    const userId = getUserIdFromRequest(request);
    if (!userId) {
      return NextResponse.json(
        { error: { message: "Unauthorized", code: "UNAUTHORIZED" } },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { filename, fileType } = body;

    if (!filename || !fileType) {
      return NextResponse.json(
        { error: { message: "Filename and file type required", code: "VALIDATION_ERROR" } },
        { status: 400 }
      );
    }

    const timestamp = Math.round(new Date().getTime() / 1000);
    const folder = `flyspec/${userId}`;
    
    const signature = cloudinary.utils.api_sign_request(
      {
        timestamp,
        folder,
        resource_type: "image",
      },
      process.env.CLOUDINARY_API_SECRET!
    );

    return NextResponse.json({
      data: {
        signature,
        timestamp,
        cloudName: process.env.CLOUDINARY_CLOUD_NAME,
        apiKey: process.env.CLOUDINARY_API_KEY,
        folder,
        resourceType: "image",
      },
    });
  } catch (error) {
    console.error("Signed URL error:", error);
    return NextResponse.json(
      { error: { message: "Failed to generate upload URL", code: "UPLOAD_ERROR" } },
      { status: 500 }
    );
  }
}