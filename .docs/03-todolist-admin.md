# Admin Panel - TODO List

## Phase 1: Core Admin Features (Priority High)

### 1. Admin Authentication & Route Protection
- [ ] Create admin role check middleware
- [ ] Add admin role to User type in Firestore
- [ ] Create admin login page (`/admin/login`)
- [ ] Implement admin route protection
- [ ] Add redirect for non-admin users

### 2. Admin Layout & Navigation
- [ ] Create admin layout component (`/components/admin/AdminLayout.tsx`)
- [ ] Create admin sidebar navigation
- [ ] Create admin header with user info
- [ ] Design responsive admin layout (desktop-first)
- [ ] Add logout functionality

### 3. Admin Dashboard (Overview)
- [ ] Create dashboard page (`/admin/dashboard`)
- [ ] Display key metrics cards:
  - [ ] Total Revenue (today, week, month)
  - [ ] Total Orders (today, week, month)
  - [ ] Total Products
  - [ ] Total Users
- [ ] Create revenue chart (daily/monthly)
- [ ] Display recent orders list
- [ ] Show low stock products alert
- [ ] Add quick actions buttons

### 4. Product Management
- [ ] Create products list page (`/admin/products`)
  - [ ] Display all products in table/grid
  - [ ] Add search functionality
  - [ ] Add filter by category
  - [ ] Add sort options (name, price, stock)
  - [ ] Add pagination
- [ ] Create add product page (`/admin/products/new`)
  - [ ] Product name, description
  - [ ] Category selection
  - [ ] Price and sale price
  - [ ] Image upload (multiple images)
  - [ ] Sizes and colors selection
  - [ ] Stock quantity
  - [ ] Published/Draft status
- [ ] Create edit product page (`/admin/products/[id]/edit`)
  - [ ] Load existing product data
  - [ ] Update all fields
  - [ ] Delete product option
- [ ] Create ProductContext for admin operations
  - [ ] getAllProducts()
  - [ ] createProduct()
  - [ ] updateProduct()
  - [ ] deleteProduct()
  - [ ] updateStock()

### 5. Order Management
- [ ] Create orders list page (`/admin/orders`)
  - [ ] Display all orders in table
  - [ ] Show order number, customer, total, status, date
  - [ ] Add search by order number/customer
  - [ ] Add filter by status
  - [ ] Add filter by date range
  - [ ] Add pagination
- [ ] Create order detail page (`/admin/orders/[id]`)
  - [ ] Display full order details
  - [ ] Show customer information
  - [ ] Show order items
  - [ ] Show shipping address
  - [ ] Show payment information
  - [ ] **Add update order status dropdown**
  - [ ] Add notes/comments section
  - [ ] Add print invoice button
- [ ] Extend OrderContext for admin operations
  - [ ] getAllOrders() - fetch all orders (not just user's)
  - [ ] updateOrderStatus()
  - [ ] addOrderNote()
  - [ ] searchOrders()
  - [ ] filterOrders()

---

## Phase 2: Enhanced Features (Priority Medium)

### 6. User Management
- [ ] Create users list page (`/admin/users`)
  - [ ] Display all users
  - [ ] Show email, name, role, registration date
  - [ ] Add search functionality
  - [ ] Add filter by role
- [ ] Create user detail page (`/admin/users/[id]`)
  - [ ] Display user information
  - [ ] Show order history
  - [ ] Update user role
  - [ ] Suspend/activate user
- [ ] Create UserManagementContext
  - [ ] getAllUsers()
  - [ ] updateUserRole()
  - [ ] suspendUser()
  - [ ] getUserOrders()

### 7. Category Management
- [ ] Create categories page (`/admin/categories`)
  - [ ] List all categories
  - [ ] Add new category
  - [ ] Edit category
  - [ ] Delete category
  - [ ] Show product count per category
- [ ] Create CategoryContext
  - [ ] getAllCategories()
  - [ ] createCategory()
  - [ ] updateCategory()
  - [ ] deleteCategory()

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
- [ ] Set up Firebase Storage
- [ ] Create image upload component
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
