# 🔐 Hệ Thống Subscription - Repix AI

## 📋 Tổng Quan

Hệ thống subscription cho phép quản lý các gói dịch vụ, giới hạn tính năng theo gói, và hiển thị UI khóa tính năng rõ ràng.

## 🎯 Các Gói Dịch Vụ

| Gói | Giá | Credits/tháng | Brand Kits | Batch Images |
|-----|-----|---------------|------------|--------------|
| **Free** | $0 | 50 | 1 | 10 |
| **Pro** | $19/mo | 500 | 3 | 100 |
| **Team** | $49/mo | 2,000 | ∞ | 500 |
| **Enterprise** | Custom | ∞ | ∞ | ∞ |

## ✨ Tính Năng Theo Gói

### Free
- ✅ Basic AI Tools (Text-to-Image, Remove BG, Magic Erase)
- ✅ Standard Resolution (1080p)
- ✅ Community Templates
- ✅ 1 Brand Kit
- ❌ Watermark on exports

### Pro
- ✅ Everything in Free
- ✅ 4K Upscaling
- ✅ Batch Processing (100 images)
- ✅ Pro Templates
- ✅ 3 Brand Kits
- ✅ No Watermark
- ✅ Style Transfer
- ✅ Priority Queue

### Team
- ✅ Everything in Pro
- ✅ Shared Workspace
- ✅ Unlimited Brand Kits
- ✅ Team Comments & Review
- ✅ Batch Processing (500 images)
- ✅ Priority Support
- ✅ API Access

### Enterprise
- ✅ Everything in Team
- ✅ Unlimited Credits
- ✅ Custom Model Training
- ✅ SSO & Security
- ✅ On-premise Option
- ✅ Dedicated Account Manager
- ✅ 8K Resolution
- ✅ SLA Guarantee

## 💰 Credit Costs

| Operation | Credits |
|-----------|---------|
| Text to Image | 4 |
| Remove Background | 2 |
| Upscale 4K | 8 |
| Generative Fill | 5 |
| Style Transfer | 3 |
| Magic Erase | 3 |
| Batch Item | 1 |

## 🔧 Cách Sử Dụng

### 1. SubscriptionContext

```tsx
import { useSubscription } from './contexts/SubscriptionContext';

const MyComponent = () => {
  const { 
    currentPlan,      // 'free' | 'pro' | 'team' | 'enterprise'
    credits,          // Số credits còn lại
    canAccess,        // (feature) => boolean
    useCredits,       // (operation, amount) => boolean
    triggerUpgradeModal, // (feature) => void
    upgradePlan       // (plan) => void
  } = useSubscription();
};
```

### 2. FeatureGate Component

```tsx
import { FeatureGate } from './components/Subscription/FeatureGate';

// Wrap tính năng cần khóa
<FeatureGate feature="upscale4K">
  <UpscaleButton />
</FeatureGate>
```

### 3. ProBadge Component

```tsx
import { ProBadge } from './components/Subscription/FeatureGate';

// Hiển thị badge PRO/TEAM/ENT
<ProBadge plan="pro" size="sm" />
```

### 4. CreditsIndicator Component

```tsx
import { CreditsIndicator } from './components/Subscription/FeatureGate';

// Hiển thị credits còn lại
<CreditsIndicator />
```

### 5. PlanBadge Component

```tsx
import { PlanBadge } from './components/Subscription/PlanBadge';

// Hiển thị gói hiện tại + credits
<PlanBadge showCredits={true} />
```

## 📁 Cấu Trúc Files

```
src/
├── types/
│   └── subscription.ts          # Types & Plan definitions
├── contexts/
│   └── SubscriptionContext.tsx  # State management
└── components/
    └── Subscription/
        ├── index.ts             # Exports
        ├── FeatureGate.tsx      # Feature gating components
        ├── UpgradeModal.tsx     # Upgrade modal
        └── PlanBadge.tsx        # Plan badge components
```

## 🎮 Demo Mode

Trong Settings > Billing, có "Quick Plan Switcher" để test các gói khác nhau:
- Click vào gói để chuyển đổi ngay lập tức
- Credits sẽ được reset theo gói mới
- Tất cả feature gates sẽ cập nhật tự động

## 🔄 Tích Hợp

### Editor
- Lock icons trên tools premium
- Credit cost badges
- Credits indicator trong top bar

### Brand Kits
- Giới hạn số brand kits theo gói
- Batch Processing được gate cho Pro+

### Settings
- Hiển thị gói hiện tại
- Credits usage progress bar
- Quick plan switcher (demo)
- Buy credits button

### Layout
- PlanBadge trong sidebar
- Click để mở upgrade modal

## 🚀 Next Steps

1. **Backend Integration**: Kết nối với payment gateway (Stripe)
2. **Real Credits**: Lưu credits trên server
3. **Usage Analytics**: Track credit usage
4. **Notifications**: Low credits warnings
5. **Invoices**: Generate PDF invoices

---

## 🤖 AI Content Advisor

Tính năng AI Content Advisor giúp phân tích và tối ưu hóa ảnh:

### Features:
- **Performance Score**: Đánh giá tổng thể ảnh (0-100)
- **Score Breakdown**: Chi tiết từng tiêu chí (Composition, Color, Visual Interest, Platform Fit, Trend)
- **AI Suggestions**: Gợi ý cải thiện với impact dự kiến
- **Predicted Engagement**: Dự đoán tỷ lệ engagement
- **Best Post Time**: Thời gian đăng tốt nhất
- **Hashtag Suggestions**: Gợi ý hashtag phù hợp
- **Trending Analysis**: Xu hướng tuần này

### Sử dụng:
1. Mở Editor
2. Click tab "AI" trong right panel
3. AI sẽ tự động phân tích ảnh
4. Áp dụng các gợi ý để cải thiện

---

**Status: ✅ Hoàn thành UI & Logic**
**Demo: Sử dụng Quick Plan Switcher trong Settings**
