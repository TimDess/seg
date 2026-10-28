import Image from "next/image";

export default function TerritoryMap() {
  return (
    <figure className="territory-map">
      <div className="map-heading">
        <div>
          <span className="map-eyebrow">À VOS CÔTÉS</span>
          <h2>Val-d’Oise & Île-de-France</h2>
        </div>
        <span className="location-badge">
          <i aria-hidden="true" />
          Ennery · 95
        </span>
      </div>
      <div className="map-drawing">
        <Image
          src="/images/intervention-map.svg"
          width={480}
          height={300}
          alt="Carte de l’Île-de-France, avec le Val-d’Oise mis en évidence et le siège de SEG à Ennery"
          unoptimized
          priority
        />
        <span className="map-pin">Siège · Ennery</span>
        <span className="map-outside">Au-delà, selon projet</span>
      </div>
      <dl className="map-facts">
        <div>
          <dd>2015</dd>
          <dt>Création</dt>
        </div>
        <div>
          <dd>95</dd>
          <dt>Ancrage</dt>
        </div>
        <div>
          <dd>IDF</dd>
          <dt>Intervention</dt>
        </div>
      </dl>
      <figcaption className="sr-only">
        Basés dans le Val-d’Oise, présents en Île-de-France. Au-delà de la
        région, la faisabilité est étudiée selon le projet.
      </figcaption>
    </figure>
  );
}
