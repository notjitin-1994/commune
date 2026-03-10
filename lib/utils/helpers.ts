import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: string | Date): string {
  const d = new Date(date);
  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: d.getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined
  });
}

export function formatTime(date: string | Date): string {
  const d = new Date(date);
  return d.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });
}

export function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

export function generateId(): string {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

export function getCategoryColor(category: 1 | 2 | 3): string {
  switch (category) {
    case 1:
      return '#9C3D32'; // Red Oxide
    case 2:
      return '#D4A373'; // Tan
    case 3:
      return '#4A3B2C'; // Deep Brown
    default:
      return '#9C3D32';
  }
}

export function getCategoryLabel(category: 1 | 2 | 3): string {
  switch (category) {
    case 1:
      return 'Critical';
    case 2:
      return 'Information';
    case 3:
      return 'General';
    default:
      return 'Unknown';
  }
}

export function getInitials(name: string): string {
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}
