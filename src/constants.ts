
import { Quadrant, MenuItem } from './types';

export const MENU: MenuItem[] = [
  { name: 'Espresso', price: 120 },
  { name: 'Cappuccino', price: 150 },
  { name: 'Cold Brew', price: 180 },
  { name: 'Masala Chai', price: 60 },
  { name: 'Croissant', price: 110 },
  { name: 'Avocado Toast', price: 220 },
];

export const QUADRANT_INFO = {
  [Quadrant.STAR]: {
    name: 'Star',
    emoji: '⭐',
    description: 'High Value + High Loyalty. Frequent visitor, high spend, emotionally invested.',
  },
  [Quadrant.BUTTERFLY]: {
    name: 'Butterfly',
    emoji: '🦋',
    description: 'High Value + Low Loyalty. Spends big but unpredictably; drawn by deals.',
  },
  [Quadrant.BARNACLE]: {
    name: 'Barnacle',
    emoji: '🪨',
    description: 'Low Value + High Loyalty. Comes constantly but spends little. Low-margin.',
  },
  [Quadrant.STRANGER]: {
    name: 'Stranger',
    emoji: '👻',
    description: 'Low Value + Low Loyalty. One-time or rare visitor. No attachment.',
  },
};

export const NAMES = ['Aarav', 'Ishani', 'Rohan', 'Ananya', 'Vikram', 'Sanya', 'Kabir', 'Meera', 'Aditya', 'Tara'];

export const MOODS = [
  { emoji: '😊', descriptor: 'Cheerful' },
  { emoji: '😴', descriptor: 'Sleepy' },
  { emoji: '🤔', descriptor: 'Pensive' },
  { emoji: '😤', descriptor: 'Hurried' },
  { emoji: '😌', descriptor: 'Relaxed' },
];
