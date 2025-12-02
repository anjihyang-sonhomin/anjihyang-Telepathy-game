import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

// GET /api/teams - 팀 조회 (전체 또는 이름으로)
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const name = searchParams.get("name");

  if (name) {
    // 특정 팀 조회
    const { data, error } = await supabase
      .from("teams")
      .select("*")
      .eq("team_name", name.toLowerCase())
      .single();

    if (error && error.code !== "PGRST116") {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ team: data || null });
  }

  // 전체 팀 조회
  const { data, error } = await supabase
    .from("teams")
    .select("*")
    .order("score", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ teams: data });
}

// POST /api/teams - 팀 생성
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { team_name } = body;

    if (!team_name) {
      return NextResponse.json(
        { error: "팀명이 필요합니다" },
        { status: 400 }
      );
    }

    const normalizedName = team_name.trim().toLowerCase();

    // 중복 체크
    const { data: existing } = await supabase
      .from("teams")
      .select("id")
      .eq("team_name", normalizedName)
      .single();

    if (existing) {
      return NextResponse.json(
        { error: "이미 존재하는 팀명입니다" },
        { status: 409 }
      );
    }

    // 팀 생성
    const { data, error } = await supabase
      .from("teams")
      .insert({ team_name: normalizedName, score: 0 })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ team: data }, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "잘못된 요청입니다" },
      { status: 400 }
    );
  }
}
