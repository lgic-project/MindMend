

export const metadata = {
  title: 'MindMend',
  description: 'Mental Health App',
}

import Hero from '@/components/hero'
import Features from '@/components/features'
import Newsletter from '@/components/newsletter'
import Zigzag from '@/components/zigzag'
import Testimonials from '@/components/testimonials'
import Loading from '@/components/loading'

export default function Home() {
  return (
    <>
    
      <Hero />
      <Features />
      <Zigzag />
      <Testimonials />
      <Newsletter />
    </>
  )
}
