import { motion } from 'framer-motion'
import { Link, useNavigate } from 'react-router-dom'
import { Zap, ArrowRight, Newspaper, Globe, MapPin, Bookmark, Star, Shield } from 'lucide-react'
import { Button } from '@/components/ui/Button'

const features = [
  {
    icon: <MapPin className="w-5 h-5" />,
    title: 'Local News',
    desc: 'Stories from your city, district & state — curated just for you.',
  },
  {
    icon: <Globe className="w-5 h-5" />,
    title: 'Global Coverage',
    desc: 'Pick your interests and get world-class journalism across 20+ categories.',
  },
  {
    icon: <Bookmark className="w-5 h-5" />,
    title: 'Save & Read Later',
    desc: 'Bookmark any story and access it anytime across your devices.',
  },
  {
    icon: <Star className="w-5 h-5" />,
    title: 'Personalized',
    desc: 'The more you use it, the smarter your feed gets.',
  },
]

const categoryPills = [
  '💻 Technology', '🏏 Sports', '🤖 AI', '🚀 Space', '💼 Business',
  '🏥 Health', '🎬 Entertainment', '📈 Economy', '🔬 Science', '🌿 Environment',
  '📚 Education', '✈️ Travel',
]

export default function LandingPage() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-surface-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg gradient-brand flex items-center justify-center">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <span className="font-display font-extrabold text-xl text-ink tracking-tight">MENSTA</span>
          </Link>
          <div className="flex items-center gap-3">
            <Link to="/login" className="text-sm font-semibold text-ink-secondary hover:text-ink transition-colors">
              Sign in
            </Link>
            <Button size="sm" onClick={() => navigate('/signup')}>
              Get started
            </Button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="pt-28 pb-20 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-brand-50 border border-brand-100 rounded-full text-sm font-semibold text-brand-700 mb-6">
              <Shield className="w-4 h-4" />
              Your privacy-first news platform
            </div>

            <h1 className="font-display font-black text-5xl sm:text-6xl lg:text-7xl text-ink mb-6 leading-[1.05] tracking-tight text-balance">
              Your world.{' '}
              <span className="bg-gradient-to-r from-brand-600 to-brand-400 bg-clip-text text-transparent">
                Your interests.
              </span>
              <br />One intelligent feed.
            </h1>

            <p className="text-lg sm:text-xl text-ink-secondary max-w-2xl mx-auto mb-10 leading-relaxed">
              MENSTA brings together local news from your city, global stories across 20+ categories,
              and personalized discovery — all in one beautifully designed app.
            </p>

            <div className="flex items-center justify-center gap-4 flex-wrap">
              <Button
                size="lg"
                onClick={() => navigate('/signup')}
                rightIcon={<ArrowRight className="w-5 h-5" />}
                className="shadow-lg shadow-brand-200"
              >
                Start for free
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => navigate('/login')}
              >
                Sign in
              </Button>
            </div>
          </motion.div>

          {/* Category pills */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="mt-16 flex flex-wrap gap-2 justify-center"
          >
            {categoryPills.map((pill, i) => (
              <motion.span
                key={pill}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 + i * 0.04 }}
                className="px-4 py-2 bg-surface-50 border border-surface-200 rounded-full text-sm font-medium text-ink-secondary hover:border-brand-200 hover:text-brand-700 hover:bg-brand-50 transition-colors cursor-default"
              >
                {pill}
              </motion.span>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4 sm:px-6 bg-surface-50">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <h2 className="font-display font-bold text-3xl sm:text-4xl text-ink mb-4">
              Everything you need to stay informed
            </h2>
            <p className="text-lg text-ink-secondary max-w-xl mx-auto">
              A complete personal discovery platform built around you — not advertisers.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white border border-surface-200 rounded-2xl p-6 hover:shadow-card-hover hover:border-brand-100 transition-all group"
              >
                <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center mb-4 group-hover:bg-brand-100 transition-colors">
                  {f.icon}
                </div>
                <h3 className="font-display font-bold text-base text-ink mb-2">{f.title}</h3>
                <p className="text-sm text-ink-secondary leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-2xl mx-auto text-center"
        >
          <div className="w-16 h-16 rounded-2xl gradient-brand flex items-center justify-center mx-auto mb-6 shadow-lg shadow-brand-200">
            <Newspaper className="w-8 h-8 text-white" />
          </div>
          <h2 className="font-display font-bold text-3xl sm:text-4xl text-ink mb-4">
            Ready to discover your world?
          </h2>
          <p className="text-lg text-ink-secondary mb-8">
            Join thousands of readers who never miss what matters.
          </p>
          <Button
            size="lg"
            onClick={() => navigate('/signup')}
            rightIcon={<ArrowRight className="w-5 h-5" />}
            className="shadow-lg shadow-brand-200"
          >
            Create free account
          </Button>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-surface-100 text-center text-sm text-ink-muted">
        <div className="flex items-center justify-center gap-2 mb-2">
          <div className="w-6 h-6 rounded-md gradient-brand flex items-center justify-center">
            <Zap className="w-3 h-3 text-white" />
          </div>
          <span className="font-bold text-ink">MENSTA</span>
        </div>
        <p>© {new Date().getFullYear()} MENSTA. Your world. Your interests.</p>
      </footer>
    </div>
  )
}
