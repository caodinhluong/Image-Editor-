# 📖 HƯỚNG DẪN SỬ DỤNG REPIX AI - COMPLETE USER GUIDE

> Tài liệu hướng dẫn chi tiết tất cả chức năng của Repix AI Photo Editor

---

## 📑 MỤC LỤC

1. [Landing Page](#1-landing-page)
2. [Authentication](#2-authentication)
3. [Onboarding](#3-onboarding)
4. [Layout & Navigation](#4-layout--navigation)
5. [Home Dashboard](#5-home-dashboard)
6. [Editor](#6-editor)
7. [Assets Library](#7-assets-library)
8. [Brand Kit](#8-brand-kit)
9. [Marketplace](#9-marketplace)
10. [Team Workspace](#10-team-workspace)
11. [Analytics](#11-analytics)
12. [Creator Dashboard](#12-creator-dashboard)
13. [Profile](#13-profile)
14. [Settings](#14-settings)
15. [Subscription System](#15-subscription-system)
16. [Collaboration Features](#16-collaboration-features)

---

## 1. LANDING PAGE

**File:** `src/components/Landing/LandingPage.tsx`

### Chức năng:
- **Hero Section**: Hiển thị tagline "Create at the speed of Imagination" với animation
- **Galaxy Background**: Hiệu ứng nền thiên hà tương tác với chuột
- **Floating Navbar**: Navigation bar cố định với logo, menu links, theme toggle
- **Trusted By Marquee**: Hiển thị logo các công ty đối tác (ACME, Vercel, Linear, Stripe...)
- **Features Bento Grid**: 
  - Generative Fill 2.0
  - Real-time Sync
  - Global Edge Network
  - Asset Marketplace
  - Enterprise Security
- **Global Scale Stats**: Animated counters (150+ Edge Locations, 99.99% Uptime, <50ms Latency, 2M+ Daily Assets)
- **Pricing Section**: 4 gói (Free, Plus, Pro, Team) với icon và features
- **Footer**: Links, social media, newsletter signup

### Tương tác:
- Click logo → Scroll to top
- Theme toggle (Dark/Light)
- CTA buttons → Login/Signup
- Pricing cards hover effects

---

## 2. AUTHENTICATION

**File:** `src/components/Auth/AuthPage.tsx`

### Chức năng:
- **Login Form**: Email + Password
- **Signup Form**: Full Name + Email + Password
- **Google OAuth**: Đăng nhập bằng Google
- **User Type Selection** (sau signup):
  - Casual User (Zap icon)
  - Creator/Seller (Crown icon) - Recommended
  - Agency/Team (Briefcase icon)
  - Enterprise (Building2 icon)

### Tương tác:
- Toggle giữa Login/Signup
- Form validation
- Loading states
- Back button → Landing page

---

## 3. ONBOARDING

**File:** `src/components/Onboarding/OnboardingFlow.tsx`

### Chức năng:
- **4 bước onboarding**:
  1. Welcome - Giới thiệu features chính
  2. Who are you? - Chọn persona (Creator, Photographer, E-commerce, Agency, Hobbyist)
  3. Powerful AI Tools - Giới thiệu công cụ AI
  4. Ready to Start - Hoàn tất setup

### Tương tác:
- Progress bar
- Next/Back navigation
- Skip button
- Persona selection (required)

---

## 4. LAYOUT & NAVIGATION

**File:** `src/components/Layout.tsx`

### Desktop Sidebar:
- **Brand Logo**: Click → Home
- **Theme Toggle**: Dark/Light mode
- **Language Toggle**: VI/EN
- **Navigation Menu**:
  - Home
  - Editor
  - Assets
  - Brand Kit
  - Marketplace
  - Team
  - Analytics
  - Creator Dashboard
- **User Area**:
  - Plan Badge (hiển thị gói hiện tại)
  - User Avatar + Name
  - Settings button
  - Sign Out button

### Mobile Bottom Navigation:
- 8 nav items + Profile
- Hidden khi ở Editor view

---

## 5. HOME DASHBOARD

**File:** `src/App.tsx` (HomeView component)

### Chức năng:
- **Hero Section**: Prompt input với AI generation
- **Image Upload**: Drag & drop, paste, hoặc click để upload (tối đa 4 ảnh)
- **Quick Actions**: 
  - Remove Background
  - Upscale 4K
  - Smart Crop
  - Style Transfer
- **Workflows Section**: Social Media, E-commerce, Marketing, Portrait
- **Inspiration Gallery**: Trending/Recent images với masonry layout
- **Pricing Section**: 4 gói subscription với features

### Tương tác:
- AI prompt generation với progress bar
- Image upload preview
- Quick action buttons
- Inspiration image click → Open Editor

---

## 6. EDITOR

**File:** `src/components/Editor/EditorView.tsx`

### Toolbar (8 công cụ):
| Tool | Icon | Feature Gate | Credits |
|------|------|--------------|---------|
| Move | Move | - | - |
| Object Select | ScanFace | - | - |
| Generative Fill | Sparkles | genFill | genFill |
| Magic Erase | Eraser | magicErase | magicErase |
| Crop | Crop | - | - |
| Remove BG | Aperture | removeBg | removeBg |
| Upscale 4K | Maximize2 | upscale4K | upscale |
| Style Transfer | Palette | styleTransfer | styleTransfer |

### Top Bar:
- Project name + Draft badge
- Undo/Redo/History buttons
- Comments button (với badge count)
- Notifications button
- Presence Indicators (collaborators online)
- Share button
- Export button

### Canvas Features:
- Zoom in/out (Ctrl + scroll)
- Pan (drag)
- Object detection overlay
- Crop grid overlay
- Magic erase brush cursor
- Style applied badge

### Right Panel Tabs:
- **Adjustments**: Brightness, Contrast, Saturation, Temperature, Tint, Exposure, Highlights, Shadows
- **Layers**: Layer management với visibility, lock, reorder
- **Style**: Moodboard style presets (Cyberpunk, Pastel, Vintage) + AI preset generator
- **Brand Kit**: Apply brand styles
- **AI Advisor**: Content suggestions

### Prompt Bar (Bottom):
- Text input với image upload
- Enhance prompt button
- Generate button với progress

### Side Panels:
- History Panel
- Comments Panel
- Notifications Panel

---

## 7. ASSETS LIBRARY

**File:** `src/components/Assets/AssetLibrary.tsx`

### Sidebar:
- **Storage Info**: Usage bar (2.4 GB / 10 GB)
- **Folders**:
  - All Assets
  - Exports
  - Projects
  - Generated
  - Templates
  - Batch Processed
- **New Folder** button

### Toolbar:
- Search input
- Filter dropdown (All, Images, Projects, Templates)
- Sort button (Date, Name, Size)
- View mode toggle (Grid/List)
- Upload button

### Asset Card (Grid View):
- Thumbnail với hover effects
- Selection checkbox
- Star/Favorite button
- Source badge (AI, Edited, Batch, Upload)
- Status icon (Synced, Local, Processing, Error)
- Name, dimensions, size
- Brand Kit tag (nếu có)
- Quick actions: Preview, Download

### Bulk Actions:
- Download selected
- Share selected
- Delete selected
- Clear selection

---

## 8. BRAND KIT

**Files:** `src/components/BrandKit/`

### Brand Kit Manager:
- Grid view các brand kits
- Create new button
- Edit/Delete actions
- Active brand kit indicator

### Brand Kit Creator (Wizard):
- **Step 1**: Basic Info (Name, Description, Logo upload)
- **Step 2**: Colors (Primary, Secondary, Accent, Background, Text)
- **Step 3**: Typography (Heading font, Body font, sizes)
- **Step 4**: Filters & Effects (Presets, custom adjustments)
- **Step 5**: Review & Save

### Brand Style Applicator:
- Select brand kit
- Preview before/after
- Apply to current image
- Strength slider

### Consistency Score Card:
- Score percentage
- Color match
- Typography match
- Filter match
- Suggestions for improvement

### Batch Processor:
- Select multiple images
- Apply brand kit
- Progress tracking
- Export all

---

## 9. MARKETPLACE

**File:** `src/components/Marketplace/MarketplaceView.tsx`

### Features:
- **Search & Filter**: By category, style, price
- **Template Cards**: Thumbnail, title, author, price, downloads, likes
- **Template Detail Modal**:
  - Preview with Before/After toggle
  - Author info + Follow button
  - Description
  - Template DNA (Model, Style Strength, Tags)
  - Import options (Upload file, Google Drive)
  - Generate Result button

### Creator Studio:
- **Recipe Tab**: Prompt, Negative prompt, CFG Scale, Steps, Model selection
- **Details Tab**: Title, Price, Category
- Test Run button
- Publish button

---

## 10. TEAM WORKSPACE

**File:** `src/components/Team/TeamView.tsx`

### Features:
- **Projects Grid**: Thumbnail, name, status, collaborators, last edited
- **Create Project Wizard**:
  - Step 1: Project Type (Social, Product, Marketing, Blank)
  - Step 2: Details (Name, Description, Privacy)
  - Step 3: Team (Add members)
  - Step 4: AI Configuration (Model, Content Filter)

### Project Detail View:
- **Assets Tab**: Grid of project assets với status badges
- **Kanban Board Tab**: To Do, In Progress, Done columns
- **Brief Tab**: Project objectives, timeline

### Team Members:
- Avatar, name, role
- Invite new members

---

## 11. ANALYTICS

**File:** `src/components/Analytics/AnalyticsView.tsx`

### Stats Cards:
- Total Generations (với trend %)
- Credits Used
- Avg Process Time
- Success Rate

### Charts:
- **Generation Trend**: Line chart (generations + credits over time)
- **Tool Usage**: Pie chart (Text to Image, Remove BG, Upscale 4K, Gen Fill, Others)

### Recent Activity:
- Tool used
- Prompt/description
- Time ago
- Status (success/failed)
- Credits used

### Period Selector:
- Last 7 days
- Last 30 days
- Last 90 days
- All time

---

## 12. CREATOR DASHBOARD

**File:** `src/components/Creator/CreatorDashboard.tsx`

### Tabs:
- **Overview**: Stats + Revenue chart + Recent sales + Recent reviews
- **Templates**: Grid of published templates với edit/delete
- **Analytics**: Deep dive analytics
- **Earnings**: Balance, Pending, Next payout
- **Reviews**: All reviews với ratings
- **Payout**: Payment settings

### Stats:
- Total Earnings ($)
- This Month ($)
- Total Sales
- Avg Rating
- Total Downloads
- Active Templates
- Conversion Rate

### Template Card:
- Thumbnail
- Name, Category
- Price
- Sales, Downloads, Rating
- Status badge (Published, Draft, Pending, Rejected)
- Edit/Delete buttons

### Payout Settings:
- Bank account info
- PayPal connection
- Payout schedule
- Tax information

---

## 13. PROFILE

**File:** `src/components/Profile/ProfileView.tsx`

### Hero Section:
- Cover image (editable)
- Avatar (editable)
- Name, handle, join date
- Plan badge
- Stats: Followers, Following, Downloads
- Edit Profile, Share, More buttons

### Credit Dashboard:
- Credits remaining / total
- Progress bar
- Next billing date

### Achievements:
- Power User
- Top Seller
- Verified (locked)

### Tabs:
- **Portfolio**: Grid of user's images
- **Templates**: Published templates với sales info
- **Likes**: Liked content
- **Billing**: Payment history
- **Settings**: Profile visibility, notifications, API key

---

## 14. SETTINGS

**File:** `src/components/Settings/SettingsPanel.tsx`

### Tabs:

#### Account:
- Profile info (Name, Email, Username)
- Preferences (Language, Theme)

#### Billing:
- Current Plan với badge
- Stats: Price, Credits Remaining, Used This Month, Next Renewal
- Credits progress bar
- Upgrade button
- Buy Credits button
- Demo Plan Switcher
- Payment Method
- Billing History

#### Security:
- Change Password
- Two-Factor Authentication
- Active Sessions

#### API:
- API Keys management (Create, View, Revoke)
- Webhooks configuration

#### Team:
- Team Members list
- Invite Member button
- Role management (Owner, Admin, Member)

#### Notifications:
- Email Notifications toggle
- Push Notifications toggle
- Desktop Notifications toggle

---

## 15. SUBSCRIPTION SYSTEM

**Files:** `src/components/Subscription/`, `src/contexts/SubscriptionContext.tsx`, `src/types/subscription.ts`

### Gói Subscription:

| Plan | Price | Credits | Key Features |
|------|-------|---------|--------------|
| Free | $0 | 50 | 5 images/month, Basic tools, 1080p export |
| Plus | $9 | 200 | 50 images/month, AI background removal, 4K export, No watermark |
| Pro | $19 | 500 | Unlimited images, All AI tools, Brand Kit, Batch processing, Priority support |
| Team | Custom | Unlimited | Everything in Pro + 5 members, Real-time collaboration, Dedicated support |

### Components:

#### Plan Badge:
- Hiển thị gói hiện tại với icon
- Click → Upgrade Modal

#### Upgrade Modal:
- 4-column grid layout
- Plan comparison
- "Most Popular" badge cho Plus
- Animated success state
- Feature highlights

#### Feature Gate:
- Lock icon cho premium features
- Trigger upgrade modal khi click
- Credits check trước khi thực hiện

#### Credits Indicator:
- Hiển thị credits còn lại
- Warning khi thấp

---

## 16. COLLABORATION FEATURES

**Files:** `src/components/Collaboration/`

### Presence Indicators:
- Avatar stack của collaborators online
- Tooltip với tên
- "Editing" status

### Comments Panel:
- Filter: All, Open, Resolved
- Comment với author, timestamp, content
- Reply thread
- Resolve/Reopen button
- Delete button
- Mention (@) support
- New comment input

### Notification Center:
- Unread count badge
- Notification types:
  - Mention
  - Comment
  - Share
  - Resolve
  - Assign
  - System
- Mark as read
- Mark all as read
- Delete notification

### Activity Feed:
- Real-time updates
- Action history

---

## 🔧 COMPONENTS MỚI ĐƯỢC BỔ SUNG

### ✅ Đã hoàn thành:

#### 1. **Keyboard Shortcuts Modal** ✅
- **File:** `src/components/Editor/KeyboardShortcutsModal.tsx`
- **Chức năng:** Hiển thị tất cả phím tắt theo nhóm (General, Tools, View, Layers, Export)
- **Tính năng:** Hỗ trợ song ngữ VI/EN, thiết kế đẹp với kbd tags

#### 2. **Export Settings Modal** ✅
- **File:** `src/components/Editor/ExportModal.tsx`
- **Chức năng:** Chọn format (PNG, JPG, WebP, PDF), quality slider, size presets
- **Tính năng:** Social media presets (Instagram, Facebook, Twitter), estimated file size

#### 3. **Help Center** ✅
- **File:** `src/components/Help/HelpCenter.tsx`
- **Chức năng:** Searchable FAQ, Video tutorials, Category navigation
- **Tính năng:** Contact support, expandable FAQ items, song ngữ

#### 4. **Image Comparison Slider** ✅
- **File:** `src/components/Common/ImageComparisonSlider.tsx`
- **Chức năng:** Draggable slider để so sánh Before/After
- **Tính năng:** Touch support, smooth animations, labels

#### 5. **Error Pages** ✅
- **File:** `src/components/Common/ErrorPages.tsx`
- **Components:** NotFoundPage (404), ServerErrorPage (500), OfflinePage, GenericErrorPage
- **Tính năng:** Illustrations, action buttons, song ngữ

#### 6. **Empty States** ✅
- **File:** `src/components/Common/EmptyStates.tsx`
- **Components:** NoImagesState, EmptyFolderState, NoSearchResultsState, NoTeamMembersState, NoTemplatesState, NoProjectsState, NoNotificationsState, NoCommentsState, NoFavoritesState
- **Tính năng:** Icons, CTAs, song ngữ

#### 7. **Changelog/What's New** ✅
- **File:** `src/components/Common/Changelog.tsx`
- **Chức năng:** Version history với highlights, changes by type
- **Tính năng:** Timeline UI, expandable versions, type badges (New, Improved, Fixed)

---

## 🔜 CHỨC NĂNG CÒN CẦN BỔ SUNG

### Ưu tiên cao:

### 1. **Mobile Editor Optimization**
- Editor chưa tối ưu cho mobile
- Cần: Touch gestures, Simplified toolbar, Gesture controls

### 2. **Search Results Page**
- Global search chưa có dedicated results page
- Cần: Filters, Sort, Pagination, Result categories

### 3. **Invoice/Receipt View**
- Billing history chỉ có list
- Cần: Detailed invoice view, Print/Download PDF

### Ưu tiên trung bình:

### 4. **Referral Program**
- Chưa có referral system UI
- Cần: Referral link, Rewards tracking, Share buttons

### 5. **Notification Preferences Detail**
- Chỉ có toggles đơn giản
- Cần: Granular notification settings per type

### 6. **Template Preview Modal Enhancement**
- Marketplace có nhưng cần cải thiện
- Cần: Full-screen preview, Zoom, Multiple angles

### 7. **Batch Export Progress Enhancement**
- Batch processor cần detailed progress UI
- Cần: Individual file progress, Cancel button, Error handling

---

## 📱 RESPONSIVE BREAKPOINTS

| Breakpoint | Width | Layout |
|------------|-------|--------|
| Mobile | < 768px | Bottom nav, Single column |
| Tablet | 768px - 1024px | 2 columns, Collapsible sidebar |
| Desktop | > 1024px | Full sidebar, Multi-column grids |

---

## 🌐 INTERNATIONALIZATION

Supported languages:
- English (en)
- Tiếng Việt (vi)

Translation file: `src/utils/translations.ts`

---

*Tài liệu được tạo tự động bởi Kiro AI - Cập nhật: December 2024*
