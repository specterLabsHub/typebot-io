import { Stack, Text } from '@chakra-ui/react'
import { InputWithVariableButton } from 'components/shared/TextboxWithVariableButton/InputWithVariableButton'
import { VideoBubbleContent, VideoBubbleContentType } from 'models'
import urlParser from 'js-video-url-parser/lib/base'
import 'js-video-url-parser/lib/provider/vimeo'
import 'js-video-url-parser/lib/provider/youtube'
import { isDefined } from 'utils'

type Props = {
  content?: VideoBubbleContent
  onSubmit: (content: VideoBubbleContent) => void
}

export const VideoUploadContent = ({ content, onSubmit }: Props) => {
  const handleUrlChange = (url: string) => {
    const info = urlParser.parse(url)
    return isDefined(info) && info.provider && info.id
      ? onSubmit({
          type: info.provider as VideoBubbleContentType,
          url,
          id: info.id,
        })
      : onSubmit({ type: VideoBubbleContentType.URL, url })
  }
  return (
    <Stack p="2">
      <InputWithVariableButton
        placeholder="Paste the video link..."
        initialValue={content?.url ?? ''}
        onChange={handleUrlChange}
      />
      <Text fontSize="sm" color="gray.400" textAlign="center">
        Works with Youtube, Vimeo and others
      </Text>
    </Stack>
  )
}