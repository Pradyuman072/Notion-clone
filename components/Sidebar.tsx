"use client"
import { Menu } from "lucide-react"
import NewDocumentButton from "./NewDocumentButton"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { useCollection } from "react-firebase-hooks/firestore"
import { useUser } from "@clerk/nextjs"
import { query, collectionGroup, where, DocumentData } from "firebase/firestore";
import { db } from "@/firebase"
import { useEffect, useState } from "react"
import SIdebarOption from "./SIdebarOption"

interface RoomDocument extends DocumentData {
  createdAt: string;
  role: "owner" | "editor";
  roomId: string;
  userID: string
}



const Sidebar = () => {
  const [groupedData, setGroupedData] = useState<{
    owner: RoomDocument[];
    editor: RoomDocument[];
  }>({
    owner: [],
    editor: []
  });
  const { user } = useUser()
  const [data] = useCollection(
    user &&
    query(collectionGroup(db, 'rooms'), where('userId', "==", user.emailAddresses[0].toString()))

  )

  useEffect(() => {
    if (!data) return;
    const grouped = data.docs.reduce<{
      owner: RoomDocument[];
      editor: RoomDocument[];
    }>(
      (acc, curr) => {
        const roomData = curr.data() as RoomDocument;
        if (roomData.role === "owner") {
          acc.owner.push({
            id: curr.id,
            ...roomData
          });
        } else {
          acc.editor.push({
            id: curr.id,
            ...roomData
          });
        }
        return acc;
      }, {
      owner: [],
      editor: []
    }
    )
    setGroupedData(grouped)
  }, [data])
  const menuOptions = (
    <>
      <NewDocumentButton />
      <div className="flex py-4 flex-col space-y-4 md:max-w-36">
         {groupedData.owner.length === 0 ? (
        <h2 className="text-gray-500 font-semibold text-sm"> No Documents Found</h2>
      ) : (
        <>
          <h2 className="text-gray-500 font-semibold text-sm">My Documents</h2>
          {groupedData.owner.map((doc) => (
            <SIdebarOption key={doc.id} id={doc.id} href={`/doc/${doc.id}`}/>
          ))}
        </>
      )}
      {groupedData.editor.length>0&&(
          <>
          <h2 className="text-gray-500 font-semibold text-sm">Shared with Me </h2>
          {groupedData.editor.map((doc) => (
            <SIdebarOption key={doc.id} id={doc.id} href={`/doc/${doc.id}`}/>
          ))}

        </>

      )}
           </div>
    </>
  )
  return (
    <div className="p-2 md:p-5 bg-gray-200 relative">
      <div className="md:hidden">
        <Sheet>
          <SheetTrigger>
            <Menu />
          </SheetTrigger>
          <SheetContent side="left">
            <SheetHeader>
              <SheetTitle>Menu</SheetTitle>
              <div >
                {menuOptions}
              </div>
            </SheetHeader>
          </SheetContent>
        </Sheet>
      </div>

      <div className="hidden md:inline">
        {menuOptions}</div>
    </div>

  )
}

export default Sidebar
