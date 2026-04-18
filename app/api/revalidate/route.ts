import { revalidatePath } from "next/cache";

export async function POST(req: Request) {
  const { path } = await req.json();
  if (!path) return Response.json({ error: "path is required" }, { status: 400 });

  revalidatePath(path);
  return Response.json({ revalidated: true, path });
}
