
import RoomProvider from "@/components/RoomProvider";
import { auth } from "@clerk/nextjs/server";
async function DocLayout({children, params}:{
    children:React.ReactNode;
    params:any
}) {
  const {id}=await params
   const user=await auth.protect();
   if(!user){
    console.log("usre not found")
   }
  return (
    <RoomProvider roomId={id}>
      {children}
    </RoomProvider>
  )
}

export default DocLayout
