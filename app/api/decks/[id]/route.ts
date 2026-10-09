import { NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabase-server";

const MISSING_ENV_ERROR =
  "Server is missing SUPABASE_URL or SUPABASE_SECRET_KEY. Add them to .env.local.";

export async function DELETE(_req: Request, ctx: RouteContext<"/api/decks/[id]">) {
  const { id } = await ctx.params;

  let supabase;
  try {
    supabase = getSupabaseServerClient();
  } catch {
    return NextResponse.json({ error: MISSING_ENV_ERROR }, { status: 500 });
  }

  const { error } = await supabase.from("decks").delete().eq("id", id);
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
