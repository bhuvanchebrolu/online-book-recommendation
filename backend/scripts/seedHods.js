import "dotenv/config";
import User from "../models/User.js";

// department code must match the CHECK constraint exactly
const departments = [
  { name: "Dr. P. Gopalakrishnan",   department: "ARCH"  },
  { name: "Dr. S. Jayalekshmi",      department: "CIVIL" },
  { name: "Dr. G. Arthanareeswaran", department: "CHL"   },
  { name: "Dr. A. Sreekanth",        department: "CHY"   },
  { name: "Dr. Kunwar Singh",        department: "CSE"   },
  { name: "Dr. S. Domnic",           department: "CA"    },
  { name: "Dr. Rajeswari Sridhar",   department: "CSG"   },
  { name: "Dr. Sishaj P Simon",      department: "EEE"   },
  { name: "Dr. R. Pandeeswari",      department: "ECE"   },
  { name: "Dr. Muthukumar K",        department: "DEE"   },
  { name: "Dr. R. Murugesan",        department: "HSS"   },
  { name: "Dr. K. Srinivasan",       department: "ICE"   },
  { name: "Dr. S. Suresh",           department: "MECH"  },
  { name: "Dr. N. Ramesh Babu",      department: "MET"   },
  { name: "Dr. P. Sridevi",          department: "MBA"   },
  { name: "Dr. V. Ravichandran",     department: "MATHS" },
  { name: "Dr. R. Nagalakshmi",      department: "PHY"   },
  { name: "Dr. P. Parthiban",        department: "PROD"  },
  { name: "Dr. A.K. Bakthavatsalam", department: "TP"    },
  { name: "Dr. S. A. Senthil Kumar", department: "EMD"   },
];

async function seedHods() {
  console.log("Seeding HOD accounts...\n");

  for (const dept of departments) {
    const code = dept.department.toLowerCase();
    const email = `hod${code}@nitt.edu`;
    const password = `${dept.department}@123`;

    try {
      const existing = await User.findByEmail(email);
      if (existing) {
        console.log(`⏭  Skipped (already exists): ${email}`);
        continue;
      }

      await User.create({
        name: dept.name,
        email,
        password,
        role: "hod",
        department: dept.department,
      });

      console.log(`✅ Created: ${email} | password: ${password} | dept: ${dept.department}`);
    } catch (err) {
      console.error(`❌ Failed for ${email}:`, err.message);
    }
  }

  console.log("\nDone seeding HOD accounts.");
  process.exit(0);
}

seedHods();