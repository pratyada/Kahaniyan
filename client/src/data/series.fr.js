// Séries — arcs narratifs multi-épisodes avec personnages récurrents.
// Chaque épisode est autonome (arc complet) mais les personnages se retrouvent dans toute la série.

export const SERIES = [
  {
    id: 'fire-truck-academy', comingSoon: true,
    title: 'L\'Académie des pompiers',
    icon: '🚒',
    gradient: 'linear-gradient(135deg, #991b1b 0%, #ef4444 50%, #fca5a5 100%)',
    description: 'Moteur 7 entre à l\'académie des pompiers. 3 nuits de courage, d\'entraide et de bravoure.',
    ageRange: '4-7',
    totalEpisodes: 3,
    episodes: [
      {
        id: 'fta_ep1_afraid', episodeNumber: 1, title: 'Peur du feu',
        subtitle: 'Moteur 7 a un secret — il a peur du feu.',
        tradition: 'universal', theme: 'courage', durationMinutes: 5,
        source: 'L\'Académie des pompiers · Épisode 1',
        body: `Moteur 7 était le camion de pompier le plus brillant de la Caserne 3. Peinture rouge, pare-chocs chromé, la sirène la plus forte de toutes. Mais Moteur 7 avait un secret — il avait peur du feu.

Chaque fois que l'alarme sonnait, son moteur cafouillait. Ses roues tremblaient. Les autres camions fonçaient en avant pendant que Moteur 7 suivait lentement derrière.

« Allez, Sept ! » criait Pompe 4. « T'es censé être le plus rapide ! »

Mais chaque fois qu'il voyait des flammes orangées, quelque chose en lui se figeait. Sa pompe à eau se bloquait. Son échelle refusait de se déployer.

Une nuit, l'alarme sonna à 3 heures du matin. Une maison sur la rue des Chênes. Une famille était prisonnière. Tous les autres camions étaient occupés à l'autre bout de la ville. Il n'y avait que Moteur 7.

Son moteur cafouilla. Mais alors, il entendit un enfant pleurer à la radio. Pas des cris. Juste des petits pleurs. Comme si l'enfant avait abandonné tout espoir.

Quelque chose de plus grand que la peur rugit en lui. Il roula. Plus vite que jamais. L'échelle monta. L'eau coula. La famille descendit saine et sauve.

Ce soir-là, {childName}, souviens-toi de Moteur 7. Tout le monde a peur de quelque chose. Mais quand quelqu'un a besoin de toi, la peur rapetisse. Et le courage devient plus fort.`,
      },
      {
        id: 'fta_ep2_big_test', episodeNumber: 2, title: 'Le grand examen',
        subtitle: 'L\'examen de l\'académie est demain. Moteur 7 n\'est pas prêt.',
        tradition: 'universal', theme: 'humility', durationMinutes: 5,
        source: 'L\'Académie des pompiers · Épisode 2',
        body: `Le Capitaine Hydrant annonça : « Examens de l'académie la semaine prochaine. Chaque camion doit réussir le Parcours des flammes. »

Le parcours était légendaire. Étape 1 : traverser un tunnel de feu. Étape 2 : déployer l'échelle jusqu'au 5e étage pendant que des canons à eau t'arrosent. Étape 3 : secourir un mannequin dans une pièce remplie de fumée en 90 secondes.

Moteur 7 regarda Pompe 4 réussir facilement. Même la petite Broussaille 9 réussit du premier coup. Moteur 7 essaya l'Étape 1. Il se figea dans le tunnel.

« Échoué », dit le Capitaine Hydrant.

Ce soir-là, la vieille Échelle 12 — le camion le plus respecté de la flotte — se gara à côté de lui. « J'ai échoué ce test quatre fois », dit Échelle 12.

« Toi ? Échoué ? »

« Les trois premières fois, j'ai essayé d'être brave. De foncer. La quatrième fois, j'ai arrêté de combattre la peur. J'ai juste roulé AVEC elle. Je l'ai laissée s'asseoir comme passagère. »

Le lendemain matin, Moteur 7 laissa la peur s'installer dans son moteur. Et il roula. À travers le tunnel. Jusqu'au 5e étage. Mannequin secouru en 71 secondes. « Réussi. »

Ce soir-là, {childName}, souviens-toi de Moteur 7 et d'Échelle 12. Parfois, la chose la plus courageuse, ce n'est pas de combattre ta peur — c'est de la laisser t'accompagner pendant que tu fais ce qui doit être fait.`,
      },
      {
        id: 'fta_ep3_saving_day', episodeNumber: 3, title: 'Sauver la mise',
        subtitle: 'Une vraie urgence. Fini les exercices.',
        tradition: 'universal', theme: 'courage', durationMinutes: 5,
        source: 'L\'Académie des pompiers · Épisode 3',
        body: `Jour de remise des diplômes à la Caserne 3. Moteur 7 avait son certificat. Puis la vraie alarme sonna.

« Immeuble d'appartements sur l'avenue des Érables. Quatrième étage. Plusieurs familles prisonnières. »

Quand ils arrivèrent, c'était pire que tous les exercices. Le quatrième étage entier était en flammes. Des gens sur les balcons criaient.

« Moteur 7 ! Côté nord. Cinquième étage. Une famille prisonnière. T'es le seul avec une échelle assez haute. »

Le côté nord était le pire. Des flammes jaillissaient de chaque fenêtre du quatrième étage. Son échelle devrait passer AU TRAVERS du feu.

Son moteur cafouilla. La vieille peur était de retour. « Bonjour, vieille amie », murmura Moteur 7.

Puis du cinquième étage : « Est-ce que quelqu'un vient ? S'il vous plaît. »

« On y va », dit-il à la peur. « On monte tous les deux. »

Son échelle se déploya à travers les flammes. Un père portant un bambin. Une mère avec un bébé. Quatre personnes descendirent saines et sauves.

Le Capitaine Hydrant dit : « Moteur 7 a effectué le sauvetage le plus difficile de l'histoire de la Caserne 3. Et on m'a dit qu'il l'a fait en tremblant tout le long. »

Moteur 7 tremblait encore. Mais maintenant il savait : avoir peur et se présenter quand même — c'était ça, son super pouvoir.

Ce soir-là, {childName}, les gens les plus courageux ne sont pas ceux qui n'ont jamais peur. Ce sont ceux qui tremblent et qui se présentent quand même.`,
      },
    ],
  },

  {
    id: 'panchatantra-tales', comingSoon: true,
    title: 'Contes du Panchatantra',
    icon: '🐒',
    gradient: 'linear-gradient(135deg, #064e3b 0%, #059669 50%, #6ee7b7 100%)',
    description: 'Anciennes histoires indiennes d\'animaux rusés — le singe, la corneille et le crocodile.',
    ageRange: '4-8',
    totalEpisodes: 3,
    episodes: [
      {
        id: 'pt_ep1_monkey', episodeNumber: 1, title: 'Le singe et le crocodile',
        subtitle: 'Un singe rusé déjoue un ami dangereux.',
        tradition: 'universal', theme: 'wisdom', durationMinutes: 5,
        source: 'Contes du Panchatantra · Épisode 1',
        body: `Dans une forêt au bord d'une grande rivière, un singe brun et futé nommé Chiku vivait dans un grand manguier. Chaque jour, il mangeait de douces mangues et en lançait quelques-unes à un crocodile nommé Makara qui vivait dans la rivière en contrebas.

Ils devinrent amis. Mais la femme de Makara voulait manger le cœur du singe. « Un singe qui mange des mangues aussi sucrées doit avoir le cœur le plus doux de tous », dit-elle.

Un jour, Makara invita Chiku chez lui, de l'autre côté de la rivière. « Monte sur mon dos ! » Au milieu de la traversée, Makara avoua : « Ma femme veut ton cœur. »

Le propre cœur de Chiku se mit à battre très fort. Mais il resta calme. « Oh là là ! J'ai laissé mon cœur dans le manguier. Ramène-moi et j'irai le chercher ! »

Makara, pas très futé, nagea jusqu'à la rive. Chiku bondit dans son arbre et n'en redescendit plus jamais.

« Où est le cœur ? » appela Makara.

« Un singe qui donne son cœur n'est plus un singe du tout », dit Chiku. « Et un ami qui te trahit n'a jamais été un ami. »

Ce soir-là, {childName}, souviens-toi de Chiku. L'intelligence te sauve quand la force ne peut rien. Et les vrais amis ne te demandent jamais de renoncer à ce que tu es.`,
      },
      {
        id: 'pt_ep2_crow', episodeNumber: 2, title: 'La corneille et la cruche',
        subtitle: 'Une corneille assoiffée trouve de l\'eau tout au fond d\'une cruche.',
        tradition: 'universal', theme: 'wisdom', durationMinutes: 4,
        source: 'Contes du Panchatantra · Épisode 2',
        body: `Par un après-midi de chaleur accablante, une corneille noire et lustrée nommée Kaaki survolait un village poussiéreux. Sa gorge était sèche. Ses ailes étaient lourdes. Elle cherchait de l'eau depuis le matin.

Puis elle aperçut une cruche d'argile dans une cour. Elle se posa sur le rebord et regarda à l'intérieur. De l'eau ! Mais tout au fond. Son bec ne pouvait pas l'atteindre.

Elle essaya de pencher la cruche. Trop lourde. Elle essaya de la casser. Trop solide. D'autres oiseaux se seraient envolés. Mais Kaaki s'assit sur le rebord et réfléchit.

Puis elle remarqua des petits cailloux par terre. Elle en prit un dans son bec et le laissa tomber dans la cruche. Ploc. L'eau monta un tout petit peu. Elle en laissa tomber un autre. Ploc. Et un autre. Ploc. Ploc. Ploc.

Un caillou à la fois. Pendant vingt minutes. Les autres oiseaux se moquaient. « Va donc chercher une autre mare, Kaaki ! »

Mais Kaaki continua de laisser tomber des cailloux. Et lentement, lentement, l'eau monta. Jusqu'à ce qu'enfin — elle plonge son bec et boive.

Ce soir-là, {childName}, souviens-toi de Kaaki la corneille. Les plus grands problèmes ne se règlent pas d'un seul coup. Ils se règlent un petit pas à la fois. La patience et la persévérance l'emportent sur tout.`,
      },
      {
        id: 'pt_ep3_tortoise', episodeNumber: 3, title: 'La tortue et les oies',
        subtitle: 'Une tortue qui parle trop apprend une dure leçon.',
        tradition: 'universal', theme: 'wisdom', durationMinutes: 4,
        source: 'Contes du Panchatantra · Épisode 3',
        body: `Une tortue nommée Mandu vivait au bord d'un lac avec ses deux amies les oies — Hansa et Padma. Quand le lac commença à s'assécher, les oies dirent : « On s'envole vers un plus grand lac. Viens avec nous ! »

« Mais je ne sais pas voler ! » dit Mandu.

Les oies eurent une idée. Elles tinrent un bâton entre leurs becs. « Mords le milieu et tiens bien fort. On va te porter. Mais quoi qu'il arrive — N'OUVRE PAS la bouche. »

Mandu mordit fort et elles s'envolèrent. Au-dessus des champs, au-dessus des villages, au-dessus des forêts. C'était merveilleux !

En bas, les villageois levèrent les yeux et pointèrent du doigt. « Regardez ! Une tortue qui vole ! Comme c'est ingénieux ! »

Mandu se sentit fière. Elle voulait crier : « Oui, c'est MON idée ! » Elle ouvrit la bouche — et tomba.

Heureusement pour Mandu, elle tomba dans une botte de foin et s'en tira indemne. Mais la leçon resta gravée en elle pour toujours.

Les oies atterrirent à côté d'elle. « Qu'est-ce qui s'est passé ? »

« Je voulais dire à tout le monde à quel point j'étais futée. Et c'est la chose la moins futée que j'aie jamais faite. »

Ce soir-là, {childName}, souviens-toi de Mandu. Parfois, la chose la plus intelligente à faire, c'est de garder la bouche fermée et de bien s'accrocher. Tous les moments n'ont pas besoin de tes mots. Certains moments ont juste besoin de ta prise.`,
      },
    ],
  },

  {
    id: 'lightning-wheels', comingSoon: true,
    title: 'Roues éclair',
    icon: '🏎️',
    gradient: 'linear-gradient(135deg, #78350f 0%, #f59e0b 50%, #fcd34d 100%)',
    description: 'Flash la voiture de course apprend que gagner n\'est pas tout. Vitesse, amitié et la route à venir.',
    ageRange: '4-7',
    totalEpisodes: 3,
    episodes: [
      {
        id: 'lw_ep1_fastest', episodeNumber: 1, title: 'La voiture la plus rapide en ville',
        subtitle: 'Flash gagne toutes les courses. Mais plus personne ne veut courir contre lui.',
        tradition: 'universal', theme: 'humility', durationMinutes: 4,
        source: 'Roues éclair · Épisode 1',
        body: `Flash était la voiture la plus rapide de la rue des Érables. Peinture rouge. Rayures dorées. Un moteur qui ronronnait comme un tigre.

Chaque samedi, les voitures faisaient la course en descendant la grande côte. Flash gagnait toujours. De LOIN. Il franchissait la ligne d'arrivée, faisait crisser ses pneus et criait : « Je suis le PLUS RAPIDE ! »

Mais un samedi, personne ne vint pour la course. Flash roula jusqu'à la ligne de départ. Vide. Il roula jusqu'au parc où les autres voitures traînaient.

« Où est tout le monde ? » demanda Flash au vieux Camion Pierre.

« Ils ont arrêté de venir », dit Pierre. « C'est pas amusant de courir contre quelqu'un qui gagne toujours et qui se vante tout le temps. »

Flash ressentit un drôle de sentiment. Pas le frisson de la victoire. Quelque chose de plus lourd. La solitude.

Il rentra chez lui lentement — le plus lentement qu'il ait jamais roulé. Et pour la première fois, il remarqua des choses. Les fleurs au bord de la route. Le coucher de soleil. Un petit tricycle qui peinait à monter une côte.

Flash s'arrêta. « Besoin d'un coup de pouce ? » Les yeux du tricycle s'écarquillèrent. « T'es FLASH ! Tu m'aiderais, MOI ? »

Flash poussa le tricycle en haut de la côte. Ça prit cinq minutes. Ce furent les cinq plus belles minutes de la vie de Flash.

Ce soir-là, {childName}, souviens-toi de Flash. Être le plus rapide ne veut rien dire si tu cours tout seul. La meilleure chose que tu puisses faire avec ta vitesse, c'est de ralentir pour quelqu'un qui a besoin de toi.`,
      },
      {
        id: 'lw_ep2_flat_tire', episodeNumber: 2, title: 'La crevaison',
        subtitle: 'Flash a un pneu crevé le jour de la course. Qui va l\'aider ?',
        tradition: 'universal', theme: 'sharing', durationMinutes: 4,
        source: 'Roues éclair · Épisode 2',
        body: `La grande course de championnat était demain. Flash s'était entraîné toute la semaine. Pneus neufs. Huile fraîche. Alignement parfait.

Mais le matin de la course — PSSSCHH. Pneu crevé. L'avant gauche. Un clou sur la route.

Flash paniqua. « La course commence dans une heure ! Je peux pas rouler sur un pneu crevé ! »

Il appela Camion Pierre. « Désolé, Flash. Je transporte du foin aujourd'hui. » Il appela VUS Sportif. « Pas capable, trop occupé. » Une à une, chaque voiture dit non. Flash se souvint — il n'avait jamais aidé AUCUN d'entre eux quand ils en avaient besoin.

Puis une petite voix : « Moi, je peux t'aider. » C'était Trike — le petit tricycle que Flash avait poussé en haut de la côte la semaine passée.

« Toi ? Mais t'es si petit ! »

« Petit, mais le propriétaire de la boutique de pneus, c'est mon oncle. » Trike pédala jusqu'à la boutique et revint avec un pneu tout neuf en douze minutes.

Flash arriva à la course. Il finit deuxième. DEUXIÈME. Pas premier. Mais quand il franchit la ligne d'arrivée, il regarda en arrière et vit Trike l'encourager depuis le bord de la piste, et ça lui fit plus chaud au cœur que n'importe quelle première place.

Ce soir-là, {childName}, souviens-toi : l'aide dont tu auras besoin demain vient de la gentillesse que tu montres aujourd'hui. Chaque petite personne que tu aides pourrait être celle qui sauvera ta plus grande journée.`,
      },
      {
        id: 'lw_ep3_last_race', episodeNumber: 3, title: 'La dernière course',
        subtitle: 'La course finale de Flash — mais le vrai prix, ce n\'est pas le trophée.',
        tradition: 'universal', theme: 'wisdom', durationMinutes: 5,
        source: 'Roues éclair · Épisode 3',
        body: `La dernière course de la saison. Le gagnant remportait l'Enjoliveur d'or — le trophée le plus célèbre de la rue des Érables.

Flash était rapide. Mais Turbo aussi, la nouvelle voiture en ville. Turbo était plus jeune, plus brillante, et peut-être — juste peut-être — plus rapide.

La course commença. Flash prit la tête. Turbo était juste derrière. Dans le premier virage — Flash en tête. En descendant la côte — Turbo gagnait du terrain.

Puis, dans la dernière ligne droite, Flash vit quelque chose. Un petit chiot s'était aventuré sur la route. En plein milieu de la piste.

Turbo ne le vit pas. Il allait trop vite, les yeux rivés sur le pare-chocs de Flash.

Flash avait un choix. Continuer à courir et gagner. Ou s'arrêter et sauver le chiot.

Il freina. CRIIICH. Il s'arrêta à quelques centimètres du chiot. Le souleva sur son capot. Turbo fila et franchit la ligne d'arrivée.

Turbo gagna l'Enjoliveur d'or. La foule applaudit Turbo.

Mais alors quelque chose d'inattendu se produisit. La foule se tourna vers Flash — assis au milieu de la piste avec un chiot sur le capot — et lui fit une ovation debout. Plus forte que n'importe quelle acclamation pour un trophée.

Le chiot lécha le pare-brise de Flash. Flash rigola.

Le vieux Camion Pierre roula vers lui. « Tu sais, Flash, Turbo a gagné la course. Mais toi, t'as gagné quelque chose de plus grand. »

« C'est quoi ? »

« La chose qui compte quand les courses sont terminées. »

Ce soir-là, {childName}, souviens-toi de la dernière course de Flash. Les trophées ramassent la poussière. Mais le moment où tu as choisi de t'arrêter — pour sauver quelque chose de petit et de vulnérable — ce moment-là vit pour toujours. En toi. Et dans tous ceux qui l'ont vu.`,
      },
    ],
  },

  {
    id: 'rocket-adventures', comingSoon: true,
    title: 'Aventures spatiales',
    icon: '🚀',
    gradient: 'linear-gradient(135deg, #1e1b4b 0%, #4f46e5 50%, #a5b4fc 100%)',
    description: 'Fusée 5 surmonte sa peur des hauteurs et explore le système solaire.',
    ageRange: '4-8',
    totalEpisodes: 3,
    episodes: [
      {
        id: 'ra_ep1_heights', episodeNumber: 1, title: 'Le vertige',
        subtitle: 'Fusée 5 a été construite pour voler. Mais elle est terrifiée par les hauteurs.',
        tradition: 'universal', theme: 'courage', durationMinutes: 4,
        source: 'Aventures spatiales · Épisode 1',
        body: `Fusée Numéro 5 avait été construite pour voler jusqu'à la Lune. Puissante. Brillante. Parfaitement conçue. Mais elle n'avait jamais quitté le sol. Parce qu'elle avait le vertige.

Les ingénieurs vérifiaient ses moteurs — parfaits. Carburant — plein. Navigation — impeccable. Mais à chaque compte à rebours, Fusée 5 tremblait si fort que tout s'arrêtait.

« Et si je tombe ? » murmurait-elle.

Un jour, une petite fille visita le site de lancement. Elle leva les yeux vers Fusée 5 et dit : « Moi, j'ai peur du noir. Mais ma maman me dit : le noir, c'est juste le monde qui se repose. Peut-être que les hauteurs, c'est juste le monde qui rapetisse. »

Fusée 5 réfléchit à ça. Le monde qui rapetisse. Pas tomber. Juste... s'élever.

Le prochain compte à rebours : 3... 2... 1... Elle vola. Au-delà des nuages. Au-delà du ciel bleu. Dans le noir de l'espace. Et le monde en bas ne disparut pas — il devint une magnifique bille bleue.

« C'est pas effrayant ici », murmura Fusée 5. « C'est magnifique. »

Ce soir-là, {childName}, parfois tu as juste besoin que quelqu'un te montre une autre façon de regarder ta peur. Ce qui te fait peur pourrait être la plus belle chose que tu aies jamais vue — de l'autre côté.`,
      },
      {
        id: 'ra_ep2_moon', episodeNumber: 2, title: 'Atterrissage sur la Lune',
        subtitle: 'Fusée 5 atteint la Lune. Mais c\'est plus solitaire que prévu.',
        tradition: 'universal', theme: 'compassion-animals', durationMinutes: 4,
        source: 'Aventures spatiales · Épisode 2',
        body: `Fusée 5 se posa sur la Lune. Elle s'attendait à des fanfares. Des célébrations. Mais la Lune était silencieuse. Très silencieuse.

Poussière grise. Pas de vent. Pas d'oiseaux. Pas de voix. Juste un silence si profond qu'il bourdonnait.

« Allô ? » appela Fusée 5. Rien.

Elle roula autour des cratères. Trouva de vieilles empreintes d'astronautes depuis longtemps partis. Trouva un drapeau, décoloré et immobile. Trouva un petit rover — poussiéreux, panneaux solaires fissurés, batterie morte.

« Est-ce que ça va ? » demanda Fusée 5 au rover.

Pas de réponse. Mais elle voyait bien qu'il était là depuis des années. Seul. Oublié.

Fusée 5 ouvrit sa soute. À l'intérieur se trouvait une batterie de rechange — prévue pour les urgences. Elle la brancha au rover. Une lumière cligna. Puis une autre.

« Merci », dit une petite voix électronique. « Je dormais depuis si longtemps. »

« Comment tu t'appelles ? »

« Luna. On m'a envoyée étudier la Lune. Mais ma batterie est morte et personne n'est revenu. »

Fusée 5 s'assit à côté de Luna sur la poussière grise, regardant la Terre ensemble — une bille bleue suspendue dans le ciel noir. Ni l'une ni l'autre n'était seule désormais.

Ce soir-là, {childName}, souviens-toi : les endroits les plus solitaires abritent quelqu'un qui attend d'être trouvé. Et parfois la mission la plus importante n'est pas celle pour laquelle on t'a envoyé — c'est celle que tu découvres en chemin.`,
      },
      {
        id: 'ra_ep3_home', episodeNumber: 3, title: 'Le retour',
        subtitle: 'Fusée 5 doit choisir — rester dans l\'espace ou ramener Luna à la maison.',
        tradition: 'universal', theme: 'sharing', durationMinutes: 5,
        source: 'Aventures spatiales · Épisode 3',
        body: `Fusée 5 avait un problème. Elle avait assez de carburant pour rentrer. Mais pas assez pour transporter Luna le rover ET rentrer.

« Laisse-moi ici », dit Luna. « Tu dois rentrer. Des gens t'attendent. »

« Je ne vais pas te laisser toute seule ici encore une fois. »

« Mais si tu restes, on sera coincées toutes les deux. »

Fusée 5 réfléchit. Elle pensa à la petite fille qui lui avait appris à voir les hauteurs autrement. Elle pensa à la solitude de la Lune. Elle pensa à ce qui compte vraiment.

Puis elle eut une idée. « Luna, si j'utilise tout mon carburant d'un seul coup — droit vers le haut — on échappera à la gravité de la Lune. Ensuite on va juste... flotter. Vers la Terre. Lentement. Ça pourrait prendre des jours au lieu d'heures. »

« C'est risqué. »

« Tout ce qui vaut la peine l'est. »

3... 2... 1... DÉCOLLAGE. Chaque goutte de carburant. Chaque once de puissance. Fusée 5 et Luna s'envolèrent de la surface de la Lune dans l'espace entre les mondes.

Puis le silence. Plus de moteur. Plus de carburant. Juste la dérive. La Terre grandissant lentement, lentement.

Le Centre de contrôle était perplexe. « Fusée 5, pourquoi approchez-vous au dixième de la vitesse normale ? »

« Parce que je transporte une amie. »

Trois jours plus tard, Fusée 5 et Luna entrèrent dans l'atmosphère terrestre. Le bouclier thermique devint orange incandescent. Le parachute se déploya. Elles amerrirent dans l'océan Pacifique.

Quand on ouvrit la soute, la caméra de Luna s'alluma et prit une photo de l'océan. Sa toute première photo de la Terre. De toute sa vie.

La petite fille du site de lancement regardait à la télé. Elle sourit et murmura : « Elle a ramené quelqu'un à la maison. »

Ce soir-là, {childName}, souviens-toi du choix de Fusée 5. Elle aurait pu rentrer vite et seule. Au lieu de ça, elle est rentrée lentement et à deux. Les plus beaux voyages sont ceux où tu ramènes quelqu'un avec toi.`,
      },
    ],
  },

  {
    id: 'kindness-squad', comingSoon: true,
    title: 'L\'Escouade de la gentillesse',
    icon: '🦸',
    gradient: 'linear-gradient(135deg, #831843 0%, #ec4899 50%, #fbcfe8 100%)',
    description: '3 enfants découvrent leurs super pouvoirs — et ils sont tous liés à la gentillesse.',
    ageRange: '4-8',
    totalEpisodes: 3,
    episodes: [
      {
        id: 'ks_ep1_cape', episodeNumber: 1, title: 'Le fil d\'or',
        subtitle: 'Arjun fait un geste gentil — et un fil doré apparaît.',
        tradition: 'universal', theme: 'compassion-animals', durationMinutes: 4,
        source: 'L\'Escouade de la gentillesse · Épisode 1',
        body: `Ça a commencé un mardi. Arjun tint la porte pour sa professeure. Un minuscule fil doré apparut sur sa manche. Il crut que c'était un fil qui dépassait et essaya de l'enlever. Impossible de le retirer.

À l'heure du dîner, il partagea son sandwich avec Rohan qui avait oublié sa boîte à lunch. Un autre fil apparut. Puis un autre quand il ramassa les livres que quelqu'un avait laissé tomber.

À la fin de la journée, les fils s'étaient tissés ensemble pour former quelque chose. Une cape. Une petite cape dorée et lumineuse.

Et Arjun pouvait voler. Juste un peu — à deux pieds du sol. Assez pour atteindre la tablette du haut. Assez pour flotter au-dessus des flaques.

Mais le lendemain matin, Arjun fut impoli avec sa sœur au déjeuner. Un fil se détissa. Il descendit d'un pouce.

Il comprit alors : la cape n'était pas magique. C'était un compteur. Chaque geste de gentillesse ajoutait un fil. Chaque méchanceté en retirait un.

Cet après-midi-là, Arjun aida son voisin à porter ses sacs d'épicerie. Deux fils apparurent. Il s'excusa auprès de sa sœur. Trois de plus. Au coucher, il volait de nouveau.

Ce soir-là, {childName}, ta gentillesse n'est pas invisible. Elle construit quelque chose de vrai. Fil après fil. Jour après jour. Un jour, tu regarderas en arrière et tu verras la cape que tu tisses depuis le début.`,
      },
      {
        id: 'ks_ep2_feel', episodeNumber: 2, title: 'La fille qui ressent tout',
        subtitle: 'Zara peut ressentir ce que les autres ressentent. C\'est accablant — jusqu\'à ce qu\'elle apprenne à s\'en servir.',
        tradition: 'universal', theme: 'compassion-animals', durationMinutes: 4,
        source: 'L\'Escouade de la gentillesse · Épisode 2',
        body: `Le pouvoir de Zara était différent de celui d'Arjun. Elle ne pouvait pas voler. Elle pouvait RESSENTIR. Tout ce que quelqu'un près d'elle ressentait, elle le ressentait aussi.

Quand sa camarade Priya était triste, la poitrine de Zara lui faisait mal. Quand son chien était content, Zara souriait sans raison. Quand toute l'école était anxieuse avant les examens, Zara avait du mal à respirer.

« C'est trop », dit-elle à Arjun au dîner. « Les émotions de tout le monde sont tellement FORTES. »

Arjun y réfléchit. « Peut-être que c'est justement le but. T'es pas censée porter leurs émotions. T'es censée les comprendre. »

Cet après-midi-là, une nouvelle élève arriva. Meera. Elle s'assit toute seule. Elle ne parlait pas. Les autres enfants l'ignoraient.

Mais Zara le sentait — un brouillard gris et lourd de solitude émanait de Meera. Pas de la tristesse. Pire. L'invisibilité.

Zara s'assit à côté d'elle. Ne dit rien. Juste s'assit. Et après dix minutes, Meera murmura : « Comment t'as su ? »

« Su quoi ? »

« Que j'avais besoin que quelqu'un soit juste... là. »

Zara sourit. Parce qu'elle le SAVAIT. C'était ça son super pouvoir. Pas ressentir la douleur. Sentir le bon moment pour se présenter.

Ce soir-là, {childName}, l'empathie — ressentir ce que les autres ressentent — n'est pas une faiblesse. C'est peut-être le plus grand super pouvoir qui existe. Il te permet d'aider les gens avant même qu'ils ne demandent.`,
      },
      {
        id: 'ks_ep3_shield', episodeNumber: 3, title: 'Le bouclier de vérité',
        subtitle: 'Le pouvoir de Dheer, c\'est l\'honnêteté. Mais la vérité n\'est pas toujours facile.',
        tradition: 'universal', theme: 'honesty', durationMinutes: 5,
        source: 'L\'Escouade de la gentillesse · Épisode 3',
        body: `Dheer avait une règle : ne jamais mentir. Son bouclier — un petit disque bleu apparu un matin — brillait plus fort à chaque vérité qu'il disait. Il pouvait bloquer n'importe quoi. Les intimidateurs. Les insultes. Même les objets lancés.

Les trois — Arjun avec sa cape, Zara avec son empathie, et Dheer avec son bouclier — devinrent L'Escouade de la gentillesse.

Mais un jour, un intimidateur coinça leur ami Rohan et demanda à Dheer : « Où est-ce que Rohan se cache ? »

La vérité mettrait Rohan en danger. Un mensonge le sauverait. Le bouclier de Dheer s'assombrit, attendant son choix.

Alors Dheer dit : « Je ne répondrai pas à cette question. »

L'intimidateur rigola. « Alors tu peux PAS toujours dire la vérité ! »

« Je n'ai pas menti », dit Dheer. « J'ai choisi le silence. Il y a une différence entre l'honnêteté et trahir le secret de quelqu'un d'autre. »

Son bouclier brilla plus fort que jamais. L'intimidateur, aveuglé par la lumière, trébucha et s'éloigna.

La cape d'Arjun frémit. Zara sentit la fierté rayonner de Dheer — chaude et dorée.

« On est une équipe », dit Arjun.

« On l'a toujours été », dit Zara.

Dheer sourit. Son bouclier bourdonnait doucement — le son de la vérité, portée avec douceur.

Ce soir-là, {childName}, souviens-toi de L'Escouade de la gentillesse. Une cape tissée de bontés. Un cœur qui ressent la douleur des autres. Un bouclier qui se renforce avec la vérité. Ce ne sont pas des pouvoirs fantaisistes. Ce sont des choses que TU possèdes déjà. Tu ne leur as juste pas encore donné de noms.`,
      },
    ],
  },

  {
    id: 'planet-explorers', comingSoon: true,
    title: 'Explorateurs de planètes',
    icon: '🪐',
    gradient: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #fbbf24 100%)',
    description: 'Voyage dans le système solaire — la Lune, Mars et Pluton ont chacun une histoire à raconter.',
    ageRange: '4-8',
    totalEpisodes: 3,
    episodes: [
      {
        id: 'pe_ep1_moon', episodeNumber: 1, title: 'Pourquoi la Lune n\'est jamais seule',
        subtitle: 'La Lune pense que personne ne se soucie d\'elle. Le Soleil lui montre la vérité.',
        tradition: 'universal', theme: 'wisdom', durationMinutes: 4,
        source: 'Explorateurs de planètes · Épisode 1',
        body: `La Lune regarda la Terre en bas et soupira. « Tout le monde a des amis là-bas. Les oiseaux volent ensemble. Les poissons nagent en banc. Les enfants jouent en groupe. Mais moi, je suis toute seule ici. »

Le Soleil entendit cela et dit : « Lune, regarde encore. Chaque soir, des milliards d'enfants lèvent les yeux vers toi avant de s'endormir. Tu es la dernière chose qu'ils voient. La chose qui les rassure dans le noir. »

La Lune cligna des yeux. « Ils me regardent ? »

« Chaque soir, sans exception. Tu n'es jamais seule, Lune. Tu ne peux juste pas voir tes amis de là-haut. Mais eux, ils te voient. »

La Lune brilla un peu plus fort ce soir-là. Pas grâce au reflet du Soleil. Grâce à autre chose. Quelque chose de plus chaleureux.

Ce soir-là, {childName}, souviens-toi de la Lune. Parfois quand tu te sens seul, ce n'est pas parce que personne ne pense à toi. C'est parce que tu ne vois pas combien de personnes pensent à toi en ce moment même. Lève les yeux vers la Lune ce soir — et sache que la Lune te regarde aussi.`,
      },
      {
        id: 'pe_ep2_mars', episodeNumber: 2, title: 'Pourquoi Mars est rouge',
        subtitle: 'Mars était bleue autrefois. Puis elle a choisi de faire face au Soleil.',
        tradition: 'universal', theme: 'courage', durationMinutes: 4,
        source: 'Explorateurs de planètes · Épisode 2',
        body: `Il y a très longtemps, Mars était bleue comme la Terre. Des océans, des rivières, de la pluie. Mais un jour, le Soleil devint plus chaud. Les océans commencèrent à bouillir.

Mars avait un choix : se cacher derrière Jupiter ou faire face au Soleil directement.

Mars choisit d'y faire face. Seule. La chaleur fit s'évaporer ses océans. Colora son sol en rouge avec le fer. La changea pour toujours. Mais Mars ne bougea jamais. Ne se cacha jamais.

Maintenant, quand les humains lèvent les yeux, ils voient cette planète rouge et disent : « Un jour, nous vivrons là-bas. » Parce que quelque chose chez Mars — son entêtement, son refus de se cacher — donne envie aux humains d'être près d'elle.

Jupiter, qui avait offert de protéger Mars, demanda : « Tu regrettes ? »

Mars regarda sa surface rouge et poussiéreuse. Plus d'océans. Plus de rivières. Plus de pluie. « Je ne suis plus celle que j'étais », dit-elle. « Mais je suis encore là. Et j'y ai fait face. »

Ce soir-là, {childName}, souviens-toi de Mars. Affronter quelque chose de difficile pourrait te changer. Mais s'en cacher te change encore plus — et pas de la bonne façon. Sois comme Mars. Fais face. Même si ça te rend tout rouge.`,
      },
      {
        id: 'pe_ep3_pluto', episodeNumber: 3, title: 'Le grand cœur de Pluton',
        subtitle: 'On a dit que Pluton était trop petit. Puis la NASA a trouvé quelque chose d\'incroyable.',
        tradition: 'universal', theme: 'humility', durationMinutes: 4,
        source: 'Explorateurs de planètes · Épisode 3',
        body: `Quand on a dit que Pluton était trop petit pour être une planète, le petit Pluton a pleuré. Toute sa vie, il avait fait partie des neuf. Maintenant on disait que huit, ça suffisait.

« Tu es trop petit », disaient-ils. « Trop loin. Trop froid. Pas assez. »

Pluton s'éloigna. Seul au bord sombre du système solaire. Les autres planètes cessèrent de parler de lui.

Mais alors, un vaisseau spatial arriva. De la Terre. Juste pour le voir LUI. Il avait voyagé 9 ans et 5 milliards de kilomètres — juste pour Pluton.

Et quand il arriva, il photographia quelque chose que personne n'attendait : un immense glacier en forme de cœur sur la surface de Pluton. Plus grand que le Texas. Visible depuis l'espace.

Le monde entier en eut le souffle coupé. Pluton avait le plus grand cœur du système solaire. Il fallait juste regarder de plus près.

Saturne dit : « On aurait dû regarder de plus près. »

Jupiter dit : « On aurait dû venir plus tôt. »

La Lune — qui comprenait la solitude — dit : « On n'aurait jamais dû arrêter de le considérer comme faisant partie de la famille. »

Ce soir-là, {childName}, souviens-toi de Pluton. Être petit ne veut pas dire être sans importance. Parfois, les plus petits ont le plus grand cœur. Et les gens qui semblent les plus éloignés sont peut-être ceux qui ont le plus besoin de ta visite.`,
      },
    ],
  },
  {
    id: 'rainbow-kindergarten-jlps-yr25-26',
    title: 'Les aventures de la maternelle Arc-en-ciel',
    icon: '🌈',
    gradient: 'linear-gradient(135deg, #7c3aed 0%, #f472b6 50%, #fbbf24 100%)',
    description: 'Le groupe Arc-en-ciel de JLPS explore Toronto — les formes à Canoe Landing, un concert et une randonnée à Evergreen Brick Works.',
    createdBy: 'deepti.ramaul@gmail.com', creatorName: 'Deepti Ramaul', creatorUsername: 'deepti-ramaul',
    ageRange: '4-6',
    totalEpisodes: 3,
    episodes: [
      {
        id: 'rk_ep1_canoe', episodeNumber: 1, title: 'Les formes à Canoe Landing',
        subtitle: 'Mr. Zak et Shelagh emmènent le groupe Arc-en-ciel en marche communautaire à la recherche de formes.',
        tradition: 'universal', theme: 'wisdom', durationMinutes: 5,
        source: 'Maternelle Arc-en-ciel · Épisode 1',
        body: `Mr. Zak tapa dans ses mains deux fois et Shelagh leva la corde des copains. « Classe Arc-en-ciel ! Marche communautaire vers Canoe Landing Park ! On part à la chasse aux formes ! »

Vingt petits sacs à dos bondirent par la porte de Jean Lumb Public School. Les parents bénévoles avaient leurs appareils photo prêts. {childName} attrapa la corde des copains, les yeux balayant partout.

« Je vois un rectangle ! » cria {childName} en pointant une fenêtre.

« Bravo ! » dit Mr. Zak. « Trouvez toutes les formes possibles — carrés, rectangles, cercles, triangles, losanges, trapèzes, et les formes 3D aussi — sphères, pavés, cylindres ! »

Au parc, les formes étaient partout. {childName} trouva des cercles dans les lampadaires et les bouches d'égout. Quelqu'un repéra le terrain de football. « C'est un rectangle ! » Mr. Zak demanda : « Comment tu sais que c'est pas un carré ? » « Parce que c'est plus long dans ce sens-là que dans l'autre ! »

Shelagh montra un boulon hexagonal. « Combien de côtés ? » « Six ! Hexagone ! »

La grande sculpture du canot rouge intrigua tout le monde. « C'est une forme 3D courbe », dit Mr. Zak. « Certaines formes sont difficiles à nommer — et c'est correct. »

{childName} se donna une mission. Cylindre — la poubelle. Sphère — un ballon sur le gazon. Pavé — le banc de parc. Trapèze — le côté d'une glissoire.

Puis {childName} leva les yeux vers la Tour CN qui s'élevait au-dessus du centre-ville. « C'est quelle forme, Mr. Zak ? »

« La base est un hexagone. La tige est un cylindre. Et la nacelle en haut ? »

{childName} plissa les yeux. « Un cylindre plat ! »

« Brillant », dit Mr. Zak.

Les parents bénévoles photographièrent tout. De retour à Jean Lumb, Shelagh épingla les photos au tableau. « 47 formes. Une marche. Un parc. »

Ce soir-là, {childName}, souviens-toi de la marche communautaire. Les maths ne sont pas seulement dans les cahiers. Elles sont dans les lampadaires, les bancs de parc et la Tour CN. Les formes sont le langage dans lequel le monde est construit. Et maintenant tu sais le lire — partout où tu regardes.`,
      },
      {
        id: 'rk_ep2_concert', episodeNumber: 2, title: 'Quel monde merveilleux',
        subtitle: 'Le groupe Arc-en-ciel donne son tout premier concert à Jean Lumb PS.',
        tradition: 'universal', theme: 'courage', durationMinutes: 5,
        source: 'Maternelle Arc-en-ciel · Épisode 2',
        body: `Le groupe Arc-en-ciel pratiquait depuis trois semaines. Leur tout premier concert à Jean Lumb Public School. La chanson : « What a Wonderful World ».

Mr. Zak leur expliqua pourquoi ils l'avaient choisie. « Louis Armstrong a écrit cette chanson pour nous rappeler qu'il y a de la beauté partout — les arbres, le ciel, les arcs-en-ciel, les amis. C'est ce qu'on veut partager ce soir. »

Chaque enfant avait fabriqué un chapeau-globe spécial — la planète Terre peinte sur un chapeau rond, recouvert d'océans bleus et de continents verts. {childName} avait un chapeau avec une petite étoile dorée sur le dessus.

Mr. Zak et Shelagh placèrent la classe en trois rangées sur la scène. Vingt petits globes sur vingt petites têtes.

Derrière le rideau, {childName} sentait son cœur battre fort. Le gymnase était PLEIN. Des centaines de parents. Des caméras. Des grands-parents qui pleuraient déjà.

« J'ai le trac », murmura {childName}.

Mr. Zak se mit à genoux. « Moi aussi. Chaque fois. Mais quand on chante ensemble, le trac se transforme en magie. »

Shelagh dit : « Souvenez-vous de vos gestes. "Trees of green" — on se balance comme des arbres. "Skies of blue" — on pointe vers le haut. "Wonderful world" — on ouvre grand les bras. On va faire les gestes avec vous. »

Le rideau s'ouvrit. Le gymnase devint silencieux.

Le groupe Arc-en-ciel commença à chanter. « I see trees of green... red roses too... » Vingt voix, certaines fortes, certaines toutes petites, toutes ensemble. Mr. Zak faisait chaque geste depuis le côté. Shelagh articulait chaque mot de l'autre côté.

« And I think to myself... » La classe fit une pause, puis — bras grands ouverts — « WHAT A WONDERFUL WORLD. »

Certains chapeaux étaient de travers. Un avait glissé sur les yeux d'un enfant. Personne n'en avait rien à faire. C'était parfait.

La dernière note résonna. Silence. Puis le gymnase EXPLOSA. Tous les parents debout, applaudissant, pleurant. Mr. Zak s'essuya les yeux.

« Tu étais formidable », dit Maman.

« On l'était TOUS », dit {childName}.

Ce soir-là, {childName}, souviens-toi du concert. Vingt enfants avec des chapeaux-Terre faits maison ont chanté une chanson — et pendant quatre minutes, chaque personne a cru que le monde était merveilleux. Tu n'as pas besoin d'être parfait. Tu as juste besoin de te présenter et de chanter de tout ton cœur.`,
      },
      {
        id: 'rk_ep3_brickworks', episodeNumber: 3, title: 'La sortie à Brick Works',
        subtitle: 'La toute première sortie ! Deux classes montent dans le bus jaune pour Evergreen Brick Works.',
        tradition: 'universal', theme: 'compassion-animals', durationMinutes: 6,
        source: 'Maternelle Arc-en-ciel · Épisode 3',
        body: `La toute première VRAIE sortie ! À 9 h 15, deux classes de maternelle montèrent dans le bus scolaire jaune devant Jean Lumb Public School. Mr. Zak et Shelagh comptèrent les têtes. Deux parents bénévoles portaient des gilets orange.

Le bus gronda le long de Bayview Avenue. {childName} avait les yeux grands ouverts — les sièges rebondissaient, les fenêtres étaient immenses, le moteur grondait comme un dinosaure endormi.

Evergreen Brick Works apparut comme un monde caché — une briqueterie vieille de 130 ans transformée en parc naturel, avec des bâtiments couverts de lierre et des sentiers disparaissant dans les ravins de Toronto.

D'abord : construire des maisons avec des bâtons. Les guides dirent : « Les animaux utilisent ce que la nature leur donne — des bâtons, des feuilles, de la boue. Construisez un abri pour un petit animal ! » {childName} appuya des bâtons contre une bûche pour former une tente, bourra les trous de feuilles et tassa de la boue au bas. Mr. Zak montra comment croiser les bâtons en X rend les toits plus solides.

Après le dîner vint le conservatoire de tortues. Deux vraies tortues peintes du Midland se trouvaient à l'intérieur — des carapaces vert foncé avec des marques jaunes et rouges. « Elles pondent leurs œufs dans le sol sablonneux », dit la guide. « Chaque œuf est plus petit qu'un raisin. »

« Voulez-vous en toucher une ? Un seul doigt. »

{childName} tendit la main et toucha la carapace. Dure, lisse, chaude. La tortue cligna lentement des yeux. « J'ai touché une TORTUE », murmura {childName}.

Le groupe se sépara en deux pour une marche autour de l'étang. Le groupe repéra Turtle Island — plus de trente tortues prenant un bain de soleil, empilées sur des rochers. « Elles ont le sang froid », dit la guide. « Même les tortues savent partager. »

Ils virent la maison des chauves-souris — des centaines de chauves-souris dormant à l'intérieur. « Elles mangent des milliers de maringouins. Les meilleures voisines au monde. » Puis la guide montra une plante à trois feuilles luisantes. « Herbe à puce. TROIS feuilles — on s'en éloigne ! »

À 13 h 30, tout le monde était de retour dans le bus. Fatigués, contents, un peu boueux.

« C'était comment ? » demanda Maman.

{childName} leva un doigt. « J'ai touché une tortue. Avec CE doigt-là. Et elle m'a fait un clin d'œil. »

Ce soir-là, {childName}, souviens-toi de la sortie. Les tortues qui partagent leurs rochers au soleil. Les chauves-souris qui mangent les maringouins. Les bébés tortues qui rampent vers l'eau tout seuls. Le monde est plein de petites créatures dans de petites maisons, juste à côté des nôtres. Tout ce dont elles ont besoin, c'est qu'on marche doucement.`,
      },
    ],
  },
  {
    id: 'dr-spock-parenting',
    title: 'Dr. Spock raconte',
    icon: '👨‍⚕️',
    gradient: 'linear-gradient(135deg, #1e3a5f 0%, #2563eb 50%, #93c5fd 100%)',
    createdBy: 'deepti.ramaul@gmail.com', creatorName: 'Deepti Ramaul', creatorUsername: 'deepti-ramaul',
    description: 'Cinq conversations du soir avec Dr. Spock — le médecin pour bébés le plus réputé au monde répond aux vraies questions d\'un parent sur les enfants de 3 à 5 ans.',
    ageRange: '3-5',
    totalEpisodes: 5,
    episodes: [
      {
        id: 'dsp_ep1_development', episodeNumber: 1, title: 'Ça grandit si vite',
        subtitle: 'Un parent s\'inquiète que son enfant soit en retard. Dr. Spock le rassure.',
        tradition: 'universal', theme: 'development', durationMinutes: 2,
        value: 'wisdom',
        source: 'Dr. Spock raconte · Épisode 1',
        body: `« Dr. Spock, mon {childName} vient d'avoir quatre ans. D'autres enfants de la classe écrivent déjà leur nom. Le mien gribouille encore. Est-ce que je devrais m'inquiéter ? »

Dr. Spock s'appuya dans son fauteuil et sourit. « Faites-vous confiance. Vous en savez plus que vous ne le pensez. Chaque enfant a sa propre horloge. Certains marchent à neuf mois, d'autres à quinze. Aucun n'est mieux que l'autre. »

« Mais les autres parents n'arrêtent pas de comparer. »

« Comparer, c'est le voleur de joie. À trois, quatre, cinq ans, voici ce qui compte vraiment. Est-ce que votre enfant fait semblant ? Construit une tour de blocs ? Vous raconte une petite histoire de sa journée ? »

« Oh, {childName} fait tout ça. Parle à ses toutous pendant une heure. »

« Ça, c'est l'imagination. C'est le moteur de tout — la lecture, les maths, les amitiés. Tout commence avec un enfant capable de faire semblant qu'une banane est un téléphone. »

« Et les peurs ? {childName} a soudainement peur du noir. »

« Tout à fait normal. Une plus grande imagination, ça veut dire de plus grandes peurs. Le noir, les bruits forts, les monstres sous le lit. Ne forcez pas votre enfant à être brave. Asseyez-vous avec lui. Une veilleuse n'est pas une faiblesse — c'est une bonté. »

« Et les questions ! Pourquoi le ciel est bleu, pourquoi les chiens jappent, pourquoi pourquoi pourquoi toute la journée. »

Dr. Spock rit. « C'est votre enfant qui construit un cerveau, une question à la fois. Répondez simplement et honnêtement. Vous n'avez pas besoin de tout savoir. Dire je ne sais pas, on va le découvrir ensemble est l'une des meilleures choses qu'un parent puisse dire. »

« Alors {childName} va bien ? »

« Plus que bien. Votre enfant est exactement là où il doit être. Et vous aussi. »

Bonne nuit, {childName}. Tu grandis exactement à la bonne vitesse.`,
      },
      {
        id: 'dsp_ep2_ailments', episodeNumber: 2, title: 'Les rhumes et les maux de ventre',
        subtitle: 'Quand votre enfant est malade — quand s\'inquiéter et quand laisser passer.',
        tradition: 'universal', theme: 'health', durationMinutes: 2,
        value: 'wisdom',
        source: 'Dr. Spock raconte · Épisode 2',
        body: `« Dr. Spock, {childName} a le nez qui coule depuis cinq jours. J'ai mouché ce nez cent fois. Quand est-ce que j'appelle le médecin ? »

« Un rhume, c'est un rhume. Sept à dix jours de reniflements, peut-être une petite fièvre, une petite toux. C'est le corps qui fait son travail. Du repos, des liquides, et de la patience. »

« Mais si la fièvre monte ? »

« La fièvre n'est pas l'ennemi. C'est votre enfant qui combat l'infection. Habillez-le légèrement. Offrez de l'eau, du jus, du bouillon. Un bain tiède peut aider. Mais voici quand vous appelez — si la fièvre reste au-dessus de 39 pendant plus de deux jours, ou si votre enfant devient très somnolent et difficile à réveiller. »

« Et les otites ? Le mois dernier, {childName} n'arrêtait pas de tirer sur une oreille en pleurant. »

« Ah, le tirage d'oreille. Après un rhume, du liquide peut s'accumuler derrière le tympan. S'il y a de la fièvre, plus de la douleur à l'oreille, plus des troubles du sommeil, appelez votre médecin. Les otites nécessitent souvent un suivi médical. »

« Et les gastros ? La semaine passée, il y a eu tellement de vomissements. »

« Des petites gorgées. C'est le secret. Pas un verre plein — juste une cuillère d'eau ou de bouillon clair toutes les quelques minutes. Le plus grand danger avec les vomissements et la diarrhée, c'est la déshydratation. Surveillez les lèvres sèches, l'absence de larmes quand il pleure, et les couches moins mouillées. »

« Comment je sais quand c'est sérieux ? »

« Si votre instinct vous dit que quelque chose ne va pas, appelez. C'est pour ça que votre pédiatre est là. Vous ne le dérangez pas. Vous êtes un bon parent. »

« Merci, Dr. Spock. »

« Remerciez-vous vous-même. Vous êtes resté calme. C'est le meilleur remède de tous. »

Dors bien ce soir, {childName}. Ton corps est fort et sait comment guérir.`,
      },
      {
        id: 'dsp_ep3_firstaid', episodeNumber: 3, title: 'Bosses, brûlures et bobos',
        subtitle: 'Ce que vous pouvez traiter à la maison — et quand foncer aux urgences.',
        tradition: 'universal', theme: 'safety', durationMinutes: 2,
        value: 'courage',
        source: 'Dr. Spock raconte · Épisode 3',
        body: `« Dr. Spock, {childName} est tombé de la balançoire aujourd'hui et s'est égratigné les deux genoux. Il y avait tellement de sang que j'ai failli paniquer. »

« Les égratignures ont toujours l'air pire qu'elles ne le sont. Lavez doucement avec du savon et de l'eau. Pressez un linge propre dessus. Une fois que le saignement arrête, un pansement et un bisou. C'est tout le traitement. »

« Et la bosse sur le front la semaine passée ? Ça a enflé gros comme un œuf. »

« Les bosses sur le front saignent beaucoup sous la peau, alors ça enfle vite. Mettez de la glace, surveillez votre enfant pendant quelques heures. Si {childName} vomit, semble confus, ou si les pupilles ne sont pas de la même taille — c'est là que vous allez aux urgences. »

« Et les brûlures ? {childName} a touché la poêle chaude. »

« De l'eau fraîche. Pas de glace, pas de beurre, pas de pâte à dents — juste de l'eau fraîche du robinet pendant dix à quinze minutes. Si la brûlure est petite et la peau juste rouge, vous pouvez gérer à la maison. Si ça fait des cloques, ou si c'est au visage ou aux mains, voyez un médecin. »

« Ce qui me fait le plus peur, c'est l'étouffement. »

« Chaque parent devrait savoir ceci. Si votre enfant tousse fort, laissez-le tousser. Le corps essaie de dégager l'obstruction. Mais s'il ne peut pas tousser, pas pleurer, pas respirer — cinq tapes fermes dans le dos entre les omoplates, puis cinq compressions thoraciques rapides. Et appelez à l'aide. »

« Est-ce que je devrais avoir une trousse de premiers soins ? »

« Absolument. Des pansements, de la crème antiseptique, des pincettes, un thermomètre et le numéro du centre antipoison. Collez-le à l'intérieur d'une porte d'armoire. »

Bonne nuit, {childName}. Quelques égratignures veulent juste dire que tu as eu une journée courageuse.`,
      },
      {
        id: 'dsp_ep4_behavior', episodeNumber: 4, title: 'Grosses émotions, petit corps',
        subtitle: 'Les crises de colère, les questions difficiles et le mot NON — Dr. Spock explique.',
        tradition: 'universal', theme: 'behavior', durationMinutes: 2,
        value: 'patience',
        source: 'Dr. Spock raconte · Épisode 4',
        body: `« Dr. Spock, {childName} a fait une grosse crise à l'épicerie aujourd'hui. Des cris, des coups de pied, par terre. Tout le monde nous regardait. »

« Laissez-les regarder. Une crise de colère, ce n'est pas du mauvais parentage. C'est une petite personne avec de grosses émotions et pas encore les outils pour les gérer. »

« Qu'est-ce que je suis censé faire ? »

« Restez calme. Ne criez pas en retour — sinon c'est deux personnes qui font une crise. Ne cédez pas, parce que ça apprend à votre enfant que crier, ça marche. Restez juste là, tranquille et stable. Quand la tempête passe, prenez-le dans vos bras. Dites je t'aime même quand tu es fâché. »

« Et {childName} a commencé à dire NON à tout. »

« Tant mieux. Ça veut dire que votre enfant apprend qu'il est sa propre personne. Vous ne voulez pas un enfant qui ne dit jamais non — cet enfant-là ne dira non à personne. Fixez des limites fermement, mais choisissez vos batailles. Est-ce que ça compte vraiment si les bas ne sont pas assortis ? »

« Il y a autre chose. {childName} m'a demandé d'où viennent les bébés. »

Dr. Spock hocha la tête. « Répondez simplement et honnêtement. Un bébé grandit dans le ventre d'une maman, et quand le bébé est assez grand, le bébé sort. C'est généralement tout ce qu'un enfant de quatre ans veut savoir. S'il pose plus de questions, répondez davantage. Utilisez les vrais mots pour les parties du corps. Il n'y a pas de honte dans le corps humain. »

« Et les chicanes entre frères et sœurs ? {childName} a frappé le bébé. »

« La jalousie est naturelle. Votre enfant n'est pas méchant — il a peur de vous perdre. Passez du temps juste à deux. Dites tu es mon premier, et rien ne change ça. »

Bonne nuit, {childName}. Tes grosses émotions veulent dire que tu as un grand cœur.`,
      },
      {
        id: 'dsp_ep5_special', episodeNumber: 5, title: 'Chaque enfant brille',
        subtitle: 'Quand votre enfant est différent — Dr. Spock parle de handicap, de différence et d\'amour.',
        tradition: 'universal', theme: 'inclusion', durationMinutes: 2,
        value: 'compassion',
        source: 'Dr. Spock raconte · Épisode 5',
        body: `« Dr. Spock, on vient de recevoir le diagnostic. Le médecin a dit que {childName} a un retard de développement. Je n'ai pas arrêté de pleurer. »

« Alors pleurez. Le chagrin n'est pas de la faiblesse. Vous faites le deuil du chemin que vous imaginiez. C'est humain. »

« Je me sens coupable. Est-ce que j'ai fait quelque chose de mal ? »

« Vous n'avez rien fait de mal. Les handicaps ne sont pas des punitions. Ils ne sont pas causés par quelque chose que vous avez mangé ou une pensée que vous avez eue. Votre enfant est toujours votre enfant — le même rire, les mêmes yeux, la même petite main qui cherche la vôtre. »

« Mais qu'est-ce que je fais maintenant ? »

« D'abord, respirez. Ensuite, cherchez de l'aide tôt. L'intervention précoce fait une vraie différence — l'orthophonie, l'ergothérapie, les programmes d'éducation spécialisée. Plus vous commencez tôt, plus votre enfant peut grandir. »

« Est-ce que les autres enfants vont être gentils ? »

« Certains oui, certains non. C'est vrai pour tous les enfants. Ce qui compte, c'est que {childName} sache, chaque jour, qu'il est aimé exactement tel qu'il est. Pas malgré qui il est. À cause de qui il est. »

« Est-ce que je devrais traiter {childName} différemment ? »

« Gardez les mêmes attentes que pour n'importe quel enfant — adaptées, pas supprimées. Laissez votre enfant essayer, laissez-le avoir un peu de mal, laissez-le réussir. Surprotéger un enfant avec un handicap est aussi nuisible que de le négliger. »

« J'ai peur de ne pas être à la hauteur. »

« Aucun parent ne suffit seul. Construisez votre équipe — médecins, enseignants, thérapeutes, d'autres parents qui comprennent. Et rappelez-vous ce que je dis toujours. Faites-vous confiance. Vous connaissez cet enfant mieux que n'importe quel spécialiste. »

Bonne nuit, {childName}. Tu brilles à ta façon, et le monde est plus lumineux grâce à toi.`,
      },
    ],
  },
];
