import { Alert, AlertIcon, Button, Link, Stack, Text } from '@chakra-ui/react'
import { ExternalLinkIcon } from '@/components/icons'
import { useTypebot } from '@/features/editor/providers/TypebotProvider'
import { MakeComBlock, Webhook, WebhookOptions } from '@typebot.io/schemas'
import React, { useCallback, useEffect, useState } from 'react'
import { byId } from '@typebot.io/lib'
import { WebhookAdvancedConfigForm } from '../../webhook/components/WebhookAdvancedConfigForm'
import { useScopedI18n } from '@/locales'

type Props = {
  block: MakeComBlock
  onOptionsChange: (options: WebhookOptions) => void
}

export const MakeComSettings = ({
  block: { webhookId, id: blockId, options },
  onOptionsChange,
}: Props) => {
  const { webhooks, updateWebhook } = useTypebot()
  const webhook = webhooks.find(byId(webhookId))

  const [localWebhook, _setLocalWebhook] = useState(webhook)

  const setLocalWebhook = useCallback(
    async (newLocalWebhook: Webhook) => {
      _setLocalWebhook(newLocalWebhook)
      await updateWebhook(newLocalWebhook.id, newLocalWebhook)
    },
    [updateWebhook]
  )

  useEffect(() => {
    if (
      !localWebhook ||
      localWebhook.url ||
      !webhook?.url ||
      webhook.url === localWebhook.url
    )
      return
    setLocalWebhook({
      ...localWebhook,
      url: webhook?.url,
    })
  }, [webhook, localWebhook, setLocalWebhook])
  const scopedT = useScopedI18n('build')

  return (
    <Stack spacing={4}>
      <Alert status={localWebhook?.url ? 'success' : 'info'} rounded="md">
        <AlertIcon />
        {localWebhook?.url ? (
          <>{scopedT('Your scenario is correctly configured')} 🚀</>
        ) : (
          <Stack>
            <Text>{scopedT('Head up to Make.com to configure this block')}</Text>
            <Button
              as={Link}
              href="https://www.make.com/en/integrations/typebot"
              isExternal
              colorScheme="blue"
            >
              <Text mr="2">Make.com</Text> <ExternalLinkIcon />
            </Button>
          </Stack>
        )}
      </Alert>
      {localWebhook && (
        <WebhookAdvancedConfigForm
          blockId={blockId}
          webhook={localWebhook}
          options={options}
          onWebhookChange={setLocalWebhook}
          onOptionsChange={onOptionsChange}
        />
      )}
    </Stack>
  )
}
