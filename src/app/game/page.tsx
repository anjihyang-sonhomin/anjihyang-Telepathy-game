"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase, Team } from "@/lib/supabase";

const GOLD = "#FBBF24";
const DARK = "#0f172a";

export default function GamePage() {
  const router = useRouter();
  const [team, setTeam] = useState<Team | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [scoreEffect, setScoreEffect] = useState<number | null>(null);

  useEffect(() => {
    const teamId = localStorage.getItem("teamId");
    const teamName = localStorage.getItem("teamName");

    if (!teamId || !teamName) {
      router.push("/");
      return;
    }

    const loadTeam = async () => {
      const { data, error } = await supabase
        .from("teams")
        .select("*")
        .eq("id", teamId)
        .single();

      if (error || !data) {
        localStorage.removeItem("teamId");
        localStorage.removeItem("teamName");
        router.push("/");
        return;
      }

      setTeam(data);
      setIsLoading(false);
    };

    loadTeam();

    const channel = supabase
      .channel(`team-${teamId}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "teams",
          filter: `id=eq.${teamId}`,
        },
        (payload) => {
          const newTeam = payload.new as Team;
          // realtime은 점수 동기화만, 이펙트는 버튼에서만
          setTeam(newTeam);
        }
      )
      .on(
        "postgres_changes",
        {
          event: "DELETE",
          schema: "public",
          table: "teams",
          filter: `id=eq.${teamId}`,
        },
        () => {
          localStorage.removeItem("teamId");
          localStorage.removeItem("teamName");
          router.push("/");
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [router]);

  const addScore = async (amount: number) => {
    if (!team || isUpdating) return;

    setIsUpdating(true);
    const newScore = team.score + amount;

    // 이펙트는 버튼 클릭에서만!
    if (amount !== 0) {
      setScoreEffect(amount);
      setTimeout(() => setScoreEffect(null), 1500);
    }

    try {
      const res = await fetch(`/api/teams/${team.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ score: newScore }),
      });

      if (res.ok) {
        setTeam({ ...team, score: newScore });
      }
    } catch (err) {
      console.error("점수 업데이트 실패:", err);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleExit = () => {
    localStorage.removeItem("teamId");
    localStorage.removeItem("teamName");
    router.push("/");
  };

  if (isLoading || !team) {
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

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center p-4"
      style={{ backgroundColor: DARK }}
    >
      {/* 헤더 */}
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold mb-1" style={{ color: GOLD }}>
          공통점을 찾아라!
        </h1>
        <p className="text-lg text-gray-400">우리는 통한다</p>
      </div>

      {/* 팀 정보 카드 */}
      <div
        className="rounded-2xl shadow-xl p-6 w-full max-w-md"
        style={{ backgroundColor: "rgba(251, 191, 36, 0.1)", border: `2px solid ${GOLD}` }}
      >
        {/* 팀명 */}
        <div
          className="text-center py-3 rounded-xl mb-4"
          style={{ backgroundColor: GOLD }}
        >
          <p className="text-sm mb-1" style={{ color: DARK }}>우리 팀</p>
          <h2 className="text-3xl font-bold" style={{ color: DARK }}>{team.team_name}</h2>
        </div>

        {/* 점수 표시 */}
        <div className="text-center mb-6 relative">
          <p className="text-gray-500 text-sm mb-1">현재 점수</p>
          <div className="relative inline-block">
            <p className="text-7xl font-bold" style={{ color: GOLD }}>
              {team.score}
            </p>
            {scoreEffect !== null && (
              <div
                className="absolute -right-14 top-1/2 -translate-y-1/2 text-3xl font-bold"
                style={{
                  color: GOLD,
                  animation: "floatUp 1.5s ease-out forwards",
                }}
              >
                +{scoreEffect}
              </div>
            )}
          </div>
          <p className="text-gray-500 text-sm">점</p>
        </div>

        {/* 일어난 팀 수 선택 */}
        <div className="mb-4">
          <p className="text-center text-gray-400 mb-3 font-medium">
            일어난 팀 수를 선택하세요
          </p>
          <div className="grid grid-cols-4 gap-2">
            {Array.from({ length: 16 }, (_, i) => i).map((n) => (
              <button
                key={n}
                onClick={() => addScore(n)}
                disabled={isUpdating}
                className={`py-3 text-lg font-bold rounded-xl transition-all hover:opacity-90 disabled:opacity-50 ${
                  n === 0
                    ? "bg-gray-700 text-gray-400"
                    : ""
                }`}
                style={n !== 0 ? { backgroundColor: GOLD, color: DARK } : {}}
              >
                {n}
              </button>
            ))}
          </div>
        </div>

        {/* 점수 조정 버튼 */}
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => addScore(-1)}
            disabled={isUpdating || team.score < 1}
            className="flex-1 py-3 text-lg font-bold text-white rounded-xl transition-all hover:opacity-90 disabled:opacity-50 bg-gray-600"
          >
            -1 점
          </button>
          <button
            onClick={() => addScore(-5)}
            disabled={isUpdating || team.score < 5}
            className="flex-1 py-3 text-lg font-bold text-white rounded-xl transition-all hover:opacity-90 disabled:opacity-50 bg-gray-600"
          >
            -5 점
          </button>
        </div>

        {/* 나가기 버튼 */}
        <button
          onClick={handleExit}
          className="w-full py-2 text-gray-500 border-2 border-gray-600 rounded-xl hover:bg-gray-800 transition-colors text-sm"
        >
          팀 나가기
        </button>
      </div>

      <style jsx>{`
        @keyframes floatUp {
          0% {
            opacity: 1;
            transform: translateY(-50%) translateX(0);
          }
          100% {
            opacity: 0;
            transform: translateY(-50%) translateX(0) translateY(-30px);
          }
        }
      `}</style>
    </div>
  );
}
