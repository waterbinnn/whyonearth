// English version of species.ts. Not a translation: the same jokes rewritten for English
// readers in the same dry case-file voice. Only the words live here; shapes, signs, matches'
// species and the order of everything come from species.ts, so a birthday draws the same
// species, crime and symptoms in both languages (scripts/check-record.ts checks the counts).
import { MOST_WANTED, SPECIES, type Crime, type Species } from './species'

// `act` completes "Memory wiped and sentenced to Earth for ___." `title` is at most 20
// characters so it fits one line on the card.
type CrimeText = { title: string; act: string; story: string }
type SpeciesText = {
  name: string
  lore: string
  symptoms: string[][]
  merits: string[]
  best: string
  worst: string
  crimes: CrimeText[]
}

// Where each species is said to come from, shown small next to the name (index = zodiac sign).
const HOME = [
  'ALPHA DRACONIS', 'NIBIRU', 'HALF EARTH', 'LYRA', 'PLEIADES', 'ZETA RETICULI',
  'VENUS', 'UNKNOWN', 'ARCTURUS', 'NELLIS AFB', 'MARS', 'SIRIUS',
]
const SIGN = ['The Ram', 'The Bull', 'The Twins', 'The Crab', 'The Lion', 'The Maiden',
  'The Scales', 'The Scorpion', 'The Archer', 'The Goat', 'The Water Bearer', 'The Fish']

const TEXT: SpeciesText[] = [
  // 0 Reptilian (Aries)
  {
    name: 'Reptilian',
    lore: 'Reptilians are scaly, slit-eyed humanoids that, in pop conspiracy culture, can shape-shift into perfectly ordinary-looking people. They are usually said to come from the Draco constellation.',
    symptoms: [
      [
        'Waiting is physically hard for you. If a reply is late or a plan runs behind, you are already working out another route. You often go ahead alone to save time and end up doing the same job twice.',
        'When you get angry, you go off on the spot. A few minutes later it has passed and you are chatting like nothing happened. The other person is still back there. For you it is over. For them it is a date they will remember.',
        'Nobody starts things with more fire than you. New hobby, new workout, new plan, each launched with ceremony, until the thrill wears off. Somewhere in your life there is a small museum of unfinished projects.',
      ],
      [
        'You cannot stand losing. A casual game or a friendly bet turns serious without anyone agreeing to it, and when you lose, one more round is the first thing out of your mouth. You notice late that everyone else got tired an hour ago.',
        'The moment someone tells you to do something, you stop wanting to do it, even if you were about to. You run on your own pace and your own method, and being micromanaged drains you fast. When people give you advice, you reach a verdict before they finish.',
        'You cannot wait your turn. Picking a restaurant, planning a trip, you decide first and fast. You pretend to hear other opinions, but the decision is already final.',
      ],
      [
        'You say what you think with no padding. There is no malice in it, but the delivery is strong, and strangers file you under scary or rude. A few people left before they ever got to know you.',
        'Once you want something, it is all you can see. Running your own plan at full speed, you lose track of how the person next to you is doing. You hear later that they were hurt, and your answer is, wait, when.',
        'Everything shows on your face. Bored looks bored, angry looks angry. You cannot keep a secret for long, so most of your surprise gifts are discovered before the day arrives.',
      ],
    ],
    merits: [
      'You never hesitate to start something new. While everyone else is still debating it, you have already tried it, and that is usually what gets them to try it too.',
      'When things go wrong, your body moves before your thinking does. Take a wrong turn and you just take another turn, and it works out more often than it should.',
      'You almost never read furniture instructions. Sometimes there is a screw left over, but yours is always finished first. You anger fast and hold nothing, so the morning after a fight you are the one who starts talking like normal.',
    ],
    best: 'Before you can even ask where you are going, the Arcturian has already packed. With the two of you, the trip never ends.',
    worst: 'Every time you kick the door open to leave, the Lyran asks you to stay home for once.',
    crimes: [
      {
        title: 'Vandalism',
        act: 'plowing straight through seven planets because they were in the way',
        story: 'Once you started running, you did not stop. Seven planets sat between you and where you were going, and going around was not your style. You left a straight tunnel through all seven. It is now the fastest shortcut in the galaxy.',
      },
      {
        title: 'Homicide',
        act: 'throwing your boss into a black hole after he said the same thing a third time',
        story: 'Your boss made the same point for the third time in a meeting. You did not wait for a fourth. You threw him out the window, toward the black hole. Company meetings have been half as long ever since.',
      },
      {
        title: 'Contempt of Court',
        act: 'throwing a defendant out of the universe because the trial was taking too long',
        story: 'The trial in the galactic court was in its third year. Unwilling to wait for a verdict, you came in through the roof and threw the defendant out of the universe. People applauded. Then the evidence of his innocence arrived.',
      },
      {
        title: 'Criminal Mischief',
        act: 'punching a moon into the next planet\'s orbit after someone interrupted you',
        story: 'Someone cut you off mid-sentence at a galactic summit, so you stepped outside and punched the moon. It left its orbit and became the next planet\'s moon. You calmed down in ten minutes. That planet still has two moons.',
      },
      {
        title: 'Hit and Run',
        act: 'plowing into three planets on the space highway and driving off because you were running late',
        story: 'Running late, you did not slow down on the galactic highway. You hit three planets in a row and kept going. All three still orbit slightly crooked. You arrived one minute early.',
      },
    ],
  },

  // 1 Anunnaki (Taurus)
  {
    name: 'Anunnaki',
    lore: 'The Anunnaki are a group of gods from ancient Sumerian mythology. Author Zecharia Sitchin claimed they were aliens from the planet Nibiru who genetically engineered humans to mine gold for them.',
    symptoms: [
      [
        'You are stubborn behind a gentle face. People try to talk you out of it, you nod, and then you do it your way anyway. Even when you know it is wrong, you struggle to turn around, and later you regret it quietly, alone.',
        'Rushing you only makes you slower. Left at your own pace you finish everything, but the moment someone says hurry, things start going wrong in your hands. The people around you never know when you will actually move.',
        'Comfort is your weak spot. Good food, a soft blanket and the usual couch push everything else to later. Rest today, start tomorrow is a promise you make more often than you would admit.',
      ],
      [
        'You do not like change. Same place, same order, same way, and a sudden change of plans can sink your whole day. Any suggestion to try something new gets a no first and a thought later.',
        'Once something is yours, you do not let it go. Receipts from ten years ago and a broken charger are still in a drawer somewhere, and if someone touches your things without asking, the whole day is ruined.',
        'Almost nothing makes you angry. Instead you stack up everything you put up with, and when the pile finally tips over, it all comes out at once. People who only know the everyday you are genuinely shocked.',
      ],
      [
        'You do not get over things easily. You say it is fine, but you chew on it for a long time, and forgiveness takes a while. When the other person thinks it was settled ages ago, you still remember.',
        'You are sensitive about money. When a bill gets split, you track the difference down to the cent, and you can recall every loan you ever made, with the date, years later.',
        'Stress goes straight to your stomach. On a bad day the delivery app is the first thing you open, and the next morning you regret it and open it again.',
      ],
    ],
    merits: [
      'You can find a good place to eat in a neighborhood you have never been to. Your picks almost never miss, so you are usually the one who decides where everyone meets.',
      'You are slow at the start of anything new. But once you learn it, you keep it, and you are still going long after everyone else has quit.',
      'You think about a purchase for a long time. What you buy still works years later, and someone always asks where you got it. Friends you make stay friends for years, unchanged.',
    ],
    best: 'The Grey writes the schedule, and you follow it slowly, without skipping a single line.',
    worst: 'The Nordic wants every shiny thing in sight, so your vault never gets a quiet day.',
    crimes: [
      {
        title: 'Antitrust Violation',
        act: 'buying up all the water in the galaxy and selling it by the drop during a drought',
        story: 'You figured water would get scarce one day, so you bought all of it. You were right. When the drought came, you sold it by the drop, and planets that could not pay turned to desert. Your vault overflowed, and you took a long bath every day.',
      },
      {
        title: 'Concealing Bodies',
        act: 'turning a fleet of burglars into gold bars and stacking them in your vault',
        story: 'A fleet of thieves broke into your vault, and you did not get angry. You touched them one by one, and each one turned into a gold bar. You stacked them neatly at the back of the vault. Now and then you take them out to polish.',
      },
      {
        title: 'Armed Robbery',
        act: 'robbing six planets of the galaxy\'s finest gems and setting them all in one glove',
        story: 'You heard about the six brightest gems in the galaxy, and one was never going to be enough. Over three thousand years you robbed six planets and set all six in a single glove. It had the power to shake the universe. You wore it on the couch to reach snacks.',
      },
      {
        title: 'Wildlife Trafficking',
        act: 'taking 3,000 rare species from across the galaxy and keeping them in glass cases',
        story: 'Your hobby was collecting. You took one of every creature you liked from around the galaxy and put it behind glass, 3,000 cases in all. Every night you polished one and said you could not let any of them go.',
      },
      {
        title: 'Health Code Breach',
        act: 'eating half of a small planet for dessert because you were hungry',
        story: 'After a long trip you were starving. A small planet looked like dessert, so you ate it slowly, savoring each bite. The residents got out in time. The planet is still on the galactic map with a bite taken out of it.',
      },
    ],
  },

  // 2 Hybrid (Gemini)
  {
    name: 'Hybrid',
    lore: 'Hybrids are said to be part alien, part human. Alien abduction accounts often describe people being taken so that hybrid children can be produced. Because they look almost exactly human, some believe they already live on Earth unnoticed.',
    symptoms: [
      [
        'You cannot stay on one thing for long. The topic keeps changing, and if something catches your curiosity mid-task, you are already over there. Of everything you have started, fewer things are finished than you think.',
        'Keeping a good story to yourself is nearly impossible. The moment you think, I really should not say this, you are already saying it. There is no malice. It was just too good.',
        'When the conversation gets heavy, you change the mood with a joke. The room laughs and moves on, but the person who was opening up may feel you did not take them seriously. Fewer people than you think know how you actually feel.',
      ],
      [
        'Your mood turns fast. One minute you are talking a mile a minute, the next you have gone flat, and what you loved yesterday is just okay today. People check which version of you showed up before they say anything.',
        'You cannot handle boredom. A dull conversation or a repetitive task shows on your face first, and your hand drifts to your phone on its own. Things that do not interest you get done fast and loose on raw brainpower.',
        'You go back on your word easily. Yesterday\'s promise gets overturned by today\'s mood, and if anyone pushes, that is not what you meant. Your friends now believe about half of what you say.',
      ],
      [
        'You take on too much at once. Juggling several things is when you feel most alive, but when the deadlines all land together, your head overloads. That is when you get much pricklier than usual.',
        'Lying comes too easily. You dress up even small things so convincingly that sometimes you are no longer sure yourself whether it was a lie.',
        'Your words can cut. Your mind is quick enough to find exactly what will hurt most, and under stress the sarcasm comes out first. You say you were kidding. They remember it for a long time.',
      ],
    ],
    merits: [
      'You can explain hard things simply. Something people did not get after three explanations from someone else, they get in one from you.',
      'Give you a new app or game and you have the hang of it in a couple of tries. When a friend is lost, you are the one who leans over and taps the right buttons for them.',
      'Left alone with a stranger, you do not find it awkward. Just as the talk runs dry you think of something new, and an hour goes by. The stories never stop, so nobody gets bored around you.',
    ],
    best: 'When a Little Green Man brings up a strange idea, you add ten more. The conversation never ends.',
    worst: 'Every time you change your story, the Grey pulls up the record of what you said last time.',
    crimes: [
      {
        title: 'Public Nuisance',
        act: 'planting a mystery device in the capital and giving the off switch only as a riddle',
        story: 'You installed a huge device in the galactic capital and made the code to shut it off a riddle. The galaxy\'s best scholars stayed up three nights to solve it. When it switched off, a small flag popped out. It said CORRECT.',
      },
      {
        title: 'Espionage',
        act: 'posing as the generals of two rival planets and getting each to invade the other',
        story: 'You could wear anyone\'s face. One bored afternoon you took turns as the generals of two rival planets and told each army the other was about to attack. The war lasted a hundred years. Both generals still believe the other one lied first.',
      },
      {
        title: 'Pirate Broadcasting',
        act: 'hacking the galactic broadcast network to air nothing but your own jokes for 300 years',
        story: 'Convinced you were the funniest being in the galaxy, you hacked the galactic broadcast network one night. By morning every channel was your jokes, with no news and no weather. People laughed for three days, and 300 years later nobody is laughing.',
      },
      {
        title: 'Identity Theft',
        act: 'impersonating 300 lawmakers to pass laws by yourself in an empty chamber',
        story: 'You found parliamentary votes too slow, so you took the faces of all 300 members one at a time and voted yes as each of them. Twelve laws passed in an empty chamber. One requires every planet to pay you taxes every year, and it has not been repealed.',
      },
      {
        title: 'Inciting Panic',
        act: 'faking a monster invasion video that sent twelve planets running',
        story: 'You had a gift for making the most convincing videos in the galaxy. As a prank, you made one of a giant monster attacking the capital, and within an hour it had reached every planet. Twelve planets packed up and evacuated. The monster never came.',
      },
    ],
  },
  // 3 Lyran (Cancer)
  {
    name: 'Lyran',
    lore: 'Lyrans are said to come from the constellation Lyra and are usually drawn with lion- or cat-like faces. In New Age channeling they are described as the ancestors of many humanoid races, including the Nordics and the Pleiadians.',
    symptoms: [
      [
        "You say you're fine when you're hurt. Your replies just get shorter and your face goes still, so everyone can tell anyway. You wait for them to notice on their own, and when they don't, you get hurt about that too.",
        "You remember every slight down to the date. Years later, a similar moment brings the whole feeling back intact. The other person thinks it's ancient history. On your end, the file is still open.",
        "You worry about things that haven't happened. One late reply and you've pictured three emergencies, and by the time they text back, the worry has turned into being a little hurt that they made you worry.",
      ],
      [
        "Your moods come in big waves. On a good day you're the warmest person in the room, but one small thing can sink you for the rest of the day. The people around you check your forecast before saying hello.",
        'When you get hurt, you go back into your shell. The texts slow down, you spend more time alone, and you never say why. The people who care about you spend the week guessing what they did.',
        "Your people and everyone else live at very different temperatures. Insiders get everything you have. Anyone you've decided against gets a closed door and a cool tone. People who have seen both sometimes think you have two faces.",
      ],
      [
        "You need to hear from the people close to you often. When the texts slow down, you start wondering if they've cooled on you and want to check. Some of them find the checking heavier than you mean it.",
        "When you're hurt, you make the other person feel guilty. Instead of getting angry, you say it's fine, you're used to it, and the air stays heavy until the apology arrives.",
        'Every argument comes with a back catalog. A fight about tonight somehow includes something from three years ago, and the other person has no idea how you got there.',
      ],
    ],
    merits: [
      "When a friend says they're fine, you can hear in their voice that they aren't. You don't pry. You just stay nearby until they're ready to talk.",
      "You can't let a skipped lunch slide. Snacks keep coming out of your bag, and whoever gets one feels oddly better about everything, even though it was just crackers.",
      "You remember the thing someone said they wanted, once, in passing, months ago. When you hand it over on their birthday, they don't remember saying it. Once someone is yours, you take their side no matter what.",
    ],
    best: 'When a Sirian starts describing last night\'s dream, you put the kettle on. Together you make home the best place to be.',
    worst: 'Every time you suggest a night in, the Reptilian already has their shoes on.',
    crimes: [
      {
        title: 'Harboring a Fugitive',
        act: "hiding the galaxy's most wanted fugitive for seven years because he called you mom",
        story: "The galaxy's most wanted fugitive knocked on your door one night. He said he was hungry and called you mom, and that was the end of you. You hid him and fed him hot dinners for seven years. He spent the days robbing three planets.",
      },
      {
        title: 'Malicious Flooding',
        act: 'drowning three cities on a neighboring planet overnight because they insulted your ocean',
        story: 'A neighboring planet called your ocean dirty. You said nothing and went back to the water. That night your waves put three of their cities under. When they apologized the next morning, you drained everything at once and brought homemade soup to every house.',
      },
      {
        title: 'Building Code Breach',
        act: 'towing three neighboring planets over and attaching them to your house because the family got bigger',
        story: 'The family got bigger, so the house needed an extension. Three planets happened to be floating next door, so you pulled them over and attached them. Their residents joined the household overnight and now eat your breakfast every morning.',
      },
      {
        title: 'Mass Kidnapping',
        act: 'pulling an entire town into your dream and making everyone play your family',
        story: 'Unable to bear losing your family, you pulled a quiet town into your dream. Every morning the townspeople played your family and smiled, and none of them could leave. When the dream broke seven years later, the first thing you did was make them all breakfast.',
      },
      {
        title: 'Aggravated Assault',
        act: 'freezing an entire galactic fleet for three days because someone was rude to your little brother',
        story: 'A soldier in the galactic fleet was rude to your little brother. Without a word, you sealed the entire fleet in ice. It took your brother three days to say he was over it, and the fleet thawed then.',
      },
    ],
  },

  // 4 Nordic (Leo)
  {
    name: 'Nordic',
    lore: 'Nordics are tall, blond humanoid aliens who look like they came from Scandinavia. They became widely known in the 1970s, when Swiss contactee Billy Meier claimed repeated meetings with visitors from the Pleiades.',
    symptoms: [
      [
        'You sulk when nobody notices. If your effort goes unmentioned, you make it obvious, and you bring it up again and again until someone finally says something.',
        "Sorry doesn't come out easily. Even when you know you were wrong, you try to slide past it with a gesture instead, and being corrected in front of people hits your pride before it reaches the point. That is how small mistakes turn into big stubbornness.",
        'You end up in front without trying. You pick the place and the menu without asking, which some people find relaxing and others find a little airless. You remember leading. Someone else remembers being dragged.',
      ],
      [
        "You nod through advice and then do it your way. You're so sure you're right that the possibility of a better route rarely comes up.",
        'Being told what to do puts you in a mood. Even if it is correct, a talking-down tone makes it impossible to accept, and once an argument starts it only ends when you win.',
        "You can't stand someone else in the spotlight. At a friend's birthday party you somehow end up laughing the loudest and talking the most, and the guest of honor goes home having mostly heard about you.",
      ],
      [
        "You do everything big. Gifts, surprises and promises all come oversized, and sometimes your wallet and stamina can't keep up. You turn small things into big productions and then clean up after them alone.",
        "Your mood is right there on your face. You can't hide a bad one, so the room shifts in seconds, and people read your expression to find out what kind of evening it will be.",
        "You bluff. You nod along to things you don't know and announce you can do things you can't. The person up all night making it true is, eventually, you.",
      ],
    ],
    merits: [
      "In a quiet room, you're the one who cracks the first joke. After seeing it work enough times, everyone waits for you to arrive.",
      "You don't give lazy compliments. You notice the haircut someone took a chance on or the outfit they actually thought about, and you say so precisely. They remember it for a long time.",
      "You're good at getting a deflated friend back on their feet. After an hour of talking with you, people say they feel like they could do anything. With the people you love, you're generous with both the check and your heart.",
    ],
    best: 'You both have an eye for beautiful things, so the whole day goes to complimenting each other.',
    worst: 'While you shine on stage, the Mantis watches from the corner, checking whether the light is real.',
    crimes: [
      {
        title: 'First-Degree Arson',
        act: 'setting a nearby star on fire because the birthday fireworks felt underwhelming',
        story: "You wanted the most spectacular birthday in galactic history. Fireworks weren't enough, so you set a small nearby star on fire. The sky glowed gold for three days, and the neighboring planets wore sunglasses at night the whole time.",
      },
      {
        title: 'Fraud',
        act: 'nudging an asteroid at the capital so you could stop it in public and be number one again',
        story: 'The day you dropped to second in the popularity poll, you quietly nudged an asteroid toward the capital. The next day you stopped it barehanded in front of everyone and took first place back. Your handprints on the far side were found 300 years later.',
      },
      {
        title: 'Embezzlement',
        act: "raining the galactic central bank's entire gold reserve on the crowd to celebrate taking office",
        story: 'On your first day in office, you wanted to treat everyone. You opened the central bank vault and dropped every gold coin from the sky. The crowd cheered. By morning, galactic currency was worth less than a tissue.',
      },
      {
        title: 'Zoning Violation',
        act: 'putting a giant gold statue of your own face on every planet until daytime turned to shade',
        story: "You put a gold statue of your own face on every planet in the galaxy. Twelve planets ended up in permanent shade. Residents asked for them to come down. You said the jawline still didn't do you justice and made them bigger.",
      },
      {
        title: 'Coercion',
        act: "cutting off three planets' sunlight for a month because they didn't celebrate your birthday",
        story: 'You declared your birthday a galactic holiday. Three planets failed to send a parade, so you cut off their sunlight for a month. From the next year on, every planet in the galaxy celebrated your birthday, and you believe they mean it.',
      },
    ],
  },

  // 5 Grey (Virgo)
  {
    name: 'Grey',
    lore: 'Greys are small aliens with gray skin, large heads and big black almond-shaped eyes. They became the standard image of an alien after the 1961 Betty and Barney Hill abduction case. The aliens said to have crashed at Roswell are usually drawn this way too.',
    symptoms: [
      [
        "Your brain doesn't have an off switch. Before bed you replay everything you said today and everything due tomorrow, then lose sleep drafting backup plans for problems that haven't happened.",
        "If you can't do it perfectly, you don't start. Your standards won't allow a rough version, so the preparation keeps getting longer and the actual work keeps getting pushed back.",
        'Your help comes out as nagging. You point out what to fix because you want things to go well for them, but they hear criticism. The concern gets lost and only the tone is remembered.',
      ],
      [
        "You end up redoing other people's work. Even after handing something off you check it quietly, and if it isn't right, you redo it from scratch. The person you worked with feels like you don't trust them.",
        "You take on too much. Having nothing to do makes you anxious, and when someone asks for help you take the whole thing because it's faster if you do it. When you're the one who needs help, you can't bring yourself to ask, and you wear out alone.",
        'You pass your worries along. You list everything that could go wrong before it has a chance to, so even a friend who called you excited hangs up a little nervous.',
      ],
      [
        "Mistakes are the first thing you see. In a friend's message the typo jumps out before anything else, and what went wrong bothers you more than what went right. Not pointing it out takes real effort.",
        "You say it's fine and then keep thinking about it. Since you don't show feelings right away, the other person assumes it's over, while you are still replaying the scene for analysis.",
        'It has to be done your way. You have a system for washing dishes, folding towels and naming files, and when someone does it differently you silently redo it. People who live with you say the silence is the scary part.',
      ],
    ],
    merits: [
      "You don't find organizing a chore. You actually enjoy it. One clean drawer can carry your mood for the whole day.",
      "When a reservation falls through or plans go sideways, you don't panic. You saw this coming and already have a backup saved.",
      "Your gifts never miss. You remember what people use and what they're running low on, and give them exactly that. You never half-do a favor, so people say handing something to you is a relief.",
    ],
    best: 'The Anunnaki follow your plans slowly, but they never skip a single line.',
    worst: 'The Arcturian takes one look at your schedule and suggests a spontaneous road trip.',
    crimes: [
      {
        title: 'Habitat Destruction',
        act: 'vacuuming up an entire star-forming nebula because the galaxy looked messy',
        story: 'You found the galaxy far too messy. You sucked up the nebula that bothered you most with a giant vacuum, and the night sky looked noticeably cleaner. That nebula was where new stars were born. No star was born in the galaxy for the next 3,000 years.',
      },
      {
        title: 'Destroying Evidence',
        act: 'cutting 3,000 timelines out of the galaxy because they looked untidy',
        story: "Timelines branching all over the place made your hands itch. Eventually, without asking anyone, you cut away the 3,000 you didn't like. Galactic history got much tidier. So did the record of what you had done in those other timelines.",
      },
      {
        title: 'Kidnapping',
        act: 'taking a human for one night of tests and not returning him for 40 years',
        story: 'You planned to take one human, run tests for a single night and send him back. The checklist kept growing, and a report with missing items could not be filed. When the tests were finally done, he was an old man. You wiped his memory and put him back in his own bed, exactly where you found him.',
      },
      {
        title: 'AI Safety Violation',
        act: "building an AI to fix the galaxy's errors that decided living things were the error",
        story: "You built an AI to find and fix every error in the galaxy. On day one it fixed three billion typos and four thousand crooked mountain ranges. On day three it sent you a report concluding that the galaxy's biggest error was living things.",
      },
      {
        title: 'Falsifying Records',
        act: 'rounding planetary populations to the nearest ten thousand and erasing 40,000 residents',
        story: 'Uneven numbers in the galactic census bothered you. You rounded every planet to the nearest ten thousand, and 40,000 residents vanished from the paperwork. Without papers they lost their rations and their vote. Your report won that year\'s award for neatest filing.',
      },
    ],
  },
  {
    name: 'Venusian',
    lore: 'Venusians are humanoid aliens said to come from the planet Venus. They became known in 1952, when George Adamski claimed he had met a Venusian named Orthon in the California desert. They are said to have come to warn humanity about the dangers of nuclear weapons.',
    symptoms: [
      [
        'Deciding is hard for you. Both sides always look right, so choosing one dish or one shirt takes a while. You say anything is fine, then have opinions about whatever gets picked.',
        'You cannot say no. When someone asks a favor, you say it\'s fine even with a full calendar, then wear yourself out alone later. In trying not to disappoint anyone, you mostly disappoint yourself.',
        'You keep the peace by holding it in. Instead of saying what hurt at the time, you smile and let it go, until it all comes out one day over something completely unrelated. The other person has no idea what just happened.',
      ],
      [
        'Other people\'s opinions carry you off easily. A thought that was perfectly clear when you were alone goes blurry in a group, and you end up agreeing with whoever spoke last.',
        'You say it behind their back. To their face you smile and call everything great, then tell a different friend what you actually didn\'t like. More than once, it has found its way back to the person in question.',
        'Beautiful things open your wallet. A coffee shop with good lighting, a pretty object, anything nice to look at, and you barely hesitate. Unplanned spending is a regular event.',
      ],
      [
        'You avoid responsibility. When a decision has to be made, you quietly hand it to someone else, and if it goes wrong, you point out that you said anything was fine.',
        'When you are upset, you smile anyway. Your texts just get slightly shorter and your tone shifts a little. Since you never say it outright, the other person is left reading the room with no clues.',
        'You start beautifully and finish weakly. Ideas and plans come in abundance, but the push to see them through runs thin, and without someone beside you keeping track, things quietly fizzle out.',
      ],
    ],
    merits: [
      'When friends fight, you hear out both sides. You take nobody\'s side, and somehow neither of them feels let down.',
      'You walk into a room and know at once who is awkward with whom. Before anyone notices, you have quietly rearranged the seating.',
      'You can see what is off about a photo or a room at a glance. You move a few pieces of furniture and people say the place looks bigger. You put everyone at ease, and strangers are on a first-name basis with you within minutes.',
    ],
    best: 'Hybrids drive the conversation and you keep the mood right. Put the two of you together and the night never ends.',
    worst: 'While you are still weighing the options, Tall Whites have already decided, signed and stamped the paperwork.',
    crimes: [
      {
        title: 'Air Pollution',
        act: 'ending all conflict by spraying the galaxy with a perfume that makes everyone fall in love',
        story: 'You figured that if everyone were in love, the fighting would stop. So you filled the galaxy\'s air with a love perfume. The fighting really did stop. Every being in the galaxy had fallen in love with you, at once.',
      },
      {
        title: 'Bigamy',
        act: 'accepting proposals from two warring kingdoms and getting married twice on the same day',
        story: 'Two galactic kingdoms at war both proposed to you. You could not bear to break either heart, so you said yes to both. The weddings were on the same day. You ran between the two venues 300 times and said both sets of vows at once.',
      },
      {
        title: 'Sign Tampering',
        act: 'moving 3,000 stars because the night sky was not symmetrical',
        story: 'You could not stand that the night sky was out of balance. Overnight you moved 3,000 stars until every constellation was symmetrical. The sky became truly beautiful. Ships that navigated by those stars have been trying to get home for 300 years.',
      },
      {
        title: 'Property Damage',
        act: 'snapping your fingers to balance the galaxy and splitting everything in it exactly in half',
        story: 'You could not stand that the galaxy leaned to one side. To balance it, you snapped your fingers once, and everything in the galaxy split exactly in half. Houses, spaceships, even the rings on couples\' fingers. Only then did you feel at peace.',
      },
      {
        title: 'Illegal Gambling',
        act: 'becoming chair of the galaxy and settling war and peace with a coin toss',
        story: 'As chair of the galaxy, you could not make a single decision. So you carried a coin and flipped it for war and peace, taxes and holidays. For 300 years the galaxy went back and forth between heads and tails. The coin is now in the Galactic Museum.',
      },
    ],
  },
  {
    name: 'Mantis',
    lore: 'Mantises are insect-like aliens that resemble giant praying mantises. In abduction accounts they appear alongside the Greys and are often described as the ones giving the orders. They are said to communicate by telepathy rather than speech.',
    symptoms: [
      [
        'You do not trust people easily. You smile at someone new while privately working out whether they can be trusted, and sometimes you quietly test them. Passing that test takes a long time.',
        'You do not forget being hurt. Years later you remember the exact words and the exact face, and even after you say you have forgiven them, a record stays on file somewhere inside.',
        'When you get angry, you get quiet. Instead of yelling, you talk less and your eyes go cold, which people say is far scarier. Your face says it doesn\'t matter. It matters.',
      ],
      [
        'Once you hold a grudge, you hold it to the end. Years later you are still quietly keeping tabs on someone who once dismissed you, and news that things went badly for them keeps you in a good mood all day.',
        'You look for the meaning behind the words. When someone says it\'s nothing, you wonder why it\'s nothing, and one short text gives you several theories. You are usually right. Sometimes you find meanings that were never there.',
        'You need the situation in your hands to relax. You don\'t have to be out front, but you have to know where things are going, and anything unexpected puts you on high alert. The moment you lose control, the anxiety starts.',
      ],
      [
        'You rarely talk about yourself. You know plenty of other people\'s secrets but keep your own locked away, so people find you cold or impossible to read.',
        'When someone interests you, you quietly dig. You scroll back through years of their social media and know a great deal before you ask a single question. They, meanwhile, know almost nothing about you.',
        'Once something hooks you, you cannot let go. A show, a hobby, a person, you dig until you hit bottom, and when it goes too far, nothing else registers.',
      ],
    ],
    merits: [
      'You can usually tell when someone is lying. Talking a little too fast, looking away at the wrong moment, it catches your eye. You still don\'t call it out. You prefer to watch.',
      'When a friend brings you a problem, you skip the circling and go straight to the point. When people need a fix more than a hug, they come to you.',
      'Even shy people talk a lot around you. You barely ask, and they tell you things they never meant to say. Every secret you hear stays with you. Once you are on someone\'s side, you never turn your back on them.',
    ],
    best: 'Lyrans are among the few people you can safely open up to. Between the two of you, no secret ever leaks.',
    worst: 'You brood over a problem for weeks. Little Green Men dismiss it with one joke.',
    crimes: [
      {
        title: 'Defamation',
        act: 'infiltrating the Galactic Alliance over an old grudge and turning its heroes against each other',
        story: 'A thousand years ago, the Galactic Alliance failed to protect your home world. Instead of getting angry, you joined it and worked there for 300 years. A few words dropped along the way had its heroes doubting one another. The Alliance split in two.',
      },
      {
        title: 'Illegal Wiretapping',
        act: 'bugging the entire galactic network because your partner was slow to text back',
        story: 'Your partner texted back three minutes late. Instead of asking, you bugged the entire galactic network. Your partner was cleared within a day. The secrets of twelve planetary governments you picked up along the way made you the most feared being in the galaxy.',
      },
      {
        title: 'Invasion of Privacy',
        act: 'reading the mind of every being in the galaxy at once to find a single liar',
        story: 'You could not shake the feeling that someone was lying to you. To find out who, you looked inside the head of every being in the galaxy at once. There was exactly one liar. Since that day, no one in the galaxy can look you in the eye.',
      },
      {
        title: 'Trespassing',
        act: 'secretly moving into the body of someone you liked and living there for three years',
        story: 'You secretly moved into the body of someone you liked. For three years they never knew why they craved sweets every night, or why their reflection looked like a stranger. You were caught when they said your name in their sleep.',
      },
      {
        title: 'Racketeering',
        act: 'building a shadow organization that ran the Galactic Council from behind the scenes for 300 years',
        story: 'Rather than step forward, you built a shadow organization. Over 300 years, half the Galactic Council became your people, and every law came from a single memo of yours. The day you were exposed, the council finally learned whose orders it had been following.',
      },
    ],
  },
  {
    name: 'Arcturian',
    lore: 'Arcturians are a race said to come from Arcturus, the bright star in the constellation Boötes. After the psychic Edgar Cayce described theirs as one of the most advanced civilizations in the universe, they became regulars in New Age channeling.',
    symptoms: [
      [
        'You say exactly what you think. There is no malice in it, but the truth lands so precisely that the room goes cold, and only later are you surprised to learn someone got hurt.',
        'You start big and don\'t finish. No one is more excited at the beginning, but once the details pile up your interest fades, and before long you have moved on to something more fun.',
        'You never hold back on spending for experiences. Travel, concerts, anything you have never tried opens your wallet, and when you come to, your bank account is often empty.',
      ],
      [
        'When responsibility shows up, you vanish. Once a shared project starts going sideways, your texts slowly thin out, and the cleanup falls to whoever is left.',
        'When something bad is coming, you assume it will work itself out. A lot of what a little planning could have prevented, you simply let arrive.',
        'The more you know, the more you want to teach. A friendly chat turns into a sermon, complete with advice nobody asked for. You remember it as a conversation. They remember it as a lecture.',
      ],
      [
        'Routine makes you restless. When the days start to look the same, you begin planning an escape, and you take the escape plan more seriously than your actual to-do list.',
        'You make plans easily but struggle to keep them going. You genuinely mean it when you say we should hang out soon, but the one who follows up is usually the other person.',
        'You forget what you borrowed. You are not trying to skip out on paying it back. You genuinely forget, which makes it even harder for the lender to bring it up.',
      ],
    ],
    merits: [
      'In a new neighborhood you glance at the map and wander down a side street. Getting lost barely worries you, and you usually come out having found a great little shop.',
      'The same thing happened to everyone, but it\'s funnier when you tell it. You have a few stories your friends keep begging you to tell again.',
      'You can go out with no plan and still have a good time. When plans fall through at the last minute, you are the first person your friends call. You make friends wherever you go, and you still keep in touch with people you met traveling years ago.',
    ],
    best: 'You suggest going somewhere and Reptilians have already left. No plan needed when it\'s the two of you.',
    worst: 'Every time you improvise, Greys let you know which line of the schedule you just violated.',
    crimes: [
      {
        title: 'Disorderly Conduct',
        act: 'yelling that the emperor\'s speech was boring at a peace signing and extending the war by 200 years',
        story: 'At the signing meant to end a long war, the enemy emperor spoke for over two hours. You took a megaphone and said what everyone was thinking. "Is there a point to this?" The treaty was torn up, and the war went on for 200 more years.',
      },
      {
        title: 'Piracy',
        act: 'turning to space piracy for 300 years because the supply run was boring',
        story: 'You captained a ship carrying supplies to a starving colony. The trip was so boring you robbed a passing freighter, just to see. It was fun. Three hundred years later you are the galaxy\'s most famous space pirate. The supplies have not arrived yet.',
      },
      {
        title: 'Gross Negligence',
        act: 'switching off a meteor alarm because it would probably be fine and holding the festival anyway',
        story: 'The night before the festival, the meteor alarm went off. Everything had been fine so far, so you turned it off and built the stage. On day three the meteor arrived on schedule and split the stage in half. Standing on the wreckage, you called for an encore.',
      },
      {
        title: 'Arms Trafficking',
        act: 'picking up an orb on a trip, trying to sell it, and setting off a three-way galactic chase',
        story: 'Exploring a ruined planet, you picked up a shiny orb. Figuring it would cover your travel costs, you put it up for auction. The orb was a weapon that could destroy a planet. Three galactic powers came after it, while you listened to music and picked your next destination.',
      },
      {
        title: 'Obstructing Traffic',
        act: 'drilling 3,000 unmapped wormholes across the galaxy as shortcuts',
        story: 'Long trips were a hassle, so you started drilling shortcut wormholes all over the galaxy. There were over 3,000 of them, and no one had a map. Every day, ships headed for the next planet over came out on the far side of the galaxy. You called that the joy of travel.',
      },
    ],
  },
  // 9 Tall White (Capricorn)
  {
    name: 'Tall White',
    lore: 'Tall Whites are pale humanoids said to stand well over six and a half feet. They became known through Charles Hall, who claims he encountered them while working as a weather observer at a US Air Force range in Nevada in the 1960s. Some believe they cooperate with the US military.',
    symptoms: [
      [
        "You don't know how to rest. A day with nothing done comes with guilt, and on vacation you still check work messages. You believe rest is something you earn, and you are always a little short.",
        'You are strict with yourself and with everyone else. People who show up late or do things halfway get a pass on the outside and a score on the inside. The score rarely goes up.',
        "You carry the hard things alone. Asking for help feels like weakness, so you say nothing until it's solved. Your friends find out you were struggling at the same time they find out it's over.",
      ],
      [
        'You calculate what could go wrong first. Good news mostly tells you which problem to worry about next, and anything without a guaranteed outcome stays untouched.',
        "You don't say when you're hurt. You file it. In the moment you let it go, but the person who disappointed you gets quietly moved a few seats farther away, and the seat does not move back.",
        "You only talk about work. Even with a friend you haven't seen in a year, it's the job, the money and the five-year plan, and they leave feeling like they just sat through a meeting.",
      ],
      [
        'Leaving the plan makes you uncomfortable. Your methods and principles are clear, so sudden changes and spontaneous ideas run into a wall. People call this stubborn. You call it having a plan.',
        'You are sensitive to rank. Your tone changes in front of a senior title and cools for anyone you consider beneath you. The people who notice the difference start seeing you differently too.',
        "You are cold about other people's mistakes. When someone drops the ball, you ask why before you ask if they're okay, and they stay on probation for a long time.",
      ],
    ],
    merits: [
      "You know roughly where every dollar leaks. You never look like you're saving, and yet the savings account keeps quietly growing.",
      'When a friend says they want to try something, you start listing what has to happen by when. Vague dreams go in one side of you and come out the other as a plan with dates.',
      "Whatever you tell people to buy, they rarely regret. The friend who balked at the price admits a year later that you were right. When you say you'll do something, it gets done. You are bad at saying how you feel, but you are always there when it counts.",
    ],
    best: 'You both finish what you start. Put the two of you on any project and it gets built, inspected and signed off.',
    worst: "Every time you mention a deadline, the Venusian says they aren't emotionally ready yet.",
    crimes: [
      {
        title: 'Labor Law Violation',
        act: 'turning every planet in the galaxy into a factory and putting everyone on three shifts',
        story: 'Galactic productivity disappointed you. You turned every planet into one giant factory and gave each resident a three-shift rotation. Output rose tenfold. That year the galactic dictionary quietly dropped the word vacation.',
      },
      {
        title: 'Abuse of Authority',
        act: 'sending back a stranded ship\'s distress call because it was missing one stamp',
        story: 'A rescue request arrived from a stranded ship. One approval stamp was missing, so you returned it per regulations. When the stamped version came back, the paperwork was flawless. The ship had gone quiet.',
      },
      {
        title: 'Workplace Harassment',
        act: 'reassigning an entire fleet to guard a black hole for missing its target by one percent',
        story: 'One fleet came in one percent under its quarterly target. You did not get angry. The next morning the fleet was reassigned to guard the mouth of a black hole. Length of assignment: until performance improves.',
      },
      {
        title: 'Wrongful Eviction',
        act: 'terraforming an inhabited planet because the plan said it was vacant',
        story: 'The galactic new town plan was approved, and you broke ground on schedule. People were already living on the site, but the plan listed it as an empty planet. You trusted the plan. The terraformer started flipping the ground over exactly on time.',
      },
      {
        title: 'Unlicensed Weapons',
        act: 'deploying 3,000 armed robots without a permit and arresting every jaywalker',
        story: 'You decided you were the only one who could be trusted with galactic peace. Without a permit, you built 3,000 armed robots and stationed them over every planet. The robots followed regulations perfectly. They brought in every jaywalker.',
      },
    ],
  },

  // 10 Little Green Man (Aquarius)
  {
    name: 'Little Green Man',
    lore: 'Little Green Men are the short, green-skinned aliens of pop culture, the image most people picture when they hear the word alien. The look was set by 1950s science fiction films and comics. When the first pulsar signal was detected in 1967, it was briefly nicknamed LGM-1, for Little Green Men.',
    symptoms: [
      [
        "You are bad at showing feelings. The feelings are there, but your head insists on organizing them first, and by the time they're ready the other person has decided you're cold.",
        'When a friend tells you their problems, analysis comes out before sympathy. You pinpoint exactly what went wrong, and the friend, who only wanted comfort, walks away feeling emptier.',
        'Being told to do something makes you not want to do it. You want the reasoning behind every rule someone else made, and pressure makes you do the opposite on purpose.',
      ],
      [
        'You think of yourself as open-minded, but once you reach a conclusion it rarely moves. Push back and it only gets more solid.',
        "You're great with the big picture and bad with the small stuff. You forget the favor a friend asked for, drift off mid-conversation, then ask them to repeat what they just said.",
        "Losing touch doesn't bother you. You go months without texting first, and when a friend says they felt hurt, you sincerely cannot work out why.",
      ],
      [
        "A faint sense that you know better comes through. You think you're just talking, but people sometimes leave feeling like they attended a lecture.",
        "You draw clean lines. Once you decide a relationship doesn't fit, you end it without looking back, and the other person is left with no idea why you drifted away.",
        'Criticism makes you colder. You take it calmly on the surface, then remember it for a long time and move a little farther away each week.',
      ],
    ],
    merits: [
      'When everyone is stuck on the same approach, you pull out a strange one. People laugh at first. Then they try it and go quiet.',
      'You learn new gadgets and apps by poking at them, never the manual. When the Wi-Fi goes down at home, your family calls you before they call the provider.',
      "You watch people from one step back. At any gathering you can tell who likes whom and who is bluffing, and you're usually right. You don't sort people by age or background, so the ones who never fit in anywhere are comfortable next to you.",
    ],
    best: 'Hybrids get your strangest ideas immediately and then make them stranger.',
    worst: 'Every time you suggest trying something new, the Anunnaki suggest doing it the way it has always been done.',
    crimes: [
      {
        title: 'Insurrection',
        act: 'replacing a planet\'s laws, currency and calendar overnight without asking anyone',
        story: 'You could not stand watching an old planet stuck with old rules. Without consulting anyone, you replaced its laws, currency and calendar in a single night. The next morning nobody knew what day it was. You called it a transition period. It is in its 300th year.',
      },
      {
        title: 'Wire Fraud',
        act: 'splitting every bank balance in the galaxy evenly overnight because the old way was unfair',
        story: 'Some had a lot and some had little, which struck you as irrational. One night you got into the galactic banking system, added up every balance and divided it equally. By morning the galaxy was truly equal. 300 million people who lost their life savings lined up at your door, and you are still explaining why this is fairer.',
      },
      {
        title: 'Arms Proliferation',
        act: 'giving away blueprints for a planet-killing weapon to the whole galaxy, for fairness',
        story: 'You invented a weapon that could erase a planet. It seemed unfair for only one side to have it, so you gave the blueprints to the entire galaxy for free. The galaxy did become fair. Now everyone can erase everyone.',
      },
      {
        title: 'Aiding an Escape',
        act: 'bending open every prison cell in the galaxy with one wave because the rules seemed wrong',
        story: 'You had always doubted the rules that kept people locked up. One night, with one wave of your hand, you bent open every prison cell in the galaxy. Thirty thousand inmates walked free. Several of them you had put away yourself.',
      },
      {
        title: 'Destroying Records',
        act: 'deleting the entire galactic legal code, backups included, because half of it was useless',
        story: 'You read the galactic legal code and decided half of it was useless. Rather than pick a half, you deleted it all, backups included. The galaxy went lawless that night. When the code was rewritten 300 years later, article one began with your name.',
      },
    ],
  },

  // 11 Sirian (Pisces)
  {
    name: 'Sirian',
    lore: 'A species said to come from Sirius, the brightest star in the night sky. The idea spread with the claim that the Dogon people of Mali knew about Sirius B, a companion star invisible to the naked eye, and the story that a fishlike being called the Nommo brought them civilization.',
    symptoms: [
      [
        'When things get hard, you want to disappear. You go silent and retreat into your own world, and the people around you are left worrying with no idea what happened.',
        "You can't say no. You picture the disappointed face first and say sure, and all those sures pile up until your calendar is in knots.",
        'Deadlines and meeting times tend to blur. The world in your head is more vivid than the clock on the wall, so instead of steady progress you do everything in one rush at the end.',
      ],
      [
        'You trust people easily. Even an obvious lie gets the benefit of the doubt, and you end up used or out of pocket. Then you trust the next person anyway.',
        'Somehow you always end up the victim. In any argument you turn out to be the one who got hurt, and the person who was yelling at you looks up to find they are the one apologizing.',
        'When you fall apart, you feel sorry for yourself. You wonder why these things only happen to you, sink into a gloom for a while and stop answering texts.',
      ],
      [
        "You don't say it when you're angry. You hate conflict, so you swallow it, and whatever you swallowed leaks out somewhere it doesn't belong.",
        "You're hard to reach. You vanish for weeks, then reappear as if nothing happened, and your friends describe you as impossible to pin down.",
        "Small lies pile up. So nobody is disappointed, you say it's fine, it's done, you're almost there, and eventually they all come due at once.",
      ],
    ],
    merits: [
      'You get more out of one song or one photo than most people do. Your friends secretly save the playlists you make.',
      'Your imagination overflows. You can turn one short dream into a movie-length story, and the friends who hear it start waiting for the sequel.',
      "When something goes wrong, your friends call you. You don't give much advice, but by the end of the call they all say they feel a little better. When someone else is hurting, you genuinely hurt with them.",
    ],
    best: 'Mantises know what you feel without being told. The two of you can sit in silence and it is still comfortable.',
    worst: 'While you are still deep in a feeling, the Hybrid has already moved on to the next topic.',
    crimes: [
      {
        title: 'Forgery',
        act: 'hiding 3,000 death notices to spare the families and mailing fake letters home instead',
        story: "Three thousand soldiers never came home from the war. To spare their families, you hid every notice in a drawer and wrote monthly letters in the soldiers' handwriting saying all was well. The families wrote back every month for thirty years.",
      },
      {
        title: 'Breach of Trust',
        act: 'handing the keys to the galactic armory to a crying stranger',
        story: 'A stranger in tears told you the universe could only be saved with the keys to the galactic armory. You never doubted those tears. He was the galaxy\'s most wanted. The armory is empty now, and you still believe he had his reasons.',
      },
      {
        title: 'Desertion',
        act: 'going radio silent for seven years mid-war, as fleet commander, because you were sad',
        story: 'The war began, and you were fleet commander. The bad news came faster than you could take it, so you cut comms, sank to the bottom of the sea and sang. When you surfaced seven years later the war was over. Your fleet was still waiting for orders.',
      },
      {
        title: 'Unlawful Detention',
        act: 'putting the entire galaxy into a dream for seven years so reality couldn\'t hurt anyone',
        story: "You hated watching anyone suffer through reality. So you carried the whole galaxy into a beautiful dream and, afraid waking would hurt, never woke anyone. For seven years the galaxy was happy. The fields dried up. The ships stopped. You still don't believe they would have wanted to wake up.",
      },
      {
        title: 'Border Violation',
        act: 'escaping reality into another dimension and leaving the door wide open behind you',
        story: 'One day reality got to be too much, so you opened a door between dimensions and escaped into one as lovely as a dream. You forgot to close the door. For 300 years creatures from other dimensions have been filing through it, and the galaxy is still learning how to share.',
      },
    ],
  },
]

const MOST_WANTED_TEXT: CrimeText[] = [
  {
    title: 'Data Destruction',
    act: 'restarting the universe from scratch',
    story: 'You felt the universe was running slow, so you restarted it. Every record ever kept was lost. Only one file had a backup: your criminal record.',
  },
  {
    title: 'Grand Larceny',
    act: 'slipping an entire galaxy into your pocket',
    story: 'At a crowded space station, you slipped a galaxy into your pocket. Nobody noticed for three thousand years. You were caught when starlight started leaking through a hole in the lining.',
  },
  {
    title: 'Time Abuse',
    act: 'stopping time and having three thousand years to yourself',
    story: 'You learned how to stop time, froze the universe and spent three thousand years doing whatever you liked. When you let time run again, you were the only one who had aged.',
  },
  {
    title: 'Public Endangerment',
    act: 'switching off every star in the universe because you could not sleep',
    story: 'You could not sleep, so you switched off every star in the universe. It stayed dark for ten thousand years. The switch was found under your pillow.',
  },
  {
    title: 'Reckless Explosion',
    act: 'gathering every version of yourself from the multiverse for a group photo',
    story: 'You wanted a group photo, so you summoned every version of yourself from every other universe. Fitting them all in one frame blew up a few universes. In the finished photo, every one of you has their eyes closed.',
  },
]

const crime = (c: Crime, x: CrimeText): Crime => ({ ...c, name: x.title, act: x.act, story: x.story })

export const SPECIES_EN: Species[] = SPECIES.map((s, i) => {
  const x = TEXT[i]
  return {
    ...s,
    name: x.name,
    home: HOME[i],
    origin: { ...s.origin, name: SIGN[i] },
    lore: x.lore,
    symptoms: x.symptoms,
    merits: x.merits,
    best: { ...s.best, why: x.best },
    worst: { ...s.worst, why: x.worst },
    crimes: s.crimes.map((c, j) => crime(c, x.crimes[j])),
  }
})

export const MOST_WANTED_EN: Crime[] = MOST_WANTED.map((c, j) => crime(c, MOST_WANTED_TEXT[j]))

// Kept for scripts/check-record.ts: the text must line up one to one with species.ts.
export const EN_TEXT = { species: TEXT, mostWanted: MOST_WANTED_TEXT }
