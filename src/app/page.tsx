"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const GOLD = "#FBBF24";
const DARK = "#0f172a";

const validateTeamName = (name: string): string | null => {
  const trimmed = name.trim().toLowerCase();

  if (!trimmed) return "팀명을 입력해주세요";
  if (trimmed.length < 2) return "2자 이상 입력해주세요";
  if (trimmed.length > 10) return "10자 이하로 입력해주세요";
  if (/\s/.test(trimmed)) return "띄어쓰기는 사용할 수 없습니다";
  if (!/^[가-힣a-z0-9]+$/.test(trimmed))
    return "한글, 영문 소문자, 숫자만 사용 가능합니다";

  return null;
};

export default function Home() {
  const router = useRouter();
  const [teamName, setTeamName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const savedTeamId = localStorage.getItem("teamId");
    if (savedTeamId) {
      router.push("/game");
    } else {
      setIsChecking(false);
    }
  }, [router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toLowerCase();
    setTeamName(value);
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validationError = validateTeamName(teamName);
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const normalizedName = teamName.trim().toLowerCase();

      const checkRes = await fetch(
        `/api/teams?name=${encodeURIComponent(normalizedName)}`
      );
      const checkData = await checkRes.json();

      let teamId: string;
      let finalTeamName: string;

      if (checkData.team) {
        teamId = checkData.team.id;
        finalTeamName = checkData.team.team_name;
      } else {
        const createRes = await fetch("/api/teams", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ team_name: normalizedName }),
        });

        if (!createRes.ok) {
          const errData = await createRes.json();
          throw new Error(errData.error || "팀 생성 실패");
        }

        const createData = await createRes.json();
        teamId = createData.team.id;
        finalTeamName = createData.team.team_name;
      }

      localStorage.setItem("teamId", teamId);
      localStorage.setItem("teamName", finalTeamName);

      router.push("/game");
    } catch (err) {
      setError(err instanceof Error ? err.message : "오류가 발생했습니다");
    } finally {
      setIsLoading(false);
    }
  };

  if (isChecking) {
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
      className="min-h-screen flex flex-col items-center justify-center p-6"
      style={{ backgroundColor: DARK }}
    >
      {/* 헤더 */}
      <div className="text-center mb-12">
        <h1 className="text-5xl font-bold mb-4" style={{ color: GOLD }}>
          공통점을 찾아라!
        </h1>
        <p className="text-2xl text-gray-400">우리는 통한다</p>
      </div>

      {/* 팀명 입력 카드 */}
      <div
        className="rounded-2xl shadow-xl p-10 w-full max-w-md"
        style={{ backgroundColor: "rgba(251, 191, 36, 0.1)", border: `2px solid ${GOLD}` }}
      >
        <h2 className="text-3xl font-bold mb-6 text-center" style={{ color: GOLD }}>
          팀명 입력
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <input
              type="text"
              value={teamName}
              onChange={handleInputChange}
              placeholder="팀명을 입력하세요"
              className="w-full px-5 py-4 text-xl rounded-xl focus:outline-none transition-colors text-white placeholder-gray-500"
              style={{
                backgroundColor: "rgba(255, 255, 255, 0.1)",
                border: error ? "2px solid #ef4444" : `2px solid ${GOLD}`,
              }}
              disabled={isLoading}
              maxLength={10}
            />
            {error && (
              <p className="mt-2 text-red-400 text-sm">{error}</p>
            )}
            <p className="mt-2 text-gray-500 text-sm">
              한글, 영문 소문자, 숫자 (2~10자)
            </p>
          </div>

          <button
            type="submit"
            disabled={isLoading || !teamName.trim()}
            className="w-full py-4 text-xl font-bold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90"
            style={{ backgroundColor: GOLD, color: DARK }}
          >
            {isLoading ? "입장 중..." : "게임 입장"}
          </button>
        </form>
      </div>

      {/* 하단 안내 */}
      <p className="mt-8 text-gray-500 text-center">
        종이와 펜을 준비해주세요!
      </p>
    </div>
  );
}
