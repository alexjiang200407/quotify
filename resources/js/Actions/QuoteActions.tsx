import type { Quote } from '../types/httpResponseTypes'
import axios from 'axios'
import { useNotification } from '../Components/NotificationProvider'
import { useAppSelector } from '../Datastore/hooks'
import { useExplore } from '../Pages/Explore'

export interface QuoteActions {
  onLike: (e: React.MouseEvent, isActive: boolean) => void
  onSave: (e: React.MouseEvent, isActive: boolean) => void
}

export function useQuoteActions(quoteProps: Quote): QuoteActions {
  const { handleHttpError } = useNotification()
  const token = useAppSelector(state => state.auth.token)
  const { updateQuote } = useExplore()

  const onLike = (_e: React.MouseEvent, isActive: boolean) => {
    const auth = { headers: { Authorization: `Bearer ${token}` } }
    const prevState = structuredClone(quoteProps)
    quoteProps.user_upvoted = !quoteProps.user_upvoted

    if (isActive) {
      quoteProps.upvotes--
    }
    else {
      quoteProps.upvotes++
    }
    updateQuote(quoteProps)

    axios.post(`/api/quotes/${isActive ? 'un' : ''}like`, { quoteID: quoteProps.id }, auth)
      .catch((e) => {
        handleHttpError(e)
        updateQuote(prevState)
      })
  }

  const onSave = (_e: React.MouseEvent, isActive: boolean) => {
    const auth = { headers: { Authorization: `Bearer ${token}` } }
    const prevState = structuredClone(quoteProps)
    quoteProps.user_saved = !quoteProps.user_saved

    if (isActive) {
      quoteProps.saves--
    }
    else {
      quoteProps.saves++
    }
    updateQuote(quoteProps)
    axios.post(`/api/quotes/${isActive ? 'un' : ''}save`, { quoteID: quoteProps.id }, auth)
      .catch((e) => {
        handleHttpError(e)
        updateQuote(prevState)
      })
  }

  return {
    onLike,
    onSave,
  }
}
