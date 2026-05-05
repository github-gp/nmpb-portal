// Demo users for the login system
// In production, replace with proper authentication backend (JWT, OAuth, etc.)

export const USERS = [
  {
    id: 'u1',
    username: 'admin',
    password: 'nmpb@2025', // ⚠️ Demo only — never store plain passwords in real apps
    name: 'NMPB Administrator',
    role: 'admin',           // sees all India data
    state: null,
    email: 'admin@nmpb.gov.in',
  },
  {
    id: 'u2',
    username: 'mp_smpb',
    password: 'mp@2025',
    name: 'MP State Medicinal Plants Board',
    role: 'state',           // sees only their state
    state: 'Madhya Pradesh',
    email: 'smpb@mp.gov.in',
  },
  {
    id: 'u3',
    username: 'kerala_smpb',
    password: 'kl@2025',
    name: 'Kerala State Medicinal Plants Board',
    role: 'state',
    state: 'Kerala',
    email: 'smpb@kerala.gov.in',
  },
  {
    id: 'u4',
    username: 'uk_smpb',
    password: 'uk@2025',
    name: 'Uttarakhand State Medicinal Plants Board',
    role: 'state',
    state: 'Uttarakhand',
    email: 'smpb@uk.gov.in',
  },
  {
    id: 'u5',
    username: 'public',
    password: 'public',
    name: 'Public Viewer',
    role: 'viewer',          // read-only, sees all (no exports/edits)
    state: null,
    email: null,
  },
];