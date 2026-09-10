require('dotenv').config({ path: '../.env' })
const express = require('express')
const cors = require('cors')
const fetch = require('node-fetch')

const app = express()
const PORT = 3001

// Allow requests from MENSTA frontend
app.use(cors({ origin: 'http://localhost:3000', credentials: true }))
app.use(express.json())

const APP_ID     = process.env.VITE_META_APP_ID
const APP_SECRET  = process.env.META_APP_SECRET
const DEV_TOKEN   = process.env.IG_DEV_TOKEN
const DEV_USER_ID = process.env.IG_DEV_USER_ID
const REDIRECT_URI = `http://localhost:${PORT}/auth/instagram/callback`
const FRONTEND_URL = 'http://localhost:3000'

// ── 1. Start Instagram OAuth ─────────────────────────────────────────────────
// Frontend opens this in a popup: GET http://localhost:3001/auth/instagram
app.get('/auth/instagram', (req, res) => {
  if (!APP_ID) {
    return res.status(500).send('META_APP_ID not configured in .env')
  }
  const scope = 'instagram_business_basic'
  const authUrl =
    `https://www.instagram.com/oauth/authorize` +
    `?client_id=${APP_ID}` +
    `&redirect_uri=${encodeURIComponent(REDIRECT_URI)}` +
    `&scope=${scope}` +
    `&response_type=code` +
    `&state=mensta_ig_auth`

  console.log('[Instagram] Redirecting to OAuth:', authUrl)
  res.redirect(authUrl)
})

// ── 2. Instagram OAuth Callback ──────────────────────────────────────────────
// Meta redirects here after user grants permission
app.get('/auth/instagram/callback', async (req, res) => {
  const { code, error, error_description } = req.query

  if (error) {
    console.error('[Instagram] OAuth error:', error_description)
    return res.redirect(`${FRONTEND_URL}/social/instagram?ig_error=${encodeURIComponent(error_description)}`)
  }

  if (!code) {
    return res.redirect(`${FRONTEND_URL}/social/instagram?ig_error=no_code`)
  }

  try {
    // Step A: Exchange code for short-lived token
    console.log('[Instagram] Exchanging code for short-lived token...')
    const tokenRes = await fetch('https://api.instagram.com/oauth/access_token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: APP_ID,
        client_secret: APP_SECRET,
        grant_type: 'authorization_code',
        redirect_uri: REDIRECT_URI,
        code,
      }),
    })

    const tokenData = await tokenRes.json()
    if (!tokenRes.ok || tokenData.error) {
      throw new Error(tokenData.error_message || tokenData.error?.message || 'Token exchange failed')
    }

    const shortToken = tokenData.access_token
    const userId = tokenData.user_id
    console.log('[Instagram] Got short-lived token for user:', userId)

    // Step B: Exchange short-lived token for long-lived token (60 days)
    console.log('[Instagram] Exchanging for long-lived token...')
    const longTokenRes = await fetch(
      `https://graph.instagram.com/access_token?grant_type=ig_exchange_token&client_secret=${APP_SECRET}&access_token=${shortToken}`
    )
    const longTokenData = await longTokenRes.json()
    if (!longTokenRes.ok || longTokenData.error) {
      throw new Error(longTokenData.error?.message || 'Long-lived token exchange failed')
    }

    const longToken = longTokenData.access_token
    console.log('[Instagram] Got long-lived token! Expires in:', longTokenData.expires_in, 'seconds')

    // Redirect to frontend with token in hash (hash is NOT sent to servers — stays client-side)
    const redirectUrl = `${FRONTEND_URL}/social/instagram#ig_token=${longToken}&ig_user=${userId}`
    res.redirect(redirectUrl)
  } catch (err) {
    console.error('[Instagram] Callback error:', err.message)
    res.redirect(`${FRONTEND_URL}/social/instagram?ig_error=${encodeURIComponent(err.message)}`)
  }
})

// ── 3. Proxy: Fetch Instagram Media ─────────────────────────────────────────
// Uses dev token from .env as fallback — token never exposed in browser
app.get('/api/instagram/media', async (req, res) => {
  const token   = req.query.token   || DEV_TOKEN
  const user_id = req.query.user_id || DEV_USER_ID
  if (!token) return res.status(400).json({ error: 'No token available. Add IG_DEV_TOKEN to .env' })

  try {
    const fields = 'id,caption,media_type,media_url,thumbnail_url,permalink,timestamp,like_count,comments_count'
    const url = `https://graph.instagram.com/${user_id || 'me'}/media?fields=${fields}&access_token=${token}`
    console.log('[Instagram] Fetching media for user:', user_id)
    const mediaRes = await fetch(url)
    const data = await mediaRes.json()
    if (!mediaRes.ok || data.error) {
      throw new Error(data.error?.message || 'Failed to fetch media')
    }
    console.log('[Instagram] Got', data.data?.length, 'media items')
    res.json(data)
  } catch (err) {
    console.error('[Instagram] Media fetch error:', err.message)
    res.status(500).json({ error: err.message })
  }
})

// ── 4. Proxy: Fetch Instagram Profile ────────────────────────────────────────
app.get('/api/instagram/profile', async (req, res) => {
  const token = req.query.token || DEV_TOKEN
  if (!token) return res.status(400).json({ error: 'No token available. Add IG_DEV_TOKEN to .env' })

  try {
    const fields = 'id,name,username,profile_picture_url,followers_count,media_count'
    const url = `https://graph.instagram.com/me?fields=${fields}&access_token=${token}`
    const profileRes = await fetch(url)
    const data = await profileRes.json()
    if (!profileRes.ok || data.error) {
      throw new Error(data.error?.message || 'Failed to fetch profile')
    }
    res.json(data)
  } catch (err) {
    console.error('[Instagram] Profile fetch error:', err.message)
    res.status(500).json({ error: err.message })
  }
})

app.listen(PORT, () => {
  console.log(`\n🚀 MENSTA Dev Server running at http://localhost:${PORT}`)
  console.log(`   Instagram OAuth  → http://localhost:${PORT}/auth/instagram`)
  console.log(`   Instagram Media  → http://localhost:${PORT}/api/instagram/media`)
  console.log(`\n   App ID loaded: ${APP_ID ? '✅ ' + APP_ID : '❌ NOT FOUND'}`)
  console.log(`   App Secret loaded: ${APP_SECRET ? '✅ (hidden)' : '❌ NOT FOUND'}\n`)
})
