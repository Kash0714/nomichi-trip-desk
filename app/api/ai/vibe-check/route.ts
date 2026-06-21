import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(req: NextRequest) {
  try {
    const { leadId } = await req.json()

    if (!leadId) {
      return NextResponse.json({ error: 'Missing leadId' }, { status: 400 })
    }

    const supabase = createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: lead } = await supabase
      .from('leads')
      .select('*, trip:trips(name, description)')
      .eq('id', leadId)
      .single()

    if (!lead) {
      return NextResponse.json({ error: 'Lead not found' }, { status: 404 })
    }

    const trip = (lead as any).trip

    const prompt = `You are helping the Nomichi team do a fun, warm assessment of whether a traveller fits their style of slow, offbeat, small-group travel.

Nomichi is for people who want to slow down, go somewhere unexpected, and travel with a small group of interesting people. They are NOT for people who want luxury resorts, large tour groups, or packed itineraries.

${trip ? `Trip they enquired about: ${trip.name} - ${trip.description}` : 'No trip details.'}

Traveller details:
- Travelling as: ${lead.group_type}
- Preferred month: ${lead.preferred_month}
- What they wrote: "${lead.vibe_text || 'Nothing written'}"

Based on the spirit of what they wrote, give a warm and slightly witty read on whether they seem like a Nomichi traveller. Be generous — if there is any hint of curiosity, adventure, or wanting something real, lean toward "likely". Only say "unclear" if there is genuinely nothing to go on.

Respond with ONLY valid JSON, no markdown, no explanation outside the JSON:
{"fit": "likely" or "maybe" or "unclear", "reason": "One warm, specific, slightly witty sentence about this traveller."}`

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 150,
        temperature: 0.3,
      }),
    })

    const data = await response.json()
    const text = data.choices?.[0]?.message?.content ?? ''
    console.log('Groq response:', JSON.stringify(data))
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (!jsonMatch) throw new Error('No JSON found in response')
    const parsed = JSON.parse(jsonMatch[0])

    if (!['likely', 'maybe', 'unclear'].includes(parsed.fit)) {
      throw new Error('Invalid fit value')
    }

    await supabase
      .from('leads')
      .update({
        ai_vibe_fit: parsed.fit,
        ai_vibe_reason: parsed.reason,
      })
      .eq('id', leadId)

    return NextResponse.json({ fit: parsed.fit, reason: parsed.reason })
  } catch (err) {
    console.error('Vibe check error:', err)
    return NextResponse.json({ error: 'Could not get an AI read. Try again.' }, { status: 500 })
  }
}