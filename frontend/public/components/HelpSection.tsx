import React from "react";
import FAQ from "../../src/features/marketplace/ui/components/FAQ";
import ChatBox from "../../src/features/marketplace/ui/components/ChatBox";

export default function HelpSection() {
  return (
    <div className="max-w-2xl mx-auto p-6">
      <FAQ />
      <ChatBox />
    </div>
  );
}

