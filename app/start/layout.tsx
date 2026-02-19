import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Start Here',
  description: 'Answer a few questions and we’ll recommend the best program and next step for you at Mine Performance Academy.',
};

export default function StartLayout({ children }: { children: React.ReactNode }) {
  return children;
}
