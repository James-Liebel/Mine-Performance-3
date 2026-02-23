'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { MEMBERSHIPS, type Membership, type MembershipOption } from '@/lib/memberships';
import { TrainingOptionsGrid } from '@/components/TrainingOptionsGrid';
import { MembershipModal } from '@/components/MembershipModal';
import { EditableContent } from '@/components/EditableContent';
import { CreditsExplainer } from '@/components/CreditsExplainer';

const MEMBER_REG_CALLBACK = '/member-registration';

type ProgramTab = 'adult' | 'youth' | 'remote';

interface ModalState {
  open: boolean;
  membership: Membership | null;
  selectedOption: MembershipOption | null;
}

export default function MemberRegistrationPage() {
  const { data: session } = useSession();
  const isLoggedIn = !!session?.user;
  const [activeTab, setActiveTab] = useState<ProgramTab>('adult');
  const [memberships, setMemberships] = useState<Membership[]>(MEMBERSHIPS);
  const [modal, setModal] = useState<ModalState>({
    open: false,
    membership: null,
    selectedOption: null,
  });

  useEffect(() => {
    fetch('/api/memberships')
      .then((r) => r.json())
      .then((data) => setMemberships(Array.isArray(data) ? data : MEMBERSHIPS))
      .catch(() => setMemberships(MEMBERSHIPS));
  }, []);

  const adultMemberships = memberships.filter((m) => m.category === 'adult');
  const youthMemberships = memberships.filter((m) => m.category === 'youth');
  const remoteMemberships = memberships.filter((m) => m.category === 'remote');
  const youthAndRemoteMemberships = [...youthMemberships, ...remoteMemberships];

  const openModal = (membership: Membership) => {
    const defaultOption =
      membership.options.find((opt) => opt.daysPerWeek === 2) ??
      membership.options[0] ??
      null;
    setModal({
      open: true,
      membership,
      selectedOption: defaultOption,
    });
  };

  const closeModal = () => {
    setModal({ open: false, membership: null, selectedOption: null });
  };

  const setSelectedOption = (option: MembershipOption) => {
    setModal((prev) =>
      prev.membership ? { ...prev, selectedOption: option } : prev
    );
  };

  return (
    <div className="page page-training-options">
      <section className="hero hero-dark hero-compact training-options-hero">
        <div className="container">
          <h1>
            <EditableContent contentKey="member_reg_heading" fallback="Training options" as="span" />
          </h1>
          <p className="hero-subtitle training-options-subtitle">
            <EditableContent contentKey="member_reg_subtitle" fallback="Billed every 4 weeks. Youth = under 10U · Adults = 10U+." as="span" />
          </p>
        </div>
      </section>

      <div className="container training-options-container training-options-tabbed">
        <div className="program-tabs" role="tablist" aria-label="Program categories">
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'adult'}
            aria-controls="panel-adult"
            id="tab-adult"
            className={`program-tab ${activeTab === 'adult' ? 'program-tab--active' : ''}`}
            onClick={() => setActiveTab('adult')}
          >
            Adult (10U+)
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'youth'}
            aria-controls="panel-youth"
            id="tab-youth"
            className={`program-tab ${activeTab === 'youth' ? 'program-tab--active' : ''}`}
            onClick={() => setActiveTab('youth')}
          >
            Youth (under 10U)
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'remote'}
            aria-controls="panel-remote"
            id="tab-remote"
            className={`program-tab ${activeTab === 'remote' ? 'program-tab--active' : ''}`}
            onClick={() => setActiveTab('remote')}
          >
            Remote
          </button>
        </div>

        <p className="training-options-listings-intro text-muted" style={{ marginBottom: '1.25rem', fontSize: '0.95rem' }}>
          <EditableContent contentKey="member_reg_listings_intro" fallback="Click a plan for details and pricing." as="span" />
        </p>

        {activeTab === 'adult' && (
          <section role="tabpanel" id="panel-adult" aria-labelledby="tab-adult" className="training-options-section">
            <h2 className="training-options-section-title">
              <EditableContent contentKey="member_reg_adult_title" fallback="Adult (10U and older)" as="span" />
            </h2>
            <p className="training-options-section-desc text-muted">
              <EditableContent contentKey="member_reg_adult_desc" fallback="Skill development, performance training, and recovery." as="span" />
            </p>
            <TrainingOptionsGrid memberships={adultMemberships} onSelect={openModal} isLoggedIn={isLoggedIn} />
          </section>
        )}
        {activeTab === 'youth' && (
          <section role="tabpanel" id="panel-youth" aria-labelledby="tab-youth" className="training-options-section">
            <h2 className="training-options-section-title">
              Youth (under 10U)
            </h2>
            <p className="training-options-section-desc text-muted">
              <EditableContent contentKey="member_reg_youth_remote_desc" fallback="Youth athletes under 10U." as="span" />
            </p>
            <TrainingOptionsGrid memberships={youthMemberships} onSelect={openModal} isLoggedIn={isLoggedIn} />
          </section>
        )}
        {activeTab === 'remote' && (
          <section role="tabpanel" id="panel-remote" aria-labelledby="tab-remote" className="training-options-section">
            <h2 className="training-options-section-title">
              Remote
            </h2>
            <p className="training-options-section-desc text-muted">
              Remote training programs.
            </p>
            <TrainingOptionsGrid memberships={remoteMemberships} onSelect={openModal} isLoggedIn={isLoggedIn} />
          </section>
        )}

        <section className="credits-explainer-section credits-explainer-section--compact" style={{ marginTop: '1.5rem', marginBottom: '1rem' }}>
          <CreditsExplainer compact />
        </section>

        <p className="training-options-help text-muted">
          <EditableContent contentKey="member_reg_help_before" fallback="Not sure which plan fits? " as="span" />
          <Link href="/contact">Contact us</Link>
          <EditableContent contentKey="member_reg_help_after" fallback=" and we'll help you choose." as="span" />
        </p>
        <p className="training-options-spt-footnote text-muted" style={{ marginTop: '1rem', fontSize: '0.85rem' }}>
          <EditableContent contentKey="member_reg_spt_definition" fallback="Strength = Sports Performance Training (strength, movement, conditioning)." as="span" />
        </p>
      </div>

      {modal.open && modal.membership && (
        <MembershipModal
          membership={modal.membership}
          selectedOption={modal.selectedOption}
          onSelectOption={setSelectedOption}
          onClose={closeModal}
          isLoggedIn={isLoggedIn}
          loginCallbackUrl={MEMBER_REG_CALLBACK}
        />
      )}
    </div>
  );
}

