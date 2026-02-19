'use client';

import { motion } from 'framer-motion';

type Props = {
  id: string;
  title: string;
  lead: string;
  body: string;
  order: 'text-first' | 'image-first';
};

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-80px' },
  transition: { duration: 0.4 },
};

export function StorySection({ id, title, lead, body, order }: Props) {
  const isTextFirst = order === 'text-first';
  return (
    <section
      id={id}
      className="px-6 py-20 md:px-12 lg:px-24 border-t border-brand-100"
      aria-labelledby={`${id}-title`}
    >
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 md:gap-16 items-center">
        <motion.div
          className={isTextFirst ? 'order-2 md:order-1' : 'order-2'}
          {...fadeIn}
        >
          <h2 id={`${id}-title`} className="font-display text-2xl md:text-3xl font-bold text-ink">
            {title}
          </h2>
          <p className="mt-3 text-lg text-brand-600 font-medium">{lead}</p>
          <p className="mt-4 text-ink-muted leading-relaxed">{body}</p>
        </motion.div>
        <motion.div
          className={isTextFirst ? 'order-1 md:order-2' : 'order-1'}
          {...fadeIn}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <div
            className="aspect-[4/3] rounded-card bg-brand-100 flex items-center justify-center text-brand-600/70 text-sm"
            aria-hidden
          >
            [ Facility / method imagery ]
          </div>
        </motion.div>
      </div>
    </section>
  );
}
