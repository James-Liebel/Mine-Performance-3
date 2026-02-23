import type { Membership, MembershipOption } from '@/lib/memberships';

function formatPrice(cents: number): string {
  return `$${(cents / 100).toFixed(0)}`;
}

function getOptionCountLabel(count: number): string {
  if (count === 1) return '1 price option';
  return `${count} price options`;
}

export interface MembershipSectionProps {
  title: string;
  description: string;
  memberships: Membership[];
  onLearnMore: (membership: Membership) => void;
}

export function MembershipSection({
  title,
  description,
  memberships,
  onLearnMore,
}: MembershipSectionProps) {
  return (
    <section className="section">
      <div className="section-header">
        <h2>{title}</h2>
        <p className="text-muted">{description}</p>
      </div>
      <div className="card-grid">
        {memberships.map((membership) => {
          const optionCount = membership.options.length;
          const baseOption =
            membership.options.find((opt) => opt.daysPerWeek === 2) ??
            membership.options[0];

          return (
            <article key={membership.id} className="card">
              <div className="card-header">
                <h3>{membership.name}</h3>
              </div>
              <div className="card-body">
                <p className="price">
                  <span className="price-main">
                    {formatPrice(baseOption.priceCents)}
                  </span>
                  <span className="price-sub">
                    for 2 days/week, {membership.billingLabel}
                  </span>
                </p>
                <p className="text-muted">
                  {getOptionCountLabel(optionCount)} to match your training
                  frequency.
                </p>
              </div>
              <div className="card-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => onLearnMore(membership)}
                >
                  Learn more
                </button>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
