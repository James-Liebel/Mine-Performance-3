'use client';

import { useState } from 'react';
import Link from 'next/link';
import { startWizard } from '@/content/site-copy';
import { Button } from '@/components/Button';

const STATSTAK_BASE = 'https://mine-performance.statstak.io';

type Step = 1 | 2 | 3 | 'result';
type GoalId = 'evaluate' | 'stronger' | 'rehab' | 'other';
type AgeId = 'youth' | 'hs' | 'college' | 'adult' | 'any';
type ScheduleId = 'inseason' | 'offseason' | 'flexible';

export default function StartPage() {
  const [step, setStep] = useState<Step>(1);
  const [goal, setGoal] = useState<GoalId | null>(null);
  const [age, setAge] = useState<AgeId | null>(null);
  const [schedule, setSchedule] = useState<ScheduleId | null>(null);

  const handleGoal = (id: GoalId) => {
    setGoal(id);
    setStep(2);
  };
  const handleAge = (id: AgeId) => {
    setAge(id);
    setStep(3);
  };
  const handleSchedule = (id: ScheduleId) => {
    setSchedule(id);
    setStep('result');
  };

  const isRehab = goal === 'rehab';
  const rec = isRehab ? startWizard.result.recommendations.rehab : startWizard.result.recommendations.default;

  return (
    <div className="px-6 py-16 md:py-24 md:px-12 lg:px-24">
      <div className="max-w-2xl mx-auto">
        <h1 className="font-display text-3xl md:text-4xl font-bold text-neutral-900">
          {startWizard.title}
        </h1>
        <p className="mt-4 text-lg text-orange-600 font-medium">{startWizard.lead}</p>

        {step === 1 && (
          <section className="mt-10" aria-labelledby="step1-title">
            <h2 id="step1-title" className="text-xl font-semibold text-neutral-900">
              {startWizard.step1.title}
            </h2>
            <ul className="mt-6 flex flex-col gap-3">
              {startWizard.step1.options.map((opt) => (
                <li key={opt.id}>
                  <button
                    type="button"
                    data-testid={`wizard-goal-${opt.id}`}
                    onClick={() => handleGoal(opt.id as GoalId)}
                    className="w-full text-left px-5 py-4 rounded-xl border-2 border-neutral-200 bg-white hover:border-orange-400 hover:bg-orange-50/50 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 transition-colors"
                  >
                    {opt.label}
                  </button>
                </li>
              ))}
            </ul>
          </section>
        )}

        {step === 2 && (
          <section className="mt-10" aria-labelledby="step2-title">
            <h2 id="step2-title" className="text-xl font-semibold text-neutral-900">
              {startWizard.step2.title}
            </h2>
            <ul className="mt-6 flex flex-col gap-3">
              {startWizard.step2.options.map((opt) => (
                <li key={opt.id}>
                  <button
                    type="button"
                    data-testid={`wizard-age-${opt.id}`}
                    onClick={() => handleAge(opt.id as AgeId)}
                    className="w-full text-left px-5 py-4 rounded-xl border-2 border-neutral-200 bg-white hover:border-orange-400 hover:bg-orange-50/50 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 transition-colors"
                  >
                    {opt.label}
                  </button>
                </li>
              ))}
            </ul>
            <button
              type="button"
              onClick={() => setStep(1)}
              className="mt-6 text-neutral-600 hover:text-neutral-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 rounded"
            >
              ← Back
            </button>
          </section>
        )}

        {step === 3 && (
          <section className="mt-10" aria-labelledby="step3-title">
            <h2 id="step3-title" className="text-xl font-semibold text-neutral-900">
              {startWizard.step3.title}
            </h2>
            <ul className="mt-6 flex flex-col gap-3">
              {startWizard.step3.options.map((opt) => (
                <li key={opt.id}>
                  <button
                    type="button"
                    data-testid={`wizard-schedule-${opt.id}`}
                    onClick={() => handleSchedule(opt.id as ScheduleId)}
                    className="w-full text-left px-5 py-4 rounded-xl border-2 border-neutral-200 bg-white hover:border-orange-400 hover:bg-orange-50/50 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 transition-colors"
                  >
                    {opt.label}
                  </button>
                </li>
              ))}
            </ul>
            <button
              type="button"
              onClick={() => setStep(2)}
              className="mt-6 text-neutral-600 hover:text-neutral-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 rounded"
            >
              ← Back
            </button>
          </section>
        )}

        {step === 'result' && (
          <section className="mt-10" aria-labelledby="result-title">
            <h2 id="result-title" className="text-xl font-semibold text-neutral-900">
              {startWizard.result.title}
            </h2>
            <div className="mt-6 p-6 rounded-xl bg-neutral-50 border border-neutral-200">
              <p className="font-medium text-neutral-900">{rec.program}</p>
              <p className="mt-2 text-neutral-600">{rec.blurb}</p>
            </div>
            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <Button
                href={STATSTAK_BASE}
                variant="primary"
                size="lg"
                target="_blank"
                rel="noopener noreferrer"
                data-testid="wizard-cta-book"
              >
                {startWizard.result.ctaPrimary}
              </Button>
              <Button href="/programs" variant="secondary" size="lg" data-testid="wizard-cta-programs">
                {startWizard.result.ctaSecondary}
              </Button>
            </div>
            <p className="mt-4 text-sm text-neutral-500">
              Booking and registration are handled through our partner platform. You’ll be taken to Mine Performance on StatStak.
            </p>
            <button
              type="button"
              onClick={() => { setStep(1); setGoal(null); setAge(null); setSchedule(null); }}
              className="mt-6 text-neutral-600 hover:text-neutral-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 rounded"
            >
              Start over
            </button>
          </section>
        )}
      </div>
    </div>
  );
}
