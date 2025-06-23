interface People {
  name: string;
  pfp: string;
  role?: string;
}

export const REGIONS = [
  'Global',
  'India',
  'Vietnam',
  'Germany',
  'Turkey',
  'Mexico',
  'United Kingdom',
  'UAE',
  'Nigeria',
  'Israel',
  'Brazil',
  'Malaysia',
  'Balkan',
  'Philippines',
  'Japan',
  'France',
  'Canada',
  'Singapore',
  'Poland',
  'South Korea',
  'Ireland',
  'Ukraine',
  'Argentina',
  'USA',
  'Spain',
] as const;

export type Region = (typeof REGIONS)[number];

export interface Superteam {
  name: string;
  icons: string;
  banner: string;
  region: Region;
  displayValue: string;
  country: string[];
  code: string;
  hello: string;
  nationality: string;
  people?: People[];
  slug: string;
}

export const Superteams = [
  {
    name: 'Superteam India',
    region: 'India' as Region,
    displayValue: 'India',
    country: ['India'],
    code: 'IN',
    hello: 'Namaste',
    nationality: 'Indians',
    people: [
      {
        name: 'Aditya Shetty',
        pfp: 'https://pbs.twimg.com/profile_images/1779139453409222656/ueIqRcnn_400x400.jpg',
      },
      {
        name: 'Shek',
        pfp: 'https://pbs.twimg.com/profile_images/1803645845352378368/DifayeJH_400x400.jpg',
      },
    ],
    slug: 'india',
  },
  {
    name: 'Superteam Germany',
    region: 'Germany' as Region,
    displayValue: 'Germany',
    country: ['Germany'],
    code: 'DE',
    hello: 'Hallo',
    nationality: 'Germans',
    people: [
      {
        name: 'Carlo',
        pfp: 'https://pbs.twimg.com/profile_images/1697301254819516416/kNuQeyH7_400x400.jpg',
      },
      {
        name: 'Patti',
        pfp: 'https://pbs.twimg.com/profile_images/1801333126272008192/Yvn8CtqM_400x400.jpg',
      },
    ],
    slug: 'germany',
  },
  {
    name: 'Superteam UK',
    region: 'United Kingdom' as Region,
    displayValue: 'UK',
    country: ['United Kingdom'],
    code: 'GB',
    hello: 'Hello',
    nationality: 'the British',
    people: [
      {
        name: 'Cap',
        pfp: 'https://pbs.twimg.com/profile_images/1809162104521261056/6dg1nUeM_400x400.jpg',
      },
    ],
    slug: 'uk',
  },
  {
    name: 'Superteam Turkey',
    region: 'Turkey' as Region,
    displayValue: 'Turkey',
    country: ['Turkey'],
    code: 'TR',
    hello: 'Merhaba',
    nationality: 'Turks',
    people: [
      {
        name: 'Ezgi Yaltay',
        pfp: 'https://pbs.twimg.com/profile_images/1573011788769247234/zOaAXiv6_400x400.jpg',
      },
    ],
    slug: 'turkey',
  },
  {
    name: 'Superteam Vietnam',
    region: 'Vietnam' as Region,
    displayValue: 'Vietnam',
    country: ['Vietnam'],
    code: 'VN',
    hello: 'Xin chào',
    nationality: 'Vietnamese',
    people: [
      {
        name: 'Kelly Anh',
        pfp: 'https://pbs.twimg.com/profile_images/1686209291303497728/T-Tft6D6_400x400.jpg',
      },
      {
        name: 'Anh Tran',
        pfp: 'https://pbs.twimg.com/profile_images/1672120350266785792/a0AjrF8B_400x400.jpg',
      },
      {
        name: 'Minh Thach',
        pfp: 'https://pbs.twimg.com/profile_images/926374044030484480/it1e5gQr_400x400.jpg',
      },
    ],
    slug: 'vietnam',
  },
  {
    name: 'Superteam UAE',
    region: 'UAE' as Region,
    displayValue: 'UAE',
    country: ['United Arab Emirates'],
    code: 'AE',
    hello: 'Marhaba',
    nationality: 'Emiratis',
    people: [
      {
        name: 'Alex Scott',
        pfp: 'https://pbs.twimg.com/profile_images/1638831283416473600/UrbqFJ4s_400x400.jpg',
      },
    ],
    slug: 'uae',
  },
  {
    name: 'Superteam Nigeria',
    region: 'Nigeria' as Region,
    displayValue: 'Nigeria',
    country: ['Nigeria'],
    code: 'NG',
    hello: 'Hello',
    nationality: 'Nigerians',
    people: [
      {
        name: 'Nzube',
        pfp: 'https://pbs.twimg.com/profile_images/1849227147354714112/ryBAAooX_400x400.jpg',
      },
      {
        name: 'Harri',
        pfp: 'https://pbs.twimg.com/profile_images/1837323392959270913/PpGQRio3_400x400.jpg',
      },
    ],
    slug: 'nigeria',
  },
  {
    name: 'Superteam Brazil',
    region: 'Brazil' as Region,
    displayValue: 'Brazil',
    country: ['Brazil'],
    code: 'BR',
    hello: 'Olá',
    nationality: 'Brazilians',
    people: [
      {
        name: 'Diego Dias',
        pfp: 'https://res.cloudinary.com/dgvnuwspr/image/upload/diego-dias.jpg',
      },
    ],
    slug: 'brazil',
  },
  {
    name: 'Superteam Malaysia',
    region: 'Malaysia' as Region,
    displayValue: 'Malaysia',
    country: ['Malaysia'],
    code: 'MY',
    hello: 'Salaam',
    nationality: 'Malaysians',
    people: [
      {
        name: 'Henry',
        pfp: 'https://pbs.twimg.com/profile_images/1475080610100047874/GB_awKP9_400x400.jpg',
      },
    ],
    slug: 'malaysia',
  },
  {
    name: 'Superteam Balkan',
    region: 'Balkan' as Region,
    displayValue: 'Balkan',
    country: [
      'Albania',
      'Bosnia and Herzegovina',
      'Bulgaria',
      'Croatia',
      'Kosovo',
      'Montenegro',
      'North Macedonia',
      'Romania',
      'Serbia',
      'Slovenia',
      'Greece',
    ],
    code: 'BALKAN',
    hello: 'Pozdrav',
    nationality: 'Balkans',
    people: [
      {
        name: 'Primordial',
        pfp: 'https://pbs.twimg.com/profile_images/1722590250076123137/2XQPr92C_400x400.jpg',
      },
      {
        name: 'Matija',
        pfp: 'https://pbs.twimg.com/profile_images/1763670773091160064/y02448TX_400x400.jpg',
      },
    ],
    slug: 'balkan',
  },
  {
    name: 'Superteam Philippines',
    region: 'Philippines' as Region,
    displayValue: 'Philippines',
    country: ['Philippines'],
    code: 'PH',
    hello: 'Kumusta',
    nationality: 'Filipinos',
    people: [
      {
        name: 'Eli',
        pfp: 'https://pbs.twimg.com/profile_images/1839557525529927680/AxyDcqKr_400x400.jpg',
      },
      {
        name: 'Emerson',
        pfp: 'https://pbs.twimg.com/profile_images/1787894665624305667/FF6y0ucq_400x400.jpg',
      },
    ],
    slug: 'philippines',
  },
  {
    name: 'Superteam Japan',
    region: 'Japan' as Region,
    displayValue: 'Japan',
    country: ['Japan'],
    code: 'JP',
    hello: `Kon'nichiwa`,
    nationality: 'Japanese',
    people: [
      {
        name: 'Hisashi',
        pfp: 'https://pbs.twimg.com/profile_images/1855760707347972096/a0qO66Yb_400x400.png',
      },
    ],
    slug: 'japan',
  },
  {
    name: 'Superteam France',
    region: 'France' as Region,
    displayValue: 'France',
    country: ['France'],
    code: 'FR',
    hello: `Bonjour`,
    nationality: 'French',
    people: [
      {
        name: 'Arthur',
        pfp: 'https://pbs.twimg.com/profile_images/1504225711522996232/PeaEIwzk_400x400.jpg',
      },
    ],
    slug: 'france',
  },
  {
    name: 'Superteam Mexico',
    region: 'Mexico' as Region,
    displayValue: 'Mexico',
    country: ['Mexico'],
    code: 'MX',
    hello: `Hola`,
    nationality: 'Mexicans',
    slug: 'mexico',
  },
  {
    name: 'Superteam Canada',
    region: 'Canada' as Region,
    displayValue: 'Canada',
    country: ['Canada'],
    code: 'CA',
    hello: 'Hello',
    nationality: 'Canadians',
    people: [
      {
        name: 'Simon',
        pfp: 'https://pbs.twimg.com/profile_images/1702658848497016833/dGloS-Hw_400x400.jpg',
      },
    ],
    slug: 'canada',
  },
  {
    name: 'Superteam Singapore',
    region: 'Singapore' as Region,
    displayValue: 'Singapore',
    country: ['Singapore'],
    code: 'SG',
    hello: 'Hello',
    nationality: 'Singaporeans',
    people: [
      {
        name: 'Nick Tong',
        pfp: 'https://pbs.twimg.com/profile_images/859254261418303489/1VGdiak1_400x400.jpg',
      },
    ],
    slug: 'singapore',
  },
  {
    name: 'Superteam Poland',
    region: 'Poland' as Region,
    displayValue: 'Poland',
    country: ['Poland'],
    code: 'PL',
    hello: 'Cześć',
    nationality: 'Poles',
    slug: 'poland',
  },
  {
    name: 'Superteam Korea',
    region: 'South Korea' as Region,
    displayValue: 'South Korea',
    country: ['South Korea'],
    code: 'KR',
    hello: 'Annyeonghaseyo',
    nationality: 'Koreans',
    slug: 'korea',
  },
  {
    name: 'Superteam Ireland',
    region: 'Ireland' as Region,
    displayValue: 'Ireland',
    country: ['Ireland'],
    code: 'IE',
    hello: 'Dia duit',
    nationality: 'Irish',
    slug: 'ireland',
  },
];
