import { TRPCError } from "@trpc/server";
import { getHTTPStatusCodeFromError } from "@trpc/server/http";
import type { NextRequest } from "next/server";
import { db } from "~/server/db";
import { s3 } from "~/server/s3";

export async function GET(
  _: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const id = (await context.params).id;

    const file = await db.query.files.findFirst({
      where: (files, { eq }) => eq(files.id, id),
    });

    if (!file) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Файл не найден",
      });
    }

    return new Response(
      Buffer.from(
        (await s3.get(file.objectId)).split(";base64,").pop()!,
        "base64",
      ),
      {
        headers: {
          "Content-Type": file.contentType,
          "Content-Disposition": `attachment; filename="${encodeURIComponent(file.fileName)}"`,
          "Content-Encoding": "base64",
        },
      },
    );
  } catch (cause) {
    console.error(cause);
    if (cause instanceof TRPCError) {
      const httpCode = getHTTPStatusCodeFromError(cause);
      return new Response(cause.message, {
        status: httpCode,
      });
    }
    return new Response("Внутренняя ошибка сервера", {
      status: 500,
    });
  }
}