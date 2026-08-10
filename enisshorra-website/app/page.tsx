export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="text-center">
        <h1 className="text-5xl font-bold mb-4">Enis Shorra</h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
          Welcome to my personal website
        </p>
        <div className="space-y-4">
          <p className="text-lg">This is your personal website.</p>
          <p className="text-gray-500 dark:text-gray-400">
            You can start editing by modifying <code className="bg-gray-200 dark:bg-gray-800 px-2 py-1 rounded">app/page.tsx</code>
          </p>
        </div>
      </div>
    </main>
  );
}
