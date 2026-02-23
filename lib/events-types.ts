/** Event shape used by events page, calendar, and booking. */
export interface EventItem {
  id: string;
  title: string;
  date: string;
  startTime?: string;
  endTime?: string;
  type: string;
  program?: string;
  location?: string;
  featured?: boolean;
  capacity: number;
  bookedCount: number;
  subscriptionTier: string;
}
