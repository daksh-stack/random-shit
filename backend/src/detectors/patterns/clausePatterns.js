module.exports = {
  employmentBond: {
    keywords: [
      'employment bond',
      'service bond',
      'training bond',
      'liquidated damages',
      'bond amount',
      'recovery of training',
      'service agreement period',
    ],
    patterns: [
      /\b(?:employment|service|training)\s+bond\b/gi,
      /\b(?:serve|serving)\s+(?:a\s+)?(?:mandatory|minimum)\s+(?:period|term)\s+of\s+(\d+)\s*(?:year|month)/gi,
      /\bliquidated\s+damages\b/gi,
      /\brecovery\s+of\s+(?:training\s+)?costs?\b/gi,
    ],
  },

  noticePeriod: {
    keywords: [
      'notice period',
      'written notice',
      'days notice',
      'months notice',
      'prior notice',
    ],
    patterns: [
      /\bnotice\s+period\s+(?:of\s+)?(\d+)\s*(?:days?|months?|years?)\b/gi,
      /\b(\d+)\s*(?:calendar\s+)?(?:days?|months?)\s+(?:of\s+)?(?:prior\s+)?(?:written\s+)?notice\b/gi,
      /\b(?:ninety|sixty|90|60)\s+days?\s+notice\b/gi,
    ],
  },

  ipOwnership: {
    keywords: [
      'intellectual property',
      'assign all inventions',
      'work for hire',
      'sole property',
      'proprietary rights',
      'inventions',
    ],
    patterns: [
      /\b(?:all\s+)?(?:intellectual\s+property|inventions?|works?)\s+(?:shall\s+)?(?:be\s+)?(?:the\s+)?(?:sole\s+)?(?:property|owned)\s+of\b/gi,
      /\bwork(?:s)?\s+for\s+hire\b/gi,
      /\bassign(?:s|ed|ment)?\s+(?:all\s+)?(?:rights?|inventions?|ip)\b/gi,
    ],
  },

  confidentiality: {
    keywords: [
      'confidential information',
      'non-disclosure',
      'perpetual confidentiality',
      'trade secrets',
    ],
    patterns: [
      /\bperpetual(?:ly)?\s+confidential\b/gi,
      /\b(?:all|any)\s+information\s+(?:is|shall\s+be)\s+confidential\b/gi,
      /\bnon[- ]?disclosure\b/gi,
    ],
  },

  terminationWithoutNotice: {
    keywords: [
      'terminate at will',
      'without notice',
      'immediate termination',
      'without cause',
    ],
    patterns: [
      /\bterminat(?:e|ion)\s+(?:at\s+)?(?:any\s+time|will)\b/gi,
      /\bwithout\s+(?:prior\s+)?(?:written\s+)?notice\b/gi,
      /\bimmediate(?:ly)?\s+terminat(?:e|ion)\b/gi,
      /\bwithout\s+cause\b/gi,
    ],
  },

  arbitration: {
    keywords: [
      'binding arbitration',
      'arbitration',
      'waive jury',
      'dispute resolution',
    ],
    patterns: [
      /\b(?:binding\s+)?arbitration\b/gi,
      /\bwaive(?:s|d)?\s+(?:the\s+)?right\s+to\s+(?:a\s+)?(?:jury\s+trial|class\s+action)\b/gi,
    ],
  },

  exclusivity: {
    keywords: [
      'exclusive employment',
      'outside employment',
      'moonlighting',
      'secondary employment',
      'non-compete',
    ],
    patterns: [
      /\bexclusive\s+employment\b/gi,
      /\b(?:no|not)\s+(?:engage|permitted)\s+in\s+(?:any\s+)?(?:other\s+)?(?:business|employment|work)\b/gi,
      /\bnon[- ]?compete\b/gi,
      /\bmoonlight(?:ing)?\b/gi,
    ],
  },

  overtime: {
    keywords: [
      'overtime',
      'additional compensation',
      'as required',
      'extended hours',
    ],
    patterns: [
      /\b(?:overtime|extra\s+hours)\s+(?:without|no)\s+(?:additional\s+)?(?:pay|compensation)\b/gi,
      /\b(?:as|when)\s+required\s+by\s+(?:the\s+)?(?:company|employer|business)\b/gi,
      /\bwithout\s+additional\s+compensation\b/gi,
    ],
  },

  vagueCompensation: {
    keywords: [
      'as per company policy',
      'subject to revision',
      'at company discretion',
      'variable pay',
      'to be determined',
    ],
    patterns: [
      /\b(?:as\s+per|per)\s+company\s+policy\b/gi,
      /\b(?:subject\s+to|at)\s+(?:the\s+)?(?:company(?:'s)?|employer(?:'s)?)\s+discretion\b/gi,
      /\b(?:salary|compensation|remuneration)\s+(?:may|shall)\s+be\s+revised\b/gi,
      /\bto\s+be\s+determined\b/gi,
    ],
  },

  unpaidWork: {
    keywords: [
      'unpaid internship',
      'without stipend',
      'no compensation',
      'voluntary',
      'unremunerated',
    ],
    patterns: [
      /\bunpaid\s+(?:internship|work|training)\b/gi,
      /\bwithout\s+(?:any\s+)?(?:stipend|compensation|remuneration|salary)\b/gi,
      /\bno\s+(?:salary|compensation|remuneration)\s+(?:shall\s+be|will\s+be)\s+paid\b/gi,
    ],
  },

  rental: {
    keywords: [
      'security deposit',
      'lock-in',
      'lock in period',
      'maintenance charges',
      'penalty',
    ],
    patterns: [
      /\b(?:non[- ]?refundable|forfeiture\s+of)\s+(?:security\s+)?deposit\b/gi,
      /\block[- ]?in\s+period\b/gi,
      /\b(?:penalty|penal)\s+(?:of|charges?)\b/gi,
      /\bmaintenance\s+(?:charges?|fees?)\s+(?:shall\s+be\s+)?(?:borne|paid)\s+by\s+(?:the\s+)?tenant\b/gi,
    ],
  },
};
