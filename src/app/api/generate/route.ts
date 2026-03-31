import { NextResponse } from 'next/server'
import { generateThumbnail } from '@/lib/ai'

export const maxDuration = 60

export async function POST(request: Request) {
  try {
    const { prompt, style } = await request.json()

    if (!prompt || !style) {
      return NextResponse.json(
        { error: 'Prompt-ul și stilul sunt necesare' },
        { status: 400 }
      )
    }

    if (prompt.length > 300) {
      return NextResponse.json(
        { error: 'Prompt-ul trebuie să fie sub 300 caractere' },
        { status: 400 }
      )
    }

    const imageUrl = await generateThumbnail(prompt, style)

    return NextResponse.json({ 
      imageUrl,
      message: 'Thumbnail generat cu succes!'
    })
  } catch (error) {
    console.error('Generate error:', error)
    return NextResponse.json(
      { error: 'Nu am putut genera thumbnail-ul. Încearcă din nou.' },
      { status: 500 }
    )
  }
}
