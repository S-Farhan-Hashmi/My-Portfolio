import { CameraRig } from './CameraRig'
import { ParticleField } from './ParticleField'
import { AboutChapter } from './chapters/AboutChapter'
import { ContactChapter } from './chapters/ContactChapter'
import { HeroChapter } from './chapters/HeroChapter'
import { JourneyChapter } from './chapters/JourneyChapter'
import { SkillsChapter } from './chapters/SkillsChapter'
import { WorkChapter } from './chapters/WorkChapter'
import { Effects } from './Effects'

export function Scene() {
  return (
    <>
      <CameraRig />
      <ambientLight intensity={0.55} />
      <pointLight position={[0, 0, 0]} intensity={18} distance={26} color="#8b7bff" />

      <ParticleField />

      <HeroChapter />
      <AboutChapter />
      <SkillsChapter />
      <WorkChapter />
      <JourneyChapter />
      <ContactChapter />

      <Effects />
    </>
  )
}
