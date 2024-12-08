"use client"
import {
    Dialog,

    DialogContent,
    DialogDescription,

    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { FormEvent, useState, useTransition } from "react"
import { Button } from "./ui/button"
import { usePathname } from "next/navigation"
import { inviteUser } from "@/actions/actions"
import { toast } from "sonner"
import { Input } from "./ui/input"

function InviteUser() {
    const [isOpen, setIsOpen] = useState(false)
    const [email, setEmail] = useState("")
    const [isPending, startTransition] = useTransition();
    const pathname = usePathname();
    


    const handleSubmit = async (e:FormEvent) => {
        e.preventDefault()
        const roomId = pathname.split("/").pop();

        if (!roomId) return { success: false }

        startTransition(async () => {
            const { success } = await inviteUser(roomId,email)

            if (success) {
                setIsOpen(false);
                setEmail("")
                toast.success("User added to Room  Successfull")
            }
            else {
                toast.error("Failed to add user to  the room")
            }

        })
    }
    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <Button asChild variant="outline">
                <DialogTrigger >
                    Invite
                </DialogTrigger></Button>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Invite a User to collaborate!</DialogTitle>
                    <DialogDescription>
                      Enter the email of the user you want to invite
                    </DialogDescription>
                </DialogHeader>
               <form className="flex gap-2 " onSubmit={handleSubmit}>
                <Input
                type="email"
                placeholder="email"
                className="w-full"
                value={email}
                onChange={(e)=>setEmail(e.target.value)}
                />
                <Button type="submit" disabled={!email||isPending}> {isPending?"Inviting":"Invite"}</Button>
               </form>
            </DialogContent>
        </Dialog>

    )
}

export default InviteUser
