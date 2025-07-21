export const GRID_WIDTH = 5;
export const GRID_HEIGHT = 8;

// New color palette with more distinct, vibrant gradients
export const BLOCK_COLORS: { [key: number]: string } = {
  2: "bg-gradient-to-br from-slate-200 to-slate-50 shadow-lg shadow-slate-300/10",
  4: "bg-gradient-to-br from-sky-300 to-cyan-200 shadow-lg shadow-cyan-300/20",
  8: "bg-gradient-to-br from-emerald-400 to-lime-300 shadow-lg shadow-lime-400/30",
  16: "bg-gradient-to-br from-amber-400 to-yellow-300 shadow-lg shadow-amber-400/40",
  32: "bg-gradient-to-br from-orange-500 to-amber-400 shadow-lg shadow-orange-400/40",
  64: "bg-gradient-to-br from-red-500 to-orange-400 shadow-lg shadow-red-500/50",
  128: "bg-gradient-to-br from-rose-500 to-pink-400 shadow-lg shadow-rose-500/50",
  256: "bg-gradient-to-br from-fuchsia-600 to-rose-500 shadow-lg shadow-fuchsia-500/50",
  512: "bg-gradient-to-br from-purple-600 to-fuchsia-500 shadow-lg shadow-purple-500/60",
  1024: "bg-gradient-to-br from-indigo-500 to-purple-400 shadow-lg shadow-indigo-500/60",
  2048: "bg-gradient-to-br from-cyan-400 to-sky-300 shadow-lg shadow-cyan-400/70",
  4096: "bg-gradient-to-br from-yellow-300 via-lime-300 to-amber-300 shadow-lg shadow-yellow-300/70",
  8192: "bg-gradient-to-br from-red-500 via-pink-500 to-purple-600 shadow-lg shadow-red-500/80",
};

export const INITIAL_BLOCK_VALUES = [2, 4, 8];