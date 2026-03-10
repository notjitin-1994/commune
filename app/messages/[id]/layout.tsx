// Generate static params for all conversation IDs
export function generateStaticParams() {
  // These match the demo conversation IDs in seed.ts
  return [
    { id: 'conv-1' },
    { id: 'conv-2' },
    { id: 'conv-3' },
    { id: 'conv-4' },
  ];
}

export default function ChatLayout({ children }: { children: React.ReactNode }) {
  return children;
}
