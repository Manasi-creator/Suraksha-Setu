// ========== MOCK DATA ==========

export interface Doctor {
  id: string;
  name: string;
  email: string;
  clinic: string;
  phone: string;
  status: "Active" | "Inactive";
  dateJoined: string;
}

export interface Patient {
  id: string;
  name: string;
  email: string;
  assignedDoctor: string;
  status: "Active" | "Inactive";
  dateJoined: string;
  age?: number;
  gender?: string;
  height?: number;
  weight?: number;
  phone?: string;
  profileCompletion?: number;
}

export interface Medicine {
  id: string;
  name: string;
  compounds: string;
  category: string;
  status: "Verified" | "Needs Review";
}

export interface FeedbackEntry {
  id: string;
  date: string;
  doctor: string;
  patient: string;
  drugsChecked: string;
  aiResult: string;
  assessment: "Correct" | "Partially Correct" | "Incorrect";
  note: string;
  status: "Pending" | "Reviewed" | "Escalated";
}

export const mockDoctors: Doctor[] = [
  { id: "d1", name: "Dr. Priya Sharma", email: "priya.sharma@ayurinteract.in", clinic: "Ayushman Ayurveda Clinic, Pune", phone: "+91-9876543210", status: "Active", dateJoined: "12 Jan 2025" },
  { id: "d2", name: "Dr. Ramesh Kulkarni", email: "ramesh.kulkarni@ayurinteract.in", clinic: "Dhanvantari Hospital, Nashik", phone: "+91-9823456781", status: "Active", dateJoined: "18 Feb 2025" },
  { id: "d3", name: "Dr. Anita Desai", email: "anita.desai@ayurinteract.in", clinic: "Sanjeevani Wellness Centre, Mumbai", phone: "+91-9712345678", status: "Inactive", dateJoined: "05 Mar 2025" },
  { id: "d4", name: "Dr. Vikram Joshi", email: "vikram.joshi@ayurinteract.in", clinic: "Nirmala Ayurvedic Hospital, Nagpur", phone: "+91-9645321098", status: "Active", dateJoined: "22 Mar 2025" },
  { id: "d5", name: "Dr. Sunita Patil", email: "sunita.patil@ayurinteract.in", clinic: "Arogya Kendra, Aurangabad", phone: "+91-9534210987", status: "Active", dateJoined: "01 Apr 2025" },
];

export const mockPatients: Patient[] = [
  { id: "p1", name: "Rajesh Mehta", email: "rajesh.mehta@gmail.com", assignedDoctor: "Dr. Priya Sharma", status: "Active", dateJoined: "15 Jan 2025", age: 58, gender: "Male", height: 168, weight: 82, phone: "+91-98765-XXXXX", profileCompletion: 85 },
  { id: "p2", name: "Kavita Nair", email: "kavita.nair@gmail.com", assignedDoctor: "Dr. Priya Sharma", status: "Active", dateJoined: "20 Jan 2025", age: 45, gender: "Female", height: 155, weight: 67, phone: "+91-97123-XXXXX", profileCompletion: 70 },
  { id: "p3", name: "Suresh Yadav", email: "suresh.yadav@gmail.com", assignedDoctor: "Dr. Ramesh Kulkarni", status: "Active", dateJoined: "25 Feb 2025" },
  { id: "p4", name: "Meena Iyer", email: "meena.iyer@gmail.com", assignedDoctor: "Dr. Ramesh Kulkarni", status: "Active", dateJoined: "28 Feb 2025" },
  { id: "p5", name: "Arjun Pawar", email: "arjun.pawar@gmail.com", assignedDoctor: "Dr. Vikram Joshi", status: "Active", dateJoined: "10 Mar 2025" },
  { id: "p6", name: "Deepa Salunke", email: "deepa.salunke@gmail.com", assignedDoctor: "Dr. Anita Desai", status: "Inactive", dateJoined: "12 Mar 2025" },
  { id: "p7", name: "Nitin Chavan", email: "nitin.chavan@gmail.com", assignedDoctor: "Dr. Sunita Patil", status: "Active", dateJoined: "05 Apr 2025" },
];

export const modernMedicines: Medicine[] = [
  { id: "m1", name: "Metformin", compounds: "Metformin Hydrochloride", category: "Biguanide / Antidiabetic", status: "Verified" },
  { id: "m2", name: "Glipizide", compounds: "Glipizide", category: "Sulfonylurea / Antidiabetic", status: "Verified" },
  { id: "m3", name: "Glibenclamide", compounds: "Glibenclamide (Glyburide)", category: "Sulfonylurea / Antidiabetic", status: "Verified" },
  { id: "m4", name: "Insulin Glargine", compounds: "Insulin Glargine (rDNA)", category: "Basal Insulin", status: "Verified" },
  { id: "m5", name: "Sitagliptin", compounds: "Sitagliptin Phosphate", category: "DPP-4 Inhibitor", status: "Verified" },
  { id: "m6", name: "Empagliflozin", compounds: "Empagliflozin", category: "SGLT-2 Inhibitor", status: "Verified" },
  { id: "m7", name: "Vildagliptin", compounds: "Vildagliptin", category: "DPP-4 Inhibitor", status: "Needs Review" },
  { id: "m8", name: "Pioglitazone", compounds: "Pioglitazone Hydrochloride", category: "Thiazolidinedione", status: "Verified" },
];

export const ayurvedicMedicines: Medicine[] = [
  { id: "a1", name: "Karela (Bitter Gourd)", compounds: "Charantin, Momordicin, Polypeptide-P", category: "Anti-hyperglycemic herb", status: "Verified" },
  { id: "a2", name: "Methi (Fenugreek)", compounds: "Trigonelline, 4-Hydroxyisoleucine, Galactomannan", category: "Anti-diabetic seed", status: "Verified" },
  { id: "a3", name: "Jamun (Java Plum)", compounds: "Jamboline, Ellagic Acid, Anthocyanins", category: "Blood sugar regulator", status: "Verified" },
  { id: "a4", name: "Gurmar (Gymnema Sylvestre)", compounds: "Gymnemic Acids, Gurmarin", category: "Sugar craving suppressant", status: "Verified" },
  { id: "a5", name: "Neem (Azadirachta Indica)", compounds: "Nimbin, Nimbidin, Quercetin", category: "Hypoglycemic herb", status: "Verified" },
  { id: "a6", name: "Vijaysar (Indian Kino Tree)", compounds: "Epicatechin, Pterosupin, Liquiritigenin", category: "Anti-diabetic wood", status: "Verified" },
  { id: "a7", name: "Madhunashini Vati", compounds: "Multi-herb compound (Karela + Jamun + Gurmar + Neem)", category: "Classical formulation", status: "Verified" },
  { id: "a8", name: "Chandraprabha Vati", compounds: "37-herb compound with Shilajit and Guggulu", category: "Classical polyherbal", status: "Needs Review" },
  { id: "a9", name: "Triphala Churna", compounds: "Haritaki, Bibhitaki, Amalaki", category: "Digestive + metabolic", status: "Verified" },
  { id: "a10", name: "Vasanta Kusumakar Ras", compounds: "Gold, Silver, Pearl + herb compounds", category: "Rasayana preparation", status: "Needs Review" },
];

export const analyticsLineData = [
  4, 6, 5, 8, 7, 12, 10, 9, 14, 13, 16, 15, 18, 20, 17, 22, 21, 19, 25, 23, 28, 26, 30, 27, 32, 29, 35, 33, 38, 42
].map((checks, i) => ({ day: i + 1, checks }));

export const analyticsPieData = [
  { name: "Safe", value: 58, color: "hsl(120, 60%, 40%)" },
  { name: "Caution", value: 29, color: "hsl(38, 92%, 50%)" },
  { name: "Avoid", value: 13, color: "hsl(0, 72%, 51%)" },
];

export const topCombinations = [
  { combo: "Metformin + Karela", count: 87 },
  { combo: "Metformin + Methi", count: 64 },
  { combo: "Glipizide + Karela", count: 52 },
  { combo: "Metformin + Gurmar", count: 48 },
  { combo: "Glibenclamide + Jamun", count: 41 },
  { combo: "Insulin + Neem", count: 35 },
];

export const doctorUsage = [
  { name: "Dr. Priya Sharma", checks: 94 },
  { name: "Dr. Ramesh Kulkarni", checks: 78 },
  { name: "Dr. Vikram Joshi", checks: 61 },
  { name: "Dr. Sunita Patil", checks: 49 },
  { name: "Dr. Anita Desai", checks: 23 },
];

export const highRiskWeekly = [
  { week: "Week 1", flags: 3 },
  { week: "Week 2", flags: 5 },
  { week: "Week 3", flags: 4 },
  { week: "Week 4", flags: 7 },
];

export const mockFeedback: FeedbackEntry[] = [
  {
    id: "f1", date: "14 Apr 2025", doctor: "Dr. Priya Sharma", patient: "Rajesh Mehta",
    drugsChecked: "Metformin 500mg + Karela Juice 200ml", aiResult: "Caution", assessment: "Incorrect",
    note: "Patient has been on this combination for 6 months with no adverse effects. Blood sugar levels are well controlled. AI seems to be over-cautious for this patient's specific dosage.",
    status: "Pending",
  },
  {
    id: "f2", date: "18 Apr 2025", doctor: "Dr. Ramesh Kulkarni", patient: "Suresh Yadav",
    drugsChecked: "Glipizide 5mg + Madhunashini Vati", aiResult: "Avoid", assessment: "Correct",
    note: "Confirmed dangerous. Patient experienced mild hypoglycemia episode. AI prediction was accurate. Discontinuing Madhunashini Vati.",
    status: "Reviewed",
  },
  {
    id: "f3", date: "22 Apr 2025", doctor: "Dr. Vikram Joshi", patient: "Arjun Pawar",
    drugsChecked: "Sitagliptin 100mg + Methi Seeds (soaked)", aiResult: "Safe", assessment: "Partially Correct",
    note: "Generally safe but AI did not flag the potential effect on kidney filtration rate for this patient who has mild CKD stage 2. Needs more nuance for patients with comorbidities.",
    status: "Escalated",
  },
];

// Patient-specific mock medications
export const patientMedications: Record<string, { modern: any[]; ayurvedic: any[] }> = {
  p1: {
    modern: [{ medicine: "Metformin", dosage: "500mg", frequency: "Twice daily", timing: ["Post-breakfast", "Post-dinner"], notes: "" }],
    ayurvedic: [{ medicine: "Karela (Bitter Gourd)", dosage: "200ml", frequency: "Once daily", timing: ["Pre-breakfast"], notes: "Juice form" }],
  },
  p2: {
    modern: [{ medicine: "Glipizide", dosage: "5mg", frequency: "Once daily", timing: ["Pre-breakfast"], notes: "" }],
    ayurvedic: [{ medicine: "Methi (Fenugreek)", dosage: "10g", frequency: "Once daily", timing: ["Pre-breakfast"], notes: "Soaked seeds" }],
  },
};

export const rajeshHistory = [
  { date: "20 Apr 2025", modernDrug: "Metformin 500mg", ayurvedic: "Karela Juice", result: "Caution" as const, checkedBy: "Dr. Priya Sharma" },
  { date: "15 Mar 2025", modernDrug: "Metformin 500mg", ayurvedic: "Methi Seeds", result: "Safe" as const, checkedBy: "Dr. Priya Sharma" },
  { date: "02 Feb 2025", modernDrug: "Metformin 500mg", ayurvedic: "Madhunashini Vati", result: "Avoid" as const, checkedBy: "Dr. Priya Sharma" },
];

export const rajeshAlerts = [
  { id: "al1", severity: "High Risk" as const, message: "Avoid Madhunashini Vati with current Metformin prescription — risk of severe hypoglycemia. Discontinue immediately.", sentBy: "Dr. Priya Sharma", date: "02 Feb 2025", status: "Read" as const },
  { id: "al2", severity: "Caution" as const, message: "Monitor blood sugar daily when consuming Karela juice. Keep dosage below 150ml per serving.", sentBy: "AI System", date: "20 Apr 2025", status: "Unread" as const },
  { id: "al3", severity: "Info" as const, message: "Methi seeds combination with Metformin is generally safe. Continue current regimen.", sentBy: "Dr. Priya Sharma", date: "15 Mar 2025", status: "Read" as const },
];

export const rajeshReports = [
  { id: "r1", title: "Interaction Check Report — Metformin + Karela", date: "20 Apr 2025", severity: "Caution" },
  { id: "r2", title: "Interaction Check Report — Metformin + Madhunashini Vati", date: "02 Feb 2025", severity: "Avoid" },
];
