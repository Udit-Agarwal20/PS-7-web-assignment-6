const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Product = require("./models/Product");
const Supplier = require("./models/Supplier");

dotenv.config();

const sampleProducts = [
  {
    sku: "NB-CLASSIC",
    name: "Classic Ruled Notebook",
    category: "Stationery",
    unit: "pcs",
    costPrice: 45,
    sellingPrice: 70,
    openingStock: 50,
    currentStock: 50,
    reorderLevel: 15,
  },
  {
    sku: "PEN-GEL-BLU",
    name: "Blue Gel Pen (Pack of 5)",
    category: "Writing",
    unit: "pack",
    costPrice: 60,
    sellingPrice: 95,
    openingStock: 40,
    currentStock: 40,
    reorderLevel: 10,
  },
  {
    sku: "PNC-HB-WOOD",
    name: "HB Wooden Pencils (Box of 10)",
    category: "Writing",
    unit: "box",
    costPrice: 35,
    sellingPrice: 60,
    openingStock: 4,
    currentStock: 4,
    reorderLevel: 8,
  },
  {
    sku: "BTL-SS-750",
    name: "Stainless Steel Water Bottle 750ml",
    category: "Drinkware",
    unit: "pcs",
    costPrice: 220,
    sellingPrice: 380,
    openingStock: 12,
    currentStock: 12,
    reorderLevel: 5,
  },
  {
    sku: "BPK-SCH-01",
    name: "Ergonomic School Backpack",
    category: "Bags",
    unit: "pcs",
    costPrice: 650,
    sellingPrice: 1100,
    openingStock: 3,
    currentStock: 3,
    reorderLevel: 5,
  },
  {
    sku: "CALC-SCI-FX",
    name: "Scientific Calculator FX-100",
    category: "Electronics",
    unit: "pcs",
    costPrice: 480,
    sellingPrice: 750,
    openingStock: 8,
    currentStock: 8,
    reorderLevel: 4,
  },
  {
    sku: "STP-HD-10",
    name: "Heavy Duty Desktop Stapler",
    category: "Office Supplies",
    unit: "pcs",
    costPrice: 110,
    sellingPrice: 190,
    openingStock: 15,
    currentStock: 15,
    reorderLevel: 6,
  },
  {
    sku: "MRK-PERM-BLK",
    name: "Permanent Black Marker",
    category: "Writing",
    unit: "pcs",
    costPrice: 18,
    sellingPrice: 30,
    openingStock: 2,
    currentStock: 2,
    reorderLevel: 10,
  },
  {
    sku: "FLDR-DOC-A4",
    name: "A4 Plastic Document Folder",
    category: "Filing",
    unit: "pcs",
    costPrice: 25,
    sellingPrice: 45,
    openingStock: 60,
    currentStock: 60,
    reorderLevel: 20,
  },
  {
    sku: "GLUE-STK-25",
    name: "Adhesive Glue Stick 25g",
    category: "Craft Supplies",
    unit: "pcs",
    costPrice: 20,
    sellingPrice: 35,
    openingStock: 25,
    currentStock: 25,
    reorderLevel: 8,
  },
];

const sampleSuppliers = [
  {
    name: "Apex Office Supplies",
    phone: "9876543210",
    city: "Mumbai",
  },
  {
    name: "National Stationers Ltd",
    phone: "9812345678",
    city: "Delhi",
  },
];

const seedDatabase = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI is not defined in environment variables");
    }

    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB for seeding...");

    let suppliersCreated = 0;
    for (const sup of sampleSuppliers) {
      const existing = await Supplier.findOne({ name: sup.name });
      if (!existing) {
        await new Supplier(sup).save();
        suppliersCreated++;
      }
    }
    console.log(`Suppliers: ${suppliersCreated} new records added.`);

    let productsCreated = 0;
    for (const prod of sampleProducts) {
      const existing = await Product.findOne({ sku: prod.sku });
      if (!existing) {
        await new Product(prod).save();
        productsCreated++;
      }
    }
    console.log(`Products: ${productsCreated} new records added.`);

    console.log("Database seeding completed successfully.");
    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error("Seeding error:", error.message);
    process.exit(1);
  }
};

if (require.main === module) {
  seedDatabase();
}

module.exports = { seedDatabase, sampleProducts, sampleSuppliers };
