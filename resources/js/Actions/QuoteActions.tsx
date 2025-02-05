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
  let prevState: Quote | null = null

  const onLike = (_e: React.MouseEvent, isActive: boolean) => {
    const auth = { headers: { Authorization: `Bearer ${token}` } }
    prevState = prevState ? null : structuredClone(quoteProps)
    const user_upvoted = !quoteProps.user_upvoted
    let upvotes = quoteProps.upvotes

    if (isActive)
      upvotes--
    else upvotes++

    updateQuote({ ...quoteProps, upvotes, user_upvoted })

    axios.post(`/api/quotes/${isActive ? 'un' : ''}like`, { quoteID: quoteProps.id }, auth)
      .catch((e) => {
        handleHttpError(e)
        if (prevState)
          updateQuote(prevState)
      })
  }

  const onSave = (_e: React.MouseEvent, isActive: boolean) => {
    const auth = { headers: { Authorization: `Bearer ${token}` } }
    prevState = prevState ? null : structuredClone(quoteProps)
    const user_saved = !quoteProps.user_saved
    let saves = quoteProps.saves

    if (isActive)
      saves--
    else saves++

    updateQuote({ ...quoteProps, user_saved, saves })
    axios.post(`/api/quotes/${isActive ? 'un' : ''}save`, { quoteID: quoteProps.id }, auth)
      .catch((e) => {
        handleHttpError(e)
        if (prevState)
          updateQuote(prevState)
      })
  }

  return {
    onLike,
    onSave,
  }
}
