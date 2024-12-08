"use client"
import { useTransition } from 'react'
import { Button } from './ui/button'
import { useRouter } from 'next/navigation'
import { createNewDocument } from '@/actions/actions'

const NewDocumentButton = () => {
  const router=useRouter();
  const [isPending,startTransition] =useTransition();
  const handleOnClick=()=>{
  startTransition(async () => {
    const {docId}=await createNewDocument();
    router.push(`/doc/${docId}`)
  })
  }
  return (
    <Button disabled={isPending} onClick={()=>{handleOnClick()}}>
    {isPending?"Creating":"New Document"}
    </Button>
  )
}

export default NewDocumentButton
