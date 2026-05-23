export default function OfflinePage() {
  return (
    <main className="min-h-screen bg-slate-900 text-white flex items-center justify-center p-6">
      <div className="text-center">
        <h1 className="text-5xl font-bold mb-4">
          Offline
        </h1>

        <p className="text-xl text-gray-300">
          No internet connection detected.
        </p>

        <p className="mt-2 text-gray-400">
          Please reconnect and try again.
        </p>
      </div>
    </main>
  );
}