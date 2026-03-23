
import { Customer, Quadrant, MenuItem } from './types';
import { MENU, NAMES, MOODS } from './constants';

export const generateCustomer = (round: number): Customer => {
  const quadrants = [Quadrant.STAR, Quadrant.BUTTERFLY, Quadrant.BARNACLE, Quadrant.STRANGER];
  const quadrant = quadrants[Math.floor(Math.random() * quadrants.length)];
  const name = NAMES[Math.floor(Math.random() * NAMES.length)] + ' ' + String.fromCharCode(65 + Math.floor(Math.random() * 26)) + '.';
  const mood = MOODS[Math.floor(Math.random() * MOODS.length)];

  let visitCount = 0;
  let avgSpend = 0;
  let lastVisit = '';
  let notes = '';
  let order: MenuItem[] = [];
  let dialogue = '';
  let exitBehavior = '';
  let tip = 0;

  switch (quadrant) {
    case Quadrant.STAR:
      visitCount = Math.floor(Math.random() * 20) + 15;
      avgSpend = Math.floor(Math.random() * 200) + 400;
      lastVisit = '2 days ago';
      notes = Math.random() > 0.5 ? "Always asks if there's a loyalty card." : "Remembers the name of every staff member.";
      order = [MENU[2], MENU[5]]; // Cold Brew + Avocado Toast
      dialogue = `"Hey! Good to see you again. The usual for me today, and maybe that avocado toast too. How's the new blend coming along?"`;
      exitBehavior = "They give a warm wave and head to their favorite corner table.";
      tip = Math.floor(Math.random() * 30) + 20;
      break;
    case Quadrant.BUTTERFLY:
      visitCount = Math.floor(Math.random() * 3) + 1;
      avgSpend = Math.floor(Math.random() * 300) + 500;
      lastVisit = '4 months ago';
      notes = Math.random() > 0.5 ? "Mentioned they usually go to the specialty roastery across town." : "Drops ₹800 every time, barely glances at the menu.";
      order = [MENU[1], MENU[5], MENU[4]]; // Cappuccino + Toast + Croissant
      dialogue = `"I'm in a bit of a rush, but I heard your seasonal toast is worth the detour. Give me one of those and a Cappuccino. Oh, and a croissant for the road."`;
      exitBehavior = "They're already on their phone, walking out before the receipt finishes printing.";
      tip = Math.floor(Math.random() * 50);
      break;
    case Quadrant.BARNACLE:
      visitCount = Math.floor(Math.random() * 30) + 40;
      avgSpend = Math.floor(Math.random() * 20) + 60;
      lastVisit = 'Yesterday';
      notes = Math.random() > 0.5 ? "Comes every day but only orders the ₹60 chai." : "Has been using the same loyalty card for three years.";
      order = [MENU[3]]; // Masala Chai
      dialogue = `"Morning! Just the Masala Chai today. Is the Wi-Fi password still the same? I have a long day of emails ahead."`;
      exitBehavior = "They settle in with their laptop, making sure to get every last drop of the chai.";
      tip = 0;
      break;
    case Quadrant.STRANGER:
      visitCount = 1;
      avgSpend = 0;
      lastVisit = 'First visit';
      notes = Math.random() > 0.5 ? "Ordered once six months ago, never came back until today." : "Asked for the menu twice and seemed confused by the 'Cold Brew'.";
      order = [MENU[0]]; // Espresso
      dialogue = `"Uh, hi. Just an espresso, please. To go. Do you have sugar packets?"`;
      exitBehavior = "They take the cup and leave quickly, looking around as if they're lost.";
      tip = Math.floor(Math.random() * 10);
      break;
  }

  return {
    id: round,
    name,
    visitCount,
    avgSpend,
    lastVisit,
    mood: `${mood.emoji} ${mood.descriptor}`,
    notes,
    quadrant,
    order,
    dialogue,
    exitBehavior,
    tip
  };
};
