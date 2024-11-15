import fs from "fs";
import type { NextRequest } from "next/server";

export async function GET(
  _req: NextRequest,
  context: { params: { fileName: string } },
) {
  const file = fs.readFileSync(`public/${context.params.fileName}`);
  return new Response(file, {
    headers: {
      "Content-Type": "image/png",
    },
  });
}
