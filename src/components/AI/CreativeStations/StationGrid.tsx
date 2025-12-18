import React, { useState, useEffect } from 'react';
import { ArrowLeft, Sparkles } from 'lucide-react';
import { Station, Tool } from '../../../types/stations';
import { STATIONS } from '../../../data/stations';
import { useLanguage } from '../../../contexts/LanguageContext';
import { StationCard } from './StationCard';
import { ToolCard } from './ToolCard';
import { ToolDetailModal } from './ToolDetailModal';
import { VideoDetailModal } from './VideoDetailModal';
import { VideoRecreateView } from './VideoRecreateView';

interface VideoTemplate {
  id: number;
  videoUrl: string;
  author: string;
  likes: string;
  aspectRatio: string;
}

interface StationGridProps {
  onToolSelect: (station: Station, tool: Tool) => void;
}

// Mock video templates data
const videoTemplates = [
  { id: 1, videoUrl: 'https://dqv0cqkoy5oj7.cloudfront.net/user_32EcRyiEXuuaRsd6l97gBl9bCTU/02bac16f-96b5-436a-b0e4-f9bf03641f2d_min.mp4', author: 'Hana Lee', likes: '5.2k', aspectRatio: '9/16' },
  { id: 2, videoUrl: 'https://dqv0cqkoy5oj7.cloudfront.net/user_32EcRyiEXuuaRsd6l97gBl9bCTU/1c24d19c-73ff-47f1-8eee-369868dd72a6_min.mp4', author: 'Marcus Chen', likes: '4.8k', aspectRatio: '9/16' },
  { id: 3, videoUrl: 'https://dqv0cqkoy5oj7.cloudfront.net/user_2zSHVyYafpc6JMTBYcFQ0NXe7vl/3779081d-4c81-4245-bf2c-48279ef886a0_min.mp4', author: 'Yuki Tanaka', likes: '3.9k', aspectRatio: '9/16' },
  { id: 4, videoUrl: 'https://dqv0cqkoy5oj7.cloudfront.net/user_2zXu7DqFkwehcyw88RKxU8RZnH2/42df55c7-760f-46ac-b7ee-9a13513bfa76_min.mp4', author: 'Luna Park', likes: '4.1k', aspectRatio: '9/16' },
  { id: 5, videoUrl: 'https://cdn.higgsfield.ai/user_3262uqBpOaCby92z8zqMPv0oYEr/8ca56b11-d7fc-43b1-9098-7272f59956af_min.mp4', author: 'Sarah Chen', likes: '2.3k', aspectRatio: '9/16' },
  { id: 6, videoUrl: 'https://cdn.higgsfield.ai/user_2zXu7DqFkwehcyw88RKxU8RZnH2/18127fe7-bae9-4f7a-b52f-c00195b09088_min.mp4', author: 'Mike Johnson', likes: '1.8k', aspectRatio: '16/9' },
  { id: 7, videoUrl: 'https://cdn.higgsfield.ai/user_2zXu7DqFkwehcyw88RKxU8RZnH2/1a4f97fd-89d5-4a2f-b3f4-681b448f11e9_min.mp4', author: 'Emma Wilson', likes: '3.1k', aspectRatio: '1/1' },
  { id: 8, videoUrl: 'https://cdn.higgsfield.ai/user_2zXu7DqFkwehcyw88RKxU8RZnH2/464fbfe5-1e3a-46b4-85dd-44dfa47101ad_min.mp4', author: 'David Lee', likes: '956', aspectRatio: '9/16' },
  { id: 9, videoUrl: 'https://dqv0cqkoy5oj7.cloudfront.net/user_32EcRyiEXuuaRsd6l97gBl9bCTU/42d44a08-c232-42ca-bcdb-642cc9c19cac_min.mp4', author: 'Lisa Park', likes: '4.2k', aspectRatio: '16/9' },
  { id: 10, videoUrl: 'https://cdn.higgsfield.ai/user_2zXu7DqFkwehcyw88RKxU8RZnH2/aeeec00d-cdc2-458a-81ee-b51f9f5a635d_min.mp4', author: 'Alex Turner', likes: '1.5k', aspectRatio: '4/3' },
  { id: 11, videoUrl: 'https://cdn.higgsfield.ai/user_3262uqBpOaCby92z8zqMPv0oYEr/4ae36f79-1493-44be-b828-cde69b2918c9_min.mp4', author: 'Nina Patel', likes: '2.7k', aspectRatio: '9/16' },
  { id: 12, videoUrl: 'https://cdn.higgsfield.ai/user_3262uqBpOaCby92z8zqMPv0oYEr/4b6ca2c3-607b-4786-915c-feccc849dece_min.mp4', author: 'Chris Brown', likes: '892', aspectRatio: '16/9' },
  { id: 13, videoUrl: 'https://cdn.higgsfield.ai/user_3262uqBpOaCby92z8zqMPv0oYEr/2edf4156-04e9-434b-a3a2-ca338192d0a7_min.mp4', author: 'Amy Zhang', likes: '1.2k', aspectRatio: '1/1' },
  { id: 14, videoUrl: 'https://cdn.higgsfield.ai/user_3262uqBpOaCby92z8zqMPv0oYEr/131f3ef6-61e2-4f09-9d49-dd0faeda0483_min.mp4', author: 'Tom Harris', likes: '3.5k', aspectRatio: '9/16' },
  { id: 15, videoUrl: 'https://cdn.higgsfield.ai/user_2woJMxSXFH2QGGlMdyBq7q6ld4K/0f5b966a-7226-46d9-8ab8-ad4364add52e_min.mp4', author: 'Julia Kim', likes: '2.1k', aspectRatio: '16/9' },
  { id: 16, videoUrl: 'https://cdn.higgsfield.ai/user_2woJMxSXFH2QGGlMdyBq7q6ld4K/e82ca455-1484-4811-a526-f04d4848d8d0_min.mp4', author: 'Ryan Scott', likes: '1.9k', aspectRatio: '4/5' },
  { id: 17, videoUrl: 'https://cdn.higgsfield.ai/user_2woJMxSXFH2QGGlMdyBq7q6ld4K/28384c7b-9fff-4dc3-b19d-9677bb2e1ac0_min.mp4', author: 'Lily Wang', likes: '3.8k', aspectRatio: '9/16' },
  { id: 18, videoUrl: 'https://cdn.higgsfield.ai/user_2woJMxSXFH2QGGlMdyBq7q6ld4K/719b296e-4a3a-4ab9-aaa0-d7cb730bf4e0_min.mp4', author: 'James Liu', likes: '2.5k', aspectRatio: '16/9' },
  { id: 19, videoUrl: 'https://cdn.higgsfield.ai/user_2woJMxSXFH2QGGlMdyBq7q6ld4K/f3a27a40-14ed-4805-a1e1-990aea8da6ff_min.mp4', author: 'Mia Chen', likes: '1.7k', aspectRatio: '1/1' },
  { id: 20, videoUrl: 'https://cdn.higgsfield.ai/user_2woJMxSXFH2QGGlMdyBq7q6ld4K/01c77eeb-fe4a-4abf-9e0a-d1d1a7ac350f_min.mp4', author: 'Kevin Tran', likes: '4.1k', aspectRatio: '9/16' },
  { id: 21, videoUrl: 'https://cdn.higgsfield.ai/user_2woJMxSXFH2QGGlMdyBq7q6ld4K/492909ff-b3e5-4be8-9e1b-e746a949215a_min.mp4', author: 'Sophie Lee', likes: '2.9k', aspectRatio: '4/3' },
  { id: 22, videoUrl: 'https://cdn.higgsfield.ai/user_2woJMxSXFH2QGGlMdyBq7q6ld4K/f87bd88f-588f-4f6d-a37d-085132fc8fa4_min.mp4', author: 'Daniel Park', likes: '1.4k', aspectRatio: '16/9' },
  { id: 23, videoUrl: 'https://cdn.higgsfield.ai/user_309aC2afXq3AoRo5kggIaZqZuMv/fb9c339b-d876-4413-a8c1-a0dec7da4513_min.mp4', author: 'Anna Kim', likes: '3.2k', aspectRatio: '9/16' },
  { id: 24, videoUrl: 'https://cdn.higgsfield.ai/user_2woJMxSXFH2QGGlMdyBq7q6ld4K/c118dae0-628c-4a7f-81b7-94518336f2e9_min.mp4', author: 'Eric Nguyen', likes: '2.0k', aspectRatio: '4/5' },
  { id: 25, videoUrl: 'https://cdn.higgsfield.ai/user_2woJMxSXFH2QGGlMdyBq7q6ld4K/efe48261-e0bb-4d4e-aa87-0dee57929c4c_min.mp4', author: 'Grace Wu', likes: '1.6k', aspectRatio: '1/1' },
  { id: 26, videoUrl: 'https://cdn.higgsfield.ai/user_2v99SrPEzc8t4hnufGnTC18e3tA/467762f8-2bca-4e1f-86ba-b48f4091afdf_min.mp4', author: 'Brian Ho', likes: '3.9k', aspectRatio: '9/16' },
  { id: 27, videoUrl: 'https://cdn.higgsfield.ai/user_2v99SrPEzc8t4hnufGnTC18e3tA/e5a5ea33-5314-4399-a43c-5e9be5641ff0_min.mp4', author: 'Chloe Tan', likes: '2.4k', aspectRatio: '16/9' },
  { id: 28, videoUrl: 'https://cdn.higgsfield.ai/user_2v99SrPEzc8t4hnufGnTC18e3tA/def89168-9b6d-4233-94ee-928636834e90_min.mp4', author: 'Jason Lim', likes: '1.3k', aspectRatio: '4/3' },
  { id: 29, videoUrl: 'https://cdn.higgsfield.ai/user_2v99SrPEzc8t4hnufGnTC18e3tA/a94ad022-2b65-4542-97e6-586fba1f780f_min.mp4', author: 'Rachel Yoo', likes: '4.5k', aspectRatio: '9/16' },
  { id: 30, videoUrl: 'https://cdn.higgsfield.ai/user_309aC2afXq3AoRo5kggIaZqZuMv/88ba6a4f-a400-4d13-8750-e85a3892b8dc_min.mp4', author: 'Steven Cho', likes: '2.8k', aspectRatio: '16/9' },
  { id: 31, videoUrl: 'https://cdn.higgsfield.ai/user_309aC2afXq3AoRo5kggIaZqZuMv/30079efb-fd06-4873-86cb-515741c129d4_min.mp4', author: 'Michelle Pham', likes: '1.1k', aspectRatio: '4/5' },
  { id: 32, videoUrl: 'https://cdn.higgsfield.ai/user_309aC2afXq3AoRo5kggIaZqZuMv/941cd92e-dbfe-4cd4-8a60-46bce20dafa5_min.mp4', author: 'Tony Vo', likes: '3.6k', aspectRatio: '1/1' },
  { id: 33, videoUrl: 'https://dqv0cqkoy5oj7.cloudfront.net/user_2uewaW7csP6pZQjxspfKwYetHFd/9816108c-48f7-41e1-95b3-4299bc207bc8_min.mp4', author: 'Aria Moon', likes: '5.1k', aspectRatio: '9/16' },
  { id: 34, videoUrl: 'https://dqv0cqkoy5oj7.cloudfront.net/user_2uewaW7csP6pZQjxspfKwYetHFd/1f3b7c02-6131-43f6-9369-026e14a1406b_min.mp4', author: 'Leo Zhang', likes: '4.3k', aspectRatio: '9/16' },
  { id: 35, videoUrl: 'https://dqv0cqkoy5oj7.cloudfront.net/user_2ueruohX36A3Cp5WPFgZB4QsokZ/26f9912b-f2b6-4f4c-ae19-abed09940ea0_min.mp4', author: 'Ivy Chen', likes: '3.7k', aspectRatio: '9/16' },
  { id: 36, videoUrl: 'https://dqv0cqkoy5oj7.cloudfront.net/user_2ueruohX36A3Cp5WPFgZB4QsokZ/e4cd4382-4b7c-43da-ac21-9ea917331ece_min.mp4', author: 'Max Rivera', likes: '2.9k', aspectRatio: '9/16' },
  { id: 37, videoUrl: 'https://dqv0cqkoy5oj7.cloudfront.net/user_2ueruohX36A3Cp5WPFgZB4QsokZ/7127a7f1-2482-4233-8233-a7450aeac2e6_min.mp4', author: 'Zoe Kim', likes: '4.6k', aspectRatio: '9/16' },
  { id: 38, videoUrl: 'https://dqv0cqkoy5oj7.cloudfront.net/user_2uejlsAn0703H4tBe8Ju0h86Pan/732acd07-e604-490f-ba3a-79cd7c68d0ae_min.mp4', author: 'Noah Park', likes: '3.2k', aspectRatio: '9/16' },
  { id: 39, videoUrl: 'https://dqv0cqkoy5oj7.cloudfront.net/user_2vtxM3DRcDcQIjpmiCpUDF2wcAT/cc47f8dd-db4f-4a09-9117-7c0f0d37d50b.mp4', author: 'Ella Tran', likes: '5.4k', aspectRatio: '9/16' },
  { id: 40, videoUrl: 'https://dqv0cqkoy5oj7.cloudfront.net/user_2ueruohX36A3Cp5WPFgZB4QsokZ/d9536d5d-2ffe-4155-87f3-cb5d90c7d1af_min.mp4', author: 'Kai Nguyen', likes: '2.8k', aspectRatio: '9/16' },
  { id: 41, videoUrl: 'https://dqv0cqkoy5oj7.cloudfront.net/user_2ueruohX36A3Cp5WPFgZB4QsokZ/9c4b8d60-1f69-4f1e-b7bd-d404fc4f1a93_min.mp4', author: 'Ruby Lin', likes: '4.0k', aspectRatio: '9/16' },
  { id: 42, videoUrl: 'https://dqv0cqkoy5oj7.cloudfront.net/user_2ueruohX36A3Cp5WPFgZB4QsokZ/6103a9f7-e0f0-4e2c-b34b-b1ea3214a6d9_min.mp4', author: 'Felix Wu', likes: '3.5k', aspectRatio: '9/16' },
  { id: 43, videoUrl: 'https://dqv0cqkoy5oj7.cloudfront.net/user_2ueruohX36A3Cp5WPFgZB4QsokZ/dd927eba-ee20-4e22-992c-fcda9179277c_min.mp4', author: 'Luna Pham', likes: '4.8k', aspectRatio: '9/16' },
  { id: 44, videoUrl: 'https://dqv0cqkoy5oj7.cloudfront.net/user_2ueruohX36A3Cp5WPFgZB4QsokZ/6f8dc82c-9c08-412f-a9f4-d13bd193af9d_min.mp4', author: 'Oscar Lee', likes: '2.6k', aspectRatio: '9/16' },
  { id: 45, videoUrl: 'https://dqv0cqkoy5oj7.cloudfront.net/user_2ueruohX36A3Cp5WPFgZB4QsokZ/6f19c5cc-6fd4-4b17-907b-63fb7934a8cc_min.mp4', author: 'Mila Cho', likes: '3.9k', aspectRatio: '9/16' },
  { id: 46, videoUrl: 'https://dqv0cqkoy5oj7.cloudfront.net/user_2uewaW7csP6pZQjxspfKwYetHFd/30a6ecc7-49f7-4f0a-bfd3-dc7c5cb41ae1_min.mp4', author: 'Ethan Vo', likes: '5.0k', aspectRatio: '9/16' },
  { id: 47, videoUrl: 'https://dqv0cqkoy5oj7.cloudfront.net/user_2uewaW7csP6pZQjxspfKwYetHFd/7f08e3fa-abe6-4efd-8904-413d26edd126_min.mp4', author: 'Cora Kim', likes: '4.2k', aspectRatio: '9/16' },
  { id: 48, videoUrl: 'https://dqv0cqkoy5oj7.cloudfront.net/user_2uewaW7csP6pZQjxspfKwYetHFd/b03488be-e821-450f-8a47-5dc0d34e2c67_min.mp4', author: 'Jace Park', likes: '3.1k', aspectRatio: '9/16' },
  { id: 49, videoUrl: 'https://dqv0cqkoy5oj7.cloudfront.net/user_2uewaW7csP6pZQjxspfKwYetHFd/c7c6169b-bebf-471f-8552-f291535e18d6_min.mp4', author: 'Nora Chen', likes: '4.7k', aspectRatio: '9/16' },
  { id: 50, videoUrl: 'https://dqv0cqkoy5oj7.cloudfront.net/user_2uf3QUthgsjOpdKSLHSwSQLHM6Z/23bca21d-00dd-49a8-b573-1d32d2eac32f_min.mp4', author: 'Theo Lim', likes: '2.5k', aspectRatio: '9/16' },
  { id: 51, videoUrl: 'https://dqv0cqkoy5oj7.cloudfront.net/user_2vtxM3DRcDcQIjpmiCpUDF2wcAT/d53e3c02-b6ea-499e-b3cf-2f0fc470c49a_min.mp4', author: 'Iris Wang', likes: '5.3k', aspectRatio: '9/16' },
  { id: 52, videoUrl: 'https://dqv0cqkoy5oj7.cloudfront.net/user_2vtxM3DRcDcQIjpmiCpUDF2wcAT/01ba87c2-c518-4c09-b6c0-8f56c52baac6_min.mp4', author: 'Axel Tran', likes: '3.8k', aspectRatio: '9/16' },
  { id: 53, videoUrl: 'https://dqv0cqkoy5oj7.cloudfront.net/user_2uf3QUthgsjOpdKSLHSwSQLHM6Z/741e9e3d-eb07-4407-9555-00a542757aa6_min.mp4', author: 'Sage Ho', likes: '4.4k', aspectRatio: '9/16' },
  { id: 54, videoUrl: 'https://dqv0cqkoy5oj7.cloudfront.net/user_2vtxM3DRcDcQIjpmiCpUDF2wcAT/f717bb0a-b3f3-498f-94e5-c7606c16d729_min.mp4', author: 'Jade Yoo', likes: '3.6k', aspectRatio: '9/16' },
];

// Mock prompt for video templates
const getVideoPrompt = () =>
  `The scene starts with a close-up of a bearded man pouring vibrant blue liquid with ice cubes into a crystal glass, bathed in soft natural light under a slightly cloudy sky. Slowly, the camera begins a dolly right movement, sliding smoothly along a horizontal track to reveal more of the scene.`;

export const StationGrid: React.FC<StationGridProps> = ({ onToolSelect }) => {
  const { language } = useLanguage();
  const [selectedStation, setSelectedStation] = useState<Station | null>(null);
  const [selectedVideo, setSelectedVideo] = useState<VideoTemplate | null>(null);
  const [showRecreateView, setShowRecreateView] = useState(false);
  const [recreateVideo, setRecreateVideo] = useState<VideoTemplate | null>(null);
  const [selectedToolForDetail, setSelectedToolForDetail] = useState<Tool | null>(null);

  const handleVideoClick = (template: VideoTemplate) => {
    setSelectedVideo(template);
  };

  const handleCloseVideoDetail = () => {
    setSelectedVideo(null);
  };

  const handleRecreateVideo = (video: VideoTemplate) => {
    setRecreateVideo(video);
    setSelectedVideo(null);
    setShowRecreateView(true);
  };

  const handleCloseRecreateView = () => {
    setShowRecreateView(false);
    setRecreateVideo(null);
  };

  const handleToolCardClick = (tool: Tool) => {
    setSelectedToolForDetail(tool);
  };

  const handleCloseToolDetail = () => {
    setSelectedToolForDetail(null);
  };

  const handleStartUsingTool = () => {
    if (selectedStation && selectedToolForDetail) {
      setSelectedToolForDetail(null);
      onToolSelect(selectedStation, selectedToolForDetail);
    }
  };

  // Listen for selectKitchenStation event from HomeView
  useEffect(() => {
    const handleSelectKitchenStation = () => {
      // Find Video Studio (id: 'kitchen' or name contains 'Video')
      const kitchenStation = STATIONS.find(s => s.id === 'kitchen' || s.name.toLowerCase().includes('kitchen'));
      if (kitchenStation) {
        setSelectedStation(kitchenStation);
      }
    };

    window.addEventListener('selectKitchenStation', handleSelectKitchenStation);
    return () => {
      window.removeEventListener('selectKitchenStation', handleSelectKitchenStation);
    };
  }, []);

  const handleStationSelect = (station: Station) => {
    setSelectedStation(station);
  };

  const handleBackToStations = () => {
    setSelectedStation(null);
  };

  const handleToolClick = (tool: Tool) => {
    // Show tool detail modal first
    handleToolCardClick(tool);
  };

  // Expanded station view - show tools
  if (selectedStation) {
    return (
      <div className="animate-in fade-in slide-in-from-right-4 duration-300">
        {/* Simple Header - Back button + Station name */}
        <div className="mb-6">
          <button
            onClick={handleBackToStations}
            className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors mb-4 group"
          >
            <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm font-medium">
              {language === 'vi' ? 'Quay lại' : 'Back'}
            </span>
          </button>

          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-bold text-white">
              {language === 'vi' ? selectedStation.nameVi : selectedStation.name}
            </h2>
            <span className="text-zinc-500">•</span>
            <span className="text-sm text-zinc-400">
              {selectedStation.tools.length} {language === 'vi' ? 'công cụ' : 'tools'}
            </span>
            <span className="text-sm text-purple-400">
              {selectedStation.tools.filter(t => t.tier === 'free').length} {language === 'vi' ? 'miễn phí' : 'free'}
            </span>
          </div>
        </div>

        {/* Tools grid - larger cards with video previews */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {selectedStation.tools.map((tool) => (
            <ToolCard
              key={tool.id}
              tool={tool}
              stationColor={selectedStation.color}
              onSelect={() => handleToolClick(tool)}
            />
          ))}
        </div>

        {/* Tip section */}
        <div className="mt-8 p-5 rounded-2xl bg-gradient-to-r from-purple-900/30 to-pink-900/20 border border-purple-500/20">
          <div className="flex items-start gap-4">
            <div className="p-2 rounded-xl bg-purple-500/20">
              <Sparkles size={20} className="text-purple-400" />
            </div>
            <div>
              <h4 className="font-semibold text-white mb-1">
                {language === 'vi' ? 'Mẹo sử dụng' : 'Pro Tip'}
              </h4>
              <p className="text-sm text-zinc-400">
                {language === 'vi'
                  ? 'Hover vào mỗi công cụ để xem trước hiệu ứng Before/After. Tải ảnh chân dung chất lượng cao để có kết quả tốt nhất!'
                  : 'Hover over each tool to preview the Before/After effect. Upload high-quality portrait photos for best results!'
                }
              </p>
            </div>
          </div>
        </div>

        {/* Video Templates Section - Only for Video Studio */}
        {selectedStation.id === 'kitchen' && (
          <div className="mt-10">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-bold text-white">
                  {language === 'vi' ? 'Video Templates' : 'Video Templates'}
                </h3>
                <p className="text-sm text-zinc-500 mt-1">
                  {language === 'vi' ? 'Khám phá các video được tạo bởi cộng đồng' : 'Explore videos created by the community'}
                </p>
              </div>
            </div>
            
            {/* Grid for Video Templates */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 auto-rows-fr">
              {videoTemplates.map((template) => (
                <div
                  key={template.id}
                  onClick={() => handleVideoClick(template)}
                  className="group relative rounded-xl overflow-hidden cursor-pointer bg-zinc-900 aspect-[9/16]"
                >
                  <video
                    src={template.videoUrl}
                    className="w-full h-full object-cover"
                    autoPlay
                    loop
                    muted
                    playsInline
                  />
                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute bottom-0 left-0 right-0 p-3">
                      <p className="text-white text-sm font-medium truncate">{template.author}</p>
                      <div className="flex items-center gap-1 mt-1">
                        <svg className="w-4 h-4 text-pink-500 fill-current" viewBox="0 0 24 24">
                          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                        </svg>
                        <span className="text-zinc-300 text-xs">{template.likes}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Video Detail Modal */}
        {selectedVideo && (
          <VideoDetailModal
            video={selectedVideo}
            onClose={handleCloseVideoDetail}
            onRecreate={handleRecreateVideo}
          />
        )}

        {/* Video Recreate View */}
        {showRecreateView && recreateVideo && (
          <VideoRecreateView
            video={recreateVideo}
            templatePrompt={getVideoPrompt()}
            onClose={handleCloseRecreateView}
          />
        )}

        {/* Tool Detail Modal */}
        {selectedToolForDetail && selectedStation && (
          <ToolDetailModal
            tool={selectedToolForDetail}
            stationColor={selectedStation.color}
            onClose={handleCloseToolDetail}
            onStartUsing={handleStartUsingTool}
          />
        )}
      </div>
    );
  }

  // Main station grid view
  return (
    <div className="animate-in fade-in duration-300">
      {/* Hero Section */}
      <div className="relative mb-10 p-8 rounded-3xl bg-gradient-to-br from-purple-900/30 via-zinc-900 to-pink-900/20 border border-purple-500/20 overflow-hidden">
        {/* Background decoration */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-pink-500/10 rounded-full blur-3xl" />
        
        <div className="relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/20 border border-purple-500/30 mb-4">
            <Sparkles size={16} className="text-purple-400" />
            <span className="text-sm font-medium text-purple-300">
              {language === 'vi' ? '34 công cụ AI chuyên nghiệp' : '34 Professional AI Tools'}
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">
            {language === 'vi' ? 'AI Creative Studios' : 'AI Creative Studios'}
          </h2>
          <p className="text-zinc-400 max-w-xl mx-auto">
            {language === 'vi' 
              ? 'Khám phá 6 studio sáng tạo với các công cụ AI tiên tiến. Biến ý tưởng thành hiện thực chỉ với vài cú click.' 
              : 'Explore 6 creative studios with cutting-edge AI tools. Transform your ideas into reality with just a few clicks.'
            }
          </p>
        </div>
      </div>

      {/* Station Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-3 gap-4 2xl:gap-6">
        {STATIONS.map((station) => (
          <StationCard
            key={station.id}
            station={station}
            isExpanded={selectedStation?.id === station.id}
            onSelect={() => handleStationSelect(station)}
          />
        ))}
      </div>
    </div>
  );
};

export default StationGrid;
