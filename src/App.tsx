import { MotionConfig } from 'motion/react'
import { useSmoothScroll } from './lib/useSmoothScroll'
import { ScrollProgress } from './components/ScrollProgress'
import { Header } from './components/Header'
import IntroScrub from './components/IntroScrub'
import { ChapterBreak } from './components/ui/ChapterBreak'
import { Manifesto } from './components/Manifesto'
import { HowICreate } from './components/HowICreate'
import { Expertise } from './components/Expertise'
import { Timeline } from './components/Timeline'
import { Projects } from './components/Projects'
import { Contact } from './components/Contact'
import { CHAPTERS } from './data'

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
          {/* `grid` continues the digital-grid surface the intro dissolves into */}
          <ChapterBreak {...CHAPTERS.manifesto} grid />
          <Manifesto />
          <ChapterBreak {...CHAPTERS.create} />
          <HowICreate />
          <ChapterBreak {...CHAPTERS.work} />
          <Expertise />
          <ChapterBreak {...CHAPTERS.path} />
          <Timeline />
          <ChapterBreak {...CHAPTERS.projects} />
          <Projects />
          <ChapterBreak {...CHAPTERS.contact} />
          <Contact />
        </div>
      </main>
    </MotionConfig>
  )
}
