// Country aliases for fuzzy search: initialisms, alternative names, and common variations
// Organized by language: en (English), pl (Polish), es (Spanish)

export type CountryAliases = {
  [countryEnglishName: string]: {
    en?: string[];
    pl?: string[];
    es?: string[];
  };
};

export const countryAliases: CountryAliases = {
  // Major countries with well-known aliases
  "United States": {
    en: ["US", "USA", "America", "United States of America"],
    pl: ["USA", "Ameryka", "Stany"],
    es: ["EEUU", "EE.UU.", "EUA", "América", "Norteamérica"],
  },
  "United Kingdom": {
    en: ["UK", "Britain", "Great Britain", "GB", "England"],
    pl: ["UK", "Anglia", "Wielka Brytania", "Zjednoczone Królestwo"],
    es: ["UK", "GB", "Gran Bretaña", "Inglaterra", "RU"],
  },
  "South Africa": {
    en: ["RSA", "SA"],
    pl: ["RPA", "Afryka Południowa"],
    es: ["RSA", "Sudáfrica"],
  },
  "United Arab Emirates": {
    en: ["UAE", "Emirates"],
    pl: ["ZEA", "Emiraty"],
    es: ["EAU", "Emiratos"],
  },
  "South Korea": {
    en: ["Korea", "ROK"],
    pl: ["Korea"],
    es: ["Corea"],
  },
  "North Korea": {
    en: ["DPRK"],
    pl: ["KRLD"],
    es: ["RPDC"],
  },
  "Czech Republic": {
    en: ["Czechia"],
    pl: ["Czechy"],
    es: ["Chequia"],
  },
  "Netherlands": {
    en: ["Holland"],
    pl: ["Holandia", "Niderlandy"],
    es: ["Holanda"],
  },
  "Russia": {
    en: ["Russian Federation", "RF"],
    pl: ["FR", "Federacja Rosyjska"],
    es: ["FR", "Federación Rusa"],
  },
  "Germany": {
    en: ["DE", "Deutschland"],
    pl: ["RFN"],
    es: ["Alemania"],
  },
  "China": {
    en: ["PRC", "People's Republic of China"],
    pl: ["ChRL", "Chińska Republika Ludowa"],
    es: ["RPC", "República Popular China"],
  },
  "Taiwan": {
    en: ["ROC", "Republic of China"],
    pl: ["Republika Chińska"],
    es: ["República de China"],
  },
  "Democratic Republic of the Congo": {
    en: ["DRC", "DR Congo", "Congo-Kinshasa"],
    pl: ["DRK", "Kongo-Kinszasa"],
    es: ["RDC", "Congo-Kinsasa"],
  },
  "Republic of the Congo": {
    en: ["Congo-Brazzaville", "Congo"],
    pl: ["Kongo-Brazzaville", "Kongo"],
    es: ["Congo-Brazzaville", "Congo"],
  },
  "Central African Republic": {
    en: ["CAR"],
    pl: ["RŚA"],
    es: ["RCA"],
  },
  "North Macedonia": {
    en: ["Macedonia", "FYROM"],
    pl: ["Macedonia"],
    es: ["Macedonia"],
  },
  "Bosnia and Herzegovina": {
    en: ["Bosnia", "BiH"],
    pl: ["BiH", "Bośnia"],
    es: ["BiH", "Bosnia"],
  },
  "Papua New Guinea": {
    en: ["PNG"],
    pl: ["PNG"],
    es: ["PNG"],
  },
  "New Zealand": {
    en: ["NZ", "Aotearoa"],
    pl: ["NZ"],
    es: ["NZ", "Nueva Zelanda"],
  },
  "Vatican City": {
    en: ["Vatican", "Holy See"],
    pl: ["Stolica Apostolska"],
    es: ["Vaticano", "Santa Sede"],
  },
  "Timor-Leste": {
    en: ["East Timor"],
    pl: ["Timor Wschodni"],
    es: ["Timor Oriental"],
  },
  "Ivory Coast": {
    en: ["Côte d'Ivoire"],
    pl: ["Côte d'Ivoire", "WKS"],
    es: ["Côte d'Ivoire"],
  },
  "Eswatini": {
    en: ["Swaziland"],
    pl: ["Suazi"],
    es: ["Suazilandia"],
  },
  "Myanmar": {
    en: ["Burma"],
    pl: ["Birma"],
    es: ["Birmania"],
  },
  "Iran": {
    en: ["Persia"],
    pl: ["Persja"],
    es: ["Persia"],
  },
  "Saudi Arabia": {
    en: ["KSA", "Saudi"],
    pl: ["Arabia", "KSA"],
    es: ["KSA", "Arabia"],
  },
  "Trinidad and Tobago": {
    en: ["T&T", "Trinidad"],
    pl: ["Trynidad"],
    es: ["Trinidad"],
  },
  "Antigua and Barbuda": {
    en: ["Antigua"],
    pl: ["Antigua"],
    es: ["Antigua"],
  },
  "Saint Kitts and Nevis": {
    en: ["St. Kitts", "Saint Kitts"],
    pl: ["Saint Kitts"],
    es: ["San Cristóbal"],
  },
  "Saint Vincent and the Grenadines": {
    en: ["St. Vincent", "Saint Vincent"],
    pl: ["Saint Vincent"],
    es: ["San Vicente"],
  },
  "Saint Lucia": {
    en: ["St. Lucia"],
    pl: ["Saint Lucia"],
    es: ["Santa Lucía"],
  },
  "São Tomé and Príncipe": {
    en: ["Sao Tome"],
    pl: ["Wyspy Świętego Tomasza"],
    es: ["Santo Tomé"],
  },
  "Cape Verde": {
    en: ["Cabo Verde"],
    pl: ["Wyspy Zielonego Przylądka"],
    es: ["Cabo Verde"],
  },
  "Solomon Islands": {
    en: ["Solomons"],
    pl: ["Salomony"],
    es: ["Salomón"],
  },
  "Marshall Islands": {
    en: ["Marshalls"],
    pl: ["Wyspy Marshalla"],
    es: ["Islas Marshall"],
  },
  "Micronesia": {
    en: ["FSM", "Federated States of Micronesia"],
    pl: ["FSM"],
    es: ["FSM", "Estados Federados de Micronesia"],
  },
  "France": {
    en: ["FR"],
    pl: ["FR"],
    es: ["FR"],
  },
  "Spain": {
    en: ["ES", "España"],
    pl: ["ES"],
    es: ["ES"],
  },
  "Italy": {
    en: ["IT", "Italia"],
    pl: ["IT"],
    es: ["IT"],
  },
  "Brazil": {
    en: ["BR", "Brasil"],
    pl: ["BR"],
    es: ["BR"],
  },
  "Argentina": {
    en: ["AR"],
    pl: ["AR"],
    es: ["AR"],
  },
  "Australia": {
    en: ["AU", "AUS", "Oz"],
    pl: ["AU"],
    es: ["AU"],
  },
  "Canada": {
    en: ["CA", "CAN"],
    pl: ["CA"],
    es: ["CA"],
  },
  "Japan": {
    en: ["JP", "JPN", "Nippon"],
    pl: ["JP"],
    es: ["JP", "Japón"],
  },
  "India": {
    en: ["IN", "IND", "Bharat"],
    pl: ["IN"],
    es: ["IN"],
  },
  "Mexico": {
    en: ["MX", "MEX"],
    pl: ["MX"],
    es: ["MX"],
  },
  "Poland": {
    en: ["PL", "POL"],
    pl: ["PL", "RP", "Rzeczpospolita"],
    es: ["PL"],
  },
  "Switzerland": {
    en: ["CH", "Swiss"],
    pl: ["CH", "Szwajcaria", "Konfederacja Szwajcarska"],
    es: ["CH", "Suiza"],
  },
  "Austria": {
    en: ["AT", "AUT"],
    pl: ["AT"],
    es: ["AT"],
  },
  "Belgium": {
    en: ["BE", "BEL"],
    pl: ["BE"],
    es: ["BE"],
  },
  "Portugal": {
    en: ["PT", "POR"],
    pl: ["PT"],
    es: ["PT"],
  },
  "Greece": {
    en: ["GR", "Hellas"],
    pl: ["GR", "Hellada"],
    es: ["GR", "Hélade"],
  },
  "Egypt": {
    en: ["EG", "EGY"],
    pl: ["EG"],
    es: ["EG"],
  },
};

// Get all aliases for a country in a specific language
export function getCountryAliases(
  countryEnglishName: string,
  lang: 'en' | 'pl' | 'es'
): string[] {
  return countryAliases[countryEnglishName]?.[lang] ?? [];
}

// Get all aliases for a country across all languages
export function getAllCountryAliases(countryEnglishName: string): string[] {
  const aliases = countryAliases[countryEnglishName];
  if (!aliases) return [];
  return [
    ...(aliases.en ?? []),
    ...(aliases.pl ?? []),
    ...(aliases.es ?? []),
  ];
}
