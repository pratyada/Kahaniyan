// Team Objectives & Goals — 14 Pilot outreach plan with task creation + status tracking
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import PageTransition from '../components/PageTransition.jsx';
import { useAuth } from '../hooks/useAuth.jsx';
import { useAdmin } from '../hooks/useAdmin.jsx';

const PILOTS = [
  {
    id: 'schools', icon: '🏫', title: 'Pilot 1: Schools',
    objective: 'Get My Sleepy Tale shared in parent newsletters and classroom quiet time',
    targets: [
      { name: 'TDSB Schools', area: 'Toronto', actions: ['Email school offices', 'Post in TDSB Parents Network FB group', 'Share QR flyer for parent newsletter'] },
      { name: 'Peel DSB Schools', area: 'Brampton/Mississauga', actions: ['Email Castlebridge PS, Springdale PS, Credit Valley PS', 'Post in Peel Schools Parents Community FB group'] },
      { name: 'York Region DSB', area: 'Markham/Richmond Hill', actions: ['Email Unionville PS, Bayview Glen PS', 'Post in York Region Parents Forum'] },
      { name: 'Durham DSB', area: 'Oshawa/Whitby', actions: ['Email Glen Dhu PS, Whitby Shores PS'] },
      { name: 'Thorncliffe Park PS', area: 'East York (TDSB)', actions: ['Email thorncliffeparkps@tdsb.on.ca', 'Large South Asian community — share in parent council'] },
      { name: 'Grenoble PS', area: 'Scarborough (TDSB)', actions: ['Email grenoble@tdsb.on.ca', 'Post in Scarborough Parents Network FB group'] },
      { name: 'Milliken Mills PS', area: 'Scarborough (TDSB)', actions: ['Email millikenmillsps@tdsb.on.ca', 'High multicultural enrollment'] },
      { name: 'Fraser Mustard Early Learning Academy', area: 'Scarborough (TDSB)', actions: ['Email frasermustard@tdsb.on.ca', 'Focus on early years — perfect fit'] },
      { name: 'Pauline Johnson PS', area: 'Brampton (Peel DSB)', actions: ['Email paulinejohnsonps@peelschools.org', 'Post in Brampton Parents Hub FB group'] },
      { name: 'Fletchers Creek Sr PS', area: 'Brampton (Peel DSB)', actions: ['Email fletcherscreek@peelschools.org', 'Share at parent council meeting'] },
      { name: 'Meadowvale Village PS', area: 'Mississauga (Peel DSB)', actions: ['Email meadowvalevillageps@peelschools.org', 'Post in Mississauga Moms FB group'] },
      { name: 'Tomken Road MS', area: 'Mississauga (Peel DSB)', actions: ['Email tomkenroad@peelschools.org'] },
      { name: 'Wismer PS', area: 'Markham (York Region DSB)', actions: ['Email wismer.ps@yrdsb.ca', 'Post in Markham Parents Connect FB group'] },
      { name: 'Silver Stream PS', area: 'Richmond Hill (York Region DSB)', actions: ['Email silverstream.ps@yrdsb.ca', 'Post in Richmond Hill Families FB group'] },
      { name: 'Crosby Heights PS', area: 'Richmond Hill (York Region DSB)', actions: ['Email crosbyheights.ps@yrdsb.ca'] },
      { name: 'Maple Creek PS', area: 'Vaughan (York Region DSB)', actions: ['Email maplecreek.ps@yrdsb.ca', 'Post in Vaughan Parents Forum FB group'] },
      { name: 'Nottingham PS', area: 'Ajax (Durham DSB)', actions: ['Email nottingham@ddsb.ca', 'Post in Ajax/Pickering Parents FB group'] },
      { name: 'Bayview Heights PS', area: 'Pickering (Durham DSB)', actions: ['Email bayviewheights@ddsb.ca'] },
      { name: 'W.H. Morden PS', area: 'Oakville (Halton DSB)', actions: ['Email whmorden@hdsb.ca', 'Post in Halton Parents Community FB group'] },
      { name: 'Joshua Creek PS', area: 'Oakville (Halton DSB)', actions: ['Email joshuacreek@hdsb.ca'] },
      { name: 'Gary Allan PS', area: 'Burlington (Halton DSB)', actions: ['Email garyallan@hdsb.ca', 'Post in Burlington Families FB group'] },
    ],
    postTemplate: 'Any parents here using audio stories for bedtime? We found a free one that has FIFA World Cup stories + stories from 20+ cultures. Our kindergartener loves it. No screen needed. mysleepytale.com',
    emailTemplate: 'Subject: Free educational bedtime stories for your school families — FIFA World Cup + 20+ cultures\n\nDear [School Name] Team,\n\nI am Deepti Ramaul, a Toronto parent and co-founder of My Sleepy Tale — a free audio bedtime story platform for children aged 2-10. We cover 20+ cultural traditions reflecting the diversity of GTA families.\n\nWith FIFA World Cup 2026 in Toronto, we launched a special series teaching kids about the tournament. Available in English, Spanish, French, Hindi.\n\nWe would love to share a free QR code flyer for your parent newsletter. No cost, no sign up required.\n\nmysleepytale.com\n\nWarm regards,\nDeepti Ramaul',
  },
  {
    id: 'daycares', icon: '👶', title: 'Pilot 2: Kindergartens & Daycares',
    objective: 'Partner as a "quiet time" resource — free QR code flyers for nap/rest time',
    targets: [
      { name: 'Kids & Company', area: 'Multiple GTA', actions: ['Email info@kidsandcompany.com', 'Propose quiet-time partnership'] },
      { name: 'Lullaboo Nursery', area: 'Mississauga/Brampton', actions: ['Email info@lullaboo.ca'] },
      { name: 'BrightPath Kids', area: 'Multiple', actions: ['Email info@brightpathkids.com'] },
      { name: 'YMCA Child Care', area: 'GTA-wide', actions: ['Email childcare@ymcagta.org'] },
      { name: 'Creemore Academy Montessori', area: 'Mississauga', actions: ['Email info@creemoreacademy.com', 'Montessori — pitch as quiet-time enrichment'] },
      { name: 'Rowntree Montessori Schools', area: 'Brampton', actions: ['Email info@rowntreemontessori.com', 'Multiple locations across Brampton'] },
      { name: 'Kinderville Academy', area: 'Brampton', actions: ['Email info@kindervilleacademy.com'] },
      { name: 'Peekaboo Child Care', area: 'Mississauga/Brampton', actions: ['Email info@peekaboochildcare.ca', '10+ locations'] },
      { name: 'Little Scholars Montessori', area: 'Scarborough', actions: ['Email info@littlescholars.ca'] },
      { name: 'ABC Academy', area: 'Markham', actions: ['Email info@abcacademymarkham.ca', 'Large South Asian enrollment'] },
      { name: 'Tiny Hoppers', area: 'Multiple GTA', actions: ['Email info@tinyhoppers.ca', '20+ franchise locations across GTA'] },
      { name: 'Safari Kid', area: 'Mississauga/Brampton', actions: ['Email info@safarikid.ca', 'Multiple locations'] },
      { name: 'Wee Watch Private Home Day Care', area: 'GTA-wide', actions: ['Email info@weewatch.com', 'Network of licensed home daycares'] },
      { name: 'Le Petit Chapeau Montessori', area: 'Richmond Hill', actions: ['Email info@lepetitchapeau.ca'] },
    ],
    postTemplate: 'Our daycare started playing audio bedtime stories during nap time — the kids actually settle faster. It\'s free and has stories from Hindu, Islamic, Sikh, Christian traditions. Any other daycares doing this? mysleepytale.com',
    emailTemplate: 'Subject: Free audio stories for nap/quiet time — 200+ multicultural stories\n\nDear [Daycare Name],\n\nWe built a free audio story platform for children aged 2-10. Many daycares use it during quiet/rest time — children settle faster with audio stories than with screens.\n\n200+ stories across Hindu, Islamic, Sikh, Christian, Filipino, Indigenous traditions. Plus a FIFA World Cup 2026 series.\n\nWe can provide free QR code flyers for your facility. No cost to you or families.\n\nmysleepytale.com',
  },
  {
    id: 'babysitters', icon: '🍼', title: 'Pilot 3: Babysitters & Nanny Groups',
    objective: 'Babysitters recommend it to families they work for',
    targets: [
      { name: 'CanadianNanny.ca', area: 'National', actions: ['Email partnerships@canadiannanny.ca'] },
      { name: 'Nannies on Call', area: 'GTA', actions: ['Email info@nanniesoncall.com'] },
      { name: 'Toronto Nannies & Babysitters FB', area: 'Toronto', actions: ['Post in group'] },
      { name: 'GTA Babysitting Network FB', area: 'GTA', actions: ['Post in group'] },
      { name: 'Care.com Canada', area: 'National', actions: ['Create caregiver profile mentioning mysleepytale.com', 'Post in Care.com community forums'] },
      { name: 'SOSgarde / SOSsitter', area: 'GTA', actions: ['Email info@sossitter.ca', 'Propose as recommended resource for sitters'] },
      { name: 'Nanny Lane', area: 'National', actions: ['Email hello@nannylane.com', 'Feature in nanny resource newsletter'] },
      { name: 'Mississauga/Brampton Nannies & Babysitters FB', area: 'Peel Region', actions: ['Post in group', 'Share bedtime tips post with mysleepytale.com link'] },
      { name: 'Markham/Richmond Hill Babysitters FB', area: 'York Region', actions: ['Post in group'] },
      { name: 'Filipino Nannies in Canada FB', area: 'National', actions: ['Post in group — highlight Filipino stories on platform'] },
      { name: 'South Asian Nannies & Caregivers GTA FB', area: 'GTA', actions: ['Post in group — highlight Hindi, Urdu, Punjabi stories'] },
      { name: 'Au Pair Canada', area: 'National', actions: ['Email info@aupaircanada.ca', 'Pitch as bedtime resource for au pairs'] },
    ],
    postTemplate: 'Fellow babysitters — I started using this free audio story platform at bedtime and the kids ask for it every time now. No screen, just tap play. Stories in multiple languages too. Game changer for bedtime. mysleepytale.com',
    emailTemplate: '',
  },
  {
    id: 'camps', icon: '⛺', title: 'Pilot 4: Summer Camps & Kids Programs',
    objective: '"Wind-down" audio for rest periods at camp',
    targets: [
      { name: 'Camp Robin Hood', area: 'Toronto', actions: ['Email info@camprobinhood.ca'] },
      { name: 'Sportball', area: 'GTA-wide', actions: ['Email info@sportball.ca'] },
      { name: 'Toronto Parks & Rec Camps', area: 'Toronto', actions: ['Email parks@toronto.ca'] },
      { name: 'Pedalheads', area: 'GTA', actions: ['Email info@pedalheads.com'] },
      { name: 'City of Mississauga Day Camps', area: 'Mississauga', actions: ['Email recreation@mississauga.ca', 'Contact community centres running camps'] },
      { name: 'City of Brampton Day Camps', area: 'Brampton', actions: ['Email recreation@brampton.ca'] },
      { name: 'City of Markham Day Camps', area: 'Markham', actions: ['Email recreation@markham.ca'] },
      { name: 'Camp Arowhon', area: 'Algonquin (GTA families)', actions: ['Email info@camparowhon.com', 'Many GTA families attend'] },
      { name: 'Tim Hortons Foundation Camps', area: 'National', actions: ['Email info@timscamps.com', 'Pitch for rest-time programming'] },
      { name: 'YMCA Summer Day Camps', area: 'GTA-wide', actions: ['Email daycamp@ymcagta.org', 'Multiple locations across GTA'] },
      { name: 'Appleby College Summer Programs', area: 'Oakville', actions: ['Email summerprograms@appleby.on.ca'] },
      { name: 'Royal Ontario Museum Day Camp', area: 'Toronto', actions: ['Email programs@rom.on.ca', 'Cultural stories tie-in with museum themes'] },
      { name: 'Harbourfront Centre Camps', area: 'Toronto', actions: ['Email camps@harbourfrontcentre.com', 'Arts + culture focus'] },
      { name: 'Camp Kodiak', area: 'GTA families', actions: ['Email info@campkodiak.com'] },
      { name: 'Seneca College Kids Camps', area: 'North York', actions: ['Email kidscamps@senecacollege.ca'] },
      { name: 'Toronto Zoo Camp', area: 'Scarborough', actions: ['Email camp@torontozoo.ca', 'Pitch audio stories for bus rides and rest time'] },
    ],
    postTemplate: 'Camp counselors — anyone using audio stories for quiet/rest time? We found a free platform with 200+ stories from different cultures. The FIFA World Cup series is a hit with the kids right now. mysleepytale.com',
    emailTemplate: 'Subject: Free audio stories for camp rest time — FIFA World Cup + 200+ multicultural stories\n\nDear [Camp Name],\n\nLooking for screen-free wind-down content for rest periods? My Sleepy Tale is a free audio bedtime story platform with 200+ stories from 20+ cultures. Perfect for quiet time at camp.\n\nWe just launched a FIFA World Cup 2026 series — kids love it.\n\nNo cost. No sign up. Just tap play.\n\nmysleepytale.com',
  },
  {
    id: 'community', icon: '🏛️', title: 'Pilot 5: Community Centers & Libraries',
    objective: 'Feature in community programming, library story time, bulletin boards',
    targets: [
      { name: 'Toronto Public Library', area: 'Toronto', actions: ['Email programming@tpl.ca', 'Propose digital story time partnership', '100 branches — target Thorncliffe, Malvern, Agincourt branches'] },
      { name: 'Mississauga Library System', area: 'Mississauga', actions: ['Email library@mississauga.ca', '18 branches — target Meadowvale, Malton, Central branches'] },
      { name: 'Brampton Library', area: 'Brampton', actions: ['Email info@bramlib.on.ca', 'Target Gore Meadows, Chinguacousy, Cyril Clark branches'] },
      { name: 'Markham Public Library', area: 'Markham', actions: ['Email info@markham.library.on.ca', 'Target Milliken Mills, Aaniin branches'] },
      { name: 'Richmond Hill Public Library', area: 'Richmond Hill', actions: ['Email info@rhpl.ca', 'Target Central and Oak Ridges branches'] },
      { name: 'Vaughan Public Libraries', area: 'Vaughan', actions: ['Email info@vaughanpl.info', 'Target Civic Centre and Bathurst Clark branches'] },
      { name: 'Oshawa Public Libraries', area: 'Oshawa', actions: ['Email info@oshawalibrary.on.ca'] },
      { name: 'Ajax Public Library', area: 'Ajax', actions: ['Email info@ajaxlibrary.ca'] },
      { name: 'Pickering Public Library', area: 'Pickering', actions: ['Email info@pickeringlibrary.ca'] },
      { name: 'Whitby Public Library', area: 'Whitby', actions: ['Email info@whitbylibrary.on.ca'] },
      { name: 'Oakville Public Library', area: 'Oakville', actions: ['Email info@opl.on.ca'] },
      { name: 'Burlington Public Library', area: 'Burlington', actions: ['Email info@bpl.on.ca'] },
      { name: 'Harbourfront Centre', area: 'Downtown Toronto', actions: ['Email info@harbourfrontcentre.com', 'Propose story time event'] },
      { name: 'Gore Meadows CC', area: 'Brampton', actions: ['Email goremeadows@brampton.ca', 'Post flyer on bulletin board'] },
      { name: 'Malton Community Centre', area: 'Mississauga', actions: ['Email maltoncc@mississauga.ca', 'High South Asian population'] },
      { name: 'Aga Khan Museum', area: 'North York', actions: ['Email info@agakhanmuseum.org', 'Pitch Islamic story content tie-in'] },
      { name: 'Scarborough Civic Centre', area: 'Scarborough', actions: ['Email scc@toronto.ca', 'Post flyers in community board'] },
      { name: 'South Asian Community Centre (SACC)', area: 'Brampton', actions: ['Email info@saccbrampton.ca', 'Perfect cultural fit'] },
      { name: 'Muslim Community Centre of Mississauga', area: 'Mississauga', actions: ['Email info@mccofmississauga.com', 'Share Islamic stories collection'] },
      { name: 'Sikh Heritage Centre', area: 'Mississauga', actions: ['Email info@sikhheritage.ca', 'Share Sikh stories collection'] },
    ],
    postTemplate: 'Just discovered a free bedtime stories platform made by Toronto parents — 200+ audio stories from Hindu, Sikh, Islamic, Christian, Filipino, Indigenous traditions. Perfect for our diverse community. Plus FIFA World Cup stories for kids! mysleepytale.com',
    emailTemplate: 'Subject: Free multicultural bedtime stories for community families\n\nDear [Center/Library Name],\n\nMy Sleepy Tale is a free audio bedtime story platform built by Toronto parents. 200+ stories across 20+ cultural traditions, reflecting the diversity of our community.\n\nWe would love to be featured on your community bulletin board or shared in your programming newsletter.\n\nmysleepytale.com',
  },
  {
    id: 'influencers', icon: '📱', title: 'Pilot 6: Parenting Influencers',
    objective: 'Get organic mentions from trusted parent voices',
    targets: [
      { name: '@torontomom (IG)', area: 'Toronto', actions: ['DM on Instagram', 'Offer free trial for kids'] },
      { name: '@canadianmomlife (IG)', area: 'Canada', actions: ['DM on Instagram'] },
      { name: '@browngirlmagazine (IG)', area: 'National', actions: ['Email partnerships@browngirlmagazine.com'] },
      { name: 'Local mom bloggers', area: 'GTA', actions: ['Find via #TorontoMom hashtag', 'DM top 10'] },
      { name: '@dikisolmaz (IG/TikTok)', area: 'Toronto', actions: ['DM on Instagram', 'Multicultural parenting content creator'] },
      { name: '@momteachstyle (IG)', area: 'GTA', actions: ['DM on Instagram', 'Education-focused parenting content'] },
      { name: '@thatmomhustle (IG)', area: 'Brampton', actions: ['DM on Instagram', 'South Asian mom influencer'] },
      { name: '@hijabi.mommy (IG)', area: 'GTA', actions: ['DM on Instagram', 'Muslim parenting — highlight Islamic stories'] },
      { name: '@sincerelymaryam (IG/YT)', area: 'Toronto', actions: ['DM on Instagram', 'Email for collab', 'Muslim mom lifestyle creator'] },
      { name: '@thesisterhoodclub (IG)', area: 'Canada', actions: ['DM on Instagram', 'South Asian women community'] },
      { name: '@canadiandesi (IG)', area: 'GTA', actions: ['DM on Instagram', 'South Asian Canadian lifestyle'] },
      { name: '@toddlermomlife.ca (TikTok)', area: 'GTA', actions: ['DM on TikTok', 'Bedtime routine content'] },
      { name: '@thebrowndaughter (IG)', area: 'Toronto', actions: ['DM on Instagram', 'Desi parenting and identity content'] },
      { name: '@mamabearreviews (YT)', area: 'Ontario', actions: ['Email for product review', 'YouTube family channel'] },
      { name: '@the.desi.mommy (IG/TikTok)', area: 'Mississauga', actions: ['DM on Instagram', 'South Asian parenting tips'] },
      { name: '@brownbabyreads (IG)', area: 'Toronto', actions: ['DM on Instagram', 'Diverse children book recommendations'] },
    ],
    postTemplate: '',
    emailTemplate: 'Hi! I\'m Deepti, a Toronto mom and co-founder of My Sleepy Tale — free bedtime audio stories from 20+ cultures. We just launched a FIFA World Cup series. Would you try it with your kids and share if you like it? No strings, just a parent sharing with a parent. mysleepytale.com',
  },
  {
    id: 'government', icon: '🏛️', title: 'Pilot 7: Government & Elected Officials',
    objective: 'Get endorsement, share in constituency newsletters',
    targets: [
      { name: 'Mayor Olivia Chow', area: 'Toronto', actions: ['Email mayor_chow@toronto.ca'] },
      { name: 'Prabmeet Sarkaria MPP', area: 'Brampton South', actions: ['Email prabmeet.sarkaria@pc.ola.org'] },
      { name: 'Ruby Sahota MP', area: 'Brampton North', actions: ['Email ruby.sahota@parl.gc.ca'] },
      { name: 'Ausma Malik Councillor', area: 'Ward 10 Spadina-Fort York', actions: ['Email councillor_malik@toronto.ca'] },
      { name: 'Amarjot Sandhu MPP', area: 'Brampton West', actions: ['Email amarjot.sandhu@pc.ola.org', 'Large Sikh/South Asian riding'] },
      { name: 'Kamal Khera MP', area: 'Brampton West', actions: ['Email kamal.khera@parl.gc.ca', 'Minister — high visibility'] },
      { name: 'Iqra Khalid MP', area: 'Mississauga-Erin Mills', actions: ['Email iqra.khalid@parl.gc.ca', 'Diverse riding'] },
      { name: 'Sonia Sidhu MP', area: 'Brampton South', actions: ['Email sonia.sidhu@parl.gc.ca'] },
      { name: 'Salma Zahid MP', area: 'Scarborough Centre', actions: ['Email salma.zahid@parl.gc.ca', 'Large South Asian/Muslim community'] },
      { name: 'Gary Anandasangaree MP', area: 'Scarborough-Rouge Park', actions: ['Email gary.anand@parl.gc.ca', 'Tamil/South Asian community'] },
      { name: 'Shaun Chen MP', area: 'Scarborough North', actions: ['Email shaun.chen@parl.gc.ca', 'Diverse riding'] },
      { name: 'Logan Kanapathi MPP', area: 'Markham-Thornhill', actions: ['Email logan.kanapathi@pc.ola.org', 'South Asian community'] },
      { name: 'Billy Pang MPP', area: 'Markham-Unionville', actions: ['Email billy.pang@pc.ola.org'] },
      { name: 'Councillor Nick Mantas', area: 'Ward 22 Scarborough-Agincourt', actions: ['Email councillor_mantas@toronto.ca', 'Diverse ward'] },
      { name: 'Councillor Parthi Kandavel', area: 'Ward 20 Scarborough-Southwest', actions: ['Email councillor_kandavel@toronto.ca', 'Tamil/South Asian community'] },
      { name: 'Mayor Patrick Brown', area: 'Brampton', actions: ['Email mayor@brampton.ca', 'Canada most diverse city'] },
    ],
    postTemplate: '',
    emailTemplate: 'Subject: Free educational resource for families in your riding — FIFA World Cup + multicultural bedtime stories\n\nDear [Name],\n\nI am Deepti Ramaul, a parent in Toronto and co-founder of My Sleepy Tale — a free platform of audio bedtime stories for children aged 2-10. We cover 20+ cultural traditions reflecting our community\'s diversity.\n\nWith FIFA 2026 in Toronto, we launched a series teaching kids about the tournament. Available in English, Spanish, French, Hindi.\n\nWe would be honoured if you could share this with families in your riding.\n\nmysleepytale.com',
  },
  {
    id: 'islamic', icon: '☪️', title: 'Pilot 8: Islamic Community Outreach',
    objective: 'Partner with mosques, Islamic schools, Muslim organizations to promote 75 Islamic bedtime stories',
    targets: [
      { name: 'Muslim Endorsement Council (MEC) Canada', area: 'National', actions: ['Email info@meccanada.ca', 'Request endorsement for Islamic story collection', 'Propose joint Ramadan campaign'] },
      { name: 'Islamic Society of North America (ISNA) Canada', area: 'Mississauga', actions: ['Email info@isnacanada.com', 'Present at annual convention', 'Feature in ISNA newsletter'] },
      { name: 'Muslim Association of Canada (MAC)', area: 'GTA-wide', actions: ['Email info@macnet.ca', 'Partner with MAC youth programs', 'Share in MAC community newsletter'] },
      { name: 'ISNA Islamic Schools', area: 'Mississauga', actions: ['Email school@isnacanada.com', 'Pitch as after-school/quiet-time resource', 'Provide QR flyers for parent folders'] },
      { name: 'Khalil Centre', area: 'GTA', actions: ['Email info@khalilcenter.com', 'Muslim mental health org — pitch calming bedtime stories', 'Propose sleep hygiene partnership'] },
      { name: 'Islamic Foundation of Toronto', area: 'Scarborough', actions: ['Email info@islamicfoundation.ca', 'Share at Friday prayers', 'Post flyers on community board'] },
      { name: 'Masjid Toronto', area: 'Downtown Toronto', actions: ['Email info@masjidtoronto.com', 'Request announcement after Jummah prayer', 'Share QR code flyers'] },
      { name: 'Islamic Institute of Toronto', area: 'Scarborough', actions: ['Email info@iit.ca', 'Partner with weekend Islamic school', 'Feature in mosque newsletter'] },
      { name: 'Dar Al-Tawheed Islamic Centre', area: 'Mississauga', actions: ['Email info@daraltewheed.com', 'Large Mississauga congregation'] },
      { name: 'Jami Mosque Brampton', area: 'Brampton', actions: ['Email info@jamibrampton.ca', 'Share at Friday prayers', 'Partner with youth group'] },
      { name: 'Muslim Moms Toronto FB Group', area: 'Toronto', actions: ['Post soft-sell in group', 'Share bedtime routine tip with link', 'Engage in comments before posting'] },
      { name: 'Muslim Moms Canada FB Group', area: 'National', actions: ['Post in group', 'Share Ramadan stories angle'] },
      { name: 'Islamic Heritage Month Events', area: 'GTA', actions: ['Set up table at events in October', 'Share QR flyers', 'Partner with event organizers'] },
      { name: 'Muslim Parent Influencers', area: 'GTA/National', actions: ['DM @hijabi.mommy on IG', 'DM @sincerelymaryam on IG', 'Reach out to Muslim family YouTubers'] },
      { name: 'Al Huda Institute Canada', area: 'Mississauga', actions: ['Email info@alhudainstitute.ca', 'Large women/family-focused Islamic education org'] },
    ],
    postTemplate: 'Muslim parents — have you found bedtime stories that actually teach our kids about Islam? We discovered My Sleepy Tale — they have 75 Islamic stories. Prophet stories (peace be upon him), Quran values, Ramadan adventures, Hajj journey, Islamic manners. All told with reverence. No images of God or any Prophet. Free, no sign up. Our kids ask for "the Ramadan one" every night now. mysleepytale.com',
    emailTemplate: 'Subject: 75 free Islamic bedtime stories for Muslim families — Prophet stories, Quran values, Ramadan adventures\n\nAssalamu Alaikum,\n\nI am Deepti Ramaul, co-founder of My Sleepy Tale — a free audio bedtime story platform for children aged 2-10.\n\nWe have 75 Islamic stories on our platform, including:\n- Prophet stories (peace be upon him) told with reverence and care\n- Quran values and lessons for young children\n- Ramadan adventures and the joy of fasting\n- Hajj journey series\n- Islamic manners and daily duas\n\nAll stories are told with deep respect. No images of God or any Prophet are used anywhere on our platform.\n\nWe would love to share this resource with your community. We can provide free QR code flyers for your mosque, school, or community centre.\n\nmysleepytale.com\n\nJazakAllah Khair,\nDeepti Ramaul',
    followUp: 'Week 1: Send introductory email → Week 2: Follow up email with specific story links → Week 3: Visit mosque/centre in person, attend Friday prayers → Week 4: Propose Ramadan partnership or ongoing feature in newsletter',
  },
  {
    id: 'latino', icon: '🇲🇽', title: 'Pilot 9: Latino/Hispanic Community',
    objective: 'Reach Spanish-speaking families with 25+ Hispanic stories + Spanish language support',
    targets: [
      { name: 'Hispanic Canadian Heritage Council', area: 'Toronto', actions: ['Email info@hispanicheritage.ca', 'Partner for Hispanic Heritage Month (Oct)', 'Feature in newsletter'] },
      { name: 'Centre for Spanish Speaking Peoples', area: 'Toronto', actions: ['Email info@cssp.ca', 'Post flyers in community centre', 'Share at family programs'] },
      { name: 'Latin American Community Centre', area: 'Toronto', actions: ['Email info@lacc.ca', 'Propose story time event', 'Share in parent programs'] },
      { name: 'Mexican Consulate Toronto', area: 'Toronto', actions: ['Email consulmex.toronto@sre.gob.mx', 'Request feature in community resources', 'Partner for Dia de los Ninos events'] },
      { name: 'Colombian Consulate Toronto', area: 'Toronto', actions: ['Email toronto@cancilleria.gov.co', 'Share with Colombian families network'] },
      { name: 'Ecuadorian Community Association', area: 'Toronto', actions: ['Email info@ecuadoriantoronto.ca', 'Share at community events'] },
      { name: 'Peruvian Canadian Association', area: 'Toronto', actions: ['Email info@peruviancanadianto.ca', 'Share at cultural celebrations'] },
      { name: 'Hispanic Business Alliance', area: 'GTA', actions: ['Email info@hispanicbusiness.ca', 'Propose family-focused partnership', 'Feature in member newsletter'] },
      { name: 'Latinos en Toronto FB Group', area: 'Toronto', actions: ['Post in Spanish and English', 'Share bedtime routine tips with link'] },
      { name: 'Mamas Latinas en Canada FB Group', area: 'National', actions: ['Post in group', 'Share in Spanish — highlight bilingual stories'] },
      { name: 'Familias Hispanas GTA FB Group', area: 'GTA', actions: ['Post in group', 'Engage before posting'] },
      { name: 'St. Jamestown Community Corner', area: 'Toronto', actions: ['Email info@stjamestown.org', 'Large Latin American population', 'Post flyers'] },
      { name: 'Hispanic Heritage Month Events', area: 'GTA', actions: ['Set up table at October events', 'Share QR flyers in Spanish', 'Partner with event organizers'] },
      { name: 'Spanish-language media (Correo Canadiense)', area: 'Toronto', actions: ['Email editor@correocandiense.com', 'Pitch story about platform for Hispanic families'] },
    ],
    postTemplate: 'Padres hispanos en Toronto — encontramos historias de dormir gratuitas en espanol para nuestros ninos. Cuentos de nuestra cultura, disponibles en espanol e ingles. Sin pantalla, solo audio. Nuestros hijos las piden cada noche. mysleepytale.com\n\n(Hispanic parents in Toronto — we found free bedtime stories in Spanish for our kids. Stories from our culture, available in Spanish and English. No screen, just audio. Our kids ask for them every night. mysleepytale.com)',
    emailTemplate: 'Subject: Free bilingual bedtime stories for Hispanic families — cuentos de dormir gratuitos\n\nHola,\n\nI am Deepti Ramaul, co-founder of My Sleepy Tale — a free audio bedtime story platform for children aged 2-10.\n\nWe have 25+ stories celebrating Hispanic and Latin American culture, available in both Spanish and English:\n- Traditional Latin American folktales\n- Stories about family, community, and cultural pride\n- Bilingual audio — perfect for families maintaining Spanish at home\n- Also available in French, Hindi, and other languages\n\nWe would love to share this with your community. Free QR code flyers available in Spanish.\n\nmysleepytale.com\n\nGracias,\nDeepti Ramaul',
    followUp: 'Week 1: Send bilingual email → Week 2: Follow up with specific Spanish story links → Week 3: Attend community event or visit centre → Week 4: Propose Hispanic Heritage Month partnership',
  },
  {
    id: 'catholic', icon: '✝️', title: 'Pilot 10: Catholic/Christian Community',
    objective: 'Promote Catholic and Christian bedtime stories — Jesus parables, Bible stories, Christian values',
    targets: [
      { name: 'Toronto Catholic District School Board (TCDSB)', area: 'Toronto', actions: ['Email communications@tcdsb.org', 'Pitch as faith-based bedtime resource', 'Provide QR flyers for parent newsletters'] },
      { name: 'Dufferin-Peel Catholic DSB', area: 'Brampton/Mississauga', actions: ['Email info@dpcdsb.org', 'Largest Catholic board in Ontario', 'Email individual school principals'] },
      { name: 'York Catholic District School Board', area: 'York Region', actions: ['Email info@ycdsb.ca', 'Target schools in Markham, Richmond Hill, Vaughan'] },
      { name: 'Halton Catholic District School Board', area: 'Halton Region', actions: ['Email info@hcdsb.org', 'Target Oakville, Burlington, Milton schools'] },
      { name: 'St. Michael\'s Cathedral Parish', area: 'Downtown Toronto', actions: ['Email office@stmichaelscathedral.com', 'Request feature in parish bulletin', 'Share at family mass'] },
      { name: 'Our Lady of Lourdes Parish', area: 'Toronto', actions: ['Email info@ourladyoflourdes.ca', 'Share in Sunday bulletin'] },
      { name: 'Catholic parent groups (GTA)', area: 'GTA', actions: ['Post in Catholic Moms Toronto FB group', 'Post in Catholic Families GTA FB group'] },
      { name: 'Christian mom bloggers', area: 'GTA/National', actions: ['DM @christianmomlife on IG', 'Reach out to faith-based parenting bloggers', 'Offer platform review'] },
      { name: 'VBS (Vacation Bible School) Programs', area: 'GTA', actions: ['Email churches running summer VBS', 'Pitch as take-home bedtime resource', 'Provide QR flyers for VBS families'] },
      { name: 'Sunday School Programs', area: 'GTA', actions: ['Contact Sunday school directors at major parishes', 'Pitch as supplement to Sunday school learning', 'Share Bible story collection'] },
      { name: 'Catholic Women\'s League', area: 'GTA', actions: ['Email toronto@cwl.ca', 'Present at local CWL meeting', 'Feature in CWL newsletter'] },
      { name: 'Archdiocese of Toronto', area: 'Toronto', actions: ['Email info@archtoronto.org', 'Request feature in archdiocesan newsletter', 'Propose partnership for family ministry'] },
      { name: 'Emmanuel Community Church', area: 'Mississauga', actions: ['Email info@emmanuelcc.ca', 'Large family congregation'] },
      { name: 'The Meeting House', area: 'Multiple GTA', actions: ['Email info@themeetinghouse.com', 'Multi-site church — wide reach'] },
    ],
    postTemplate: 'Christian parents — we found a free bedtime story platform with beautiful Bible stories for kids. Jesus parables, stories of faith, Christian values — all told in a gentle, age-appropriate way. No screen needed, just audio. Our kids love the Good Samaritan story. Free, no sign up. mysleepytale.com',
    emailTemplate: 'Subject: Free Christian bedtime stories for families — Bible stories, Jesus parables, Christian values\n\nDear [Church/School Name],\n\nI am Deepti Ramaul, co-founder of My Sleepy Tale — a free audio bedtime story platform for children aged 2-10.\n\nWe have a beautiful collection of Christian stories including:\n- Jesus parables told for young children\n- Bible stories with age-appropriate lessons\n- Stories about Christian values — kindness, forgiveness, generosity\n- Saints and faith heroes\n\nAll stories are told with reverence and care, perfect for bedtime or quiet time.\n\nWe would love to share this with your parish, school, or community. Free QR code flyers available.\n\nmysleepytale.com\n\nGod bless,\nDeepti Ramaul',
    followUp: 'Week 1: Send email to school boards and parishes → Week 2: Follow up with specific story links → Week 3: Attend Sunday mass and connect in person → Week 4: Propose VBS summer partnership or ongoing parish bulletin feature',
  },
  {
    id: 'hindu', icon: '🕉️', title: 'Pilot 11: Hindu Community',
    objective: 'Promote 40+ Hindu stories — Krishna, Ramayana, Diwali, Ganesh, Panchatantra',
    targets: [
      { name: 'BAPS Shri Swaminarayan Mandir', area: 'Etobicoke', actions: ['Email info@baps.org', 'Largest Hindu temple in Canada', 'Share at family programs', 'Partner for Diwali celebrations'] },
      { name: 'Vishnu Mandir', area: 'Richmond Hill', actions: ['Email info@vishnumandir.com', 'Post flyers in community area', 'Share at Sunday programs'] },
      { name: 'Hindu Sabha Brampton', area: 'Brampton', actions: ['Email info@hindusabha.com', 'Large Brampton Hindu community', 'Partner for Navratri/Diwali events'] },
      { name: 'Ram Mandir Toronto', area: 'Mississauga', actions: ['Email info@rammandirtoronto.ca', 'Share Ramayana story collection', 'Post flyers'] },
      { name: 'Hindu Heritage Month Events', area: 'GTA', actions: ['Set up table at November events', 'Share QR flyers', 'Partner with Hindu Heritage Foundation'] },
      { name: 'Hindu Heritage Foundation', area: 'National', actions: ['Email info@hinduheritage.ca', 'Propose educational partnership', 'Feature in newsletter'] },
      { name: 'Indian cultural associations (IACF)', area: 'GTA', actions: ['Email info@iacf.ca', 'Indian Arts & Culture Foundation', 'Share at cultural events'] },
      { name: 'Desi parent groups Toronto FB', area: 'Toronto', actions: ['Post in group', 'Highlight Krishna, Ramayana, Panchatantra stories', 'Share bedtime tips'] },
      { name: 'South Asian Moms Toronto FB', area: 'Toronto', actions: ['Post in group', 'Share Diwali stories angle'] },
      { name: 'Indian grocery stores (bulletin boards)', area: 'GTA', actions: ['Post flyers at Oceans, FreshCo Desi sections', 'Chalo FreshCo Brampton/Mississauga', 'BJ Supermarket Scarborough'] },
      { name: 'Bollywood/Desi influencers', area: 'GTA/National', actions: ['DM @the.desi.mommy on IG', 'DM @brownbabyreads on IG', 'Reach out to Desi family YouTubers'] },
      { name: 'Diwali celebrations (city events)', area: 'GTA', actions: ['Mississauga Diwali Gala', 'Brampton Diwali Festival', 'Toronto Diwali at Nathan Phillips Square'] },
      { name: 'Navratri/Garba events', area: 'GTA', actions: ['Share flyers at major Garba nights', 'Partner with Garba event organizers'] },
      { name: 'Arya Samaj Toronto', area: 'Toronto', actions: ['Email info@aryasamajtoronto.ca', 'Share at Sunday programs'] },
    ],
    postTemplate: 'Desi parents — looking for bedtime stories from our culture? My Sleepy Tale has 40+ Hindu stories. Krishna stories, Ramayana adventures, Ganesh tales, Panchatantra fables, Diwali specials. All audio, no screen. Our kids love the Krishna and butter story. Free, no sign up. mysleepytale.com',
    emailTemplate: 'Subject: 40+ free Hindu bedtime stories for families — Krishna, Ramayana, Diwali, Panchatantra\n\nNamaste,\n\nI am Deepti Ramaul, co-founder of My Sleepy Tale — a free audio bedtime story platform for children aged 2-10.\n\nWe have 40+ Hindu stories on our platform, including:\n- Krishna stories — childhood adventures, butter thief, Govardhan\n- Ramayana tales told for young children\n- Ganesh stories and the meaning behind festivals\n- Panchatantra fables with timeless wisdom\n- Diwali, Holi, and Navratri specials\n\nAll stories are told with deep cultural respect, celebrating Hindu values of dharma, kindness, and devotion.\n\nWe would love to share this with your temple community. Free QR code flyers available.\n\nmysleepytale.com\n\nWarm regards,\nDeepti Ramaul',
    followUp: 'Week 1: Send email to temples and cultural organizations → Week 2: Follow up with specific story links (Krishna, Ramayana) → Week 3: Visit temple and share flyers at Sunday program → Week 4: Propose Diwali/Navratri partnership',
  },
  {
    id: 'sikh', icon: '🙏', title: 'Pilot 12: Sikh Community',
    objective: 'Promote 43 Sikh stories — Guru stories, Khalsa, Vaisakhi, Sikh values',
    targets: [
      { name: 'Ontario Khalsa Darbar', area: 'Mississauga', actions: ['Email info@ontariokhalsa.com', 'Largest Gurdwara in GTA', 'Share at Sunday diwan', 'Post flyers in community hall'] },
      { name: 'Dixie Gurdwara (Gurdwara Sikh Sangat)', area: 'Mississauga', actions: ['Email info@dixiegurdwara.ca', 'Share during langar', 'Post on community board'] },
      { name: 'Malton Gurdwara', area: 'Mississauga', actions: ['Email info@maltongurdwara.ca', 'Large Malton Sikh community', 'Share at youth programs'] },
      { name: 'Gurdwara Dasmesh Darbar', area: 'Brampton', actions: ['Email info@dasmeshdarbar.ca', 'Major Brampton Gurdwara', 'Share flyers during langar'] },
      { name: 'Sikh Heritage Month Events', area: 'GTA', actions: ['Set up table at April events', 'Share QR flyers', 'Partner with Sikh Heritage Foundation'] },
      { name: 'World Sikh Organization (WSO)', area: 'National', actions: ['Email info@worldsikh.org', 'Propose educational partnership', 'Feature in WSO newsletter'] },
      { name: 'Sikh Coalition Canada', area: 'National', actions: ['Email info@sikhcoalition.ca', 'Share as educational resource for Sikh children'] },
      { name: 'Khalsa Community School', area: 'Brampton', actions: ['Email info@khalsacommunityschool.com', 'Pitch as quiet-time and after-school resource', 'Provide QR flyers for parents'] },
      { name: 'Sikh parent groups GTA FB', area: 'GTA', actions: ['Post in group', 'Highlight Guru stories and Sikh values', 'Share Vaisakhi stories'] },
      { name: 'Punjabi Moms Canada FB Group', area: 'National', actions: ['Post in group', 'Share bedtime tips with platform link'] },
      { name: 'Sikh Youth Federation', area: 'GTA', actions: ['Email youth programs', 'Partner for youth education events', 'Share with Sikh student associations'] },
      { name: 'Vaisakhi celebrations (city events)', area: 'GTA', actions: ['Toronto Vaisakhi parade', 'Brampton Vaisakhi celebration', 'Share QR flyers along parade route'] },
      { name: 'Guru Nanak Dev Ji Birthday events', area: 'GTA', actions: ['Share at November celebrations', 'Partner with Gurdwara events'] },
      { name: 'Sikh Seniors Centre', area: 'Mississauga', actions: ['Email info@sikhseniors.ca', 'Grandparents sharing stories with grandchildren angle'] },
    ],
    postTemplate: 'Sikh parents — we found bedtime stories that teach our kids about Sikhi. 43 Sikh stories on My Sleepy Tale — Guru stories, Khalsa history, Vaisakhi, Sikh values of seva, equality, and courage. No images of Gurus\' faces — just beautiful symbols, gurdwaras, and light. All audio, no screen. Free, no sign up. mysleepytale.com',
    emailTemplate: 'Subject: 43 free Sikh bedtime stories for families — Guru stories, Khalsa, Vaisakhi, Sikh values\n\nSat Sri Akal,\n\nI am Deepti Ramaul, co-founder of My Sleepy Tale — a free audio bedtime story platform for children aged 2-10.\n\nWe have 43 Sikh stories on our platform, including:\n- Stories of the Sikh Gurus and their teachings\n- Khalsa history told for young children\n- Vaisakhi celebrations and their meaning\n- Sikh values — seva, equality, courage, compassion\n- Stories about the beauty of gurdwara, langar, and community\n\nAll stories are told with deep respect. No images of Gurus\' faces are used — we show symbols, gurdwaras, and light instead.\n\nWe would love to share this with your Gurdwara community. Free QR code flyers available.\n\nmysleepytale.com\n\nWaheguru Ji Ka Khalsa, Waheguru Ji Ki Fateh,\nDeepti Ramaul',
    followUp: 'Week 1: Send email to Gurdwaras and Sikh organizations → Week 2: Follow up with specific story links (Guru Nanak, Vaisakhi) → Week 3: Visit Gurdwara during Sunday diwan, share during langar → Week 4: Propose Vaisakhi or Guru Nanak birthday celebration partnership',
  },
  {
    id: 'blogs-pr', icon: '✍️', title: 'Pilot 13: Creative Blogs, PR & Product Listings',
    objective: 'Build backlinks, domain authority, and public visibility through guest blogs, PR articles, and product directory listings',
    targets: [
      // ── BLOGGING PLATFORMS ──
      { name: 'Medium — @mysleepytale', area: 'Global', actions: ['Create Medium publication "My Sleepy Tale"', 'Publish 2 articles/week: "Why Audio Beats Screens at Bedtime" + "FIFA World Cup 2026 — What Kids Should Know"', 'Cross-post from mysleepytale.com/blog with canonical links', 'Follow and engage with parenting/edtech writers on Medium'] },
      { name: 'Dev.to — Technical Blog', area: 'Developer community', actions: ['Publish "How We Built a Multilingual Bedtime Story Platform with React + AWS"', 'Publish "Real-Time Translation: OpenAI TTS + GPT-4o-mini for 9-Language Stories"', 'Share tech stack article — drives developer traffic + credibility'] },
      { name: 'Hashnode — EdTech Blog', area: 'Developer/startup', actions: ['Publish "Building a Screen-Free Kids Platform — Our Architecture"', 'Tag: #edtech #react #aws #startup'] },
      { name: 'Substack — Parenting Newsletter', area: 'Global', actions: ['Start "Bedtime Lab" newsletter', 'Weekly: parenting tips + new story announcements', 'Cross-promote with other parenting Substacks'] },
      { name: 'LinkedIn Articles', area: 'Professional', actions: ['Deepti: publish 15-post series (already planned)', 'Sahil: publish UX case study of My Sleepy Tale', 'Prat: publish technical architecture article', 'Tag #startup #edtech #parenting #toronto'] },
      { name: 'WordPress / Blogger Guest Posts', area: 'SEO backlinks', actions: ['Find 20 parenting blogs accepting guest posts', 'Pitch: "I Replaced Screen Time With Audio Stories — Here\'s What Happened"', 'Include dofollow link to mysleepytale.com', 'Target: mommy blogs, parenting sites, education blogs'] },

      // ── PR & MEDIA ──
      { name: 'Toronto Star — Community Section', area: 'Toronto', actions: ['Pitch: "Three Toronto Parents Build Free FIFA World Cup Audiobooks for Kids"', 'Email: city@thestar.ca', 'Angle: FIFA 2026 + local parents + multicultural'] },
      { name: 'BlogTO', area: 'Toronto', actions: ['Pitch: "This Free Toronto-Made Platform Has Bedtime Stories in 9 Languages"', 'Email: tips@blogto.com', 'They cover local tech + family content'] },
      { name: 'Daily Hive Toronto', area: 'Toronto', actions: ['Pitch: "Toronto Parents Launch Free Multilingual Bedtime Stories for FIFA 2026"', 'Email: tips@dailyhive.com'] },
      { name: 'Narcity Canada', area: 'National', actions: ['Pitch: "This Free Canadian App Has Bedtime Stories From 20+ Cultures"', 'Email: tips@narcity.com', 'Angle: multicultural Canada + screen-free'] },
      { name: 'CBC Parents / CBC Kids', area: 'National', actions: ['Pitch as segment: "Screen-Free Bedtime Solutions"', 'Email: cbcparents@cbc.ca'] },
      { name: 'Today\'s Parent Magazine', area: 'National', actions: ['Pitch: "The Best Screen-Free Bedtime Tools for 2026"', 'Email: editors@todaysparent.com', 'Product review / roundup inclusion'] },
      { name: 'Brampton Guardian / Mississauga News', area: 'Peel Region', actions: ['Pitch: "Brampton Parents Build Free Bedtime Story Platform for Diverse Families"', 'Email: newsroom@metroland.com'] },

      // ── PRODUCT DIRECTORIES & LISTINGS ──
      { name: 'Product Hunt', area: 'Global', actions: ['Prepare launch page: tagline, screenshots, maker story', 'Schedule launch on a Tuesday/Wednesday', 'Rally team + friends to upvote at 12:01 AM PT', 'Respond to every comment within 1 hour', 'Target: top 5 of the day'] },
      { name: 'There\'s An AI For That', area: 'AI directory', actions: ['Submit: mysleepytale.com', 'Category: Education / Kids / Audio', 'Description: AI-powered multilingual bedtime stories'] },
      { name: 'Futurepedia', area: 'AI directory', actions: ['Submit at futurepedia.io/submit', 'Category: Education, Content Creation'] },
      { name: 'AI Tools Directory', area: 'AI directory', actions: ['Submit at aitoolsdirectory.com', 'Highlight: real-time translation, TTS in 9 languages'] },
      { name: 'SaaSHub', area: 'SaaS directory', actions: ['List as alternative to Calm Kids / Moshi', 'Add comparison page link'] },
      { name: 'AlternativeTo', area: 'Product directory', actions: ['List as alternative to Moshi, Calm, Headspace Kids', 'Add screenshots + description'] },
      { name: 'BetaList', area: 'Startup directory', actions: ['Submit for early-stage listing', 'Great for initial user acquisition'] },
      { name: 'Indie Hackers', area: 'Startup community', actions: ['Create product page', 'Post milestone updates: "We hit 200+ stories in 20+ cultures"', 'Share revenue journey when Pro subscribers come in'] },
      { name: 'Hacker News — Show HN', area: 'Tech community', actions: ['Post: "Show HN: Free multilingual bedtime stories for kids — 9 languages, 200+ stories"', 'Best on weekday mornings EST', 'Respond to every comment'] },
      { name: 'Reddit — Multiple Subreddits', area: 'Global', actions: ['r/parenting: "We built a free bedtime story platform after struggling with screen time"', 'r/toronto: "Toronto parents — we made FIFA World Cup bedtime stories for kids"', 'r/SideProject: share the build story', 'r/edtech: share the technical approach', 'r/reactjs: share the tech stack', 'Follow each subreddit rules carefully — no spam'] },

      // ── GUEST BLOG PITCH TARGETS ──
      { name: 'Scary Mommy', area: 'US/Global', actions: ['Pitch: "I Replaced My Kid\'s iPad With Audio Stories — This Happened"', 'Email: submissions@scarymommy.com'] },
      { name: 'Motherly', area: 'US/Global', actions: ['Pitch: "Why Multicultural Bedtime Stories Build Stronger Kids"', 'Email: editors@mother.ly'] },
      { name: 'Fatherly', area: 'US/Global', actions: ['Pitch: "A Dad Built FIFA World Cup Bedtime Stories — His Kid Knows More Geography Than Most Adults"', 'Email: tips@fatherly.com'] },
      { name: 'Romper', area: 'US/Global', actions: ['Pitch: "Screen-Free Bedtime Routines That Actually Work in 2026"', 'Email: pitches@romper.com'] },
      { name: 'Macaroni Kid — Toronto', area: 'Toronto', actions: ['Email local editor', 'Pitch as free family resource', 'They feature local family activities/tools'] },
    ],
    postTemplate: 'We built a free bedtime story platform for kids — 200+ audio stories from 20+ cultures in 9 languages. No screen. No sign up. Just launched a FIFA World Cup 2026 series since Toronto is hosting. Built by three parents in Toronto. Would love your feedback. mysleepytale.com',
    emailTemplate: 'Subject: Guest post pitch — How audio bedtime stories are replacing screen time for multicultural families\n\nHi [Editor Name],\n\nI am Deepti Ramaul, a Toronto mom and co-founder of My Sleepy Tale — a free audio bedtime story platform with 200+ stories from 20+ cultural traditions.\n\nI would love to write a guest post for [Publication] on one of these topics:\n\n1. "Why Audio Beats Screens at Bedtime — What the Research Says"\n2. "One Bedtime Story in 9 Languages — How We Built a Multilingual Kids Platform"\n3. "FIFA World Cup 2026 for Kids — Learning Geography Through Bedtime Stories"\n4. "Screen-Free Bedtime Routines That Actually Work (From a Mom Who Tried Everything)"\n\nI can provide original content, quotes from our users, and research citations. Happy to tailor the angle to your audience.\n\nOur platform: mysleepytale.com\nMy LinkedIn: linkedin.com/in/deeptiramaul\n\nThank you for your time,\nDeepti Ramaul\nCo-Founder, My Sleepy Tale',
    followUp: 'Week 1: Submit to 5 product directories (Product Hunt, Futurepedia, BetaList, SaaSHub, AlternativeTo) → Week 2: Publish Medium + Dev.to articles, pitch 5 guest blogs → Week 3: Pitch 5 media outlets (Toronto Star, BlogTO, CBC, Today\'s Parent, Narcity) → Week 4: Post on Reddit (5 subreddits), Hacker News Show HN, Indie Hackers → Ongoing: 2 blog posts/week on Medium + LinkedIn',
  },
  {
    id: 'parent-communities', icon: '👨‍👩‍👧‍👦', title: 'Pilot 14: Parent Communities & Groups',
    objective: 'Post soft-sell stories in every major parenting community — Reddit, FB, Discord, WhatsApp',
    targets: [
      // ── REDDIT ──
      { name: 'r/Parenting (5.3M)', area: 'Reddit', actions: ['Post: "We replaced iPad before bed with audio stories. Our 4yo falls asleep in 10 min now"', 'Link: mysleepytale.com', 'Flair: Advice — do NOT self-promote, share as personal experience', 'Engage with comments for 24hrs'] },
      { name: 'r/Mommit (1.2M)', area: 'Reddit', actions: ['Post: "Found a free bedtime story platform with stories from our culture — Hindu, Sikh, Islamic, Christian. My daughter loves it"', 'Comment on existing bedtime threads with link'] },
      { name: 'r/daddit (600K)', area: 'Reddit', actions: ['Post: "A dad built FIFA World Cup bedtime stories — my kid now knows more geography than me"', 'Angle: dad-built, for dads'] },
      { name: 'r/toddlers (300K)', area: 'Reddit', actions: ['Post: "Screen-free bedtime routine that actually works — audio stories"', 'Comment on sleep/bedtime threads'] },
      { name: 'r/toronto (500K)', area: 'Reddit', actions: ['Post: "Toronto parents — free FIFA World Cup audiobooks for kids since we\'re hosting"', 'Angle: local, timely, FIFA'] },
      { name: 'r/Brampton (80K)', area: 'Reddit', actions: ['Post: "Brampton parents — bedtime stories from 20+ cultures, free"', 'Mention Sikh, Islamic, Hindu stories specifically'] },
      { name: 'r/mississauga (60K)', area: 'Reddit', actions: ['Same approach as Brampton, mention local diversity'] },
      { name: 'r/ABCDesis (200K)', area: 'Reddit', actions: ['Post: "Found bedtime stories for desi kids — Krishna, Sikh Gurus, Panchatantra"', 'Huge South Asian diaspora audience'] },
      { name: 'r/islam (500K)', area: 'Reddit', actions: ['Post: "75 Islamic bedtime stories for kids — Prophet stories (pbuh), Quran values, Ramadan"', 'Be respectful, mention no images of Prophets'] },
      { name: 'r/Sikh (50K)', area: 'Reddit', actions: ['Post: "43 Sikh bedtime stories — Guru stories, Khalsa, no images of Gurus"'] },

      // ── FACEBOOK GROUPS (GTA) ──
      { name: 'Toronto Moms Group (50K+)', area: 'Facebook', actions: ['Join group', 'Post V5 (parent-to-parent variant)', 'Include: mysleepytale.com', 'Engage with 10+ comments'] },
      { name: 'Brampton Moms (30K+)', area: 'Facebook', actions: ['Post V2 (multicultural hook)', 'Mention Sikh, Islamic, Hindu stories'] },
      { name: 'Mississauga Moms & Families (25K+)', area: 'Facebook', actions: ['Post V1 (FIFA hook) — timely'] },
      { name: 'Scarborough Parents Network', area: 'Facebook', actions: ['Post V4 (multilingual) — diverse area'] },
      { name: 'Markham/Richmond Hill Parents', area: 'Facebook', actions: ['Post V2 (multicultural) — large Chinese + South Asian population'] },
      { name: 'Ajax/Pickering/Oshawa Moms', area: 'Facebook', actions: ['Post V3 (screen time hook)'] },
      { name: 'GTA Parents — Buy/Sell/Trade/Advice', area: 'Facebook', actions: ['Post V6 (FOMO) in advice thread'] },
      { name: 'South Asian Parents in Canada', area: 'Facebook', actions: ['Post V7 (mom blog review)', 'Mention Hindu, Sikh, Islamic stories specifically'] },
      { name: 'Muslim Moms Canada', area: 'Facebook', actions: ['Post about 75 Islamic stories', '"My neighbour showed me this — Prophet stories told beautifully for bedtime"'] },
      { name: 'Filipino Parents Toronto', area: 'Facebook', actions: ['Post about Filipino stories on platform', '"Finally found bedtime stories that include our culture"'] },
      { name: 'Chinese Canadian Parents', area: 'Facebook', actions: ['Post V4 (multilingual) — mention Chinese language option'] },
      { name: 'Newcomers to Canada — Families', area: 'Facebook', actions: ['Post: "Free bedtime stories in 9 languages — perfect for newcomer families"', 'Angle: language preservation + settling in'] },

      // ── WHATSAPP GROUPS ──
      { name: 'School parent WhatsApp groups', area: 'WhatsApp', actions: ['Share V9 (quick forward) in your child\'s school parent group', 'Ask friends to forward to their school groups', '"Hey moms — not an ad, just sharing something that worked for us"'] },
      { name: 'Community WhatsApp groups', area: 'WhatsApp', actions: ['Share in mosque/temple/gurdwara/church parent WhatsApps', 'Keep it personal: "My kids love this, try the [tradition] stories"'] },
      { name: 'Neighbourhood WhatsApp groups', area: 'WhatsApp', actions: ['Share in condo/street/neighbourhood parent chats', '"Toronto parents — free FIFA World Cup bedtime stories mysleepytale.com"'] },

      // ── DISCORD ──
      { name: 'Parenting Discord servers', area: 'Discord', actions: ['Search Discord for "parenting" servers', 'Join top 5, share in #resources or #recommendations channel', 'Be helpful first, share organically'] },

      // ── OTHER FORUMS ──
      { name: 'BabyCenter Canada', area: 'Forum', actions: ['Post in "Toddler" and "Preschooler" forums', '"Looking for screen-free bedtime ideas — found this free audio story platform"'] },
      { name: 'What to Expect — Community', area: 'Forum', actions: ['Post in age-specific groups', 'Angle: bedtime routine advice with link'] },
      { name: 'UrbanMoms.ca Forum', area: 'Canadian forum', actions: ['Post: "Any Toronto moms using audio bedtime stories?"', 'Active Canadian parenting community'] },
    ],
    postTemplate: '',
    emailTemplate: '',
    followUp: 'Day 1: Post in 5 Reddit subs (spread across day, different accounts look spammy) → Day 2-3: Post in 10 FB groups (2-3 per day, different variants) → Day 4: Forward in 5 WhatsApp groups → Day 5: Post in forums (BabyCenter, UrbanMoms) → Week 2: Engage with ALL comments/replies — this is where conversions happen → Week 3: Repost with new angles (FIFA update, new stories added) → Ongoing: 3 community posts per week, rotate variants',
  },
  {
    id: 'seo-indexing', icon: '🔍', title: 'Pilot 15: SEO & Google Indexing (URGENT)',
    objective: '50 pages discovered but NOT indexed by Google. Fix by building backlinks + social signals so Google trusts our domain enough to crawl.',
    targets: [
      // ── IMMEDIATE: Request Indexing (Admin) ──
      { name: 'Google Search Console — Request Indexing', area: 'Admin Task', actions: ['Go to search.google.com/search-console', 'URL Inspection → paste each blog URL → Request Indexing', 'Do top 15 most important pages first', 'Repeat daily for new pages'] },
      { name: 'Bing Webmaster Tools — Submit URLs', area: 'Admin Task', actions: ['Go to bing.com/webmasters', 'Submit sitemap: mysleepytale.com/sitemap.xml', 'Submit individual URLs for priority crawling'] },

      // ── BACKLINKS: Share blog links everywhere ──
      { name: 'Share FIFA blog on social media', area: 'Everyone', actions: ['Post mysleepytale.com/blog/fifa-world-cup-kids-audiobook on personal FB, IG, Twitter/X, LinkedIn', 'Each share = a signal to Google that the URL is real and valuable', 'Ask 5 friends to share too'] },
      { name: 'Share bedtime stories blog', area: 'Everyone', actions: ['Post mysleepytale.com/blog/why-bedtime-stories-matter on parenting FB groups', 'Post mysleepytale.com/blog/screen-free-bedtime-routines on mommy blogs'] },
      { name: 'Share Indian stories blog in desi groups', area: 'Everyone', actions: ['Post mysleepytale.com/blog/indian-bedtime-stories in South Asian FB groups, WhatsApp groups', 'Post mysleepytale.com/blog/islamic-stories-for-kids in Muslim parent groups'] },
      { name: 'LinkedIn articles with blog links', area: 'Deepti/Sahil/Prat', actions: ['Write LinkedIn post, link to blog', 'Every LinkedIn post with a link = a backlink signal to Google', 'Deepti: link to FIFA blog + screen-free blog', 'Sahil: link to technology-stack blog'] },
      { name: 'Medium cross-posts', area: 'Content Team', actions: ['Publish on Medium with canonical link to mysleepytale.com/blog/*', 'Medium articles pass link juice back to your site', 'Start with: why-bedtime-stories-matter, screen-free-bedtime-routines, fifa-world-cup-kids-audiobook'] },

      // ── SOCIAL SIGNALS: Every share counts ──
      { name: 'Twitter/X — Share 5 blog links daily', area: 'Everyone', actions: ['Tweet each blog link with a quote from the article', '#BedtimeStories #TorontoKids #FIFA2026 #ScreenFree', 'Google crawls Twitter — every tweet is a discovery signal'] },
      { name: 'Pinterest — Pin blog images', area: 'Marketing', actions: ['Create Pinterest account: My Sleepy Tale', 'Pin each blog hero image with link to blog URL', 'Pinterest pins get indexed by Google separately — double benefit'] },
      { name: 'Quora — Answer questions with blog links', area: 'Content Team', actions: ['Search Quora for: bedtime stories kids, screen time kids, FIFA kids', 'Answer questions, naturally link to relevant blog', 'Quora answers rank in Google — drives traffic + signals'] },

      // ── DIRECTORY LISTINGS (backlinks) ──
      { name: 'Submit to web directories', area: 'Marketing', actions: ['Submit mysleepytale.com to: DMOZ alternatives, Jasmine Directory, Best of the Web', 'Each directory listing = 1 backlink', 'Focus on education, kids, parenting categories'] },
      { name: 'Google Business Profile', area: 'Admin', actions: ['Create Google Business Profile for My Sleepy Tale', 'Category: Educational Software, Children Education', 'This signals to Google that you are a real business'] },

      // ── TECHNICAL: Help Google crawl faster ──
      { name: 'Internal linking from home page', area: 'Dev', actions: ['Add blog links in the home page footer', 'Link from About Us page to blogs', 'Every internal link helps Google discover pages'] },
      { name: 'Add blog links to email signatures', area: 'Everyone', actions: ['Add "Read our blog: mysleepytale.com/blog" to email signatures', 'Every email sent = potential click = Google Analytics signal'] },
    ],
    postTemplate: '',
    emailTemplate: '',
    followUp: 'Day 1: Request indexing for top 15 pages in GSC → Day 2: Share 10 blog links on social media (personal accounts) → Day 3: Post 3 blogs on Medium with canonical → Week 1: Submit to 5 directories → Week 2: Answer 10 Quora questions with links → Week 3: Check GSC — pages should start moving to "Indexed" → Ongoing: Every new blog posted → immediately share on 3 platforms + request indexing in GSC',
  },
];

const FB_VARIANTS = [
  { id: 'fifa', label: 'FIFA hook', text: '⚽ Toronto is hosting the World Cup and my kids are learning about it at bedtime. Free audio stories — no screen. mysleepytale.com' },
  { id: 'culture', label: 'Multicultural', text: 'Found a free bedtime story platform with Hindu, Sikh, Islamic, Christian stories — all audio. My kids pick a different culture every night. mysleepytale.com' },
  { id: 'screen', label: 'Screen time', text: 'We replaced screen time before bed with audio stories. Our 4-year-old falls asleep in 10 minutes now. Free. mysleepytale.com' },
  { id: 'language', label: 'Multilingual', text: 'My kids just listened to "The Lion and the Mouse" in Hindi, then French, then Arabic. Same story, 9 languages. Free. mysleepytale.com/demo/multilingual' },
  { id: 'parent', label: 'Parent-to-parent', text: 'Any parents struggling with bedtime? We\'ve been using audio stories and it changed everything. 200+ free stories from different cultures. mysleepytale.com' },
  { id: 'fomo', label: 'FOMO', text: 'Toronto parents — have you tried this yet? Free bedtime audiobooks for kids. FIFA series, multilingual stories, 20+ cultures. My whole parent group is using it now. mysleepytale.com' },
  { id: 'blog', label: 'Mom blog review', text: 'I\'ve been looking for bedtime alternatives to screen time. A friend shared mysleepytale.com and honestly I was skeptical. But it\'s not an app — it\'s just audio. Pick a story, tap play, phone face down. They have stories from OUR culture. My kids are Sikh and they actually have Sikh bedtime stories. 200+ stories. Free. No sign up. Try the lion and mouse one first 🦁🐭' },
];

const KPI_CARDS = [
  { icon: '🎯', label: 'Focus 1', value: 'Get Traffic', sub: 'Social, outreach, SEO, word of mouth' },
  { icon: '💰', label: 'Focus 2', value: 'Paid Subscribers', sub: 'Pro $9.99/mo — personalized audio' },
  { icon: '📊', label: 'KPI', value: 'Revenue + # Paid Users', sub: 'Track weekly in admin dashboard' },
];

export default function TeamObjectives() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { isAdmin } = useAdmin();
  const [expandedPilot, setExpandedPilot] = useState(null);
  const [copiedId, setCopiedId] = useState(null);
  const [tasks, setTasks] = useState([]);

  // Load all tasks from Firestore to track objective completion
  useEffect(() => {
    (async () => {
      try {
        const { db } = await import('../lib/firebase.js');
        if (!db) return;
        const { collection, getDocs } = await import('firebase/firestore');
        const snap = await getDocs(collection(db, 'dailyTasks'));
        const loaded = [];
        snap.forEach(d => loaded.push({ id: d.id, ...d.data() }));
        setTasks(loaded);
      } catch {}
    })();
  }, []);

  // Check task status for a pilot target
  const getTargetStatus = (pilotId, targetName) => {
    const key = `${pilotId}:${targetName}`;
    const match = tasks.find(t => t.pilotKey === key || (t.title && t.title.includes(targetName)));
    if (!match) return null; // no task created
    return match.status; // todo, in_progress, done, blocked
  };

  const statusColors = { done: '#48bb78', in_progress: '#f0a500', todo: '#6e6a63', blocked: '#f3727f' };
  const statusLabels = { done: '✓ Done', in_progress: '⏳ In Progress', todo: '📋 To Do', blocked: '🚫 Blocked' };

  const copyText = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Create task with pilot tracking
  const createTask = (pilot, target) => {
    const pilotKey = `${pilot.id}:${target.name}`;
    const title = `${pilot.title}: ${target.name} — ${target.actions[0]}`;
    navigate(`/my-tasks?newTask=${encodeURIComponent(title)}&pilotKey=${encodeURIComponent(pilotKey)}`);
  };

  return (
    <PageTransition className="page-scroll px-4 pt-6 pb-24 safe-top">
      <div className="max-w-3xl mx-auto space-y-6">

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="font-display text-2xl font-bold text-ink" style={{ fontFamily: 'Lora, serif' }}>Team Objectives & Goals</h1>
          <p className="text-sm text-ink-muted mt-2">Sharp laser focus. Every action = traffic or paid users.</p>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-3 gap-3">
          {KPI_CARDS.map(k => (
            <div key={k.label} className="rounded-2xl bg-bg-surface p-4 ring-1 ring-white/5 text-center">
              <div className="text-2xl mb-1">{k.icon}</div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-ink-muted">{k.label}</div>
              <div className="text-sm font-bold text-gold mt-1">{k.value}</div>
              <div className="text-[9px] text-ink-dim mt-1">{k.sub}</div>
            </div>
          ))}
        </div>

        {/* 7 Pilots */}
        <div>
          <h2 className="text-sm font-bold text-ink mb-3" style={{ fontFamily: 'Lora, serif' }}>15 Outreach Pilots</h2>
          <div className="space-y-2">
            {PILOTS.map(pilot => (
              <div key={pilot.id} className="rounded-2xl bg-bg-surface ring-1 ring-white/5 overflow-hidden">
                <button
                  onClick={() => setExpandedPilot(expandedPilot === pilot.id ? null : pilot.id)}
                  className="w-full flex items-center gap-3 p-4 text-left transition active:scale-[0.99]"
                >
                  <span className="text-2xl">{pilot.icon}</span>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-bold text-ink">{pilot.title}</div>
                    <div className="text-[11px] text-ink-muted truncate">{pilot.objective}</div>
                  </div>
                  <div className="text-xs text-ink-dim">
                    {(() => {
                      const done = pilot.targets.filter(t => getTargetStatus(pilot.id, t.name) === 'done').length;
                      return done > 0 ? <span><span style={{ color: '#48bb78' }}>{done}</span>/{pilot.targets.length}</span> : `${pilot.targets.length} targets`;
                    })()}
                  </div>
                  <span className="text-ink-dim text-xs">{expandedPilot === pilot.id ? '▲' : '▼'}</span>
                </button>

                {expandedPilot === pilot.id && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} className="px-4 pb-4 space-y-3">
                    {/* Targets */}
                    {pilot.targets.map((t, i) => {
                      const status = getTargetStatus(pilot.id, t.name);
                      const borderColor = status ? statusColors[status] : 'transparent';
                      return (
                        <div key={i} className="rounded-xl bg-bg-elevated p-3 ring-1 ring-white/5"
                          style={status ? { borderLeft: `3px solid ${borderColor}` } : {}}>
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs font-bold text-ink">{t.name}</span>
                            <div className="flex items-center gap-2">
                              {status && (
                                <span className="text-[8px] font-bold px-2 py-0.5 rounded-full"
                                  style={{ background: statusColors[status] + '22', color: statusColors[status] }}>
                                  {statusLabels[status]}
                                </span>
                              )}
                              <span className="text-[9px] text-ink-dim bg-white/5 px-2 py-0.5 rounded-full">{t.area}</span>
                            </div>
                          </div>
                          <ul className="space-y-1">
                            {t.actions.map((a, j) => (
                              <li key={j} className="text-[11px] text-ink-muted flex items-start gap-1.5">
                                <span className="text-gold mt-0.5">→</span> {a}
                              </li>
                            ))}
                          </ul>
                          {isAdmin && !status && (
                            <button
                              onClick={() => createTask(pilot, t)}
                              className="mt-2 text-[10px] font-bold text-gold bg-gold/10 px-3 py-1 rounded-full transition active:scale-95"
                            >
                              + Create Task
                            </button>
                          )}
                          {isAdmin && status && status !== 'done' && (
                            <button
                              onClick={() => createTask(pilot, t)}
                              className="mt-2 text-[10px] font-bold text-ink-muted bg-white/5 px-3 py-1 rounded-full transition active:scale-95"
                            >
                              View Task
                            </button>
                          )}
                        </div>
                      );
                    })}

                    {/* Email template */}
                    {pilot.emailTemplate && (
                      <div className="rounded-xl bg-bg-elevated p-3 ring-1 ring-white/5">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-ink-muted">📧 Email Template</span>
                          <button onClick={() => copyText(pilot.emailTemplate, `email-${pilot.id}`)}
                            className="text-[9px] font-bold text-gold bg-gold/10 px-2 py-0.5 rounded-full">
                            {copiedId === `email-${pilot.id}` ? '✓ Copied' : 'Copy'}
                          </button>
                        </div>
                        <pre className="text-[10px] text-ink-muted whitespace-pre-wrap leading-relaxed max-h-40 overflow-y-auto">{pilot.emailTemplate}</pre>
                      </div>
                    )}

                    {/* Follow-up cadence */}
                    {pilot.followUp && (
                      <div className="rounded-xl bg-bg-elevated p-3 ring-1 ring-white/5">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-ink-muted">📅 Follow-Up Cadence</span>
                          <button onClick={() => copyText(pilot.followUp, `followup-${pilot.id}`)}
                            className="text-[9px] font-bold text-gold bg-gold/10 px-2 py-0.5 rounded-full">
                            {copiedId === `followup-${pilot.id}` ? '✓ Copied' : 'Copy'}
                          </button>
                        </div>
                        <p className="text-[11px] text-ink-muted leading-relaxed">{pilot.followUp}</p>
                      </div>
                    )}

                    {/* FB post template */}
                    {pilot.postTemplate && (
                      <div className="rounded-xl bg-bg-elevated p-3 ring-1 ring-white/5">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-ink-muted">📘 FB Post Template</span>
                          <button onClick={() => copyText(pilot.postTemplate, `fb-${pilot.id}`)}
                            className="text-[9px] font-bold text-gold bg-gold/10 px-2 py-0.5 rounded-full">
                            {copiedId === `fb-${pilot.id}` ? '✓ Copied' : 'Copy'}
                          </button>
                        </div>
                        <p className="text-[11px] text-ink-muted leading-relaxed">{pilot.postTemplate}</p>
                      </div>
                    )}
                  </motion.div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* FB Post Variants */}
        <div>
          <h2 className="text-sm font-bold text-ink mb-3" style={{ fontFamily: 'Lora, serif' }}>Facebook Post Variants (Soft Sell)</h2>
          <div className="space-y-2">
            {FB_VARIANTS.map(v => (
              <div key={v.id} className="rounded-2xl bg-bg-surface p-4 ring-1 ring-white/5">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-gold">{v.label}</span>
                  <button onClick={() => copyText(v.text, v.id)}
                    className="text-[9px] font-bold text-gold bg-gold/10 px-2 py-0.5 rounded-full">
                    {copiedId === v.id ? '✓ Copied' : 'Copy'}
                  </button>
                </div>
                <p className="text-[11px] text-ink-muted leading-relaxed">{v.text}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Quick links */}
        <div className="grid grid-cols-2 gap-3 pt-4">
          <button onClick={() => navigate('/my-tasks')} className="rounded-2xl bg-gold/10 p-4 text-center ring-1 ring-gold/20 transition active:scale-95">
            <div className="text-xl mb-1">📋</div>
            <div className="text-xs font-bold text-gold">My Tasks</div>
          </button>
          <button onClick={() => navigate('/admin')} className="rounded-2xl bg-gold/10 p-4 text-center ring-1 ring-gold/20 transition active:scale-95">
            <div className="text-xl mb-1">📊</div>
            <div className="text-xs font-bold text-gold">Admin Dashboard</div>
          </button>
        </div>

      </div>
    </PageTransition>
  );
}
