import { CodeEditor } from '@/components/inputs/CodeEditor'
import { useTypebot } from '@/features/editor/providers/TypebotProvider'
import { Stack, Text } from '@chakra-ui/react'
import { BubbleProps } from '@typebot.io/nextjs'
import { Typebot } from '@typebot.io/schemas'
import { useState } from 'react'
import { BubbleSettings } from '../../../settings/BubbleSettings/BubbleSettings'
import {
  parseInlineScript,
  parseInitBubbleCode,
  typebotImportCode,
  parseApiHostValue,
} from '../../../snippetParsers'
import { useScopedI18n } from '@/locales'

export const parseDefaultBubbleTheme = (typebot?: Typebot) => ({
  button: {
    backgroundColor: typebot?.theme.chat.buttons.backgroundColor,
    iconColor: typebot?.theme.chat.buttons.color,
  },
  previewMessage: {
    backgroundColor: typebot?.theme.general.background.content ?? 'white',
    textColor: 'black',
  },
})

export const ScriptBubbleInstructions = () => {
  const { typebot } = useTypebot()
  const [theme, setTheme] = useState<BubbleProps['theme']>(
    parseDefaultBubbleTheme(typebot)
  )
  const [previewMessage, setPreviewMessage] =
    useState<BubbleProps['previewMessage']>()

  const scriptSnippet = parseInlineScript(
    `${typebotImportCode}

${parseInitBubbleCode({
  typebot: typebot?.publicId ?? '',
  apiHost: parseApiHostValue(typebot?.customDomain),
  theme,
  previewMessage,
})}`
  )
  const scopedT = useScopedI18n('share')

  return (
    <Stack spacing={4}>
      <BubbleSettings
        theme={theme}
        previewMessage={previewMessage}
        defaultPreviewMessageAvatar={typebot?.theme.chat.hostAvatar?.url ?? ''}
        onThemeChange={setTheme}
        onPreviewMessageChange={setPreviewMessage}
      />
      <Text>{scopedT('Run this script to initialize the MyTalk')}</Text>
      <CodeEditor isReadOnly value={scriptSnippet} lang="javascript" />
    </Stack>
  )
}
