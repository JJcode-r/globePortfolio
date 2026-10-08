import React from 'react';
import { motion } from 'framer-motion';
import { SERVICES } from '../content/site';

/**
 * Client-facing counterpart to TechnicalFluency: what you can hire this for,
 * rather than what can be defended in an interview.
 */
const Services: React.FC = () => (
  <section id="services" className="relative w-full py-16 sm:py-20 lg:py-24">
    <div className="mx-auto max-w-5xl px-6">
      <motion.h2
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-[-0.03em] text-neutral-900"
      >
        Services
      </motion.h2>

      <div className="mt-14 grid gap-x-12 gap-y-12 sm:grid-cols-2">
        {SERVICES.map((service, i) => (
          <motion.div
            key={service.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{
              duration: 0.6,
              delay: Math.min(i * 0.07, 0.3),
              ease: [0.22, 1, 0.36, 1],
            }}
            className="border-t border-neutral-900/15 pt-6"
          >
            <h3 className="text-[1.15rem] font-semibold tracking-[-0.015em] text-neutral-900">
              {service.title}
            </h3>
            <p className="mt-3 max-w-[46ch] text-[15px] leading-[1.8] text-neutral-600">
              {service.body}
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default Services;
