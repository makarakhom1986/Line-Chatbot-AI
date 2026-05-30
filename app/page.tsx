export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">🤖 LINE Chatbot AI</h1>
        <p className="text-lg text-gray-600 mb-4">
          Powered by Gemini & @line/bot-sdk
        </p>
        <div className="mt-8 p-6 bg-gray-100 rounded-lg max-w-md">
          <h2 className="text-xl font-semibold mb-2">⚙️ Configuration</h2>
          <ul className="text-sm text-gray-700 space-y-2 text-left">
            <li>✓ Webhook: <code>/api/line-webhook</code></li>
            <li>✓ FAQ Cache: 60 seconds</li>
            <li>✓ Gemini Model: gemini-2.5-flash</li>
            <li>✓ Environment: Check .env.local</li>
          </ul>
        </div>
      </div>
    </main>
  );
}
