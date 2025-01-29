import { NextRequest, NextResponse } from 'next/server'
import { Client } from "@gradio/client"

export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  try {
    const { input } = await req.json()
    
    const client = await Client.connect("feuer33/Apple_Memoji")
    const result = await client.predict("/predict", { 
      param_0: input + "memoji",
    })

    if (!result?.data || !Array.isArray(result.data) || !result.data[0]) {
      throw new Error('Invalid response from API')
    }

    return NextResponse.json({
      result: result.data[0],
      success: true 
    })
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : 'Failed to generate memoji response',
        success: false 
      },
      { status: 500 }
    )
  }
}