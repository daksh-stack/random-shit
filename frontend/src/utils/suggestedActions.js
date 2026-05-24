const ACTION_MAP = {
  employment_bond: 'Ask whether the bond applies during probation and what happens if you leave early.',
  notice_period: 'Confirm notice period length in writing and whether it changes after probation.',
  ip_ownership: 'Clarify what work is covered and whether personal side projects are excluded.',
  confidentiality: 'Ask how long confidentiality lasts after you leave and what counts as confidential.',
  termination_without_notice: 'Ask under what conditions they can end the agreement without notice or pay.',
  arbitration: 'Ask whether you can opt out of mandatory arbitration or choose jurisdiction.',
  exclusivity: 'Confirm whether freelance or part-time work is allowed outside this role.',
  overtime: 'Ask how overtime is tracked, approved, and compensated.',
  vague_compensation: 'Request a fixed salary breakdown and when revisions can happen.',
  unpaid_work: 'Confirm pay amount, payment schedule, and whether the role is paid at all.',
  rental_terms: 'Clarify deposit refund rules, lock-in period, and maintenance responsibilities.',
};

const DEFAULT_ACTIONS = [
  'Read the full document before signing — this scan highlights excerpts only.',
  'Ask for unclear clauses to be explained in writing by HR, the landlord, or the client.',
  'Negotiate changes to clauses that feel one-sided before you commit.',
];

export function buildSuggestedActions(risks = []) {
  const actions = [];
  const seen = new Set();

  for (const risk of risks) {
    const action = ACTION_MAP[risk.type];
    if (action && !seen.has(action)) {
      seen.add(action);
      actions.push(action);
    }
  }

  for (const action of DEFAULT_ACTIONS) {
    if (actions.length >= 6) break;
    if (!seen.has(action)) {
      seen.add(action);
      actions.push(action);
    }
  }

  return actions.slice(0, 6);
}
