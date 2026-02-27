import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { getSupabase } from "@/lib/supabase";

const TABLES = ["learnings", "todos", "attendance", "reflections", "study_logs", "timeline"] as const;
type TableName = (typeof TABLES)[number];

function isValidTable(table: string): table is TableName {
  return TABLES.includes(table as TableName);
}

async function getUserId(): Promise<string | null> {
  const session = await getServerSession();
  return (session?.user as any)?.id || session?.user?.email || null;
}

// GET: 사용자의 전체 데이터 또는 특정 테이블 데이터 조회
export async function GET(request: NextRequest) {
  const userId = await getUserId();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const table = request.nextUrl.searchParams.get("table");

  // 특정 테이블만 조회
  if (table) {
    if (!isValidTable(table)) {
      return NextResponse.json({ error: "Invalid table" }, { status: 400 });
    }
    const { data, error } = await getSupabase()
      .from(table)
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ data });
  }

  // 전체 데이터 조회 (로그인 시 초기 로딩)
  const results: Record<string, any[]> = {};
  for (const t of TABLES) {
    const orderCol = t === "attendance" ? "date" : "created_at";
    const { data } = await getSupabase()
      .from(t)
      .select("*")
      .eq("user_id", userId)
      .order(orderCol, { ascending: false });
    results[t] = data || [];
  }

  return NextResponse.json({ data: results });
}

// POST: 데이터 upsert (저장/동기화)
export async function POST(request: NextRequest) {
  const userId = await getUserId();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const { table, items } = body as { table: string; items: any[] };

  if (!table || !isValidTable(table)) {
    return NextResponse.json({ error: "Invalid table" }, { status: 400 });
  }

  if (!Array.isArray(items)) {
    return NextResponse.json({ error: "items must be an array" }, { status: 400 });
  }

  // user_id 주입
  const withUserId = items.map((item) => ({ ...item, user_id: userId }));

  const { data, error } = await getSupabase()
    .from(table)
    .upsert(withUserId, { onConflict: "id" })
    .select();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ data });
}

// DELETE: 데이터 삭제
export async function DELETE(request: NextRequest) {
  const userId = await getUserId();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const { table, id } = body as { table: string; id: string };

  if (!table || !isValidTable(table)) {
    return NextResponse.json({ error: "Invalid table" }, { status: 400 });
  }

  const { error } = await getSupabase()
    .from(table)
    .delete()
    .eq("id", id)
    .eq("user_id", userId);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
