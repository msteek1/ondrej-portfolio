import { MotionConfig } from 'motion/react'
import { useSmoothScroll } from './lib/useSmoothScroll'
import { ScrollProgress } from './components/ScrollProgress'
import { Header } from './components/Header'
import IntroScrub from './components/IntroScrub'
import { Manifesto } from './components/Manifesto'
import { Expertise } from './components/Expertise'
import { Timeline } from './components/Timeline'
import { Projects } from './components/Projects'
import { Contact } from './components/Contact'

export default function App() {
  useSmoothScroll()

  // ?still=1 forces final (reduced-motion) states — handy for static review/screenshots.
  const still =
    typeof window !== 'undefined' && new URLSearchParams(window.location.search).has('still')

  return (
    <MotionConfig reducedMotion={still ? 'always' : 'user'}>
      <ScrollProgress />
      <Header />
      <main>
        <IntroScrub />
        <div className="relative bg-ink">
          <Manifesto />
          <Expertise />
          <Timeline />
          <Projects />
          <Contact />
        </div>
      </main>
    </MotionConfig>
  )
}
