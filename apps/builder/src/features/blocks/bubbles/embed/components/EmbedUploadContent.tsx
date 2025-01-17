import { TextInput, NumberInput } from '@/components/inputs'
import { HStack, Stack, Text } from '@chakra-ui/react'
import { EmbedBubbleContent } from '@typebot.io/schemas'
import { sanitizeUrl } from '@typebot.io/lib'
import { useScopedI18n } from '@/locales'

type Props = {
  content: EmbedBubbleContent
  onSubmit: (content: EmbedBubbleContent) => void
}

export const EmbedUploadContent = ({ content, onSubmit }: Props) => {
  const handleUrlChange = (url: string) => {
    const iframeUrl = sanitizeUrl(
      url.trim().startsWith('<iframe') ? extractUrlFromIframe(url) : url
    )
    onSubmit({ ...content, url: iframeUrl })
  }

  const handleHeightChange = (height?: EmbedBubbleContent['height']) =>
    height && onSubmit({ ...content, height })

    const scopedT = useScopedI18n('build')

  return (
    <Stack p="2" spacing={6}>
      <Stack>
        <TextInput
          placeholder={scopedT("Paste the link or code...")}
          defaultValue={content?.url ?? ''}
          onChange={handleUrlChange}
        />
        <Text fontSize="sm" color="gray.400" textAlign="center">
          {scopedT("Works with PDFs, iframes, websites...")}
        </Text>
      </Stack>

      <HStack>
        <NumberInput
          label={scopedT("Height:")}
          defaultValue={content?.height}
          onValueChange={handleHeightChange}
        />
        <Text>px</Text>
      </HStack>
    </Stack>
  )
}

const extractUrlFromIframe = (iframe: string) =>
  [...iframe.matchAll(/src="([^"]+)"/g)][0][1]
