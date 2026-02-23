import {
  StoryProblem,
  StoryMethod,
  StoryProof,
  CoachingSection,
  StoryPlace,
} from '@/components/home';

export default function HomePage() {
  return (
    <div className="page-home page-home-editorial">
      <StoryProblem />
      <StoryMethod />
      <StoryProof />
      <CoachingSection />
      <StoryPlace />
    </div>
  );
}
