import React from "react";
import FAQ from "./components/FAQ";
import ChatBox from "./components/ChatBox";
import { Sidebar } from "./components/Sidebar";

export default function AyudaPage() {
  return (
    <div className="min-h-screen bg-gray-50 grid grid-cols-[260px_1fr]">
      <Sidebar active="ayuda" />
      <div className="min-w-0">
        <main className="p-6">
          <div className="max-w-2xl mx-auto">
            <FAQ />
            <ChatBox />
          </div>
        </main>
      </div>
    </div>
  );
}

