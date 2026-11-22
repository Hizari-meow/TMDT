# 🚀 Hệ Thống Thương Mại Điện Tử & Flash Sale Chịu Tải Cao (High-Concurrency Flash Sale Platform)

> **Dự án E-Commerce & Flash Sale kiến trúc phân tán**, được thiết kế để chịu tải lưu lượng đột biến (High Concurrency), đảm bảo tuyệt đối không bán khống (Zero Overselling), xử lý hàng ngàn giao dịch đặt hàng đồng thời với độ trễ tính bằng mili-giây.

[![Tech Stack](https://img.shields.io/badge/Stack-Next.js%2014%20%7C%20NestJS%2010%20%7C%20PostgreSQL%2016%20%7C%20Redis%207.2-blue)](https://github.com/Hizari-meow/TMDT)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Database](https://img.shields.io/badge/Database-PostgreSQL%2016%20(Partitioned)-blue.svg)](https://www.postgresql.org/)
[![Queue](https://img.shields.io/badge/Queue-BullMQ%20%2B%20Redis-red.svg)](https://bullmq.io/)

---

## 📌 1. Giới Thiệu Tổng Quan

Hệ thống được xây dựng nhằm giải quyết bài toán cốt lõi trong các sự kiện Flash Sale quy mô lớn: **Lưu lượng truy cập tăng vọt đột biến trong tích tắc, hàng ngàn người dùng cùng tranh mua số lượng hàng có hạn.**

### Thách thức chính:
- **Hiện tượng bán khống (Overselling):** Xảy ra khi nhiều request đọc và ghi database cùng thời điểm mà không được cô lập tốt.
- **Nghẽn cổ chai cơ sở dữ liệu (Database Bottleneck):** Database quan hệ bị quá tải do lock hàng loạt bản ghi tồn kho (`row-level locks`).
- **Trải nghiệm người dùng:** Độ trễ cao, lỗi timeout khi thanh toán.

### Giải pháp kỹ thuật:
- **Redis + Lua Scripting:** Trừ tồn kho nguyên tử (Atomic Inventory Deduction) ngay trên RAM của Redis, loại bỏ triệt để tình trạng race condition và overselling.
- **Hàng đợi bất đồng bộ (BullMQ):** Tách biệt pha giữ hàng (Inventory Hold) và pha ghi nhận đơn hàng vào PostgreSQL qua hàng đợi bất đồng bộ, giảm tải trực tiếp cho Database.
- **Phân vùng dữ liệu (PostgreSQL 16 Range Partitioning):** Bảng `orders` được phân vùng theo tháng (`orders_2026_09`, `orders_2026_10`, `orders_2026_11`,...) giúp tối ưu hóa hiệu năng truy vấn và lưu trữ hàng triệu giao dịch.
- **NestJS + Fastify Engine:** Tối ưu hóa throughput HTTP layer backend, tăng tốc độ xử lý I/O gấp 2-3 lần so với Express mặc định.

---

## 🏗️ 2. Kiến Trúc Kỹ Thuật (Architecture)

```
[Khách Hàng (Web App - Next.js 14)]
                 │
                 ▼ (HTTP / REST API)
[API Gateway / NestJS 10 (Fastify Adapter)]
                 │
      ┌──────────┴──────────┐
      ▼                     ▼
[Redis 7.2 Cache]      [BullMQ Queue]
- Atomic Lua Script    - Worker bất đồng bộ
- Temporary Hold       - Ghi đơn hàng hàng loạt
- Idempotency Key           │
                            ▼
               [PostgreSQL 16 Database]
               - Partitioned Tables (orders)
               - Inventory Stock Ledger
               - Financial & Customer Data
```

### Công Nghệ Sử Dụng (Tech Stack):

| Thành phần | Công nghệ | Chi tiết sử dụng |
| :--- | :--- | :--- |
| **Frontend** | **Next.js 14 (App Router)** | React 18, TypeScript, Tailwind CSS, Lucide Icons, Canvas Confetti |
| **Data Fetching** | **TanStack React Query v5** | Quản lý caching, polling trạng thái queue, optimistic UI updates |
| **Backend API** | **NestJS 10 + Fastify** | Modular Architecture, Fastify Engine, Class Validator, Dependency Injection |
| **Cache & Concurrency** | **Redis 7.2 (AOF Enabled)** | Redis Lua Scripts nguyên tử, distributed locks, rate limiting |
| **Message Queue** | **BullMQ 5** | Quản lý hàng đợi xử lý đơn hàng, retry mechanism, dead-letter queue |
| **Database & ORM** | **PostgreSQL 16 + Prisma ORM** | Range Partitioning (orders table), UUID primary keys, Relational schema |
| **Kiểm thử chịu tải** | **k6 Load Testing** | Kịch bản stress test giả lập hàng nghìn người dùng đặt hàng đồng thời |
| **Containerization** | **Docker & Docker Compose** | Khởi chạy cụm dịch vụ Redis và PostgreSQL nhanh chóng, nhất quán |

---

## ✨ 3. Tính Năng Nổi Bật

### 🛒 Dành cho Người Mua Hàng (Storefront):
1. **Trang Chủ & Danh Mục:**
   - Banner Flash Sale với đồng hồ đếm ngược thời gian thực.
   - Tìm kiếm, lọc sản phẩm theo danh mục, giá bán, độ phổ biến.
2. **Chi Tiết Sản Phẩm & Đánh Giá:**
   - Xem thông tin chi tiết, tồn kho khả dụng thời gian thực.
   - Hệ thống đánh giá, phản hồi có hình ảnh và chấm sao từ khách hàng.
3. **Giỏ Hàng & Danh Sách Yêu Thích (Wishlist):**
   - Quản lý giỏ hàng nhanh qua Drawer trượt mượt mà.
   - Lưu trữ sản phẩm yêu thích vào local storage và đồng bộ tài khoản.
4. **Quy Trình Đặt Hàng Flash Sale Tốc Độ Cao:**
   - Áp dụng mã giảm giá (Vouchers / Coupons).
   - Cơ chế hàng đợi thông minh hiển thị modal tiến độ xử lý đơn hàng theo thời gian thực.
5. **Theo Dõi Đơn Hàng & Lịch Sử Giao Dịch:**
   - Kiểm tra hành trình đơn hàng (Chờ xử lý, Đang đóng gói, Đang giao hàng, Hoàn tất).
   - Xem chi tiết hóa đơn điện tử, thông tin vận chuyển COD.
6. **Hồ Sơ & Khách Hàng Thân Thiết (Loyalty Points):**
   - Tích điểm thưởng cho mỗi đơn hàng thành công, nâng cấp bậc thành viên.

### 💼 Dành cho Quản Trị Viên (Enterprise Admin Dashboard):
Hệ thống quản trị đa phân hệ toàn diện tại `/admin`:
- **Tổng quan (Overview):** Dashboard trực quan hóa doanh thu, đơn hàng, tỷ lệ chuyển đổi, cảnh báo tồn kho sắp hết.
- **Sản phẩm (Products):** Thêm, sửa, cập nhật trạng thái sản phẩm, hình ảnh, giá bán và danh mục.
- **Tồn kho & Kho bãi (Inventory & Warehouses):** Quản lý mức tồn kho vật lý (`on_hand`), tồn kho đang giữ (`reserved`), và tồn kho khả dụng (`available`) theo từng kho.
- **Đơn hàng (Orders):** Duyệt đơn, cập nhật trạng thái đơn hàng từ lúc đặt đến khi hoàn tất hoặc hủy.
- **Khách hàng & CRM (Customers):** Quản lý tài khoản, điểm thưởng loyalty, lịch sử mua sắm.
- **Marketing & Flash Sale:** Tạo sự kiện flash sale, thiết lập khung giờ, cấu hình mã coupon.
- **Vận hành Logistics:** Phân công đơn vị vận chuyển, in mã vận đơn, theo dõi hành trình giao nhận.
- **Tài chính & Kế toán (Finance):** Đối soát COD, xuất hóa đơn điện tử (E-Invoice), quản lý dòng tiền.
- **Cấu hình & Audit Log (System):** Theo dõi nhật ký hoạt động hệ thống, cấu hình ngưỡng cảnh báo.

---

## 📁 4. Cấu Trúc Dự Án (Monorepo)

```
.
├── apps/
│   ├── backend/                      # Ổ ứng dụng NestJS API
│   │   ├── prisma/                   # Prisma schema, migrations, seed script
│   │   ├── src/
│   │   │   ├── common/               # Guards, interceptors, decorators, constants
│   │   │   ├── database/             # Prisma service & database connection
│   │   │   ├── modules/
│   │   │   │   ├── admin/            # Nghiệp vụ quản trị toàn diện
│   │   │   │   ├── auth/             # Xác thực, JWT, phân quyền người dùng
│   │   │   │   ├── flash-sales/      # Logic quản lý sự kiện flash sale
│   │   │   │   ├── inventory/        # Quản lý kho, tích hợp Redis Lua Script
│   │   │   │   ├── orders/           # Tạo đơn, tích hợp BullMQ queue worker
│   │   │   │   └── products/         # Quản lý danh mục & sản phẩm
│   │   │   ├── redis/                # Cấu hình Redis client & Lua scripts
│   │   │   └── main.ts               # Điểm khởi chạy Fastify + NestJS
│   │   └── tsconfig.json
│   │
│   └── frontend/                     # Ứng dụng Next.js 14 Web
│       ├── app/                      # Next.js App Router (Storefront & Admin)
│       │   ├── admin/                # Giao diện Admin Dashboard
│       │   ├── orders/               # Lịch sử và chi tiết đơn hàng
│       │   ├── profile/              # Thông tin cá nhân & điểm tích lũy
│       │   └── page.tsx              # Trang chủ sàn thương mại điện tử
│       ├── components/               # UI Components (Modals, Drawers, Cards)
│       │   └── admin/                # Phân hệ components và modals quản trị
│       ├── context/                  # Context State (Auth, Cart, Wishlist, Admin)
│       └── lib/                      # API client, utility functions
│
├── load-tests/                       # Kịch bản kiểm thử tải với k6
│   └── k6/                           # Stress test script, prepare tokens
├── scripts/                          # Script khởi tạo database & SQL phân vùng
├── docker-compose.yml                # Docker Compose cho PostgreSQL 16 & Redis 7.2
├── package.json                      # Root workspace manifest
└── README.md                         # Tài liệu hướng dẫn dự án
```

---

## ⚡ 5. Hướng Dẫn Cài Đặt & Chạy Dự Án

### Điều kiện tiên quyết:
- **Node.js:** Phiên bản `18.x` hoặc `20.x` trở lên
- **NPM** hoặc **PNPM**
- **Docker & Docker Compose** (để chạy cơ sở dữ liệu và cache)

---

### Bước 1: Clone kho lưu trữ
```bash
git clone https://github.com/Hizari-meow/TMDT.git
cd TMDT
```

### Bước 2: Cấu hình biến môi trường
Sao chép tệp mẫu `.env.example` thành `.env`:
```bash
cp .env.example .env
cp .env.example apps/backend/.env
```

Nội dung `.env` mẫu:
```env
NODE_ENV=development
PORT=3001

# PostgreSQL
POSTGRES_USER=flashsale
POSTGRES_PASSWORD=flashsale_secret
POSTGRES_DB=flashsale_db
POSTGRES_PORT=5433
DATABASE_URL=postgresql://flashsale:flashsale_secret@localhost:5433/flashsale_db?schema=public

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=redis_secure_password

# Frontend API URL
NEXT_PUBLIC_API_URL=http://localhost:3001
```

---

### Bước 3: Khởi động cơ sở dữ liệu (PostgreSQL & Redis)
Khởi chạy dịch vụ container nền:
```bash
docker compose up -d
```
> Lệnh này sẽ khởi động PostgreSQL 16 tại cổng `5433` và Redis 7.2 tại cổng `6379`.

---

### Bước 4: Khởi tạo Schema & Nạp Dữ Liệu Mẫu (Seed Data)
Cài đặt dependencies và thực hiện migration:
```bash
# Cài đặt dependencies toàn bộ dự án
npm install

# Khởi tạo bảng dữ liệu và phân vùng PostgreSQL
npm run db:migrate

# Nạp dữ liệu mẫu (sản phẩm, tài khoản, sự kiện flash sale)
npm run db:seed
```

---

### Bước 5: Chạy Ứng Dụng

#### Khởi chạy Backend (NestJS):
```bash
npm run backend:dev
```
Backend API sẽ lắng nghe tại: `http://localhost:3001`

#### Khởi chạy Frontend (Next.js 14):
Mở một terminal mới:
```bash
npm run frontend:dev
```
Giao diện Web sẽ sẵn sàng tại: `http://localhost:3000`

---

## 🚦 6. Kiểm Thử Chịu Tải (Stress Testing with k6)

Dự án cung cấp bộ kịch bản kiểm thử tải k6 chuyên nghiệp tại `load-tests/k6/flash_sale_stress.js`, mô phỏng hàng ngàn request mua hàng trong đợt flash sale.

```bash
# Chạy stress test k6
npm run test:stress
```
*Kết quả kiểm thử bảo đảm:*
- Tỷ lệ lỗi (Error Rate): `0.00%`
- Bán đúng số lượng tồn kho định mức, không vượt quá dù chỉ 1 sản phẩm.
- Phản hồi trung bình dưới `50ms`.

---

## 📜 7. Bản Quyền & Tác Giả (License & Author)

- **Tác giả:** [Hizari-meow](https://github.com/Hizari-meow)
- **Email:** nguyenquocvietah@gmail.com
- **Giấy phép:** Được phát hành dưới giấy phép [MIT License](LICENSE).
