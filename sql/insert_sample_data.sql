
--自動採番(1~)やdefaultの値は省略できる
-- INSERT INTO order_project.department VALUES 
--     (1, '営業部', default, default),
--     (2, '購買部', default, default),
--     (3, '製造部', default, default);

INSERT INTO department (department_name)
VALUES
('管理者'),
('購買部'),
('営業部'),
('製造部');

INSERT INTO users VALUES 
(default, '260001', '佐藤 太郎', 1, default, default),
(default, '260002', '斎藤 衣織', 2, default, default),
(default, '260003', '加藤 翔', 2, default, default),
(default, '260004', '林 玲央', 3, default, default),
(default, '260005', '山本 颯太', 3, default, default),
(default, '260006', '鈴木 花', 4, default, default);

INSERT INTO customer (customer_name)
VALUES
('株式会社葵精機'),
('中央エアロ株式会社'),
('関西重工株式会社'),
('株式会社スペーステクノロジー'),
('中部重工株式会社');

INSERT INTO supplier (supplier_name)
VALUES
('Stellar Precision'),
('Nova Components'),
('Apex Interconnect'),
('Zenith Electronics'),
('Orion Connect');

INSERT INTO item
VALUES
(default, 'MIL-001', 'Circular Connector', 'Nova Connect', 25.50, 5800.00, default, default),
(default, 'MIL-002', 'Jam Nut Receptacle', 'Nova Connect', 18.20, 4200.00, default, default),
(default, 'MIL-003', 'Plug Connector', 'Orion Electronics', 32.10, 7600.00, default, default),
(default, 'MIL-004', 'Backshell', 'Zenith Components', 15.80, 3600.00, default, default),
(default, 'MIL-005', 'Protective Cap', 'Apex Systems', 8.50, 1900.00, default, default),
(default, 'MIL-006', 'Contact Pin', 'Nova Connect', 1.25, 320.00, default, default),
(default, 'MIL-007', 'Contact Socket', 'Nova Connect', 1.30, 340.00, default, default),
(default, 'MIL-008', 'EMI Adapter', 'Stellar Precision', 27.90, 6400.00, default, default),
(default, 'MIL-009', 'Dummy Receptacle', 'Orion Electronics', 21.50, 5100.00, default, default),
(default, 'MIL-010', 'Cable Clamp', 'Zenith Components', 9.80, 2200.00, default, default);



TRUNCATE TABLE
    request_comment,
    request_header,
    item,
    supplier,
    customer,
    users,
    department
RESTART IDENTITY CASCADE;