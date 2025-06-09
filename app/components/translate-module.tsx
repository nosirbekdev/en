"use client";

import { useColorMode } from "@/components/ui/color-mode";
import {
  Box,
  Combobox,
  HStack,
  IconButton,
  Portal,
  Stack,
  Text,
  Textarea,
  useFilter,
  useListCollection,
} from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import { AiOutlineSwap, AiOutlineTranslation } from "react-icons/ai";

const languages = [
  { label: "English", value: "en" },
  { label: "Uzbek", value: "uz" },
  { label: "Russian", value: "ru" },
  { label: "Spanish", value: "es" },
  { label: "French", value: "fr" },
  { label: "Arabic", value: "ar" },
  { label: "Chinese", value: "zh" },
];

// Reusable Combobox Select
const LanguageCombobox = ({
  placeholder,
}: {
  placeholder: string;
  value: string;
  onChange: (val: string) => void;
}) => {
  const { contains } = useFilter({ sensitivity: "base" });
  const { collection, filter } = useListCollection({
    initialItems: languages,
    filter: contains,
  });

  const { colorMode } = useColorMode();
  const inputColor = colorMode === "dark" ? "white" : "gray.800";
  const placeholderColor = colorMode === "dark" ? "gray.400" : "gray.600";
  const borderColor = colorMode === "dark" ? "gray.600" : "gray.300";

  return (
    <Combobox.Root
      collection={collection}
      onInputValueChange={(e) => filter(e.inputValue)}
      width="100%"
    >
      <Combobox.Control>
        <Combobox.Input
          placeholder={placeholder}
          color={inputColor}
          borderColor={borderColor}
          _placeholder={{ color: placeholderColor }}
        />
        <Combobox.IndicatorGroup>
          <Combobox.ClearTrigger />
          <Combobox.Trigger />
        </Combobox.IndicatorGroup>
      </Combobox.Control>
      <Portal>
        <Combobox.Positioner>
          <Combobox.Content color={inputColor}>
            <Combobox.Empty>No language found</Combobox.Empty>
            {collection.items.map((item) => (
              <Combobox.Item item={item} key={item.value}>
                {item.label}
                <Combobox.ItemIndicator />
              </Combobox.Item>
            ))}
          </Combobox.Content>
        </Combobox.Positioner>
      </Portal>
    </Combobox.Root>
  );
};

const TranslationModule = () => {
  const { colorMode } = useColorMode();
  const [fromLang, setFromLang] = useState("en");
  const [toLang, setToLang] = useState("uz");

  const swapLanguages = () => {
    setFromLang(toLang);
    setToLang(fromLang);
  };

  const borderColor = colorMode === "dark" ? "blue.600" : "blue.300";
  const shadowColor = colorMode === "dark" ? "#3f3fff" : "#90cdf4";
  const iconColor = colorMode === "dark" ? "#66ccff" : "#2b6cb0";
  const headingColor = colorMode === "dark" ? "blue.300" : "blue.600";
  const buttonBorderColor = colorMode === "dark" ? "gray.600" : "gray.300";

  return (
    <Box
      maxW="800px"
      mx="auto"
      mt={10}
      p={6}
      border="1px solid"
      borderColor={borderColor}
      borderRadius="xl"
      boxShadow={`0 0 20px ${shadowColor}`}
    >
      <HStack mb={4} alignItems="center">
        <AiOutlineTranslation size={20} color={iconColor} />
        <Text color={headingColor} fontSize="md" fontWeight="bold">
          Translation Module
        </Text>
      </HStack>

      {/* Language Selectors */}
      <Stack mb={4} direction={{ base: "column", md: "row" }}>
        <Box flex="1">
          <LanguageCombobox
            placeholder="From language"
            value={fromLang}
            onChange={setFromLang}
          />
        </Box>

        <IconButton
          aria-label="Swap languages"
          variant="ghost"
          colorScheme="blue"
          border="1px solid"
          borderColor={buttonBorderColor}
          onClick={swapLanguages}
          alignSelf="center"
        >
          <AiOutlineSwap />
        </IconButton>

        <Box flex="1">
          <LanguageCombobox
            placeholder="To language"
            value={toLang}
            onChange={setToLang}
          />
        </Box>
      </Stack>

      {/* Textareas */}
      <SyncedTextareas />
    </Box>
  );
};

export default TranslationModule;

const SyncedTextareas = () => {
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const outputRef = useRef<HTMLTextAreaElement>(null);
  const { colorMode } = useColorMode();

  const inputColor = colorMode === "dark" ? "white" : "gray.800";
  const borderColor = colorMode === "dark" ? "gray.600" : "gray.300";
  const placeholderColor = colorMode === "dark" ? "gray.400" : "gray.600";

  const syncHeights = () => {
    if (inputRef.current && outputRef.current) {
      inputRef.current.style.height = "auto";
      outputRef.current.style.height = "auto";

      const inputHeight = inputRef.current.scrollHeight;
      const outputHeight = outputRef.current.scrollHeight;
      const maxHeight = Math.max(inputHeight, outputHeight, 100);

      inputRef.current.style.height = `${maxHeight}px`;
      outputRef.current.style.height = `${maxHeight}px`;
    }
  };

  useEffect(() => {
    syncHeights();
  }, []);

  return (
    <Stack direction={{ base: "column", md: "row" }} w="100%">
      <Textarea
        ref={inputRef}
        placeholder="Enter text"
        color={inputColor}
        borderColor={borderColor}
        _placeholder={{ color: placeholderColor }}
        resize="none"
        onInput={syncHeights}
        minH="100px"
      />
      <Textarea
        ref={outputRef}
        placeholder="Translation"
        color={inputColor}
        borderColor={borderColor}
        _placeholder={{ color: placeholderColor }}
        resize="none"
        onInput={syncHeights}
        minH="100px"
      />
    </Stack>
  );
};
