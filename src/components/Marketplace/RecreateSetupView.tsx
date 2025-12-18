import React, { useState, useEffect, useRef } from 'react';
import {
  X, Sparkles, ChevronRight, ArrowRight, Info,
  Wand2, Camera, Palette, Film, Users, ShoppingCart,
  Grid3X3, Pencil, Zap, Pen, Box, Gamepad2, Blocks, Clapperboard,
  Image as ImageIcon, Tv, Flower2, Droplets, MapPin,
  FileText, User, Scissors, Disc, Crown, ToyBrick, Cat,
  Layers, Search, Package, Building2, Smile, Upload, Download
} from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

interface RecreateSetupViewProps {
  onClose: () => void;
  originalImage: string;
  originalPrompt: string;
  generationInfo?: { model: string; style: string; ratio: string };
  onStartGenerate: (toolId: string) => void;
}

const toolShowcaseImages: Record<string, { before: string; after: string }> = {
  'hd-enhance': {
    before: 'https://imgcdn.stablediffusionweb.com/2025/12/16/8e01375d-fb78-4fa1-a86b-8b76e0611bd6.webp',
    after: 'https://imgcdn.stablediffusionweb.com/2025/12/16/756115e7-19fb-42ab-9cbd-6cc5e368573e.webp',
  },
  'makeup': {
    before: 'https://imgcdn.stablediffusionweb.com/2025/12/16/ad991c4a-fedd-48ae-9547-963efa8d7fe5.webp',
    after: 'https://imgcdn.stablediffusionweb.com/2025/12/16/13befca3-12d0-42af-a204-88a2c24c9dd7.webp',
  },
  'photorealistic': {
    before: 'https://imgcdn.stablediffusionweb.com/2025/12/16/4ff53f89-bf23-4177-b8e8-787ca4a34170.webp',
    after: 'https://imgcdn.stablediffusionweb.com/2025/12/16/fd775d81-cda8-485d-8b71-8fb703132217.webp',
  },
  'fashion-magazine': {
    before: 'https://imgcdn.stablediffusionweb.com/2025/12/16/dae082fa-208c-4eb1-b3c8-52c5b3bbfec2.webp',
    after: 'https://imgcdn.stablediffusionweb.com/2025/12/16/18b44f18-748a-4773-a2f7-e7a99ebb2cd4.webp',
  },
  'cosplay-character': {
    before: 'https://imgcdn.stablediffusionweb.com/2025/12/16/29dd0ed6-dccb-4613-a7ee-5d4a3a50030f.webp',
    after: 'https://imgcdn.stablediffusionweb.com/2025/12/16/b3c0baf6-0daa-4335-938d-8e94a8a02859.webp',
  },
  'minimalist-illustration': {
    before: 'https://imgcdn.stablediffusionweb.com/2025/12/16/8e943561-e24c-4d9f-8bd5-7944bd58c41e.webp',
    after: 'https://imgcdn.stablediffusionweb.com/2025/12/16/0f17100b-5653-48fa-8a05-c4bd48556e49.webp',
  },
  'pixel-art': {
    before: 'https://imgcdn.stablediffusionweb.com/2025/12/16/ce66cd00-04fa-4eae-8e00-26cb3c8f0741.webp',
    after: 'https://imgcdn.stablediffusionweb.com/2025/12/16/9b16279d-d27b-47ee-baa8-1a88a085a2dc.webp',
  },
  'comic-book': {
    before: 'https://imgcdn.stablediffusionweb.com/2025/12/16/20256686-8ca5-48c1-873c-f774003721b8.webp',
    after: 'https://imgcdn.stablediffusionweb.com/2025/12/16/e4f25ab5-b2b4-41bc-be8b-8aa267cba5a3.webp',
  },
  'line-art': {
    before: 'https://imgcdn.stablediffusionweb.com/2025/12/16/9ab2e413-f100-446a-b268-a35519a60b91.webp',
    after: 'https://imgcdn.stablediffusionweb.com/2025/12/16/09799f33-d9a7-4798-8e60-2cdc4a971e13.webp',
  },
  'ukiyo-e': {
    before: 'https://imgcdn.stablediffusionweb.com/2025/12/16/94012a24-b9ca-410c-bd50-ca54796a18ae.webp',
    after: 'https://imgcdn.stablediffusionweb.com/2025/12/16/0874cdfe-d552-46d2-8d6b-b170d11bdb02.webp',
  },
  '3d-figurine': {
    before: 'https://imgcdn.stablediffusionweb.com/2025/12/16/271027b1-8173-4da8-a671-e10bb6175386.webp',
    after: 'https://imgcdn.stablediffusionweb.com/2025/12/16/8a53bff0-df10-422c-b86f-25599201df5a.webp',
  },
  'funko-pop': {
    before: 'https://imgcdn.stablediffusionweb.com/2025/12/16/e1f8c4a5-7609-418b-b145-bd3348411286.webp',
    after: 'https://imgcdn.stablediffusionweb.com/2025/12/16/aba71caa-2b02-43e2-a033-e2f57b4fdfb9.webp',
  },
  'lego-minifig': {
    before: 'https://imgcdn.stablediffusionweb.com/2025/12/16/789c32e9-9154-447f-8b0b-1d38b4a22e39.webp',
    after: 'https://imgcdn.stablediffusionweb.com/2025/12/16/1a498a11-9bb5-4391-9628-6e474590fb6b.webp',
  },
  'plushie-toy': {
    before: 'https://imgcdn.stablediffusionweb.com/2025/12/16/15ea5f5d-da5a-4e74-971c-02665d637034.webp',
    after: 'https://imgcdn.stablediffusionweb.com/2025/12/16/c4b2c862-8959-4c61-8599-7ec614cf77b3.webp',
  },
  'claymation': {
    before: 'https://imgcdn.stablediffusionweb.com/2025/12/16/a9056a89-571a-4253-bdeb-a29cf39f9b59.webp',
    after: 'https://imgcdn.stablediffusionweb.com/2025/12/16/d7d16ea7-6baf-48d0-8045-bde6a9ac74a2.webp',
  },
  'product-render': {
    before: 'https://imgcdn.stablediffusionweb.com/2025/12/16/b23138fe-96da-410f-b6c1-7f5acc0e02e1.webp',
    after: 'https://imgcdn.stablediffusionweb.com/2025/12/16/b3a94a99-63a9-418f-ad5a-2a99ef17d021.webp',
  },
  'architecture-model': {
    before: 'https://imgcdn.stablediffusionweb.com/2025/12/16/83038b92-dd2a-4c67-a12c-38b669c077e1.webp',
    after: 'https://imgcdn.stablediffusionweb.com/2025/12/16/7ad31f0a-0e72-4255-acbd-308a3b56af5e.webp',
  },
  'party-polaroid': {
    before: 'https://imgcdn.stablediffusionweb.com/2025/12/16/868d8d8a-a99c-49de-b0a8-7696b775818f.webp',
    after: 'https://imgcdn.stablediffusionweb.com/2025/12/16/89b4cda5-67e6-4b73-bedd-eef85682a5ba.webp',
  },
  'vintage-photo': {
    before: 'https://imgcdn.stablediffusionweb.com/2025/12/16/1ac2852f-6685-4d56-be47-32c5a3c7bc64.webp',
    after: 'https://imgcdn.stablediffusionweb.com/2025/12/16/6ae68cf4-9c54-4e19-b667-f1d6465f4285.webp',
  },
  'glitch-art': {
    before: 'https://imgcdn.stablediffusionweb.com/2025/12/16/0ba9c161-de17-4d8e-a510-9d20d94892b1.webp',
    after: 'https://imgcdn.stablediffusionweb.com/2025/12/16/59dc00c8-3c7f-4b6f-975c-c4d01ed46e2a.webp',
  },
  'double-exposure': {
    before: 'https://imgcdn.stablediffusionweb.com/2025/12/16/b7447e5a-d757-4a7d-a374-5f89937d3790.webp',
    after: 'https://imgcdn.stablediffusionweb.com/2025/12/16/410afb51-1c71-4ba8-99a1-6b4625783a92.webp',
  },
  'hyper-realistic': {
    before: 'https://imgcdn.stablediffusionweb.com/2025/12/16/b021a2b1-712e-4da5-8280-ae6eb6d6b38f.webp',
    after: 'https://imgcdn.stablediffusionweb.com/2025/12/16/a772e960-8e79-480c-8e5b-ee98420f4a5a.webp',
  },
  'van-gogh': {
    before: 'https://imgcdn.stablediffusionweb.com/2025/12/16/ac35431a-5b85-451f-8b9a-096dd73441e8.webp',
    after: 'https://imgcdn.stablediffusionweb.com/2025/12/16/3e5d3afe-03c1-436f-ae86-d0d3aa237b26.webp',
  },
  'watercolor': {
    before: 'https://imgcdn.stablediffusionweb.com/2025/12/16/321674b6-e8e3-4648-ae22-92549d2c993b.webp',
    after: 'https://imgcdn.stablediffusionweb.com/2025/12/16/ceaa2856-628f-45f1-a36d-dec7257a3913.webp',
  },
  'custom-recipe': {
    before: 'https://imgcdn.stablediffusionweb.com/2025/12/16/2573f7f8-9e66-491d-a6a1-a3b9a562c6df.webp',
    after: 'https://imgcdn.stablediffusionweb.com/2025/12/16/1c7ca8ad-48fc-4ba2-9810-8c8874ba309c.webp',
  },
  'pose-copy': {
    before: 'https://imgcdn.stablediffusionweb.com/2025/12/16/66eb2ff7-5a7b-4d10-8a27-fdeb0ee5e265.webp',
    after: 'https://imgcdn.stablediffusionweb.com/2025/12/16/3aaebabb-2044-4267-9290-201912b8a60d.webp',
  },
  'expression-copy': {
    before: 'https://imgcdn.stablediffusionweb.com/2025/12/18/d2a76b63-b6af-4041-b669-4dad4a8d472c.webp',
    after: 'https://imgcdn.stablediffusionweb.com/2025/12/18/8718731d-73c2-4ce1-a21e-847ade6d452f.webp',
  },
  'color-swap': {
    before: 'https://imgcdn.stablediffusionweb.com/2025/12/18/0fc1024b-103b-46a1-b5b4-c3aef958ba4e.webp',
    after: 'https://imgcdn.stablediffusionweb.com/2025/12/18/4ad5e65a-1183-4971-86ab-7380d64032a1.webp',
  },
  'isolate-subject': {
    before: 'https://imgcdn.stablediffusionweb.com/2025/12/16/b9590a7d-130f-4d6e-88b7-ef1793aa2c04.webp',
    after: 'https://imgcdn.stablediffusionweb.com/2025/12/16/23c2ed77-f95e-40fe-919c-dfb37bd48907.webp',
  },
  'y2k-background': {
    before: 'https://imgcdn.stablediffusionweb.com/2025/12/16/a7ef91cf-2d13-4425-a48c-3c213a07ab84.webp',
    after: 'https://imgcdn.stablediffusionweb.com/2025/12/16/f273586c-cf36-4ed2-b76b-61ee7bf22321.webp',
  },
};

const defaultShowcase = {
  before: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=300&fit=crop',
  after: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=300&fit=crop',
};

interface Tool {
  id: string;
  name: string;
  nameVi: string;
  description: string;
  descriptionVi: string;
  icon: React.ElementType;
  tier: 'free' | 'plus' | 'pro';
  isNew?: boolean;
  input: string;
  inputVi: string;
  output: string;
  outputVi: string;
}

interface Station {
  id: string;
  name: string;
  nameVi: string;
  description: string;
  descriptionVi: string;
  icon: React.ElementType;
  gradient: string;
  isNew?: boolean;
  tools: Tool[];
}

const stations: Station[] = [
  {
    id: 'smoothie',
    name: 'Enhancement Studio',
    nameVi: 'Studio Nâng cấp',
    description: 'Image Quality & Beauty',
    descriptionVi: 'Chất lượng ảnh & Làm đẹp',
    icon: Sparkles,
    gradient: 'from-pink-500 to-purple-500',
    isNew: true,
    tools: [
      { id: 'hd-enhance', name: 'AI Upscaler', nameVi: 'Nâng cấp AI', description: 'AI-powered image upscaling that increases resolution by 2x-4x while preserving details, removing noise, and enhancing sharpness. Perfect for printing or high-quality displays.', descriptionVi: 'Nâng cấp ảnh bằng AI tăng độ phân giải 2x-4x trong khi giữ nguyên chi tiết, loại bỏ nhiễu và tăng độ nét. Hoàn hảo cho in ấn hoặc hiển thị chất lượng cao.', icon: Wand2, tier: 'free', input: 'Any image (JPG, PNG, WebP) - max 10MB', inputVi: 'Ảnh bất kỳ (JPG, PNG, WebP) - tối đa 10MB', output: 'High-resolution image 2x-4x larger', outputVi: 'Ảnh độ phân giải cao gấp 2x-4x' },
      { id: 'makeup', name: 'AI Makeup', nameVi: 'Trang điểm AI', description: 'Apply realistic virtual makeup including lipstick, eyeshadow, blush, and contouring. Choose from natural, glamour, party, or bridal styles with adjustable intensity.', descriptionVi: 'Áp dụng trang điểm ảo chân thực bao gồm son môi, phấn mắt, má hồng và tạo khối. Chọn từ phong cách tự nhiên, quyến rũ, tiệc tùng hoặc cô dâu với cường độ điều chỉnh được.', icon: Palette, tier: 'free', input: 'Portrait photo with clear, front-facing face', inputVi: 'Ảnh chân dung có khuôn mặt rõ, nhìn thẳng', output: 'Portrait with professional makeup applied', outputVi: 'Ảnh chân dung đã trang điểm chuyên nghiệp' },
      { id: 'photorealistic', name: 'Photo Realism', nameVi: 'Ảnh siêu thực', description: 'Transform sketches, drawings, or stylized images into photorealistic photographs. AI reconstructs textures, lighting, and details for lifelike results.', descriptionVi: 'Biến phác thảo, bản vẽ hoặc ảnh cách điệu thành ảnh siêu thực. AI tái tạo kết cấu, ánh sáng và chi tiết cho kết quả sống động như thật.', icon: Camera, tier: 'plus', input: 'Sketch, drawing, or stylized artwork', inputVi: 'Phác thảo, bản vẽ hoặc tác phẩm cách điệu', output: 'Photorealistic image with natural details', outputVi: 'Ảnh siêu thực với chi tiết tự nhiên' },
      { id: 'fashion-magazine', name: 'Magazine Cover', nameVi: 'Bìa tạp chí', description: 'Apply professional magazine cover styling with high-fashion filters, dramatic lighting, and editorial color grading. Includes Vogue, Elle, GQ styles.', descriptionVi: 'Áp dụng phong cách bìa tạp chí chuyên nghiệp với bộ lọc thời trang cao cấp, ánh sáng ấn tượng và chỉnh màu biên tập. Bao gồm phong cách Vogue, Elle, GQ.', icon: FileText, tier: 'plus', input: 'Portrait or full-body fashion photo', inputVi: 'Ảnh chân dung hoặc toàn thân thời trang', output: 'Magazine cover quality edited photo', outputVi: 'Ảnh chỉnh sửa chất lượng bìa tạp chí' },
    ]
  },
  {
    id: 'cosplay',
    name: 'Illustration Studio',
    nameVi: 'Studio Minh họa',
    description: 'Anime & Digital Art',
    descriptionVi: 'Anime & Nghệ thuật số',
    icon: Users,
    gradient: 'from-purple-500 to-pink-500',
    tools: [
      { id: 'cosplay-character', name: 'Anime Transform', nameVi: 'Chuyển đổi Anime', description: 'Transform your photo into anime or cosplay character style. AI analyzes facial features and recreates them in various anime art styles including Ghibli, Makoto Shinkai, and classic manga.', descriptionVi: 'Biến ảnh của bạn thành phong cách nhân vật anime hoặc cosplay. AI phân tích đặc điểm khuôn mặt và tái tạo theo nhiều phong cách anime như Ghibli, Makoto Shinkai và manga cổ điển.', icon: Users, tier: 'free', isNew: true, input: 'Clear portrait photo (front-facing preferred)', inputVi: 'Ảnh chân dung rõ nét (ưu tiên nhìn thẳng)', output: 'Anime/cosplay styled character image', outputVi: 'Ảnh nhân vật phong cách anime/cosplay' },
      { id: 'minimalist-illustration', name: 'Minimal Vector', nameVi: 'Vector tối giản', description: 'Create clean, elegant minimalist line illustrations. Perfect for profile pictures, logos, or artistic prints with simple yet expressive strokes.', descriptionVi: 'Tạo minh họa nét tối giản, thanh lịch. Hoàn hảo cho ảnh đại diện, logo hoặc bản in nghệ thuật với nét vẽ đơn giản nhưng biểu cảm.', icon: Pencil, tier: 'free', input: 'Any photo with clear subject', inputVi: 'Ảnh bất kỳ có đối tượng rõ ràng', output: 'Clean minimalist line illustration', outputVi: 'Minh họa nét tối giản sạch sẽ' },
      { id: 'pixel-art', name: 'Pixel Art', nameVi: 'Nghệ thuật Pixel', description: 'Convert images to retro 8-bit or 16-bit pixel art style. Choose resolution from 16x16 to 256x256 pixels. Great for game assets or nostalgic artwork.', descriptionVi: 'Chuyển đổi ảnh sang phong cách pixel 8-bit hoặc 16-bit cổ điển. Chọn độ phân giải từ 16x16 đến 256x256 pixel. Tuyệt vời cho tài nguyên game hoặc tác phẩm hoài cổ.', icon: Grid3X3, tier: 'free', input: 'Any image (simpler subjects work best)', inputVi: 'Ảnh bất kỳ (đối tượng đơn giản cho kết quả tốt nhất)', output: 'Retro pixel art in chosen resolution', outputVi: 'Pixel art cổ điển với độ phân giải đã chọn' },
      { id: 'comic-book', name: 'Comic Style', nameVi: 'Phong cách Comic', description: 'Apply Western comic book style with bold outlines, halftone dots, and dramatic shading. Includes Marvel, DC, and indie comic aesthetics.', descriptionVi: 'Áp dụng phong cách truyện tranh phương Tây với đường viền đậm, chấm halftone và đổ bóng ấn tượng. Bao gồm thẩm mỹ Marvel, DC và comic indie.', icon: Zap, tier: 'free', input: 'Portrait or action photo', inputVi: 'Ảnh chân dung hoặc hành động', output: 'Comic book styled image with effects', outputVi: 'Ảnh phong cách truyện tranh với hiệu ứng' },
      { id: 'line-art', name: 'Line Drawing', nameVi: 'Nét vẽ tay', description: 'Extract clean black and white line drawings from photos. Perfect for coloring books, tattoo designs, or artistic sketches.', descriptionVi: 'Trích xuất bản vẽ nét đen trắng sạch từ ảnh. Hoàn hảo cho sách tô màu, thiết kế hình xăm hoặc phác thảo nghệ thuật.', icon: Pen, tier: 'free', input: 'Any photo with clear edges', inputVi: 'Ảnh bất kỳ có cạnh rõ ràng', output: 'Clean black & white line drawing', outputVi: 'Bản vẽ nét đen trắng sạch sẽ' },
      { id: 'ukiyo-e', name: 'Japanese Woodblock', nameVi: 'Tranh khắc gỗ Nhật', description: 'Transform images into traditional Japanese woodblock print style (Ukiyo-e). Features flat colors, bold outlines, and classic Edo period aesthetics.', descriptionVi: 'Biến ảnh thành phong cách tranh khắc gỗ Nhật Bản truyền thống (Ukiyo-e). Có màu phẳng, đường viền đậm và thẩm mỹ thời Edo cổ điển.', icon: MapPin, tier: 'plus', input: 'Portrait or landscape photo', inputVi: 'Ảnh chân dung hoặc phong cảnh', output: 'Japanese woodblock print style art', outputVi: 'Nghệ thuật phong cách tranh khắc gỗ Nhật' },
    ]
  },
  {
    id: 'toy',
    name: '3D Studio',
    nameVi: 'Studio 3D',
    description: '3D Rendering & Models',
    descriptionVi: 'Render 3D & Mô hình',
    icon: Gamepad2,
    gradient: 'from-emerald-500 to-cyan-500',
    tools: [
      { id: 'funko-pop', name: 'Vinyl Figure', nameVi: 'Mô hình Vinyl', description: 'Transform your portrait into an adorable Funko Pop vinyl figure style. Features the signature oversized head, small body, and glossy finish that collectors love. Perfect for custom merchandise or unique profile pictures.', descriptionVi: 'Biến ảnh chân dung thành phong cách mô hình Funko Pop dễ thương. Có đầu to đặc trưng, thân nhỏ và bề mặt bóng mà người sưu tập yêu thích. Hoàn hảo cho hàng hóa tùy chỉnh hoặc ảnh đại diện độc đáo.', icon: ToyBrick, tier: 'free', isNew: true, input: 'Clear portrait photo (front-facing)', inputVi: 'Ảnh chân dung rõ nét (nhìn thẳng)', output: 'Funko Pop style vinyl figure image', outputVi: 'Ảnh mô hình vinyl phong cách Funko Pop' },
      { id: 'lego-minifig', name: 'Block Figure', nameVi: 'Mô hình khối', description: 'Convert portraits into classic Lego minifigure style with blocky features, yellow skin tone, and characteristic Lego aesthetics. Great for personalized Lego-themed content.', descriptionVi: 'Chuyển đổi chân dung thành phong cách minifigure Lego cổ điển với đặc điểm khối, tông da vàng và thẩm mỹ Lego đặc trưng. Tuyệt vời cho nội dung chủ đề Lego cá nhân hóa.', icon: Blocks, tier: 'free', input: 'Portrait photo with clear face', inputVi: 'Ảnh chân dung có khuôn mặt rõ', output: 'Lego minifigure styled image', outputVi: 'Ảnh phong cách Lego minifigure' },
      { id: '3d-figurine', name: '3D Character', nameVi: 'Nhân vật 3D', description: 'Create professional 3D figurine renders from photos. AI generates realistic 3D models with proper lighting, materials, and studio-quality presentation. Ideal for collectible previews.', descriptionVi: 'Tạo render mô hình 3D chuyên nghiệp từ ảnh. AI tạo mô hình 3D chân thực với ánh sáng, vật liệu và trình bày chất lượng studio. Lý tưởng cho xem trước đồ sưu tập.', icon: Box, tier: 'plus', input: 'Portrait or full body photo', inputVi: 'Ảnh chân dung hoặc toàn thân', output: 'Professional 3D figurine render', outputVi: 'Render mô hình 3D chuyên nghiệp' },
      { id: 'plushie-toy', name: 'Plush Toy', nameVi: 'Thú bông 3D', description: 'Transform subjects into adorable plush toy style with soft, fluffy textures and cute proportions. Perfect for pets, portraits, or creating kawaii merchandise designs.', descriptionVi: 'Biến đối tượng thành phong cách thú nhồi bông dễ thương với kết cấu mềm mại, bông xù và tỷ lệ đáng yêu. Hoàn hảo cho thú cưng, chân dung hoặc thiết kế hàng hóa kawaii.', icon: Cat, tier: 'plus', input: 'Portrait, pet, or character photo', inputVi: 'Ảnh chân dung, thú cưng hoặc nhân vật', output: 'Cute plush toy styled image', outputVi: 'Ảnh phong cách thú nhồi bông dễ thương' },
      { id: 'claymation', name: 'Clay Model', nameVi: 'Mô hình đất sét', description: 'Apply stop-motion clay animation style like Wallace & Gromit or Coraline. Features smooth clay textures, fingerprint details, and characteristic claymation lighting.', descriptionVi: 'Áp dụng phong cách hoạt hình đất sét stop-motion như Wallace & Gromit hoặc Coraline. Có kết cấu đất sét mịn, chi tiết vân tay và ánh sáng claymation đặc trưng.', icon: Clapperboard, tier: 'plus', input: 'Any photo (portraits work best)', inputVi: 'Ảnh bất kỳ (chân dung cho kết quả tốt nhất)', output: 'Claymation styled image', outputVi: 'Ảnh phong cách hoạt hình đất sét' },
      { id: 'product-render', name: 'Product 3D', nameVi: 'Sản phẩm 3D', description: 'Generate professional 3D product visualizations with studio lighting, reflections, and customizable backgrounds. Perfect for e-commerce, marketing, or product presentations.', descriptionVi: 'Tạo hình ảnh 3D sản phẩm chuyên nghiệp với ánh sáng studio, phản chiếu và nền tùy chỉnh. Hoàn hảo cho thương mại điện tử, marketing hoặc trình bày sản phẩm.', icon: Package, tier: 'pro', input: 'Product photo on plain background', inputVi: 'Ảnh sản phẩm trên nền đơn giản', output: 'Professional 3D product render', outputVi: 'Render 3D sản phẩm chuyên nghiệp' },
      { id: 'architecture-model', name: 'Architectural 3D', nameVi: 'Kiến trúc 3D', description: 'Transform buildings into miniature architectural model style with tilt-shift effect, model-like materials, and diorama aesthetics. Great for real estate or architectural presentations.', descriptionVi: 'Biến tòa nhà thành phong cách mô hình kiến trúc thu nhỏ với hiệu ứng tilt-shift, vật liệu giống mô hình và thẩm mỹ diorama. Tuyệt vời cho bất động sản hoặc trình bày kiến trúc.', icon: Building2, tier: 'pro', input: 'Building, interior, or cityscape photo', inputVi: 'Ảnh tòa nhà, nội thất hoặc cảnh thành phố', output: 'Miniature architectural model style', outputVi: 'Phong cách mô hình kiến trúc thu nhỏ' },
    ]
  },
  {
    id: 'film-art',
    name: 'Artistic Studio',
    nameVi: 'Studio Nghệ thuật',
    description: 'Film & Fine Art Effects',
    descriptionVi: 'Hiệu ứng phim & Mỹ thuật',
    icon: Film,
    gradient: 'from-orange-500 to-pink-500',
    isNew: true,
    tools: [
      { id: 'party-polaroid', name: 'Instant Film', nameVi: 'Phim lấy liền', description: 'Apply authentic instant camera effects with white borders, slight color shifts, and that nostalgic Polaroid look. Includes party-themed light leaks and festive overlays.', descriptionVi: 'Áp dụng hiệu ứng máy ảnh lấy liền chân thực với viền trắng, dịch màu nhẹ và vẻ hoài cổ Polaroid. Bao gồm rò sáng chủ đề tiệc và lớp phủ lễ hội.', icon: ImageIcon, tier: 'free', input: 'Any photo (group photos work great)', inputVi: 'Ảnh bất kỳ (ảnh nhóm rất phù hợp)', output: 'Polaroid style with party effects', outputVi: 'Phong cách Polaroid với hiệu ứng tiệc' },
      { id: 'vintage-photo', name: 'Vintage Film', nameVi: 'Phim cổ điển', description: 'Transform photos with authentic vintage film effects from different eras (1920s-1990s). Includes film grain, color fading, vignettes, and period-accurate color grading.', descriptionVi: 'Biến đổi ảnh với hiệu ứng phim cổ điển chân thực từ các thời kỳ khác nhau (1920s-1990s). Bao gồm hạt phim, phai màu, vignette và chỉnh màu đúng thời kỳ.', icon: Film, tier: 'free', input: 'Any photo', inputVi: 'Ảnh bất kỳ', output: 'Vintage film styled photo', outputVi: 'Ảnh phong cách phim cổ điển' },
      { id: 'glitch-art', name: 'Digital Glitch', nameVi: 'Hiệu ứng Glitch', description: 'Create cyberpunk-inspired digital distortion art with RGB channel splitting, scan lines, pixel sorting, and data corruption effects. Adjustable intensity from subtle to extreme.', descriptionVi: 'Tạo nghệ thuật méo kỹ thuật số lấy cảm hứng cyberpunk với tách kênh RGB, đường quét, sắp xếp pixel và hiệu ứng hỏng dữ liệu. Cường độ điều chỉnh từ nhẹ đến cực đoan.', icon: Tv, tier: 'free', isNew: true, input: 'Any image (high contrast works best)', inputVi: 'Ảnh bất kỳ (độ tương phản cao cho kết quả tốt nhất)', output: 'Digital glitch art with distortion', outputVi: 'Nghệ thuật glitch kỹ thuật số với méo' },
      { id: 'double-exposure', name: 'Double Exposure', nameVi: 'Phơi sáng kép', description: 'Blend two images artistically like classic film double exposures. Combine portraits with landscapes, textures, or abstract patterns for stunning artistic compositions.', descriptionVi: 'Kết hợp hai ảnh một cách nghệ thuật như phơi sáng kép phim cổ điển. Kết hợp chân dung với phong cảnh, kết cấu hoặc hoa văn trừu tượng cho bố cục nghệ thuật ấn tượng.', icon: Layers, tier: 'plus', input: 'Portrait + secondary image (landscape/texture)', inputVi: 'Chân dung + ảnh phụ (phong cảnh/kết cấu)', output: 'Artistic double exposure blend', outputVi: 'Kết hợp phơi sáng kép nghệ thuật' },
      { id: 'hyper-realistic', name: 'Ultra Realism', nameVi: 'Siêu chi tiết', description: 'Enhance photos to hyper-realistic quality with AI-powered detail enhancement, perfect skin textures, enhanced lighting, and magazine-quality finishing.', descriptionVi: 'Nâng cao ảnh lên chất lượng siêu thực với tăng cường chi tiết bằng AI, kết cấu da hoàn hảo, ánh sáng nâng cao và hoàn thiện chất lượng tạp chí.', icon: Search, tier: 'pro', input: 'Any photo (portraits recommended)', inputVi: 'Ảnh bất kỳ (khuyến nghị chân dung)', output: 'Hyper-realistic enhanced image', outputVi: 'Ảnh nâng cao siêu thực' },
      { id: 'van-gogh', name: 'Impressionist', nameVi: 'Ấn tượng', description: 'Transform images into Van Gogh\'s iconic Starry Night style with swirling brushstrokes, bold colors, and post-impressionist textures. AI captures the master\'s unique artistic vision.', descriptionVi: 'Biến ảnh thành phong cách Starry Night mang tính biểu tượng của Van Gogh với nét cọ xoáy, màu sắc đậm và kết cấu hậu ấn tượng. AI nắm bắt tầm nhìn nghệ thuật độc đáo của bậc thầy.', icon: Flower2, tier: 'plus', input: 'Any photo (landscapes work beautifully)', inputVi: 'Ảnh bất kỳ (phong cảnh rất đẹp)', output: 'Van Gogh impressionist painting', outputVi: 'Tranh ấn tượng phong cách Van Gogh' },
      { id: 'watercolor', name: 'Watercolor', nameVi: 'Màu nước', description: 'Convert photos to delicate watercolor paintings with soft color bleeds, paper texture, and artistic brush effects. Perfect for portraits, landscapes, or floral subjects.', descriptionVi: 'Chuyển đổi ảnh thành tranh màu nước tinh tế với màu loang nhẹ, kết cấu giấy và hiệu ứng cọ nghệ thuật. Hoàn hảo cho chân dung, phong cảnh hoặc chủ đề hoa.', icon: Droplets, tier: 'free', input: 'Any photo (soft lighting preferred)', inputVi: 'Ảnh bất kỳ (ưu tiên ánh sáng nhẹ)', output: 'Delicate watercolor painting', outputVi: 'Tranh màu nước tinh tế' },
    ]
  },
  {
    id: 'self-service',
    name: 'Pro Tools',
    nameVi: 'Công cụ Pro',
    description: 'Advanced Editing',
    descriptionVi: 'Chỉnh sửa nâng cao',
    icon: ShoppingCart,
    gradient: 'from-blue-500 to-purple-500',
    tools: [
      { id: 'isolate-subject', name: 'Background Remove', nameVi: 'Xóa nền', description: 'Automatically remove backgrounds with AI precision. Detects subjects including people, products, animals, and objects. Outputs transparent PNG for easy compositing.', descriptionVi: 'Tự động xóa nền với độ chính xác AI. Phát hiện đối tượng bao gồm người, sản phẩm, động vật và vật thể. Xuất PNG trong suốt để dễ dàng ghép ảnh.', icon: Scissors, tier: 'free', input: 'Photo with clear subject', inputVi: 'Ảnh có đối tượng rõ ràng', output: 'Subject with transparent background (PNG)', outputVi: 'Đối tượng với nền trong suốt (PNG)' },
      { id: 'color-swap', name: 'Color Replace', nameVi: 'Thay đổi màu', description: 'Intelligently swap colors in specific regions of your image. Change hair color, clothing, backgrounds, or any colored element while maintaining natural lighting and shadows.', descriptionVi: 'Đổi màu thông minh trong các vùng cụ thể của ảnh. Thay đổi màu tóc, quần áo, nền hoặc bất kỳ yếu tố màu nào trong khi duy trì ánh sáng và bóng tự nhiên.', icon: Palette, tier: 'free', input: 'Any image with colored elements', inputVi: 'Ảnh bất kỳ có yếu tố màu', output: 'Image with swapped colors', outputVi: 'Ảnh với màu đã đổi' },
      { id: 'y2k-background', name: 'Retro Background', nameVi: 'Nền Retro', description: 'Generate nostalgic Y2K aesthetic backgrounds (2000s style) with chrome effects, holographic textures, bubblegum colors, and cyber elements. Perfect for social media content.', descriptionVi: 'Tạo nền thẩm mỹ Y2K hoài cổ (phong cách 2000s) với hiệu ứng chrome, kết cấu holographic, màu kẹo cao su và yếu tố cyber. Hoàn hảo cho nội dung mạng xã hội.', icon: Disc, tier: 'free', isNew: true, input: 'Portrait photo (will extract subject)', inputVi: 'Ảnh chân dung (sẽ tách đối tượng)', output: 'Subject on Y2K aesthetic background', outputVi: 'Đối tượng trên nền thẩm mỹ Y2K' },
      { id: 'custom-recipe', name: 'Custom Prompt', nameVi: 'Prompt tùy chỉnh', description: 'Create custom AI transformations using text prompts. Describe exactly what you want and AI will apply your creative vision to the image. Unlimited creative possibilities.', descriptionVi: 'Tạo biến đổi AI tùy chỉnh bằng prompt văn bản. Mô tả chính xác những gì bạn muốn và AI sẽ áp dụng tầm nhìn sáng tạo của bạn vào ảnh. Khả năng sáng tạo không giới hạn.', icon: FileText, tier: 'plus', input: 'Image + detailed text prompt', inputVi: 'Ảnh + prompt văn bản chi tiết', output: 'Custom AI-generated transformation', outputVi: 'Biến đổi AI tùy chỉnh' },
      { id: 'pose-copy', name: 'Pose Transfer', nameVi: 'Chuyển tư thế', description: 'Transfer body pose from a reference image to your target photo. AI analyzes skeletal structure and repositions the subject naturally while preserving identity and clothing.', descriptionVi: 'Chuyển tư thế cơ thể từ ảnh tham chiếu sang ảnh đích. AI phân tích cấu trúc xương và định vị lại đối tượng tự nhiên trong khi giữ nguyên danh tính và quần áo.', icon: User, tier: 'pro', input: 'Target photo + reference pose image', inputVi: 'Ảnh đích + ảnh tư thế tham chiếu', output: 'Subject in new pose', outputVi: 'Đối tượng trong tư thế mới' },
      { id: 'expression-copy', name: 'Face Expression', nameVi: 'Biểu cảm khuôn mặt', description: 'Transfer facial expressions from reference to target. Change smiles, emotions, or subtle expressions while maintaining the person\'s identity and natural appearance.', descriptionVi: 'Chuyển biểu cảm khuôn mặt từ tham chiếu sang đích. Thay đổi nụ cười, cảm xúc hoặc biểu cảm tinh tế trong khi duy trì danh tính và vẻ ngoài tự nhiên của người đó.', icon: Smile, tier: 'pro', input: 'Target portrait + reference expression', inputVi: 'Chân dung đích + biểu cảm tham chiếu', output: 'Portrait with transferred expression', outputVi: 'Chân dung với biểu cảm đã chuyển' },
    ]
  },
];

export const RecreateSetupView: React.FC<RecreateSetupViewProps> = ({
  onClose, originalImage, originalPrompt, generationInfo, onStartGenerate,
}) => {
  const { language } = useLanguage();
  const [activeStation, setActiveStation] = useState<string>(stations[0].id);
  const [selectedTool, setSelectedTool] = useState<string | null>(null);
  const [hoveredTool, setHoveredTool] = useState<string | null>(null);
  const [tooltipPos, setTooltipPos] = useState<{ x: number; y: number } | null>(null);
  const [tooltipData, setTooltipData] = useState<Tool | null>(null);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [toolsKey, setToolsKey] = useState(0);
  const prevStationRef = useRef(activeStation);

  // Initial load animation
  useEffect(() => {
    const timer = setTimeout(() => setIsInitialLoad(false), 100);
    return () => clearTimeout(timer);
  }, []);

  // Trigger tools re-animation when station changes
  useEffect(() => {
    if (prevStationRef.current !== activeStation) {
      setToolsKey(prev => prev + 1);
      prevStationRef.current = activeStation;
    }
  }, [activeStation]);

  const handleMouseMove = (e: React.MouseEvent, tool: Tool) => {
    setTooltipPos({ x: e.clientX + 15, y: e.clientY + 15 });
    setTooltipData(tool);
  };

  const handleMouseLeave = () => {
    setTooltipPos(null);
    setTooltipData(null);
    setHoveredTool(null);
  };

  const trans = {
    vi: {
      title: 'Tái tạo nội dung của bạn bằng các mẫu',
      subtitle: 'Hãy chọn công cụ AI phù hợp để bắt đầu',
      original: 'NGUYÊN BẢN',
      startUsing: 'BẮT ĐẦU SỬ DỤNG',
      hoverTip: 'Di chuột qua từng công cụ để xem trước hiệu ứng Trước/Sau. Tải lên ảnh chân dung chất lượng cao để có kết quả tốt nhất!',
      before: 'Trước',
      after: 'Sau',
      free: 'MIỄN PHÍ',
      plus: 'PLUS',
      pro: 'PRO',
      input: 'Đầu vào',
      output: 'Đầu ra',
      selectTool: 'Chọn một công cụ để bắt đầu',
      back: 'Trở về',
      prompt: 'PROMPT',
    },
    en: {
      title: 'Recreate your content with templates',
      subtitle: 'Choose the right AI tool to get started',
      original: 'ORIGINAL',
      startUsing: 'START USING',
      hoverTip: 'Hover over each tool to preview the Before/After effect. Upload high-quality portrait photos for best results!',
      before: 'Before',
      after: 'After',
      free: 'FREE',
      plus: 'PLUS',
      pro: 'PRO',
      input: 'Input',
      output: 'Output',
      selectTool: 'Select a tool to get started',
      back: 'Back',
      prompt: 'PROMPT',
    }
  };
  const t = trans[language] || trans.en;

  const activeStationData = stations.find(s => s.id === activeStation);
  const selectedToolData = selectedTool ? activeStationData?.tools.find(tool => tool.id === selectedTool) : null;

  const getTierBadge = (tier: 'free' | 'plus' | 'pro') => {
    switch (tier) {
      case 'free': return <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 text-[9px] font-bold rounded">{t.free}</span>;
      case 'plus': return <span className="px-2 py-0.5 bg-purple-500/20 text-purple-400 text-[9px] font-bold rounded flex items-center gap-0.5"><Crown size={8} />{t.plus}</span>;
      case 'pro': return <span className="px-2 py-0.5 bg-amber-500/20 text-amber-400 text-[9px] font-bold rounded flex items-center gap-0.5"><Sparkles size={8} />{t.pro}</span>;
    }
  };

  return (
    <div className="fixed inset-0 z-[99999] flex bg-zinc-950">
      {/* Floating Tooltip following cursor */}
      {tooltipPos && tooltipData && (
        <div 
          className="fixed z-[100000] pointer-events-none"
          style={{ left: tooltipPos.x, top: tooltipPos.y }}
        >
          <div className="p-3 bg-zinc-800/95 backdrop-blur-sm border border-zinc-700 rounded-xl shadow-2xl max-w-[280px]">
            <p className="text-[11px] text-white font-medium mb-2">{language === 'vi' ? tooltipData.descriptionVi : tooltipData.description}</p>
            <div className="space-y-1.5">
              <div className="flex items-start gap-2">
                <div className="flex items-center gap-1 text-[10px] text-emerald-400 font-medium shrink-0">
                  <Upload size={10} />
                  {t.input}:
                </div>
                <span className="text-[10px] text-zinc-300">{language === 'vi' ? tooltipData.inputVi : tooltipData.input}</span>
              </div>
              <div className="flex items-start gap-2">
                <div className="flex items-center gap-1 text-[10px] text-purple-400 font-medium shrink-0">
                  <Download size={10} />
                  {t.output}:
                </div>
                <span className="text-[10px] text-zinc-300">{language === 'vi' ? tooltipData.outputVi : tooltipData.output}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* LEFT - Original Image & Prompt */}
      <div className="flex-1 flex flex-col bg-zinc-900 border-r border-zinc-800 min-w-0">
        {/* Back Button */}
        <div className="p-3 border-b border-zinc-800">
          <button 
            onClick={onClose}
            className="flex items-center gap-2 px-3 py-2 text-sm text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition-all"
          >
            <ChevronRight size={16} className="rotate-180" />
            {t.back}
          </button>
        </div>
        
        {/* Original Image */}
        <div className="p-4 bg-zinc-950/50">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-medium">{t.original}</span>
          </div>
          <div className="relative w-full">
            <img src={originalImage} alt="Original" className="w-full h-auto max-h-[280px] object-contain rounded-xl shadow-2xl border border-zinc-800" />
          </div>
        </div>

        {/* Prompt Section */}
        <div className="flex-1 p-4 border-t border-zinc-800 overflow-y-auto">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles size={14} className="text-purple-400" />
            <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-medium">{t.prompt}</span>
          </div>
          <div className="p-3 bg-zinc-800/50 rounded-xl border border-zinc-700/50">
            <p className="text-sm text-zinc-300 leading-relaxed">{originalPrompt || 'No prompt available'}</p>
          </div>
          
          {/* Generation Info */}
          {generationInfo && (
            <div className="mt-4 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-zinc-500">Model:</span>
                <span className="text-zinc-300">{generationInfo.model}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-zinc-500">Style:</span>
                <span className="text-zinc-300">{generationInfo.style}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-zinc-500">Ratio:</span>
                <span className="text-zinc-300">{generationInfo.ratio}</span>
              </div>
            </div>
          )}
        </div>

        {/* Tip Box */}
        <div className="p-3 border-t border-zinc-800">
          <div className="flex gap-2 p-2.5 bg-orange-500/10 border border-orange-500/20 rounded-lg">
            <Info size={14} className="text-orange-400 flex-shrink-0 mt-0.5" />
            <p className="text-[10px] text-orange-200/80 leading-relaxed">{t.hoverTip}</p>
          </div>
        </div>
      </div>

      {/* CENTER - Station Selection */}
      <div className="flex-1 flex flex-col bg-zinc-900/30 overflow-hidden border-r border-zinc-800 min-w-0">
        <div 
          className="p-5 border-b border-zinc-800/50"
          style={{
            opacity: isInitialLoad ? 0 : 1,
            transform: isInitialLoad ? 'translateY(-10px)' : 'translateY(0)',
            transition: 'opacity 0.5s ease-out, transform 0.5s ease-out'
          }}
        >
          <h1 className="text-lg font-bold text-white mb-1">{t.title}</h1>
          <p className="text-sm text-zinc-500">{t.subtitle}</p>
        </div>
        <div className="flex-1 overflow-y-auto p-3 space-y-1.5">
          {stations.map((station, index) => {
            const Icon = station.icon;
            const isActive = activeStation === station.id;
            return (
              <div 
                key={station.id} 
                onClick={() => { setActiveStation(station.id); setSelectedTool(null); }}
                className={`relative p-3 rounded-xl border cursor-pointer group
                  ${isActive 
                    ? 'bg-gradient-to-r from-purple-500/15 via-pink-500/10 to-orange-500/15 border-purple-500/40 shadow-lg shadow-purple-500/10' 
                    : 'bg-zinc-800/20 border-zinc-800/50 hover:border-zinc-700 hover:bg-zinc-800/40'
                  }`}
                style={{
                  opacity: isInitialLoad ? 0 : 1,
                  transform: isInitialLoad ? 'translateX(-20px)' : 'translateX(0)',
                  transition: `opacity 0.4s ease-out ${index * 0.08}s, transform 0.4s ease-out ${index * 0.08}s, background-color 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease`
                }}
              >
                <div className="flex items-center gap-3">
                  <div 
                    className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 transition-all duration-300 ${isActive ? `bg-gradient-to-br ${station.gradient} scale-110` : 'bg-zinc-800 group-hover:scale-105'}`}
                  >
                    <Icon size={16} className={`text-white transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className={`font-semibold text-sm transition-colors duration-200 ${isActive ? 'text-white' : 'text-zinc-300 group-hover:text-white'}`}>
                        {language === 'vi' ? station.nameVi : station.name}
                      </h3>
                      {station.isNew && (
                        <span className="px-1.5 py-0.5 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-400 text-white text-[8px] font-bold rounded animate-pulse">
                          MỚI
                        </span>
                      )}
                    </div>
                    <p className={`text-[10px] transition-colors duration-200 ${isActive ? 'text-zinc-400' : 'text-zinc-500'}`}>
                      {language === 'vi' ? station.descriptionVi : station.description}
                    </p>
                  </div>
                  <ChevronRight 
                    size={14} 
                    className={`flex-shrink-0 transition-all duration-300 ${isActive ? 'text-purple-400 opacity-100 translate-x-0' : 'text-zinc-600 opacity-0 -translate-x-2 group-hover:opacity-50 group-hover:translate-x-0'}`} 
                  />
                </div>
                {/* Active indicator line */}
                <div 
                  className={`absolute left-0 top-1/2 -translate-y-1/2 w-1 rounded-r-full bg-gradient-to-b from-purple-500 to-pink-500 transition-all duration-300 ${isActive ? 'h-8 opacity-100' : 'h-0 opacity-0'}`}
                />
              </div>
            );
          })}
        </div>
      </div>

      {/* RIGHT - Tools Grid + Action Button */}
      <div className="flex-1 bg-zinc-900 flex flex-col min-w-0">
        {/* Action Button Header */}
        <div 
          className="p-4 border-b border-zinc-800"
          style={{
            opacity: isInitialLoad ? 0 : 1,
            transform: isInitialLoad ? 'translateY(-10px)' : 'translateY(0)',
            transition: 'opacity 0.5s ease-out 0.3s, transform 0.5s ease-out 0.3s'
          }}
        >
          <button
            onClick={() => selectedTool && onStartGenerate(selectedTool)}
            disabled={!selectedTool}
            className={`w-full py-3 px-4 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all duration-300 ${
              selectedTool
                ? 'bg-gradient-to-r from-purple-600 via-pink-500 to-orange-500 hover:from-purple-500 hover:via-pink-400 hover:to-orange-400 text-white shadow-lg shadow-purple-500/25 hover:shadow-xl hover:shadow-purple-500/30 hover:scale-[1.02] active:scale-[0.98]'
                : 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
            }`}
          >
            <ArrowRight size={16} className={`transition-transform duration-300 ${selectedTool ? 'group-hover:translate-x-1' : ''}`} />
            {selectedTool ? t.startUsing : t.selectTool}
          </button>
        </div>

        {/* Tools Grid */}
        <div className="flex-1 overflow-y-auto p-3">
          <div key={toolsKey} className="grid grid-cols-2 gap-3">
            {activeStationData?.tools.map((tool, index) => {
              const ToolIcon = tool.icon;
              const isHovered = hoveredTool === tool.id;
              const isSelected = selectedTool === tool.id;
              const showcase = toolShowcaseImages[tool.id] || defaultShowcase;
              return (
                <div 
                  key={tool.id} 
                  onClick={() => setSelectedTool(tool.id)}
                  onMouseEnter={() => setHoveredTool(tool.id)} 
                  onMouseMove={(e) => handleMouseMove(e, tool)}
                  onMouseLeave={handleMouseLeave}
                  className={`group relative overflow-hidden rounded-xl border cursor-pointer
                    ${isSelected 
                      ? 'border-purple-500 bg-purple-500/10 ring-2 ring-purple-500/30 shadow-lg shadow-purple-500/20' 
                      : 'border-zinc-800 hover:border-purple-500/40 bg-zinc-800/30 hover:bg-zinc-800/50'
                    }`}
                  style={{
                    opacity: isInitialLoad ? 0 : 1,
                    transform: isInitialLoad ? 'translateY(20px) scale(0.95)' : 'translateY(0) scale(1)',
                    transition: `opacity 0.4s ease-out ${0.1 + index * 0.06}s, transform 0.4s ease-out ${0.1 + index * 0.06}s, border-color 0.2s ease, background-color 0.2s ease, box-shadow 0.3s ease`,
                    animation: toolsKey > 0 ? `toolFadeIn 0.4s ease-out ${index * 0.05}s both` : undefined
                  }}
                >
                  <div className="relative h-36 overflow-hidden">
                    {/* Before Image */}
                    <img 
                      src={showcase.before} 
                      alt="Before" 
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                    />
                    {/* After Image with wipe effect */}
                    <div 
                      className="absolute inset-0 transition-all duration-700 ease-out" 
                      style={{ clipPath: isHovered ? 'inset(0 0 0 0)' : 'inset(0 100% 0 0)' }}
                    >
                      <img 
                        src={showcase.after} 
                        alt="After" 
                        className="absolute inset-0 w-full h-full object-cover" 
                      />
                    </div>
                    
                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-zinc-900/30 to-transparent" />
                    
                    {/* Shine effect on hover */}
                    <div 
                      className={`absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-700 ${isHovered ? 'translate-x-full' : '-translate-x-full'}`}
                      style={{ transform: isHovered ? 'translateX(100%)' : 'translateX(-100%)' }}
                    />
                    
                    {/* Before/After Label */}
                    <div 
                      className={`absolute top-2 left-2 px-2 py-1 rounded-md text-[10px] font-semibold transition-all duration-300 ${
                        isHovered 
                          ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white scale-105' 
                          : 'bg-zinc-900/80 text-zinc-300'
                      }`}
                    >
                      {isHovered ? t.after : t.before}
                    </div>
                    
                    {/* Selected indicator */}
                    <div 
                      className={`absolute top-2 right-2 w-5 h-5 bg-purple-500 rounded-full flex items-center justify-center transition-all duration-300 ${
                        isSelected ? 'scale-100 opacity-100' : 'scale-0 opacity-0'
                      }`}
                    >
                      <Sparkles size={10} className="text-white animate-pulse" />
                    </div>
                    
                    {/* Tool Icon */}
                    <div 
                      className={`absolute bottom-2 left-2 w-8 h-8 rounded-xl bg-gradient-to-br ${activeStationData?.gradient} flex items-center justify-center shadow-lg transition-all duration-300 ${
                        isHovered ? 'scale-110 shadow-xl' : 'scale-100'
                      }`}
                    >
                      <ToolIcon size={14} className={`text-white transition-transform duration-300 ${isHovered ? 'scale-110' : ''}`} />
                    </div>
                    
                    {/* New badge animation */}
                    {tool.isNew && (
                      <div className="absolute top-2 right-2">
                        <span className="px-1.5 py-0.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-[8px] font-bold rounded animate-pulse shadow-lg shadow-amber-500/30">
                          NEW
                        </span>
                      </div>
                    )}
                  </div>
                  
                  {/* Tool Info */}
                  <div className="p-2.5">
                    <div className="flex items-center justify-between gap-1">
                      <h5 className={`font-semibold text-xs truncate transition-colors duration-200 ${isSelected ? 'text-purple-300' : 'text-white'}`}>
                        {language === 'vi' ? tool.nameVi : tool.name}
                      </h5>
                      {getTierBadge(tool.tier)}
                    </div>
                  </div>
                  
                  {/* Selection ring animation */}
                  <div 
                    className={`absolute inset-0 rounded-xl border-2 border-purple-500 pointer-events-none transition-opacity duration-300 ${
                      isSelected ? 'opacity-100' : 'opacity-0'
                    }`}
                    style={{
                      boxShadow: isSelected ? '0 0 20px rgba(168, 85, 247, 0.3), inset 0 0 20px rgba(168, 85, 247, 0.1)' : 'none'
                    }}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecreateSetupView;
