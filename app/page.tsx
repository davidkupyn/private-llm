import Chat from "./chat";

export default async function Home() {
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold tracking-tight">AI Chat</h1>
      <Chat />
    </div>
  );
}
