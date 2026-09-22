const QR_CAPTIONS = [
  "Scan me",
  "Scan this",
  "Tap into it",
  "Take a look",
  "Find me",
  "Say hi",
  "Here I am",
  "Go on, scan me",
  "You know what to do",
  "Give me a scan",
  "Scan & say hi",
  "Curious?",
  "What's behind here?",
  "Do the thing",
  "Peek inside",
  "Try me",
  "One little scan",
  "Meet me online",
  "More about me",
  "Let's connect",
  "Find me online",
  "My little corner",
  "All my links",
  "The good stuff"
];

export function getRandomQrCaption() {
  return QR_CAPTIONS[Math.floor(Math.random() * QR_CAPTIONS.length)];
}
