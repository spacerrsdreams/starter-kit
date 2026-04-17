"use client"

import type { ChatSessionCitationsProps } from "@/features/ai/chat/types/chat-citations.types"
import {
  InlineCitation,
  InlineCitationCard,
  InlineCitationCardBody,
  InlineCitationCardTrigger,
  InlineCitationCarousel,
  InlineCitationCarouselContent,
  InlineCitationCarouselHeader,
  InlineCitationCarouselIndex,
  InlineCitationCarouselItem,
  InlineCitationCarouselNext,
  InlineCitationCarouselPrev,
  InlineCitationSource,
  InlineCitationText,
} from "@/components/ai-elements/inline-citation"

export function ChatSessionCitations({ sources }: ChatSessionCitationsProps) {
  if (sources.length === 0) {
    return null
  }

  return (
    <div className="mt-1 flex flex-wrap items-center gap-2">
      {sources.map((source, index) => (
        <InlineCitation key={`${source.sourceId}:${source.url}`}>
          <InlineCitationText className="text-muted-foreground text-xs">[{index + 1}]</InlineCitationText>
          <InlineCitationCard>
            <InlineCitationCardTrigger sources={[source.url]} />
            <InlineCitationCardBody>
              <InlineCitationCarousel>
                <InlineCitationCarouselHeader>
                  <InlineCitationCarouselPrev />
                  <InlineCitationCarouselNext />
                  <InlineCitationCarouselIndex />
                </InlineCitationCarouselHeader>
                <InlineCitationCarouselContent>
                  <InlineCitationCarouselItem>
                    <InlineCitationSource title={source.title ?? source.url} url={source.url} />
                  </InlineCitationCarouselItem>
                </InlineCitationCarouselContent>
              </InlineCitationCarousel>
            </InlineCitationCardBody>
          </InlineCitationCard>
        </InlineCitation>
      ))}
    </div>
  )
}
