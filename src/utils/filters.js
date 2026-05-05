import { FUND_RANGES } from '../data/categories';

// Apply all active filters to a list of projects
export function applyFilters(projects, filters) {
  let result = [...projects];

  // Year
  if (filters.years?.length) {
    result = result.filter(p => filters.years.includes(p.year));
  }
  // State
  if (filters.states?.length) {
    result = result.filter(p => filters.states.includes(p.state));
  }
  // Category
  if (filters.categories?.length) {
    result = result.filter(p => filters.categories.includes(p.category));
  }
  // Status
  if (filters.statuses?.length) {
    result = result.filter(p => filters.statuses.includes(p.status));
  }
  // Plant
  if (filters.plants?.length) {
    result = result.filter(p => filters.plants.includes(p.plant));
  }
  // Fund range
  if (filters.fundRange) {
    const range = FUND_RANGES.find(r => r.id === filters.fundRange);
    if (range) {
      result = result.filter(p => p.fund >= range.min && p.fund < range.max);
    }
  }
  // Free-text search
  if (filters.search?.trim()) {
    const q = filters.search.toLowerCase();
    result = result.filter(p =>
      p.title.toLowerCase().includes(q) ||
      p.id.toLowerCase().includes(q) ||
      p.pi.toLowerCase().includes(q) ||
      p.institution.toLowerCase().includes(q) ||
      p.plant.toLowerCase().includes(q) ||
      p.city.toLowerCase().includes(q)
    );
  }

  return result;
}

// Initial empty filter state
export const EMPTY_FILTERS = {
  years: [],
  states: [],
  categories: [],
  statuses: [],
  plants: [],
  fundRange: null,
  search: '',
};