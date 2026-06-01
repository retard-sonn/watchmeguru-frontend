// Full ISO country database with dial codes and exam mappings
// Source: ISO 3166-1 + custom exam data

export interface Country {
  code: string;  // ISO 3166-1 alpha-2
  name: string;
  dial: string;
  flag: string;  // emoji flag
  exams: Exam[];
}

export interface Exam {
  id: string;
  title: string;
  emoji: string;
  color: string;
}

export const COUNTRIES: Country[] = [
  { code:"IN", name:"India", dial:"+91", flag:"🇮🇳", exams:[
    {id:"jee",title:"Clear JEE",emoji:"⚙",color:"#0F2167"},{id:"neet",title:"Clear NEET",emoji:"🧪",color:"#7BA65B"},
    {id:"upsc",title:"Clear UPSC",emoji:"🏛",color:"#DC2626"},{id:"nda",title:"Crack NDA",emoji:"🎖",color:"#5B4636"},
    {id:"cuet",title:"Ace CUET",emoji:"📋",color:"#1CB0F6"},{id:"boards_in",title:"Board Exams",emoji:"📚",color:"#58CC02"},
  ]},
  { code:"US", name:"United States", dial:"+1", flag:"🇺🇸", exams:[
    {id:"sat",title:"Ace the SAT",emoji:"📝",color:"#1CB0F6"},{id:"act",title:"Ace the ACT",emoji:"📋",color:"#CE82FF"},
    {id:"ap",title:"AP Exams",emoji:"📖",color:"#D9A441"},{id:"ged",title:"GED",emoji:"🎓",color:"#58CC02"},
    {id:"hs_us",title:"High School",emoji:"📚",color:"#FF7A00"},
  ]},
  { code:"GB", name:"United Kingdom", dial:"+44", flag:"🇬🇧", exams:[
    {id:"gcse",title:"Ace GCSEs",emoji:"📚",color:"#1CB0F6"},{id:"alevel",title:"Ace A-Levels",emoji:"📖",color:"#CE82FF"},
    {id:"ucat",title:"UCAT",emoji:"🏥",color:"#DC2626"},{id:"lnat",title:"LNAT",emoji:"⚖",color:"#5B4636"},
  ]},
  { code:"AU", name:"Australia", dial:"+61", flag:"🇦🇺", exams:[
    {id:"hsc_au",title:"HSC / VCE",emoji:"📚",color:"#1CB0F6"},{id:"ucat_au",title:"UCAT ANZ",emoji:"🏥",color:"#DC2626"},
    {id:"school_au",title:"School Exams",emoji:"🎓",color:"#58CC02"},
  ]},
  { code:"CA", name:"Canada", dial:"+1", flag:"🇨🇦", exams:[
    {id:"school_ca",title:"High School Diploma",emoji:"📚",color:"#1CB0F6"},{id:"mcat_ca",title:"MCAT Canada",emoji:"🏥",color:"#DC2626"},
  ]},
  { code:"DE", name:"Germany", dial:"+49", flag:"🇩🇪", exams:[
    {id:"abitur",title:"Abitur",emoji:"📚",color:"#1CB0F6"},{id:"studienkolleg",title:"Studienkolleg",emoji:"🎓",color:"#58CC02"},
  ]},
  { code:"FR", name:"France", dial:"+33", flag:"🇫🇷", exams:[
    {id:"bac",title:"Baccalauréat",emoji:"📚",color:"#1CB0F6"},{id:"concours",title:"Concours",emoji:"🎓",color:"#CE82FF"},
  ]},
  { code:"JP", name:"Japan", dial:"+81", flag:"🇯🇵", exams:[
    {id:"center_jp",title:"Center Test",emoji:"📝",color:"#1CB0F6"},{id:"eiken",title:"Eiken",emoji:"📖",color:"#58CC02"},
  ]},
  { code:"KR", name:"South Korea", dial:"+82", flag:"🇰🇷", exams:[
    {id:"suneung",title:"Suneung (CSAT)",emoji:"📝",color:"#DC2626"},{id:"school_kr",title:"School Exams",emoji:"📚",color:"#1CB0F6"},
  ]},
  { code:"CN", name:"China", dial:"+86", flag:"🇨🇳", exams:[
    {id:"gaokao",title:"Gaokao",emoji:"📝",color:"#DC2626"},{id:"cet",title:"CET 4/6",emoji:"📖",color:"#1CB0F6"},
  ]},
  { code:"BR", name:"Brazil", dial:"+55", flag:"🇧🇷", exams:[
    {id:"enem",title:"ENEM",emoji:"📝",color:"#1CB0F6"},{id:"vestibular",title:"Vestibular",emoji:"🎓",color:"#58CC02"},
  ]},
  { code:"NG", name:"Nigeria", dial:"+234", flag:"🇳🇬", exams:[
    {id:"waec",title:"WAEC",emoji:"📚",color:"#1CB0F6"},{id:"jamb",title:"JAMB UTME",emoji:"📝",color:"#DC2626"},
  ]},
  { code:"ZA", name:"South Africa", dial:"+27", flag:"🇿🇦", exams:[
    {id:"matric",title:"Matric (NSC)",emoji:"📚",color:"#1CB0F6"},{id:"school_za",title:"School Exams",emoji:"🎓",color:"#58CC02"},
  ]},
  { code:"PK", name:"Pakistan", dial:"+92", flag:"🇵🇰", exams:[
    {id:"mdcat_pk",title:"MDCAT",emoji:"🏥",color:"#DC2626"},{id:"ecat_pk",title:"ECAT",emoji:"⚙",color:"#0F2167"},
    {id:"css_pk",title:"CSS",emoji:"🏛",color:"#5B4636"},{id:"boards_pk",title:"Board Exams",emoji:"📚",color:"#58CC02"},
  ]},
  { code:"BD", name:"Bangladesh", dial:"+880", flag:"🇧🇩", exams:[
    {id:"hsc_bd",title:"HSC",emoji:"📚",color:"#1CB0F6"},{id:"admission_bd",title:"University Admission",emoji:"🎓",color:"#DC2626"},
  ]},
  { code:"AE", name:"UAE", dial:"+971", flag:"🇦🇪", exams:[
    {id:"emsat",title:"EmSAT",emoji:"📝",color:"#1CB0F6"},{id:"school_ae",title:"School Exams",emoji:"📚",color:"#58CC02"},
  ]},
  { code:"SG", name:"Singapore", dial:"+65", flag:"🇸🇬", exams:[
    {id:"alevel_sg",title:"GCE A-Levels",emoji:"📖",color:"#CE82FF"},{id:"olevel_sg",title:"GCE O-Levels",emoji:"📚",color:"#1CB0F6"},
  ]},
  { code:"MY", name:"Malaysia", dial:"+60", flag:"🇲🇾", exams:[
    {id:"spm",title:"SPM",emoji:"📚",color:"#1CB0F6"},{id:"stpm",title:"STPM",emoji:"📖",color:"#CE82FF"},
  ]},
  { code:"PH", name:"Philippines", dial:"+63", flag:"🇵🇭", exams:[
    {id:"upcat",title:"UPCAT",emoji:"📝",color:"#DC2626"},{id:"school_ph",title:"School Exams",emoji:"📚",color:"#58CC02"},
  ]},
  { code:"ID", name:"Indonesia", dial:"+62", flag:"🇮🇩", exams:[
    {id:"utbk",title:"UTBK-SNBT",emoji:"📝",color:"#DC2626"},{id:"school_id",title:"School Exams",emoji:"📚",color:"#1CB0F6"},
  ]},
  { code:"EG", name:"Egypt", dial:"+20", flag:"🇪🇬", exams:[
    {id:"thanawya",title:"Thanawya Amma",emoji:"📚",color:"#1CB0F6"},{id:"school_eg",title:"School Exams",emoji:"🎓",color:"#58CC02"},
  ]},
  { code:"SA", name:"Saudi Arabia", dial:"+966", flag:"🇸🇦", exams:[
    {id:"qiyas",title:"Qiyas",emoji:"📝",color:"#1CB0F6"},{id:"tahsili",title:"Tahsili",emoji:"📚",color:"#DC2626"},
  ]},
  { code:"TR", name:"Turkey", dial:"+90", flag:"🇹🇷", exams:[
    {id:"yks",title:"YKS",emoji:"📝",color:"#DC2626"},{id:"school_tr",title:"School Exams",emoji:"📚",color:"#1CB0F6"},
  ]},
  { code:"MX", name:"Mexico", dial:"+52", flag:"🇲🇽", exams:[
    {id:"unam",title:"UNAM Exam",emoji:"📝",color:"#DC2626"},{id:"school_mx",title:"School Exams",emoji:"📚",color:"#58CC02"},
  ]},
  { code:"AR", name:"Argentina", dial:"+54", flag:"🇦🇷", exams:[
    {id:"school_ar",title:"School Exams",emoji:"📚",color:"#1CB0F6"},{id:"university_ar",title:"University Entry",emoji:"🎓",color:"#DC2626"},
  ]},
  { code:"RU", name:"Russia", dial:"+7", flag:"🇷🇺", exams:[
    {id:"ege",title:"EGE",emoji:"📝",color:"#DC2626"},{id:"school_ru",title:"School Exams",emoji:"📚",color:"#1CB0F6"},
  ]},
  { code:"ES", name:"Spain", dial:"+34", flag:"🇪🇸", exams:[
    {id:"ebau",title:"EBAU (Selectividad)",emoji:"📝",color:"#1CB0F6"},{id:"school_es",title:"School Exams",emoji:"📚",color:"#58CC02"},
  ]},
  { code:"IT", name:"Italy", dial:"+39", flag:"🇮🇹", exams:[
    {id:"maturita",title:"Maturità",emoji:"📚",color:"#1CB0F6"},{id:"school_it",title:"School Exams",emoji:"🎓",color:"#58CC02"},
  ]},
  { code:"NL", name:"Netherlands", dial:"+31", flag:"🇳🇱", exams:[
    {id:"school_nl",title:"School Exams",emoji:"📚",color:"#1CB0F6"},{id:"university_nl",title:"University Entry",emoji:"🎓",color:"#CE82FF"},
  ]},
  { code:"KE", name:"Kenya", dial:"+254", flag:"🇰🇪", exams:[
    {id:"kcse",title:"KCSE",emoji:"📚",color:"#1CB0F6"},{id:"school_ke",title:"School Exams",emoji:"🎓",color:"#58CC02"},
  ]},
  { code:"GH", name:"Ghana", dial:"+233", flag:"🇬🇭", exams:[
    {id:"wassce",title:"WASSCE",emoji:"📚",color:"#1CB0F6"},{id:"school_gh",title:"School Exams",emoji:"🎓",color:"#58CC02"},
  ]},
  { code:"LK", name:"Sri Lanka", dial:"+94", flag:"🇱🇰", exams:[
    {id:"alevel_lk",title:"GCE A-Levels",emoji:"📖",color:"#CE82FF"},{id:"olevel_lk",title:"GCE O-Levels",emoji:"📚",color:"#1CB0F6"},
  ]},
  { code:"NP", name:"Nepal", dial:"+977", flag:"🇳🇵", exams:[
    {id:"see",title:"SEE",emoji:"📚",color:"#1CB0F6"},{id:"school_np",title:"School Exams",emoji:"🎓",color:"#58CC02"},
  ]},
  // Default fallback for all other countries
  { code:"XX", name:"Other Country", dial:"+000", flag:"🌍", exams:[
    {id:"school_xx",title:"School Exams",emoji:"📚",color:"#1CB0F6"},{id:"university_xx",title:"University Entry",emoji:"🎓",color:"#58CC02"},
    {id:"consistency_xx",title:"Build Consistency",emoji:"🔥",color:"#FF7A00"},
  ]},
];

export function getCountry(code: string): Country {
  return COUNTRIES.find(c => c.code === code) || COUNTRIES.find(c => c.code === "XX")!;
}

export function searchCountries(query: string): Country[] {
  const q = query.toLowerCase();
  return COUNTRIES.filter(c =>
    c.name.toLowerCase().includes(q) ||
    c.code.toLowerCase().includes(q) ||
    c.dial.includes(q)
  );
}
