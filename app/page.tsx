'use client';

import { motion } from 'framer-motion';
import { hero, story } from '@/content/site-copy';
import { Button } from '@/components/Button';
import { StorySection } from '@/components/StorySection';

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4 },
};

export default function HomePage() {
  return (
    <>
      <section
        className="relative min-h-[85vh] flex flex-col justify-center px-6 pt-24 pb-32 md:px-12 lg:px-24"
        aria-labelledby="hero-heading"
      >
        <div className="max-w-4xl">
          <motion.p
            className="font-display text-sm uppercase tracking-widest text-orange-500 mb-4"
            {...fadeUp}
          >
            {hero.subhead.split('.')[0]}
          </motion.p>
          <motion.h1
            id="hero-heading"
            className="font-display text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-neutral-900 leading-[1.1]"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            {hero.headline}
          </motion.h1>
          <motion.p
            className="mt-6 text-lg md:text-xl text-neutral-600 max-w-2xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {hero.subhead}
          </motion.p>
          <motion.div
            className="mt-10 flex flex-wrap gap-4"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.35 }}
          >
            <Button href="/contact" variant="primary" size="lg" data-testid="cta-book-eval">
              {hero.ctaPrimary}
            </Button>
            <Button href="/programs" variant="secondary" size="lg" data-testid="cta-view-programs">
              {hero.ctaSecondary}
            </Button>
          </motion.div>
        </div>
      </section>

      <StorySection
        id="problem"
        title={story.problem.title}
        lead={story.problem.lead}
        body={story.problem.body}
        order="text-first"
      />
      <StorySection
        id="method"
        title={story.method.title}
        lead={story.method.lead}
        body={story.method.body}
        order="image-first"
      />
      <StorySection
        id="proof"
        title={story.proof.title}
        lead={story.proof.lead}
        body={story.proof.body}
        order="text-first"
      />
      <StorySection
        id="place"
        title={story.place.title}
        lead={story.place.lead}
        body={story.place.body}
        order="image-first"
      />

      <section className="px-6 py-20 md:px-12 lg:px-24 bg-neutral-50" aria-labelledby="cta-heading">
        <div className="max-w-2xl mx-auto text-center">
          <h2 id="cta-heading" className="font-display text-2xl md:text-3xl font-bold text-neutral-900">
            Ready to start with data, not guesswork?
          </h2>
          <p className="mt-4 text-neutral-600">Book an evaluation and see where you stand.</p>
          <div className="mt-8">
            <Button href="/contact" variant="primary" size="lg">
              {hero.ctaPrimary}
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
