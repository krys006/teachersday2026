// ==========================================================
// EDIT TEACHER INFORMATION HERE
// For each teacher replace: username, password, name, title,
// messages (from / text / animation) and memories (image / caption).
// animation options: "envelope" "polaroid" "sticky" "terminal"
//                    "flower" "circuit" "sparkle"  (default: sparkle)
// NOTE: This is only an entry gate for a surprise, NOT real security.
// Anyone can read this file in the browser.
// ==========================================================
const teachers = [
  {
    id: "001",
    username: "sirjerold",
    password: "19t25op2",
    name: "Sir Lantoria",
    title: "Head",
    messages: [
    
      {
        from: "Student A",
        text: "Thank you for believing in us even when our code wouldn't compile.",
        animation: "envelope",
      },
      {
        from: "Student B",
        text: "Your class made hard topics feel possible.",
        animation: "polaroid",
      },
      {
        from: "Student C",
        text: "Thank you for staying patient with every question.",
        animation: "sticky",
      },
      {
        from: "Student D",
        text: "Happy Teachers' Day! You are our favorite mentor.",
        animation: "terminal",
      },
      {
        from: "Student E",
        text: "You helped us grow, one lesson at a time.",
        animation: "flower",
      },
      {
        from: "Student F",
        text: "You connected the dots for us, literally and figuratively.",
        animation: "circuit",
      },
      {
        from: "K",
        text: "Thank you po for teaching us teh logic gates, nagagamit na po namin hehe.",
        animation: "sparkle",
      },
    ],
    
    memories: [
      // <-- EDIT: put photos in assets/photos/
      // {image:"assets/photos/teacher1-1.jpg", caption:"One of our favorite memories."}
    ],
  },

  {
    id: "002",
    username: "maamana",
    password: "61fhn1pm",
    name: "Ma'am Ana",
    title: "Professor",
    messages: [
      {
        from: "Secret",
        text: "Happy Teacher's Day po Ma'am. Pasensya na po medjo late, nakalocked in po lahat sa thesis. Wish us luck po sa defense.🫶",
        animation: "flower",
      },
    ],
    memories: [],
  },

  {
    id: "003",
    username: "maamdes",
    password: "d12fz9r3",
    name: "Ma'am Desiree",
    title: "Professor",
    messages: [
      {
        from: "anon",
        text: "Happy Teacher's Day po!🥳\n\nThank you so much po for being a part of our CpE journey!\n\nAll my favorite courses have been thought by you po maam and I am immensely grateful for that. 🥰 Mapa-DSA, DBMS and more, sobrang solid po ng lectures hehe. Salamat po Ma'am!",
        animation: "polaroid",
      },
    ],
    memories: [],
  },

  {
    id: "004",
    username: "sirerrol",
    password: "85rr9nsl",
    name: "Sir Errol",
    title: "Professor",
    messages: [
      {
        from: "-",
        text: "Sir nakamiss na po yung mga hands on sa klase natin.",
        animation: "circuit",
      },
      {
        from: "-",
        text: "thank you po Sir for being a good teacher po, you don't know po how much we appreciate yung mga tinuro mo po sa amin simula nung hinandle mo po kami. from the very start po, ung seminar pa lang po, hanggang maging faculty ka po namin, sobrang humanga po lahat sa'yo, saksi po ako kung paano ka po purihin ng mga kaklase ko, na sobrang talino mo po, at mga katagang `buti na lang andiyan si Sir Errol`, `iba pag klase ni Sir Errol, talagang may natututunan` like legit Sir, nahandle mo po kami nung time na di ka pa po man bihasa sa pag pasimple ng idea pero sob knowledgeable mo naman po, and you have improved a lot po from our 1st encounter sa pagtuturo po ng mga concept na sobrang foreign sa amin, Happy Teacher's Day po Sir. You are a respectable teacher who deserve recognition and love from students (syempre from 4A) sana mapamahal ka pa po sa CpE students ikaw po pag-asa ng mga talented freshies pra mag grow po sila\n\nps. thank you po sa pag appreciate sa amin kahit ang nonchalant namin",
        animation: "envelope",
      },
      {
        from: "anon",
        text: "Happy Teacher's Day po!🥳\n\nSobrang thankful po namin sa mga lectures ninyo, especially cause literal na nagagamit po namin siya sa thesis!! Especially sa AI training 😆\n\nThank you so so much po, very grateful po ako to have been one of your students! 🫶",
        animation: "polaroid",
      },
    ],
    memories: [],
  },

  {
    id: "005",
    username: "maamjonah",
    password: "12cl4wo4",
    name: "Ma'am Jonah",
    title: "Professor",
    messages: [
      {
        from: "anon",
        text: "Happy Teacher's Day po!🥳\n\nSobrang thankful po namin sa mga lectures ninyo, especially cause literal na nagagamit po namin siya sa thesis!! Especially sa AI training 😆\n\nThank you so so much po, very grateful po ako to have been one of your students! 🫶",
        animation: "circuit",
      },
    ],
    memories: [],
  },

  {
    id: "006",
    username: "maamalex",
    password: "n1ysa900",
    name: "Ma'am Alex",
    title: "Professor",
    messages: [
      {
        from: "Student A",
        text: "Placeholder message. Replace me!",
        animation: "flower",
      },
    ],
    memories: [],
  },

  {
    id: "007",
    username: "sirponce",
    password: "k6y1bu7a",
    name: "Sir Ponce",
    title: "Professor",
    messages: [
      {
        from: "Student A",
        text: "Placeholder message. Replace me!",
        animation: "terminal",
      },
    ],
    memories: [],
  },

  {
    id: "008",
    username: "maamaleah",
    password: "22zim9ih",
    name: "Ma'am Aleah",
    title: "Professor",
    messages: [
      {
        from: "Student A",
        text: "Placeholder message. Replace me!",
        animation: "terminal",
      },
    ],
    memories: [],
  },

  {
    id: "009",
    username: "sirjayvic",
    password: "dkx2n7c0",
    name: "Sir Jayvic",
    title: "Professor",
    messages: [
      {
        from: "Student A",
        text: "Placeholder message. Replace me!",
        animation: "terminal",
      },
    ],
    memories: [],
  },
];
