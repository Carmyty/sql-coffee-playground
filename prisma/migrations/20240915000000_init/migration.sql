-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "coffee_chain";

-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "sql_playground";

-- CreateTable
CREATE TABLE "coffee_chain"."customers" (
    "customer_id" SERIAL NOT NULL,
    "first_name" VARCHAR(80) NOT NULL,
    "last_name" VARCHAR(80) NOT NULL,
    "email" VARCHAR(160) NOT NULL,
    "phone" VARCHAR(40),
    "city" VARCHAR(80),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "customers_pkey" PRIMARY KEY ("customer_id")
);

-- CreateTable
CREATE TABLE "coffee_chain"."stores" (
    "store_id" SERIAL NOT NULL,
    "name" VARCHAR(120) NOT NULL,
    "city" VARCHAR(80) NOT NULL,
    "address" VARCHAR(200) NOT NULL,
    "opened_at" DATE NOT NULL,

    CONSTRAINT "stores_pkey" PRIMARY KEY ("store_id")
);

-- CreateTable
CREATE TABLE "coffee_chain"."employee_roles" (
    "role_id" SERIAL NOT NULL,
    "role_name" VARCHAR(80) NOT NULL,

    CONSTRAINT "employee_roles_pkey" PRIMARY KEY ("role_id")
);

-- CreateTable
CREATE TABLE "coffee_chain"."employees" (
    "employee_id" SERIAL NOT NULL,
    "first_name" VARCHAR(80) NOT NULL,
    "last_name" VARCHAR(80) NOT NULL,
    "email" VARCHAR(160) NOT NULL,
    "store_id" INTEGER NOT NULL,
    "role_id" INTEGER NOT NULL,
    "hired_at" DATE NOT NULL,

    CONSTRAINT "employees_pkey" PRIMARY KEY ("employee_id")
);

-- CreateTable
CREATE TABLE "coffee_chain"."menu_categories" (
    "category_id" SERIAL NOT NULL,
    "name" VARCHAR(80) NOT NULL,
    "description" TEXT,

    CONSTRAINT "menu_categories_pkey" PRIMARY KEY ("category_id")
);

-- CreateTable
CREATE TABLE "coffee_chain"."menu_items" (
    "item_id" SERIAL NOT NULL,
    "name" VARCHAR(120) NOT NULL,
    "category_id" INTEGER NOT NULL,
    "price" DECIMAL(8,2) NOT NULL,
    "is_available" BOOLEAN NOT NULL DEFAULT true,
    "description" TEXT,

    CONSTRAINT "menu_items_pkey" PRIMARY KEY ("item_id")
);

-- CreateTable
CREATE TABLE "coffee_chain"."customization_options" (
    "option_id" SERIAL NOT NULL,
    "name" VARCHAR(80) NOT NULL,
    "extra_cost" DECIMAL(6,2) NOT NULL DEFAULT 0,

    CONSTRAINT "customization_options_pkey" PRIMARY KEY ("option_id")
);

-- CreateTable
CREATE TABLE "coffee_chain"."item_customizations" (
    "item_id" INTEGER NOT NULL,
    "option_id" INTEGER NOT NULL,

    CONSTRAINT "item_customizations_pkey" PRIMARY KEY ("item_id","option_id")
);

-- CreateTable
CREATE TABLE "coffee_chain"."orders" (
    "order_id" SERIAL NOT NULL,
    "customer_id" INTEGER,
    "store_id" INTEGER NOT NULL,
    "employee_id" INTEGER,
    "order_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" VARCHAR(30) NOT NULL,

    CONSTRAINT "orders_pkey" PRIMARY KEY ("order_id")
);

-- CreateTable
CREATE TABLE "coffee_chain"."order_items" (
    "order_item_id" SERIAL NOT NULL,
    "order_id" INTEGER NOT NULL,
    "item_id" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL,
    "unit_price" DECIMAL(8,2) NOT NULL,

    CONSTRAINT "order_items_pkey" PRIMARY KEY ("order_item_id")
);

-- CreateTable
CREATE TABLE "coffee_chain"."payments" (
    "payment_id" SERIAL NOT NULL,
    "order_id" INTEGER,
    "amount" DECIMAL(10,2) NOT NULL,
    "payment_method" VARCHAR(40) NOT NULL,
    "paid_at" TIMESTAMP(3),

    CONSTRAINT "payments_pkey" PRIMARY KEY ("payment_id")
);

-- CreateTable
CREATE TABLE "coffee_chain"."inventory" (
    "inventory_id" SERIAL NOT NULL,
    "store_id" INTEGER NOT NULL,
    "item_id" INTEGER NOT NULL,
    "quantity_on_hand" INTEGER NOT NULL,

    CONSTRAINT "inventory_pkey" PRIMARY KEY ("inventory_id")
);

-- CreateTable
CREATE TABLE "coffee_chain"."suppliers" (
    "supplier_id" SERIAL NOT NULL,
    "name" VARCHAR(120) NOT NULL,
    "contact_email" VARCHAR(160),
    "city" VARCHAR(80),

    CONSTRAINT "suppliers_pkey" PRIMARY KEY ("supplier_id")
);

-- CreateTable
CREATE TABLE "coffee_chain"."supplies" (
    "supply_id" SERIAL NOT NULL,
    "name" VARCHAR(120) NOT NULL,
    "unit" VARCHAR(40) NOT NULL,
    "supplier_id" INTEGER,

    CONSTRAINT "supplies_pkey" PRIMARY KEY ("supply_id")
);

-- CreateTable
CREATE TABLE "coffee_chain"."purchase_orders" (
    "po_id" SERIAL NOT NULL,
    "supplier_id" INTEGER NOT NULL,
    "store_id" INTEGER NOT NULL,
    "ordered_at" DATE NOT NULL,
    "status" VARCHAR(30) NOT NULL,

    CONSTRAINT "purchase_orders_pkey" PRIMARY KEY ("po_id")
);

-- CreateTable
CREATE TABLE "coffee_chain"."purchase_order_items" (
    "po_item_id" SERIAL NOT NULL,
    "po_id" INTEGER NOT NULL,
    "supply_id" INTEGER NOT NULL,
    "quantity" DECIMAL(10,2) NOT NULL,
    "unit_cost" DECIMAL(10,2) NOT NULL,

    CONSTRAINT "purchase_order_items_pkey" PRIMARY KEY ("po_item_id")
);

-- CreateTable
CREATE TABLE "sql_playground"."practice_customers" (
    "practice_id" SERIAL NOT NULL,
    "first_name" VARCHAR(80) NOT NULL,
    "last_name" VARCHAR(80) NOT NULL,
    "email" VARCHAR(160) NOT NULL,
    "city" VARCHAR(80),
    "notes" VARCHAR(200),

    CONSTRAINT "practice_customers_pkey" PRIMARY KEY ("practice_id")
);

-- CreateTable
CREATE TABLE "sql_playground"."practice_menu_items" (
    "practice_id" SERIAL NOT NULL,
    "name" VARCHAR(120) NOT NULL,
    "price" DECIMAL(8,2) NOT NULL,
    "category" VARCHAR(80) NOT NULL,

    CONSTRAINT "practice_menu_items_pkey" PRIMARY KEY ("practice_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "customers_email_key" ON "coffee_chain"."customers"("email");

-- CreateIndex
CREATE UNIQUE INDEX "employee_roles_role_name_key" ON "coffee_chain"."employee_roles"("role_name");

-- CreateIndex
CREATE UNIQUE INDEX "employees_email_key" ON "coffee_chain"."employees"("email");

-- CreateIndex
CREATE UNIQUE INDEX "menu_categories_name_key" ON "coffee_chain"."menu_categories"("name");

-- CreateIndex
CREATE UNIQUE INDEX "inventory_store_id_item_id_key" ON "coffee_chain"."inventory"("store_id", "item_id");

-- CreateIndex
CREATE UNIQUE INDEX "practice_customers_email_key" ON "sql_playground"."practice_customers"("email");

-- AddForeignKey
ALTER TABLE "coffee_chain"."employees" ADD CONSTRAINT "employees_store_id_fkey" FOREIGN KEY ("store_id") REFERENCES "coffee_chain"."stores"("store_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "coffee_chain"."employees" ADD CONSTRAINT "employees_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "coffee_chain"."employee_roles"("role_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "coffee_chain"."menu_items" ADD CONSTRAINT "menu_items_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "coffee_chain"."menu_categories"("category_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "coffee_chain"."item_customizations" ADD CONSTRAINT "item_customizations_item_id_fkey" FOREIGN KEY ("item_id") REFERENCES "coffee_chain"."menu_items"("item_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "coffee_chain"."item_customizations" ADD CONSTRAINT "item_customizations_option_id_fkey" FOREIGN KEY ("option_id") REFERENCES "coffee_chain"."customization_options"("option_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "coffee_chain"."orders" ADD CONSTRAINT "orders_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "coffee_chain"."customers"("customer_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "coffee_chain"."orders" ADD CONSTRAINT "orders_store_id_fkey" FOREIGN KEY ("store_id") REFERENCES "coffee_chain"."stores"("store_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "coffee_chain"."orders" ADD CONSTRAINT "orders_employee_id_fkey" FOREIGN KEY ("employee_id") REFERENCES "coffee_chain"."employees"("employee_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "coffee_chain"."order_items" ADD CONSTRAINT "order_items_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "coffee_chain"."orders"("order_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "coffee_chain"."order_items" ADD CONSTRAINT "order_items_item_id_fkey" FOREIGN KEY ("item_id") REFERENCES "coffee_chain"."menu_items"("item_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "coffee_chain"."payments" ADD CONSTRAINT "payments_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "coffee_chain"."orders"("order_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "coffee_chain"."inventory" ADD CONSTRAINT "inventory_store_id_fkey" FOREIGN KEY ("store_id") REFERENCES "coffee_chain"."stores"("store_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "coffee_chain"."inventory" ADD CONSTRAINT "inventory_item_id_fkey" FOREIGN KEY ("item_id") REFERENCES "coffee_chain"."menu_items"("item_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "coffee_chain"."supplies" ADD CONSTRAINT "supplies_supplier_id_fkey" FOREIGN KEY ("supplier_id") REFERENCES "coffee_chain"."suppliers"("supplier_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "coffee_chain"."purchase_orders" ADD CONSTRAINT "purchase_orders_supplier_id_fkey" FOREIGN KEY ("supplier_id") REFERENCES "coffee_chain"."suppliers"("supplier_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "coffee_chain"."purchase_orders" ADD CONSTRAINT "purchase_orders_store_id_fkey" FOREIGN KEY ("store_id") REFERENCES "coffee_chain"."stores"("store_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "coffee_chain"."purchase_order_items" ADD CONSTRAINT "purchase_order_items_po_id_fkey" FOREIGN KEY ("po_id") REFERENCES "coffee_chain"."purchase_orders"("po_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "coffee_chain"."purchase_order_items" ADD CONSTRAINT "purchase_order_items_supply_id_fkey" FOREIGN KEY ("supply_id") REFERENCES "coffee_chain"."supplies"("supply_id") ON DELETE RESTRICT ON UPDATE CASCADE;
