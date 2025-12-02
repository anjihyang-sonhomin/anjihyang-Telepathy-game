import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

type Params = Promise<{ id: string }>;

// PATCH /api/teams/[id] - 점수 업데이트
export async function PATCH(
  request: NextRequest,
  { params }: { params: Params }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { score } = body;

    if (typeof score !== "number") {
      return NextResponse.json(
        { error: "점수가 필요합니다" },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("teams")
      .update({ score: Math.max(0, score) })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (!data) {
      return NextResponse.json(
        { error: "팀을 찾을 수 없습니다" },
        { status: 404 }
      );
    }

    return NextResponse.json({ team: data });
  } catch {
    return NextResponse.json(
      { error: "잘못된 요청입니다" },
      { status: 400 }
    );
  }
}

// DELETE /api/teams/[id] - 팀 삭제
export async function DELETE(
  request: NextRequest,
  { params }: { params: Params }
) {
  try {
    const { id } = await params;

    const { error } = await supabase.from("teams").delete().eq("id", id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "삭제 실패" },
      { status: 500 }
    );
  }
}
