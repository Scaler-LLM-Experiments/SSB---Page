export type Person = { name: string; role: string };

export type FacultyMember = Person & {
  /** Portrait in /public/faculty. Absent until a photo is supplied. */
  photo?: string;
  /** The company whose logo the card shows (the first named in `role`), a key of `companyLogos`. */
  companies: string[];
  /** The course they teach at SSB (the student portal's Faculty & Guests, 2026-11-20). Absent for guest
   *  speakers: their card leads with their name instead. */
  course?: string;
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
  { name: 'Siddharth Menon', role: 'Ex-CMO, Epigamia/Colgate', photo: 'siddharth-menon', companies: ['epigamia'], course: 'Ins & Outs of Retail' },
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
  { name: 'Malthi SS', role: 'Ex-Product Director, PayPal', photo: 'malthi-ss', companies: ['paypal'], course: 'Product Strategy' },
  { name: 'Kanishk Mehta', role: 'Sr. Product Director, Razorpay', photo: 'kanishk-mehta', companies: ['razorpay'], course: 'Intro to Product Management' },
  { name: 'Saurabh Sengupta', role: 'Ex-SVP Sales, Zomato', photo: 'saurabh-sengupta', companies: ['zomato'] },
  { name: 'Gaurav Dadhich', role: 'Founder, Ex-Flipkart/Razorpay/Amazon', photo: 'gaurav-dadhich', companies: ['flipkart'], course: 'Product Strategy & Execution' },
  // (2026-11-20) his LinkedIn photo and current role
  { name: 'Sudarshan Tapuriah', role: 'Head of Finance & IR, Aspora, Ex-Bain', photo: 'sudarshan-tapuriah', companies: ['aspora'], course: 'Corporate Strategy' },
  { name: 'Amit Puniyani', role: 'Ex-VP, Deutsche Bank/J.P. Morgan', photo: 'amit-puniyani', companies: ['deutschebank'] },
  { name: 'Sandeep Das', role: 'Ex-Global Lead, Mars/PwC/Accenture', photo: 'sandeep-das', companies: ['mars'], course: 'Business Communications' },
  { name: 'Narahari Hansoge', role: 'IIM Faculty, PhD IIM-B', photo: 'narahari-hansoge', companies: ['iimb'], course: 'Corporate Finance' },
  { name: 'Vatsal Sanghvi', role: 'Founder, Ex-Flipkart', photo: 'vatsal-sanghvi', companies: ['flipkart'], course: 'AI Applications' },
  // (2026-11-20, the user's ask: the faculty list from the student portal's Faculty & Guests, SSB 2024
  // and 2025, with the course each teaches) roles and photos from their LinkedIn profiles, read that
  // day. Their academic posts at other business schools are described, not named. Left out for now:
  // Garima Chaklader, Divij Bajaj, Anurag Dugar and Saurabh Kango (no LinkedIn photo that crops to a
  // portrait), and those with no LinkedIn on the portal.
  { name: 'Abhishek Srivastava', role: 'CEO & Co-founder, The CareerTrek Company, Ex-Apple', photo: 'abhishek-srivastava', companies: [], course: 'Business Communications' },
  { name: 'Payal Jain', role: 'Partner, Investment Banking, LoEstro Advisors', photo: 'payal-jain', companies: ['loestro'], course: 'Intro to PE & VC' },
  { name: 'Rakesh Retnakaran', role: 'Lead AI PM, Glance, Ex-Zynga', photo: 'rakesh-retnakaran', companies: ['glance'], course: 'Product Metrics & Analytics' },
  { name: 'Pranay Jindal', role: 'Founder & CEO, Olive Arc, Ex-Airtel', photo: 'pranay-jindal', companies: ['airtel'], course: 'Business of Online Marketplaces' },
  { name: 'Akash Krishnan', role: 'Director Analyst, Gartner, PhD IIM Calcutta', photo: 'akash-krishnan', companies: [], course: 'Managerial Economics' },
  { name: 'Rishabh Ladha', role: 'Head of GTM, EPIC, Sales Professor & Coach', photo: 'rishabh-ladha', companies: [], course: 'Modern B2B Sales & Marketing' },
  { name: 'Shruthi Reddy', role: 'Sr. Growth Marketing Manager, Chai Shots, Ex-Pocket FM', photo: 'shruthi-reddy', companies: [], course: 'Digital Marketing' },
  { name: 'Suraaj Hasija', role: 'Manager, AI CoE, Mastercard', photo: 'suraaj-hasija', companies: [], course: 'Data Visualization & Insights' },
  { name: 'Pulkit Aneja', role: 'Data Scientist, Ex-Amazon/Meesho', photo: 'pulkit-aneja', companies: ['amazon'], course: 'Business Statistics' },
  { name: 'Amardeep Singh', role: 'Business Modelling & Strategy, Ex-KPMG', photo: 'amardeep-singh', companies: ['kpmg'], course: 'Excel Fundamentals' },
  { name: 'Rahul Mohandas', role: 'Product Leader, Adjunct Faculty, BITS Pilani', photo: 'rahul-mohandas', companies: [], course: 'Plan & Build an MVP' },
  { name: 'Dr. Bhupesh Manoharan', role: 'Dean & Associate Professor, Marketing', photo: 'bhupesh-manoharan', companies: [], course: 'Marketing Strategies' },
  { name: 'Dr. Ray Titus', role: 'Marketing Professor & Best-selling Author', photo: 'ray-titus', companies: [], course: 'Consumer Behaviour' },
  { name: 'Dr. Vipin Sreekumar', role: 'Associate Professor, Strategy & Entrepreneurship', photo: 'vipin-sreekumar', companies: [], course: 'Business Strategy' },
  { name: 'Dr. Subhonil Ghoshal', role: 'Ex-VP, Procurement & Supply Chain Practice', photo: 'subhonil-ghoshal', companies: [], course: 'Operations & Supply Chain' },
  { name: 'Dr. Shyam Sadasivan', role: 'Leadership Coach, Educator & Author', photo: 'shyam-sadasivan', companies: [], course: 'Manage & Lead Teams' },
  { name: 'Dr. Subhasis Mishra', role: 'Data Scientist', photo: 'subhasis-mishra', companies: [], course: 'Operations Management' },
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
