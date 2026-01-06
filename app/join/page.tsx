import { Suspense } from 'react';
import JoinFormContent from './JoinFormContent';

export default function JoinForm() {
  return (
    <Suspense fallback={<div className="relative min-h-screen overflow-hidden bg-black flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div></div>}>
      <JoinFormContent />
    </Suspense>
  );
}
