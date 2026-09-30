export type CompanyLogo = { name: string; src: string };

// Full-colour wordmarks. Sourced from Wikimedia Commons and each company's
// own site; trimmed to their edges so every logo sits at the same height.
export const companyLogos: Record<string, CompanyLogo> = {
  epigamia: { name: 'Epigamia', src: '/logos/epigamia.png' },
  colgate: { name: 'Colgate', src: '/logos/colgate.svg' },
  'stable-money': { name: 'Stable Money', src: '/logos/stable-money.svg' },
  decathlon: { name: 'Decathlon', src: '/logos/decathlon.svg' },
  cashfree: { name: 'Cashfree', src: '/logos/cashfree.svg' },
  lightrock: { name: 'Lightrock', src: '/logos/lightrock.svg' },
  bcg: { name: 'BCG', src: '/logos/bcg.svg' },
  mckinsey: { name: 'McKinsey & Company', src: '/logos/mckinsey.svg' },
  toddle: { name: 'Toddle', src: '/logos/toddle.svg' },
  sequoia: { name: 'Sequoia Capital', src: '/logos/sequoia.svg' },
  blinkit: { name: 'Blinkit', src: '/logos/blinkit.svg' },
  paypal: { name: 'PayPal', src: '/logos/paypal.svg' },
  razorpay: { name: 'Razorpay', src: '/logos/razorpay.svg' },
  zomato: { name: 'Zomato', src: '/logos/zomato.svg' },
  flipkart: { name: 'Flipkart', src: '/logos/flipkart.svg' },
  amazon: { name: 'Amazon', src: '/logos/amazon.svg' },
  aspora: { name: 'Aspora', src: '/logos/aspora.png' },
  bain: { name: 'Bain & Company', src: '/logos/bain.svg' },
  deutschebank: { name: 'Deutsche Bank', src: '/logos/deutschebank.svg' },
  jpmorgan: { name: 'J.P. Morgan', src: '/logos/jpmorgan.svg' },
  mars: { name: 'Mars', src: '/logos/mars.svg' },
  pwc: { name: 'PwC', src: '/logos/pwc.svg' },
  accenture: { name: 'Accenture', src: '/logos/accenture.svg' },
  iimb: { name: 'IIM Bangalore', src: '/logos/iimb.png' },
};
