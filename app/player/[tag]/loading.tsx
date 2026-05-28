export default function Loading() {
  return (
    <div className="min-h-screen bg-[#07070E] flex items-center justify-center p-4">
      <div className="w-full max-w-2xl animate-pulse space-y-4">
        <div className="h-32 rounded-2xl bg-white/5" />
        <div className="h-48 rounded-2xl bg-white/5" />
        <div className="grid grid-cols-3 gap-4">
          <div className="h-24 rounded-xl bg-white/5" />
          <div className="h-24 rounded-xl bg-white/5" />
          <div className="h-24 rounded-xl bg-white/5" />
        </div>
      </div>
    </div>
  );
}
