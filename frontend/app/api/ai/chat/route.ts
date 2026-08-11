import { NextRequest, NextResponse } from 'next/server'

interface ChatMessage {
  role: string
  content: string
}

interface ChatRequest {
  messages: ChatMessage[]
  model?: string
  image_data?: string
}

export async function POST(request: NextRequest) {
  try {
    const body: ChatRequest = await request.json()

    // Get API keys from headers (BYOK) or env
    const geminiKey = request.headers.get('x-gemini-key') || process.env.GEMINI_API_KEY || ''
    const openaiKey = request.headers.get('x-openai-key') || ''
    const anthropicKey = request.headers.get('x-anthropic-key') || ''

    const model = (body.model || 'gemini-1.5-flash').toLowerCase()

    if (model.includes('gpt')) {
      // OpenAI
      if (!openaiKey) {
        return NextResponse.json(
          { detail: 'OpenAI API Key not provided. Please set it in Settings.' },
          { status: 400 }
        )
      }

      const oaiMessages = body.messages.map(m => ({
        role: m.role === 'model' ? 'assistant' : 'user',
        content: m.content
      }))

      if (body.image_data && oaiMessages.length > 0) {
        const lastMsg = oaiMessages[oaiMessages.length - 1]
        lastMsg.content = [
          { type: 'text', text: body.messages[body.messages.length - 1].content },
          { type: 'image_url', image_url: { url: body.image_data } }
        ] as any
      }

      const resp = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${openaiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ model, messages: oaiMessages })
      })

      if (!resp.ok) {
        const errText = await resp.text()
        return NextResponse.json({ detail: `OpenAI Error: ${errText}` }, { status: resp.status })
      }

      const data = await resp.json()
      return NextResponse.json({ response: data.choices[0].message.content })

    } else if (model.includes('claude')) {
      // Anthropic
      if (!anthropicKey) {
        return NextResponse.json(
          { detail: 'Anthropic API Key not provided. Please set it in Settings.' },
          { status: 400 }
        )
      }

      const anthMessages = body.messages.map(m => ({
        role: m.role === 'model' ? 'assistant' : 'user',
        content: m.content
      }))

      const resp = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'x-api-key': anthropicKey,
          'anthropic-version': '2023-06-01',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ model, messages: anthMessages, max_tokens: 1024 })
      })

      if (!resp.ok) {
        const errText = await resp.text()
        return NextResponse.json({ detail: `Anthropic Error: ${errText}` }, { status: resp.status })
      }

      const data = await resp.json()
      return NextResponse.json({ response: data.content[0].text })

    } else {
      // Gemini (default)
      if (!geminiKey) {
        return NextResponse.json(
          { detail: 'Gemini API Key not provided.' },
          { status: 400 }
        )
      }

      const geminiContents = body.messages.map(m => ({
        role: m.role === 'user' ? 'user' : 'model',
        parts: [{ text: m.content }]
      }))

      if (body.image_data && geminiContents.length > 0) {
        const mimeType = body.image_data.split(';')[0].split(':')[1]
        const base64Data = body.image_data.split(',')[1]
        geminiContents[geminiContents.length - 1].parts.push({
          inline_data: { mime_type: mimeType, data: base64Data }
        } as any)
      }

      // Map to correct API model names
      let apiModel = model
      if (model === 'gemini-1.5-flash' || model === 'gemini-2.0-flash') apiModel = 'gemini-1.5-flash'
      else if (model === 'gemini-1.5-pro') apiModel = 'gemini-1.5-pro'

      const url = `https://generativelanguage.googleapis.com/v1beta/models/${apiModel}:generateContent?key=${geminiKey}`
      const resp = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: geminiContents })
      })

      if (!resp.ok) {
        const errData = await resp.json().catch(() => ({ error: { message: 'Unknown error' } }))
        const errMsg = errData.error?.message || 'Gemini API error'

        if (resp.status === 400 && errMsg.includes('API key not valid')) {
          return NextResponse.json({ detail: 'Invalid Gemini API Key provided.' }, { status: 400 })
        }
        return NextResponse.json({ detail: `Gemini API Error: ${errMsg}` }, { status: resp.status })
      }

      const data = await resp.json()
      try {
        const text = data.candidates[0].content.parts[0].text
        return NextResponse.json({ response: text })
      } catch {
        return NextResponse.json({ response: 'Received an empty response from Gemini.' })
      }
    }
  } catch (e: any) {
    console.error('AI Chat Error:', e)
    return NextResponse.json({ detail: e.message }, { status: 500 })
  }
}
