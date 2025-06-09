"use client";

import {
  Box,
  Combobox,
  HStack,
  IconButton,
  Portal,
  Text,
  Textarea,
  useFilter,
  useListCollection,
} from "@chakra-ui/react";
import { useEffect, useRef } from "react";
import { AiOutlineSwap, AiOutlineTranslation } from "react-icons/ai";

// Reusable Combobox Select
const LanguageCombobox = ({ placeholder }: { placeholder: string }) => {
  const { contains } = useFilter({ sensitivity: "base" });

  const { collection, filter } = useListCollection({
    initialItems: languages,
    filter: contains,
  });

  return (
    <Combobox.Root
      collection={collection}
      onInputValueChange={(e) => filter(e.inputValue)}
      width="100%"
    >
      <Combobox.Control>
        <Combobox.Input
          placeholder={placeholder}
          color="white"
          borderColor="gray.600"
          _placeholder={{ color: "gray.400" }}
        />
        <Combobox.IndicatorGroup>
          <Combobox.ClearTrigger />
          <Combobox.Trigger />
        </Combobox.IndicatorGroup>
      </Combobox.Control>
      <Portal>
        <Combobox.Positioner>
          <Combobox.Content color="white">
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

const languages = [
  { label: "English", value: "en" },
  { label: "Uzbek", value: "uz" },
  { label: "Russian", value: "ru" },
  { label: "Spanish", value: "es" },
  { label: "French", value: "fr" },
  { label: "Arabic", value: "ar" },
  { label: "Chinese", value: "zh" },
];

const TranslationModule = () => {
  return (
    <Box
      maxW="800px"
      mx="auto"
      mt={10}
      p={6}
      border="1px solid"
      borderColor="blue.600"
      borderRadius="xl"
      boxShadow="0 0 20px #3f3fff"
    >
      <HStack mb={4} alignItems="center">
        <AiOutlineTranslation size={20} color="#66ccff" />
        <Text color="blue.300" fontSize="md" fontWeight="bold">
          Translation Module
        </Text>
      </HStack>

      {/* Language Combobox Selectors */}
      <HStack mb={4}>
        <Box flex="1">
          <LanguageCombobox placeholder="From language" />
        </Box>

        <IconButton
          aria-label="Swap languages"
          variant="ghost"
          colorScheme="blue"
          border="1px solid"
          borderColor="gray.600"
        >
          <AiOutlineSwap />
        </IconButton>

        <Box flex="1">
          <LanguageCombobox placeholder="To language" />
        </Box>
      </HStack>

      {/* Textareas */}
      <SyncedTextareas />
    </Box>
  );
};

export default TranslationModule;

const SyncedTextareas = () => {
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const outputRef = useRef<HTMLTextAreaElement>(null);

  const syncHeights = () => {
    if (inputRef.current && outputRef.current) {
      // Avval height 0 qilib scrollHeight ni aniqlaymiz
      inputRef.current.style.height = "auto";
      outputRef.current.style.height = "auto";

      const inputHeight = inputRef.current.scrollHeight;
      const outputHeight = outputRef.current.scrollHeight;
      const maxHeight = Math.max(inputHeight, outputHeight, 100); // 100px minimum

      inputRef.current.style.height = `${maxHeight}px`;
      outputRef.current.style.height = `${maxHeight}px`;
    }
  };

  useEffect(() => {
    syncHeights();
  }, []);

  return (
    <HStack spaceX={4} align="start" w="100%">
      <Textarea
        ref={inputRef}
        placeholder="Enter text"
        color="white"
        borderColor="gray.600"
        resize="none"
        onInput={syncHeights}
        minH="100px"
      />
      <Textarea
        ref={outputRef}
        placeholder="Translation"
        color="white"
        borderColor="gray.600"
        resize="none"
        onInput={syncHeights}
        minH="100px"
      />
    </HStack>
  );
};
