import { create } from 'zustand'
import { v4 as uuidv4 } from 'uuid'

const STORAGE_KEY = 'cyberaudit_data'

const loadFromStorage = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : null
  } catch { return null }
}

const saveToStorage = (state) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      audits: state.audits,
      companies: state.companies,
      risks: state.risks
    }))
  } catch {}
}

const saved = loadFromStorage()

export const useAuditStore = create((set, get) => ({
  // ── State ──
  audits: saved?.audits || [],
  companies: saved?.companies || [
    { id: 'demo-corp', name: 'Demo Corp SA', sector: 'Finance', size: '250 employés', contact: 'rssi@democorp.fr' }
  ],
  risks: saved?.risks || [],
  currentAudit: null,

  // ── Companies ──
  addCompany: (company) => {
    const newCompany = { id: uuidv4(), ...company }
    set(s => {
      const companies = [...s.companies, newCompany]
      saveToStorage({ ...s, companies })
      return { companies }
    })
    return newCompany
  },

  // ── Audits ──
  createAudit: ({ companyId, referentialId, name }) => {
    const audit = {
      id: uuidv4(),
      companyId,
      referentialId,
      name,
      status: 'in_progress',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      responses: {},
      notes: {},
      score: null,
      domainScores: {},
      aiAnalysis: null,
      actionPlan: []
    }
    set(s => {
      const audits = [...s.audits, audit]
      saveToStorage({ ...s, audits })
      return { audits, currentAudit: audit }
    })
    return audit
  },

  setCurrentAudit: (auditId) => {
    const audit = get().audits.find(a => a.id === auditId)
    set({ currentAudit: audit || null })
  },

  updateResponse: (auditId, controlId, value, note = '') => {
    set(s => {
      const audits = s.audits.map(a => {
        if (a.id !== auditId) return a
        const responses = { ...a.responses, [controlId]: value }
        const notes = { ...a.notes, [controlId]: note }
        return { ...a, responses, notes, updatedAt: new Date().toISOString() }
      })
      const currentAudit = audits.find(a => a.id === auditId)
      saveToStorage({ ...s, audits })
      return { audits, currentAudit }
    })
  },

  saveAuditScore: (auditId, score, domainScores) => {
    set(s => {
      const audits = s.audits.map(a =>
        a.id === auditId
          ? { ...a, score, domainScores, status: 'completed', updatedAt: new Date().toISOString() }
          : a
      )
      const currentAudit = audits.find(a => a.id === auditId)
      saveToStorage({ ...s, audits })
      return { audits, currentAudit }
    })
  },

  saveAIAnalysis: (auditId, analysis) => {
    set(s => {
      const audits = s.audits.map(a =>
        a.id === auditId ? { ...a, aiAnalysis: analysis, updatedAt: new Date().toISOString() } : a
      )
      saveToStorage({ ...s, audits })
      return { audits }
    })
  },

  saveActionPlan: (auditId, actionPlan) => {
    set(s => {
      const audits = s.audits.map(a =>
        a.id === auditId ? { ...a, actionPlan, updatedAt: new Date().toISOString() } : a
      )
      saveToStorage({ ...s, audits })
      return { audits }
    })
  },

  deleteAudit: (auditId) => {
    set(s => {
      const audits = s.audits.filter(a => a.id !== auditId)
      saveToStorage({ ...s, audits })
      return { audits, currentAudit: s.currentAudit?.id === auditId ? null : s.currentAudit }
    })
  },

  // ── Risks ──
  addRisk: (risk) => {
    const newRisk = { id: uuidv4(), ...risk, createdAt: new Date().toISOString() }
    set(s => {
      const risks = [...s.risks, newRisk]
      saveToStorage({ ...s, risks })
      return { risks }
    })
  },

  updateRisk: (riskId, updates) => {
    set(s => {
      const risks = s.risks.map(r => r.id === riskId ? { ...r, ...updates } : r)
      saveToStorage({ ...s, risks })
      return { risks }
    })
  },

  deleteRisk: (riskId) => {
    set(s => {
      const risks = s.risks.filter(r => r.id !== riskId)
      saveToStorage({ ...s, risks })
      return { risks }
    })
  }
}))
