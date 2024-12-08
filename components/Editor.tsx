"use client"
import { useRoom, useSelf } from '@liveblocks/react'
import React, { useEffect, useState } from 'react'
import * as Y from "yjs";
import { LiveblocksYjsProvider } from "@liveblocks/yjs"
import { Button } from './ui/button';
import { MoonIcon, SunIcon } from 'lucide-react';
import { BlockNoteView } from "@blocknote/shadcn"
import { BlockNoteEditor } from "@blocknote/core"
import { useCreateBlockNote } from "@blocknote/react"
import "@blocknote/core/fonts/inter.css"
import "@blocknote/shadcn/style.css"
import stringToColor from '@/lib/stringToColor';
import TranslateDocument from './TranslateDocument';
import ChatToDocument from './ChatToDocument';
type EditProps = {
  doc: Y.Doc;
  provider: LiveblocksYjsProvider; 
  darkMode: boolean
}

function BlockNote({ doc, provider, darkMode }: EditProps) {
  const userInfo = useSelf((me) => me.info);
  const editor: BlockNoteEditor = useCreateBlockNote({
    collaboration: {
      provider,
      fragment: doc.getXmlFragment("document-store"),
      user:{
        name:userInfo?.name||"Annonymus",
        color:stringToColor(userInfo?.email||"unknown@example.com")
      }
    }
  })
  return (
    <div className='relative max-w-6xl mx-auto'>
      <BlockNoteView editor={editor} theme={darkMode ? "dark" : "light"} className='min-h-screen' />
    </div>
  )
}



function Editor() {
  const room = useRoom();
  const [doc, setDoc] = useState<Y.Doc>()
  const [provider, setProvider] = useState<LiveblocksYjsProvider>();
  const [darkMode, setDarkMode] = useState(false);
  useEffect(() => {
    const yDoc = new Y.Doc()
    const yProvider = new LiveblocksYjsProvider(room, yDoc)
    setDoc(yDoc)
    setProvider(yProvider);
    return () => {
      yDoc?.destroy();
      yProvider?.destroy();
    }
  }, [room]);
  if (!doc || !provider) {
    return null
  }
  const style = `hover: text-white ${darkMode
    ? "text-gray-300 bg-gray-700 hover:bg-gray-100 hover:text-gray-700"
    : "text-gray-700 bg-white hover:bg-gray-200 hover:text-gray-900"
    }`;

  return (
    <div className='max-w-6xl mx-auto'>
      <div className='flex items-center gap-2 justify-end mb-10'>
      <TranslateDocument doc={doc}/>
      <ChatToDocument doc={doc}/>
        <Button className={style} onClick={() => setDarkMode(!darkMode)}>
          {darkMode ? <SunIcon /> : <MoonIcon />}
        </Button>
      </div>



      <BlockNote doc={doc} provider={provider} darkMode={darkMode} />
    </div>
  )
}

export default Editor
