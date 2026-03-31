export async function generateThumbnail(prompt: string, style: string) {
  const stylePrompts: Record<string, string> = {
    bold: 'bold colors, dramatic lighting, eye-catching, youtube thumbnail style, professional',
    minimal: 'clean, minimal design, modern, sleek, professional thumbnail',
    gaming: 'gaming style, neon colors, epic, action packed, youtube gaming thumbnail',
    vlog: 'lifestyle, warm tones, friendly, personal vlog thumbnail style',
    tech: 'tech review, futuristic, sleek gadgets, tech youtube thumbnail',
    educational: 'educational, clear text, informative, clean design thumbnail',
  }

  const stylePrefix = stylePrompts[style] || stylePrompts.bold
  const fullPrompt = `${stylePrefix}, ${prompt}, 1280x720, high quality, professional youtube thumbnail`

  const encodedPrompt = encodeURIComponent(fullPrompt)
  const imageUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=1280&height=720&nologo=true`

  return imageUrl
}

export function getStyles() {
  return [
    { id: 'bold', name: 'Bold & Vibrant', description: 'Eye-catching colors and dramatic lighting' },
    { id: 'minimal', name: 'Clean & Minimal', description: 'Modern and sleek professional look' },
    { id: 'gaming', name: 'Gaming Epic', description: 'Neon colors and action-packed style' },
    { id: 'vlog', name: 'Lifestyle Vlog', description: 'Warm and friendly personal style' },
    { id: 'tech', name: 'Tech Review', description: 'Futuristic and sleek tech style' },
    { id: 'educational', name: 'Educational', description: 'Clear and informative design' },
  ]
}
