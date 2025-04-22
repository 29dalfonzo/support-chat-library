import { getClient } from "@/chat/fake/fake-data"
import { useQuery } from "@tanstack/react-query"
import { useParams } from "react-router"
import { NoContactSelected } from "./NoContactSelected"
import { ContactInfoSkeleton } from "./ContactInfoSkeleton"
import { ContactDetail } from "./ContactDetail"
export const ContactDetails = () => {
    const {clientId} = useParams()
    console.log(clientId)
    const {data: client, isLoading} = useQuery({
        queryKey: ['client', clientId],
        queryFn: () => getClient(clientId as string),
        enabled: !!clientId,
        staleTime: 1000 * 60 * 5, // 5 minute
    })


    if(!clientId) return <NoContactSelected />

    if(isLoading && !client) return <ContactInfoSkeleton />

    if(client) return <ContactDetail client={client} />





}
