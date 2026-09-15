import type { Lesson } from "@/data/types";

function lesson(
  id: string,
  title: string,
  summary: string,
  structure: string,
  example: string,
  mistakes: string[],
  whenToUse: string,
  quiz: Lesson["quiz"]
): Lesson {
  return { id, title, minutes: 3, summary, structure, example, commonMistakes: mistakes, whenToUse, quiz };
}

export const LESSONS: Lesson[] = [
  lesson(
    "select",
    "SELECT",
    "SELECT pide las columnas que quieres ver. Es el punto de partida de casi toda consulta de lectura.",
    "SELECT columnas FROM tabla;",
    "SELECT name, city FROM stores; pide solo dos columnas de sucursales, no el resto.",
    ["Olvidar la coma entre columnas", "Creer que SELECT cambia la tabla"],
    "Siempre que quieras leer datos. Empieza aquí.",
    {
      question: "¿SELECT modifica las filas guardadas?",
      options: ["Sí, las sobrescribe", "No, solo las muestra", "Solo si usas asterisco"],
      answer: 1,
      explanation: "SELECT es de lectura. INSERT, UPDATE y DELETE sí cambian datos.",
    }
  ),
  lesson(
    "select-columns",
    "Selección de columnas específicas",
    "En lugar de SELECT *, nombra las columnas. El resultado es más claro y evitas datos innecesarios.",
    "SELECT col1, col2 FROM tabla;",
    "SELECT first_name, email FROM customers; no trae teléfono ni ciudad.",
    ["Usar * en reportes finales", "Escribir mal el nombre de una columna"],
    "Cuando ya sabes qué pregunta quieres responder.",
    {
      question: "¿Qué ventaja tiene listar columnas frente a *?",
      options: ["Es más rápido de escribir", "El resultado es más preciso y legible", "Permite borrar filas"],
      answer: 1,
      explanation: "Listar columnas documenta la intención y evita sorpresas si la tabla gana campos nuevos.",
    }
  ),
  lesson(
    "alias",
    "Alias con AS",
    "AS pone un apodo a una columna o tabla solo en el resultado. La tabla real no cambia de nombre.",
    "SELECT precio AS price FROM ...  |  FROM menu_items AS mi",
    "SELECT AVG(price) AS precio_promedio FROM menu_items;",
    ["Creer que AS renombra la columna en el disco", "Olvidar comillas si el alias tiene espacios"],
    "Para encabezados claros o para acortar nombres de tabla en JOINs.",
    {
      question: "Si haces email AS correo, ¿cambia customers.email?",
      options: ["Sí", "No, solo el encabezado del resultado", "Solo en sandbox"],
      answer: 1,
      explanation: "El alias es cosmética del SELECT.",
    }
  ),
  lesson(
    "distinct",
    "DISTINCT",
    "DISTINCT elimina filas duplicadas del resultado. Útil para listas de valores únicos.",
    "SELECT DISTINCT columna FROM tabla;",
    "SELECT DISTINCT city FROM customers; muestra cada ciudad una vez.",
    ["Usarlo para «arreglar» un JOIN mal hecho que multiplica filas", "Olvidar que DISTINCT aplica a toda la fila seleccionada"],
    "Cuando te importan valores únicos, no cada repetición.",
    {
      question: "SELECT DISTINCT first_name, city ¿cuándo es duplicado?",
      options: ["Si el nombre se repite", "Si la pareja nombre+ciudad se repite", "Nunca"],
      answer: 1,
      explanation: "DISTINCT mira la combinación de columnas pedidas.",
    }
  ),
  lesson(
    "from",
    "FROM",
    "FROM indica la tabla (o subconsulta) de donde salen las filas. Sin FROM, PostgreSQL solo permite expresiones sueltas.",
    "SELECT ... FROM esquema.tabla",
    "SELECT * FROM coffee_chain.stores; lee la tabla de sucursales.",
    ["Escribir mal el nombre", "Olvidar el esquema si no está en search_path"],
    "En toda consulta que lea tablas.",
    {
      question: "¿Qué hace FROM customers?",
      options: ["Crea la tabla", "Elige la fuente de filas", "Ordena clientes"],
      answer: 1,
      explanation: "FROM es la fuente; SELECT elige columnas; WHERE filtra.",
    }
  ),
  lesson(
    "where",
    "WHERE",
    "WHERE filtra filas individuales antes de agrupar. Cada fila se evalúa como verdadera o falsa.",
    "SELECT ... FROM tabla WHERE condición;",
    "SELECT name FROM menu_items WHERE price > 50;",
    ["Poner agregaciones en WHERE (usa HAVING)", "Comparar NULL con ="],
    "Cuando quieres un subconjunto: una ciudad, un rango de precios, un estado.",
    {
      question: "WHERE se evalúa...",
      options: ["Después de GROUP BY", "Antes de agrupar, sobre cada fila", "Solo con JOIN"],
      answer: 1,
      explanation: "El orden mental: FROM → WHERE → GROUP BY → HAVING → SELECT → ORDER BY.",
    }
  ),
  lesson(
    "comparison",
    "Operadores de comparación",
    "= != <> > < >= <= comparan números, texto y fechas. != y <> significan distinto.",
    "WHERE price >= 40 AND price <> 120",
    "SELECT * FROM employees WHERE hired_at >= DATE '2022-01-01';",
    ["Usar = para NULL", "Comparar texto y número sin convertir"],
    "Filtros simples de igualdad, rangos y desigualdades.",
    {
      question: "¿price >= 50 incluye el 50?",
      options: ["No", "Sí", "Solo con BETWEEN"],
      answer: 1,
      explanation: ">= es inclusivo. > 50 dejaría fuera el 50.",
    }
  ),
  lesson(
    "and",
    "AND, OR y NOT",
    "AND exige todas las condiciones; OR se conforma con una; NOT niega. Usa paréntesis cuando mezcles AND y OR.",
    "WHERE a AND (b OR c)",
    "WHERE is_available = TRUE AND (price < 40 OR price > 80)",
    ["Olvidar paréntesis: AND se evalúa antes que OR", "Encadenar OR cuando IN sería más claro"],
    "Filtros compuestos de negocio.",
    {
      question: "TRUE OR FALSE AND FALSE ¿qué sale si no hay paréntesis?",
      options: ["FALSE", "TRUE, porque AND va primero: TRUE OR (FALSE AND FALSE)", "Error"],
      answer: 1,
      explanation: "AND tiene precedencia. Pon paréntesis siempre que dudes.",
    }
  ),
  lesson(
    "or",
    "OR",
    "OR es verdadero si al menos una condición se cumple. Demasiados OR sobre la misma columna piden a gritos un IN.",
    "WHERE ciudad = 'Puebla' OR ciudad = 'Oaxaca'",
    "SELECT * FROM stores WHERE city = 'Puebla' OR city = 'Oaxaca';",
    ["Mezclar OR con AND sin paréntesis"],
    "Alternativas: este o aquel.",
    {
      question: "¿OR requiere que ambas condiciones sean verdaderas?",
      options: ["Sí", "No, basta una", "Solo con números"],
      answer: 1,
      explanation: "AND exige ambas; OR exige al menos una.",
    }
  ),
  lesson(
    "not",
    "NOT",
    "NOT invierte una condición. WHERE NOT status = 'cancelled' equivale a status <> 'cancelled'.",
    "WHERE NOT condición",
    "SELECT * FROM orders WHERE NOT status = 'cancelled';",
    ["NOT IN con NULL puede dar sorpresas", "Negar de más y perder filas"],
    "Exclusiones claras: «todo menos X».",
    {
      question: "NOT TRUE es...",
      options: ["TRUE", "FALSE", "NULL"],
      answer: 1,
      explanation: "NOT FALSE = TRUE; NOT NULL sigue siendo NULL.",
    }
  ),
  lesson(
    "in",
    "IN",
    "IN compara un valor contra una lista o contra un subquery. Es más legible que varios OR.",
    "WHERE col IN (v1, v2)  |  WHERE col IN (SELECT ...)",
    "WHERE mc.name IN ('Espresso', 'Frías')",
    ["Listas vacías", "NOT IN con NULL en la lista"],
    "Pertenencia a un conjunto pequeño o a otro SELECT.",
    {
      question: "x IN (1,2,3) es equivalente a...",
      options: ["x = 1 AND x = 2", "x = 1 OR x = 2 OR x = 3", "x BETWEEN 1 AND 3"],
      answer: 1,
      explanation: "IN es una cadena de OR de igualdades. BETWEEN es un rango continuo.",
    }
  ),
  lesson(
    "between",
    "BETWEEN",
    "BETWEEN es un rango inclusivo: incluye el inicio y el fin. Funciona con números, fechas y texto.",
    "WHERE col BETWEEN a AND b",
    "WHERE price BETWEEN 40 AND 60  — incluye 40 y 60.",
    ["Creer que el máximo queda fuera", "Poner el mayor primero: BETWEEN 60 AND 40 no trae filas"],
    "Rangos de precio, fechas de un mes, ids consecutivos.",
    {
      question: "BETWEEN 40 AND 60 incluye 40 y 60?",
      options: ["Solo 40", "Sí, ambos", "Ninguno"],
      answer: 1,
      explanation: "Inclusivo en los dos extremos.",
    }
  ),
  lesson(
    "like",
    "LIKE e ILIKE",
    "% significa cualquier cadena; _ un carácter. LIKE distingue mayúsculas en PostgreSQL; ILIKE no.",
    "WHERE name ILIKE '%latte%'",
    "Buscar «café» en el nombre: name ILIKE '%café%'",
    ["Olvidar los % y buscar igualdad accidental", "Usar LIKE cuando el usuario no controla mayúsculas"],
    "Búsquedas de texto parcial: contiene, empieza con, termina con.",
    {
      question: "En PostgreSQL, 'Latte' LIKE 'latte' ...",
      options: ["coincide", "no coincide; usa ILIKE", "da error"],
      answer: 1,
      explanation: "LIKE es sensible a mayúsculas. ILIKE es la variante amable.",
    }
  ),
  lesson(
    "ilike",
    "ILIKE",
    "ILIKE es LIKE sin importar mayúsculas. En una app de principiantes casi siempre es la mejor opción para nombres.",
    "WHERE col ILIKE patrón",
    "WHERE email ILIKE '%@mail.dev'",
    ["Olvidar que % sigue siendo necesario para «contiene»"],
    "Filtros de texto escritos por humanos.",
    {
      question: "¿Qué patrón significa «contiene mocha»?",
      options: ["mocha", "%mocha%", "mocha%"],
      answer: 1,
      explanation: "% a ambos lados: cualquier cosa antes y después.",
    }
  ),
  lesson(
    "is-null",
    "IS NULL e IS NOT NULL",
    "NULL no es igual a nada, ni siquiera a otro NULL. Pregunta con IS NULL / IS NOT NULL.",
    "WHERE phone IS NULL",
    "Clientes sin teléfono: WHERE phone IS NULL. Pagos fechados: WHERE paid_at IS NOT NULL.",
    ["WHERE phone = NULL — no trae filas", "Confundir NULL con cadena vacía"],
    "Detectar datos faltantes o completar anti joins.",
    {
      question: "¿phone = NULL encuentra teléfonos vacíos?",
      options: ["Sí", "No; usa IS NULL", "Solo en sandbox"],
      answer: 1,
      explanation: "Toda comparación con NULL da NULL (ni verdadero ni falso). IS NULL sí funciona.",
    }
  ),
  lesson(
    "is-not-null",
    "IS NOT NULL",
    "Conserva filas donde el valor sí existe. Complemento de IS NULL.",
    "WHERE paid_at IS NOT NULL",
    "SELECT * FROM payments WHERE paid_at IS NOT NULL;",
    ["Negar mal: NOT phone = NULL sigue sin servir"],
    "Cuando el dato opcional ya fue capturado.",
    {
      question: "IS NOT NULL sobre paid_at deja...",
      options: ["Pagos sin fecha", "Pagos con fecha conocida", "Todas las filas"],
      answer: 1,
      explanation: "Filtra los nulos hacia fuera.",
    }
  ),
  lesson(
    "order-by",
    "ORDER BY",
    "Ordena el resultado. ASC es por defecto; DESC invierte. Puedes ordenar por varias columnas.",
    "ORDER BY col DESC, col2",
    "Órdenes recientes: ORDER BY order_date DESC",
    ["Ordenar por un alias que aún no existe en algunos motores — en PG el alias del SELECT sí se puede usar", "Olvidar DESC en rankings"],
    "Rankings, listas alfabéticas, cronología.",
    {
      question: "¿ORDER BY se aplica antes o después de LIMIT?",
      options: ["Después, por eso LIMIT 10 toma las 10 primeras ya ordenadas", "Antes no influye", "Nunca juntos"],
      answer: 0,
      explanation: "Primero se ordena, luego se recorta.",
    }
  ),
  lesson(
    "limit",
    "LIMIT",
    "LIMIT N deja solo N filas. OFFSET salta filas; para principiantes, LIMIT basta.",
    "SELECT ... LIMIT 10",
    "SELECT * FROM menu_items LIMIT 5; para explorar.",
    ["LIMIT sin ORDER BY: el recorte no es un ranking estable", "Olvidarlo en tablas grandes"],
    "Exploración y tops: «los 10 más…».",
    {
      question: "LIMIT 10 sin ORDER BY...",
      options: ["siempre los 10 más caros", "diez filas, pero no un ranking garantizado", "error"],
      answer: 1,
      explanation: "Sin ORDER BY el motor puede devolver cualquier decena.",
    }
  ),
  lesson(
    "count",
    "COUNT",
    "COUNT(*) cuenta filas. COUNT(columna) ignora nulos de esa columna.",
    "SELECT COUNT(*) FROM tabla;",
    "SELECT COUNT(*) FROM customers; — cuántos clientes hay.",
    ["COUNT(col) cuando querías contar filas con nulos", "Usar COUNT en WHERE"],
    "Totales: clientes, productos, órdenes.",
    {
      question: "COUNT(*) vs COUNT(phone) si hay teléfonos nulos...",
      options: ["Dan lo mismo", "COUNT(phone) es menor porque ignora NULL", "COUNT(*) falla"],
      answer: 1,
      explanation: "COUNT(columna) no cuenta nulos.",
    }
  ),
  lesson(
    "sum",
    "SUM",
    "SUM agrega números. SUM(quantity * unit_price) es el patrón clásico de ingresos.",
    "SELECT SUM(col) FROM tabla;",
    "SUM(quantity_on_hand) en inventory para existencias totales.",
    ["Sumar texto", "Olvidar GROUP BY cuando hay otras columnas"],
    "Importes, piezas, costos de compra.",
    {
      question: "SUM ignora NULL?",
      options: ["Sí, los trata como si no estuvieran", "No, el resultado se vuelve NULL siempre", "Convierte NULL en 0 y falla"],
      answer: 0,
      explanation: "Las funciones de agregación ignoran NULL, salvo COUNT(*).",
    }
  ),
  lesson(
    "avg",
    "AVG",
    "AVG calcula el promedio. Ignora nulos. No es la mediana.",
    "SELECT AVG(price) FROM menu_items;",
    "AVG(price) por categoría con GROUP BY.",
    ["Creer que AVG cuenta nulos como cero", "Promediar promedios de grupos de distinto tamaño sin cuidado"],
    "Precios medios, ticket promedio.",
    {
      question: "AVG es...",
      options: ["la mediana", "la media aritmética", "el valor más frecuente"],
      answer: 1,
      explanation: "Media: suma dividida entre cantidad de no nulos.",
    }
  ),
  lesson(
    "min",
    "MIN y MAX",
    "MIN y MAX obtienen extremos. Funcionan con números, fechas y texto.",
    "SELECT MIN(price), MAX(price) FROM menu_items;",
    "MAX(order_date) es la orden más reciente.",
    ["Usarlos pensando que ordenan toda la tabla", "Olvidar que MIN de texto es alfabético"],
    "Rangos observados: más barato, más reciente, primer nombre.",
    {
      question: "MIN(order_date) es...",
      options: ["la orden más nueva", "la orden más antigua", "un promedio"],
      answer: 1,
      explanation: "Fechas menores son anteriores.",
    }
  ),
  lesson(
    "max",
    "MAX",
    "MAX elige el valor más grande del grupo o de la tabla.",
    "SELECT MAX(col) FROM tabla;",
    "SELECT MAX(price) FROM menu_items; el producto más caro.",
    ["Esperar que MAX devuelva toda la fila del máximo — solo devuelve el valor, salvo que filtres o uses DISTINCT ON"],
    "Extremos superiores.",
    {
      question: "SELECT MAX(price), name FROM menu_items sin GROUP BY...",
      options: ["es válido en PostgreSQL estricto", "falla porque name no está agregado", "devuelve todos los nombres"],
      answer: 1,
      explanation: "Cada columna no agregada debe ir en GROUP BY.",
    }
  ),
  lesson(
    "group-by",
    "GROUP BY",
    "GROUP BY parte las filas en grupos que comparten un valor. Las funciones de agregación se calculan por grupo.",
    "SELECT col, COUNT(*) FROM tabla GROUP BY col;",
    "Empleados por sucursal: GROUP BY store_id.",
    ["Seleccionar una columna que no está en GROUP BY ni agregada", "Filtrar grupos con WHERE"],
    "Reportes «por categoría», «por sucursal», «por cliente».",
    {
      question: "Sin GROUP BY, COUNT(*) ...",
      options: ["cuenta por fila", "resume toda la tabla en una fila", "da error"],
      answer: 1,
      explanation: "Una agregación sin GROUP BY colapsa todo a un único resumen.",
    }
  ),
  lesson(
    "having",
    "HAVING",
    "WHERE filtra filas antes de agrupar. HAVING filtra grupos después de COUNT() o AVG(). Si quieres categorías con más de tres productos, necesitas HAVING porque filtras un resultado calculado.",
    "GROUP BY col HAVING COUNT(*) > 3",
    "SELECT category_id, COUNT(*) FROM menu_items GROUP BY category_id HAVING COUNT(*) > 3;",
    ["Poner COUNT en WHERE", "Usar HAVING para filtros de fila que podían ir en WHERE"],
    "Condiciones sobre totales, promedios o conteos de cada grupo.",
    {
      question: "¿Dónde filtras COUNT(*) > 3?",
      options: ["WHERE", "HAVING", "ORDER BY"],
      answer: 1,
      explanation: "COUNT se calcula al agrupar; HAVING ocurre después.",
    }
  ),
  lesson(
    "inner-join",
    "INNER JOIN",
    "INNER JOIN combina filas de dos tablas cuando la condición ON se cumple. Si no hay match, la fila desaparece.",
    "FROM a JOIN b ON a.id = b.a_id",
    "Productos con su categoría: menu_items JOIN menu_categories ON category_id.",
    ["Olvidar ON y producir un CROSS JOIN", "Usar INNER cuando querías ver los que no matchean"],
    "Cuando solo te importan las coincidencias: ticket con nombre de producto.",
    {
      question: "Una orden con customer_id NULL en INNER JOIN customers...",
      options: ["aparece con cliente vacío", "no aparece", "duplica filas"],
      answer: 1,
      explanation: "Sin coincidencia, INNER JOIN la descarta.",
    }
  ),
  lesson(
    "left-join",
    "LEFT JOIN",
    "LEFT JOIN conserva todas las filas de la tabla izquierda. Si no hay match, las columnas de la derecha son NULL.",
    "FROM a LEFT JOIN b ON ...",
    "Productos LEFT JOIN inventory: ves incluso los que no tienen existencias.",
    ["Poner la tabla importante a la derecha", "Filtrar b.col = x en WHERE y convertir el LEFT en INNER accidentalmente"],
    "Listas completas con datos opcionales a la derecha.",
    {
      question: "¿Qué tabla no se pierde en LEFT JOIN?",
      options: ["La derecha", "La izquierda", "Ninguna se conserva segura"],
      answer: 1,
      explanation: "Left = izquierda = se conserva.",
    }
  ),
  lesson(
    "right-join",
    "RIGHT JOIN",
    "RIGHT JOIN conserva la tabla derecha. Es simétrico al LEFT JOIN. Muchos equipos escriben siempre LEFT y cambian el orden de las tablas.",
    "FROM a RIGHT JOIN b ON ...",
    "orders RIGHT JOIN payments conserva todos los pagos, incluso huérfanos.",
    ["Mezclar LEFT y RIGHT hasta marearse", "Olvidar que es el espejo del LEFT"],
    "Cuando quieres anclar el resultado a la segunda tabla.",
    {
      question: "RIGHT JOIN B equivale a...",
      options: ["INNER JOIN", "B LEFT JOIN A (invirtiendo tablas)", "CROSS JOIN"],
      answer: 1,
      explanation: "Es el mismo recetario al revés.",
    }
  ),
  lesson(
    "full-outer-join",
    "FULL OUTER JOIN",
    "FULL OUTER JOIN conserva coincidencias y también las filas de ambos lados que no cruzaron. Ideal para auditar inconsistencias.",
    "FROM a FULL OUTER JOIN b ON ...",
    "orders FULL OUTER JOIN payments: ves órdenes sin pago y pagos sin orden.",
    ["Usarlo como INNER «por si acaso» — genera nulos de más", "Olvidar que ambas PKs pueden ser NULL en una fila"],
    "Conciliaciones: lo que debería empatar y no empata.",
    {
      question: "FULL JOIN incluye filas sin match de ambos lados?",
      options: ["No", "Sí", "Solo la izquierda"],
      answer: 1,
      explanation: "Esa es su razón de ser.",
    }
  ),
  lesson(
    "left-anti-join",
    "Left anti join",
    "No es una palabra clave nueva: es LEFT JOIN más WHERE b.id IS NULL. Devuelve filas de A sin pareja en B.",
    "FROM a LEFT JOIN b ON ... WHERE b.pk IS NULL",
    "Clientes sin órdenes: customers LEFT JOIN orders WHERE orders.order_id IS NULL.",
    ["Filtrar con b.id = NULL en vez de IS NULL", "Usar INNER JOIN, que nunca muestra los huérfanos"],
    "«Los que nunca…»: nunca compraron, nunca se vendieron, nunca se pagaron.",
    {
      question: "La pieza que convierte LEFT JOIN en anti join es...",
      options: ["GROUP BY", "WHERE la llave derecha IS NULL", "LIMIT"],
      answer: 1,
      explanation: "Nos quedamos con las no-coincidencias.",
    }
  ),
  lesson(
    "full-anti-join",
    "Full anti join",
    "FULL OUTER JOIN + WHERE a.id IS NULL OR b.id IS NULL: solo lo que no empató, de cualquier lado.",
    "FULL OUTER JOIN ... WHERE a.pk IS NULL OR b.pk IS NULL",
    "Órdenes sin pago y pagos sin orden en un solo listado de problemas.",
    ["Olvidar el OR y dejar solo un lado", "Confundirlo con EXCEPT, que resta conjuntos alineados"],
    "Calidad de datos e inconsistencias bidireccionales.",
    {
      question: "Un full anti join deja...",
      options: ["Solo matches", "Solo no-matches de ambos lados", "Toda la tabla A"],
      answer: 1,
      explanation: "Las filas sanas (con match) se filtran fuera.",
    }
  ),
  lesson(
    "cross-join",
    "CROSS JOIN",
    "CROSS JOIN es el producto cartesiano: cada fila de A con cada fila de B. Sin ON. Peligroso en tablas grandes; útil para generar combinaciones.",
    "FROM a CROSS JOIN b",
    "stores CROSS JOIN employee_roles: cada sucursal con cada puesto posible.",
    ["Olvidar ON en un JOIN normal y obtener un CROSS accidental", "Hacerlo entre orders y order_items sin filtro"],
    "Combinaciones posibles, reportes de grilla (sucursal × producto) antes del LEFT JOIN de hechos.",
    {
      question: "4 sucursales y 5 roles en CROSS JOIN dan...",
      options: ["9 filas", "20 filas", "1 fila"],
      answer: 1,
      explanation: "4 × 5 = 20.",
    }
  ),
  lesson(
    "multi-join",
    "Joins de múltiples tablas",
    "Puedes encadenar varios JOIN. Cada uno añade una tabla y un ON. Piensa en el camino de llaves: orden → sucursal, orden → cliente, línea → producto.",
    "FROM a JOIN b ON ... JOIN c ON ...",
    "Empleado + rol + sucursal: tres tablas, dos JOINs.",
    ["ON mal puesto que une tablas que no se relacionan", "Multiplicar filas y SUM de más sin agrupar"],
    "Cualquier reporte de negocio real.",
    {
      question: "¿Hace falta subquery para 3 tablas relacionadas?",
      options: ["Siempre", "No, puedes encadenar JOIN", "Solo con UNION"],
      answer: 1,
      explanation: "Los JOIN se apilan.",
    }
  ),
  lesson(
    "union",
    "UNION",
    "UNION apila dos SELECTs con el mismo número de columnas y quita duplicados. Los tipos deben ser compatibles.",
    "SELECT ... UNION SELECT ...",
    "Nombres de clientes UNION nombres de empleados.",
    ["Columnas distintas en número", "Usar UNION cuando querías JOIN (apilar no es relacionar)"],
    "Listas del mismo «tipo de cosa» que viven en tablas distintas.",
    {
      question: "UNION vs JOIN...",
      options: ["Son lo mismo", "UNION apila filas; JOIN combina columnas de filas relacionadas", "UNION borra tablas"],
      answer: 1,
      explanation: "Apilar no es cruzar.",
    }
  ),
  lesson(
    "union-all",
    "UNION ALL",
    "UNION ALL apila sin deduplicar. Es más barato y conserva repeticiones a propósito.",
    "SELECT ... UNION ALL SELECT ...",
    "Contar apariciones de un nombre en clientes y empleados por separado, apiladas.",
    ["Usar UNION ALL creyendo que quita duplicados"],
    "Cuando los duplicados importan o cuando ya sabes que no hay repetidos.",
    {
      question: "UNION ALL elimina duplicados?",
      options: ["Sí", "No", "Solo numéricos"],
      answer: 1,
      explanation: "ALL = conserva todo.",
    }
  ),
  lesson(
    "except",
    "EXCEPT",
    "EXCEPT resta conjuntos: filas de la consulta A que no están en B. El orden A EXCEPT B importa.",
    "SELECT id FROM a EXCEPT SELECT id FROM b",
    "customer_id de customers EXCEPT customer_id de orders: clientes sin compra.",
    ["Restar columnas distintas", "Invertir A y B sin querer"],
    "Diferencias: «en el menú pero no en inventario».",
    {
      question: "A EXCEPT B es igual a B EXCEPT A?",
      options: ["Sí", "No", "Solo con UNION"],
      answer: 1,
      explanation: "La resta no es conmutativa.",
    }
  ),
  lesson(
    "intersect",
    "INTERSECT",
    "INTERSECT se queda con filas presentes en ambas consultas.",
    "SELECT id FROM a INTERSECT SELECT id FROM b",
    "item_id del menú INTERSECT item_id de inventory: productos catalogados y stockeados.",
    ["Esperar columnas extra de las tablas originales — INTERSECT solo ve las columnas seleccionadas"],
    "Coincidencias de conjuntos, no de filas relacionadas (eso es JOIN).",
    {
      question: "INTERSECT devuelve...",
      options: ["la unión", "solo lo común", "la resta"],
      answer: 1,
      explanation: "Intersección de conjuntos.",
    }
  ),
  lesson(
    "create-table",
    "CREATE TABLE",
    "Define una tabla nueva: nombre, columnas, tipos y restricciones. En este playground solo en sql_playground.",
    "CREATE TABLE nombre (col TIPO restricciones);",
    "CREATE TABLE tasting_notes (note_id SERIAL PRIMARY KEY, flavor TEXT);",
    ["Crear en coffee_chain — está bloqueado", "Olvidar tipos"],
    "Cuando necesitas una estructura nueva de práctica.",
    {
      question: "SERIAL es...",
      options: ["texto", "entero autoincremental", "fecha"],
      answer: 1,
      explanation: "PostgreSQL genera el número por ti.",
    }
  ),
  lesson(
    "alter-table",
    "ALTER TABLE",
    "Cambia la estructura: ADD COLUMN, DROP COLUMN, RENAME. No es lo mismo que UPDATE (que cambia valores).",
    "ALTER TABLE t ADD COLUMN c TIPO;",
    "ALTER TABLE practice_menu_items ADD COLUMN is_seasonal BOOLEAN;",
    ["ALTER cuando querías UPDATE", "DROP COLUMN sin backup en producción"],
    "Evolucionar el molde de una tabla de práctica.",
    {
      question: "ADD COLUMN cambia filas o el molde?",
      options: ["Solo filas", "El molde (y rellena DEFAULT en filas viejas)", "Nada"],
      answer: 1,
      explanation: "Es DDL: estructura.",
    }
  ),
  lesson(
    "drop-table",
    "DROP TABLE",
    "Elimina la tabla y sus datos. DROP SCHEMA está bloqueado aquí porque borraría todo un universo de tablas.",
    "DROP TABLE IF EXISTS nombre;",
    "DROP TABLE tasting_notes; solo en sandbox.",
    ["DROP sin IF EXISTS en reintentos", "Intentar DROP SCHEMA coffee_chain"],
    "Limpiar tablas de práctica que ya no sirvan.",
    {
      question: "¿DROP SCHEMA está permitido en SQL Coffee Playground?",
      options: ["Sí", "No, nunca", "Solo con WHERE"],
      answer: 1,
      explanation: "Es demasiado destructivo. El filtro de seguridad lo bloquea.",
    }
  ),
  lesson(
    "insert",
    "INSERT",
    "Agrega filas. Lista columnas y VALUES. Respeta UNIQUE y NOT NULL.",
    "INSERT INTO t (c1, c2) VALUES (v1, v2);",
    "INSERT INTO practice_customers (first_name, last_name, email) VALUES ('Mia', 'Sandbox', 'mia@x.dev');",
    ["Olvidar una columna NOT NULL", "Insertar en coffee_chain — bloqueado"],
    "Cargar datos de práctica.",
    {
      question: "INSERT afecta coffee_chain en esta app?",
      options: ["Sí", "No, solo sql_playground", "Solo si confirmas"],
      answer: 1,
      explanation: "Las escrituras van al sandbox.",
    }
  ),
  lesson(
    "update",
    "UPDATE",
    "Cambia valores de filas existentes. SET define el nuevo valor; WHERE elige cuáles. Sin WHERE, esta app bloquea.",
    "UPDATE t SET col = valor WHERE condición;",
    "UPDATE practice_customers SET city = 'Veracruz' WHERE email = 'nora.prueba@sandbox.dev';",
    ["Olvidar WHERE", "WHERE demasiado amplio"],
    "Corregir un dato puntual.",
    {
      question: "¿Por qué exigimos WHERE?",
      options: ["Por estética", "Para no actualizar todas las filas por accidente", "PostgreSQL lo exige siempre"],
      answer: 1,
      explanation: "PostgreSQL sí permite UPDATE sin WHERE; por eso el playground lo bloquea.",
    }
  ),
  lesson(
    "delete",
    "DELETE",
    "Borra filas. WHERE es obligatorio aquí. DELETE sin WHERE vaciaría la tabla.",
    "DELETE FROM t WHERE condición;",
    "DELETE FROM practice_customers WHERE email = 'omar.demo@sandbox.dev';",
    ["Confundir DELETE con DROP TABLE", "WHERE laxo"],
    "Quitar un registro de práctica concreto.",
    {
      question: "DELETE FROM t vs DROP TABLE t...",
      options: ["Es lo mismo", "DELETE borra filas; DROP elimina la tabla", "DROP solo borra una fila"],
      answer: 1,
      explanation: "DELETE es DML; DROP es DDL.",
    }
  ),
  lesson(
    "security",
    "Buenas prácticas al modificar datos",
    "Nunca ejecutes UPDATE/DELETE sin WHERE en producción. Usa transacciones, backups y entornos de práctica. Esta app separa lectura real y sandbox, bloquea TRUNCATE y DROP SCHEMA, y te pide confirmar el impacto.",
    "Leer → filtrar con WHERE → confirmar recuento → escribir → verificar.",
    "Antes de DELETE, un SELECT COUNT(*) con el mismo WHERE te dice cuántas filas caerían.",
    ["Probar DML en datos reales", "Confiar en que «son pocas filas» sin contar"],
    "Siempre que cambies datos, incluso en ejercicios.",
    {
      question: "Si un DELETE sin WHERE se cuela en producción...",
      options: ["Borra una fila", "Puede vaciar la tabla", "No hace nada"],
      answer: 1,
      explanation: "Esa es la razón del bloqueo pedagógico.",
    }
  ),
];

export function getLesson(id: string) {
  return LESSONS.find((item) => item.id === id);
}

export function conceptOfTheDay(date = new Date()) {
  const start = Date.UTC(date.getUTCFullYear(), 0, 0);
  const diff = date.getTime() - start;
  const day = Math.floor(diff / (1000 * 60 * 60 * 24));
  return LESSONS[day % LESSONS.length];
}
