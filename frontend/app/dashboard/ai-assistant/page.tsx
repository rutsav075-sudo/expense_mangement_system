import { ChatArea } from "@/components/ai/chat-area"

export default function AIAssistantPage() {
  return (
    <div className="flex-1 rounded-2xl overflow-hidden border border-border shadow-lg min-h-[700px] flex flex-col relative">
      <ChatArea />
    </div>
  )
}
