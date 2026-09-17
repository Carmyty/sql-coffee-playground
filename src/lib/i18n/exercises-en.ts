import type { Exercise } from "@/data/types";
import type { Locale } from "@/lib/i18n/messages";

export type ExerciseLocaleFields = {
  title: string;
  objective: string;
  expectedResult: string;
  hints: [string, string, string];
  reasoningChecklist: string[];
  referenceExplanation: Array<{ clause: string; text: string }>;
};

const EN: Record<string, ExerciseLocaleFields> = {
  "all-customers": {
    title: "Show all customers",
    objective: "Bring every column and every row from the customers table to explore the raw data.",
    expectedResult: "A table with each registered customer: names, email, city, and the rest of the columns.",
    hints: [
      "To see a full table you use SELECT with an asterisk and FROM with the table name.",
      "SELECT * FROM [table];",
      "1) Identify the customers table. 2) Ask for all columns. 3) No WHERE is needed yet.",
    ],
    reasoningChecklist: ["Which table holds the data?", "Do you need to filter rows with WHERE?"],
    referenceExplanation: [
      { clause: "SELECT *", text: "The asterisk requests every available column." },
      { clause: "FROM customers", text: "States that the rows come from the customers table." },
    ],
  },
  "customer-name-email": {
    title: "Customer name and email",
    objective: "Instead of fetching the whole table, ask only for name and email. Clearer and safer.",
    expectedResult: "Name (or names) and email columns for each customer, without phone or city unless you ask for them.",
    hints: [
      "List columns separated by commas after SELECT.",
      "SELECT [column1], [column2] FROM [table];",
      "Use first_name, last_name and email, or concatenate names if you want. The email must be there.",
    ],
    reasoningChecklist: ["Which table holds the data?", "Which exact columns do you need?"],
    referenceExplanation: [
      { clause: "SELECT first_name, last_name, email", text: "We request three specific columns, not the rest." },
      { clause: "FROM customers", text: "We keep reading the customers table." },
    ],
  },
  "column-alias": {
    title: "Aliases with AS for clearer results",
    objective: "Rename columns in the result so they read clearly, without changing the real table.",
    expectedResult: "The email should appear with an alias such as correo or email_cliente.",
    hints: [
      "Use AS after a column to give it a temporary name in the result.",
      "SELECT email AS correo FROM customers;",
      "Pick a readable alias for email; the underlying column stays email.",
    ],
    reasoningChecklist: ["Which table holds the data?", "Which columns need clearer names?"],
    referenceExplanation: [
      { clause: "AS correo", text: "Renames the column only in the result set." },
      { clause: "FROM customers", text: "Still reads from customers." },
    ],
  },
  "distinct-categories": {
    title: "Categories without duplicates",
    objective: "Get the list of menu categories without repeating names.",
    expectedResult: "Each category name only once.",
    hints: [
      "DISTINCT removes duplicate values from the result.",
      "SELECT DISTINCT name FROM categories;",
      "Ask for the category name and apply DISTINCT.",
    ],
    reasoningChecklist: ["Which table holds the data?", "Do you need to filter rows with WHERE?"],
    referenceExplanation: [
      { clause: "SELECT DISTINCT", text: "Keeps unique values only." },
      { clause: "FROM categories", text: "Reads category names from categories." },
    ],
  },
  "products-by-name": {
    title: "Products ordered by name",
    objective: "List menu products in alphabetical order by name.",
    expectedResult: "Names should go from A to Z (Americano before Yogurt).",
    hints: [
      "ORDER BY sorts the result.",
      "SELECT name FROM menu_items ORDER BY name;",
      "Sort ascending by the name column.",
    ],
    reasoningChecklist: ["Which table holds the data?", "How should the rows be ordered?"],
    referenceExplanation: [
      { clause: "ORDER BY name", text: "Sorts alphabetically ascending by default." },
    ],
  },
  "list-stores": {
    title: "Coffee chain stores",
    objective: "FROM says where rows come from. List each store’s name and city.",
    expectedResult: "One row per café, with its name and city.",
    hints: [
      "Select the columns you need from the stores table.",
      "SELECT name, city FROM stores;",
      "Use stores and pick name plus city.",
    ],
    reasoningChecklist: ["Which table holds the data?", "Which exact columns do you need?"],
    referenceExplanation: [
      { clause: "SELECT name, city", text: "Only those two columns." },
      { clause: "FROM stores", text: "Rows come from stores." },
    ],
  },
  "employee-columns": {
    title: "Specific employee columns",
    objective: "Show first_name, last_name, and email of people who work at the chain.",
    expectedResult: "Only those three columns, one row per employee.",
    hints: [
      "List the three columns after SELECT.",
      "SELECT first_name, last_name, email FROM employees;",
      "Use the employees table with those exact columns.",
    ],
    reasoningChecklist: ["Which table holds the data?", "Which exact columns do you need?"],
    referenceExplanation: [
      { clause: "SELECT first_name, last_name, email", text: "Three concrete columns." },
      { clause: "FROM employees", text: "Reads employees." },
    ],
  },
  "distinct-cities": {
    title: "Distinct customer cities",
    objective: "Several customers live in the same city. Get each city only once.",
    expectedResult: "Puebla, CDMX, Oaxaca, and the other cities, without repeats.",
    hints: [
      "Combine DISTINCT with the city column.",
      "SELECT DISTINCT city FROM customers;",
      "Ask for city with DISTINCT.",
    ],
    reasoningChecklist: ["Which table holds the data?", "Do you need unique values?"],
    referenceExplanation: [
      { clause: "SELECT DISTINCT city", text: "Unique cities only." },
    ],
  },
  "price-gt": {
    title: "Products priced over 50",
    objective: "Filter the menu to keep products whose price is strictly greater than 50.",
    expectedResult: "Latte at 52, Mocha, breakfasts, etc. Products at 50 or less must not appear.",
    hints: [
      "WHERE filters rows with a condition.",
      "SELECT … FROM menu_items WHERE price > 50;",
      "Use a comparison operator on price.",
    ],
    reasoningChecklist: ["Which table holds the data?", "Do you need to filter rows with WHERE?"],
    referenceExplanation: [
      { clause: "WHERE price > 50", text: "Keeps only rows above 50." },
    ],
  },
  "price-between": {
    title: "Products by price range",
    objective: "Find products whose price is between 40 and 60, inclusive.",
    expectedResult: "Rows with price from 40 to 60. BETWEEN includes both ends.",
    hints: [
      "BETWEEN includes both bounds.",
      "WHERE price BETWEEN 40 AND 60",
      "Filter menu_items with BETWEEN on price.",
    ],
    reasoningChecklist: ["Which table holds the data?", "Do you need to filter rows with WHERE?"],
    referenceExplanation: [
      { clause: "BETWEEN 40 AND 60", text: "Inclusive range filter." },
    ],
  },
  "like-word": {
    title: "Products that contain a word",
    objective: "Find products whose name contains the word café, regardless of case.",
    expectedResult: "Names like Frappe de café or Limonada de café.",
    hints: [
      "LIKE with % matches a substring.",
      "WHERE name ILIKE '%café%'",
      "Use a pattern search on the product name.",
    ],
    reasoningChecklist: ["Which table holds the data?", "Do you need to filter rows with WHERE?"],
    referenceExplanation: [
      { clause: "ILIKE '%café%'", text: "Case-insensitive substring match." },
    ],
  },
  "in-categories": {
    title: "Filter products by specific categories",
    objective: "Show products that belong to the Espresso or Frías categories.",
    expectedResult: "Espresso, Americano, Cold Brew, Frappe, etc. No milk drinks or desserts.",
    hints: [
      "IN lists several allowed values.",
      "JOIN categories and filter with IN ('Espresso', 'Frías').",
      "Relate menu_items to categories, then filter by category name.",
    ],
    reasoningChecklist: ["Which table holds the data?", "Do you need to relate tables with JOIN?"],
    referenceExplanation: [
      { clause: "JOIN categories", text: "Links each product to its category." },
      { clause: "IN (...)", text: "Keeps only the listed categories." },
    ],
  },
  "and-or": {
    title: "Combine AND and OR",
    objective: "Available products (is_available = true) that cost less than 40 or more than 80.",
    expectedResult: "Cheap available items or expensive available breakfasts. Unavailable items stay out.",
    hints: [
      "AND and OR combine conditions; use parentheses.",
      "WHERE is_available = true AND (price < 40 OR price > 80)",
      "Require availability and then the price OR.",
    ],
    reasoningChecklist: ["Which table holds the data?", "Do you need to filter rows with WHERE?"],
    referenceExplanation: [
      { clause: "AND / OR", text: "Combines availability with a price range." },
    ],
  },
  "not-operator": {
    title: "Exclude with NOT",
    objective: "List orders whose status is not cancelled.",
    expectedResult: "completed, pending, preparing… never cancelled.",
    hints: [
      "NOT or <> / != can exclude a value.",
      "WHERE status <> 'cancelled'",
      "Filter orders excluding cancelled.",
    ],
    reasoningChecklist: ["Which table holds the data?", "Do you need to filter rows with WHERE?"],
    referenceExplanation: [
      { clause: "WHERE status <> 'cancelled'", text: "Excludes cancelled orders." },
    ],
  },
  "is-null": {
    title: "Customers without a phone",
    objective: "Find customers whose phone is null. NULL is not compared with =.",
    expectedResult: "Only people with an empty phone (NULL).",
    hints: [
      "Use IS NULL to test for missing values.",
      "WHERE phone IS NULL",
      "Filter customers with a null phone.",
    ],
    reasoningChecklist: ["Which table holds the data?", "Do you need to filter rows with WHERE?"],
    referenceExplanation: [
      { clause: "IS NULL", text: "Checks for missing values correctly." },
    ],
  },
  "is-not-null": {
    title: "Payments with a recorded date",
    objective: "Show payments that do have paid_at, meaning a known charge date.",
    expectedResult: "payments rows with paid_at different from NULL.",
    hints: [
      "IS NOT NULL is the opposite of IS NULL.",
      "WHERE paid_at IS NOT NULL",
      "Filter payments that already have a date.",
    ],
    reasoningChecklist: ["Which table holds the data?", "Do you need to filter rows with WHERE?"],
    referenceExplanation: [
      { clause: "IS NOT NULL", text: "Keeps rows with a known paid_at." },
    ],
  },
  "recent-orders": {
    title: "Most recent orders",
    objective: "Show the 10 newest orders first.",
    expectedResult: "10 rows, most recent date on top.",
    hints: [
      "ORDER BY date DESC plus LIMIT 10.",
      "SELECT … FROM orders ORDER BY ordered_at DESC LIMIT 10;",
      "Sort descending by date and limit to 10.",
    ],
    reasoningChecklist: ["Which table holds the data?", "How should the rows be ordered?"],
    referenceExplanation: [
      { clause: "ORDER BY … DESC", text: "Newest first." },
      { clause: "LIMIT 10", text: "Only ten rows." },
    ],
  },
  "limit-only": {
    title: "Try with LIMIT",
    objective: "When exploring, you do not need the whole table. Bring only 5 products.",
    expectedResult: "Exactly 5 rows from menu_items.",
    hints: [
      "LIMIT caps how many rows you get.",
      "SELECT * FROM menu_items LIMIT 5;",
      "Take five rows from menu_items.",
    ],
    reasoningChecklist: ["Which table holds the data?", "Do you need to limit the result size?"],
    referenceExplanation: [
      { clause: "LIMIT 5", text: "Returns at most five rows." },
    ],
  },
  "order-multi": {
    title: "Sort by two columns",
    objective: "Sort products by category_id and, within each category, by price high to low.",
    expectedResult: "Category groups; within each, the most expensive first.",
    hints: [
      "ORDER BY can take several columns.",
      "ORDER BY category_id, price DESC",
      "First sort by category, then by price descending.",
    ],
    reasoningChecklist: ["Which table holds the data?", "How should the rows be ordered?"],
    referenceExplanation: [
      { clause: "ORDER BY category_id, price DESC", text: "Two-level sort." },
    ],
  },
  "count-customers": {
    title: "Count customers",
    objective: "How many customers are there in total? A number, not the full list.",
    expectedResult: "A single row with the customer total.",
    hints: [
      "COUNT(*) counts rows.",
      "SELECT COUNT(*) FROM customers;",
      "Aggregate without listing every customer.",
    ],
    reasoningChecklist: ["Which table holds the data?", "Do you need to group with GROUP BY?"],
    referenceExplanation: [
      { clause: "COUNT(*)", text: "Counts all customer rows." },
    ],
  },
  "count-products": {
    title: "Count products",
    objective: "Count how many products are on the menu.",
    expectedResult: "A number with the total of menu_items.",
    hints: [
      "Same idea as counting customers.",
      "SELECT COUNT(*) FROM menu_items;",
      "Count rows in menu_items.",
    ],
    reasoningChecklist: ["Which table holds the data?", "Do you need to group with GROUP BY?"],
    referenceExplanation: [
      { clause: "COUNT(*)", text: "Counts menu products." },
    ],
  },
  "price-stats": {
    title: "Min, max, and average price",
    objective: "In one query get the lowest price, the highest, and the menu average.",
    expectedResult: "One row with three aggregated numbers.",
    hints: [
      "MIN, MAX, and AVG are aggregates.",
      "SELECT MIN(price), MAX(price), AVG(price) FROM menu_items;",
      "Compute the three stats in one SELECT.",
    ],
    reasoningChecklist: ["Which table holds the data?", "Do you need to group with GROUP BY?"],
    referenceExplanation: [
      { clause: "MIN / MAX / AVG", text: "Three aggregates in one result row." },
    ],
  },
  "sum-inventory": {
    title: "Available inventory per product",
    objective: "Sum quantity_on_hand across all stores for each product.",
    expectedResult: "One row per item_id (or name) with the stock total.",
    hints: [
      "GROUP BY product and SUM the quantity.",
      "SELECT item_id, SUM(quantity_on_hand) FROM inventory GROUP BY item_id;",
      "Aggregate inventory by product.",
    ],
    reasoningChecklist: ["Which table holds the data?", "Do you need to group with GROUP BY?"],
    referenceExplanation: [
      { clause: "SUM(quantity_on_hand)", text: "Adds stock across stores." },
      { clause: "GROUP BY item_id", text: "One group per product." },
    ],
  },
  "count-orders": {
    title: "Total orders",
    objective: "Count how many orders there are, of any status.",
    expectedResult: "A number with the total rows in orders.",
    hints: [
      "COUNT(*) on orders.",
      "SELECT COUNT(*) FROM orders;",
      "Count every order row.",
    ],
    reasoningChecklist: ["Which table holds the data?", "Do you need to group with GROUP BY?"],
    referenceExplanation: [
      { clause: "COUNT(*)", text: "Counts all orders." },
    ],
  },
  "products-per-category": {
    title: "Count products per category",
    objective: "For each category, how many products are there?",
    expectedResult: "One row per category with its count.",
    hints: [
      "GROUP BY category and COUNT products.",
      "SELECT category_id, COUNT(*) FROM menu_items GROUP BY category_id;",
      "You can also join categories to show the name.",
    ],
    reasoningChecklist: ["Which table holds the data?", "Do you need to group with GROUP BY?"],
    referenceExplanation: [
      { clause: "GROUP BY", text: "Builds one group per category." },
      { clause: "COUNT(*)", text: "Counts products in each group." },
    ],
  },
  "avg-price-category": {
    title: "Average price per category",
    objective: "Compute the average product price for each category.",
    expectedResult: "One row per category with AVG(price).",
    hints: [
      "AVG with GROUP BY.",
      "SELECT category_id, AVG(price) FROM menu_items GROUP BY category_id;",
      "Average price within each category.",
    ],
    reasoningChecklist: ["Which table holds the data?", "Do you need to group with GROUP BY?"],
    referenceExplanation: [
      { clause: "AVG(price)", text: "Average within the group." },
    ],
  },
  "having-count": {
    title: "Categories with more than 3 products",
    objective: "WHERE filters rows before grouping. HAVING filters groups after COUNT.",
    expectedResult: "Only categories whose product COUNT is greater than 3.",
    hints: [
      "HAVING comes after GROUP BY.",
      "… GROUP BY category_id HAVING COUNT(*) > 3",
      "Count per category, then keep groups above 3.",
    ],
    reasoningChecklist: ["Which table holds the data?", "Do you need to group with GROUP BY?"],
    referenceExplanation: [
      { clause: "HAVING COUNT(*) > 3", text: "Filters groups, not individual rows." },
    ],
  },
  "orders-by-status": {
    title: "Count orders by status",
    objective: "How many orders are there in each status?",
    expectedResult: "completed, pending, cancelled, preparing rows with their counts.",
    hints: [
      "GROUP BY status.",
      "SELECT status, COUNT(*) FROM orders GROUP BY status;",
      "One group per status value.",
    ],
    reasoningChecklist: ["Which table holds the data?", "Do you need to group with GROUP BY?"],
    referenceExplanation: [
      { clause: "GROUP BY status", text: "Splits orders by status." },
    ],
  },
  "employees-per-store": {
    title: "Count employees per store",
    objective: "For each store, how many people work there.",
    expectedResult: "Store name and employee count.",
    hints: [
      "JOIN stores with employees and GROUP BY store.",
      "SELECT s.name, COUNT(*) … GROUP BY s.name",
      "Relate employees to stores, then count.",
    ],
    reasoningChecklist: ["Which table holds the data?", "Do you need to relate tables with JOIN?"],
    referenceExplanation: [
      { clause: "JOIN", text: "Links employees to their store." },
      { clause: "GROUP BY", text: "Counts per store." },
    ],
  },
  "product-category-join": {
    title: "Product and category",
    objective: "Show each product together with its category name.",
    expectedResult: "Product and category columns, one row per product that has a category.",
    hints: [
      "INNER JOIN connects matching keys.",
      "JOIN categories ON menu_items.category_id = categories.category_id",
      "Select product fields plus category name.",
    ],
    reasoningChecklist: ["Do you need to relate tables with JOIN?", "Which exact columns do you need?"],
    referenceExplanation: [
      { clause: "JOIN … ON", text: "Matches products to categories." },
    ],
  },
  "order-customer": {
    title: "Order and customer",
    objective: "List orders with the customer email. Walk-ins without a customer do not appear in an INNER JOIN.",
    expectedResult: "order_id, date, and customer email (or name).",
    hints: [
      "JOIN orders to customers on customer_id.",
      "SELECT o.order_id, o.ordered_at, c.email FROM orders o JOIN customers c …",
      "Use an inner join so only orders with a customer remain.",
    ],
    reasoningChecklist: ["Do you need to relate tables with JOIN?", "Which exact columns do you need?"],
    referenceExplanation: [
      { clause: "JOIN customers", text: "Attaches customer data to each order." },
    ],
  },
  "order-store": {
    title: "Order and store",
    objective: "Show each order with the name of the store where it was placed.",
    expectedResult: "Order id and store name.",
    hints: [
      "JOIN orders to stores.",
      "ON orders.store_id = stores.store_id",
      "Select order_id and store name.",
    ],
    reasoningChecklist: ["Do you need to relate tables with JOIN?", "Which exact columns do you need?"],
    referenceExplanation: [
      { clause: "JOIN stores", text: "Links each order to its store." },
    ],
  },
  "order-details": {
    title: "Order detail: product, quantity, price",
    objective: "Build the ticket: for each line, the product, quantity, and unit price.",
    expectedResult: "order_items rows with product name and quantity/price data.",
    hints: [
      "JOIN order_items to menu_items.",
      "Select quantity, unit_price, and product name.",
      "Relate lines to products by item_id.",
    ],
    reasoningChecklist: ["Do you need to relate tables with JOIN?", "Which exact columns do you need?"],
    referenceExplanation: [
      { clause: "JOIN menu_items", text: "Adds the product name to each line." },
    ],
  },
  "employee-role-store": {
    title: "Employees with role and store",
    objective: "Three tables: the person, their role, and the café where they work.",
    expectedResult: "Employee name, role_name, and store name.",
    hints: [
      "Chain two JOINs.",
      "employees → roles and employees → stores",
      "Select names from the three related tables.",
    ],
    reasoningChecklist: ["Do you need to relate tables with JOIN?", "Which exact columns do you need?"],
    referenceExplanation: [
      { clause: "JOIN roles / JOIN stores", text: "Brings role and store into one row." },
    ],
  },
  "cross-join-demo": {
    title: "CROSS JOIN of stores and roles",
    objective: "CROSS JOIN pairs every row with every row of the other table. Use it on purpose, not by forgetting ON.",
    expectedResult: "Each store paired with every possible role (4 stores × 5 roles = 20 rows).",
    hints: [
      "CROSS JOIN has no ON.",
      "SELECT … FROM stores CROSS JOIN roles;",
      "Expect the cartesian product of both tables.",
    ],
    reasoningChecklist: ["Do you need to relate tables with JOIN?", "Is a cartesian product intended?"],
    referenceExplanation: [
      { clause: "CROSS JOIN", text: "Produces every store–role combination." },
    ],
  },
  "left-inventory": {
    title: "Products with inventory, even without stock",
    objective: "LEFT JOIN keeps products even if they have no inventory row (like a reserved geisha).",
    expectedResult: "All menu products; quantity may be NULL if there is no inventory.",
    hints: [
      "LEFT JOIN keeps the left table intact.",
      "FROM menu_items LEFT JOIN inventory ON …",
      "Start from products and optionally attach inventory.",
    ],
    reasoningChecklist: ["Do you need to relate tables with JOIN?", "Should unmatched left rows remain?"],
    referenceExplanation: [
      { clause: "LEFT JOIN", text: "Keeps products without inventory rows." },
    ],
  },
  "customers-without-orders": {
    title: "Customers without orders (left anti join)",
    objective: "A left anti join is LEFT JOIN + WHERE the right key IS NULL. Find customers who never ordered.",
    expectedResult: "Customers like Olivia or Ulises if they have no rows in orders.",
    hints: [
      "LEFT JOIN orders, then WHERE orders.customer_id IS NULL.",
      "That pattern is an anti join.",
      "Start from customers and keep those with no matching order.",
    ],
    reasoningChecklist: ["Do you need to relate tables with JOIN?", "Do you need to filter rows with WHERE?"],
    referenceExplanation: [
      { clause: "LEFT JOIN + IS NULL", text: "Keeps only customers with no orders." },
    ],
  },
  "never-sold": {
    title: "Products never sold",
    objective: "Find menu products that never appear in any order line.",
    expectedResult: "For example the geisha edition or lemonade if nobody bought it.",
    hints: [
      "Anti join menu_items against order_items.",
      "LEFT JOIN … WHERE order_items.item_id IS NULL",
      "Products with no matching order line.",
    ],
    reasoningChecklist: ["Do you need to relate tables with JOIN?", "Do you need to filter rows with WHERE?"],
    referenceExplanation: [
      { clause: "LEFT JOIN order_items", text: "Looks for sales lines." },
      { clause: "IS NULL", text: "Keeps products that never sold." },
    ],
  },
  "orders-without-payment": {
    title: "Orders without a recorded payment",
    objective: "Detect orders that have no row in payments.",
    expectedResult: "pending/preparing/cancelled orders without a charge, depending on the seed.",
    hints: [
      "Anti join orders to payments.",
      "LEFT JOIN payments … WHERE payments.order_id IS NULL",
      "Orders missing a payment row.",
    ],
    reasoningChecklist: ["Do you need to relate tables with JOIN?", "Do you need to filter rows with WHERE?"],
    referenceExplanation: [
      { clause: "LEFT JOIN payments", text: "Looks for a matching payment." },
    ],
  },
  "spend-per-customer": {
    title: "Total spend per customer",
    objective: "Sum quantity * unit_price from the lines, grouping by customer.",
    expectedResult: "One row per customer who did buy, with their spend.",
    hints: [
      "JOIN customers, orders, and order_items.",
      "SUM(quantity * unit_price) GROUP BY customer",
      "Aggregate the ticket lines per customer.",
    ],
    reasoningChecklist: ["Do you need to relate tables with JOIN?", "Do you need to group with GROUP BY?"],
    referenceExplanation: [
      { clause: "SUM(quantity * unit_price)", text: "Computes spend." },
      { clause: "GROUP BY customer", text: "One total per customer." },
    ],
  },
  "best-sellers": {
    title: "Best-selling products",
    objective: "Rank products by pieces sold (SUM of quantity).",
    expectedResult: "Products ordered from most sold to least.",
    hints: [
      "GROUP BY product and SUM(quantity).",
      "ORDER BY the sum DESC",
      "Join order_items to menu_items for names.",
    ],
    reasoningChecklist: ["Do you need to group with GROUP BY?", "How should the rows be ordered?"],
    referenceExplanation: [
      { clause: "SUM(quantity)", text: "Pieces sold." },
      { clause: "ORDER BY … DESC", text: "Best sellers first." },
    ],
  },
  "sales-per-store": {
    title: "Sales per store",
    objective: "Sum line amounts grouped by store.",
    expectedResult: "Store name and total sold.",
    hints: [
      "Relate stores → orders → order_items.",
      "SUM(quantity * unit_price) GROUP BY store",
      "Aggregate revenue per store.",
    ],
    reasoningChecklist: ["Do you need to relate tables with JOIN?", "Do you need to group with GROUP BY?"],
    referenceExplanation: [
      { clause: "GROUP BY store", text: "One total per store." },
    ],
  },
  "right-join-payments": {
    title: "RIGHT JOIN of orders and payments",
    objective: "Practice RIGHT JOIN: keep every payment even without an order (the orphan payment in the seed).",
    expectedResult: "All payments rows, with order_id possibly null.",
    hints: [
      "RIGHT JOIN keeps the right table.",
      "FROM orders RIGHT JOIN payments ON …",
      "Or rewrite as payments LEFT JOIN orders.",
    ],
    reasoningChecklist: ["Do you need to relate tables with JOIN?", "Should unmatched right rows remain?"],
    referenceExplanation: [
      { clause: "RIGHT JOIN", text: "Preserves every payment." },
    ],
  },
  "full-anti-join": {
    title: "Full anti join of orders and payments",
    objective: "A full anti join is FULL OUTER JOIN plus WHERE some key is NULL: whatever did not match on either side.",
    expectedResult: "Orders without payment and payments without an order — not the healthy pairs.",
    hints: [
      "FULL OUTER JOIN then filter where a key is NULL.",
      "WHERE o.order_id IS NULL OR p.order_id IS NULL",
      "Keep only unmatched rows from either side.",
    ],
    reasoningChecklist: ["Do you need to relate tables with JOIN?", "Do you need to filter rows with WHERE?"],
    referenceExplanation: [
      { clause: "FULL OUTER JOIN", text: "Keeps both unmatched sides." },
      { clause: "WHERE … IS NULL", text: "Drops the matching pairs." },
    ],
  },
  "union-names": {
    title: "Customer and employee names with UNION",
    objective: "Combine first_name from customers and employees into one list, without duplicates.",
    expectedResult: "One name column; if Ana is a customer and not an employee, she appears once.",
    hints: [
      "UNION removes duplicates.",
      "SELECT first_name FROM customers UNION SELECT first_name FROM employees",
      "Both SELECTs must have the same number of columns.",
    ],
    reasoningChecklist: ["Which tables hold the data?", "Do you need to combine result sets?"],
    referenceExplanation: [
      { clause: "UNION", text: "Stacks both lists and deduplicates." },
    ],
  },
  "union-vs-all": {
    title: "Compare UNION versus UNION ALL",
    objective: "Use UNION ALL to keep duplicates. If Lucía exists on both sides, she appears twice.",
    expectedResult: "More rows than with UNION, because it does not deduplicate.",
    hints: [
      "UNION ALL keeps every row.",
      "… UNION ALL …",
      "Same shape as UNION, different duplicate handling.",
    ],
    reasoningChecklist: ["Which tables hold the data?", "Do you need to combine result sets?"],
    referenceExplanation: [
      { clause: "UNION ALL", text: "Keeps duplicates from both sides." },
    ],
  },
  "except-customers": {
    title: "Customers without orders using EXCEPT",
    objective: "EXCEPT subtracts sets: customer ids minus ids that appear in orders.",
    expectedResult: "customer_id values that never ordered — same idea as the anti join.",
    hints: [
      "EXCEPT removes the second set from the first.",
      "SELECT customer_id FROM customers EXCEPT SELECT customer_id FROM orders",
      "Both sides should select compatible columns.",
    ],
    reasoningChecklist: ["Which tables hold the data?", "Do you need to combine result sets?"],
    referenceExplanation: [
      { clause: "EXCEPT", text: "Keeps ids only in the first set." },
    ],
  },
  "intersect-menu-inventory": {
    title: "Products in menu and inventory (INTERSECT)",
    objective: "INTERSECT keeps ids that exist in both lists.",
    expectedResult: "item_id values present in menu_items and also in inventory.",
    hints: [
      "INTERSECT is the set intersection.",
      "SELECT item_id FROM menu_items INTERSECT SELECT item_id FROM inventory",
      "Only ids present in both queries.",
    ],
    reasoningChecklist: ["Which tables hold the data?", "Do you need to combine result sets?"],
    referenceExplanation: [
      { clause: "INTERSECT", text: "Common ids only." },
    ],
  },
  "except-menu-inventory": {
    title: "Menu products missing from inventory",
    objective: "Use EXCEPT to see which products are on the menu but were never stocked.",
    expectedResult: "menu_items ids that do not appear in inventory.",
    hints: [
      "EXCEPT menu ids minus inventory ids.",
      "SELECT item_id FROM menu_items EXCEPT SELECT item_id FROM inventory",
      "Products never stocked.",
    ],
    reasoningChecklist: ["Which tables hold the data?", "Do you need to combine result sets?"],
    referenceExplanation: [
      { clause: "EXCEPT", text: "Menu ids without inventory." },
    ],
  },
  "create-practice-table": {
    title: "Create a practice table",
    objective: "In sql_playground create tasting_notes with note_id SERIAL, flavor TEXT, and created_at TIMESTAMP.",
    expectedResult: "The tasting_notes table exists in the sandbox. coffee_chain does not change.",
    hints: [
      "CREATE TABLE defines a new table.",
      "CREATE TABLE tasting_notes (…);",
      "Use the sandbox and the requested columns.",
    ],
    reasoningChecklist: ["Which table will you create?", "Which columns and types do you need?"],
    referenceExplanation: [
      { clause: "CREATE TABLE", text: "Creates tasting_notes only in the sandbox." },
    ],
  },
  "insert-fake-customer": {
    title: "Insert a fake customer",
    objective: "Add a practice customer with email mia.sandbox@sqlcoffee.dev into practice_customers.",
    expectedResult: "A new row with that email. Real customers are untouched.",
    hints: [
      "INSERT INTO … VALUES (…)",
      "Insert into practice_customers with that email.",
      "Only the sandbox table changes.",
    ],
    reasoningChecklist: ["Which table will you change?", "Which values will you insert?"],
    referenceExplanation: [
      { clause: "INSERT INTO", text: "Adds one practice row." },
    ],
  },
  "update-fake-customer": {
    title: "Update the fake customer",
    objective: "Change Nora Prueba’s city (nora.prueba@sandbox.dev) to Veracruz. WHERE is required.",
    expectedResult: "Only that row changes city. Without WHERE the app blocks the UPDATE.",
    hints: [
      "UPDATE … SET … WHERE …",
      "Filter by email so you only touch Nora.",
      "Never omit WHERE on UPDATE here.",
    ],
    reasoningChecklist: ["Which table will you change?", "How do you target the right row?"],
    referenceExplanation: [
      { clause: "UPDATE … WHERE", text: "Changes only the matching row." },
    ],
  },
  "delete-fake-customer": {
    title: "Delete one specific customer",
    objective: "Delete only Omar Demo (omar.demo@sandbox.dev). Do not delete Pia.",
    expectedResult: "Omar disappears; Pia remains. DELETE without WHERE is blocked.",
    hints: [
      "DELETE FROM … WHERE email = …",
      "Target Omar’s email only.",
      "A WHERE clause is mandatory.",
    ],
    reasoningChecklist: ["Which table will you change?", "How do you target the right row?"],
    referenceExplanation: [
      { clause: "DELETE … WHERE", text: "Removes only Omar." },
    ],
  },
  "alter-column": {
    title: "Add and understand a practice column",
    objective: "Add the is_seasonal BOOLEAN column to practice_menu_items.",
    expectedResult: "The practice table has a new column. The real menu does not change.",
    hints: [
      "ALTER TABLE … ADD COLUMN …",
      "ADD COLUMN is_seasonal BOOLEAN",
      "Alter only the practice table.",
    ],
    reasoningChecklist: ["Which table will you change?", "Which column and type do you need?"],
    referenceExplanation: [
      { clause: "ALTER TABLE … ADD COLUMN", text: "Extends the practice table." },
    ],
  },
  "dangerous-delete": {
    title: "Why DELETE or UPDATE without WHERE is dangerous",
    objective: "Try a DELETE without WHERE and see the block. Then write a safe DELETE with WHERE email = 'nora.prueba@sandbox.dev'.",
    expectedResult: "The app rejects the mass DELETE. A DELETE with WHERE can run in the sandbox.",
    hints: [
      "A DELETE without WHERE would wipe the table.",
      "Always add WHERE for DELETE/UPDATE here.",
      "After seeing the block, delete Nora safely by email.",
    ],
    reasoningChecklist: ["Why is WHERE mandatory?", "How do you target a single row?"],
    referenceExplanation: [
      { clause: "WHERE email = …", text: "Makes the DELETE safe and specific." },
    ],
  },
  "drop-practice-table": {
    title: "Drop a practice table",
    objective: "If you created tasting_notes, drop it with DROP TABLE. You can never DROP SCHEMA coffee_chain.",
    expectedResult: "tasting_notes no longer exists in sql_playground.",
    hints: [
      "DROP TABLE tasting_notes;",
      "Only sandbox tables can be dropped.",
      "coffee_chain stays protected.",
    ],
    reasoningChecklist: ["Which table will you remove?", "Are you in the sandbox?"],
    referenceExplanation: [
      { clause: "DROP TABLE", text: "Removes the practice table only." },
    ],
  },
  "top-customers": {
    title: "Top 10 customers by spend",
    objective: "The 10 customers who spent the most, with their total, ordered high to low.",
    expectedResult: "At most 10 rows, Ana or other frequent buyers on top if the seed supports it.",
    hints: [
      "Aggregate spend, ORDER BY DESC, LIMIT 10.",
      "SUM(quantity * unit_price) per customer",
      "Join customers with their order lines.",
    ],
    reasoningChecklist: ["Do you need to group with GROUP BY?", "How should the rows be ordered?"],
    referenceExplanation: [
      { clause: "ORDER BY total DESC LIMIT 10", text: "Top spenders only." },
    ],
  },
  "top-products-revenue": {
    title: "Top products by revenue",
    objective: "Rank products by revenue (SUM of quantity * unit_price), not just by pieces.",
    expectedResult: "Latte often stands out. Descending order.",
    hints: [
      "SUM(quantity * unit_price) GROUP BY product.",
      "ORDER BY revenue DESC",
      "Join order lines to products.",
    ],
    reasoningChecklist: ["Do you need to group with GROUP BY?", "How should the rows be ordered?"],
    referenceExplanation: [
      { clause: "SUM(quantity * unit_price)", text: "Revenue, not just units." },
    ],
  },
  "sales-store-category": {
    title: "Sales by store and category",
    objective: "Two-dimension report: store × category with total sold.",
    expectedResult: "Each store–category combination that sold something, with its sum.",
    hints: [
      "GROUP BY store and category.",
      "Join stores, orders, order_items, menu_items, categories.",
      "SUM the line amounts in each group.",
    ],
    reasoningChecklist: ["Do you need to relate tables with JOIN?", "Do you need to group with GROUP BY?"],
    referenceExplanation: [
      { clause: "GROUP BY store, category", text: "Two-dimensional aggregation." },
    ],
  },
  "supplier-spend": {
    title: "Suppliers and total spend",
    objective: "Sum quantity * unit_cost of purchase orders per supplier.",
    expectedResult: "One row per supplier with their purchase spend.",
    hints: [
      "Aggregate purchase lines by supplier.",
      "SUM(quantity * unit_cost) GROUP BY supplier",
      "Join suppliers to purchase data.",
    ],
    reasoningChecklist: ["Do you need to relate tables with JOIN?", "Do you need to group with GROUP BY?"],
    referenceExplanation: [
      { clause: "SUM(quantity * unit_cost)", text: "Purchase spend per supplier." },
    ],
  },
  "full-join-inconsistencies": {
    title: "Order vs payment inconsistencies with FULL JOIN",
    objective: "Use FULL OUTER JOIN to see orders and payments, including rows that do not match.",
    expectedResult: "You should see at least one order without payment and the payment without an order.",
    hints: [
      "FULL OUTER JOIN on order_id.",
      "Inspect nulls on either side.",
      "Both unmatched orders and unmatched payments should appear.",
    ],
    reasoningChecklist: ["Do you need to relate tables with JOIN?", "Should both unmatched sides remain?"],
    referenceExplanation: [
      { clause: "FULL OUTER JOIN", text: "Surfaces mismatches on both sides." },
    ],
  },
  "inventory-report": {
    title: "Inventory report by store and product",
    objective: "For each store and menu product, show quantity_on_hand, even 0 or NULL if missing.",
    expectedResult: "A store × product grid with stock levels.",
    hints: [
      "Combine stores and products, then attach inventory.",
      "CROSS JOIN or similar, then LEFT JOIN inventory",
      "Show quantity_on_hand for each pair.",
    ],
    reasoningChecklist: ["Do you need to relate tables with JOIN?", "Should unmatched rows remain?"],
    referenceExplanation: [
      { clause: "store × product", text: "Builds the full grid." },
      { clause: "LEFT JOIN inventory", text: "Fills quantity when present." },
    ],
  },
};

export function localizeExercise(exercise: Exercise, locale: Locale): Exercise {
  if (locale === "es") return exercise;
  const en = EN[exercise.id];
  if (!en) return exercise;
  return {
    ...exercise,
    title: en.title,
    objective: en.objective,
    expectedResult: en.expectedResult,
    hints: en.hints,
    reasoningChecklist: en.reasoningChecklist,
    referenceExplanation: en.referenceExplanation,
  };
}
