# SEG — Sadeq Électricité Générale

Site français Next.js App Router, TypeScript et Tailwind CSS. Direction visuelle claire et accessible : blanc cassé, graphite et bleu SEG, cartes arrondies, typographie Geist locale et animations progressives. Deux sections graphite conservent un contraste ponctuel. Contenus séparés dans `src/lib/content.ts`, composants communs dans `src/components`, médias locaux dans `public/images`.

## Développement

Node.js 22 ou 24. Depuis `/workspace/seg` :

```sh
npm ci --cache /workspace/.npm
npm run dev
```

```sh
npm run build
npm run start
npm run typecheck
npm test
```

Les tests navigateur utilisent Chromium système (`/usr/bin/chromium`). En production, lancer `npm run start` après compilation. Le service écoute le port 3000 par défaut (`PORT` peut le modifier).

## Formulaire de contact

Copier `.env.example` vers `.env.local` et renseigner les paramètres côté serveur. Ne jamais versionner les secrets.

- `CONTACT_WEBHOOK_URL` : endpoint HTTPS de réception à configurer avec le destinataire réel. Reçoit un POST multipart avec `profile`, `company`, `name`, `email`, `phone`, `location`, `project`, `building`, `schedule`, `description`, `consent` et `document` facultatif.
- `CONTACT_WEBHOOK_TOKEN` : authentification Bearer facultative, conservée côté serveur.
- Le récepteur doit accepter l’envoi et retourner un statut 2xx uniquement après prise en charge. Il doit assurer la livraison, le stockage sécurisé éventuel et les durées de conservation. Aucun fournisseur n’est présumé ni configuré.
- Sans endpoint, réponse explicite 503 : aucune fausse confirmation. Erreur distante : 502. Validation des champs, consentement et pièce jointe PDF/JPEG/PNG/WebP ≤ 5 Mo. Limitation locale de cinq soumissions par dix minutes ; pour plusieurs instances, prévoir un stockage de limitation partagé et une protection antispam au niveau de la plateforme.
- Tester la réception réelle et les pièces jointes avant publication. Les tests automatisés vérifient les erreurs et une réception simulée ; ils ne démontrent pas une livraison à SEG.

## Avant publication

- Logo : image fournie conservée dans `public/images/seg-logo.png`. Les déclinaisons vectorielles sur fonds clair (`seg-logo.svg`) et sombre (`seg-logo-dark.svg`) reprennent les mêmes tracés présents dans le HTML de référence.
- Références : aucune référence disponible à ce stade. La page Réalisations affiche un état « en préparation » ; les images de l’accueil restent explicitement illustratives. Ajouter les vrais projets lorsque disponibles.
- Confirmer le périmètre technique, la méthode, les portraits et les qualifications. Aucun témoignage, certification ou chiffre inventé.
- Compléter l’identité juridique, coordonnées, hébergeur, responsable de traitement, base légale, conservation et contact RGPD dans les pages légales.
- Valider le service de réception du formulaire.
- Auditer les anciennes URL et renseigner les redirections dans `next.config.ts` après inventaire : l’ancien site n’était pas accessible depuis cet environnement (403 réseau). Aucune redirection ne peut être inventée.
- Configurer le domaine canonique si différent de `https://s-e-g.fr` (layout, sitemap, robots et métadonnées).
- L’indexation est de nouveau bloquée avant livraison (`noindex, nofollow` et `Disallow: /`). Le verrou `publicationApproved = false` dans `src/lib/indexing.ts` s’applique aussi en production et prévaut sur un ancien `SITE_INDEXABLE=true` utilisé pour le test PageSpeed. Lors de la livraison, passer `publicationApproved` à `true` et configurer l’indexation, puis reconstruire et redéployer. La balise et `robots.txt` partagent la même règle.

Aucun outil publicitaire, analytics ou cookie non essentiel. Les polices sont hébergées localement. Les images sont optimisées par Next.js et restent remplaçables par fichier. Sitemap et données structurées Electrician inclus.

## Style et animations de référence

Le HTML fourni le 28 octobre 2026 sert uniquement de référence visuelle. Ses coordonnées, références clients et prestations supplémentaires ne sont pas importées. Les contenus, pages, métadonnées et le service de contact existants restent conservés.

- Geist et la carte SVG sont extraits des ressources incorporées au HTML, puis servis localement ; aucun script distant du document n’est repris.
- Animations CSS du titre, de la carte et du bandeau d’expertises, avec bouton pause.
- Révélations au défilement via IntersectionObserver et léger éclairage au survol des cartes sur les appareils avec souris.
- `prefers-reduced-motion` arrête les animations et garde les contenus visibles ; les contenus restent lisibles sans JavaScript. Les effets de survol ne sont pas nécessaires à la navigation.
- Les tests couvrent aussi la pause du bandeau, les révélations, la réduction du mouvement et le rendu sans JavaScript.

## Accroche validée

Titre d’accueil : « Votre entreprise d’électricité générale en Île-de-France. »

Sous-titre : « SEG accompagne les professionnels et les particuliers dans leurs projets de rénovation et d’installation électrique depuis 2015. »

La signature « L’exigence, jusque dans les détails. » reste dans le pied de page.

## Choix du thème

Un interrupteur dans l’en-tête, avec soleil à gauche, lune à droite et curseur coulissant, permet de basculer entre les versions claire et sombre sur toutes les pages. Sans choix enregistré, le site suit `prefers-color-scheme`, y compris si cette préférence change pendant la visite. Le choix explicite est conservé dans `localStorage` (`seg-theme`) et synchronisé entre onglets. Si le stockage est bloqué, le bouton reste fonctionnel pendant la visite.

Le script d’initialisation dans le head applique la préférence avant le premier affichage pour éviter un éclair clair lors d’un chargement en sombre. Sans JavaScript, la version claire reste accessible. Les palettes sont dans `globals.css` et `dark-theme.css` ; les tracés SVG partagés du logo et de la carte utilisent les couleurs du thème.
