export const getWittyComment = (score: number): string => {
  if (score >= 9.5) return "A+ for effort! This website is healthier than most patients walking through the doors. Just a tweak here and there, and you'll be the gold standard!";
  if (score >= 8.5) return "You're almost there! This is like a near-perfect diagnosis—just add a chatbot or spruce up those social media vibes, and you're in perfect health!";
  if (score >= 7.5) return "So close to digital greatness! A little polish—maybe online payments or video consults—and you'll be a crowd favorite!";
  if (score >= 6.5) return "This website's doing well, but it's like a doc running low on caffeine—functional, but it could do more! Boost it with features like video consults or a snazzy chatbot.";
  if (score >= 5.5) return "Not bad, but not top-notch either. Think of this score as a slightly elevated heart rate—nothing serious, but worth addressing. Online appointments and a call center could be just the remedy!";
  if (score >= 4.5) return "This website is in need of a check-up. It's like forgetting to wash your hands—basic but crucial improvements like online booking and better social media presence can fix it!";
  if (score >= 3.5) return "It's not the end of the world, but your website is definitely on life support. Add some modern essentials—video consults, chatbot, Google reviews—and watch your health score skyrocket!";
  if (score >= 2.5) return "Paging Dr. Improvement! This website's health is critical. Start with the basics—online payments, a chatbot, and maybe a sprinkle of Instagram magic.";
  if (score >= 1.5) return "We hate to break it to you, but this website's pulse is faint. It's time for a major revamp—think online appointments, call centers, and a social media detox!";
  return "Well, it's a good thing you're in healthcare because this website needs intensive care! Let's get serious—start with Google reviews and online consults.";
};