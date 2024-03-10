
import "@plasmohq/messaging"

interface MmMetadata {
	"removeAuth" : {}
	"saveAuth" : {}
}

interface MpMetadata {
	
}

declare module "@plasmohq/messaging" {
  interface MessagesMetadata extends MmMetadata {}
  interface PortsMetadata extends MpMetadata {}
}
