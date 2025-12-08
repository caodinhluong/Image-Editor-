# 🚀 Quick Start Guide - New Features

## 🎯 How to Access New Features

### 1. Analytics Dashboard 📊

**Desktop:**
1. Look at the left sidebar
2. Click on **"Analytics"** (BarChart icon - 5th item)
3. Explore your stats, charts, and activity

**Mobile:**
1. Look at the bottom navigation bar
2. Tap **"Analytics"** icon
3. Scroll to view all metrics

**What you'll see:**
- 📈 Total Generations with trend
- ⚡ Credits Used
- ⏱️ Average Process Time
- ✅ Success Rate
- 📊 Interactive charts
- 📅 Recent activity timeline

**Try this:**
- Toggle between time periods (7d, 30d, 90d, All Time)
- Hover over charts to see details
- Check the tool usage breakdown

---

### 2. History Panel ⏱️

**How to open:**
1. Navigate to **Editor** (from sidebar or bottom nav)
2. Look at the top bar
3. Click the **History icon** (clock icon) next to Undo/Redo

**What you'll see:**
- 📸 Thumbnail previews of each edit state
- 🔄 Undo/Redo buttons
- 💾 Auto-save indicators
- ⏰ Timestamps
- 🎨 Tool icons

**Try this:**
- Click on any history state to restore it
- Use Undo/Redo buttons
- Toggle compare mode (eye icon)
- Export a specific version

**Pro tip:** The active state has a colorful gradient border on the left!

---

### 3. Onboarding Flow 🎓

**When it appears:**
- Automatically shown on **first login**
- Only shows once per user

**How to trigger again (for testing):**
1. Open browser console (F12)
2. Type: `localStorage.removeItem('repix_onboarding_completed')`
3. Press Enter
4. Refresh the page
5. Login again

**What you'll experience:**
1. **Welcome Screen** - Overview of Repix AI
2. **Persona Selection** - Choose your role:
   - 🎬 Content Creator
   - 📸 Photographer
   - 🛍️ E-commerce
   - 🏢 Agency/Team
   - ✨ Hobbyist
3. **Tools Overview** - Learn about AI features
4. **Ready to Start** - Begin creating!

**Navigation:**
- Click **"Next"** to proceed
- Click **"Back"** to go back
- Click **"Skip"** (top right) to skip anytime
- Progress bar shows your position

---

### 4. Feature Tooltips 💡

**What they are:**
- Small popup hints that introduce new features
- Appear automatically when you visit a feature
- Show only once (unless you reset)

**How to see them:**
1. Clear browser storage (for testing):
   ```javascript
   localStorage.clear()
   ```
2. Navigate to different features
3. Tooltips will appear automatically

**Dismissing:**
- Click the **X** button
- Click **"Got it"** button
- They won't show again

**Reset all tooltips (for testing):**
```javascript
// In browser console
Object.keys(localStorage).forEach(key => {
  if (key.startsWith('tooltip_dismissed_')) {
    localStorage.removeItem(key);
  }
});
```

---

## 🎨 Visual Guide

### Analytics Dashboard Layout
```
┌─────────────────────────────────────────┐
│  📊 Analytics & Insights                │
│  Period: [7d] [30d] [90d] [All]  Export │
├─────────────────────────────────────────┤
│  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐   │
│  │ 378  │ │ 1512 │ │ 3.2s │ │ 98.7%│   │
│  │ Gens │ │Credit│ │ Time │ │ Rate │   │
│  └──────┘ └──────┘ └──────┘ └──────┘   │
├─────────────────────────────────────────┤
│  📈 Generation Trend    │  🎯 Top Tools │
│  [Line Chart]           │  [Pie Chart]  │
├─────────────────────────────────────────┤
│  📅 Recent Activity                     │
│  • Applied color grading (2m ago)       │
│  • Upscaled to 4K (5m ago)             │
│  • Removed background (8m ago)          │
└─────────────────────────────────────────┘
```

### History Panel Layout
```
┌─────────────────────────┐
│ ⏱️ Edit History         │
│ 6 Versions              │
├─────────────────────────┤
│ [Undo] [Redo] [Compare] │
├─────────────────────────┤
│ ┌───┐ Applied color     │
│ │📸 │ grading           │
│ └───┘ Just now          │
│       ⚡ Unsaved        │
├─────────────────────────┤
│ ┌───┐ Upscaled to 4K    │
│ │📸 │ 2m ago            │
│ └───┘ ✅ Auto-saved     │
├─────────────────────────┤
│ ... more states ...     │
├─────────────────────────┤
│ [Clear History]         │
└─────────────────────────┘
```

---

## 🎮 Interactive Demo Flow

### Complete User Journey

**1. First Time User:**
```
Login → Onboarding (4 steps) → Select Persona → Home Dashboard
```

**2. Explore Analytics:**
```
Home → Sidebar → Analytics → View Stats → Toggle Periods → Check Charts
```

**3. Start Editing:**
```
Home → Editor → Make Changes → Open History → View Timeline → Restore State
```

**4. Discover Features:**
```
Navigate → See Tooltip → Read Info → Dismiss → Continue
```

---

## 🔧 Developer Testing Checklist

### Analytics Dashboard
- [ ] Navigate to Analytics page
- [ ] Check all 4 stat cards display correctly
- [ ] Toggle between time periods
- [ ] Hover over line chart
- [ ] Check pie chart legend
- [ ] Scroll through recent activity
- [ ] Test on mobile (responsive)
- [ ] Toggle dark/light mode
- [ ] Switch language (EN/VI)

### History Panel
- [ ] Open Editor
- [ ] Click History icon
- [ ] Panel slides in from right
- [ ] See all history states
- [ ] Click a state to restore
- [ ] Use Undo button
- [ ] Use Redo button
- [ ] Toggle compare mode
- [ ] Close panel (X button)
- [ ] Test on mobile (full screen)

### Onboarding
- [ ] Clear onboarding flag
- [ ] Login to trigger onboarding
- [ ] See welcome screen
- [ ] Click Next
- [ ] Select a persona
- [ ] Complete all 4 steps
- [ ] Click "Get Started"
- [ ] Verify it doesn't show again
- [ ] Test Skip button
- [ ] Test Back button

### Feature Tooltips
- [ ] Clear localStorage
- [ ] Navigate to feature
- [ ] Tooltip appears
- [ ] Dismiss tooltip
- [ ] Refresh page
- [ ] Verify tooltip doesn't reappear
- [ ] Test different positions
- [ ] Test on mobile

---

## 🌐 Language Support

### Switch Language
**Desktop:**
1. Look at top-right of sidebar
2. Click **VI | EN** toggle

**Mobile:**
1. Go to Profile
2. Find Language setting
3. Toggle between EN/VI

### Supported Translations
- ✅ Navigation
- ✅ Analytics (all text)
- ✅ History Panel (all text)
- ✅ Onboarding (all steps)
- ✅ Tooltips

---

## 🎨 Theme Support

### Toggle Dark/Light Mode
**Desktop:**
1. Look at top-right of sidebar
2. Click **Sun/Moon** icon

**Mobile:**
1. Go to Profile
2. Find Dark Theme toggle
3. Switch on/off

### All Features Support:
- ✅ Analytics Dashboard
- ✅ History Panel
- ✅ Onboarding Flow
- ✅ Feature Tooltips

---

## 📱 Mobile Experience

### Optimizations
- **Analytics:** Single column layout, simplified charts
- **History:** Full-screen overlay with backdrop
- **Onboarding:** Full-screen with touch-friendly buttons
- **Tooltips:** Adjusted positioning for small screens

### Navigation
- **Bottom Tab Bar:** Quick access to main sections
- **Swipe Gestures:** Close panels by swiping
- **Touch Targets:** Minimum 44px for easy tapping

---

## 🐛 Troubleshooting

### Onboarding not showing?
```javascript
// Reset onboarding
localStorage.removeItem('repix_onboarding_completed');
// Refresh page
```

### Tooltips not appearing?
```javascript
// Reset all tooltips
localStorage.clear();
// Refresh page
```

### History panel empty?
- Make some edits in the Editor first
- History is populated with mock data for demo

### Charts not loading?
- Check browser console for errors
- Ensure Recharts library is installed
- Try refreshing the page

---

## 💡 Pro Tips

1. **Analytics:** Export reports before switching time periods
2. **History:** Use keyboard shortcuts (Ctrl+Z/Ctrl+Shift+Z) for quick undo/redo
3. **Onboarding:** Select your actual persona for better recommendations
4. **Tooltips:** Don't dismiss too quickly - they contain useful info!

---

## 🎯 Next Steps

After exploring these features:
1. ✅ Complete onboarding
2. ✅ Check your analytics
3. ✅ Make some edits and use history
4. ✅ Explore all tooltips
5. 🚀 Start creating amazing work!

---

## 📞 Need Help?

- 📖 Read `FEATURES.md` for detailed documentation
- 📝 Check `NEW_FEATURES_SUMMARY.md` for technical overview
- 🐛 Report issues on GitHub
- 💬 Join our community Discord

---

**Happy Creating! 🎨✨**

Built with ❤️ by Repix AI Team
