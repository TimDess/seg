export const services = [
  {
    slug: "renovation-electrique-tertiaire",
    number: "01",
    title: "Rénovation électrique tertiaire",
    short: "Faire évoluer vos espaces. Fiabiliser vos installations.",
    description:
      "Accompagner la transformation de vos bureaux, commerces et locaux professionnels avec une installation adaptée à leurs nouveaux usages.",
    items: [
      "État des lieux et compréhension des besoins",
      "Adaptation des circuits et de la distribution",
      "Modernisation de l’éclairage et des équipements",
      "Organisation des interventions selon les contraintes du site",
    ],
    context: "Un bâtiment change. Son installation aussi.",
    body: "Réaménagement des espaces, évolution des postes de travail, rénovation des locaux : les besoins électriques se transforment avec votre activité. SEG étudie votre projet et les contraintes de l’existant pour définir le périmètre des travaux.",
  },
  {
    slug: "installation-electrique-neuve",
    number: "02",
    title: "Installation électrique neuve",
    short: "Donner des bases solides à vos nouveaux projets.",
    description:
      "Intégrer les installations électriques à votre projet de construction, en coordination avec les autres intervenants.",
    items: [
      "Analyse des plans et des besoins du bâtiment",
      "Définition du périmètre d’installation",
      "Distribution et implantation des équipements",
      "Vérifications avant livraison",
    ],
    context: "Penser l’installation dès la construction.",
    body: "Une installation neuve se prépare en amont. Les usages attendus, l’implantation des espaces et le calendrier du chantier permettent de préciser l’intervention. Les capacités et limites de prestation sont confirmées lors de l’étude.",
  },
  {
    slug: "courants-forts-et-faibles",
    number: "03",
    title: "Courants forts et faibles",
    short: "Relier les équipements. Accompagner les usages.",
    description:
      "Aborder les besoins d’alimentation et de communication de votre bâtiment dans leur ensemble.",
    items: [
      "Distribution électrique et alimentation des équipements",
      "Éclairage et prises de courant",
      "Recueil des besoins en réseaux de communication",
      "Définition des prestations possibles après étude",
    ],
    context: "Des réseaux au service du bâtiment.",
    body: "Les courants forts alimentent les équipements. Les courants faibles transportent des signaux et des informations. Le périmètre précis proposé par SEG doit être confirmé selon les systèmes attendus ; aucune compétence spécifique en sécurité ou automatisation n’est présumée.",
  },
  {
    slug: "mise-en-conformite-electrique",
    number: "04",
    title: "Mise en conformité électrique",
    short: "Identifier les écarts. Préparer les bonnes interventions.",
    description:
      "Moderniser une installation existante et traiter les points identifiés dans le cadre de votre projet.",
    items: [
      "Lecture des rapports et documents disponibles",
      "Identification des travaux à prévoir",
      "Adaptation des protections et des circuits concernés",
      "Vérification des interventions réalisées",
    ],
    context: "Une démarche fondée sur l’existant.",
    body: "Un rapport de contrôle, une rénovation ou un changement d’usage peut révéler des adaptations nécessaires. SEG échange avec vous sur les constats disponibles et les interventions envisageables. Les contrôles réglementaires relevant d’un organisme habilité restent distincts des travaux.",
  },
];
export const nav = [
  { href: "/expertises", label: "Expertises" },
  { href: "/realisations", label: "Réalisations" },
  { href: "/entreprise", label: "L’entreprise" },
  { href: "/particuliers", label: "Particuliers" },
];
export const steps = [
  "Comprendre le besoin",
  "Définir l’intervention",
  "Préparer le chantier",
  "Réaliser les travaux",
  "Vérifier et livrer",
];
export const pages: Record<
  string,
  { title: string; eyebrow: string; description: string }
> = {
  expertises: {
    title: "La maîtrise technique.\nLe sens du détail.",
    eyebrow: "NOS EXPERTISES",
    description:
      "De la rénovation à l’installation neuve, des interventions électriques pensées pour les usages de vos bâtiments professionnels.",
  },
  realisations: {
    title: "Réalisations\n& inspirations.",
    eyebrow: "RÉALISATIONS",
    description:
      "Bureaux, locaux professionnels et arenas : une première exploration des projets électriques, en attendant les références de chantier documentées.",
  },
  entreprise: {
    title: "Une expertise technique.\nUne relation directe.",
    eyebrow: "L’ENTREPRISE",
    description:
      "SEG — Sadeq Électricité Générale. Une entreprise indépendante, créée en 2015 et implantée à Ennery, dans le Val-d’Oise.",
  },
  particuliers: {
    title: "Votre logement.\nLa même exigence.",
    eyebrow: "PARTICULIERS",
    description:
      "Vous préparez la rénovation électrique de votre logement ? Échangeons sur l’existant, vos usages et les travaux à envisager.",
  },
  "zones-intervention": {
    title: "Ancrés dans le Val-d’Oise.\nPrésents en Île-de-France.",
    eyebrow: "ZONE D’INTERVENTION",
    description:
      "Basée à Ennery, SEG accompagne principalement les projets en Île-de-France. Les interventions au-delà sont étudiées selon le projet.",
  },
  conseils: {
    title: "Les bonnes questions.\nAvant les travaux.",
    eyebrow: "CONSEILS & RESSOURCES",
    description:
      "Des repères pratiques pour préparer un premier échange et décrire votre projet électrique.",
  },
  "mentions-legales": {
    title: "Mentions légales",
    eyebrow: "INFORMATIONS LÉGALES",
    description:
      "Éditeur, hébergement, propriété intellectuelle et conditions d’utilisation du site.",
  },
  confidentialite: {
    title: "Vos données,\nen toute clarté.",
    eyebrow: "CONFIDENTIALITÉ",
    description:
      "Comprendre les informations utilisées lors d’une demande de projet.",
  },
  "projet-bureaux": {
    title: "Espaces de travail",
    eyebrow: "ILLUSTRATION — AUCUNE RÉFÉRENCE CLIENT",
    description:
      "Un aperçu des questions à étudier pour une rénovation de bureaux. Cette page ne décrit pas un chantier réalisé par SEG.",
  },
  "projet-locaux-professionnels": {
    title: "Locaux professionnels",
    eyebrow: "ILLUSTRATION — AUCUNE RÉFÉRENCE CLIENT",
    description:
      "Un exemple de contexte de projet à discuter. Cette page ne constitue pas une réalisation de SEG.",
  },
  "projet-accor-arena": {
    title: "Accor Arena",
    eyebrow: "PROJET FICTIF — ILLUSTRATION",
    description: "Une exploration fictive des besoins électriques d’un grand lieu événementiel, inspirée de l’Accor Arena. Aucun chantier ni lien commercial avec SEG n’est revendiqué.",
  },
  "projet-adidas-arena": {
    title: "Adidas Arena",
    eyebrow: "PROJET FICTIF — ILLUSTRATION",
    description: "Une exploration fictive de l’éclairage et des équipements d’une arena contemporaine, inspirée de l’Adidas Arena. Aucun chantier ni lien commercial avec SEG n’est revendiqué.",
  },
};

/** Illustrative contexts shared by the homepage and the initial portfolio. */
export const illustrativeProjects = [
  {
    title: "Espaces de travail",
    tag: "RÉNOVATION · TERTIAIRE",
    slug: "projet-bureaux",
    image: "bureaux.webp",
    description:
      "Réaménager des bureaux, adapter l’éclairage et accompagner l’évolution des usages électriques.",
  },
  {
    title: "Locaux professionnels",
    tag: "INSTALLATION · BÂTIMENT",
    slug: "projet-locaux-professionnels",
    image: "espaces.webp",
    description:
      "Préparer une installation électrique en tenant compte de l’activité et des équipements du bâtiment.",
  },
  {
    title: "Accor Arena",
    tag: "CONCEPT · ÉVÉNEMENTIEL",
    slug: "projet-accor-arena",
    image: "accor-arena.webp",
    description:
      "Imaginer l’éclairage des accès et les besoins d’alimentation d’un grand lieu événementiel. Projet fictif, sans lien avec SEG.",
  },
  {
    title: "Adidas Arena",
    tag: "CONCEPT · SPORT & SPECTACLE",
    slug: "projet-adidas-arena",
    image: "adidas-arena.webp",
    description:
      "Explorer les ambiances lumineuses et les usages électriques d’une arena contemporaine. Projet fictif, sans lien avec SEG.",
  },
];
