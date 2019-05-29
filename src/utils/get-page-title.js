import defaultSettings from '@/settings'

const title = defaultSettings.title || 'Vue Flow Editor'

export default function getPageTitle(pageTitle) {
  if (pageTitle) {
    return `${pageTitle} - ${title}`
  }
  return `${title}`
}
