import type { SocialPost, FeedType, SocialPlatform } from './types'

// ---------- Twitter / X Mock Data ----------

const FOR_YOU_TWEETS = [
  { name: 'Elon Updates', handle: '@elonupdates', verified: true,  content: "Twitter's new AI features are rolling out globally. The algorithm is now 10x smarter at surfacing content you actually care about. #AI #Twitter", seed: 1 },
  { name: 'Tech Crunch', handle: '@techcrunch', verified: true,  content: "OpenAI just raised $2B in their latest round, valuing the company at $300B. The AI arms race is only getting started. 🚀 #OpenAI #Funding", seed: 2 },
  { name: 'Sam Altman', handle: '@sama', verified: true,  content: "The future of work will be shaped by people who know how to collaborate with AI, not compete with it. Embrace the shift early.", seed: 3 },
  { name: 'Design Daily', handle: '@designdaily', verified: false, content: "Hot take: The best UIs are the ones you forget are there. Invisible design is the hardest kind. #UX #ProductDesign #DesignThinking", seed: 4 },
  { name: 'NASA', handle: '@NASA', verified: true,  content: "🔭 JUST IN: James Webb telescope captures the deepest-ever infrared image of the universe. We're seeing galaxies formed just 330 million years after the Big Bang. #Space #JWST", seed: 5 },
  { name: 'MKBHD', handle: '@MKBHD', verified: true,  content: "The iPhone 18 Pro camera is legitimately the best phone camera I have ever tested. Computational photography in 2026 is wild. Review drops tomorrow.", seed: 6 },
  { name: 'Startup Daily', handle: '@startupdaily', verified: false, content: "0 → $1M ARR in 9 months. Here's exactly what worked for us (thread) 🧵 #Startup #SaaS #Growth", seed: 7 },
  { name: 'Frontend Masters', handle: '@frontendmasters', verified: true,  content: "React 20 is out. The new compiler makes re-renders a thing of the past. No more useMemo, no more useCallback. What a time to be a frontend dev 🙌 #React #WebDev", seed: 8 },
  { name: 'Reuters', handle: '@Reuters', verified: true,  content: "Global markets rally as inflation data comes in cooler than expected. Dow Jones up 2.1% in early trading. #Markets #Finance #Economy", seed: 9 },
  { name: 'Paul Graham', handle: '@paulg', verified: true,  content: "The best founders I know all share one trait: they have an almost irrational conviction in their vision, combined with extreme intellectual honesty about the facts.", seed: 10 },
]

const FOLLOWING_TWEETS = [
  { name: 'Srinivas K', handle: '@srinivas_k', verified: false, content: "Just landed my first freelance client through LinkedIn! If you're a designer, your profile is your portfolio. Optimize it! 💼 #Freelance #Design", seed: 11 },
  { name: 'Priya Sharma', handle: '@priyabuilds', verified: false, content: "Day 47 of building in public. Finally hit 100 users today! Small win, but it feels monumental. Every number is a real person. 🎉 #BuildInPublic", seed: 12 },
  { name: 'Dev Community', handle: '@thedevcomm', verified: false, content: "What's your go-to tool for wireframing in 2026? Ours changed from Figma to Penpot and we haven't looked back. #Design #Tools", seed: 13 },
  { name: 'Arjun Dev', handle: '@arjundev_', verified: false, content: "Finished reading 'Zero to One' by Thiel again. Every time I read it I find something new. What's the last book that changed how you think? 📚", seed: 14 },
  { name: 'Tamil Tech Hub', handle: '@tamiltechhub', verified: true,  content: "Coimbatore startup ecosystem is booming! 15 new tech startups registered this quarter alone. Silicon Valley of the South is real 🔥 #TamilNadu #Startup", seed: 15 },
  { name: 'Coffee & Code', handle: '@coffeeandcode', verified: false, content: "Working from a new café in Madurai today. The filter coffee here hits different when you're debugging a gnarly async bug. ☕️💻 #WorkFromAnywhere", seed: 16 },
  { name: 'UI Tips', handle: '@uitips_daily', verified: false, content: "One UI rule that transformed my work: whitespace is not empty space, it's breathing room for the eye. Use it generously. #UIDesign #WebDesign", seed: 17 },
  { name: 'Nithya R', handle: '@nithya_codes', verified: false, content: "Finally switched from VS Code to Neovim. The learning curve is steep but I'm already 30% faster. What editor do you swear by? ⌨️ #DevLife", seed: 18 },
  { name: 'The Indie Maker', handle: '@indiemakerHQ', verified: false, content: "Building a product that 10 people love is infinitely more valuable than building one that 1000 people kinda like. Find your 10 first. #ProductMarket", seed: 19 },
  { name: 'Karthik M', handle: '@karthik_m_io', verified: false, content: "Presented our startup at Chennai Demo Day! We didn't win but the feedback was gold. If you're building B2B SaaS in India, come talk to me. 🤝", seed: 20 },
]

// ---------- Instagram Mock Data ----------

const INSTA_FOR_YOU = [
  { name: 'National Geographic', handle: 'natgeo',         verified: true,  content: "The Great Barrier Reef is slowly making a comeback. Coral coverage has increased by 12% this year thanks to conservation efforts. 🌊🐠 #OceanLife #Conservation #NatGeo", seed: 21 },
  { name: 'Apple Design',        handle: 'appledesign',    verified: true,  content: "Introducing the new Design Awards winners for 2026. Apps that push boundaries and set new standards for what software can feel like. #Apple #Design", seed: 22 },
  { name: 'Cristiano Ronaldo',   handle: 'cristiano',      verified: true,  content: "Training day. Every morning is a chance to be better than yesterday. No shortcuts. 💪🏽⚽ #CR7 #Dedication", seed: 23 },
  { name: 'NASA Hubble',         handle: 'nasahubble',     verified: true,  content: "A stellar nursery 6,500 light-years away, captured in breathtaking detail. The universe is painting masterpieces we're only just beginning to see. 🌌✨ #Space #Hubble", seed: 24 },
  { name: 'Tasty',               handle: 'buzzfeedtasty',  verified: true,  content: "60-minute butter chicken that will change your life. Recipe link in bio. 🍛🧡 #Tasty #Foodie #IndianFood #Recipe", seed: 25 },
  { name: 'Architecture Daily',  handle: 'archdaily',      verified: true,  content: "This floating library in Copenhagen is a testament to what bold, sustainable architecture can look like in 2026. 📐🏛️ #Architecture #Design #Sustainability", seed: 26 },
  { name: 'Nike',                handle: 'nike',           verified: true,  content: "The new Air Max 2026 drops Friday. This one changes everything. 👟🔥 #Nike #JustDoIt #Sneakerhead", seed: 27 },
  { name: 'Aerial Photography',  handle: 'aerialphotos',   verified: false, content: "Madurai Meenakshi temple from 400 feet above. Our city never looked more breathtaking. 🛸📸 #Madurai #Drone #India #Aerial", seed: 28 },
  { name: 'Minimalist Living',   handle: 'minimalisthome', verified: false, content: "A home should feel like a breath of fresh air, not a to-do list. Declutter one room at a time. 🪴🤍 #Minimalist #HomDecor #InteriorDesign", seed: 29 },
  { name: 'Planet Earth',        handle: 'planetearth',    verified: true,  content: "Snow leopards spotted at record-high altitude in the Himalayas. Nature never stops surprising us. 🐆❄️ #Wildlife #PlanetEarth #Conservation", seed: 30 },
]

const INSTA_FOLLOWING = [
  { name: 'Srinivas',    handle: 'srinivas.photo',    verified: false, content: "Golden hour at Marina Beach. Chennai evenings are unmatched. Shot on iPhone 18 Pro. 📱🌅 #ChennaiBeauty #MarinaBeach #Photography", seed: 31 },
  { name: 'Priya R',     handle: 'priya.r.designs',   verified: false, content: "Finally got my workspace exactly how I wanted it! The monstera is the real star though. 🌿💻 #WorkspaceSetup #Aesthetic #IndianDesigner", seed: 32 },
  { name: 'Tamil Foodie',handle: 'tamilfoodiegram',   verified: false, content: "Kari dosa from that tiny shop on Masi Street, Madurai. Nothing else compares. ☕🌶️ #MaduraiFoods #TamilFood #Foodstagram", seed: 33 },
  { name: 'Arjun Clicks', handle: 'arjun.clicks',     verified: false, content: "Trying out long-exposure photography for the first time. The light trails on Anna Salai at midnight are 🤌 #Longexposure #NightPhotography #Chennai", seed: 34 },
  { name: 'Nithya Art',  handle: 'nithya.art_studio', verified: false, content: "New piece finished! A modern take on classical Tanjore art using acrylic on canvas. 500 hours of practice in one painting. 🎨 #TanjoreArt #IndianArt", seed: 35 },
  { name: 'Karthik Fit', handle: 'karthik.fit',       verified: false, content: "6 months transformation. Same person, different mindset. Consistency is the only secret. 💪 No quick fixes. #FitnessJourney #Transformation", seed: 36 },
  { name: 'Cafe Diaries', handle: 'thecafediaries',   verified: false, content: "Hidden gem found in Pondicherry's White Town. French-colonial vibes, incredible espresso, and a bookshelf you can borrow from. 📚☕ #Pondicherry #Cafe", seed: 37 },
  { name: 'Dev Travels', handle: 'devtravels_india',   verified: false, content: "Remote work in Kodaikanal this week. The fog, the silence, and the productivity are all on another level. 🏔️💻 #WorkFromAnywhere #Kodaikanal", seed: 38 },
  { name: 'Tamil Culture', handle: 'tamil.culture',   verified: false, content: "Kolam at dawn. My grandmother's hands are 75 years old and still draw this freehand, perfectly, every morning. This is our heritage. 🌺 #Tamil #Kolam", seed: 39 },
  { name: 'Sneha Bakes',  handle: 'sneha.bakes_',     verified: false, content: "Tried making Tiramisu with filter coffee instead of espresso. The result? A full-blown identity crisis for an Italian dessert. And it's DELICIOUS. ☕🍰 #Baking", seed: 40 },
]

// ---------- Generator ----------

type MockPostData = { name: string; handle: string; verified: boolean; content: string; seed: number }

// Map seed numbers to reliable picsum photo IDs (photos 10–1000 all exist)
const PICSUM_IDS = [10, 14, 15, 16, 17, 18, 19, 20, 21, 22, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 36, 37, 39, 40, 42, 43, 44, 45, 48, 49, 50, 51, 52, 55, 56, 57, 58, 60, 62, 63]

function buildPost(platform: SocialPlatform, tab: FeedType, data: MockPostData, index: number): SocialPost {
  const isX = platform === 'twitter'
  // X: alternate media every 2 posts; Instagram: always has media
  const hasMedia = isX ? index % 2 === 0 : true
  const picsumId = PICSUM_IDS[data.seed % PICSUM_IDS.length]
  return {
    id: `${platform}-${tab}-${index}`,
    platform,
    author: {
      id: `user-${data.seed}`,
      name: data.name,
      handle: data.handle,
      avatarUrl: `https://i.pravatar.cc/150?u=${data.seed}`,
      isVerified: data.verified,
    },
    content: data.content,
    media: hasMedia ? [{
      type: 'image',
      url: `https://picsum.photos/id/${picsumId}/${isX ? '800/400' : '800/800'}`,
      aspectRatio: isX ? 'landscape' : (index % 3 === 0 ? 'portrait' : 'square'),
    }] : undefined,
    metrics: {
      likes:    Math.floor((data.seed * 1234567) % 80000) + 200,
      comments: Math.floor((data.seed * 234567)  % 2000)  + 20,
      reposts:  Math.floor((data.seed * 34567)   % 8000)  + 10,
      views:    Math.floor((data.seed * 4567)    % 1000000) + 10000,
    },
    postedAt: new Date(Date.now() - (data.seed * 600000)).toISOString(),
  }
}

export async function fetchTwitterFeed(type: FeedType): Promise<SocialPost[]> {
  await new Promise(resolve => setTimeout(resolve, 700))
  const source = type === 'trending' ? FOR_YOU_TWEETS : FOLLOWING_TWEETS
  return source.map((data, i) => buildPost('twitter', type, data, i))
}

export async function fetchInstagramFeed(type: FeedType): Promise<SocialPost[]> {
  await new Promise(resolve => setTimeout(resolve, 700))
  const source = type === 'trending' ? INSTA_FOR_YOU : INSTA_FOLLOWING
  return source.map((data, i) => buildPost('instagram', type, data, i))
}
