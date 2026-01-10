import { Suspense } from "react";
import ChatClient from "./ChatClient";

export const dynamic = "force-dynamic";

export default function ChatPage() {
  return (
    <Suspense fallback={<ChatLoading />}>
      <ChatClient />
    </Suspense>
  );
}

function ChatLoading() {
  return (
    <div className="h-[80vh] flex items-center justify-center text-gray-500">
      Loading chat…
    </div>
  );
}