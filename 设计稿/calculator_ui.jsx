export default function LandscapeCalculatorUI() {
  const buttons = [
    ["C", "+/-", "%", "÷"],
    ["7", "8", "9", "×"],
    ["4", "5", "6", "−"],
    ["1", "2", "3", "+"],
    ["0", ".", "="],
  ];

  const getButtonClass = (btn) => {
    if (btn === "=") {
      return "bg-gradient-to-b from-white to-neutral-200 text-black shadow-[0_10px_30px_rgba(255,255,255,0.18)]";
    }
    if (["÷", "×", "−", "+"].includes(btn)) {
      return "bg-gradient-to-b from-amber-400 to-orange-500 text-white shadow-[0_12px_24px_rgba(249,115,22,0.28)]";
    }
    if (["C", "+/-", "%"].includes(btn)) {
      return "bg-white/10 text-white border border-white/10 backdrop-blur-sm";
    }
    return "bg-gradient-to-b from-neutral-800 to-neutral-900 text-white border border-white/5 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]";
  };

  return (
    <div className="min-h-screen w-full bg-[radial-gradient(circle_at_top_left,_rgba(120,119,198,0.12),_transparent_28%),radial-gradient(circle_at_bottom_right,_rgba(251,146,60,0.10),_transparent_26%),linear-gradient(135deg,_#09090b,_#111827)] flex items-center justify-center p-4">
      <div className="w-full max-w-5xl aspect-[16/9] rounded-[36px] bg-[linear-gradient(145deg,rgba(24,24,27,0.96),rgba(10,10,12,0.98))] shadow-[0_25px_80px_rgba(0,0,0,0.55)] border border-white/10 overflow-hidden flex backdrop-blur-xl">
        {/* Left display panel */}
        <div className="w-[42%] bg-[linear-gradient(180deg,rgba(255,255,255,0.03),rgba(255,255,255,0.01))] p-7 flex flex-col justify-end border-r border-white/10 relative">

          <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-white/[0.03] to-transparent pointer-events-none" />

          <div className="text-right relative z-10">
            <div className="text-white/25 text-xl md:text-2xl font-light tracking-wide">12 × 8 + 24</div>
            <div className="text-white text-7xl md:text-8xl font-semibold tracking-[-0.04em] mt-4 leading-none">120</div>
          </div>
        </div>

        {/* Right keypad panel */}
        <div className="flex-1 p-6 bg-transparent flex flex-col gap-3 justify-center">
          {buttons.map((row, rowIndex) => (
            <div key={rowIndex} className="grid gap-3" style={{ gridTemplateColumns: rowIndex === 4 ? '2fr 1fr 1fr' : 'repeat(4, 1fr)' }}>
              {row.map((btn) => {
                const isOperator = ["÷", "×", "−", "+", "="].includes(btn);
                const isTopKey = ["C", "+/-", "%"].includes(btn);
                return (
                  <button
                    key={btn}
                    className={`h-16 rounded-[22px] text-2xl font-medium transition duration-150 active:scale-[0.97] ${getButtonClass(btn)}`}
                  >
                    <span className="drop-shadow-sm">{btn}</span>
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
