 'use client';

 import { useState } from 'react';
 import { motion } from 'framer-motion';
 import { Bell, Search, User, LogOut } from 'lucide-react';
 import { useRouter } from 'next/navigation';

 import { Button } from '@/components/ui/button';
 import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuItem,
   DropdownMenuLabel,
   DropdownMenuSeparator,
   DropdownMenuTrigger,
 } from '@/components/ui/dropdown-menu';
 import { toast } from '@/hooks/use-toast';
 import { signOutLocal } from '@/lib/localAuth';

 export function Header() {
   const router = useRouter();
   const [signingOut, setSigningOut] = useState(false);

   async function handleSignOut() {
     try {
       setSigningOut(true);
       signOutLocal();

       toast({
         title: 'Signed out',
         description: 'You have been signed out.',
       });
       router.push('/sign-in');
     } catch (err) {
       console.error(err);
       toast({
         title: 'Unexpected error',
         description: 'Something went wrong while signing out.',
         variant: 'destructive',
       });
     } finally {
       setSigningOut(false);
     }
   }

   return (
     <header className="h-16 border-b border-zinc-800/50 backdrop-blur-xl bg-zinc-950/50 px-6 flex items-center justify-between">
       <motion.div
         initial={{ opacity: 0, x: -20 }}
         animate={{ opacity: 1, x: 0 }}
         transition={{ duration: 0.5 }}
       >
         <h1 className="text-2xl font-semibold bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent">
           Apple Reputation Intelligence
         </h1>
         <p className="text-sm text-zinc-500 mt-0.5">
           Real-time sentiment analysis and insights
         </p>
       </motion.div>

       <motion.div
         initial={{ opacity: 0, x: 20 }}
         animate={{ opacity: 1, x: 0 }}
         transition={{ duration: 0.5 }}
         className="flex items-center space-x-3"
       >
         <button className="p-2 rounded-xl bg-zinc-800/50 hover:bg-zinc-800 transition-colors">
           <Search className="w-5 h-5 text-zinc-400" />
         </button>
         <button className="p-2 rounded-xl bg-zinc-800/50 hover:bg-zinc-800 transition-colors relative">
           <Bell className="w-5 h-5 text-zinc-400" />
           <span className="absolute top-1 right-1 w-2 h-2 bg-blue-500 rounded-full" />
         </button>
         <DropdownMenu>
           <DropdownMenuTrigger asChild>
             <Button
               variant="ghost"
               size="icon"
               className="rounded-xl bg-zinc-800/50 hover:bg-zinc-800"
             >
               <User className="w-5 h-5 text-zinc-400" />
             </Button>
           </DropdownMenuTrigger>
           <DropdownMenuContent align="end" className="w-48">
             <DropdownMenuLabel>Account</DropdownMenuLabel>
             <DropdownMenuSeparator />
             <DropdownMenuItem
               onClick={handleSignOut}
               disabled={signingOut}
               className="flex items-center space-x-2"
             >
               <LogOut className="w-4 h-4" />
               <span>{signingOut ? 'Signing out...' : 'Sign out'}</span>
             </DropdownMenuItem>
           </DropdownMenuContent>
         </DropdownMenu>
       </motion.div>
     </header>
   );
 }
