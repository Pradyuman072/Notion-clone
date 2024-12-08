"use client"
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {  useState, useTransition } from "react"
import { Button } from "./ui/button"
import { usePathname } from "next/navigation"
import { useRouter } from "next/navigation"
import { deleteDocument } from "@/actions/actions"
import { toast } from "sonner"
function DeleteDocument() {
    const [isOpen, setIsOpen] = useState(false)
    const [isPending, startTransition] = useTransition();
    const pathname=usePathname();
    const router=useRouter();


    const handleDelete=async()=>{
    const roomId=pathname.split("/").pop();

    console.log(roomId)
    if(!roomId) return {success:false}
     
startTransition(async()=>{
    const {success}=await deleteDocument(roomId)
 
     if(success){
         setIsOpen(false);
         router.replace("/")
         toast.success("Room Deleted Successfull")
     }
     else{
      toast.error("Failed to delete the room")
     }
   
})
    }
    return (
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
               <Button asChild variant="destructive"> 
                <DialogTrigger >
                     Delete
                </DialogTrigger></Button>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Are you absolutely sure?</DialogTitle>
                        <DialogDescription>
                            This will delete the document and all its content,removing all users from the document
                          
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="sm:justify-end gap-2">
                        <DialogClose asChild>
                           <Button  variant="secondary"> 
                                Close
                            </Button>
                        </DialogClose>
                       
                            <Button variant="destructive" type="button" onClick={handleDelete}  disabled={isPending} >{!isPending?"Delete":"Deleting"}</Button>
                        
                    </DialogFooter>
                </DialogContent>
            </Dialog>

    )
}

export default DeleteDocument
