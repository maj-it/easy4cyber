const BASE = 'https://recherche-entreprises.api.gouv.fr'

export async function searchEntreprises(query) {
  if (!query || query.length < 3) return []
  const res = await fetch(`${BASE}/search?q=${encodeURIComponent(query)}&page=1&per_page=5`)
  if (!res.ok) return []
  const data = await res.json()
  return (data.results || []).map(e => ({
    siren: e.siren,
    siret: e.siege?.siret || '',
    name: e.nom_complet || e.nom_raison_sociale,
    naf: e.activite_principale,
    naf_label: e.libelle_activite_principale || '',
    adresse: e.siege?.adresse || '',
    ville: e.siege?.commune || '',
    cp: e.siege?.code_postal || '',
    effectif: e.tranche_effectif_salarie || '',
    forme_juridique: e.nature_juridique || '',
    date_creation: e.date_creation || '',
    statut: e.etat_administratif === 'A' ? 'Actif' : 'Fermé'
  }))
}
