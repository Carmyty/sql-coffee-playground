import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function seedIfEmpty() {
  const customerCount = await prisma.customer.count();
  if (customerCount > 0) {
    console.log(
      `coffee_chain ya tiene ${customerCount} clientes. Seed omitido para no alterar datos existentes.`
    );
    return;
  }

  const stores = await prisma.store.createManyAndReturn({
    data: [
      { name: "Origen Centro", city: "Puebla", address: "Av. Reforma 120", openedAt: new Date("2018-03-12") },
      { name: "La Taza Analco", city: "Puebla", address: "Calle 11 Sur 304", openedAt: new Date("2019-07-01") },
      { name: "Bean & Bloom", city: "CDMX", address: "Álvaro Obregón 45", openedAt: new Date("2020-11-20") },
      { name: "Café Sierra", city: "Oaxaca", address: "Macedonio Alcalá 18", openedAt: new Date("2021-05-08") },
    ],
  });

  const roles = await prisma.employeeRole.createManyAndReturn({
    data: [
      { roleName: "Barista" },
      { roleName: "Supervisor" },
      { roleName: "Cajero" },
      { roleName: "Gerente" },
      { roleName: "Almacén" },
    ],
  });

  const role = (name: string) => roles.find((r) => r.roleName === name)!.roleId;
  const store = (name: string) => stores.find((s) => s.name === name)!.storeId;

  await prisma.employee.createMany({
    data: [
      { firstName: "Lucía", lastName: "Hernández", email: "lucia.hernandez@sqlcoffee.dev", storeId: store("Origen Centro"), roleId: role("Gerente"), hiredAt: new Date("2018-04-01") },
      { firstName: "Diego", lastName: "Ramírez", email: "diego.ramirez@sqlcoffee.dev", storeId: store("Origen Centro"), roleId: role("Barista"), hiredAt: new Date("2019-02-14") },
      { firstName: "Sofía", lastName: "López", email: "sofia.lopez@sqlcoffee.dev", storeId: store("La Taza Analco"), roleId: role("Supervisor"), hiredAt: new Date("2019-08-20") },
      { firstName: "Mateo", lastName: "García", email: "mateo.garcia@sqlcoffee.dev", storeId: store("La Taza Analco"), roleId: role("Barista"), hiredAt: new Date("2020-01-10") },
      { firstName: "Valentina", lastName: "Cruz", email: "valentina.cruz@sqlcoffee.dev", storeId: store("Bean & Bloom"), roleId: role("Cajero"), hiredAt: new Date("2021-03-03") },
      { firstName: "Emiliano", lastName: "Torres", email: "emiliano.torres@sqlcoffee.dev", storeId: store("Bean & Bloom"), roleId: role("Barista"), hiredAt: new Date("2021-06-15") },
      { firstName: "Camila", lastName: "Morales", email: "camila.morales@sqlcoffee.dev", storeId: store("Café Sierra"), roleId: role("Gerente"), hiredAt: new Date("2021-05-10") },
      { firstName: "Santiago", lastName: "Vargas", email: "santiago.vargas@sqlcoffee.dev", storeId: store("Café Sierra"), roleId: role("Almacén"), hiredAt: new Date("2022-01-22") },
      { firstName: "Renata", lastName: "Ibarra", email: "renata.ibarra@sqlcoffee.dev", storeId: store("Origen Centro"), roleId: role("Cajero"), hiredAt: new Date("2022-09-01") },
      { firstName: "Joaquín", lastName: "Peña", email: "joaquin.pena@sqlcoffee.dev", storeId: store("La Taza Analco"), roleId: role("Almacén"), hiredAt: new Date("2023-04-18") },
      { firstName: "Ximena", lastName: "Navarro", email: "ximena.navarro@sqlcoffee.dev", storeId: store("Bean & Bloom"), roleId: role("Supervisor"), hiredAt: new Date("2023-08-07") },
      { firstName: "Leonardo", lastName: "Salinas", email: "leonardo.salinas@sqlcoffee.dev", storeId: store("Café Sierra"), roleId: role("Barista"), hiredAt: new Date("2024-02-12") },
    ],
  });

  const customers = await prisma.customer.createManyAndReturn({
    data: [
      { firstName: "Ana", lastName: "Martínez", email: "ana.martinez@mail.dev", phone: "2221110001", city: "Puebla" },
      { firstName: "Bruno", lastName: "Ortiz", email: "bruno.ortiz@mail.dev", phone: "2221110002", city: "Puebla" },
      { firstName: "Carla", lastName: "Reyes", email: "carla.reyes@mail.dev", phone: "5551110003", city: "CDMX" },
      { firstName: "David", lastName: "Soto", email: "david.soto@mail.dev", phone: null, city: "Oaxaca" },
      { firstName: "Elena", lastName: "Paredes", email: "elena.paredes@mail.dev", phone: "2221110005", city: "Puebla" },
      { firstName: "Felipe", lastName: "Nava", email: "felipe.nava@mail.dev", phone: "5551110006", city: "CDMX" },
      { firstName: "Gabriela", lastName: "Mena", email: "gabriela.mena@mail.dev", phone: "9511110007", city: "Oaxaca" },
      { firstName: "Hugo", lastName: "Castañeda", email: "hugo.castaneda@mail.dev", phone: null, city: "Puebla" },
      { firstName: "Inés", lastName: "Quiroz", email: "ines.quiroz@mail.dev", phone: "2221110009", city: "Puebla" },
      { firstName: "Jorge", lastName: "Delgado", email: "jorge.delgado@mail.dev", phone: "5551110010", city: "CDMX" },
      { firstName: "Karla", lastName: "Fuentes", email: "karla.fuentes@mail.dev", phone: "2221110011", city: "Puebla" },
      { firstName: "Luis", lastName: "Aguilar", email: "luis.aguilar@mail.dev", phone: "9511110012", city: "Oaxaca" },
      { firstName: "Marta", lastName: "Ríos", email: "marta.rios@mail.dev", phone: "5551110013", city: "CDMX" },
      { firstName: "Nicolás", lastName: "Baeza", email: "nicolas.baeza@mail.dev", phone: "2221110014", city: "Puebla" },
      { firstName: "Olivia", lastName: "Cano", email: "olivia.cano@mail.dev", phone: null, city: "Guadalajara" },
      { firstName: "Pablo", lastName: "Herrera", email: "pablo.herrera@mail.dev", phone: "3331110016", city: "Guadalajara" },
      { firstName: "Regina", lastName: "Molina", email: "regina.molina@mail.dev", phone: "2221110017", city: "Puebla" },
      { firstName: "Sebastián", lastName: "Lara", email: "sebastian.lara@mail.dev", phone: "5551110018", city: "CDMX" },
      { firstName: "Teresa", lastName: "Vega", email: "teresa.vega@mail.dev", phone: "9511110019", city: "Oaxaca" },
      { firstName: "Ulises", lastName: "Campos", email: "ulises.campos@mail.dev", phone: null, city: "Puebla" },
      { firstName: "Vera", lastName: "Núñez", email: "vera.nunez@mail.dev", phone: "2221110021", city: "Puebla" },
      { firstName: "Walter", lastName: "Ibarra", email: "walter.ibarra@mail.dev", phone: "5551110022", city: "CDMX" },
    ],
  });

  const categories = await prisma.menuCategory.createManyAndReturn({
    data: [
      { name: "Espresso", description: "Bebidas extraídas a presión" },
      { name: "Bebidas con leche", description: "Lattes, capuchinos y variantes" },
      { name: "Frías", description: "Cold brew, frappe y tés helados" },
      { name: "Té e infusiones", description: "Tés, matcha y tisanas" },
      { name: "Repostería", description: "Pan dulce y postres" },
      { name: "Desayunos", description: "Platos salados de la mañana" },
    ],
  });

  const cat = (name: string) => categories.find((c) => c.name === name)!.categoryId;

  const items = await prisma.menuItem.createManyAndReturn({
    data: [
      { name: "Espresso", categoryId: cat("Espresso"), price: 32, isAvailable: true, description: "Shot doble de espresso" },
      { name: "Americano", categoryId: cat("Espresso"), price: 38, isAvailable: true, description: "Espresso con agua caliente" },
      { name: "Latte", categoryId: cat("Bebidas con leche"), price: 52, isAvailable: true, description: "Espresso con leche vaporizada" },
      { name: "Cappuccino", categoryId: cat("Bebidas con leche"), price: 50, isAvailable: true, description: "Espresso, leche y espuma" },
      { name: "Mocha", categoryId: cat("Bebidas con leche"), price: 58, isAvailable: true, description: "Chocolate, espresso y leche" },
      { name: "Flat White", categoryId: cat("Bebidas con leche"), price: 54, isAvailable: true, description: "Espresso con microespuma" },
      { name: "Cold Brew", categoryId: cat("Frías"), price: 55, isAvailable: true, description: "Extracción en frío 16 horas" },
      { name: "Frappe de café", categoryId: cat("Frías"), price: 62, isAvailable: true, description: "Café, hielo y leche" },
      { name: "Limonada de café", categoryId: cat("Frías"), price: 48, isAvailable: false, description: "Edición de verano" },
      { name: "Matcha latte", categoryId: cat("Té e infusiones"), price: 60, isAvailable: true, description: "Matcha ceremonial con leche" },
      { name: "Té de jamaica", categoryId: cat("Té e infusiones"), price: 35, isAvailable: true, description: "Infusión fría o caliente" },
      { name: "Manzanilla", categoryId: cat("Té e infusiones"), price: 32, isAvailable: true, description: "Tisana relajante" },
      { name: "Croissant de mantequilla", categoryId: cat("Repostería"), price: 42, isAvailable: true, description: "Hojaldre clásico" },
      { name: "Brownie", categoryId: cat("Repostería"), price: 45, isAvailable: true, description: "Chocolate 70%" },
      { name: "Galleta de avena", categoryId: cat("Repostería"), price: 28, isAvailable: true, description: "Avena y piloncillo" },
      { name: "Pan de elote", categoryId: cat("Repostería"), price: 40, isAvailable: true, description: "Receta de la casa" },
      { name: "Avocado toast", categoryId: cat("Desayunos"), price: 85, isAvailable: true, description: "Pan de masa madre y aguacate" },
      { name: "Huevos rancheros", categoryId: cat("Desayunos"), price: 92, isAvailable: true, description: "Con salsa de chile morita" },
      { name: "Yogurt con granola", categoryId: cat("Desayunos"), price: 58, isAvailable: true, description: "Granola de la casa" },
      { name: "Edición reserva geisha", categoryId: cat("Espresso"), price: 120, isAvailable: false, description: "Lote limitado, aún no en menú activo" },
    ],
  });

  const item = (name: string) => items.find((i) => i.name === name)!.itemId;

  const options = await prisma.customizationOption.createManyAndReturn({
    data: [
      { name: "Leche de avena", extraCost: 8 },
      { name: "Leche de almendra", extraCost: 8 },
      { name: "Extra shot", extraCost: 12 },
      { name: "Jarabe vainilla", extraCost: 6 },
      { name: "Sin azúcar", extraCost: 0 },
    ],
  });

  await prisma.itemCustomization.createMany({
    data: [
      { itemId: item("Latte"), optionId: options[0].optionId },
      { itemId: item("Latte"), optionId: options[1].optionId },
      { itemId: item("Latte"), optionId: options[2].optionId },
      { itemId: item("Cappuccino"), optionId: options[0].optionId },
      { itemId: item("Mocha"), optionId: options[3].optionId },
      { itemId: item("Matcha latte"), optionId: options[0].optionId },
      { itemId: item("Cold Brew"), optionId: options[3].optionId },
    ],
  });

  const employees = await prisma.employee.findMany();
  const emp = (email: string) => employees.find((e) => e.email === email)!.employeeId;
  const cust = (email: string) => customers.find((c) => c.email === email)!.customerId;

  const orderSpecs: Array<{
    customerEmail: string | null;
    storeName: string;
    employeeEmail: string;
    date: string;
    status: string;
    lines: Array<{ item: string; qty: number }>;
    pay?: { method: string; paid: boolean };
  }> = [
    { customerEmail: "ana.martinez@mail.dev", storeName: "Origen Centro", employeeEmail: "diego.ramirez@sqlcoffee.dev", date: "2026-08-01T09:10:00Z", status: "completed", lines: [{ item: "Latte", qty: 2 }, { item: "Brownie", qty: 1 }], pay: { method: "card", paid: true } },
    { customerEmail: "bruno.ortiz@mail.dev", storeName: "La Taza Analco", employeeEmail: "mateo.garcia@sqlcoffee.dev", date: "2026-08-01T10:22:00Z", status: "completed", lines: [{ item: "Americano", qty: 1 }, { item: "Croissant de mantequilla", qty: 1 }], pay: { method: "cash", paid: true } },
    { customerEmail: "carla.reyes@mail.dev", storeName: "Bean & Bloom", employeeEmail: "emiliano.torres@sqlcoffee.dev", date: "2026-08-02T08:40:00Z", status: "completed", lines: [{ item: "Cold Brew", qty: 1 }, { item: "Avocado toast", qty: 1 }], pay: { method: "card", paid: true } },
    { customerEmail: "david.soto@mail.dev", storeName: "Café Sierra", employeeEmail: "leonardo.salinas@sqlcoffee.dev", date: "2026-08-02T11:05:00Z", status: "completed", lines: [{ item: "Espresso", qty: 2 }], pay: { method: "cash", paid: true } },
    { customerEmail: "elena.paredes@mail.dev", storeName: "Origen Centro", employeeEmail: "renata.ibarra@sqlcoffee.dev", date: "2026-08-03T09:00:00Z", status: "completed", lines: [{ item: "Mocha", qty: 1 }, { item: "Pan de elote", qty: 2 }], pay: { method: "transfer", paid: true } },
    { customerEmail: "felipe.nava@mail.dev", storeName: "Bean & Bloom", employeeEmail: "valentina.cruz@sqlcoffee.dev", date: "2026-08-03T16:18:00Z", status: "completed", lines: [{ item: "Matcha latte", qty: 2 }], pay: { method: "card", paid: true } },
    { customerEmail: "gabriela.mena@mail.dev", storeName: "Café Sierra", employeeEmail: "camila.morales@sqlcoffee.dev", date: "2026-08-04T08:12:00Z", status: "completed", lines: [{ item: "Huevos rancheros", qty: 1 }, { item: "Americano", qty: 1 }], pay: { method: "cash", paid: true } },
    { customerEmail: "ana.martinez@mail.dev", storeName: "La Taza Analco", employeeEmail: "sofia.lopez@sqlcoffee.dev", date: "2026-08-04T13:40:00Z", status: "completed", lines: [{ item: "Cappuccino", qty: 1 }, { item: "Galleta de avena", qty: 3 }], pay: { method: "card", paid: true } },
    { customerEmail: "ines.quiroz@mail.dev", storeName: "Origen Centro", employeeEmail: "diego.ramirez@sqlcoffee.dev", date: "2026-08-05T09:33:00Z", status: "completed", lines: [{ item: "Latte", qty: 1 }, { item: "Flat White", qty: 1 }], pay: { method: "card", paid: true } },
    { customerEmail: "jorge.delgado@mail.dev", storeName: "Bean & Bloom", employeeEmail: "ximena.navarro@sqlcoffee.dev", date: "2026-08-05T18:02:00Z", status: "cancelled", lines: [{ item: "Frappe de café", qty: 1 }], pay: { method: "card", paid: false } },
    { customerEmail: "karla.fuentes@mail.dev", storeName: "La Taza Analco", employeeEmail: "mateo.garcia@sqlcoffee.dev", date: "2026-08-06T10:11:00Z", status: "completed", lines: [{ item: "Té de jamaica", qty: 2 }, { item: "Yogurt con granola", qty: 1 }], pay: { method: "cash", paid: true } },
    { customerEmail: "luis.aguilar@mail.dev", storeName: "Café Sierra", employeeEmail: "santiago.vargas@sqlcoffee.dev", date: "2026-08-06T12:00:00Z", status: "completed", lines: [{ item: "Espresso", qty: 1 }, { item: "Brownie", qty: 1 }], pay: { method: "transfer", paid: true } },
    { customerEmail: "marta.rios@mail.dev", storeName: "Bean & Bloom", employeeEmail: "emiliano.torres@sqlcoffee.dev", date: "2026-08-07T09:27:00Z", status: "completed", lines: [{ item: "Latte", qty: 3 }], pay: { method: "card", paid: true } },
    { customerEmail: "nicolas.baeza@mail.dev", storeName: "Origen Centro", employeeEmail: "lucia.hernandez@sqlcoffee.dev", date: "2026-08-07T15:45:00Z", status: "preparing", lines: [{ item: "Avocado toast", qty: 1 }, { item: "Cold Brew", qty: 1 }] },
    { customerEmail: "regina.molina@mail.dev", storeName: "La Taza Analco", employeeEmail: "joaquin.pena@sqlcoffee.dev", date: "2026-08-08T08:50:00Z", status: "completed", lines: [{ item: "Americano", qty: 2 }, { item: "Pan de elote", qty: 1 }], pay: { method: "cash", paid: true } },
    { customerEmail: "sebastian.lara@mail.dev", storeName: "Bean & Bloom", employeeEmail: "valentina.cruz@sqlcoffee.dev", date: "2026-08-08T19:10:00Z", status: "completed", lines: [{ item: "Mocha", qty: 1 }, { item: "Croissant de mantequilla", qty: 2 }], pay: { method: "card", paid: true } },
    { customerEmail: "teresa.vega@mail.dev", storeName: "Café Sierra", employeeEmail: "leonardo.salinas@sqlcoffee.dev", date: "2026-08-09T09:05:00Z", status: "completed", lines: [{ item: "Matcha latte", qty: 1 }, { item: "Galleta de avena", qty: 2 }], pay: { method: "cash", paid: true } },
    { customerEmail: "ana.martinez@mail.dev", storeName: "Origen Centro", employeeEmail: "diego.ramirez@sqlcoffee.dev", date: "2026-08-10T08:15:00Z", status: "completed", lines: [{ item: "Latte", qty: 1 }, { item: "Huevos rancheros", qty: 1 }], pay: { method: "card", paid: true } },
    { customerEmail: "bruno.ortiz@mail.dev", storeName: "Origen Centro", employeeEmail: "renata.ibarra@sqlcoffee.dev", date: "2026-08-11T11:41:00Z", status: "completed", lines: [{ item: "Cappuccino", qty: 2 }], pay: { method: "card", paid: true } },
    { customerEmail: "carla.reyes@mail.dev", storeName: "Bean & Bloom", employeeEmail: "ximena.navarro@sqlcoffee.dev", date: "2026-08-12T07:55:00Z", status: "completed", lines: [{ item: "Cold Brew", qty: 2 }, { item: "Brownie", qty: 1 }], pay: { method: "transfer", paid: true } },
    { customerEmail: "elena.paredes@mail.dev", storeName: "La Taza Analco", employeeEmail: "sofia.lopez@sqlcoffee.dev", date: "2026-08-13T10:20:00Z", status: "pending", lines: [{ item: "Flat White", qty: 1 }] },
    { customerEmail: "felipe.nava@mail.dev", storeName: "Bean & Bloom", employeeEmail: "emiliano.torres@sqlcoffee.dev", date: "2026-08-14T17:30:00Z", status: "completed", lines: [{ item: "Frappe de café", qty: 1 }, { item: "Yogurt con granola", qty: 1 }], pay: { method: "card", paid: true } },
    { customerEmail: "ines.quiroz@mail.dev", storeName: "Origen Centro", employeeEmail: "diego.ramirez@sqlcoffee.dev", date: "2026-08-15T09:12:00Z", status: "completed", lines: [{ item: "Espresso", qty: 1 }, { item: "Latte", qty: 1 }, { item: "Brownie", qty: 2 }], pay: { method: "card", paid: true } },
    { customerEmail: "jorge.delgado@mail.dev", storeName: "Bean & Bloom", employeeEmail: "valentina.cruz@sqlcoffee.dev", date: "2026-08-16T12:44:00Z", status: "completed", lines: [{ item: "Americano", qty: 1 }], pay: { method: "cash", paid: true } },
    { customerEmail: "karla.fuentes@mail.dev", storeName: "La Taza Analco", employeeEmail: "mateo.garcia@sqlcoffee.dev", date: "2026-08-17T08:08:00Z", status: "completed", lines: [{ item: "Manzanilla", qty: 1 }, { item: "Croissant de mantequilla", qty: 1 }], pay: { method: "cash", paid: true } },
    { customerEmail: "marta.rios@mail.dev", storeName: "Bean & Bloom", employeeEmail: "emiliano.torres@sqlcoffee.dev", date: "2026-08-18T15:16:00Z", status: "completed", lines: [{ item: "Latte", qty: 4 }], pay: { method: "card", paid: true } },
    { customerEmail: "nicolas.baeza@mail.dev", storeName: "Origen Centro", employeeEmail: "lucia.hernandez@sqlcoffee.dev", date: "2026-08-19T09:50:00Z", status: "completed", lines: [{ item: "Avocado toast", qty: 2 }, { item: "Americano", qty: 2 }], pay: { method: "transfer", paid: true } },
    { customerEmail: "regina.molina@mail.dev", storeName: "La Taza Analco", employeeEmail: "sofia.lopez@sqlcoffee.dev", date: "2026-08-20T18:22:00Z", status: "completed", lines: [{ item: "Mocha", qty: 1 }], pay: { method: "card", paid: true } },
    { customerEmail: "sebastian.lara@mail.dev", storeName: "Bean & Bloom", employeeEmail: "ximena.navarro@sqlcoffee.dev", date: "2026-08-21T08:33:00Z", status: "completed", lines: [{ item: "Cold Brew", qty: 1 }, { item: "Huevos rancheros", qty: 1 }], pay: { method: "card", paid: true } },
    { customerEmail: "teresa.vega@mail.dev", storeName: "Café Sierra", employeeEmail: "camila.morales@sqlcoffee.dev", date: "2026-08-22T10:01:00Z", status: "completed", lines: [{ item: "Té de jamaica", qty: 3 }], pay: { method: "cash", paid: true } },
    { customerEmail: "ana.martinez@mail.dev", storeName: "Café Sierra", employeeEmail: "leonardo.salinas@sqlcoffee.dev", date: "2026-08-23T09:09:00Z", status: "completed", lines: [{ item: "Espresso", qty: 1 }, { item: "Pan de elote", qty: 1 }], pay: { method: "card", paid: true } },
    { customerEmail: "bruno.ortiz@mail.dev", storeName: "La Taza Analco", employeeEmail: "mateo.garcia@sqlcoffee.dev", date: "2026-08-24T11:11:00Z", status: "completed", lines: [{ item: "Cappuccino", qty: 1 }, { item: "Brownie", qty: 1 }], pay: { method: "cash", paid: true } },
    { customerEmail: null, storeName: "Origen Centro", employeeEmail: "diego.ramirez@sqlcoffee.dev", date: "2026-08-25T07:40:00Z", status: "completed", lines: [{ item: "Americano", qty: 1 }], pay: { method: "cash", paid: true } },
    { customerEmail: null, storeName: "Bean & Bloom", employeeEmail: "emiliano.torres@sqlcoffee.dev", date: "2026-08-26T08:05:00Z", status: "completed", lines: [{ item: "Espresso", qty: 1 }, { item: "Galleta de avena", qty: 1 }], pay: { method: "cash", paid: true } },
    { customerEmail: "elena.paredes@mail.dev", storeName: "Origen Centro", employeeEmail: "renata.ibarra@sqlcoffee.dev", date: "2026-09-01T09:00:00Z", status: "completed", lines: [{ item: "Latte", qty: 2 }, { item: "Croissant de mantequilla", qty: 2 }], pay: { method: "card", paid: true } },
    { customerEmail: "ines.quiroz@mail.dev", storeName: "La Taza Analco", employeeEmail: "sofia.lopez@sqlcoffee.dev", date: "2026-09-05T10:30:00Z", status: "completed", lines: [{ item: "Matcha latte", qty: 1 }], pay: { method: "card", paid: true } },
    { customerEmail: "luis.aguilar@mail.dev", storeName: "Café Sierra", employeeEmail: "santiago.vargas@sqlcoffee.dev", date: "2026-09-10T08:20:00Z", status: "pending", lines: [{ item: "Yogurt con granola", qty: 1 }, { item: "Manzanilla", qty: 1 }] },
    { customerEmail: "pablo.herrera@mail.dev", storeName: "Bean & Bloom", employeeEmail: "valentina.cruz@sqlcoffee.dev", date: "2026-09-12T19:45:00Z", status: "completed", lines: [{ item: "Frappe de café", qty: 2 }], pay: { method: "card", paid: true } },
  ];

  for (const spec of orderSpecs) {
    const created = await prisma.order.create({
      data: {
        customerId: spec.customerEmail ? cust(spec.customerEmail) : null,
        storeId: store(spec.storeName),
        employeeId: emp(spec.employeeEmail),
        orderDate: new Date(spec.date),
        status: spec.status,
        items: {
          create: spec.lines.map((line) => ({
            itemId: item(line.item),
            quantity: line.qty,
            unitPrice: items.find((i) => i.name === line.item)!.price,
          })),
        },
      },
      include: { items: true },
    });

    if (spec.pay?.paid) {
      const amount = created.items.reduce(
        (sum, line) => sum + Number(line.unitPrice) * line.quantity,
        0
      );
      await prisma.payment.create({
        data: {
          orderId: created.orderId,
          amount,
          paymentMethod: spec.pay.method,
          paidAt: created.orderDate,
        },
      });
    }
  }

  // Orphan payment without matching order (inconsistency for FULL JOIN).
  await prisma.payment.create({
    data: {
      orderId: null,
      amount: 75,
      paymentMethod: "transfer",
      paidAt: new Date("2026-08-28T12:00:00Z"),
    },
  });

  const inventoryRows: Array<{ storeName: string; itemName: string; qty: number }> = [];
  for (const s of stores) {
    for (const menuItem of items) {
      if (menuItem.name === "Edición reserva geisha") continue;
      if (menuItem.name === "Limonada de café" && s.name !== "Bean & Bloom") continue;
      const qty =
        menuItem.name === "Manzanilla" && s.name === "Café Sierra"
          ? 0
          : 8 + ((s.storeId * 3 + menuItem.itemId) % 40);
      inventoryRows.push({ storeName: s.name, itemName: menuItem.name, qty });
    }
  }

  await prisma.inventory.createMany({
    data: inventoryRows.map((row) => ({
      storeId: store(row.storeName),
      itemId: item(row.itemName),
      quantityOnHand: row.qty,
    })),
  });

  const suppliers = await prisma.supplier.createManyAndReturn({
    data: [
      { name: "Granos del Sur", contactEmail: "contacto@granos.dev", city: "Oaxaca" },
      { name: "Lácteos Altiplano", contactEmail: "ventas@altiplano.dev", city: "Querétaro" },
      { name: "Dulce Hojaldre", contactEmail: "hola@hojaldre.dev", city: "Puebla" },
      { name: "Empaques Verde", contactEmail: null, city: "CDMX" },
    ],
  });

  const supplier = (name: string) => suppliers.find((s) => s.name === name)!.supplierId;

  const supplies = await prisma.supply.createManyAndReturn({
    data: [
      { name: "Café en grano Blend Casa", unit: "kg", supplierId: supplier("Granos del Sur") },
      { name: "Café geisha", unit: "kg", supplierId: supplier("Granos del Sur") },
      { name: "Leche entera", unit: "l", supplierId: supplier("Lácteos Altiplano") },
      { name: "Leche de avena", unit: "l", supplierId: supplier("Lácteos Altiplano") },
      { name: "Mantequilla laminado", unit: "kg", supplierId: supplier("Dulce Hojaldre") },
      { name: "Vasos 12 oz", unit: "pieza", supplierId: supplier("Empaques Verde") },
      { name: "Tapas calientes", unit: "pieza", supplierId: supplier("Empaques Verde") },
    ],
  });

  const supply = (name: string) => supplies.find((s) => s.name === name)!.supplyId;

  const po1 = await prisma.purchaseOrder.create({
    data: {
      supplierId: supplier("Granos del Sur"),
      storeId: store("Origen Centro"),
      orderedAt: new Date("2026-07-15"),
      status: "received",
      items: {
        create: [
          { supplyId: supply("Café en grano Blend Casa"), quantity: 25, unitCost: 180 },
          { supplyId: supply("Café geisha"), quantity: 2, unitCost: 920 },
        ],
      },
    },
  });
  void po1;

  await prisma.purchaseOrder.create({
    data: {
      supplierId: supplier("Lácteos Altiplano"),
      storeId: store("La Taza Analco"),
      orderedAt: new Date("2026-08-01"),
      status: "received",
      items: {
        create: [
          { supplyId: supply("Leche entera"), quantity: 80, unitCost: 18 },
          { supplyId: supply("Leche de avena"), quantity: 20, unitCost: 32 },
        ],
      },
    },
  });

  await prisma.purchaseOrder.create({
    data: {
      supplierId: supplier("Dulce Hojaldre"),
      storeId: store("Bean & Bloom"),
      orderedAt: new Date("2026-08-20"),
      status: "open",
      items: {
        create: [{ supplyId: supply("Mantequilla laminado"), quantity: 10, unitCost: 95 }],
      },
    },
  });

  await prisma.purchaseOrder.create({
    data: {
      supplierId: supplier("Empaques Verde"),
      storeId: store("Café Sierra"),
      orderedAt: new Date("2026-09-01"),
      status: "received",
      items: {
        create: [
          { supplyId: supply("Vasos 12 oz"), quantity: 1000, unitCost: 1.2 },
          { supplyId: supply("Tapas calientes"), quantity: 1000, unitCost: 0.8 },
        ],
      },
    },
  });

  console.log("Seed de coffee_chain completado.");
}

async function resetSandbox() {
  await prisma.$executeRawUnsafe(`
    DO $$
    DECLARE r RECORD;
    BEGIN
      FOR r IN (
        SELECT tablename
        FROM pg_tables
        WHERE schemaname = 'sql_playground'
      ) LOOP
        EXECUTE format('DROP TABLE IF EXISTS sql_playground.%I CASCADE', r.tablename);
      END LOOP;
    END $$;
  `);

  await prisma.$executeRawUnsafe(`
    CREATE TABLE sql_playground.practice_customers (
      practice_id SERIAL PRIMARY KEY,
      first_name VARCHAR(80) NOT NULL,
      last_name VARCHAR(80) NOT NULL,
      email VARCHAR(160) NOT NULL UNIQUE,
      city VARCHAR(80),
      notes VARCHAR(200)
    );
  `);

  await prisma.$executeRawUnsafe(`
    CREATE TABLE sql_playground.practice_menu_items (
      practice_id SERIAL PRIMARY KEY,
      name VARCHAR(120) NOT NULL,
      price DECIMAL(8,2) NOT NULL,
      category VARCHAR(80) NOT NULL
    );
  `);

  await prisma.practiceCustomer.createMany({
    data: [
      { firstName: "Nora", lastName: "Prueba", email: "nora.prueba@sandbox.dev", city: "Puebla", notes: "Cliente ficticio inicial" },
      { firstName: "Omar", lastName: "Demo", email: "omar.demo@sandbox.dev", city: "CDMX", notes: null },
      { firstName: "Pia", lastName: "Sandbox", email: "pia.sandbox@sandbox.dev", city: "Oaxaca", notes: "No borrar en ejercicios de INSERT" },
    ],
  });

  await prisma.practiceMenuItem.createMany({
    data: [
      { name: "Latte de práctica", price: 49, category: "Bebidas con leche" },
      { name: "Galleta de práctica", price: 22, category: "Repostería" },
    ],
  });

  console.log("Sandbox sql_playground restablecido.");
}

async function main() {
  await prisma.$executeRawUnsafe(`CREATE SCHEMA IF NOT EXISTS coffee_chain`);
  await prisma.$executeRawUnsafe(`CREATE SCHEMA IF NOT EXISTS sql_playground`);
  await seedIfEmpty();
  await resetSandbox();
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
