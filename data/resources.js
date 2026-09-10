const subjects = [
  { id:"maths", name:"Mathematics", icon:"📐", description:"Algebra, geometry, statistics & more" },
  { id:"science", name:"Science", icon:"🔬", description:"Physics, chemistry & biology" },
  { id:"sst", name:"Social Science", icon:"🌍", description:"History, geography, civics & economics" },
  { id:"english", name:"English", icon:"📖", description:"Literature & language" },
  { id:"ai", name:"Artificial Intelligence", icon:"🤖", description:"AI 417 concepts & practice" }
];

const chapters = {
  maths: [
    "Real Numbers","Polynomials","Pair of Linear Equations in Two Variables",
    "Quadratic Equations","Arithmetic Progressions","Triangles",
    "Coordinate Geometry","Introduction to Trigonometry",
    "Some Applications of Trigonometry","Circles","Areas Related to Circles",
    "Surface Areas and Volumes","Statistics","Probability"
  ],
  science: [
    "Chemical Reactions and Equations","Acids, Bases and Salts",
    "Metals and Non-metals","Carbon and its Compounds","Life Processes",
    "Control and Coordination","How do Organisms Reproduce?",
    "Heredity","Light – Reflection and Refraction","The Human Eye and the Colourful World",
    "Electricity","Magnetic Effects of Electric Current","Our Environment"
  ],
  sst: {
    history:["The Rise of Nationalism in Europe","Nationalism in India","The Making of a Global World","The Age of Industrialisation","Print Culture and the Modern World"],
    geography:["Resources and Development","Forest and Wildlife Resources","Water Resources","Agriculture","Minerals and Energy Resources","Manufacturing Industries","Lifelines of National Economy"],
    civics:["Power Sharing","Federalism","Gender, Religion and Caste","Political Parties","Outcomes of Democracy"],
    economics:["Development","Sectors of the Indian Economy","Money and Credit","Globalisation and the Indian Economy","Consumer Rights"]
  },
  english: [
    "A Letter to God","Nelson Mandela: Long Walk to Freedom","Two Stories about Flying",
    "From the Diary of Anne Frank","Glimpses of India","Mijbil the Otter",
    "Madam Rides the Bus","The Sermon at Benares","The Proposal",
    "Dust of Snow","Fire and Ice","A Tiger in the Zoo","How to Tell Wild Animals",
    "The Ball Poem","Amanda!","Animals","The Trees","Fog","The Tale of Custard the Dragon","For Anne Gregory"
  ],
  ai: [
    "Introduction to AI","AI Project Cycle","Natural Language Processing",
    "Evaluation","Data Literacy","Computer Vision","Neural Networks"
  ]
};

const resources = [
  {id:"r1",title:"NCERT Textbooks",subject:"science",chapter:"All",type:"Book",description:"Official NCERT textbook portal.",url:"https://ncert.nic.in/textbook.php",free:true},
  {id:"r2",title:"CBSE Academic",subject:"all",chapter:"All",type:"Website",description:"Official CBSE academic resources and curriculum.",url:"https://cbseacademic.nic.in/",free:true},
  {id:"r3",title:"NCERT Mathematics",subject:"maths",chapter:"All",type:"Book",description:"Official Class 10 Mathematics textbook.",url:"https://ncert.nic.in/textbook.php",free:true},
  {id:"r4",title:"AI 417 Material",subject:"ai",chapter:"All",type:"PDF",description:"CBSE skill education material for Artificial Intelligence.",url:"https://cbseacademic.nic.in/skill-education-books.html",free:true},
  {id:"r5",title:"Electricity Practice",subject:"science",chapter:"Electricity",type:"Practice",description:"Add your original numerical worksheet here.",url:"#",free:true},
  {id:"r6",title:"Electricity Notes",subject:"science",chapter:"Electricity",type:"Notes",description:"Add your original chapter notes here.",url:"#",free:true}
];

function getChapterList(subjectId){
  const value = chapters[subjectId];
  if (Array.isArray(value)) return value;
  if (value && typeof value === "object") {
    return Object.entries(value).flatMap(([unit, list]) => list.map(ch => `${unit[0].toUpperCase()+unit.slice(1)}: ${ch}`));
  }
  return [];
}
