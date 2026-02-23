import {
  StoryProblem,
  StoryProof,
  TestimonialsSection,
} from '@/components/home';
import { EditableContent } from '@/components/EditableContent';
import { SITE_TAGLINE } from '@/lib/config';

export default function HomePage() {
  return (
    <div className="page-home">
      <div className="home-top-message" role="banner" aria-live="polite">
        <EditableContent contentKey="site_tagline" fallback={SITE_TAGLINE} as="span" />
      </div>
      <StoryProblem />
      <StoryProof />
      <TestimonialsSection />
    </div>
  );
}
