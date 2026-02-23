/**
 * Integration adapter interfaces.
 * All adapters implement IntegrationAdapter and optional extensions.
 */

/** Base adapter contract — every integration must implement this */
export interface IntegrationAdapter {
  id: string;
  /** Returns true if the integration is configured and ready to use */
  healthy(): Promise<boolean>;
}

/** Optional: adapters that build outbound URLs (e.g. StatStak deep links) */
export interface DeepLinkAdapter extends IntegrationAdapter {
  /** Build a deep link URL for the given target */
  buildUrl(target: string, params?: Record<string, string>): string | null;
  /** Valid targets this adapter supports */
  supportedTargets: string[];
}

/** Optional: adapters that submit forms (contact, booking, etc.) */
export interface FormSubmitAdapter extends IntegrationAdapter {
  /** Submit form data; returns success/failure */
  submit(payload: FormPayload): Promise<FormSubmitResult>;
}

export interface FormPayload {
  formId: string;
  fields: Record<string, string | number | boolean>;
}

export interface FormSubmitResult {
  ok: boolean;
  error?: string;
  externalId?: string;
}

/** Integration registry entry */
export type RegisteredAdapter = IntegrationAdapter | DeepLinkAdapter | FormSubmitAdapter;
