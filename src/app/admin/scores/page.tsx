"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { supabase, Team } from "@/lib/supabase";

const GOLD = "#FBBF24";
const DARK = "#0f172a";

type TeamWithEffect = Team & {
  scoreEffect?: number;
};

export default function AdminScoresPage() {
  const [teams, setTeams] = useState<TeamWithEffect[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const prevScoresRef = useRef<Record<string, number>>({});

  useEffect(() => {
    const loadTeams = async () => {
      const { data, error } = await supabase
        .from("teams")
        .select("*")
        .order("score", { ascending: false });

      if (!error && data) {
        setTeams(data);
        const scores: Record<string, number> = {};
        data.forEach((t) => (scores[t.id] = t.score));
        prevScoresRef.current = scores;
      }
      setIsLoading(false);
    };

    loadTeams();

    const channel = supabase
      .channel("admin-scores")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "teams" },
        (payload) => {
          if (payload.eventType === "INSERT") {
            const newTeam = payload.new as Team;
            prevScoresRef.current[newTeam.id] = newTeam.score;
            setTeams((prev) =>
              [...prev, newTeam].sort((a, b) => b.score - a.score)
            );
          } else if (payload.eventType === "DELETE") {
            delete prevScoresRef.current[payload.old.id];
            setTeams((prev) =>
              prev.filter((t) => t.id !== payload.old.id)
            );
          } else if (payload.eventType === "UPDATE") {
            const updatedTeam = payload.new as Team;
            const prevScore = prevScoresRef.current[updatedTeam.id] ?? 0;
            const diff = updatedTeam.score - prevScore;

            prevScoresRef.current[updatedTeam.id] = updatedTeam.score;

            setTeams((prev) => {
              const updated = prev.map((t) =>
                t.id === updatedTeam.id
                  ? { ...updatedTeam, scoreEffect: diff !== 0 ? diff : undefined }
                  : t
              );
              return updated.sort((a, b) => b.score - a.score);
            });

            if (diff !== 0) {
              setTimeout(() => {
                setTeams((prev) =>
                  prev.map((t) =>
                    t.id === updatedTeam.id ? { ...t, scoreEffect: undefined } : t
                  )
                );
              }, 2000);
            }
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

  if (isLoading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: DARK }}
      >
        <div className="text-2xl" style={{ color: GOLD }}>로딩 중...</div>
      </div>
    );
  }

  const firstPlace = teams[0];
  const restTeams = teams.slice(1);

  const handleRandomScore = async () => {
    if (teams.length === 0) return;

    const randomTeam = teams[Math.floor(Math.random() * teams.length)];
    const randomScore = Math.floor(Math.random() * 20) + 1; // 1~20

    try {
      await fetch(`/api/teams/${randomTeam.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ score: randomTeam.score + randomScore }),
      });
    } catch (err) {
      console.error("랜덤 점수 오류:", err);
    }
  };

  return (
    <div
      className="min-h-screen p-6 pt-24"
      style={{ backgroundColor: DARK }}
    >
      {/* 1등 영역 */}
      {firstPlace && (
        <div className="text-center mb-10">
          <div
            className="inline-block rounded-3xl px-16 py-10 relative min-w-[400px]"
            style={{
              backgroundColor: "rgba(251, 191, 36, 0.15)",
              border: `3px solid ${GOLD}`
            }}
          >
            {/* 점수 이펙트 - 크게! */}
            {firstPlace.scoreEffect && (
              <div
                className="absolute -top-16 left-1/2 -translate-x-1/2 text-8xl font-bold"
                style={{ color: GOLD, animation: "floatUp 2s ease-out forwards" }}
              >
                +{firstPlace.scoreEffect}
              </div>
            )}

            <p className="text-7xl mb-3">👑</p>
            <p className="text-xl text-gray-400 mb-2">현재 1등</p>
            <p className="text-6xl font-bold text-white mb-3 truncate max-w-[350px] mx-auto">{firstPlace.team_name}</p>
            <p className="text-5xl font-bold" style={{ color: GOLD }}>{firstPlace.score}점</p>
          </div>
        </div>
      )}

      {/* 나머지 팀 - 4열 그리드 */}
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-4 gap-4">
          {restTeams.map((team) => (
            <div
              key={team.id}
              className="relative group rounded-xl py-5 px-4 flex flex-col items-center justify-center transition-all hover:scale-105"
              style={{ backgroundColor: "rgba(251, 191, 36, 0.1)", border: `2px solid rgba(251, 191, 36, 0.3)` }}
            >
              {/* 점수 이펙트 - 크게! */}
              {team.scoreEffect && (
                <div
                  className="absolute -top-10 left-1/2 -translate-x-1/2 text-5xl font-bold"
                  style={{ color: GOLD, animation: "floatUp 2s ease-out forwards" }}
                >
                  +{team.scoreEffect}
                </div>
              )}

              {/* 팀 이름 */}
              <p className="text-2xl font-bold text-white truncate max-w-full">{team.team_name}</p>

              {/* 점수 */}
              <p className="text-3xl font-bold mt-2" style={{ color: GOLD }}>{team.score}</p>

              {/* 삭제 버튼 */}
              <button
                onClick={() => handleDeleteTeam(team.id, team.team_name)}
                className="absolute top-1 right-1 w-6 h-6 rounded-full bg-white/10 hover:bg-red-500 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100 text-white text-sm"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      </div>

      {teams.length === 0 && (
        <div className="min-h-[60vh] flex items-center justify-center">
          <p className="text-gray-500 text-center text-2xl">
            참가한 팀이 없습니다
          </p>
        </div>
      )}

      {/* 하단 버튼들 */}
      <div className="fixed bottom-6 right-6 flex flex-col gap-3">
        <button
          onClick={handleRandomScore}
          disabled={teams.length === 0}
          className="px-6 py-3 rounded-xl shadow-lg hover:opacity-90 transition-all text-lg font-medium disabled:opacity-50"
          style={{ backgroundColor: "#10B981", color: "white" }}
        >
          🎲 랜덤 점수
        </button>
        <Link
          href="/admin"
          className="px-6 py-3 rounded-xl shadow-lg hover:opacity-90 transition-all text-lg font-medium text-center"
          style={{ backgroundColor: GOLD, color: DARK }}
        >
          ← 대기 화면
        </Link>
      </div>

      <style jsx>{`
        @keyframes floatUp {
          0% {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
          }
          100% {
            opacity: 0;
            transform: translateX(-50%) translateY(-50px);
          }
        }
      `}</style>
    </div>
  );
}
