# 🚀 Deploy Nhanh trong 5 Phút

## Cách 1: Deploy qua Vercel Dashboard (Không cần code)

### Bước 1: Tạo tài khoản Vercel
1. Truy cập: https://vercel.com
2. Click "Sign Up" 
3. Chọn "Continue with GitHub" (hoặc Email)

### Bước 2: Upload Project
1. Click "Add New..." → "Project"
2. Click "Import Git Repository" 
3. Nếu chưa có Git:
   - Click "Deploy from template" → "Browse all templates"
   - Hoặc kéo thả folder project vào

### Bước 3: Cấu hình (Tự động)
- Framework Preset: Vite ✅ (tự detect)
- Build Command: `npm run build` ✅
- Output Directory: `dist` ✅
- Click "Deploy"

### Bước 4: Đợi Deploy (1-2 phút)
Vercel sẽ:
- Install dependencies
- Build project
- Deploy lên CDN
- Tạo URL: `https://your-project.vercel.app`

---

## Cách 2: Deploy qua Netlify Drop (Siêu nhanh)

### Bước 1: Build project
Mở terminal và chạy:
```bash
npm run build
```

### Bước 2: Deploy
1. Truy cập: https://app.netlify.com/drop
2. Kéo thả folder `dist` vào
3. Đợi 30 giây → Xong!

URL: `https://random-name.netlify.app`

---

## Cách 3: Deploy qua GitHub Pages

### Bước 1: Push code lên GitHub
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/username/repo-name.git
git push -u origin main
```

### Bước 2: Enable GitHub Pages
1. Vào Settings → Pages
2. Source: GitHub Actions
3. Tạo file `.github/workflows/deploy.yml`:

```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
      - run: npm install
      - run: npm run build
      - uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
```

---

## ✅ Khuyến nghị: Vercel

**Tại sao?**
- ✅ Miễn phí hoàn toàn
- ✅ Không cần Git (có thể upload trực tiếp)
- ✅ SSL/HTTPS tự động
- ✅ CDN toàn cầu (nhanh ở VN)
- ✅ Custom domain miễn phí
- ✅ Auto deploy khi update code

---

## 🎯 Sau khi Deploy

Bạn sẽ có:
- **URL công khai**: `https://repix-ai.vercel.app`
- **SSL/HTTPS**: Tự động
- **CDN**: Tốc độ cao toàn cầu
- **Analytics**: Xem lượng truy cập

Chia sẻ URL này với mọi người để họ truy cập!

---

## 💡 Tips

1. **Custom Domain**: Mua domain và connect trong Vercel settings
2. **Environment Variables**: Thêm API keys trong Project Settings
3. **Auto Deploy**: Mỗi lần push code, Vercel tự động deploy
4. **Preview URLs**: Mỗi branch có URL riêng để test

---

## 🆘 Cần giúp?

Nếu gặp vấn đề:
1. Check build logs trong Vercel dashboard
2. Đảm bảo `npm run build` chạy thành công local
3. Check file `vercel.json` đã được tạo
