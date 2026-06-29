# Vibe Coding Guide — MediQuick Online Medicine Delivery App
This guide contains a series of **9 sequential prompts** designed for students to build a premium, full-stack medicine delivery web application with Next.js, Prisma (SQLite), NextAuth.js, and Razorpay. 

By feeding these prompts to an AI coding assistant (like Gemini, Claude, or ChatGPT) step-by-step, students can construct the exact architecture, functionalities, and interactive pages of the app, while customizing the colors, style, and branding to their liking.

---

## Technical Architecture & Setup Rules

To ensure students do not run into common Next.js, database, or library bugs, the prompts incorporate specific guardrails for these known pain points:
1. **Windows C++ Compiler Restrictions**: Downgrade Prisma to version `6` (`^6.4.0`) to use the built-in Rust query engine. This avoids native C++ driver adapters (like `better-sqlite3`) that require Visual Studio build tools on Windows.
2. **Lucide React CASING & Icons**: Use `lucide-react` version `0.475.0` to preserve brand social icons.
3. **styled-jsx inside Server Components**: Keep Server Components pure. Never write `styled-jsx` directly in database-fetching Server Components; instead, extract dashboard CSS to dedicated stylesheets.
4. **React Hydration Mismatch**: Random client particle animations or dates must be deferred to post-mount (`useEffect`) to guarantee client-rendered HTML matches server-rendered HTML.
5. **Keyless Payments (Sandbox Simulator)**: Allow testing payments locally without actual Razorpay keys by creating a fallback sandbox simulator checkout modal in the frontend and signature bypass in the API endpoints.

---

# Prompt Sequence

### Step 1: Scaffolding, Theme Customization & Global CSS
> **Student Action**: Copy and paste the prompt below to start the project. Tell the AI what custom colors you want to use.

```text
Initialize a new Next.js 15+ project with TypeScript, App Router, and a `src` directory in the current folder. 
Do not use TailwindCSS; we want to write custom, modern vanilla CSS for maximum design control.

Let's setup the design system and scaffolding:
1. Install core dependencies: `prisma`, `@prisma/client`, `next-auth`, `razorpay`, `lucide-react@0.475.0`, `bcryptjs`, `zod`. (Ensure lucide-react is exactly 0.475.0).
2. Create `src/app/globals.css`. Set up CSS custom properties (variables) for a premium clean theme. Include tokens for background, card backgrounds, borders, typography, and vibrant accents (e.g. medical blue, teal, or soft green). Add smooth micro-animations, glassmorphism, and shadow effects.
3. Set up custom utility classes for buttons (`.btn`, `.btn-primary`, `.btn-secondary`, `.btn-lg`), badges, card-gradients, and responsive grids.
4. Create the root `layout.tsx` incorporating Google Fonts (Inter + Poppins) and SEO metadata. Make sure all pages include responsive styling.

Once done, print Tasks Finished.
```

---

### Step 2: Database Schema (Prisma & SQLite)
> **Student Action**: Run this prompt next to build the relational database schema.

```text
Let's build the relational database schema using Prisma for our medicine delivery app. 
Create `prisma/schema.prisma` targeting SQLite database provider. Ensure you define the following models:
1. `User` (id, name, email, password, phone, address, city, role [default 'MEMBER'], timestamps, relations to orders, prescriptions, accounts, sessions).
2. `Account` & `Session` & `VerificationToken` (standard models for NextAuth session adapters).
3. `Category` (id, name, slug [unique], description, imageUrl).
4. `Product` (id, name, slug [unique], description, price, originalPrice, stock, rxRequired [Boolean], imageUrl, categoryId [relation], timestamps).
5. `Prescription` (id, userId, imageUrl, status [PENDING/APPROVED/REJECTED], verifiedBy, notes, timestamps).
6. `Order` (id, userId, totalAmount, status [PENDING/PROCESSING/SHIPPED/DELIVERED/CANCELLED], deliveryAddress, paymentStatus, razorpayOrderId, razorpayPaymentId, razorpaySignature, timestamps).
7. `OrderItem` (id, orderId, productId, quantity, price).

After generating the schema, run `npx prisma generate` to build the Prisma Client.

Once done, print Tasks Finished.
```

---

### Step 3: Database Seeding
> **Student Action**: Run this prompt to populate the database with default categories and medicines.

```text
Create a Prisma seeding script in `prisma/seed.ts` that will populate the database when we run `npx prisma db seed`.
The seed script must populate:
1. 5+ Categories (e.g., Prescription Drugs, Supplements, Personal Care, Baby Care, Medical Devices).
2. 20+ Products spanning across these categories. Ensure some products have `rxRequired: true` (e.g., Antibiotics) and others false (e.g., Multivitamins, Bandages). Provide realistic names, prices, and stock counts.
3. Ensure the seed file compiles properly. Configure the `prisma.seed` command in your `package.json` and tell me how to run the migration and seed the database.

Once done, print Tasks Finished.
```

---

### Step 4: Authentication Core & Route Protection
> **Student Action**: Run this prompt to set up NextAuth session management and route validation.

```text
Let's implement credentials authentication:
1. Create a Prisma client singleton at `src/lib/db.ts` to prevent multiple client instances during hot-reloading.
2. Set up NextAuth configuration in `src/lib/auth.ts` with a CredentialsProvider. Implement email/password validation by fetching from the SQLite user table and comparing passwords using `bcryptjs`.
3. Expose session and role variables inside the JWT token and Session callbacks.
4. Create the Catchall NextAuth API route handler at `src/app/api/auth/[...nextauth]/route.ts`.
5. Create a registration API endpoint at `src/app/api/auth/register/route.ts` that validates email uniqueness, hashes passwords with bcrypt, and registers a new User.
6. Set up route protection middleware in `src/proxy.ts` (Next.js 16 Proxy convention or standard middleware) that redirects unauthenticated users trying to access `/dashboard` routes back to `/login`, and redirects logged-in users away from `/login`/`/register` to `/dashboard`.

Once done, print Tasks Finished.
```

---

### Step 5: Auth UI Pages (Login & Register)
> **Student Action**: Create the forms for user signups.

```text
Create beautiful, responsive split-screen pages for Authentication:
1. Create an auth page layout in `src/app/(auth)/layout.tsx` that displays a premium medical branding block on the left (e.g. background with abstract health art, trust signals) and the form inputs on the right.
2. Create the Login page `src/app/(auth)/login/page.tsx` using custom CSS. Validate email and password inputs client-side, showing error indicators. Integrate the NextAuth `signIn('credentials')` action and handle post-login redirects.
3. Create the Register page `src/app/(auth)/register/page.tsx` containing fields for Name, Email, Password, Phone Number, and full Delivery Address.
Ensure both forms look premium, use glassmorphism inputs, smooth hover scales, and clear validation logic.

Once done, print Tasks Finished.
```

---

### Step 6: Navigation, Hero & Marketing Landing Page
> **Student Action**: Build the public marketing pages.

```text
Let's assemble the public homepage and layout navigation:
1. Build a sticky Glassmorphism `Navbar.tsx` component in `src/components/Navbar.tsx`. Make it responsive with a toggleable burger menu on mobile. The navbar must read the NextAuth auth session and show a "Dashboard" link if logged in, and a "Login" CTA button if not. Include a Cart icon.
2. Build a modern `HeroSection.tsx` component. It should feature a large display heading ("Your Health, Delivered Fast"), a bold gradient tagline, a search bar for medicines, call-to-action buttons, and clean decorative medical crosses/particles. 
   - CRITICAL: To prevent React hydration mismatches, ensure any dynamic properties are deferred by rendering particles only after mounting (using `useState` and `useEffect` client-side).
3. Build a `CategoriesGrid.tsx` to display seeded medicine categories.
4. Build a `Footer.tsx` component featuring links, descriptions, contact info, and social brand icons using `lucide-react` (Instagram, Twitter, YouTube, Facebook). Add `use client` to Footer if it utilizes styled-jsx tags to prevent rendering errors.
5. Create the main landing page `src/app/page.tsx`. Fetch the categories and featured products from the database, render the Hero, Categories Grid, Featured Products list, and Trust Badges (e.g., 100% Genuine, Fast Delivery).

Once done, print Tasks Finished.
```

---

### Step 7: Shop, Prescriptions & Cart Management
> **Student Action**: Build the product catalog and prescription upload system.

```text
Let's build the core e-commerce flow:
1. **Products Catalog** (`src/app/shop/page.tsx`): Fetch all products. Build a filterable UI where users can search by name, filter by category, or toggle "Rx Required" medicines.
2. **Product Detail Page** (`src/app/shop/[slug]/page.tsx`): Display product info, original price (strikethrough), discounted price, and an "Add to Cart" button. If `rxRequired` is true, show a prominent warning badge.
3. **Cart State Management**: Use React Context (`src/context/CartContext.tsx`) or Zustand to manage global cart state (adding/removing items, updating quantities, calculating totals).
4. **Prescription Upload** (`src/app/upload-prescription/page.tsx`): Build a form for users to upload their prescription image (mocked file upload or base64) and add notes. Store this in the `Prescription` table and link to the user.

Once done, print Tasks Finished.
```

---

### Step 8: Razorpay Checkout & Sandbox Simulator Gateway
> **Student Action**: Implement this prompt to build the payment workflow with a keyless fallback modal.

```text
Let's set up the checkout and payments workflow supporting both real Razorpay transactions and a mock/development sandbox simulator:
1. Create a Checkout Page (`src/app/checkout/page.tsx`) that displays cart summary, delivery address, and a "Pay Now" button.
2. Create a Razorpay helper file `src/lib/razorpay.ts` that instantiates the Razorpay client using `process.env.RAZORPAY_KEY_ID` and `process.env.RAZORPAY_KEY_SECRET`. 
3. Create a POST endpoint `/api/payments/create-order/route.ts` that retrieves the cart items, calculates total, and checks if keys are default placeholders (e.g. `rzp_test_yourkeyhere`).
   - If keys are default placeholders, return a mock order payload (`isMock: true`, fake order ID like `order_mock_...`).
   - If keys are valid, call `razorpay.orders.create` to generate a real Razorpay order ID.
   - Insert a `PENDING` transaction record in the `Order` table along with `OrderItem`s.
4. Create a verification POST endpoint `/api/payments/verify/route.ts` that validates signature parameters:
   - If `orderId` starts with `order_mock_`, check if `signature === 'mock_signature'`.
   - Otherwise, verify the HMAC SHA-256 hash using the Razorpay key secret.
   - On successful payment, mark the order as `PROCESSING` and clear the user's cart.
5. Modify Checkout Page to handle order responses:
   - If `orderData.isMock` is returned, open a beautiful, custom glassmorphism **Sandbox Simulator checkout overlay modal** showing Total Price and Order ID. Add two buttons: "Simulate Success" (calls `/api/payments/verify` with mock signature) and "Cancel".
   - If real keys are present, load the Razorpay SDK script dynamically and prompt the native Razorpay payment overlay.
   - Redirect successful checkouts to `/dashboard/orders`.

Once done, print Tasks Finished.
```

---

### Step 9: Patient Dashboard & Order Tracking
> **Student Action**: Build the main private customer panels.

```text
Let's build the customer workspace dashboard:
1. Create a shared sidebar navigation layout at `src/app/dashboard/layout.tsx` providing links to: Overview, My Orders, My Prescriptions, and Account Settings.
2. Build the Main Overview dashboard home page `src/app/dashboard/page.tsx`. Fetch user session details and display a welcoming banner, quick action cards (Order Medicine, Upload Rx), and a list of recent orders.
3. Build the Orders page `src/app/dashboard/orders/page.tsx`:
   - Display a list of all past and active orders with their status badge (PENDING, PROCESSING, SHIPPED, DELIVERED).
   - Clicking an order shows order items, total amount paid, and delivery address.
   - CRITICAL: Save all component styles inside a dedicated `dashboard.css` file and import it directly. Do not use styled-jsx within server-rendered pages to prevent styled-jsx hydration mismatches.
4. Build the Prescriptions page `src/app/dashboard/prescriptions/page.tsx`: List user's uploaded prescriptions and their verification status (PENDING, APPROVED).

Once done, print Tasks Finished.
```

---

## Tips for Success (Vibe Coding)

* **Customize Colors**: Students can adjust the CSS custom properties in `globals.css` to instantly change the theme.
* **Troubleshooting Compilation**: If Next.js fails to compile styled-jsx or throws client/server mismatches, verify you have added `'use client';` at the top of interactive components (like navigation, carousels, lists, and forms).
* **Database Reset**: To wipe the SQLite database and start fresh with seed data, run:
  ```bash
  npx prisma db push --force-reset
  npx prisma db seed
  ```
