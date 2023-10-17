import {
  Flex,
  HStack,
  Button,
  IconButton,
  Tooltip,
  Spinner,
  Text,
  useColorModeValue,
} from '@chakra-ui/react'
import {
  ChevronLeftIcon,
  RedoIcon,
  UndoIcon,
} from '@/components/icons'
import { useRouter } from 'next/router'
import React, { useState } from 'react'
import { isDefined, isNotDefined } from '@typebot.io/lib'
import { EditableTypebotName } from './EditableTypebotName'
import Link from 'next/link'
import { EditableEmojiOrImageIcon } from '@/components/EditableEmojiOrImageIcon'
import { useUndoShortcut } from '@/hooks/useUndoShortcut'
import { useDebouncedCallback } from 'use-debounce'
import { PublishButton } from '@/features/publish/components/PublishButton'
import { headerHeight } from '../constants'
import { RightPanel, useEditor } from '../providers/EditorProvider'
import { useTypebot } from '../providers/TypebotProvider'
import { useScopedI18n } from '@/locales'

export const TypebotHeader = () => {
  const router = useRouter()
  const {
    typebot,
    publishedTypebot,
    updateTypebot,
    save,
    undo,
    redo,
    canUndo,
    canRedo,
    isSavingLoading,
  } = useTypebot()
  const { setRightPanel, rightPanel, setStartPreviewAtGroup } = useEditor()
  const scopedT = useScopedI18n('header')
  const [isUndoShortcutTooltipOpen, setUndoShortcutTooltipOpen] =
    useState(false)
  const hideUndoShortcutTooltipLater = useDebouncedCallback(() => {
    setUndoShortcutTooltipOpen(false)
  }, 1000)

  const handleNameSubmit = (name: string) => updateTypebot({ name })

  const handleChangeIcon = (icon: string) => updateTypebot({ icon })

  const handlePreviewClick = async () => {
    setStartPreviewAtGroup(undefined)
    save().then()
    setRightPanel(RightPanel.PREVIEW)
  }

  useUndoShortcut(() => {
    if (!canUndo) return
    hideUndoShortcutTooltipLater.flush()
    setUndoShortcutTooltipOpen(true)
    hideUndoShortcutTooltipLater()
    undo()
  })

  return (
    <Flex
      w="full"
      borderBottomWidth="1px"
      justify="center"
      align="center"
      h={`${headerHeight}px`}
      zIndex={100}
      pos="relative"
      bgColor={useColorModeValue('white', 'gray.900')}
      flexShrink={0}
    >
      <HStack
        display={['none', 'flex']}
        pos={{ base: 'absolute', xl: 'static' }}
        right={{ base: 280, xl: 0 }}
      >
        <Button
          as={Link}
          href={`/typebots/${typebot?.id}/edit`}
          colorScheme={router.pathname.includes('/edit') ? 'blue' : 'gray'}
          variant={router.pathname.includes('/edit') ? 'outline' : 'ghost'}
          size="sm"
          _hover={{color: 'white !important', background: 'blue.600 !important'}}
        >
          {scopedT('Flow')}
        </Button>
        <Button
          as={Link}
          href={`/typebots/${typebot?.id}/theme`}
          colorScheme={router.pathname.endsWith('theme') ? 'blue' : 'gray'}
          variant={router.pathname.endsWith('theme') ? 'outline' : 'ghost'}
          size="sm"
          _hover={{color: 'white !important', background: 'blue.600 !important'}}
        >
           {scopedT('Theme')}
        </Button>
        <Button
          as={Link}
          href={`/typebots/${typebot?.id}/settings`}
          colorScheme={router.pathname.endsWith('settings') ? 'blue' : 'gray'}
          variant={router.pathname.endsWith('settings') ? 'outline' : 'ghost'}
          size="sm"
          _hover={{color: 'white !important', background: 'blue.600 !important'}}
        >
           {scopedT('Settings')}
        </Button>
        <Button
          as={Link}
          href={`/typebots/${typebot?.id}/share`}
          colorScheme={router.pathname.endsWith('share') ? 'blue' : 'gray'}
          variant={router.pathname.endsWith('share') ? 'outline' : 'ghost'}
          size="sm"
          _hover={{color: 'white !important', background: 'blue.600 !important'}}
        >
           {scopedT('Share')}
        </Button>
        {isDefined(publishedTypebot) && (
          <Button
            as={Link}
            href={`/typebots/${typebot?.id}/results`}
            colorScheme={router.pathname.includes('results') ? 'blue' : 'gray'}
            variant={router.pathname.includes('results') ? 'outline' : 'ghost'}
            size="sm"
            _hover={{color: 'white !important', background: 'blue.600 !important'}}
          >
              {scopedT('Results')}
          </Button>
        )}
      </HStack>
      <HStack
        pos="absolute"
        left="1rem"
        justify="center"
        align="center"
        spacing="6"
      >
        <HStack alignItems="center" spacing={3}>
          <IconButton
            as={Link}
            aria-label="Navigate back"
            icon={<ChevronLeftIcon fontSize={25} />}
            href={
              router.query.parentId
                ? `/typebots/${router.query.parentId}/edit`
                : typebot?.folderId
                ? `/typebots/folders/${typebot.folderId}`
                : '/typebots'
            }
            size="sm"
          />
          <HStack spacing={1}>
            {typebot && (
              <EditableEmojiOrImageIcon
                uploadFilePath={`typebots/${typebot.id}/icon`}
                icon={typebot?.icon}
                onChangeIcon={handleChangeIcon}
              />
            )}
            (
            <EditableTypebotName
              key={`typebot-name-${typebot?.name ?? ''}`}
              defaultName={typebot?.name ?? ''}
              onNewName={handleNameSubmit}
            />
            )
          </HStack>

          <HStack>
            <Tooltip
              label={isUndoShortcutTooltipOpen ?`${scopedT('ChangesReverted')}` : `${scopedT('Undo')}`}
              isOpen={isUndoShortcutTooltipOpen ? true : undefined}
              hasArrow={isUndoShortcutTooltipOpen}
            >
              <IconButton
                display={['none', 'flex']}
                icon={<UndoIcon />}
                size="sm"
                aria-label={scopedT('Undo')}
                onClick={undo}
                isDisabled={!canUndo}
              />
            </Tooltip>

            <Tooltip label={scopedT('Redo')}>
              <IconButton
                display={['none', 'flex']}
                icon={<RedoIcon />}
                size="sm"
                aria-label={scopedT('Redo')}
                onClick={redo}
                isDisabled={!canRedo}
              />
            </Tooltip>
          </HStack>
        </HStack>
        {isSavingLoading && (
          <HStack>
            <Spinner speed="0.7s" size="sm" color="gray.400" />
            <Text fontSize="sm" color="gray.400">
             {scopedT('Loading')}
            </Text>
          </HStack>
        )}
      </HStack>

      <HStack right="40px" pos="absolute" display={['none', 'flex']}>
        {router.pathname.includes('/edit') && isNotDefined(rightPanel) && (
          <Button
            colorScheme="gray"
            onClick={handlePreviewClick}
            isLoading={isNotDefined(typebot)}
            size="sm"
          >
             {scopedT('Preview')}
          </Button>
        )}
        <PublishButton size="sm" />
      </HStack>
    </Flex>
  )
}
