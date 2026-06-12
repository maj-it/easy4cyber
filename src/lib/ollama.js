const OLLAMA_BASE = 'http://localhost:11434'
const MODEL = 'qwen2.5-coder:7b'

export async function ollamaChat(messages, onChunk = null) {
  const response = await fetch(`${OLLAMA_BASE}/api/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: MODEL,
      messages,
      stream: !!onChunk
    })
  })

  if (!response.ok) throw new Error(`Ollama error: ${response.status}`)

  if (onChunk) {
    const reader = response.body.getReader()
    const decoder = new TextDecoder()
    let full = ''
    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      const lines = decoder.decode(value).split('\n').filter(Boolean)
      for (const line of lines) {
        try {
          const data = JSON.parse(line)
          if (data.message?.content) {
            full += data.message.content
            onChunk(data.message.content, full)
          }
        } catch {}
      }
    }
    return full
  } else {
    const data = await response.json()
    return data.message?.content || ''
  }
}

export async function analyzeAuditResponses(referential, responses, domainScores) {
  const lowDomains = Object.entries(domainScores)
    .filter(([, score]) => score < 60)
    .map(([domain, score]) => `${domain}: ${score}%`)
    .join(', ')

  const nonConformControls = Object.entries(responses)
    .filter(([, v]) => v === 0 || v === 'non_conforme')
    .map(([id]) => id)
    .join(', ')

  const prompt = `Tu es un expert en cybersécurité et conformité GRC. 
Analyse les résultats d'un audit ${referential.name}.

DOMAINES FAIBLES (score < 60%): ${lowDomains || 'Aucun'}
CONTRÔLES NON CONFORMES: ${nonConformControls || 'Aucun'}
SCORE GLOBAL: ${Math.round(Object.values(domainScores).reduce((a, b) => a + b, 0) / Object.values(domainScores).length)}%

Fournis une analyse structurée en JSON avec:
{
  "resume": "résumé exécutif en 2-3 phrases",
  "points_forts": ["point 1", "point 2", "point 3"],
  "faiblesses_critiques": ["faiblesse 1", "faiblesse 2", "faiblesse 3"],
  "niveau_maturite": "Initial|Répétable|Défini|Géré|Optimisé",
  "risque_global": "Critique|Élevé|Moyen|Faible",
  "recommandations": [
    {"priorite": "P1", "action": "action", "delai": "délai", "impact": "impact attendu"}
  ]
}

Réponds UNIQUEMENT avec le JSON, sans markdown ni texte supplémentaire.`

  const content = await ollamaChat([{ role: 'user', content: prompt }])
  try {
    return JSON.parse(content.replace(/```json|```/g, '').trim())
  } catch {
    return {
      resume: content.substring(0, 200),
      points_forts: [],
      faiblesses_critiques: [],
      niveau_maturite: 'Défini',
      risque_global: 'Moyen',
      recommandations: []
    }
  }
}

export async function explainControl(controlId, controlName, controlDescription) {
  const prompt = `Tu es un expert en cybersécurité. Explique le contrôle ${controlId} - "${controlName}" de manière pratique.

Description officielle: ${controlDescription}

Réponds en JSON:
{
  "objectif": "objectif en 1 phrase claire",
  "preuves_attendues": ["preuve 1", "preuve 2", "preuve 3"],
  "risques_si_absent": ["risque 1", "risque 2"],
  "mise_en_oeuvre": "comment l'implémenter concrètement en 2-3 phrases",
  "exemple_pratique": "exemple concret d'une PME"
}

Réponds UNIQUEMENT avec le JSON.`

  const content = await ollamaChat([{ role: 'user', content: prompt }])
  try {
    return JSON.parse(content.replace(/```json|```/g, '').trim())
  } catch {
    return {
      objectif: controlDescription,
      preuves_attendues: ['Documentation', 'Procédures', 'Logs'],
      risques_si_absent: ['Non-conformité', 'Incident de sécurité'],
      mise_en_oeuvre: 'Consulter la documentation officielle.',
      exemple_pratique: 'À définir selon le contexte.'
    }
  }
}

export async function generateActionPlan(referential, responses, domainScores) {
  const nonConformControls = Object.entries(responses)
    .filter(([, v]) => v === 0 || v === 'non_conforme')
    .map(([id]) => id)

  const partialControls = Object.entries(responses)
    .filter(([, v]) => v === 1 || v === 'partiel')
    .map(([id]) => id)

  const prompt = `Expert GRC. Génère un plan d'actions pour l'audit ${referential.name}.

NON CONFORMES (priorité P1): ${nonConformControls.join(', ') || 'Aucun'}
PARTIELS (priorité P2): ${partialControls.join(', ') || 'Aucun'}

Génère un plan en JSON:
[
  {
    "id": "PA-001",
    "controle": "id du contrôle",
    "action": "action concrète à mener",
    "responsable": "RSSI|DSI|DPO|Direction|RH",
    "priorite": "P1|P2|P3",
    "delai": "30 jours|60 jours|90 jours|6 mois",
    "effort": "Faible|Moyen|Élevé",
    "cout": "Sans coût|< 5k€|5-20k€|> 20k€",
    "statut": "A faire"
  }
]

Maximum 10 actions. Réponds UNIQUEMENT avec le JSON array.`

  const content = await ollamaChat([{ role: 'user', content: prompt }])
  try {
    return JSON.parse(content.replace(/```json|```/g, '').trim())
  } catch {
    return nonConformControls.slice(0, 5).map((id, i) => ({
      id: `PA-00${i + 1}`,
      controle: id,
      action: `Mettre en conformité le contrôle ${id}`,
      responsable: 'RSSI',
      priorite: 'P1',
      delai: '30 jours',
      effort: 'Moyen',
      cout: 'Sans coût',
      statut: 'A faire'
    }))
  }
}
