// Database-ready seed data.
// Later this same structure can be moved into Supabase tables.
const subjects = [
  {id:"maths", name:"Mathematics", icon:"📐", description:"Algebra, geometry & more"},
  {id:"science", name:"Science", icon:"🔬", description:"Physics, chemistry & biology"},
  {id:"sst", name:"Social Science", icon:"🌍", description:"History, geography, civics & economics"},
  {id:"english", name:"English", icon:"📖", description:"Literature, grammar & writing"},
  {id:"ai", name:"Artificial Intelligence", icon:"🤖", description:"AI 417 concepts & practice"}
];

const resources = [
  {id:"r1",title:"NCERT Science Textbook",subject:"science",chapter:"All",type:"Book",description:"Start with the official textbook for every Science chapter.",url:"https://ncert.nic.in/textbook.php",free:true},
  {id:"r2",title:"NCERT Mathematics Textbook",subject:"maths",chapter:"All",type:"Book",description:"Official Class 10 Mathematics textbook.",url:"https://ncert.nic.in/textbook.php",free:true},
  {id:"r3",title:"CBSE Academic Resources",subject:"all",chapter:"All",type:"Website",description:"Official CBSE academic resources and curriculum.",url:"https://cbseacademic.nic.in/",free:true},
  {id:"r4",title:"Chapter Notes — Add yours",subject:"science",chapter:"Electricity",type:"Notes",description:"A placeholder for your own original chapter notes.",url:"#",free:true},
  {id:"r5",title:"Electricity Numericals — Add worksheet",subject:"science",chapter:"Electricity",type:"Practice",description:"Add your original numerical worksheet here.",url:"#",free:true},
  {id:"r6",title:"AI 417 Student Material",subject:"ai",chapter:"All",type:"PDF",description:"Official CBSE skill-education material for Artificial Intelligence.",url:"https://cbseacademic.nic.in/skill-education-books.html",free:true}
];
