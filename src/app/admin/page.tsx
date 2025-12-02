"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase, Team } from "@/lib/supabase";

const GOLD = "#FBBF24";
const DARK = "#0f172a";
const TOTAL_TEAMS = 16;

export default function AdminPage() {
  const router = useRouter();
  const [teams, setTeams] = useState<Team[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadTeams = async () => {
      const { data, error } = await supabase
        .from("teams")
        .select("*")
        .order("created_at", { ascending: true });

      if (!error && data) {
        setTeams(data);
      }
      setIsLoading(false);
    };

    loadTeams();

    const channel = supabase
      .channel("admin-teams")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "teams" },
        (payload) => {
          if (payload.eventType === "INSERT") {
            setTeams((prev) => [...prev, payload.new as Team]);
          } else if (payload.eventType === "DELETE") {
            setTeams((prev) =>
              prev.filter((t) => t.id !== payload.old.id)
            );
          } else if (payload.eventType === "UPDATE") {
            setTeams((prev) =>
              prev.map((t) =>
                t.id === payload.new.id ? (payload.new as Team) : t
              )
            );
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const handleDeleteTeam = async (teamId: string, teamName: string) => {
    if (!confirm(`"${teamName}" 팀을 삭제하시겠습니까?`)) return;

    try {
      await fetch(`/api/teams/${teamId}`, { method: "DELETE" });
    } catch (err) {
      console.error("삭제 오류:", err);
    }
  };

  const handleStartGame = () => {
    router.push("/admin/scores");
  };

  if (isLoading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: DARK }}
      >
        <div className="text-2xl" style={{ color: GOLD }}>
          로딩 중...
        </div>
      </div>
    );
  }

  // 16칸 슬롯 생성
  const slots = Array.from({ length: TOTAL_TEAMS }, (_, i) => teams[i] || null);

  return (
    <div
      className="min-h-screen p-6 flex flex-col relative"
      style={{ backgroundColor: DARK }}
    >
      {/* 헤더 */}
      <div className="text-center mb-6">
        <h1 className="text-5xl font-bold mb-2" style={{ color: GOLD }}>
          공통점을 찾아라!
        </h1>
        <p className="text-xl text-gray-400">우리는 통한다</p>
      </div>

      {/* 입장 현황 */}
      <div className="text-center mb-6">
        <span className="text-6xl font-bold" style={{ color: GOLD }}>
          {teams.length}
        </span>
        <span className="text-3xl text-gray-500"> / {TOTAL_TEAMS}</span>
      </div>

      {/* 4x4 그리드 - 화면 꽉 채우기 */}
      <div className="flex-1 max-w-7xl mx-auto w-full px-4">
        <div className="grid grid-cols-4 gap-4 h-full">
          {slots.map((team, index) => (
            <div
              key={team?.id || `empty-${index}`}
              className={`relative group rounded-2xl flex items-center justify-center transition-all ${
                team
                  ? "transform hover:scale-105"
                  : ""
              }`}
              style={{
                backgroundColor: team
                  ? "rgba(251, 191, 36, 0.2)"
                  : "rgba(107, 114, 128, 0.2)",
                border: team
                  ? `2px solid ${GOLD}`
                  : "2px dashed #4B5563",
                minHeight: "180px",
              }}
            >
              {team ? (
                <>
                  <span
                    className="absolute top-2 left-3 text-sm font-medium"
                    style={{ color: GOLD }}
                  >
                    #{index + 1}
                  </span>
                  <button
                    onClick={() => handleDeleteTeam(team.id, team.team_name)}
                    className="absolute top-2 right-2 w-7 h-7 rounded-full bg-white/10 hover:bg-red-500 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100 text-white"
                  >
                    ✕
                  </button>
                  <p className="text-3xl font-bold text-white">{team.team_name}</p>
                </>
              ) : (
                <div className="text-center">
                  <p className="text-5xl text-gray-600 tracking-widest">...</p>
                  <p className="text-base text-gray-600 mt-2">대기중</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* 점수 현황 버튼 - 오른쪽 하단 */}
      <button
        onClick={handleStartGame}
        className="fixed bottom-6 right-6 px-6 py-3 rounded-xl shadow-lg hover:opacity-90 transition-all text-lg font-medium"
        style={{ backgroundColor: GOLD, color: DARK }}
      >
        점수 현황 →
      </button>
    </div>
  );
}
