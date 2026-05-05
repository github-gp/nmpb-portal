import { useState, useMemo } from 'react';
import { applyFilters, EMPTY_FILTERS } from '../utils/filters';

export function useFilters(projects) {
  const [filters, setFilters] = useState(EMPTY_FILTERS);

  const filtered = useMemo(
    () => applyFilters(projects, filters),
    [projects, filters]
  );

  return { filters, setFilters, filtered };
}