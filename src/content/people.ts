export type Person = { name: string; role: string };

export type FacultyMember = Person & {
  /** Portrait in /public/faculty. Absent until a photo is supplied. */
  photo?: string;
  /** The company whose logo the card shows (the first named in `role`), a key of `companyLogos`. */
  companies: string[];
};

// Section 10 content, from "SSB Website vF _ Sep'26", slide 13.
// The slide's "Add:" notes are merged in at the positions it names.

export const mentors: Person[] = [
  { name: 'Deepinder Goyal', role: 'Co-founder, Zomato' },
  { name: 'Binny Bansal', role: 'Co-founder, Flipkart' },
  { name: 'Vijay Shekhar Sharma', role: 'MD, Paytm' },
  { name: 'Kunal Shah', role: 'Founder, CRED' },
  { name: 'Rajan Anandan', role: 'MD, Peak XV' },
];

export const faculty: FacultyMember[] = [
  { name: 'Siddharth Menon', role: 'Ex-CMO, Epigamia/Colgate', photo: 'siddharth-menon', companies: ['epigamia'] },
  // Added after Siddharth Menon
  { name: 'Saurabh Jain', role: 'Co-Founder, Stable Money', photo: 'saurabh-jain', companies: ['stable-money'] },
  { name: 'Gautham G.', role: 'CMO, Decathlon Sports India', companies: ['decathlon'] },
  { name: 'Akash Sinha', role: 'CEO & Co-Founder, Cashfree', photo: 'akash-sinha', companies: ['cashfree'] },
  { name: 'Divya Venkataraghavan', role: 'Principal, LightRock', companies: ['lightrock'] },
  { name: 'Puneet', role: 'Partner, BCG', photo: 'puneet', companies: ['bcg'] },
  { name: 'Dhron Kanish', role: 'Associate Partner, McKinsey', photo: 'dhron-kanish', companies: ['mckinsey'] },
  { name: 'Sidhant Goyal', role: 'Toddle; Ex-Sequoia Capital', photo: 'sidhant-goyal', companies: ['toddle'] },
  { name: 'Jacob Singh', role: 'Ex-CTO, Blinkit', photo: 'jacob-singh', companies: ['blinkit'] },
  // Existing list
  { name: 'Malthi SS', role: 'Ex-Product Director, PayPal', photo: 'malthi-ss', companies: ['paypal'] },
  { name: 'Kanishk Mehta', role: 'Sr. Product Director, Razorpay', photo: 'kanishk-mehta', companies: ['razorpay'] },
  { name: 'Saurabh Sengupta', role: 'Ex-SVP Sales, Zomato', photo: 'saurabh-sengupta', companies: ['zomato'] },
  { name: 'Gaurav Dadhich', role: 'Founder, Ex-Flipkart/Razorpay/Amazon', photo: 'gaurav-dadhich', companies: ['flipkart'] },
  { name: 'Sudarshan Tapuriah', role: "Founders' Office, Aspora, Ex-Bain", companies: ['aspora'] },
  { name: 'Amit Puniyani', role: 'Ex-VP, Deutsche Bank/J.P. Morgan', photo: 'amit-puniyani', companies: ['deutschebank'] },
  { name: 'Sandeep Das', role: 'Ex-Global Lead, Mars/PwC/Accenture', photo: 'sandeep-das', companies: ['mars'] },
  { name: 'Narahari Hansoge', role: 'IIM Faculty, PhD IIM-B', photo: 'narahari-hansoge', companies: ['iimb'] },
  { name: 'Vatsal Sanghvi', role: 'Founder, Ex-Flipkart', photo: 'vatsal-sanghvi', companies: ['flipkart'] },
];

export const foundingTeam: Person[] = [
  { name: 'Anshuman Singh', role: 'Co-founder, Ex-Meta' },
  { name: 'Abhimanyu Saxena', role: 'Co-founder, Ex-Fab.com' },
  { name: 'Bhavik Rathod', role: 'Founding Leader, Uber India' },
  { name: 'Vidit Jain', role: 'SVP, Ex-McKinsey/ISB' },
  // Added after Vidit Jain
  {
    name: 'Sucheta Mahapatra',
    role: 'VP Business, SSB - MD India, Branch International | Ex-Principal, Bain | Ex-VP, Airtel',
  },
  {
    name: 'Manish Pansari',
    role: 'Director of Business Operations, SSB - CXO & Head of Ops, Myntra | Principal, A.T. Kearney',
  },
  // Existing list
  { name: 'Adhiraj Arora', role: 'Program Director, Ex-BCG, ISB' },
  { name: 'Rahul Karthikeyan', role: 'CMO, Scaler, Ex-upGrad' },
  { name: 'Ratnakar Reddy', role: 'Enterprise Head, Ex-Google/Microsoft' },
  { name: 'Amar Srivastava', role: 'CEO, Scaler Online Business' },
];
