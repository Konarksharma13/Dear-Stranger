const fs = require('fs');
const path = require('path');

// Helper to get random element
const randomItem = (arr) => arr[Math.floor(Math.random() * arr.length)];

// Dataset structures
const categories = ['hope', 'comfort', 'strength', 'peace', 'motivation'];

// Category-specific vocabularies
const vocab = {
  hope: {
    openings: [
      "I know the night feels endless right now, but the sky is already planning its sunrise.",
      "Some days, just surviving is a quiet triumph.",
      "If you look closely, even the smallest cracks are where the light gets in.",
      "The winter might feel permanent, but the spring is already waiting beneath the soil.",
      "It is okay if today was heavy; tomorrow has not been written yet.",
      "You don't have to see the whole path ahead to take one small step.",
      "Even on the darkest days, there is a quiet grace waiting to be noticed.",
      "The wind is shifting, even if you can't feel it just yet.",
      "Your story has so many unwritten chapters that will surprise you.",
      "It’s okay if the only thing you did today was breathe.",
      "Even when the world feels loud and chaotic, there is a gentle rhythm waiting for you.",
      "Let the rain wash away the weight of what you could not control today.",
      "You are still here, and that is a beautiful, hopeful thing.",
      "There is a quiet strength in waiting for the tide to turn.",
      "The sun will rise again tomorrow, carrying new possibilities in its warmth.",
      "You don't have to carry the whole world on your shoulders.",
      "A quiet heart can hear the whispers of a better tomorrow.",
      "The clouds are heavy now, but they will eventually run out of rain.",
      "It takes time to bloom, and you are allowed to take all the time you need.",
      "A tiny ember is still enough to light a fire when the time is right.",
      "You are stronger than the shadows that try to follow you.",
      "Every new dawn is a gentle invitation to start over.",
      "The universe is vast, and you have a quiet place within it.",
      "Your heart knows how to heal, even when it feels broken.",
      "The road is long, but there are warm lights along the way."
    ],
    bodies: [
      "I hope you find a small reason to smile today, even if it's just for a moment.",
      "There are beautiful things waiting for you in the quiet corners of tomorrow.",
      "The stars don't ask for permission to shine; they just do, and so should you.",
      "You are allowed to let go of the things you cannot change.",
      "A gentle reminder that your worth is not measured by your productivity.",
      "Sometimes the most hopeful thing you can do is simply rest.",
      "Your life is a canvas, and even the dark brushstrokes serve a purpose.",
      "Trust the quiet process of growth that is happening out of sight.",
      "You are not defined by the storms you have passed through.",
      "There is a quiet space inside you that remains untouched by the chaos.",
      "Every step forward, no matter how small, is a victory.",
      "Let the quiet moments remind you of who you really are.",
      "You don't have to prove anything to anyone today.",
      "The earth keeps turning, and with it, new beginnings are born.",
      "You are worthy of the kindness you so easily give to others.",
      "Sometimes a soft pause is the bravest thing you can choose.",
      "The path ahead is yours to walk, at whatever pace feels right.",
      "Let yourself believe, if only for a second, that things will get lighter.",
      "There is a gentle magic in the way you keep moving forward.",
      "Your journey is unique, and there is no need to compare it to anyone else's."
    ],
    closings: [
      "Keep holding on. The light is coming.",
      "You are going to make it through this.",
      "The morning will find you, gentler than before.",
      "Take a deep breath. You are doing okay.",
      "The world is glad you are here.",
      "Sleep well tonight; tomorrow is a clean page.",
      "You are not alone in this quiet room.",
      "Trust the healing that is quietly taking place.",
      "Be gentle with yourself today.",
      "Your presence in this world matters.",
      "The shadows are temporary, but your light is real.",
      "One step at a time. You are doing enough.",
      "Let the warmth of these words sit with you.",
      "You are handled with care by the universe.",
      "The dawn is closer than it was an hour ago."
    ]
  },
  comfort: {
    openings: [
      "I wish I could make the world quiet down for you for just an hour.",
      "It is completely okay to feel tired and sad today.",
      "If you need to cry, let the tears fall; they are just heavy thoughts leaving.",
      "You have been holding it together for so long, you are allowed to fall apart now.",
      "Here is a safe space where nothing is expected of you.",
      "Let the warmth of this page wrap around you like a quiet blanket.",
      "It is alright if you don't have the answers right now.",
      "You are allowed to take a break from being strong.",
      "Sometimes the world is just too loud, and that is not your fault.",
      "Your feelings are valid, even the ones that feel messy and confusing.",
      "I hope you have a warm cup of tea or coffee beside you as you read this.",
      "You don't have to explain your silence to anyone today.",
      "It is okay to not be okay. Your heart is allowed to rest.",
      "There is no rush to heal, no deadline for feeling better.",
      "Let these words sit quietly in your heart for a moment.",
      "You are loved, even in the quiet spaces you think no one sees.",
      "The weight you are carrying is heavy, and you don't have to carry it alone.",
      "You are safe here. There are no expectations, no pressure.",
      "It is a soft night, and you are allowed to just exist in it.",
      "Your vulnerability is a beautiful, sacred thing.",
      "Sometimes the kindest thing you can do is wrap yourself in quietness.",
      "You are doing the best you can, and that is more than enough.",
      "Let the tension leave your shoulders as you read these lines.",
      "You are not a burden, and your pain is not too much.",
      "The stars are watching over you tonight with a quiet tenderness."
    ],
    bodies: [
      "You don't have to pretend everything is fine when it isn't.",
      "I hope you find comfort in the simple things today—a warm drink, a soft breeze.",
      "You are worthy of rest, of peace, of gentle kindness.",
      "Let the quiet wash over you like a soothing wave.",
      "Your heart has been through a lot, but it is still beating.",
      "There is no need to hurry through this feeling; let it pass at its own speed.",
      "I am sending you a quiet hug across the distance between us.",
      "You are not alone, even when the loneliness feels overwhelming.",
      "Your mind deserves a break from all the endless worrying.",
      "Let yourself be held by the quiet of this moment.",
      "You are enough, exactly as you are, in this very second.",
      "Sometimes the most productive thing you can do is lay down and rest.",
      "Your tears are not a sign of weakness, but of your deep humanity.",
      "I hope these words feel like a warm hand holding yours.",
      "You are allowed to say no to the world and yes to yourself today.",
      "There is a soft space waiting for you whenever you need to retreat.",
      "You don't have to fix everything today. Let it wait.",
      "Let the gentle rhythm of your breathing bring you back to center.",
      "You are a gentle soul in a harsh world, and you deserve tenderness.",
      "I hope you feel a little lighter just reading these words."
    ],
    closings: [
      "Breathe out. You are safe now.",
      "It is okay to rest. The world will wait.",
      "You are wrapped in gentle thoughts.",
      "Let it all go for tonight.",
      "You are doing just fine.",
      "Be kind to your tired heart.",
      "You are not alone, stranger.",
      "Let the quiet keep you warm.",
      "Rest now. Tomorrow is another day.",
      "You are worthy of this gentle moment.",
      "The storm will pass, but for now, just rest.",
      "Sending you peace across the quiet air.",
      "You are held in kind thoughts.",
      "Sleep peacefully. You are protected.",
      "Your heart is safe here."
    ]
  },
  strength: {
    openings: [
      "You have survived 100% of your hardest days, and that is a quiet miracle.",
      "Strength doesn't always roar; sometimes it's the quiet voice at the end of the day.",
      "You are made of stardust and resilience, even when you feel fragile.",
      "The roots of an oak tree grow deepest during the wildest storms.",
      "You don't have to be loud to be strong; your quiet endurance is enough.",
      "Even when your knees shake, you are still standing, and that is everything.",
      "There is a fierce resilience inside you that the world cannot extinguish.",
      "You have carried heavy loads before, and you found a way through.",
      "It is okay if your strength today looks like just keeping your head up.",
      "Your heart is resilient, built to bend but never to break.",
      "Every setback has been a quiet lesson in how to rise again.",
      "You are not weak for feeling tired; you have just been strong for too long.",
      "There is a quiet power in your softness, a strength in your grace.",
      "You are built to withstand the wind, like a reed that bends but stays rooted.",
      "Don't discount the small ways you have kept yourself going.",
      "You are the author of your survival, and your story is powerful.",
      "The fire inside you is stronger than the storm around you.",
      "You have a quiet courage that shows up when you need it most.",
      "It is okay to tremble, as long as you keep moving forward.",
      "Your spirit cannot be easily broken, even if it feels bruised right now.",
      "There is a deep well of strength inside you, waiting to be tapped.",
      "You are stronger than the worries that try to keep you awake.",
      "Every scar you carry is a testament to your quiet victory.",
      "You are the anchor in your own storm, holding steady.",
      "Your capacity to heal and rise is greater than you know."
    ],
    bodies: [
      "Even if you can only crawl today, you are still moving forward.",
      "Your quiet determination is more powerful than any loud declaration.",
      "Let the strength of your ancestors flow through your quiet moments.",
      "You have a quiet resolve that will carry you through this season.",
      "Do not let the hard times make you forget how strong you are.",
      "Your heart knows the way through the dark; trust its compass.",
      "You are capable of handling more than you think, but you don't have to do it all at once.",
      "Every small choice to keep going builds a bridge to a better place.",
      "You are not alone in your struggles; many are quietly rooting for you.",
      "Let your quiet courage guide you through the next hour.",
      "Your resilience is a beautiful light in a dark room.",
      "You don't need the world's approval to be strong in your own way.",
      "Trust your ability to navigate the rough waters ahead.",
      "You have a quiet dignity that no storm can wash away.",
      "Let the quiet strength of the earth support your feet today.",
      "You are a survivor, and your survival is a beautiful thing.",
      "The courage to try again tomorrow is the ultimate form of strength.",
      "You have a fire in your soul that cannot be put out.",
      "Your quiet resilience is an inspiration, even if no one sees it.",
      "You are stronger than the voices that tell you to give up."
    ],
    closings: [
      "Stand tall. You have what it takes.",
      "Your quiet strength is beautiful.",
      "Keep going, one step at a time.",
      "You are stronger than you feel.",
      "Trust your inner anchor today.",
      "You will get through this, too.",
      "Your courage is quietly shining.",
      "You are resilient beyond measure.",
      "Stand firm; the wind will die down.",
      "You are the master of your survival.",
      "Believe in your quiet power.",
      "The path is yours, and you are ready.",
      "You have the strength to bend.",
      "Keep breathing, keep standing.",
      "You are undefeated by this day."
    ]
  },
  peace: {
    openings: [
      "Let the rush of the world fade away as you read these words.",
      "You are allowed to have a quiet mind, free of today's worries.",
      "There is a peaceful space inside you, like a quiet lake at dawn.",
      "You don't have to figure everything out right now; let it be.",
      "Let your breathing slow down, matching the gentle rhythm of this page.",
      "The world will keep spinning even if you pause for a few minutes.",
      "Here is a moment of stillness, just for you, with no demands.",
      "You are enough, exactly as you are, in this quiet second.",
      "Let the noise of the day dissolve into the quiet background.",
      "There is a deep peace in realizing you don't have to control everything.",
      "Your heart deserves a moment of absolute, undisturbed quiet.",
      "Let the gentle breeze carry away the thoughts that clutter your mind.",
      "You are safe to let go of the pressure to achieve today.",
      "There is a quiet beauty in simply existing, without needing to perform.",
      "Let your thoughts settle like dust after the wind stops.",
      "You are in a safe harbor; the storm is far out at sea.",
      "Let the warmth of the sun on your skin bring you back to this moment.",
      "There is no hurry here, no rush, no race to win.",
      "You are allowed to just sit and breathe, without any guilt.",
      "Let the peace of nature find you in this digital space.",
      "Your soul is a quiet garden; let the flowers grow in their own time.",
      "You don't need to carry the noise of others' expectations.",
      "Let the quiet of this page be a sanctuary for your mind.",
      "There is a simple joy in the present moment, waiting to be felt.",
      "You are at peace with where you are, even if it's a transition."
    ],
    bodies: [
      "Let go of the need to explain yourself to the world today.",
      "I hope you find a quiet pocket of peace in your day today.",
      "You are worthy of quiet moments, of soft spaces, of stillness.",
      "Let your heart rest in the knowledge that you are doing enough.",
      "There is a gentle stillness that belongs to you, always.",
      "Let the quiet take over, leaving behind the clutter of the day.",
      "You are allowed to step off the wheel and just watch it spin.",
      "Trust the silence; it has its own beautiful language.",
      "Your mind is a sky, and the thoughts are just passing clouds.",
      "Let the simplicity of this moment wash over your busy mind.",
      "You don't need to solve the puzzle of your life today.",
      "Let the peaceful energy of these words settle in your heart.",
      "You are a quiet observer of your life, finding peace in the flow.",
      "Let the heavy thoughts float away like leaves on a stream.",
      "There is a quiet grace in letting things unfold naturally.",
      "You are the calm center of your own universe.",
      "Let the silence heal the parts of you that are tired.",
      "You don't need to run to get to where you need to be.",
      "Let the quietness of the library envelope your thoughts.",
      "You are in harmony with the gentle flow of life."
    ],
    closings: [
      "Breathe in peace, breathe out worry.",
      "All is well in this quiet moment.",
      "Let the stillness wash over you.",
      "You are enough, just as you are.",
      "Rest in this quiet sanctuary.",
      "Find peace in the simple things.",
      "The rush is over. Just breathe.",
      "Your mind is calm, your heart is still.",
      "Let the quiet guide you home.",
      "You are safe in this quiet harbor.",
      "Peace be with your gentle soul.",
      "The world is quiet now. Rest.",
      "Be still and know you are okay.",
      "Let the silence hold you close.",
      "Walk gently on your path today."
    ]
  },
  motivation: {
    openings: [
      "A journey of a thousand miles begins with a single, quiet step.",
      "You have unique gifts that are waiting to be shared with the world.",
      "The courage to try is the seed from which all great things grow.",
      "Every small action you take today builds the foundation for tomorrow.",
      "You don't have to be perfect to start; you just have to start.",
      "There is a spark inside you that is ready to light the way.",
      "The world needs the unique light that only you can bring.",
      "It is never too late to begin again, to write a new chapter.",
      "Your potential is a quiet promise, waiting to be fulfilled.",
      "Every effort you make, no matter how small, is a step forward.",
      "You are capable of creating beautiful, meaningful things.",
      "Let the passion inside you guide your actions today.",
      "There is a quiet joy in making progress, one small step at a time.",
      "You have the power to shape your day, starting right now.",
      "The road may be long, but the destination is worth the effort.",
      "Don't let the fear of failing keep you from the joy of trying.",
      "You are the architect of your own future, drawing the plans.",
      "Every day is a fresh opportunity to learn and grow.",
      "Your voice matters, and your ideas have quiet power.",
      "There is a beautiful adventure waiting for you, just ahead.",
      "You are stronger than the doubts that try to hold you back.",
      "Let your curiosity lead you to new and exciting places.",
      "Every challenge is an invitation to show what you can do.",
      "You have the resilience to turn obstacles into stepping stones.",
      "The magic happens when you choose to take that first step."
    ],
    bodies: [
      "Let your actions speak for your quiet, determined spirit.",
      "I hope you find the inspiration to create something beautiful today.",
      "You are worthy of pursuing the things that make your heart sing.",
      "Let your dreams be the compass that guides your steps today.",
      "There is a quiet strength in your focus, a power in your resolve.",
      "Let the simple joy of doing be your guide today.",
      "You don't need to see the summit to know you are climbing.",
      "Trust your instincts; they are leading you toward growth.",
      "Your dedication to your path is a beautiful thing to witness.",
      "Let the challenges you face today strengthen your resolve for tomorrow.",
      "You have a quiet determination that will see you through.",
      "Let the quiet progress you make today bring a smile to your face.",
      "You are in control of your effort, and that is a powerful thing.",
      "Let the pursuit of your passions bring energy to your day.",
      "There is a quiet satisfaction in completing a task, however small.",
      "You are built for progress, designed to learn and adapt.",
      "Let the enthusiasm of your ideas carry you forward today.",
      "You have the capacity to make a positive difference in your world.",
      "Let the quiet fire of your ambition burn brightly today.",
      "You are moving closer to your goals with every deliberate step."
    ],
    closings: [
      "Take the step. The path will appear.",
      "Your effort today is a seed for tomorrow.",
      "Keep moving forward, however slowly.",
      "You are capable of wonderful things.",
      "Trust the journey and your steps.",
      "Make today count, in your own way.",
      "Your light is needed in this world.",
      "Keep creating, keep striving quietly.",
      "The adventure begins with you today.",
      "You have the power to begin.",
      "Let your passion lead the way.",
      "Your progress is a quiet victory.",
      "Belief in yourself is the first step.",
      "Keep building the life you want.",
      "Go quietly towards your dreams."
    ]
  }
};

// Atmospheric postscripts to make pages feel like real journal entries left by humans
const postscripts = [
  "(Written on a train window sill, watching the rain)",
  "(Left on page 42 of a library book, hoping you'd find it)",
  "(Scribbled at a coffee shop on a cold Tuesday morning)",
  "(Left on a park bench under the autumn leaves)",
  "(Written in the margins of an old journal at midnight)",
  "(Written while listening to the wind outside my window)",
  "(Left on a windowsill overlooking a quiet street)",
  "(Written under a warm desk lamp while the world slept)",
  "(Found tucked behind an old painting in a dusty bookstore)",
  "(Written on the back of a train ticket, somewhere in France)",
  "(Left on a wooden table at the botanical gardens)",
  "(Left behind in a guestbook at a small cabin in the woods)",
  "(Written by a stranger who sat here before you)",
  "(Left near the harbor as the fog was rolling in)",
  "(Written while waiting for the morning kettle to boil)",
  "(Scribbled on a napkin, hoping it makes you smile)",
  "(Left in the drawer of a hotel desk, for the next traveler)"
];

// Seasonal touches or visual details embedded in metadata
// (Pressed flower, coffee ring, dried leaf, tear, gold leaf edge)
const seasonalDetails = [
  { type: "pressed_flower", emoji: "🌸", label: "A tiny pressed violet is taped to the corner." },
  { type: "coffee_ring", emoji: "☕", label: "A faint coffee ring stain sits on the bottom margin." },
  { type: "dried_leaf", emoji: "🍂", label: "A small pressed autumn leaf lies flat on the page." },
  { type: "tear_stain", emoji: "💧", label: "The paper is slightly crinkled near the edge, like dried water." },
  { type: "gold_leaf", emoji: "✨", label: "A thin stripe of gold leaf is gilded along the deckled edge." }
];

// Generating 1000 items per category
const dataset = {};

categories.forEach(cat => {
  dataset[cat] = [];
  const categoryVocab = vocab[cat];
  
  // Set of generated texts to ensure complete uniqueness
  const generatedTexts = new Set();
  let idCounter = 1;
  
  // Determine IDs offset per category to ensure unique global IDs:
  // hope: 1000-1999, comfort: 2000-2999, strength: 3000-3999, peace: 4000-4999, motivation: 5000-5999
  const baseId = (categories.indexOf(cat) + 1) * 1000;
  
  while (dataset[cat].length < 1000) {
    let text = "";
    const rand = Math.random();
    
    // Mix different styles
    if (rand < 0.25) {
      // Style 1: Opening + Closing
      text = `${randomItem(categoryVocab.openings)} ${randomItem(categoryVocab.closings)}`;
    } else if (rand < 0.75) {
      // Style 2: Opening + Body + Closing
      text = `${randomItem(categoryVocab.openings)} ${randomItem(categoryVocab.bodies)} ${randomItem(categoryVocab.closings)}`;
    } else {
      // Style 3: Just opening/thought (short, impactful)
      text = randomItem(categoryVocab.openings);
    }
    
    // Clean spaces
    text = text.replace(/\s+/g, ' ').trim();
    
    if (!generatedTexts.has(text)) {
      generatedTexts.add(text);
      
      const item = {
        id: baseId + idCounter,
        text: text
      };
      
      // 20% chance of an atmospheric postscript
      if (Math.random() < 0.20) {
        item.postscript = randomItem(postscripts);
      }
      
      // 5% chance of a seasonal visual embellishment metadata
      if (Math.random() < 0.05) {
        const embellish = randomItem(seasonalDetails);
        item.decoration = embellish.type;
        item.decorationLabel = embellish.label;
      }
      
      // Random handwriting font index (0 to 4) so we vary handwriting styles
      item.fontStyle = Math.floor(Math.random() * 5);
      
      dataset[cat].push(item);
      idCounter++;
    }
  }
  
  console.log(`Generated ${dataset[cat].length} entries for ${cat}.`);
});

// Write to JSON file
const dataDir = path.join(__dirname, '..', 'src', 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

fs.writeFileSync(
  path.join(dataDir, 'encouragements.json'),
  JSON.stringify(dataset, null, 2),
  'utf-8'
);

console.log("Dataset successfully written to src/data/encouragements.json");
