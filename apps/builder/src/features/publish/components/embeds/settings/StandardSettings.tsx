import {
  StackProps,
  Stack,
  Flex,
  Heading,
  Input,
  HStack,
  Text,
} from '@chakra-ui/react'
import { DropdownList } from '@/components/DropdownList'
import { useState, useEffect } from 'react'
import { SwitchWithLabel } from '@/components/inputs/SwitchWithLabel'
import { useScopedI18n } from '@/locales'

type Props = {
  onUpdateWindowSettings: (windowSettings: {
    heightLabel: string
    widthLabel?: string
  }) => void
} & StackProps

export const StandardSettings = ({
  onUpdateWindowSettings,
  ...props
}: Props) => {
  const [isFullscreenChecked, setIsFullscreenChecked] = useState(false)
  const [inputValues, setInputValues] = useState({
    widthValue: '100',
    widthType: '%',
    heightValue: '600',
    heightType: 'px',
  })

  useEffect(() => {
    onUpdateWindowSettings({
      widthLabel: isFullscreenChecked
        ? undefined
        : inputValues.widthValue + inputValues.widthType,
      heightLabel: isFullscreenChecked
        ? '100vh'
        : inputValues.heightValue + inputValues.heightType,
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inputValues, isFullscreenChecked])

  const handleWidthTypeSelect = (widthType: string) =>
    setInputValues({ ...inputValues, widthType })
  const handleHeightTypeSelect = (heightType: string) =>
    setInputValues({ ...inputValues, heightType })

    const scopedT = useScopedI18n('share')

  return (
    <Stack {...props} spacing={4}>
      <Heading size="sm">{scopedT('Window settings')}</Heading>

      <Stack pl="4" spacing={4}>
        <SwitchWithLabel
          label={scopedT('Set to fullscreen?')}
          initialValue={isFullscreenChecked}
          onCheckChange={() => setIsFullscreenChecked(!isFullscreenChecked)}
        />
        {!isFullscreenChecked && (
          <>
            <Flex justify="space-between" align="center">
              <Text>{scopedT('Width')}</Text>
              <HStack>
                <Input
                  onChange={(e) =>
                    setInputValues({
                      ...inputValues,
                      widthValue: e.target.value,
                    })
                  }
                  w="70px"
                  value={inputValues.widthValue}
                />
                <DropdownList
                  items={['px', '%']}
                  onItemSelect={handleWidthTypeSelect}
                  currentItem={inputValues.widthType}
                />
              </HStack>
            </Flex>
            <Flex justify="space-between" align="center">
              <Text>{scopedT('Height')}</Text>
              <HStack>
                <Input
                  onChange={(e) =>
                    setInputValues({
                      ...inputValues,
                      heightValue: e.target.value,
                    })
                  }
                  w="70px"
                  value={inputValues.heightValue}
                />
                <DropdownList
                  items={['px', '%']}
                  onItemSelect={handleHeightTypeSelect}
                  currentItem={inputValues.heightType}
                />
              </HStack>
            </Flex>
          </>
        )}
      </Stack>
    </Stack>
  )
}
