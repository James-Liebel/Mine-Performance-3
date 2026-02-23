'use client';

import { useState, useEffect } from 'react';
import { type Membership, type MembershipCategory } from '@/lib/memberships';

function centsToDollars(cents: number): number {
  return cents / 100;
}

function newId(): string {
  return `new-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function createNewMembership(): Membership {
  const id = newId();
  return {
    id,
    name: 'New plan',
    category: 'adult',
    basePrice2Day: 0,
    billingLabel: 'billed every 4 weeks',
    options: [
      {
        id: `opt-${id}`,
        label: '2 days per week',
        daysPerWeek: 2,
        priceCents: 0,
      },
    ],
  };
}

export default function AdminPricingPage() {
  const [memberships, setMemberships] = useState<Membership[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'ok' | 'err'; text: string } | null>(null);

  useEffect(() => {
    fetch('/api/admin/pricing')
      .then((r) => r.json())
      .then((data) => setMemberships(Array.isArray(data) ? data : []))
      .catch(() => setMemberships([]))
      .finally(() => setLoading(false));
  }, []);

  const updateOptionPrice = (
    membershipId: string,
    optionId: string,
    priceDollars: number
  ) => {
    const priceCents = Math.round(priceDollars * 100);
    setMemberships((prev) =>
      prev.map((m) => {
        if (m.id !== membershipId) return m;
        const options = m.options.map((opt) =>
          opt.id === optionId ? { ...opt, priceCents } : opt
        );
        const baseOption = options.find((o) => o.daysPerWeek === 2) ?? options[0];
        return {
          ...m,
          options,
          basePrice2Day: baseOption ? Math.round(baseOption.priceCents / 100) : 0,
        };
      })
    );
  };

  const updateMembershipStripeLink = (id: string, stripePaymentLink: string) => {
    setMemberships((prev) =>
      prev.map((m) => (m.id === id ? { ...m, stripePaymentLink: stripePaymentLink.trim() || undefined } : m))
    );
  };

  const updateOptionStripeLink = (
    membershipId: string,
    optionId: string,
    stripePaymentLink: string
  ) => {
    setMemberships((prev) =>
      prev.map((m) => {
        if (m.id !== membershipId) return m;
        const options = m.options.map((opt) =>
          opt.id === optionId ? { ...opt, stripePaymentLink: stripePaymentLink.trim() || undefined } : opt
        );
        return { ...m, options };
      })
    );
  };

  const updateMembershipName = (id: string, name: string) => {
    setMemberships((prev) =>
      prev.map((m) => (m.id === id ? { ...m, name } : m))
    );
  };

  const updateMembershipCategory = (id: string, category: MembershipCategory) => {
    setMemberships((prev) =>
      prev.map((m) => (m.id === id ? { ...m, category } : m))
    );
  };

  const removeMembership = (id: string) => {
    setMemberships((prev) => prev.filter((m) => m.id !== id));
    setMessage(null);
  };

  const addMembership = () => {
    setMemberships((prev) => [...prev, createNewMembership()]);
    setMessage(null);
  };

  const handleSave = async () => {
    setMessage(null);
    setSaving(true);
    try {
      const toSave = memberships.map((m) => ({
        ...m,
        basePrice2Day: m.options.find((o) => o.daysPerWeek === 2)?.priceCents
          ? Math.round((m.options.find((o) => o.daysPerWeek === 2)!.priceCents) / 100)
          : (m.options[0] ? Math.round(m.options[0].priceCents / 100) : 0),
      }));
      const res = await fetch('/api/admin/pricing', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ memberships: toSave }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || res.statusText);
      }
      setMessage({ type: 'ok', text: 'Pricing saved. Changes appear on the site immediately.' });
    } catch (e) {
      setMessage({ type: 'err', text: e instanceof Error ? e.message : 'Failed to save' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="container" style={{ paddingTop: '2rem' }}>
        <p className="text-muted">Loading pricing…</p>
      </div>
    );
  }

  return (
    <div className="container admin-page" style={{ paddingTop: '2rem', paddingBottom: '3rem' }}>
      <h1 className="admin-page-title" style={{ marginBottom: '0.5rem' }}>Pricing</h1>
      <p className="text-muted admin-page-desc" style={{ marginBottom: '1.5rem' }}>
        <strong>Click any membership name or price to edit.</strong> Set Stripe Payment Links (e.g. <code>https://buy.stripe.com/...</code>) so &quot;Choose plan&quot; buttons go to Stripe checkout. Plan link applies to the whole plan; option links override for each price tier. Add or remove plans with the buttons below. Save to update the site. All prices are billed every 4 weeks.
      </p>

      {message && (
        <p
          className={message.type === 'ok' ? 'admin-message-ok' : 'admin-message-err'}
          style={{ marginBottom: '1rem' }}
        >
          {message.text}
        </p>
      )}

      <div className="admin-pricing-table-wrap">
        <table className="admin-pricing-table">
          <thead>
            <tr>
              <th>Membership</th>
              <th>Category</th>
              <th>Price options &amp; Stripe links</th>
              <th>Plan Stripe link</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {memberships.map((m) => (
              <tr key={m.id}>
                <td>
                  <input
                    type="text"
                    value={m.name}
                    onChange={(e) => updateMembershipName(m.id, e.target.value)}
                    className="form-input admin-pricing-name-input"
                    placeholder="Plan name"
                  />
                </td>
                <td>
                  <select
                    value={m.category}
                    onChange={(e) => updateMembershipCategory(m.id, e.target.value as MembershipCategory)}
                    className="form-input admin-pricing-category-select"
                  >
                    <option value="adult">Adult</option>
                    <option value="youth">Youth</option>
                    <option value="remote">Remote</option>
                  </select>
                </td>
                <td>
                  <div className="admin-pricing-options">
                    {m.options
                      .slice()
                      .sort((a, b) => a.daysPerWeek - b.daysPerWeek)
                      .map((opt) => (
                        <div key={opt.id} className="admin-pricing-option-row" style={{ marginBottom: '0.75rem' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.25rem' }}>
                            <label className="admin-pricing-option-label" htmlFor={`price-${m.id}-${opt.id}`}>
                              {opt.label}
                            </label>
                            <span className="admin-pricing-option-input-wrap">
                              <span className="admin-pricing-option-currency">$</span>
                              <input
                                id={`price-${m.id}-${opt.id}`}
                                type="number"
                                min={0}
                                step={1}
                                value={centsToDollars(opt.priceCents)}
                                onChange={(e) =>
                                  updateOptionPrice(m.id, opt.id, Number(e.target.value) || 0)
                                }
                                className="form-input admin-pricing-option-input"
                              />
                            </span>
                          </div>
                          <input
                            type="url"
                            value={opt.stripePaymentLink ?? ''}
                            onChange={(e) => updateOptionStripeLink(m.id, opt.id, e.target.value)}
                            className="form-input"
                            placeholder="Stripe Payment Link (optional)"
                            style={{ width: '100%', fontSize: '0.85rem', maxWidth: '20rem' }}
                          />
                        </div>
                      ))}
                  </div>
                </td>
                <td>
                  <input
                    type="url"
                    value={m.stripePaymentLink ?? ''}
                    onChange={(e) => updateMembershipStripeLink(m.id, e.target.value)}
                    className="form-input"
                    placeholder="Plan link (optional)"
                    style={{ width: '100%', fontSize: '0.85rem', minWidth: '12rem' }}
                  />
                </td>
                <td>
                  <button
                    type="button"
                    className="btn btn-secondary admin-events-btn admin-events-btn-danger"
                    onClick={() => removeMembership(m.id)}
                    title="Remove this membership"
                  >
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={{ marginTop: '1rem', display: 'flex', flexWrap: 'wrap', gap: '0.75rem', alignItems: 'center' }}>
        <button type="button" className="btn btn-secondary" onClick={addMembership}>
          Add membership
        </button>
        <button
          type="button"
          className="btn btn-primary"
          onClick={handleSave}
          disabled={saving}
        >
          {saving ? 'Saving…' : 'Save pricing'}
        </button>
        <p className="text-muted" style={{ margin: 0, fontSize: '0.85rem' }}>
          Changes appear on the Member registration page after you save.
        </p>
      </div>
    </div>
  );
}
