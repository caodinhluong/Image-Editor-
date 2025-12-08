# 🚀 Hướng dẫn Deploy Repix AI Editor

## Cách 1: Deploy qua Vercel (Khuyên dùng - Miễn phí)

### Bước 1: Chuẩn bị
```bash
# Build project
npm run build
```

### Bước 2: Deploy lên Vercel

#### Option A: Qua Vercel CLI
```bash
# Login vào Vercel
vercel login

# Deploy
vercel --prod
```

#### Option B: Qua Vercel Dashboard (Dễ nhất)
1. Truy cập: https://vercel.com
2. Đăng ký/Đăng nhập (dùng GitHub, GitLab, hoặc Email)
3. Click "Add New Project"
4. Import Git Repository hoặc Upload folder `dist`
5. Vercel sẽ tự động detect Vite và deploy

### Bước 3: Cấu hình (nếu cần)
Vercel sẽ tự động detect, nhưng nếu cần custom:

**vercel.json** (đã tạo sẵn trong project):
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite"
}
```

---

## Cách 2: Deploy qua Netlify (Miễn phí)

### Bước 1: Build
```bash
npm run build
```

### Bước 2: Deploy
1. Truy cập: https://app.netlify.com
2. Đăng ký/Đăng nhập
3. Kéo thả folder `dist` vào Netlify Drop
4. Hoặc connect với Git repository

### Cấu hình Netlify
**netlify.toml**:
```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

---

## Cách 3: Deploy qua GitHub Pages (Miễn phí)

### Bước 1: Cài đặt gh-pages
```bash
npm install --save-dev gh-pages
```

### Bước 2: Thêm vào package.json
```json
{
  "scripts": {
    "predeploy": "npm run build",
    "deploy": "gh-pages -d dist"
  },
  "homepage": "https://[username].github.io/[repo-name]"
}
```

### Bước 3: Deploy
```bash
npm run deploy
```

---

## Cách 4: Deploy qua Firebase Hosting (Miễn phí)

### Bước 1: Cài đặt Firebase CLI
```bash
npm install -g firebase-tools
```

### Bước 2: Login và Init
```bash
firebase login
firebase init hosting
```

### Bước 3: Cấu hình
- Public directory: `dist`
- Single-page app: `Yes`
- GitHub auto-deploy: `No` (hoặc Yes nếu muốn)

### Bước 4: Deploy
```bash
npm run build
firebase deploy
```

---

## ⚡ Khuyến nghị

**Vercel** là lựa chọn tốt nhất vì:
- ✅ Miễn phí
- ✅ Tự động detect Vite
- ✅ SSL/HTTPS miễn phí
- ✅ CDN toàn cầu
- ✅ Deploy tự động khi push code
- ✅ Custom domain miễn phí
- ✅ Analytics built-in

---

## 🔗 Sau khi Deploy

Bạn sẽ nhận được URL dạng:
- Vercel: `https://repix-ai.vercel.app`
- Netlify: `https://repix-ai.netlify.app`
- GitHub Pages: `https://username.github.io/repo-name`
- Firebase: `https://project-id.web.app`

---

## 🎯 Custom Domain (Optional)

Sau khi deploy, bạn có thể:
1. Mua domain (VD: repix.ai)
2. Vào settings của Vercel/Netlify
3. Add custom domain
4. Update DNS records theo hướng dẫn

---

## 📝 Lưu ý

- File `.env` không được commit lên Git (đã có trong .gitignore)
- Nếu có API keys, thêm vào Environment Variables trong dashboard
- Build size hiện tại: ~1.5MB (có thể optimize thêm)

---

## 🐛 Troubleshooting

### Lỗi: "Page not found" khi refresh
Thêm redirect rules (đã có trong vercel.json)

### Lỗi: Build failed
```bash
# Clear cache và rebuild
rm -rf node_modules dist
npm install
npm run build
```

### Lỗi: CSS không load
Check `base` trong vite.config.ts phải match với deployment path
