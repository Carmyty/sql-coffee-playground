import type { Exercise } from "@/data/types";

export const EXERCISES_PART3: Exercise[] = [
  {
    id: "union-names",
    moduleId: "conjuntos",
    order: 1,
    title: "Nombres de clientes y empleados con UNION",
    difficulty: "intermedio",
    estimatedMinutes: 7,
    concepts: ["union"],
    suggestedTables: ["customers", "employees"],
    objective: "Combina first_name de clientes y de empleados en una sola lista, sin duplicados.",
    expectedResult: "Una columna de nombres; si Ana es cliente y no empleada, aparece una vez.",
    reasoningChecklist: ["¿Las dos consultas tienen el mismo número de columnas?"],
    hints: [
      "UNION apila resultados y elimina duplicados. Las columnas deben coincidir en número y tipo.",
      "SELECT first_name FROM customers UNION SELECT first_name FROM employees;",
      "No pongas ALL: este ejercicio quiere UNION clásico.",
    ],
    referenceSql: `SELECT first_name FROM customers
UNION
SELECT first_name FROM employees`,
    referenceExplanation: [
      { clause: "UNION", text: "Apila las dos listas y quita nombres repetidos entre ambos conjuntos." },
    ],
    starterSql: "",
    environment: "read",
    validation: {
      matchMode: "set",
      ignoreRowOrder: true,
      requiredKeywords: ["union"],
      forbiddenKeywords: ["union all"],
      compareSql: "SELECT first_name FROM customers UNION SELECT first_name FROM employees",
    },
    unlockAfterAttempts: 2,
  },
  {
    id: "union-vs-all",
    moduleId: "conjuntos",
    order: 2,
    title: "Comparar UNION versus UNION ALL",
    difficulty: "intermedio",
    estimatedMinutes: 7,
    concepts: ["union-all"],
    suggestedTables: ["customers", "employees"],
    objective: "Usa UNION ALL para conservar duplicados. Si Lucía existe en ambos lados, se verá dos veces.",
    expectedResult: "Más filas que con UNION, porque no se deduplica.",
    reasoningChecklist: ["¿Quieres conservar repeticiones?"],
    hints: [
      "UNION ALL no elimina duplicados y suele ser más rápido.",
      "SELECT first_name FROM customers UNION ALL SELECT first_name FROM employees;",
      "Compara mentalmente el conteo con el ejercicio anterior.",
    ],
    referenceSql: `SELECT first_name FROM customers
UNION ALL
SELECT first_name FROM employees`,
    referenceExplanation: [
      { clause: "UNION ALL", text: "Apila todo. Si un nombre está en ambas tablas, aparece dos veces." },
    ],
    starterSql: "",
    environment: "read",
    validation: {
      matchMode: "exists",
      requiredKeywords: ["union all"],
      minRows: 20,
    },
    unlockAfterAttempts: 2,
  },
  {
    id: "except-customers",
    moduleId: "conjuntos",
    order: 3,
    title: "Clientes sin órdenes usando EXCEPT",
    difficulty: "intermedio",
    estimatedMinutes: 8,
    concepts: ["except"],
    suggestedTables: ["customers", "orders"],
    objective: "EXCEPT resta conjuntos: ids de clientes menos ids que aparecen en orders.",
    expectedResult: "Los customer_id que nunca pidieron, misma idea que el anti join.",
    reasoningChecklist: ["¿Estás restando la misma «forma» de fila?"],
    hints: [
      "SELECT customer_id FROM customers EXCEPT SELECT customer_id FROM orders WHERE customer_id IS NOT NULL",
      "Las dos consultas deben devolver la misma estructura.",
      "Los NULL en orders.customer_id no son un id de cliente; fíltralos en el segundo SELECT.",
    ],
    referenceSql: `SELECT customer_id FROM customers
EXCEPT
SELECT customer_id FROM orders WHERE customer_id IS NOT NULL`,
    referenceExplanation: [
      { clause: "EXCEPT", text: "Filas de la izquierda que no están en la derecha. Perfecto para «sin órdenes»." },
    ],
    starterSql: "",
    environment: "read",
    validation: {
      matchMode: "set",
      ignoreRowOrder: true,
      requiredKeywords: ["except"],
      compareSql: `SELECT customer_id FROM customers
EXCEPT
SELECT customer_id FROM orders WHERE customer_id IS NOT NULL`,
    },
    unlockAfterAttempts: 2,
  },
  {
    id: "intersect-menu-inventory",
    moduleId: "conjuntos",
    order: 4,
    title: "Productos en menú e inventario (INTERSECT)",
    difficulty: "intermedio",
    estimatedMinutes: 7,
    concepts: ["intersect"],
    suggestedTables: ["menu_items", "inventory"],
    objective: "INTERSECT se queda con ids que existen en ambas listas.",
    expectedResult: "item_id que están en menu_items y también en inventory.",
    reasoningChecklist: ["¿Quieres la intersección, no la unión?"],
    hints: [
      "SELECT item_id FROM menu_items INTERSECT SELECT item_id FROM inventory;",
      "El geisha de reserva no debería aparecer si no tiene inventario.",
      "No hace falta JOIN para este ejercicio.",
    ],
    referenceSql: `SELECT item_id FROM menu_items
INTERSECT
SELECT item_id FROM inventory`,
    referenceExplanation: [
      { clause: "INTERSECT", text: "Solo ids presentes en los dos conjuntos." },
    ],
    starterSql: "",
    environment: "read",
    validation: {
      matchMode: "set",
      ignoreRowOrder: true,
      requiredKeywords: ["intersect"],
      compareSql: "SELECT item_id FROM menu_items INTERSECT SELECT item_id FROM inventory",
    },
    unlockAfterAttempts: 2,
  },
  {
    id: "except-menu-inventory",
    moduleId: "conjuntos",
    order: 5,
    title: "Productos del menú ausentes en inventario",
    difficulty: "intermedio",
    estimatedMinutes: 7,
    concepts: ["except"],
    suggestedTables: ["menu_items", "inventory"],
    objective: "Usa EXCEPT para ver qué productos están en el menú pero nunca se stockearon.",
    expectedResult: "Ids de menu_items que no aparecen en inventory.",
    reasoningChecklist: ["¿Cuál conjunto restas de cuál?"],
    hints: [
      "Menú menos inventario.",
      "SELECT item_id FROM menu_items EXCEPT SELECT item_id FROM inventory;",
      "El orden de las consultas importa: A EXCEPT B no es B EXCEPT A.",
    ],
    referenceSql: `SELECT item_id FROM menu_items
EXCEPT
SELECT item_id FROM inventory`,
    referenceExplanation: [
      { clause: "EXCEPT", text: "Productos catalogados que no tienen existencias en ninguna sucursal." },
    ],
    starterSql: "",
    environment: "read",
    validation: {
      matchMode: "set",
      ignoreRowOrder: true,
      requiredKeywords: ["except"],
      compareSql: "SELECT item_id FROM menu_items EXCEPT SELECT item_id FROM inventory",
    },
    unlockAfterAttempts: 2,
  },
  {
    id: "create-practice-table",
    moduleId: "escritura",
    order: 1,
    title: "Crear una tabla de práctica",
    difficulty: "basico",
    estimatedMinutes: 8,
    concepts: ["create-table"],
    suggestedTables: [],
    objective: "En sql_playground crea la tabla tasting_notes con note_id INT IDENTITY(1,1), flavor TEXT y created_at TIMESTAMP.",
    expectedResult: "La tabla tasting_notes existe en el sandbox. La base coffee_chain no cambia.",
    reasoningChecklist: ["¿Estás en práctica segura?", "¿Definiste tipos de dato?"],
    hints: [
      "CREATE TABLE define nombre, columnas y tipos. INT IDENTITY(1,1) es un entero autoincremental.",
      "CREATE TABLE tasting_notes (note_id INT IDENTITY(1,1) PRIMARY KEY, flavor TEXT, created_at DATETIME2 DEFAULT GETDATE());",
      "El search_path del sandbox es sql_playground, no hace falta calificar el esquema.",
    ],
    referenceSql: `CREATE TABLE tasting_notes (
  note_id INT IDENTITY(1,1) PRIMARY KEY,
  flavor NVARCHAR(MAX) NOT NULL,
  created_at DATETIME2 DEFAULT GETDATE()
)`,
    referenceExplanation: [
      { clause: "CREATE TABLE", text: "Nace una tabla nueva solo en sql_playground." },
      { clause: "INT IDENTITY(1,1) PRIMARY KEY", text: "Identificador automático e índice primario." },
    ],
    starterSql: "",
    environment: "sandbox",
    validation: { matchMode: "mutation", requiredKeywords: ["create table"] },
    mutationCheck: { type: "table_exists", table: "tasting_notes" },
    unlockAfterAttempts: 2,
  },
  {
    id: "insert-fake-customer",
    moduleId: "escritura",
    order: 2,
    title: "Insertar un cliente ficticio",
    difficulty: "basico",
    estimatedMinutes: 6,
    concepts: ["insert"],
    suggestedTables: ["practice_customers"],
    objective: "Agrega un cliente de práctica con email mia.sandbox@sqlcoffee.dev en practice_customers.",
    expectedResult: "Una fila nueva con ese correo. Los clientes reales no se tocan.",
    reasoningChecklist: ["¿Listaste las columnas obligatorias?"],
    hints: [
      "INSERT INTO tabla (columnas) VALUES (valores).",
      "INSERT INTO practice_customers (first_name, last_name, email, city) VALUES ('Mia', 'Sandbox', 'mia.sandbox@sqlcoffee.dev', 'Puebla');",
      "Respeta NOT NULL y el UNIQUE de email.",
    ],
    referenceSql: `INSERT INTO practice_customers (first_name, last_name, email, city, notes)
VALUES ('Mia', 'Sandbox', 'mia.sandbox@sqlcoffee.dev', 'Puebla', 'Insert de práctica')`,
    referenceExplanation: [
      { clause: "INSERT INTO ... VALUES", text: "Una fila nueva. El practice_id lo asigna INT IDENTITY(1,1)." },
    ],
    starterSql: "",
    environment: "sandbox",
    validation: { matchMode: "mutation", requiredKeywords: ["insert"] },
    mutationCheck: {
      type: "row_exists",
      table: "practice_customers",
      sql: "SELECT 1 FROM practice_customers WHERE email = 'mia.sandbox@sqlcoffee.dev'",
    },
    unlockAfterAttempts: 2,
  },
  {
    id: "update-fake-customer",
    moduleId: "escritura",
    order: 3,
    title: "Actualizar el cliente ficticio",
    difficulty: "intermedio",
    estimatedMinutes: 7,
    concepts: ["update"],
    suggestedTables: ["practice_customers"],
    objective: "Cambia la ciudad de Nora Prueba (nora.prueba@sandbox.dev) a Veracruz. El WHERE es obligatorio.",
    expectedResult: "Solo esa fila cambia de ciudad. Sin WHERE la app bloquea el UPDATE.",
    reasoningChecklist: ["¿Tu WHERE identifica una sola persona?"],
    hints: [
      "UPDATE tabla SET columna = valor WHERE condición.",
      "UPDATE practice_customers SET city = 'Veracruz' WHERE email = 'nora.prueba@sandbox.dev';",
      "Si omites WHERE, verás una advertencia de seguridad y no se ejecutará.",
    ],
    referenceSql: `UPDATE practice_customers
SET city = 'Veracruz'
WHERE email = 'nora.prueba@sandbox.dev'`,
    referenceExplanation: [
      { clause: "SET city", text: "Nuevo valor." },
      { clause: "WHERE email = ...", text: "Limita el cambio a una persona. Nunca actualices toda la tabla «por probar»." },
    ],
    starterSql: "",
    environment: "sandbox",
    validation: { matchMode: "mutation", requiredKeywords: ["update", "where"] },
    mutationCheck: {
      type: "row_exists",
      table: "practice_customers",
      sql: "SELECT 1 FROM practice_customers WHERE email = 'nora.prueba@sandbox.dev' AND city = 'Veracruz'",
    },
    unlockAfterAttempts: 2,
  },
  {
    id: "delete-fake-customer",
    moduleId: "escritura",
    order: 4,
    title: "Eliminar específicamente un cliente",
    difficulty: "intermedio",
    estimatedMinutes: 6,
    concepts: ["delete"],
    suggestedTables: ["practice_customers"],
    objective: "Borra solo a Omar Demo (omar.demo@sandbox.dev). No borres a Pia.",
    expectedResult: "Omar desaparece; Pia sigue. DELETE sin WHERE está bloqueado.",
    reasoningChecklist: ["¿El WHERE es lo bastante específico?"],
    hints: [
      "DELETE FROM tabla WHERE condición.",
      "DELETE FROM practice_customers WHERE email = 'omar.demo@sandbox.dev';",
      "Confirma la advertencia: el sandbox estima cuántas filas se borran.",
    ],
    referenceSql: "DELETE FROM practice_customers WHERE email = 'omar.demo@sandbox.dev'",
    referenceExplanation: [
      { clause: "WHERE email = ...", text: "Borra una fila concreta. Restablece el sandbox si te equivocas." },
    ],
    starterSql: "",
    environment: "sandbox",
    validation: { matchMode: "mutation", requiredKeywords: ["delete", "where"] },
    mutationCheck: {
      type: "row_missing",
      table: "practice_customers",
      sql: "SELECT 1 FROM practice_customers WHERE email = 'omar.demo@sandbox.dev'",
    },
    unlockAfterAttempts: 2,
  },
  {
    id: "alter-column",
    moduleId: "escritura",
    order: 5,
    title: "Agregar y entender una columna de práctica",
    difficulty: "intermedio",
    estimatedMinutes: 7,
    concepts: ["alter-table"],
    suggestedTables: ["practice_menu_items"],
    objective: "Agrega la columna is_seasonal BOOLEAN a practice_menu_items.",
    expectedResult: "La tabla de práctica tiene una columna nueva. El menú real no cambia.",
    reasoningChecklist: ["¿ALTER modifica datos o estructura?"],
    hints: [
      "ALTER TABLE ... ADD COLUMN ...",
      "ALTER TABLE practice_menu_items ADD COLUMN is_seasonal BOOLEAN DEFAULT FALSE;",
      "DROP COLUMN también es ALTER, pero primero practica ADD.",
    ],
    referenceSql: "ALTER TABLE practice_menu_items ADD COLUMN is_seasonal BOOLEAN DEFAULT 0",
    referenceExplanation: [
      { clause: "ADD COLUMN", text: "Cambia el molde de la tabla. DEFAULT llena las filas ya existentes." },
    ],
    starterSql: "",
    environment: "sandbox",
    validation: { matchMode: "mutation", requiredKeywords: ["alter table"] },
    mutationCheck: { type: "column_exists", table: "practice_menu_items", column: "is_seasonal" },
    unlockAfterAttempts: 2,
  },
  {
    id: "dangerous-delete",
    moduleId: "escritura",
    order: 6,
    title: "Por qué DELETE o UPDATE sin WHERE es peligroso",
    difficulty: "basico",
    estimatedMinutes: 6,
    concepts: ["security"],
    suggestedTables: ["practice_customers"],
    objective: "Intenta un DELETE sin WHERE y observa el bloqueo. Luego escribe un DELETE seguro con WHERE email = 'nora.prueba@sandbox.dev'.",
    expectedResult: "La app rechaza el DELETE masivo. El DELETE con WHERE sí puede ejecutarse en el sandbox.",
    reasoningChecklist: ["¿Qué pasaría en producción sin WHERE?"],
    hints: [
      "Sin WHERE, DELETE borra todas las filas de la tabla.",
      "DELETE FROM practice_customers WHERE email = 'nora.prueba@sandbox.dev';",
      "El filtro de seguridad existe porque un olvido no debe vaciar la cafetería real.",
    ],
    referenceSql: "DELETE FROM practice_customers WHERE email = 'nora.prueba@sandbox.dev'",
    referenceExplanation: [
      { clause: "WHERE", text: "Es el cinturón de seguridad de UPDATE y DELETE." },
      { clause: "Sandbox", text: "Aunque practiques, coffee_chain permanece intacto." },
    ],
    starterSql: "",
    environment: "sandbox",
    validation: { matchMode: "mutation", requiredKeywords: ["delete", "where"] },
    mutationCheck: { type: "blocked_without_where" },
    unlockAfterAttempts: 1,
  },
  {
    id: "drop-practice-table",
    moduleId: "escritura",
    order: 7,
    title: "Eliminar una tabla de práctica",
    difficulty: "basico",
    estimatedMinutes: 5,
    concepts: ["drop-table"],
    suggestedTables: [],
    objective: "Si creaste tasting_notes, bórrala con DROP TABLE. Nunca podrás hacer DROP SCHEMA coffee_chain.",
    expectedResult: "tasting_notes deja de existir en sql_playground.",
    reasoningChecklist: ["¿DROP TABLE vs DROP SCHEMA?"],
    hints: [
      "DROP TABLE tasting_notes;",
      "IF EXISTS evita error si ya no está.",
      "DROP SCHEMA está bloqueado siempre.",
    ],
    referenceSql: "DROP TABLE IF EXISTS tasting_notes",
    referenceExplanation: [
      { clause: "DROP TABLE", text: "Elimina la tabla y sus datos del sandbox." },
      { clause: "IF EXISTS", text: "Hace el comando idempotente para reintentos." },
    ],
    starterSql: "",
    environment: "sandbox",
    validation: { matchMode: "mutation", requiredKeywords: ["drop table"] },
    mutationCheck: { type: "table_missing", table: "tasting_notes" },
    unlockAfterAttempts: 2,
  },
  {
    id: "top-customers",
    moduleId: "retos",
    order: 1,
    title: "Top 10 clientes por gasto",
    difficulty: "avanzado",
    estimatedMinutes: 12,
    concepts: ["multi-join", "sum", "order-by", "limit"],
    suggestedTables: ["customers", "orders", "order_items"],
    objective: "Los 10 clientes que más han gastado, con su total, ordenados de mayor a menor.",
    expectedResult: "Como máximo 10 filas, Ana u otros frecuentes arriba si el seed lo respalda.",
    reasoningChecklist: ["¿Agrupas por cliente?", "¿Ordenas y recortas?"],
    hints: [
      "Suma quantity * unit_price, agrupa por cliente, ORDER BY total DESC TOP 10.",
      "JOIN customers, orders, order_items. WHERE customer_id IS NOT NULL.",
      "El walk-in sin cliente no entra al ranking.",
    ],
    referenceSql: `SELECT TOP 10 c.email, SUM(oi.quantity * oi.unit_price) AS gasto
FROM customers c
JOIN orders o ON o.customer_id = c.customer_id
JOIN order_items oi ON oi.order_id = o.order_id
GROUP BY c.email
ORDER BY gasto DESC
`,
    referenceExplanation: [
      { clause: "SUM(quantity * unit_price)", text: "Gasto real por líneas de ticket." },
      { clause: "ORDER BY gasto DESC TOP 10", text: "Ranking recortado a diez." },
    ],
    starterSql: "",
    environment: "read",
    validation: {
      matchMode: "ordered",
      ignoreRowOrder: false,
      requiredKeywords: ["sum", "group by", "order by", "limit"],
      maxRows: 10,
      compareSql: `SELECT TOP 10 c.email, SUM(oi.quantity * oi.unit_price) AS gasto
FROM customers c
JOIN orders o ON o.customer_id = c.customer_id
JOIN order_items oi ON oi.order_id = o.order_id
GROUP BY c.email
ORDER BY gasto DESC
`,
    },
    unlockAfterAttempts: 2,
  },
  {
    id: "top-products-revenue",
    moduleId: "retos",
    order: 2,
    title: "Top productos por ingresos",
    difficulty: "avanzado",
    estimatedMinutes: 10,
    concepts: ["sum", "group-by", "order-by"],
    suggestedTables: ["menu_items", "order_items"],
    objective: "Ranking de productos por ingresos (SUM de quantity * unit_price), no solo por piezas.",
    expectedResult: "Latte suele destacar. Orden descendente.",
    reasoningChecklist: [ "¿Ingresos o unidades?" ],
    hints: [
      "SUM(oi.quantity * oi.unit_price) GROUP BY mi.name ORDER BY 2 DESC",
      "JOIN menu_items.",
      "TOP 10 es bienvenida pero no obligatoria.",
    ],
    referenceSql: `SELECT mi.name, SUM(oi.quantity * oi.unit_price) AS ingresos
FROM order_items oi
JOIN menu_items mi ON mi.item_id = oi.item_id
GROUP BY mi.name
ORDER BY ingresos DESC`,
    referenceExplanation: [
      { clause: "quantity * unit_price", text: "Usa el precio cobrado en la línea, no el precio actual del menú." },
    ],
    starterSql: "",
    environment: "read",
    validation: {
      matchMode: "ordered",
      ignoreRowOrder: false,
      requiredKeywords: ["sum", "group by", "order by"],
      compareSql: `SELECT item_id, SUM(quantity * unit_price) AS ingresos
FROM order_items
GROUP BY item_id
ORDER BY ingresos DESC`,
    },
    unlockAfterAttempts: 2,
  },
  {
    id: "sales-store-category",
    moduleId: "retos",
    order: 3,
    title: "Ventas por sucursal y categoría",
    difficulty: "avanzado",
    estimatedMinutes: 12,
    concepts: ["multi-join", "group-by"],
    suggestedTables: ["stores", "orders", "order_items", "menu_items", "menu_categories"],
    objective: "Reporte de dos dimensiones: sucursal × categoría con el total vendido.",
    expectedResult: "Cada combinación sucursal-categoría que haya vendido algo, con su suma.",
    reasoningChecklist: ["¿Agrupas por dos columnas?"],
    hints: [
      "GROUP BY s.name, mc.name y SUM(quantity * unit_price).",
      "Necesitas 4 o 5 tablas unidas.",
      "Empieza por order_items y sube hasta stores y menu_categories.",
    ],
    referenceSql: `SELECT s.name AS sucursal, mc.name AS categoria,
       SUM(oi.quantity * oi.unit_price) AS ventas
FROM stores s
JOIN orders o ON o.store_id = s.store_id
JOIN order_items oi ON oi.order_id = o.order_id
JOIN menu_items mi ON mi.item_id = oi.item_id
JOIN menu_categories mc ON mc.category_id = mi.category_id
GROUP BY s.name, mc.name
ORDER BY sucursal, ventas DESC`,
    referenceExplanation: [
      { clause: "GROUP BY sucursal, categoria", text: "Dos columnas en GROUP BY crean una celda de reporte." },
    ],
    starterSql: "",
    environment: "read",
    validation: {
      matchMode: "set",
      ignoreRowOrder: true,
      requiredKeywords: ["join", "group by", "sum"],
      compareSql: `SELECT o.store_id, mi.category_id, SUM(oi.quantity * oi.unit_price) AS ventas
FROM orders o
JOIN order_items oi ON oi.order_id = o.order_id
JOIN menu_items mi ON mi.item_id = oi.item_id
GROUP BY o.store_id, mi.category_id`,
    },
    unlockAfterAttempts: 2,
  },
  {
    id: "supplier-spend",
    moduleId: "retos",
    order: 4,
    title: "Proveedores y gasto total",
    difficulty: "avanzado",
    estimatedMinutes: 10,
    concepts: ["multi-join", "sum"],
    suggestedTables: ["suppliers", "purchase_orders", "purchase_order_items"],
    objective: "Suma quantity * unit_cost de las órdenes de compra por proveedor.",
    expectedResult: "Una fila por supplier con su gasto de compras.",
    reasoningChecklist: ["¿El dinero está en purchase_order_items?"],
    hints: [
      "JOIN suppliers → purchase_orders → purchase_order_items.",
      "SUM(poi.quantity * poi.unit_cost) GROUP BY s.name",
      "Los ids son supplier_id y po_id.",
    ],
    referenceSql: `SELECT s.name AS proveedor, SUM(poi.quantity * poi.unit_cost) AS gasto
FROM suppliers s
JOIN purchase_orders po ON po.supplier_id = s.supplier_id
JOIN purchase_order_items poi ON poi.po_id = po.po_id
GROUP BY s.name`,
    referenceExplanation: [
      { clause: "unit_cost", text: "En compras el costo vive en la línea de la orden de compra, no en el menú." },
    ],
    starterSql: "",
    environment: "read",
    validation: {
      matchMode: "set",
      ignoreRowOrder: true,
      requiredKeywords: ["join", "sum", "group by"],
      compareSql: `SELECT po.supplier_id, SUM(poi.quantity * poi.unit_cost) AS gasto
FROM purchase_orders po
JOIN purchase_order_items poi ON poi.po_id = po.po_id
GROUP BY po.supplier_id`,
    },
    unlockAfterAttempts: 2,
  },
  {
    id: "full-join-inconsistencies",
    moduleId: "retos",
    order: 5,
    title: "Inconsistencias órdenes vs pagos con FULL JOIN",
    difficulty: "avanzado",
    estimatedMinutes: 10,
    concepts: ["full-outer-join"],
    suggestedTables: ["orders", "payments"],
    objective: "Usa FULL OUTER JOIN para ver órdenes y pagos, incluidas las filas que no cruzan.",
    expectedResult: "Debe verse al menos una orden sin pago y el pago sin orden.",
    reasoningChecklist: ["¿FULL JOIN conserva ambos lados?"],
    hints: [
      "FROM orders o FULL OUTER JOIN payments p ON o.order_id = p.order_id",
      "Puedes filtrar nulos o mostrar todo el cruce.",
      "Este reto pide el FULL JOIN, no solo el anti join.",
    ],
    referenceSql: `SELECT o.order_id, o.status, p.payment_id, p.amount
FROM orders o
FULL OUTER JOIN payments p ON p.order_id = o.order_id`,
    referenceExplanation: [
      { clause: "FULL OUTER JOIN", text: "Muestra matches, órdenes huérfanas y pagos huérfanos en el mismo resultado." },
    ],
    starterSql: "",
    environment: "read",
    validation: {
      matchMode: "exists",
      requiredKeywords: ["full", "join"],
      minRows: 10,
    },
    unlockAfterAttempts: 2,
  },
  {
    id: "inventory-report",
    moduleId: "retos",
    order: 6,
    title: "Reporte de inventario por sucursal y producto",
    difficulty: "avanzado",
    estimatedMinutes: 10,
    concepts: ["multi-join", "left-join"],
    suggestedTables: ["stores", "menu_items", "inventory"],
    objective: "Para cada sucursal y producto del menú, muestra quantity_on_hand, incluso 0 o NULL si faltara.",
    expectedResult: "Una grilla sucursal × producto con existencias.",
    reasoningChecklist: ["¿Quieres ver ceros, no solo lo stockeado?"],
    hints: [
      "CROSS JOIN stores y menu_items, luego LEFT JOIN inventory.",
      "COALESCE(i.quantity_on_hand, 0) ayuda a leer nulos como cero.",
      "ON debe incluir store_id e item_id.",
    ],
    referenceSql: `SELECT s.name AS sucursal, mi.name AS producto, i.quantity_on_hand
FROM stores s
CROSS JOIN menu_items mi
LEFT JOIN inventory i
  ON i.store_id = s.store_id AND i.item_id = mi.item_id
ORDER BY sucursal, producto`,
    referenceExplanation: [
      { clause: "CROSS JOIN", text: "Genera todas las combinaciones sucursal-producto." },
      { clause: "LEFT JOIN inventory", text: "Rellena cantidades cuando existen; si no, NULL." },
    ],
    starterSql: "",
    environment: "read",
    validation: {
      matchMode: "exists",
      requiredKeywords: ["join"],
      minRows: 50,
    },
    unlockAfterAttempts: 2,
  },
];
