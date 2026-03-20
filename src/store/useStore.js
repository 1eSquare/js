import { useState, useEffect, createContext, useContext } from 'react'
import { translations } from '../i18n'

// ── helpers ──────────────────────────────────────────────────────────────────
const read = (key, fallback) => {
  try {
    const v = localStorage.getItem(key)
    return v ? JSON.parse(v) : fallback
  } catch {
    return fallback
  }
}

const write = (key, value) => {
  try { localStorage.setItem(key, JSON.stringify(value)) } catch {}
}

const uid = () => Math.random().toString(36).slice(2) + Date.now().toString(36)

// ── Language ──────────────────────────────────────────────────────────────────
export const LangContext = createContext(null)

export function useLang() {
  return useContext(LangContext)
}

export function useLangStore() {
  const [lang, setLangState] = useState(() => read('ap_lang', 'en'))

  const setLang = (l) => {
    setLangState(l)
    write('ap_lang', l)
  }

  const t = (key) => translations[lang]?.[key] ?? translations.en[key] ?? key

  return { lang, setLang, t }
}

// ── Jobs ──────────────────────────────────────────────────────────────────────
export function useJobs() {
  const [jobs, setJobsState] = useState(() => read('ap_jobs', []))

  const persist = (data) => { setJobsState(data); write('ap_jobs', data) }

  const addJob = (job) => persist([{ id: uid(), createdAt: new Date().toISOString(), ...job }, ...jobs])

  const updateJob = (id, patch) =>
    persist(jobs.map(j => j.id === id ? { ...j, ...patch, updatedAt: new Date().toISOString() } : j))

  const deleteJob = (id) => persist(jobs.filter(j => j.id !== id))

  return { jobs, addJob, updateJob, deleteJob }
}

// ── CVs ───────────────────────────────────────────────────────────────────────
export function useCVs() {
  const [cvs, setCVsState] = useState(() => read('ap_cvs', []))

  const persist = (data) => { setCVsState(data); write('ap_cvs', data) }

  const addCV = (cv) => persist([{ id: uid(), uploadedAt: new Date().toISOString(), ...cv }, ...cvs])

  const updateCV = (id, patch) => persist(cvs.map(c => c.id === id ? { ...c, ...patch } : c))

  const deleteCV = (id) => persist(cvs.filter(c => c.id !== id))

  return { cvs, addCV, updateCV, deleteCV }
}

// ── Accounts ──────────────────────────────────────────────────────────────────
export function useAccounts() {
  const [accounts, setAccountsState] = useState(() => read('ap_accounts', []))

  const persist = (data) => { setAccountsState(data); write('ap_accounts', data) }

  const addAccount = (acc) => persist([{ id: uid(), createdAt: new Date().toISOString(), ...acc }, ...accounts])

  const updateAccount = (id, patch) => persist(accounts.map(a => a.id === id ? { ...a, ...patch } : a))

  const deleteAccount = (id) => persist(accounts.filter(a => a.id !== id))

  return { accounts, addAccount, updateAccount, deleteAccount }
}

// ── App-level store context ───────────────────────────────────────────────────
export const StoreContext = createContext(null)

export function useAppStore() {
  return useContext(StoreContext)
}
