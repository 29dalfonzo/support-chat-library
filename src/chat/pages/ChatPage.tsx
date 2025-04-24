import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Copy, Download, ThumbsUp, ThumbsDown, Send } from "lucide-react"
import { useParams } from "react-router"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { checkAuth, getClientMessages, sendMessage } from "../fake/fake-data"

export default function ChatPage() {
  const { clientId } = useParams()
  console.log(clientId)
  const [input, setInput] = useState("")
  const queryClient = useQueryClient()


  const {data:user} = useQuery({
    queryKey: ['user'],
    queryFn: () => {
      const token = localStorage.getItem('token')
      if (!token) return null
      return checkAuth(token)
    },
    enabled: !!clientId,
    staleTime: 1000 * 60 * 5, // 5 minute
  })

  const {data: messages=[], isLoading} = useQuery({
    queryKey: ['messages', clientId],
    queryFn: () => getClientMessages(clientId ?? ''),
    enabled: !!clientId,
    staleTime: 1000 * 60 * 5, // 5 minute
  })

  const {mutate: sendMessageMutation} = useMutation({
    mutationFn:sendMessage,
    onSuccess: (data) => {
      console.log(data)
      queryClient.invalidateQueries({ queryKey: ['messages', clientId] })
      setInput('')
    },
    onError: (error) => {
      console.log(error)
    }
  })

  const handleSendMessage = (e:React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!input.trim()) return
    sendMessageMutation({
      clientId: clientId ?? '',
      content: input,
      createdAt: new Date(),
      sender: 'agent',
    })
    setInput('')
  }

  if (isLoading) return (
    <div className="flex justify-center items-center h-full">
      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
    </div>
  )

  return (
    <div className="flex-1 flex flex-col h-[calc(100vh-120px)]">
      <ScrollArea className="flex-1">
        <div className="space-y-4 p-4">
          {messages.map((message, index) => (
            <div key={index} className="w-full">
              {message.sender === "agent" ? (
                // Agent message - left aligned
                <div className="flex gap-2 max-w-[80%]">
                  <div className="h-8 w-8 rounded-full bg-primary flex-shrink-0" />
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">{user?.name}</span>
                      <span className="text-sm text-muted-foreground">{message.createdAt.toLocaleTimeString()}</span>
                    </div>
                    <div className="p-3 bg-muted/50 rounded-lg">
                      <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <ThumbsUp className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <ThumbsDown className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ) : (
                // User message - right aligned
                <div className="flex flex-col items-end">
                  <div className="text-right mb-1">
                    <span className="text-sm font-medium mr-2">G5</span>
                    <span className="text-sm text-muted-foreground">{message.createdAt.toLocaleTimeString()}</span>
                  </div>
                  <div className="bg-black text-white p-3 rounded-lg max-w-[80%]">
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </ScrollArea>
      {
        messages.length === 0 && (
          <div className="flex justify-center items-center h-full">
            <p className="text-sm text-muted-foreground flex items-center gap-2">
              <span>No messages yet</span>
              <span className="h-4 w-4">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M21 12c0 4.418-4.03 8-9 8s-9-3.582-9-8 4.03-8 9-8 9 3.582 9 8z" />
                </svg>
              </span>
            </p>
          </div>
        )
      }
      <div className="p-4 border-t bg-background">
        <div className="flex items-center gap-2 w-full px-4">
          <form onSubmit={handleSendMessage} className="flex items-center gap-2 w-full">
            <Textarea
              placeholder="Type a message as a customer"
              rows={3}
              value={input}
              style={{ minWidth: '200px' }}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage(e as unknown as React.FormEvent<HTMLFormElement>);
                }
              }}
              className="min-h-[50px] h-[50px] resize-none py-3 px-4 rounded-xl focus:ring-2 focus:ring-primary w-full"
            />
            <Button type="submit" size="lg" className="h-[50px] px-6 rounded-xl bg-primary hover:bg-primary/90 flex-shrink-0">
              <Send className="h-5 w-5" />
              <span className="ml-2 hidden md:inline">Send</span>
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}


