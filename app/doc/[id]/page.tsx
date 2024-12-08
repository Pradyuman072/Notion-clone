
import Document from "@/components/Document";

export default async function DocumentPage({ params}: {
    params: any
}) {
    const {id}=await params
    return (
        <div className="flex flex-col flex-1 min-h-screen">
           <Document id={id}/>
        </div>
    )
}