export type WordWithHint = { word: string; hint: string };

export const WORDS_WITH_HINTS: WordWithHint[] = [
  { word: "Apple", hint: "A red or green fruit that grows on trees" },
  { word: "Astronaut", hint: "A person who travels to outer space" },
  { word: "Balloon", hint: "A rubber bag filled with air or gas" },
  { word: "Butterfly", hint: "An insect with colorful wings" },
  { word: "Caterpillar", hint: "A fuzzy creature that becomes a butterfly" },
  { word: "Cloud", hint: "A fluffy white shape in the sky" },
  { word: "Coconut", hint: "A tropical fruit" },
  { word: "Diamond", hint: "The hardest natural gemstone" },
  { word: "Dragon", hint: "A mythical fire-breathing creature" },
  { word: "Eagle", hint: "A large bird of prey with sharp talons" },
  { word: "Elephant", hint: "The largest land animal with a long trunk" },
  { word: "Firefighter", hint: "A person who puts out fires" },
  { word: "Frog", hint: "A green amphibian that hops and croaks" },
  { word: "Garden", hint: "A place where flowers and vegetables grow" },
  { word: "Gorilla", hint: "The largest of the great apes" },
  { word: "Helicopter", hint: "A flying vehicle with spinning blades on top" },
  { word: "Hospital", hint: "A building where doctors take care of patients" },
  { word: "Igloo", hint: "A dome-shaped shelter built from snow" },
  { word: "Insect", hint: "A tiny creature with six legs" },
  { word: "Jacket", hint: "A short coat you wear over your shirt" },
  { word: "Jellyfish", hint: "A soft sea creature with trailing tentacles" },
  { word: "Kangaroo", hint: "An Australian animal that hops and has a pouch" },
  { word: "Kite", hint: "A flying toy attached to a long string" },
  { word: "Lemon", hint: "A sour yellow citrus fruit" },
  {
    word: "Lighthouse",
    hint: "A tall tower with a bright light that guides ships",
  },
  { word: "Monkey", hint: "A playful primate that loves to climb trees" },
  { word: "Moon", hint: "Earth's natural satellite that glows at night" },
  { word: "Nest", hint: "A cozy home built by birds for their eggs" },
  { word: "Notebook", hint: "A book with blank pages used for writing" },
  { word: "Octopus", hint: "A sea creature with eight arms" },
  { word: "Owl", hint: "A nocturnal bird known for its hooting call" },
  {
    word: "Penguin",
    hint: "A black-and-white bird that cannot fly but can swim",
  },
  { word: "Pirate", hint: "A sea robber who searches for treasure" },
  { word: "Queen", hint: "A female ruler of a kingdom" },
  { word: "Rainbow", hint: "An arc of colors that appears after rain" },
  { word: "Robot", hint: "A machine programmed to do tasks automatically" },
  { word: "Spider", hint: "An eight-legged creature that spins webs" },
  { word: "Sun", hint: "The bright star at the center of our solar system" },
  { word: "Tiger", hint: "A large striped wild cat" },
  { word: "Train", hint: "A vehicle that travels on rails" },
  { word: "Umbrella", hint: "A folding canopy that keeps you dry in the rain" },
  { word: "Unicorn", hint: "A magical horse with a single horn on its head" },
  { word: "Violin", hint: "A small stringed instrument played with a bow" },
  { word: "Volcano", hint: "A mountain that can erupt with hot lava" },
  { word: "Wagon", hint: "A four-wheeled cart pulled by hand or horses" },
  { word: "Whale", hint: "The largest mammal that lives in the ocean" },
  {
    word: "Xylophone",
    hint: "A musical instrument with wooden bars you strike",
  },
  { word: "Yacht", hint: "A large, elegant sailing or motor boat" },
  { word: "Yarn", hint: "A long strand of fiber used for knitting" },
  { word: "Zipper", hint: "A fastener with interlocking teeth on clothing" },
  { word: "Zoo", hint: "A place where you can see wild animals up close" },
];

export function getRandomWordWithHint(): WordWithHint {
  return WORDS_WITH_HINTS[Math.floor(Math.random() * WORDS_WITH_HINTS.length)]!;
}

export const LIVES = 9;
export const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

export const INSTRUCTIONS =
  "Select a letter to guess the hidden word! Everytime you make a wrong selection, your pet will draw FLOWERMAN. Finish guessing before FLOWERMAN is complete to win!";
