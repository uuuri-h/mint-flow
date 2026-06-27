-- 部署
CREATE TABLE department (
    department_id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    department_name VARCHAR(15) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ユーザー
CREATE TABLE users (
    user_id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    user_cd VARCHAR(10) NOT NULL,
    user_name VARCHAR(15) NOT NULL,
    department_id INTEGER NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (department_id) REFERENCES department(department_id)
);

-- 顧客
CREATE TABLE customer (
    customer_id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    customer_name VARCHAR(20) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- サプライヤー
CREATE TABLE supplier (
    supplier_id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    supplier_name VARCHAR(20) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- アイテム
CREATE TABLE item (
    item_id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    item_cd VARCHAR(30) NOT NULL,
    item_name VARCHAR(25) NOT NULL,
    maker_name VARCHAR(20) NOT NULL,
    cost_price DECIMAL(10,2) NOT NULL,
    sales_price DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 依頼ヘッダ
CREATE TABLE request_header (
    request_id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    request_cd VARCHAR(30) NOT NULL UNIQUE,
    customer_id INTEGER NOT NULL,
    requester_id INTEGER NOT NULL,
    assigner_id INTEGER NOT NULL,
    delivery_date DATE NOT NULL,
    request_date DATE NOT NULL,
    header_status INTEGER NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES customer(customer_id),
    FOREIGN KEY (requester_id) REFERENCES users(user_id),
    FOREIGN KEY (assigner_id) REFERENCES users(user_id)
);

-- 依頼詳細
CREATE TABLE request_detail (
    detail_id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    request_id INTEGER NOT NULL,
    item_id INTEGER NOT NULL,
    quantity INTEGER NOT NULL,
    cost_price DECIMAL(10,2) NOT NULL,
    sales_price DECIMAL(10,2) NOT NULL,
    supplier_id INTEGER NOT NULL,
    item_status INTEGER NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (request_id) REFERENCES request_header(request_id),
    FOREIGN KEY (item_id) REFERENCES item(item_id),
    FOREIGN KEY (supplier_id) REFERENCES supplier(supplier_id)
);
