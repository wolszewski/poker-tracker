import { describe, expect, it } from 'vitest'
import { pickLanguage } from './language'

describe('picking the language', () => {
  it('uses the language the Host chose before', () => {
    expect(pickLanguage('pl', ['en-GB'])).toBe('pl')
    expect(pickLanguage('en', ['pl-PL'])).toBe('en')
  })

  it('follows the browser on a first visit: Polish for pl, English otherwise', () => {
    expect(pickLanguage(null, ['pl-PL', 'en'])).toBe('pl')
    expect(pickLanguage(null, ['pl'])).toBe('pl')
    expect(pickLanguage(null, ['en-US', 'pl'])).toBe('en')
    expect(pickLanguage(null, ['de'])).toBe('en')
    expect(pickLanguage(null, [])).toBe('en')
  })

  it('ignores a saved value it does not know', () => {
    expect(pickLanguage('fr', ['pl-PL'])).toBe('pl')
    expect(pickLanguage('', ['en'])).toBe('en')
  })
})
