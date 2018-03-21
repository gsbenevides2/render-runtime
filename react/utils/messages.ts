import { NormalizedCacheObject } from 'apollo-cache-inmemory'
import ApolloClient from 'apollo-client'
import {canUseDOM} from 'exenv'
import messagesQuery from './messages.graphql'

const YEAR_IN_MS = 12 * 30 * 24 * 60 * 60 * 1000

const acceptJson = canUseDOM ? new Headers({
  'Accept': 'application/json',
}) : undefined

const acceptAndContentJson = canUseDOM ? new Headers({
  'Accept': 'application/json',
  'Content-Type': 'application/json',
}) : undefined

export const fetchMessagesForApp = (apolloClient: ApolloClient<NormalizedCacheObject>, app: string, locale: string) =>
  apolloClient.query<{messages: string}>({query: messagesQuery, variables: {app, locale}})
    .then<RenderRuntime['messages']>(result => {
      const messagesJSON = result.data.messages
      return JSON.parse(messagesJSON)
    })

export const fetchMessages = (graphQlUri: string) =>
  fetch(graphQlUri.replace('=graphql', '=messages'), {
    credentials: 'include',
    headers: acceptJson,
  }).then<RenderRuntime['messages']>(res => res.json())

export const createLocaleCookie = (locale: string) => {
  const yearFromNow = Date.now() + YEAR_IN_MS
  const expires = new Date(yearFromNow).toUTCString()
  const localeCookie = `locale=${locale};path=/;expires=${expires}`
  window.document.cookie = localeCookie
}
