import { ScrollArea } from '@/components/ui/scroll-area'
import { useQuery } from '@tanstack/react-query'
import { NavLink } from 'react-router'

import { getClients } from '../fake/fake-data'
import { ContactListSkeleton } from './ContactListSkeleton'
import { Client } from '../interfaces/chat.interfaces'

export const ContactList = () => {

  const { data: clients, isLoading } = useQuery({
    queryKey: ['clients'],
    queryFn: () => getClients(),
    staleTime: 1000 * 60 * 5, // 5 minute
  })

  return (
    <ScrollArea className="h-full">
      <div className="space-y-4 p-4">
        <div className="space-y-1">
          <h3 className="px-2 text-sm font-semibold">Contacts</h3>
          <div className="space-y-1">
            {clients?.length === 0 && (
              <div className="w-full flex items-center justify-center">
                <p className="text-sm text-gray-500">No contacts found</p>
              </div>
            )}

            {isLoading && (
              <div className="w-full flex items-center justify-center">
                <ContactListSkeleton />
              </div>
            )}

            {clients?.map((client: Client) => (
              <NavLink key={client.id} to={`/chat/${client.id}`} 
              className={({ isActive }) => `w-full flex items-center justify-start mt-3  transition-all duration-300
              ${isActive ? 'bg-primary/20 border-l-4 border-primary rounded-md p-1' : ''}`}>
                {({ isActive }) => (
                  <>
                    <div 
                    className={`h-6 w-6 rounded-full bg-gray-300 mr-2 flex-shrink-0 flex items-center justify-center text-xs
                    ${isActive ? 'text-gray-800' : 'text-white'}`}>
                      {client.name.charAt(0)}
                      {client.name.charAt(1)}
                    </div>
                    <span 
                    className={`
                      transition-all duration-300
                      ${isActive ? 'font-bold text-gray-800' : ''} text-sm`}
                    >{client.name}</span>
                  </>
                )}
              </NavLink>
            ))}
          </div>
        </div>
      </div>
    </ScrollArea>
  )
}
