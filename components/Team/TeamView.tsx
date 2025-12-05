import React from 'react';
import { 
  Users, FolderGit2, BarChart3, Settings, ShieldCheck, Plus 
} from 'lucide-react';
import { Button, Card, Badge } from '../ui/UIComponents';
import { Project, AnalyticData } from '../../types';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';
import { useLanguage } from '../../contexts/LanguageContext';

const mockProjects: Project[] = [
  { id: 'p1', name: 'Summer Campaign 2024', lastEdited: '2 mins ago', status: 'In Review', collaborators: ['A', 'B'], thumbnail: 'https://picsum.photos/seed/camp1/100/100' },
  { id: 'p2', name: 'Product Launch Q3', lastEdited: '1 hour ago', status: 'Approved', collaborators: ['C'], thumbnail: 'https://picsum.photos/seed/prod/100/100' },
  { id: 'p3', name: 'Social Media Assets', lastEdited: '4 hours ago', status: 'Draft', collaborators: ['A', 'C', 'D'], thumbnail: 'https://picsum.photos/seed/social/100/100' },
];

const analyticData: AnalyticData[] = [
  { name: 'Mon', views: 400, sales: 240, amt: 2400 },
  { name: 'Tue', views: 300, sales: 139, amt: 2210 },
  { name: 'Wed', views: 200, sales: 980, amt: 2290 },
  { name: 'Thu', views: 278, sales: 390, amt: 2000 },
  { name: 'Fri', views: 189, sales: 480, amt: 2181 },
  { name: 'Sat', views: 239, sales: 380, amt: 2500 },
  { name: 'Sun', views: 349, sales: 430, amt: 2100 },
];

export const TeamView: React.FC = () => {
  const { trans } = useLanguage();
  return (
    <div className="flex-1 h-full bg-light-bg dark:bg-dark-bg p-8 overflow-y-auto">
      
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Top Header */}
        <div className="flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-bold text-zinc-900 dark:text-white mb-2">{trans.team.workspace}</h1>
            <div className="flex gap-4 text-zinc-500 dark:text-zinc-400 text-sm">
               <span className="flex items-center gap-1"><Users size={14} /> 12 {trans.team.members}</span>
               <span className="flex items-center gap-1"><ShieldCheck size={14} /> {trans.team.enterprise}</span>
            </div>
          </div>
          <Button><Plus size={16} className="mr-2" /> {trans.team.newProject}</Button>
        </div>

        {/* Analytics Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
           <Card className="p-6 col-span-2">
              <div className="flex justify-between items-center mb-6">
                 <h3 className="font-semibold text-zinc-900 dark:text-white flex items-center gap-2">
                   <BarChart3 size={18} className="text-repix-500"/> {trans.team.usage}
                 </h3>
                 <select className="bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 text-xs rounded px-2 py-1 text-zinc-900 dark:text-white outline-none">
                    <option>Last 7 Days</option>
                    <option>Last 30 Days</option>
                 </select>
              </div>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={analyticData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                    <XAxis dataKey="name" stroke="#71717a" tick={{fill: '#71717a', fontSize: 12}} />
                    <YAxis stroke="#71717a" tick={{fill: '#71717a', fontSize: 12}} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', color: '#fff' }}
                      itemStyle={{ color: '#fff' }}
                    />
                    <Bar dataKey="views" fill="#a855f7" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="sales" fill="#ec4899" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
           </Card>

           <div className="space-y-6">
             <Card className="p-6">
                <h3 className="text-sm font-medium text-zinc-500 dark:text-zinc-400 mb-1">{trans.team.balance}</h3>
                <div className="text-4xl font-bold text-zinc-900 dark:text-white mb-4">45,200</div>
                <div className="h-2 w-full bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden mb-2">
                   <div className="h-full w-[70%] bg-gradient-to-r from-pink-500 to-repix-600"></div>
                </div>
                <p className="text-xs text-zinc-500">70% {trans.team.allocation}</p>
                <Button variant="outline" size="sm" className="w-full mt-4">{trans.team.topUp}</Button>
             </Card>

             <Card className="p-6">
               <h3 className="text-sm font-medium text-zinc-500 dark:text-zinc-400 mb-4">{trans.team.approvals}</h3>
               <div className="space-y-4">
                 {[1,2].map(i => (
                   <div key={i} className="flex items-start gap-3">
                      <img src={`https://picsum.photos/seed/user${i}/40/40`} className="w-8 h-8 rounded-full border border-zinc-200 dark:border-zinc-700" />
                      <div>
                         <p className="text-sm text-zinc-800 dark:text-zinc-200">Waitlist Banner v2</p>
                         <p className="text-xs text-zinc-500">Requested by Sarah</p>
                      </div>
                      <Button size="sm" variant="ghost" className="ml-auto text-xs">{trans.team.review}</Button>
                   </div>
                 ))}
               </div>
             </Card>
           </div>
        </div>

        {/* Projects List */}
        <div>
           <div className="flex items-center gap-4 mb-4 border-b border-zinc-200 dark:border-zinc-800 pb-4">
              <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">{trans.team.activeProjects}</h2>
              <div className="bg-zinc-100 dark:bg-zinc-800/50 px-3 py-1 rounded-full text-xs text-zinc-500 dark:text-zinc-400">{trans.team.sort}</div>
           </div>
           
           <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden">
             {mockProjects.map((project, idx) => (
               <div key={project.id} className={`flex items-center justify-between p-4 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors ${idx !== mockProjects.length -1 ? 'border-b border-zinc-200 dark:border-zinc-800' : ''}`}>
                 <div className="flex items-center gap-4">
                    <img src={project.thumbnail} className="w-12 h-12 rounded bg-zinc-200 dark:bg-zinc-800 object-cover" />
                    <div>
                       <h4 className="font-medium text-zinc-900 dark:text-white">{project.name}</h4>
                       <div className="flex items-center gap-2 text-xs text-zinc-500 mt-1">
                          <FolderGit2 size={12} /> Version 2.1 • {project.lastEdited}
                       </div>
                    </div>
                 </div>
                 
                 <div className="flex items-center gap-8">
                    <div className="flex -space-x-2">
                       {project.collaborators.map((c, i) => (
                         <div key={i} className="w-8 h-8 rounded-full bg-repix-100 dark:bg-repix-900 text-repix-700 dark:text-repix-200 flex items-center justify-center text-xs font-bold border-2 border-white dark:border-zinc-900">
                           {c}
                         </div>
                       ))}
                    </div>
                    
                    <div>
                       {project.status === 'Approved' && <Badge className="bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-500/30">{trans.team.approved}</Badge>}
                       {project.status === 'In Review' && <Badge className="bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-500/30">{trans.team.inReview}</Badge>}
                       {project.status === 'Draft' && <Badge>{trans.team.draft}</Badge>}
                    </div>
                    
                    <Button variant="ghost" size="icon"><Settings size={18} /></Button>
                 </div>
               </div>
             ))}
           </div>
        </div>

      </div>
    </div>
  );
};