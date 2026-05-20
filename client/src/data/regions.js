// Countries with states/provinces — for onboarding and settings.
// Top diaspora countries first, then alphabetical.

export const COUNTRIES = [
  { code: 'CA', name: 'Canada', flag: '🇨🇦', states: [
    'Alberta', 'British Columbia', 'Manitoba', 'New Brunswick', 'Newfoundland and Labrador',
    'Nova Scotia', 'Ontario', 'Prince Edward Island', 'Quebec', 'Saskatchewan',
    'Northwest Territories', 'Nunavut', 'Yukon',
  ]},
  { code: 'US', name: 'United States', flag: '🇺🇸', states: [
    'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut',
    'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa',
    'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan',
    'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire',
    'New Jersey', 'New Mexico', 'New York', 'North Carolina', 'North Dakota', 'Ohio',
    'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota',
    'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia',
    'Wisconsin', 'Wyoming', 'District of Columbia',
  ]},
  { code: 'IN', name: 'India', flag: '🇮🇳', states: [
    'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Delhi',
    'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala',
    'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland',
    'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura',
    'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
    'Chandigarh', 'Jammu and Kashmir', 'Ladakh', 'Puducherry',
  ]},
  { code: 'GB', name: 'United Kingdom', flag: '🇬🇧', states: [
    'England', 'Scotland', 'Wales', 'Northern Ireland',
  ]},
  { code: 'AU', name: 'Australia', flag: '🇦🇺', states: [
    'New South Wales', 'Victoria', 'Queensland', 'Western Australia', 'South Australia',
    'Tasmania', 'Australian Capital Territory', 'Northern Territory',
  ]},
  { code: 'AE', name: 'UAE', flag: '🇦🇪', states: [
    'Abu Dhabi', 'Dubai', 'Sharjah', 'Ajman', 'Fujairah', 'Ras Al Khaimah', 'Umm Al Quwain',
  ]},
  { code: 'SG', name: 'Singapore', flag: '🇸🇬', states: [] },
  { code: 'NZ', name: 'New Zealand', flag: '🇳🇿', states: [
    'Auckland', 'Bay of Plenty', 'Canterbury', 'Hawke\'s Bay', 'Manawatu-Wanganui',
    'Northland', 'Otago', 'Southland', 'Taranaki', 'Waikato', 'Wellington',
  ]},
  { code: 'DE', name: 'Germany', flag: '🇩🇪', states: [
    'Baden-Württemberg', 'Bavaria', 'Berlin', 'Brandenburg', 'Bremen', 'Hamburg',
    'Hesse', 'Lower Saxony', 'Mecklenburg-Vorpommern', 'North Rhine-Westphalia',
    'Rhineland-Palatinate', 'Saarland', 'Saxony', 'Saxony-Anhalt', 'Schleswig-Holstein', 'Thuringia',
  ]},
  { code: 'FR', name: 'France', flag: '🇫🇷', states: [
    'Île-de-France', 'Provence-Alpes-Côte d\'Azur', 'Auvergne-Rhône-Alpes', 'Occitanie',
    'Nouvelle-Aquitaine', 'Hauts-de-France', 'Grand Est', 'Brittany', 'Normandy', 'Pays de la Loire',
  ]},
  { code: 'JP', name: 'Japan', flag: '🇯🇵', states: ['Tokyo', 'Osaka', 'Kyoto', 'Hokkaido', 'Okinawa', 'Fukuoka', 'Nagoya'] },
  { code: 'KR', name: 'South Korea', flag: '🇰🇷', states: ['Seoul', 'Busan', 'Incheon', 'Daegu', 'Jeju'] },
  { code: 'ZA', name: 'South Africa', flag: '🇿🇦', states: [
    'Eastern Cape', 'Free State', 'Gauteng', 'KwaZulu-Natal', 'Limpopo',
    'Mpumalanga', 'North West', 'Northern Cape', 'Western Cape',
  ]},
  { code: 'KE', name: 'Kenya', flag: '🇰🇪', states: ['Nairobi', 'Mombasa', 'Kisumu', 'Nakuru'] },
  { code: 'NG', name: 'Nigeria', flag: '🇳🇬', states: ['Lagos', 'Abuja', 'Kano', 'Rivers', 'Oyo'] },
  { code: 'PK', name: 'Pakistan', flag: '🇵🇰', states: ['Punjab', 'Sindh', 'Khyber Pakhtunkhwa', 'Balochistan', 'Islamabad'] },
  { code: 'BD', name: 'Bangladesh', flag: '🇧🇩', states: ['Dhaka', 'Chittagong', 'Rajshahi', 'Khulna', 'Sylhet'] },
  { code: 'LK', name: 'Sri Lanka', flag: '🇱🇰', states: ['Western', 'Central', 'Southern', 'Northern', 'Eastern'] },
  { code: 'MY', name: 'Malaysia', flag: '🇲🇾', states: ['Kuala Lumpur', 'Selangor', 'Johor', 'Penang', 'Sabah', 'Sarawak'] },
  { code: 'PH', name: 'Philippines', flag: '🇵🇭', states: ['Metro Manila', 'Cebu', 'Davao', 'Calabarzon', 'Central Luzon'] },
  { code: 'SA', name: 'Saudi Arabia', flag: '🇸🇦', states: ['Riyadh', 'Makkah', 'Madinah', 'Eastern Province', 'Asir'] },
  { code: 'QA', name: 'Qatar', flag: '🇶🇦', states: ['Doha', 'Al Wakrah', 'Al Khor'] },
  { code: 'KW', name: 'Kuwait', flag: '🇰🇼', states: ['Kuwait City', 'Hawalli', 'Ahmadi'] },
  { code: 'BH', name: 'Bahrain', flag: '🇧🇭', states: [] },
  { code: 'OM', name: 'Oman', flag: '🇴🇲', states: ['Muscat', 'Dhofar', 'Al Batinah'] },
  { code: 'IE', name: 'Ireland', flag: '🇮🇪', states: ['Dublin', 'Cork', 'Galway', 'Limerick'] },
  { code: 'NL', name: 'Netherlands', flag: '🇳🇱', states: ['North Holland', 'South Holland', 'Utrecht', 'North Brabant'] },
  { code: 'SE', name: 'Sweden', flag: '🇸🇪', states: ['Stockholm', 'Gothenburg', 'Malmö'] },
  { code: 'NO', name: 'Norway', flag: '🇳🇴', states: ['Oslo', 'Bergen', 'Trondheim'] },
  { code: 'DK', name: 'Denmark', flag: '🇩🇰', states: ['Copenhagen', 'Aarhus', 'Odense'] },
  { code: 'FI', name: 'Finland', flag: '🇫🇮', states: ['Helsinki', 'Tampere', 'Turku'] },
  { code: 'CH', name: 'Switzerland', flag: '🇨🇭', states: ['Zurich', 'Geneva', 'Basel', 'Bern'] },
  { code: 'IT', name: 'Italy', flag: '🇮🇹', states: ['Lombardy', 'Lazio', 'Campania', 'Sicily', 'Veneto', 'Tuscany'] },
  { code: 'ES', name: 'Spain', flag: '🇪🇸', states: ['Madrid', 'Catalonia', 'Andalusia', 'Valencia', 'Basque Country'] },
  { code: 'PT', name: 'Portugal', flag: '🇵🇹', states: ['Lisbon', 'Porto', 'Faro'] },
  { code: 'BR', name: 'Brazil', flag: '🇧🇷', states: ['São Paulo', 'Rio de Janeiro', 'Minas Gerais', 'Bahia', 'Paraná'] },
  { code: 'MX', name: 'Mexico', flag: '🇲🇽', states: ['Mexico City', 'Jalisco', 'Nuevo León', 'Puebla', 'Guanajuato'] },
  { code: 'TT', name: 'Trinidad & Tobago', flag: '🇹🇹', states: [] },
  { code: 'GY', name: 'Guyana', flag: '🇬🇾', states: [] },
  { code: 'FJ', name: 'Fiji', flag: '🇫🇯', states: [] },
  { code: 'MU', name: 'Mauritius', flag: '🇲🇺', states: [] },
];

// Get states for a country code
export function getStates(countryCode) {
  const country = COUNTRIES.find(c => c.code === countryCode);
  return country?.states || [];
}
