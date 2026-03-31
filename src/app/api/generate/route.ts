import { NextResponse } from 'next/server'
import { generateThumbnail } from '@/lib/ai'

export async function POST(request: Request) {
  try {
    const { prompt, style } = await request.json()

    if (!prompt || !style) {
      return NextResponse.json(
        { error: 'Prompt and style are required' },
        { status: 400 }
      )
    }

    if (prompt.length > 500) {
      return NextResponse.json(
        { error: 'Prompt must be under 500 characters' },
        { status: 400 }
      )
    }

    const imageUrl = await generateThumbnail(prompt, style)

    return NextResponse.json({ imageUrl })
  } catch (error) {
    console.error('Generate error:', error)
    return NextResponse.json(
      { error: 'Failed to generate thumbnail' },
      { status: 500 }
    )
  }
}
