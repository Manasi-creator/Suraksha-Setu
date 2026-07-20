import bcrypt from "bcryptjs";
import User from "../models/User";
import PatientProfile from "../models/PatientProfile";
import Medicine from "../models/Medicine";
import MedicationRecord from "../models/MedicationRecord";
import Alert from "../models/Alert";
import Feedback from "../models/Feedback";

export const seedDatabase = async () => {
  try {
    // Check if seeding is already done
    const userCount = await User.countDocuments();
    if (userCount > 0) {
      console.log("Database already populated. Skipping seeding.");
      return;
    }

    console.log("Seeding database with default mock data...");

    // 1. Create Hashed Passwords
    const salt = await bcrypt.genSalt(10);
    const adminPassword = await bcrypt.hash("admin123", salt);
    const doctorPassword = await bcrypt.hash("doctor123", salt);
    const patientPassword = await bcrypt.hash("patient123", salt);

    // 2. Seed Admin
    const adminUser = new User({
      name: "System Admin",
      email: "admin@ayurinteract.in",
      passwordHash: adminPassword,
      role: "admin"
    });
    await adminUser.save();

    // 3. Seed Doctors
    const mockDoctors = [
      { name: "Dr. Priya Sharma", email: "priya.sharma@ayurinteract.in", role: "doctor" as const },
      { name: "Dr. Ramesh Kulkarni", email: "ramesh.kulkarni@ayurinteract.in", role: "doctor" as const },
      { name: "Dr. Vikram Joshi", email: "vikram.joshi@ayurinteract.in", role: "doctor" as const },
      { name: "Dr. Sunita Patil", email: "sunita.patil@ayurinteract.in", role: "doctor" as const },
      { name: "Dr. Anita Desai", email: "anita.desai@ayurinteract.in", role: "doctor" as const }
    ];

    const seededDoctors = [];
    for (const doc of mockDoctors) {
      const docUser = new User({
        name: doc.name,
        email: doc.email,
        passwordHash: doctorPassword,
        role: "doctor"
      });
      await docUser.save();
      seededDoctors.push(docUser);
    }

    // 4. Seed Patients
    const mockPatients = [
      { name: "Rajesh Mehta", email: "rajesh.mehta@gmail.com", age: 58, gender: "Male", height: 168, weight: 82, assignedDoctor: "Dr. Priya Sharma", profileCompletion: 85 },
      { name: "Kavita Nair", email: "kavita.nair@gmail.com", age: 45, gender: "Female", height: 155, weight: 67, assignedDoctor: "Dr. Priya Sharma", profileCompletion: 70 },
      { name: "Suresh Yadav", email: "suresh.yadav@gmail.com", assignedDoctor: "Dr. Ramesh Kulkarni", profileCompletion: 50 },
      { name: "Meena Iyer", email: "meena.iyer@gmail.com", assignedDoctor: "Dr. Ramesh Kulkarni", profileCompletion: 50 },
      { name: "Arjun Pawar", email: "arjun.pawar@gmail.com", assignedDoctor: "Dr. Vikram Joshi", profileCompletion: 50 },
      { name: "Deepa Salunke", email: "deepa.salunke@gmail.com", assignedDoctor: "Dr. Anita Desai", status: "Inactive" as const, profileCompletion: 50 },
      { name: "Nitin Chavan", email: "nitin.chavan@gmail.com", assignedDoctor: "Dr. Sunita Patil", profileCompletion: 50 }
    ];

    const seededPatients: Record<string, any> = {};
    for (const pat of mockPatients) {
      const patUser = new User({
        name: pat.name,
        email: pat.email,
        passwordHash: patientPassword,
        role: "patient"
      });
      await patUser.save();
      
      const patProfile = new PatientProfile({
        user: patUser._id,
        age: pat.age,
        gender: pat.gender,
        height: pat.height,
        weight: pat.weight,
        assignedDoctor: pat.assignedDoctor,
        profileCompletion: pat.profileCompletion,
        status: pat.status || "Active"
      });
      await patProfile.save();

      seededPatients[pat.name] = patUser;
    }

    // 5. Seed Medicines
    const modernMedicines = [
      { name: "Metformin", compounds: "Metformin Hydrochloride", category: "Biguanide / Antidiabetic", type: "modern" as const, status: "Verified" as const },
      { name: "Glipizide", compounds: "Glipizide", category: "Sulfonylurea / Antidiabetic", type: "modern" as const, status: "Verified" as const },
      { name: "Glibenclamide", compounds: "Glibenclamide (Glyburide)", category: "Sulfonylurea / Antidiabetic", type: "modern" as const, status: "Verified" as const },
      { name: "Insulin Glargine", compounds: "Insulin Glargine (rDNA)", category: "Basal Insulin", type: "modern" as const, status: "Verified" as const },
      { name: "Sitagliptin", compounds: "Sitagliptin Phosphate", category: "DPP-4 Inhibitor", type: "modern" as const, status: "Verified" as const },
      { name: "Empagliflozin", compounds: "Empagliflozin", category: "SGLT-2 Inhibitor", type: "modern" as const, status: "Verified" as const },
      { name: "Vildagliptin", compounds: "Vildagliptin", category: "DPP-4 Inhibitor", type: "modern" as const, status: "Needs Review" as const },
      { name: "Pioglitazone", compounds: "Pioglitazone Hydrochloride", category: "Thiazolidinedione", type: "modern" as const, status: "Verified" as const }
    ];

    const ayurvedicMedicines = [
      { name: "Karela (Bitter Gourd)", compounds: "Charantin, Momordicin, Polypeptide-P", category: "Anti-hyperglycemic herb", type: "ayurvedic" as const, status: "Verified" as const },
      { name: "Methi (Fenugreek)", compounds: "Trigonelline, 4-Hydroxyisoleucine, Galactomannan", category: "Anti-diabetic seed", type: "ayurvedic" as const, status: "Verified" as const },
      { name: "Jamun (Java Plum)", compounds: "Jamboline, Ellagic Acid, Anthocyanins", category: "Blood sugar regulator", type: "ayurvedic" as const, status: "Verified" as const },
      { name: "Gurmar (Gymnema Sylvestre)", compounds: "Gymnemic Acids, Gurmarin", category: "Sugar craving suppressant", type: "ayurvedic" as const, status: "Verified" as const },
      { name: "Neem (Azadirachta Indica)", compounds: "Nimbin, Nimbidin, Quercetin", category: "Hypoglycemic herb", type: "ayurvedic" as const, status: "Verified" as const },
      { name: "Vijaysar (Indian Kino Tree)", compounds: "Epicatechin, Pterosupin, Liquiritigenin", category: "Anti-diabetic wood", type: "ayurvedic" as const, status: "Verified" as const },
      { name: "Madhunashini Vati", compounds: "Multi-herb compound (Karela + Jamun + Gurmar + Neem)", category: "Classical formulation", type: "ayurvedic" as const, status: "Verified" as const },
      { name: "Chandraprabha Vati", compounds: "37-herb compound with Shilajit and Guggulu", category: "Classical polyherbal", type: "ayurvedic" as const, status: "Needs Review" as const },
      { name: "Triphala Churna", compounds: "Haritaki, Bibhitaki, Amalaki", category: "Digestive + metabolic", type: "ayurvedic" as const, status: "Verified" as const },
      { name: "Vasanta Kusumakar Ras", compounds: "Gold, Silver, Pearl + herb compounds", category: "Rasayana preparation", type: "ayurvedic" as const, status: "Needs Review" as const }
    ];

    for (const med of [...modernMedicines, ...ayurvedicMedicines]) {
      const medicine = new Medicine(med);
      await medicine.save();
    }

    // 6. Seed Prescriptions (MedicationRecords)
    const rajeshUser = seededPatients["Rajesh Mehta"];
    if (rajeshUser) {
      const rx1 = new MedicationRecord({
        patient: rajeshUser._id,
        type: "modern",
        medicine: "Metformin",
        dosage: "500mg",
        frequency: "Twice daily",
        timing: ["Post-breakfast", "Post-dinner"],
        notes: ""
      });
      const rx2 = new MedicationRecord({
        patient: rajeshUser._id,
        type: "ayurvedic",
        medicine: "Karela (Bitter Gourd)",
        dosage: "200ml",
        frequency: "Once daily",
        timing: ["Pre-breakfast"],
        notes: "Juice form"
      });
      await rx1.save();
      await rx2.save();
    }

    const kavitaUser = seededPatients["Kavita Nair"];
    if (kavitaUser) {
      const rx1 = new MedicationRecord({
        patient: kavitaUser._id,
        type: "modern",
        medicine: "Glipizide",
        dosage: "5mg",
        frequency: "Once daily",
        timing: ["Pre-breakfast"],
        notes: ""
      });
      const rx2 = new MedicationRecord({
        patient: kavitaUser._id,
        type: "ayurvedic",
        medicine: "Methi (Fenugreek)",
        dosage: "10g",
        frequency: "Once daily",
        timing: ["Pre-breakfast"],
        notes: "Soaked seeds"
      });
      await rx1.save();
      await rx2.save();
    }

    // 7. Seed Alerts
    if (rajeshUser) {
      const alerts = [
        { severity: "High Risk" as const, message: "Avoid Madhunashini Vati with current Metformin prescription — risk of severe hypoglycemia. Discontinue immediately.", sentBy: "Dr. Priya Sharma", status: "Read" as const, date: new Date("2025-02-02") },
        { severity: "Caution" as const, message: "Monitor blood sugar daily when consuming Karela juice. Keep dosage below 150ml per serving.", sentBy: "AI System", status: "Unread" as const, date: new Date("2025-04-20") },
        { severity: "Info" as const, message: "Methi seeds combination with Metformin is generally safe. Continue current regimen.", sentBy: "Dr. Priya Sharma", status: "Read" as const, date: new Date("2025-03-15") }
      ];

      for (const al of alerts) {
        const alert = new Alert({
          patient: rajeshUser._id,
          ...al
        });
        await alert.save();
      }
    }

    // 8. Seed Feedback
    const feedbacks = [
      {
        doctor: "Dr. Priya Sharma", patient: "Rajesh Mehta", drugsChecked: "Metformin 500mg + Karela Juice 200ml",
        aiResult: "Caution", assessment: "Incorrect" as const, note: "Patient has been on this combination for 6 months with no adverse effects. Blood sugar levels are well controlled. AI seems to be over-cautious for this patient's specific dosage.",
        status: "Pending" as const, date: new Date("2025-04-14")
      },
      {
        doctor: "Dr. Ramesh Kulkarni", patient: "Suresh Yadav", drugsChecked: "Glipizide 5mg + Madhunashini Vati",
        aiResult: "Avoid", assessment: "Correct" as const, note: "Confirmed dangerous. Patient experienced mild hypoglycemia episode. AI prediction was accurate. Discontinuing Madhunashini Vati.",
        status: "Reviewed" as const, date: new Date("2025-04-18")
      },
      {
        doctor: "Dr. Vikram Joshi", patient: "Arjun Pawar", drugsChecked: "Sitagliptin 100mg + Methi Seeds (soaked)",
        aiResult: "Safe", assessment: "Partially Correct" as const, note: "Generally safe but AI did not flag the potential effect on kidney filtration rate for this patient who has mild CKD stage 2. Needs more nuance for patients with comorbidities.",
        status: "Escalated" as const, date: new Date("2025-04-22")
      }
    ];

    for (const fb of feedbacks) {
      const feedback = new Feedback(fb);
      await feedback.save();
    }

    console.log("Database seeding completed successfully!");
  } catch (error) {
    console.error("Error during database seeding:", error);
  }
};
