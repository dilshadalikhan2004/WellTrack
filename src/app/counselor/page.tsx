import { ChatInterface } from "@/components/counselor/chat-interface";
import { Bot } from "lucide-react";

export default function CounselorPage() {
    return (
        <div className="flex flex-col h-screen">
            <header className="sticky top-0 z-10 flex items-center h-16 px-4 border-b shrink-0 bg-background/80 backdrop-blur-sm md:px-6">
                <h1 className="flex items-center gap-2 text-xl font-semibold">
                    <Bot className="w-6 h-6" />
                    AI Personal Counselor
                </h1>
            </header>
            <div className="flex-1 overflow-hidden">
                <ChatInterface />
            </div>
        </div>
    );
}
