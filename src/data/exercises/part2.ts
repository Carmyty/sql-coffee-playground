import type { Exercise } from "@/data/types";

const checklist = {
  table: "¿Qué tabla contiene el dato?",
  filter: "¿Necesitas filtrar filas con WHERE?",
  group: "¿Necesitas agrupar con GROUP BY?",
  join: "¿Necesitas relacionar tablas con JOIN?",
};

export const EXERCISES_PART2: Exercise[] = [
  {
    id: "products-per-category",
    moduleId: "agrupacion",
    order: 1,
    title: "Contar productos por categoría",
    difficulty: "intermedio",
    estimatedMinutes: 7,
    concepts: ["group-by", "count"],
    suggestedTables: ["menu_items", "menu_categories"],
    objective: "Para cada categoría, ¿cuántos productos hay?",
    expectedResult: "Una fila por categoría con su conteo.",
    reasoningChecklist: [checklist.group, checklist.join],
    hints: [
      "GROUP BY la categoría y COUNT las filas de productos.",
      "SELECT [categoria], COUNT(*) FROM ... JOIN ... GROUP BY [categoria];",
      "Une menu_items con menu_categories para mostrar el nombre, no solo el id.",
    ],
    referenceSql: `SELECT mc.name AS categoria, COUNT(*) AS productos
FROM menu_items mi
JOIN menu_categories mc ON mc.category_id = mi.category_id
GROUP BY mc.name`,
    referenceExplanation: [
      { clause: "GROUP BY mc.name", text: "Cada valor distinto de categoría genera un grupo." },
      { clause: "COUNT(*)", text: "Cuenta productos dentro de ese grupo." },
    ],
    starterSql: "",
    environment: "read",
    validation: {
      matchMode: "set",
      ignoreRowOrder: true,
      requiredKeywords: ["group by", "count"],
      compareSql: `SELECT category_id, COUNT(*) AS productos
FROM menu_items
GROUP BY category_id`,
    },
    unlockAfterAttempts: 2,
  },
  {
    id: "avg-price-category",
    moduleId: "agrupacion",
    order: 2,
    title: "Precio promedio por categoría",
    difficulty: "intermedio",
    estimatedMinutes: 7,
    concepts: ["avg", "group-by"],
    suggestedTables: ["menu_items", "menu_categories"],
    objective: "Calcula el precio promedio de los productos de cada categoría.",
    expectedResult: "Una fila por categoría con AVG(price).",
    reasoningChecklist: [checklist.group],
    hints: [
      "AVG(price) junto con GROUP BY categoría.",
      "SELECT [categoria], AVG(price) FROM menu_items GROUP BY ...",
      "Puedes agrupar por category_id o por el nombre si haces JOIN.",
    ],
    referenceSql: `SELECT mc.name AS categoria, AVG(mi.price) AS precio_promedio
FROM menu_items mi
JOIN menu_categories mc ON mc.category_id = mi.category_id
GROUP BY mc.name`,
    referenceExplanation: [{ clause: "AVG(mi.price)", text: "Promedia solo los precios del grupo, no de toda la tabla." }],
    starterSql: "",
    environment: "read",
    validation: {
      matchMode: "set",
      ignoreRowOrder: true,
      requiredKeywords: ["avg", "group by"],
      compareSql: "SELECT category_id, AVG(price) AS precio_promedio FROM menu_items GROUP BY category_id",
    },
    unlockAfterAttempts: 2,
  },
  {
    id: "having-count",
    moduleId: "agrupacion",
    order: 3,
    title: "Categorías con más de 3 productos",
    difficulty: "intermedio",
    estimatedMinutes: 8,
    concepts: ["having", "group-by"],
    suggestedTables: ["menu_items", "menu_categories"],
    objective: "WHERE filtra filas antes de agrupar. HAVING filtra grupos después de COUNT.",
    expectedResult: "Solo categorías cuyo COUNT de productos sea mayor a 3.",
    reasoningChecklist: [checklist.group, "¿El filtro es sobre un COUNT o sobre una fila cruda?"],
    hints: [
      "HAVING COUNT(*) > 3 va después de GROUP BY.",
      "SELECT [categoria], COUNT(*) FROM ... GROUP BY [categoria] HAVING COUNT(*) > 3;",
      "Si pones COUNT en WHERE, PostgreSQL se quejará: las agregaciones no viven ahí.",
    ],
    referenceSql: `SELECT mc.name AS categoria, COUNT(*) AS productos
FROM menu_items mi
JOIN menu_categories mc ON mc.category_id = mi.category_id
GROUP BY mc.name
HAVING COUNT(*) > 3`,
    referenceExplanation: [
      { clause: "HAVING COUNT(*) > 3", text: "Se evalúa cuando el grupo ya tiene su conteo. WHERE no puede hacer eso." },
    ],
    starterSql: "",
    environment: "read",
    validation: {
      matchMode: "set",
      ignoreRowOrder: true,
      requiredKeywords: ["having", "group by"],
      compareSql: `SELECT category_id, COUNT(*) AS productos
FROM menu_items
GROUP BY category_id
HAVING COUNT(*) > 3`,
    },
    unlockAfterAttempts: 2,
  },
  {
    id: "orders-by-status",
    moduleId: "agrupacion",
    order: 4,
    title: "Contar órdenes por estado",
    difficulty: "basico",
    estimatedMinutes: 6,
    concepts: ["group-by", "count"],
    suggestedTables: ["orders"],
    objective: "¿Cuántas órdenes hay en cada status?",
    expectedResult: "Filas completed, pending, cancelled, preparing con su conteo.",
    reasoningChecklist: [checklist.group],
    hints: [
      "Agrupa por status y cuenta.",
      "SELECT status, COUNT(*) FROM orders GROUP BY status;",
      "No hace falta JOIN.",
    ],
    referenceSql: "SELECT status, COUNT(*) AS total FROM orders GROUP BY status",
    referenceExplanation: [{ clause: "GROUP BY status", text: "Cada valor de estado (completed, pending…) es un grupo." }],
    starterSql: "",
    environment: "read",
    validation: {
      matchMode: "set",
      ignoreRowOrder: true,
      requiredKeywords: ["group by", "count"],
      requiredColumns: ["status"],
      compareSql: "SELECT status, COUNT(*) AS total FROM orders GROUP BY status",
    },
    unlockAfterAttempts: 2,
  },
  {
    id: "employees-per-store",
    moduleId: "agrupacion",
    order: 5,
    title: "Contar empleados por sucursal",
    difficulty: "intermedio",
    estimatedMinutes: 7,
    concepts: ["group-by", "count", "inner-join"],
    suggestedTables: ["employees", "stores"],
    objective: "Para cada sucursal, cuántas personas trabajan ahí.",
    expectedResult: "Nombre de sucursal y número de empleados.",
    reasoningChecklist: [checklist.join, checklist.group],
    hints: [
      "Une employees con stores y agrupa por sucursal.",
      "SELECT s.name, COUNT(*) FROM employees e JOIN stores s ON ... GROUP BY s.name;",
      "La llave es store_id.",
    ],
    referenceSql: `SELECT s.name AS sucursal, COUNT(*) AS empleados
FROM employees e
JOIN stores s ON s.store_id = e.store_id
GROUP BY s.name`,
    referenceExplanation: [
      { clause: "JOIN stores", text: "El nombre de la sucursal está en stores, no en employees." },
      { clause: "GROUP BY s.name", text: "Un grupo por cafetería." },
    ],
    starterSql: "",
    environment: "read",
    validation: {
      matchMode: "set",
      ignoreRowOrder: true,
      requiredKeywords: ["group by", "join"],
      compareSql: "SELECT store_id, COUNT(*) AS empleados FROM employees GROUP BY store_id",
    },
    unlockAfterAttempts: 2,
  },
  {
    id: "product-category-join",
    moduleId: "joins-basicos",
    order: 1,
    title: "Producto y categoría",
    difficulty: "basico",
    estimatedMinutes: 6,
    concepts: ["inner-join"],
    suggestedTables: ["menu_items", "menu_categories"],
    objective: "Muestra cada producto junto al nombre de su categoría.",
    expectedResult: "Columnas de producto y categoría, una fila por producto que tenga categoría.",
    reasoningChecklist: [checklist.join],
    hints: [
      "INNER JOIN une filas con llave igual en ambas tablas.",
      "FROM menu_items mi JOIN menu_categories mc ON mi.category_id = mc.category_id",
      "ON describe la relación: el id de categoría.",
    ],
    referenceSql: `SELECT mi.name AS producto, mc.name AS categoria, mi.price
FROM menu_items mi
INNER JOIN menu_categories mc ON mi.category_id = mc.category_id`,
    referenceExplanation: [
      { clause: "INNER JOIN", text: "Solo productos con categoría existente. Aquí todos deberían matchear." },
      { clause: "ON ... category_id", text: "Esa es la llave foránea." },
    ],
    starterSql: "",
    environment: "read",
    validation: {
      matchMode: "set",
      ignoreRowOrder: true,
      requiredKeywords: ["join"],
      compareSql: `SELECT mi.name, mc.name
FROM menu_items mi
JOIN menu_categories mc ON mi.category_id = mc.category_id`,
    },
    unlockAfterAttempts: 2,
  },
  {
    id: "order-customer",
    moduleId: "joins-basicos",
    order: 2,
    title: "Orden y cliente",
    difficulty: "basico",
    estimatedMinutes: 6,
    concepts: ["inner-join"],
    suggestedTables: ["orders", "customers"],
    objective: "Lista órdenes con el correo del cliente. Las walk-in sin cliente no aparecen en un INNER JOIN.",
    expectedResult: "order_id, fecha y email (o nombre) del cliente.",
    reasoningChecklist: [checklist.join, "¿Qué pasa si customer_id es NULL?"],
    hints: [
      "INNER JOIN descarta órdenes sin cliente.",
      "FROM orders o JOIN customers c ON o.customer_id = c.customer_id",
      "Eso es lo que pedimos aquí: solo órdenes con cliente.",
    ],
    referenceSql: `SELECT o.order_id, o.order_date, c.email
FROM orders o
INNER JOIN customers c ON c.customer_id = o.customer_id`,
    referenceExplanation: [
      { clause: "INNER JOIN customers", text: "Las órdenes con customer_id nulo no salen: no hay coincidencia." },
    ],
    starterSql: "",
    environment: "read",
    validation: {
      matchMode: "set",
      ignoreRowOrder: true,
      requiredKeywords: ["join"],
      requiredColumns: ["email"],
      compareSql: `SELECT o.order_id, c.email
FROM orders o
JOIN customers c ON c.customer_id = o.customer_id`,
    },
    unlockAfterAttempts: 2,
  },
  {
    id: "order-store",
    moduleId: "joins-basicos",
    order: 3,
    title: "Orden y sucursal",
    difficulty: "basico",
    estimatedMinutes: 5,
    concepts: ["inner-join"],
    suggestedTables: ["orders", "stores"],
    objective: "Muestra cada orden con el nombre de la sucursal donde se hizo.",
    expectedResult: "Identificador de orden y nombre de store.",
    reasoningChecklist: [checklist.join],
    hints: [
      "Relaciona orders.store_id con stores.store_id.",
      "JOIN stores s ON s.store_id = o.store_id",
      "SELECT o.order_id, s.name ...",
    ],
    referenceSql: `SELECT o.order_id, o.order_date, s.name AS sucursal
FROM orders o
JOIN stores s ON s.store_id = o.store_id`,
    referenceExplanation: [{ clause: "ON store_id", text: "Cada orden pertenece a una sucursal." }],
    starterSql: "",
    environment: "read",
    validation: {
      matchMode: "set",
      ignoreRowOrder: true,
      requiredKeywords: ["join"],
      compareSql: `SELECT o.order_id, s.name
FROM orders o
JOIN stores s ON s.store_id = o.store_id`,
    },
    unlockAfterAttempts: 2,
  },
  {
    id: "order-details",
    moduleId: "joins-basicos",
    order: 4,
    title: "Detalle de orden: producto, cantidad, precio",
    difficulty: "intermedio",
    estimatedMinutes: 8,
    concepts: ["multi-join"],
    suggestedTables: ["order_items", "orders", "menu_items"],
    objective: "Arma el ticket: para cada línea, el producto, la cantidad y el precio unitario.",
    expectedResult: "Filas de order_items con nombre de producto y datos de cantidad/precio.",
    reasoningChecklist: [checklist.join, "¿Cuántas tablas hace falta unir?"],
    hints: [
      "order_items guarda cantidad y precio; el nombre está en menu_items.",
      "FROM order_items oi JOIN menu_items mi ON oi.item_id = mi.item_id",
      "Puedes unir también orders si quieres la fecha.",
    ],
    referenceSql: `SELECT oi.order_id, mi.name AS producto, oi.quantity, oi.unit_price
FROM order_items oi
JOIN menu_items mi ON mi.item_id = oi.item_id`,
    referenceExplanation: [
      { clause: "JOIN menu_items", text: "item_id es la llave entre la línea del ticket y el catálogo." },
    ],
    starterSql: "",
    environment: "read",
    validation: {
      matchMode: "set",
      ignoreRowOrder: true,
      requiredKeywords: ["join"],
      requiredColumns: ["quantity"],
      compareSql: `SELECT oi.order_id, mi.name, oi.quantity, oi.unit_price
FROM order_items oi
JOIN menu_items mi ON mi.item_id = oi.item_id`,
    },
    unlockAfterAttempts: 2,
  },
  {
    id: "employee-role-store",
    moduleId: "joins-basicos",
    order: 5,
    title: "Empleados con rol y sucursal",
    difficulty: "intermedio",
    estimatedMinutes: 8,
    concepts: ["multi-join"],
    suggestedTables: ["employees", "employee_roles", "stores"],
    objective: "Tres tablas: persona, su rol y la cafetería donde trabaja.",
    expectedResult: "Nombre del empleado, role_name y name de la sucursal.",
    reasoningChecklist: [checklist.join],
    hints: [
      "Dos JOIN encadenados: employees → roles y employees → stores.",
      "FROM employees e JOIN employee_roles r ON e.role_id = r.role_id JOIN stores s ON e.store_id = s.store_id",
      "No hace falta subquery.",
    ],
    referenceSql: `SELECT e.first_name, e.last_name, r.role_name, s.name AS sucursal
FROM employees e
JOIN employee_roles r ON r.role_id = e.role_id
JOIN stores s ON s.store_id = e.store_id`,
    referenceExplanation: [
      { clause: "JOIN employee_roles", text: "role_id conecta con el catálogo de puestos." },
      { clause: "JOIN stores", text: "store_id conecta con la sucursal." },
    ],
    starterSql: "",
    environment: "read",
    validation: {
      matchMode: "set",
      ignoreRowOrder: true,
      requiredKeywords: ["join"],
      compareSql: `SELECT e.email, r.role_name, s.name
FROM employees e
JOIN employee_roles r ON r.role_id = e.role_id
JOIN stores s ON s.store_id = e.store_id`,
    },
    unlockAfterAttempts: 2,
  },
  {
    id: "cross-join-demo",
    moduleId: "joins-basicos",
    order: 6,
    title: "CROSS JOIN de sucursales y roles",
    difficulty: "intermedio",
    estimatedMinutes: 6,
    concepts: ["cross-join"],
    suggestedTables: ["stores", "employee_roles"],
    objective: "CROSS JOIN combina cada fila con cada fila de la otra tabla. Úsalo a propósito, no por olvido del ON.",
    expectedResult: "Cada sucursal apareada con cada rol posible (4 sucursales × 5 roles = 20 filas).",
    reasoningChecklist: ["¿De verdad quieres el producto cartesiano?"],
    hints: [
      "CROSS JOIN no lleva ON.",
      "SELECT s.name, r.role_name FROM stores s CROSS JOIN employee_roles r;",
      "Es útil para imaginar combinaciones posibles, no para tickets reales.",
    ],
    referenceSql: `SELECT s.name AS sucursal, r.role_name
FROM stores s
CROSS JOIN employee_roles r`,
    referenceExplanation: [
      { clause: "CROSS JOIN", text: "Multiplica filas. 4 × 5 = 20 combinaciones en el seed de demostración." },
    ],
    starterSql: "",
    environment: "read",
    validation: {
      matchMode: "set",
      ignoreRowOrder: true,
      requiredKeywords: ["cross join"],
      minRows: 20,
      compareSql: "SELECT s.name, r.role_name FROM stores s CROSS JOIN employee_roles r",
    },
    unlockAfterAttempts: 2,
  },
  {
    id: "left-inventory",
    moduleId: "joins-avanzados",
    order: 1,
    title: "Productos con inventario, incluso sin existencias",
    difficulty: "intermedio",
    estimatedMinutes: 8,
    concepts: ["left-join"],
    suggestedTables: ["menu_items", "inventory"],
    objective: "LEFT JOIN conserva los productos aunque no tengan fila de inventario (como el geisha de reserva).",
    expectedResult: "Todos los productos del menú; quantity puede ser NULL si no hay inventario.",
    reasoningChecklist: [checklist.join, "¿Qué tabla no quieres perder?"],
    hints: [
      "Pon menu_items a la izquierda para no perder productos.",
      "FROM menu_items mi LEFT JOIN inventory i ON mi.item_id = i.item_id",
      "Un INNER JOIN ocultaría el producto que nunca se stockeó.",
    ],
    referenceSql: `SELECT mi.name, i.store_id, i.quantity_on_hand
FROM menu_items mi
LEFT JOIN inventory i ON i.item_id = mi.item_id`,
    referenceExplanation: [
      { clause: "LEFT JOIN inventory", text: "Si no hay match, las columnas de inventory llegan NULL, pero el producto sigue." },
    ],
    starterSql: "",
    environment: "read",
    validation: {
      matchMode: "exists",
      requiredKeywords: ["left join"],
      minRows: 19,
    },
    unlockAfterAttempts: 2,
  },
  {
    id: "customers-without-orders",
    moduleId: "joins-avanzados",
    order: 2,
    title: "Clientes sin órdenes (left anti join)",
    difficulty: "avanzado",
    estimatedMinutes: 9,
    concepts: ["left-anti-join"],
    suggestedTables: ["customers", "orders"],
    objective: "Un left anti join es LEFT JOIN + WHERE la llave derecha IS NULL. Encuentra clientes que nunca pidieron.",
    expectedResult: "Clientes como Olivia o Ulises si no tienen filas en orders.",
    reasoningChecklist: [checklist.join, checklist.filter],
    hints: [
      "Parte de customers, une órdenes a la izquierda y quédate con las que no matchearon.",
      "FROM customers c LEFT JOIN orders o ON c.customer_id = o.customer_id WHERE o.order_id IS NULL",
      "El WHERE sobre la PK de orders es lo que convierte el LEFT JOIN en anti join.",
    ],
    referenceSql: `SELECT c.customer_id, c.first_name, c.last_name, c.email
FROM customers c
LEFT JOIN orders o ON o.customer_id = c.customer_id
WHERE o.order_id IS NULL`,
    referenceExplanation: [
      { clause: "LEFT JOIN orders", text: "Intentamos encontrar órdenes de cada cliente." },
      { clause: "WHERE o.order_id IS NULL", text: "Nos quedamos solo con quienes no tuvieron coincidencia." },
    ],
    starterSql: "",
    environment: "read",
    validation: {
      matchMode: "set",
      ignoreRowOrder: true,
      requiredKeywords: ["left join", "is null"],
      compareSql: `SELECT c.email
FROM customers c
LEFT JOIN orders o ON o.customer_id = c.customer_id
WHERE o.order_id IS NULL`,
    },
    unlockAfterAttempts: 2,
  },
  {
    id: "never-sold",
    moduleId: "joins-avanzados",
    order: 3,
    title: "Productos nunca vendidos",
    difficulty: "avanzado",
    estimatedMinutes: 8,
    concepts: ["left-anti-join"],
    suggestedTables: ["menu_items", "order_items"],
    objective: "Encuentra productos del menú que no aparecen en ninguna línea de orden.",
    expectedResult: "Por ejemplo la edición geisha o la limonada si nadie la compró.",
    reasoningChecklist: [checklist.join, checklist.filter],
    hints: [
      "Mismo patrón anti join: menú a la izquierda, order_items a la derecha.",
      "LEFT JOIN order_items oi ON oi.item_id = mi.item_id WHERE oi.order_item_id IS NULL",
      "Filtra por la PK de order_items.",
    ],
    referenceSql: `SELECT mi.item_id, mi.name
FROM menu_items mi
LEFT JOIN order_items oi ON oi.item_id = mi.item_id
WHERE oi.order_item_id IS NULL`,
    referenceExplanation: [
      { clause: "WHERE oi.order_item_id IS NULL", text: "Si nunca se vendió, no hay línea de ticket que apunte al producto." },
    ],
    starterSql: "",
    environment: "read",
    validation: {
      matchMode: "set",
      ignoreRowOrder: true,
      requiredKeywords: ["left join"],
      compareSql: `SELECT mi.name
FROM menu_items mi
LEFT JOIN order_items oi ON oi.item_id = mi.item_id
WHERE oi.order_item_id IS NULL`,
    },
    unlockAfterAttempts: 2,
  },
  {
    id: "orders-without-payment",
    moduleId: "joins-avanzados",
    order: 4,
    title: "Órdenes sin pago registrado",
    difficulty: "avanzado",
    estimatedMinutes: 8,
    concepts: ["left-anti-join"],
    suggestedTables: ["orders", "payments"],
    objective: "Detecta órdenes que no tienen fila en payments.",
    expectedResult: "Órdenes pending/preparing/cancelled sin cobro, según el seed.",
    reasoningChecklist: [checklist.join],
    hints: [
      "LEFT JOIN payments y WHERE payment_id IS NULL.",
      "FROM orders o LEFT JOIN payments p ON p.order_id = o.order_id WHERE p.payment_id IS NULL",
      "Cuidado: hay un pago huérfano sin orden; este ejercicio pide lo contrario.",
    ],
    referenceSql: `SELECT o.order_id, o.status, o.order_date
FROM orders o
LEFT JOIN payments p ON p.order_id = o.order_id
WHERE p.payment_id IS NULL`,
    referenceExplanation: [
      { clause: "LEFT JOIN payments", text: "Conservamos todas las órdenes." },
      { clause: "WHERE p.payment_id IS NULL", text: "Anti join: órdenes sin pago." },
    ],
    starterSql: "",
    environment: "read",
    validation: {
      matchMode: "set",
      ignoreRowOrder: true,
      requiredKeywords: ["left join", "is null"],
      compareSql: `SELECT o.order_id
FROM orders o
LEFT JOIN payments p ON p.order_id = o.order_id
WHERE p.payment_id IS NULL`,
    },
    unlockAfterAttempts: 2,
  },
  {
    id: "spend-per-customer",
    moduleId: "joins-avanzados",
    order: 5,
    title: "Gasto total por cliente",
    difficulty: "avanzado",
    estimatedMinutes: 10,
    concepts: ["multi-join", "sum", "group-by"],
    suggestedTables: ["customers", "orders", "order_items"],
    objective: "Suma quantity * unit_price de las líneas, agrupando por cliente.",
    expectedResult: "Una fila por cliente que sí compró, con su gasto.",
    reasoningChecklist: [checklist.join, checklist.group],
    hints: [
      "Une clientes, órdenes y líneas. Multiplica cantidad por precio.",
      "SUM(oi.quantity * oi.unit_price) ... GROUP BY c.email",
      "INNER JOIN basta si solo quieres quienes compraron.",
    ],
    referenceSql: `SELECT c.email, SUM(oi.quantity * oi.unit_price) AS gasto
FROM customers c
JOIN orders o ON o.customer_id = c.customer_id
JOIN order_items oi ON oi.order_id = o.order_id
GROUP BY c.email`,
    referenceExplanation: [
      { clause: "SUM(quantity * unit_price)", text: "El gasto de una línea es cantidad por precio unitario." },
      { clause: "GROUP BY c.email", text: "Un total por persona." },
    ],
    starterSql: "",
    environment: "read",
    validation: {
      matchMode: "set",
      ignoreRowOrder: true,
      requiredKeywords: ["join", "sum", "group by"],
      compareSql: `SELECT o.customer_id, SUM(oi.quantity * oi.unit_price) AS gasto
FROM orders o
JOIN order_items oi ON oi.order_id = o.order_id
WHERE o.customer_id IS NOT NULL
GROUP BY o.customer_id`,
    },
    unlockAfterAttempts: 2,
  },
  {
    id: "best-sellers",
    moduleId: "joins-avanzados",
    order: 6,
    title: "Productos más vendidos",
    difficulty: "avanzado",
    estimatedMinutes: 9,
    concepts: ["sum", "group-by", "order-by"],
    suggestedTables: ["order_items", "menu_items"],
    objective: "Ranking de productos por piezas vendidas (SUM de quantity).",
    expectedResult: "Productos ordenados del más vendido al menos.",
    reasoningChecklist: [checklist.group, "¿El orden importa?"],
    hints: [
      "GROUP BY producto, SUM(quantity), ORDER BY esa suma DESC.",
      "JOIN menu_items para ver el nombre.",
      "TOP es opcional; el ranking completo también vale.",
    ],
    referenceSql: `SELECT mi.name, SUM(oi.quantity) AS piezas
FROM order_items oi
JOIN menu_items mi ON mi.item_id = oi.item_id
GROUP BY mi.name
ORDER BY piezas DESC`,
    referenceExplanation: [
      { clause: "SUM(oi.quantity)", text: "Piezas, no ingresos. El reto de ingresos viene después." },
      { clause: "ORDER BY piezas DESC", text: "El más vendido primero." },
    ],
    starterSql: "",
    environment: "read",
    validation: {
      matchMode: "ordered",
      ignoreRowOrder: false,
      requiredKeywords: ["sum", "group by", "order by"],
      compareSql: `SELECT item_id, SUM(quantity) AS piezas
FROM order_items
GROUP BY item_id
ORDER BY piezas DESC`,
    },
    unlockAfterAttempts: 2,
  },
  {
    id: "sales-per-store",
    moduleId: "joins-avanzados",
    order: 7,
    title: "Ventas por sucursal",
    difficulty: "avanzado",
    estimatedMinutes: 9,
    concepts: ["multi-join", "sum", "group-by"],
    suggestedTables: ["stores", "orders", "order_items"],
    objective: "Suma el importe de las líneas agrupando por sucursal.",
    expectedResult: "Nombre de store y total vendido.",
    reasoningChecklist: [checklist.join, checklist.group],
    hints: [
      "orders tiene store_id; el dinero está en order_items.",
      "JOIN stores, orders, order_items y SUM(quantity * unit_price)",
      "GROUP BY s.name",
    ],
    referenceSql: `SELECT s.name AS sucursal, SUM(oi.quantity * oi.unit_price) AS ventas
FROM stores s
JOIN orders o ON o.store_id = s.store_id
JOIN order_items oi ON oi.order_id = o.order_id
GROUP BY s.name`,
    referenceExplanation: [
      { clause: "JOIN orders + order_items", text: "La sucursal está en la orden; el monto, en las líneas." },
    ],
    starterSql: "",
    environment: "read",
    validation: {
      matchMode: "set",
      ignoreRowOrder: true,
      requiredKeywords: ["join", "sum", "group by"],
      compareSql: `SELECT o.store_id, SUM(oi.quantity * oi.unit_price) AS ventas
FROM orders o
JOIN order_items oi ON oi.order_id = o.order_id
GROUP BY o.store_id`,
    },
    unlockAfterAttempts: 2,
  },
  {
    id: "right-join-payments",
    moduleId: "joins-avanzados",
    order: 8,
    title: "RIGHT JOIN de órdenes y pagos",
    difficulty: "intermedio",
    estimatedMinutes: 7,
    concepts: ["right-join"],
    suggestedTables: ["orders", "payments"],
    objective: "Practica RIGHT JOIN: conserva todos los pagos, aunque no tengan orden (el pago huérfano del seed).",
    expectedResult: "Todas las filas de payments, con order_id posiblemente nulo.",
    reasoningChecklist: [checklist.join, "¿Cuál tabla quieres conservar entera?"],
    hints: [
      "FROM orders o RIGHT JOIN payments p ON p.order_id = o.order_id",
      "Equivale a payments LEFT JOIN orders, pero el ejercicio pide RIGHT JOIN.",
      "Verás el pago sin orden.",
    ],
    referenceSql: `SELECT o.order_id, p.payment_id, p.amount
FROM orders o
RIGHT JOIN payments p ON p.order_id = o.order_id`,
    referenceExplanation: [
      { clause: "RIGHT JOIN payments", text: "La tabla derecha se conserva completa, incluso el pago huérfano." },
    ],
    starterSql: "",
    environment: "read",
    validation: {
      matchMode: "exists",
      requiredKeywords: ["right join"],
      minRows: 1,
    },
    unlockAfterAttempts: 2,
  },
  {
    id: "full-anti-join",
    moduleId: "joins-avanzados",
    order: 9,
    title: "Full anti join de órdenes y pagos",
    difficulty: "avanzado",
    estimatedMinutes: 10,
    concepts: ["full-anti-join", "full-outer-join"],
    suggestedTables: ["orders", "payments"],
    objective: "Un full anti join es FULL OUTER JOIN más WHERE alguna llave es NULL: lo que no empató de ningún lado.",
    expectedResult: "Órdenes sin pago y pagos sin orden, no las parejas sanas.",
    reasoningChecklist: [checklist.join, checklist.filter],
    hints: [
      "FULL OUTER JOIN une ambos lados; luego filtra nulos.",
      "FROM orders o FULL OUTER JOIN payments p ON p.order_id = o.order_id WHERE o.order_id IS NULL OR p.payment_id IS NULL",
      "Eso deja solo inconsistencias.",
    ],
    referenceSql: `SELECT o.order_id, p.payment_id, p.amount, o.status
FROM orders o
FULL OUTER JOIN payments p ON p.order_id = o.order_id
WHERE o.order_id IS NULL OR p.payment_id IS NULL`,
    referenceExplanation: [
      { clause: "FULL OUTER JOIN", text: "Trae coincidencias, órdenes solas y pagos solos." },
      { clause: "WHERE ... IS NULL", text: "Nos quedamos con lo que no cruzó: el anti join completo." },
    ],
    starterSql: "",
    environment: "read",
    validation: {
      matchMode: "set",
      ignoreRowOrder: true,
      requiredKeywords: ["full", "join"],
      compareSql: `SELECT o.order_id, p.payment_id
FROM orders o
FULL OUTER JOIN payments p ON p.order_id = o.order_id
WHERE o.order_id IS NULL OR p.payment_id IS NULL`,
    },
    unlockAfterAttempts: 2,
  },
];
