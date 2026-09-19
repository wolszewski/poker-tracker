// The wording for the chosen language, shared with every component through React context.

import { createContext, useContext } from 'react'
import { en, type Dictionary } from './en'
import type { Language } from './language'
import { pl } from './pl'

export const dictionaries: Record<Language, Dictionary> = { en, pl }

export const TextContext = createContext<Dictionary>(en)

export const useText = (): Dictionary => useContext(TextContext)
