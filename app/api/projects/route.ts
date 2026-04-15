import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getUserIdFromRequest } from "@/lib/auth/get-user";

const createProjectSchema = z.object({
  name: z.string().min(1, "Project name is required"),
});

export async function GET(request: NextRequest) {
  try {
    const userId = getUserIdFromRequest(request);
    if (!userId) {
      return NextResponse.json(
        { error: { message: "Unauthorized", code: "UNAUTHORIZED" } },
        { status: 401 }
      );
    }

    const projects = await prisma.project.findMany({
      where: { userId },
      select: {
        id: true,
        name: true,
        status: true,
        photoCount: true,
        createdAt: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ data: projects }, { status: 200 });
  } catch (error) {
    console.error("GET projects error:", error);
    return NextResponse.json(
      { error: { message: "Internal server error", code: "INTERNAL_ERROR" } },
      { status: 500 }
    );
  }
}

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
    const result = createProjectSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: { message: result.error.issues[0].message, code: "VALIDATION_ERROR" } },
        { status: 400 }
      );
    }

    const { name } = result.data;

    const project = await prisma.project.create({
      data: {
        userId,
        name,
      },
      select: {
        id: true,
        name: true,
        status: true,
        createdAt: true,
      },
    });

    return NextResponse.json({ data: project }, { status: 201 });
  } catch (error) {
    console.error("POST projects error:", error);
    return NextResponse.json(
      { error: { message: "Internal server error", code: "INTERNAL_ERROR" } },
      { status: 500 }
    );
  }
}