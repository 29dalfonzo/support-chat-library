import { Button } from "@/components/ui/button"
import { LogOut, X, UserCircle2 } from "lucide-react"
import { Link, Outlet, useNavigate } from "react-router"
import { ContactList } from "../components/ContactList"
import { ContactDetails } from "../components/contact-details/ContactDetails"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { useState } from "react"
import { checkAuth } from "../fake/fake-data"

export default function ChatLayout() {

  const navigate = useNavigate()

  const queryClient = useQueryClient()

  const [showDetails, setShowDetails] = useState(false)



  const {data:user} = useQuery({
    queryKey: ['user'],
    queryFn: () => {
      const token = localStorage.getItem('token')
      if (!token) return null
      console.log(user)
      return checkAuth(token)
    },
    staleTime: 1000 * 60 * 5, // 5 minute
  })

  const handleLogout = () => {
    queryClient.invalidateQueries({ queryKey: ['user'] })
    localStorage.removeItem('token')
    navigate('/login', { replace: true })
  }

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Sidebar */}
      <div className="w-64 border-r bg-muted/10 flex flex-col">
        <div className="p-4 border-b">
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 rounded-full bg-primary" />
            <Link to="/chat">
              <span className="font-semibold">NexTalk</span>
            </Link>
          </div>
        </div>
        <div className="flex-1 overflow-hidden">
          <ContactList />
        </div>
        <div className="p-4 border-t mt-auto">
          <Button variant="ghost" size="sm" className="w-full" onClick={() => handleLogout()}>
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </div>


      {/* Main Content */}
      <div className="flex-1 relative flex">
        <div className={`flex-1 flex flex-col transition-all duration-300 ${showDetails ? 'md:mr-80' : ''}`}>
          {/* Header */}
          <header className="h-14 border-b px-4 flex items-center justify-between">
            <div></div> {/* Empty div to maintain spacing */}
            <div className="flex items-center gap-2">
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-8 w-8 p-0 md:w-auto md:px-2"
                onClick={() => setShowDetails(!showDetails)}
              >
                <UserCircle2 className="h-4 w-4 md:mr-2" />
                <span className="hidden md:inline">Contact Details</span>
              </Button>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <X className="h-4 w-4" />
              </Button>
            </div>
          </header>
          <Outlet />
        </div>

        {/* Right Panel - Contact Details */}
        <div 
          className={`
            w-80 border-l bg-background
            fixed md:absolute top-0 bottom-0 right-0
            transition-transform duration-300
            ${showDetails ? 'translate-x-0' : 'translate-x-full'}
          `}
        >
          <div className="h-14 border-b px-4 flex items-center justify-between">
            <h2 className="font-medium">Contact details</h2>
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-8 w-8 p-0"
              onClick={() => setShowDetails(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <ContactDetails />
        </div>
      </div>
    </div>
  )
}
