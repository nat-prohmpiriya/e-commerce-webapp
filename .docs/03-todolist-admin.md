# Admin Panel - TODO List

## Phase 1: Core Admin Features (Priority High)

### 1. Admin Authentication & Route Protection
- [x] Create admin role check middleware
- [x] Add admin role to User type in Firestore
- [x] Create admin login page (`/admin/login`)
- [x] Implement admin route protection
- [x] Add redirect for non-admin users

### 2. Admin Layout & Navigation
- [x] Create admin layout component (`/components/admin/AdminLayout.tsx`)
- [x] Create admin sidebar navigation
- [x] Create admin header with user info
- [x] Design responsive admin layout (desktop-first)
- [x] Add logout functionality

### 3. Admin Dashboard (Overview)
- [x] Create dashboard page (`/admin/dashboard`)
- [x] Display key metrics cards:
  - [x] Total Revenue (today, week, month)
  - [x] Total Orders (today, week, month)
  - [x] Total Products
  - [x] Total Users
- [ ] Create revenue chart (daily/monthly)
- [x] Display recent orders list
- [ ] Show low stock products alert
- [ ] Add quick actions buttons

### 4. Product Management
- [x] Create products list page (`/admin/products`)
  - [x] Display all products in table/grid
  - [x] Add search functionality
  - [x] Add filter by category
  - [ ] Add sort options (name, price, stock)
  - [ ] Add pagination
- [x] Create add product page (`/admin/products/new`)
  - [x] Product name, description
  - [x] Category selection
  - [x] Price and sale price
  - [x] Image upload (multiple images)
  - [x] Sizes and colors selection
  - [x] Stock quantity
  - [x] Published/Draft status
- [x] Create edit product page (`/admin/products/[id]/edit`)
  - [x] Load existing product data
  - [x] Update all fields
  - [x] Delete product option
- [x] Create ProductContext for admin operations
  - [x] getAllProducts()
  - [x] createProduct()
  - [x] updateProduct()
  - [x] deleteProduct()
  - [ ] updateStock()

### 5. Order Management
- [x] Create orders list page (`/admin/orders`)
  - [x] Display all orders in table
  - [x] Show order number, customer, total, status, date
  - [x] Add search by order number/customer
  - [x] Add filter by status
  - [ ] Add filter by date range
  - [ ] Add pagination
- [x] Create order detail page (`/admin/orders/[id]`)
  - [x] Display full order details
  - [x] Show customer information
  - [x] Show order items
  - [x] Show shipping address
  - [x] Show payment information
  - [x] **Add update order status dropdown**
  - [ ] Add notes/comments section
  - [ ] Add print invoice button
- [x] Extend OrderContext for admin operations
  - [x] getAllOrders() - fetch all orders (not just user's)
  - [x] updateOrderStatus()
  - [ ] addOrderNote()
  - [ ] searchOrders()
  - [ ] filterOrders()

---

## Phase 2: Enhanced Features (Priority Medium)

### 6. User Management
- [x] Create users list page (`/admin/users`)
  - [x] Display all users
  - [x] Show email, name, role, registration date
  - [x] Add search functionality
  - [x] Add filter by role
- [ ] Create user detail page (`/admin/users/[id]`)
  - [ ] Display user information
  - [ ] Show order history
  - [ ] Update user role
  - [ ] Suspend/activate user
- [x] Create UserManagementContext (handled in page component)
  - [x] getAllUsers()
  - [x] updateUserRole()
  - [x] suspendUser()
  - [ ] getUserOrders()

### 7. Category Management
- [x] Create categories page (`/admin/categories`)
  - [x] List all categories
  - [x] Add new category
  - [x] Edit category
  - [x] Delete category
  - [x] Show product count per category
- [x] Create CategoryContext
  - [x] getAllCategories()
  - [x] createCategory()
  - [x] updateCategory()
  - [x] deleteCategory()

### 8. Discount Codes & Promotions
- [ ] Create discount codes page (`/admin/discounts`)
  - [ ] List all discount codes
  - [ ] Show code, type, value, usage, status
  - [ ] Add filter by active/expired
- [ ] Create add discount page (`/admin/discounts/new`)
  - [ ] Code input
  - [ ] Discount type (percentage/fixed)
  - [ ] Discount value
  - [ ] Minimum purchase amount
  - [ ] Maximum discount amount
  - [ ] Valid from/until dates
  - [ ] Usage limit
  - [ ] Active status
- [ ] Create edit discount page (`/admin/discounts/[id]/edit`)
  - [ ] Update discount details
  - [ ] View usage statistics
  - [ ] Deactivate/activate
- [ ] Create DiscountContext
  - [ ] getAllDiscounts()
  - [ ] createDiscount()
  - [ ] updateDiscount()
  - [ ] deleteDiscount()
  - [ ] validateDiscount()

---

## Phase 3: Analytics & Advanced Features (Priority Low)

### 9. Analytics & Reports
- [ ] Create analytics page (`/admin/analytics`)
  - [ ] Sales report (daily, weekly, monthly, yearly)
  - [ ] Revenue chart with filters
  - [ ] Top selling products
  - [ ] Sales by category
  - [ ] Customer acquisition chart
  - [ ] Export reports (CSV/PDF)
- [ ] Create AnalyticsContext
  - [ ] getSalesReport()
  - [ ] getTopProducts()
  - [ ] getCategoryStats()
  - [ ] getCustomerStats()

### 10. Settings
- [ ] Create settings page (`/admin/settings`)
  - [ ] Shipping fee configuration
  - [ ] Tax rate settings
  - [ ] Payment methods toggle
  - [ ] Email notifications settings
  - [ ] Store information
  - [ ] Social media links
- [ ] Create AdminSettingsContext
  - [ ] getStoreSettings()
  - [ ] updateStoreSettings()

### 11. Image Upload & Management
- [x] Set up Firebase Storage
- [x] Create image upload component
- [ ] Create image gallery/manager
- [ ] Add image optimization
- [ ] Add drag & drop support

### 12. Notifications System
- [ ] Create admin notifications
- [ ] Alert on new orders
- [ ] Alert on low stock
- [ ] Alert on failed payments
- [ ] Mark notifications as read

---

## Technical Tasks

### Database & Backend
- [ ] Create Firestore indexes for admin queries
- [ ] Set up Firestore security rules for admin
- [ ] Create Cloud Functions for:
  - [ ] Order status update notifications
  - [ ] Low stock alerts
  - [ ] Revenue calculations

### UI/UX
- [ ] Design admin color scheme
- [ ] Create reusable admin components:
  - [ ] DataTable component
  - [ ] StatCard component
  - [ ] Chart component (using recharts/chart.js)
  - [ ] Modal component
  - [ ] ConfirmDialog component
  - [ ] FileUpload component
- [ ] Add loading states
- [ ] Add error boundaries
- [ ] Add toast notifications

### Testing
- [ ] Test admin authentication
- [ ] Test CRUD operations
- [ ] Test role-based access
- [ ] Test responsive design

---

## Notes

### Priority Order (Recommended):
1. **Admin Authentication & Route Protection** - ป้องกันการเข้าถึงก่อน
2. **Admin Layout & Navigation** - สร้าง structure
3. **Admin Dashboard** - หน้าภาพรวม
4. **Product Management** - จัดการสินค้า (สำคัญที่สุด)
5. **Order Management** - อัปเดต order status (สำคัญมาก)
6. **User Management** - จัดการผู้ใช้
7. **Discount Codes** - ส่วนลด
8. **Analytics** - รายงาน
9. **Settings** - ตั้งค่า

### Tech Stack for Admin:
- **UI**: Tailwind CSS + shadcn/ui (optional)
- **Charts**: Recharts or Chart.js
- **Tables**: TanStack Table or custom
- **Forms**: React Hook Form + Zod validation
- **File Upload**: Firebase Storage
- **State Management**: React Context API (existing)

### Design Considerations:
- Desktop-first design (admin typically used on desktop)
- Minimum width: 1024px recommended
- Use tables for data display
- Add keyboard shortcuts for common actions
- Implement bulk actions (select multiple items)
