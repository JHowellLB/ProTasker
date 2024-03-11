// @ts-nocheck
globalThis.__plasmoInternalPortMap = new Map()

import { default as messagesRemoveAuth } from "~background/messages/removeAuth"
import { default as messagesSaveAuth } from "~background/messages/saveAuth"

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  switch (request.name) {
    case "removeAuth":
  messagesRemoveAuth({
    sender,
    ...request
  }, {
    send: (p) => sendResponse(p)
  })
  break
case "saveAuth":
  messagesSaveAuth({
    sender,
    ...request
  }, {
    send: (p) => sendResponse(p)
  })
  break
    default:
      break
  }

  return true
})

chrome.runtime.onConnect.addListener(function(port) {
  globalThis.__plasmoInternalPortMap.set(port.name, port)
  port.onMessage.addListener(function(request) {
    switch (port.name) {
      
      default:
        break
    }
  })
})

