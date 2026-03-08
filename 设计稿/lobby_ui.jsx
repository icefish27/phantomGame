import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const games = [
  {
    title: "斗地主",
    subtitle: "经典对局，快速开玩",
    image:
      "https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=1200&auto=format&fit=crop",
    accent: "from-orange-300/35 via-amber-300/10 to-transparent",
  },
  {
    title: "麻将",
    subtitle: "轻松牌局，随时来一圈",
    image:
      "https://images.unsplash.com/photo-1520116468816-95b69f847357?q=80&w=1200&auto=format&fit=crop",
    accent: "from-emerald-300/35 via-teal-300/10 to-transparent",
  },
  {
    title: "象棋",
    subtitle: "残局推演，策略博弈",
    image:
      "https://images.unsplash.com/photo-1580541832626-2a7131ee809f?q=80&w=1200&auto=format&fit=crop",
    accent: "from-sky-300/35 via-blue-300/10 to-transparent",
  },
  {
    title: "更多游戏",
    subtitle: "后续持续扩展追加",
    image:
      "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=1200&auto=format&fit=crop",
    accent: "from-fuchsia-300/35 via-violet-300/10 to-transparent",
  },
];

function GameRow({ game, active = false, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`relative h-[94px] w-[204px] overflow-hidden rounded-[18px] border text-left transition-all duration-300 ${
        active
          ? "border-white/34 shadow-[0_18px_44px_rgba(0,0,0,0.36)] scale-[1.035]"
          : "border-white/10 opacity-65"
      }`}
    >
      <img src={game.image} alt={game.title} className="absolute inset-0 h-full w-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/84 via-black/56 to-black/18" />
      <div className={`absolute inset-0 bg-gradient-to-r ${game.accent} ${active ? "opacity-100" : "opacity-20"}`} />
      {active && <div className="absolute -inset-3 rounded-[24px] bg-white/10 blur-2xl" />}

      <div className="relative z-10 flex h-full flex-col justify-end p-3.5">
        <div className={`font-medium tracking-wide ${active ? "text-white text-lg" : "text-white/80 text-base"}`}>{game.title}</div>
        <div className={`mt-1 text-[11px] ${active ? "text-white/68" : "text-white/40"}`}>{game.subtitle}</div>
      </div>

      {active && <div className="absolute inset-0 rounded-[18px] ring-1 ring-white/24" />}
    </button>
  );
}

export default function SteamDeckStyleLobby() {
  const [activeIndex, setActiveIndex] = useState(1);

  const activeGame = games[activeIndex];
  const visibleList = useMemo(() => games, []);

  const goPrev = () => setActiveIndex((prev) => (prev - 1 + games.length) % games.length);
  const goNext = () => setActiveIndex((prev) => (prev + 1) % games.length);

  return (
    <div className="min-h-screen w-full bg-[linear-gradient(180deg,#070b12,#0c1320_52%,#0a1020)] flex items-center justify-center p-3">
      <div className="relative w-full max-w-[920px] aspect-[16/9] overflow-hidden rounded-[34px] border border-white/10 bg-[linear-gradient(180deg,rgba(10,15,26,0.98),rgba(7,9,16,0.98))] shadow-[0_28px_90px_rgba(0,0,0,0.58)]">
        <div className="absolute inset-0 opacity-90 bg-[radial-gradient(circle_at_15%_20%,rgba(255,255,255,0.08),transparent_22%),radial-gradient(circle_at_82%_35%,rgba(255,255,255,0.05),transparent_18%)]" />
        <div className="absolute inset-x-[-10%] top-[56%] h-[240px] rounded-[100%] border-t border-white/10 opacity-80" />
        <div className="absolute inset-x-[-14%] top-[62%] h-[220px] rounded-[100%] border-t border-white/8 opacity-60" />
        <div className="absolute inset-x-[-18%] top-[68%] h-[200px] rounded-[100%] border-t border-white/6 opacity-40" />
        <div className={`absolute inset-0 bg-gradient-to-br ${activeGame.accent} opacity-70`} />

        <div className="relative z-10 flex h-full flex-col px-6 py-5">
          <header className="flex items-center">
            <div className="text-2xl font-medium text-white">游戏大厅</div>
          </header>

          <section className="mt-5 flex flex-1 gap-4">
            <div className="w-[30%] shrink-0 pt-2 pl-16">
              <div className="ml-1 mb-5 text-white/28 text-[11px] tracking-[0.34em] uppercase">Game List</div>
              <div className="mt-0 flex flex-col gap-2.5">
                {visibleList.map((game, index) => (
                  <GameRow
                    key={game.title}
                    game={game}
                    active={index === activeIndex}
                    onClick={() => setActiveIndex(index)}
                  />
                ))}
              </div>
            </div>

            <div className="w-[70%] min-w-0 pt-1 pr-3 relative">
              <div className="max-w-[460px] pl-10 pt-10">
                <div className="mb-5 text-white/32 text-[11px] tracking-[0.32em] uppercase">Now Selected</div>
                <div className="mt-0 text-[58px] font-medium tracking-[-0.03em] text-white leading-none">{activeGame.title}</div>
                <div className="mt-6 max-w-[420px] text-[16px] leading-8 text-white/52">{activeGame.subtitle}</div>
                <div className="mt-9 h-px w-[340px] bg-white/10" />
              </div>

              <div className="absolute left-10 bottom-8 flex items-center gap-2 px-1">
                {games.map((_, index) => (
                  <div
                    key={index}
                    className={`h-1.5 rounded-full transition-all ${index === activeIndex ? "w-8 bg-white" : "w-3 bg-white/20"}`}
                  />
                ))}
              </div>

              <div className="absolute right-4 bottom-6 flex items-center gap-2">
                <button
                  onClick={goPrev}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white/75 transition hover:bg-white/14"
                >
                  <ChevronLeft size={18} />
                </button>
                <button
                  onClick={goNext}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white/75 transition hover:bg-white/14"
                >
                  <ChevronRight size={18} />
                </button>
                <button className="rounded-full bg-white px-6 py-3 text-sm font-medium text-black shadow-[0_10px_30px_rgba(255,255,255,0.18)]">
                  进入
                </button>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
