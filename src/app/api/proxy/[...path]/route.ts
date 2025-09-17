import { NextRequest, NextResponse } from 'next/server'

const BACKEND_URL = 'http://45.55.152.121:8000'

export async function GET(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  const path = params.path.join('/')
  const url = new URL(request.url)
  const queryString = url.search

  try {
    const response = await fetch(`${BACKEND_URL}/${path}${queryString}`, {
      headers: {
        'Accept': 'application/json',
      },
      cache: 'no-store',
    })

    const data = await response.json()

    return NextResponse.json(data, {
      status: response.status,
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
      },
    })
  } catch (error) {
    console.error('Proxy error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch from backend' },
      { status: 500 }
    )
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  const path = params.path.join('/')

  try {
    const body = await request.json()

    const response = await fetch(`${BACKEND_URL}/${path}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(body),
      cache: 'no-store',
    })

    const data = await response.json()

    return NextResponse.json(data, {
      status: response.status,
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
      },
    })
  } catch (error) {
    console.error('Proxy error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch from backend' },
      { status: 500 }
    )
  }
}