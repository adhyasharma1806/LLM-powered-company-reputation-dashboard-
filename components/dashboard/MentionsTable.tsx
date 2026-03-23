 'use client';

 import { useEffect, useState } from 'react';
 import { motion } from 'framer-motion';
 import { Badge } from '@/components/ui/badge';
 import { ScrollArea } from '@/components/ui/scroll-area';
 import { fetchMentions, type Mention } from '@/lib/api';

 const sentimentColors = {
   positive: 'bg-green-500/20 text-green-400 border-green-500/30',
   negative: 'bg-red-500/20 text-red-400 border-red-500/30',
   neutral: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
 } as const;

 export function MentionsTable() {
   const [mentions, setMentions] = useState<Mention[]>([]);

   useEffect(() => {
     let cancelled = false;

     async function load() {
       try {
         const data = await fetchMentions(40);
         if (!cancelled) {
           setMentions(data);
         }
       } catch {
         if (!cancelled) {
           setMentions([]);
         }
       }
     }

     load();
     return () => {
       cancelled = true;
     };
   }, []);

   return (
     <motion.div
       whileHover={{ scale: 1.005 }}
       className="p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800/50 backdrop-blur-xl"
     >
       <div className="flex items-center justify-between mb-6">
         <h3 className="text-lg font-semibold">Recent Mentions</h3>
         <span className="text-sm text-zinc-500">
           Live Apple-related news feed
         </span>
       </div>

       <ScrollArea className="h-[400px]">
         <div className="space-y-3">
           {mentions.map((mention, index) => (
             <motion.div
               key={mention.id}
               initial={{ opacity: 0, x: -20 }}
               animate={{ opacity: 1, x: 0 }}
               transition={{ delay: index * 0.03 }}
               className="p-4 rounded-xl bg-zinc-800/30 border border-zinc-700/50 hover:bg-zinc-800/50 transition-colors"
             >
               <div className="flex items-start justify-between mb-2">
                 <div className="flex items-center space-x-3">
                   <span className="text-sm text-zinc-400">
                     {mention.date}
                   </span>
                   <Badge variant="outline" className="text-xs">
                     {mention.source}
                   </Badge>
                 </div>
                 <Badge
                   variant="outline"
                   className={`capitalize ${
                     sentimentColors[mention.sentiment]
                   }`}
                 >
                   {mention.sentiment}
                 </Badge>
               </div>
               <p className="text-sm text-zinc-300 leading-relaxed">
                 {mention.title || mention.text}
               </p>
             </motion.div>
           ))}
         </div>
       </ScrollArea>
     </motion.div>
   );
 }
