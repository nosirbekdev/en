"use client";

import { useColorMode } from "@/components/ui/color-mode";
import { toaster } from "@/components/ui/toaster";
import {
  Box,
  Button,
  Container,
  Flex,
  Heading,
  HStack,
  IconButton,
  Input,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useState } from "react"; // Toaster faylidan import qiling
import { BiEdit } from "react-icons/bi";
import { FaPlay, FaPlus, FaVolumeUp } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import PracticeDialog from "./practice-dialog";

const VocabularyComponent = () => {
  const { colorMode } = useColorMode();

  const [vocabList, setVocabList] = useState([
    { en: "Apple", uz: "Olma" },
    { en: "Flower", uz: "Gul" },
    { en: "Happy", uz: "Baxtli" },
  ]);

  const [englishWord, setEnglishWord] = useState("");
  const [uzbekWord, setUzbekWord] = useState("");
  const [isPracticeOpen, setIsPracticeOpen] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [currentWordIndex, setCurrentWordIndex] = useState(0);

  const vocabularyListBg =
    colorMode === "dark" ? "rgba(10, 20, 30, 0.5)" : "rgba(240, 248, 255, 0.5)";

  const glassBg =
    colorMode === "dark" ? "rgba(4, 7, 17, 0.4)" : "rgba(255, 255, 255, 0.4)";

  const inputBorderColor = colorMode === "dark" ? "" : "gray.400";

  const handleAddWord = () => {
    if (!englishWord.trim() || !uzbekWord.trim()) {
      toaster.error({
        title: "Error",
        description: "Please fill in both English and Uzbek words.",
      });
      return;
    }

    setVocabList([
      ...vocabList,
      { en: englishWord.trim(), uz: uzbekWord.trim() },
    ]);
    setEnglishWord("");
    setUzbekWord("");
    toaster.success({
      title: "Success",
      description: "Word added successfully!",
    });
  };

  return (
    <Box mt={20} mb={20} px={{ base: 4, md: 10 }}>
      <Heading
        textAlign="center"
        fontSize={{ base: "2xl", md: "4xl" }}
        fontWeight="bold"
        color="purple.400"
        mb={5}
      >
        Vocabulary Builder
      </Heading>
      <Text textAlign="center" fontSize="md" color="gray.400" mb={10}>
        Build and practice your English vocabulary with Uzbek translations
      </Text>

      <Container maxW="6xl">
        <Flex
          flexDirection={{ base: "column", md: "row" }}
          justify="center"
          align="flex-start"
          gap={8}
        >
          {/* Left - Your Vocabulary */}
          <Box
            width={{ base: "100%", md: "auto" }}
            flex={{ base: 0, md: 2 }}
            p={6}
            borderRadius="xl"
            boxShadow="lg"
            bg={glassBg}
            backdropFilter="blur(20px)"
            border="1px solid"
            borderColor={colorMode === "dark" ? "gray.700" : "gray.200"}
          >
            <Text fontWeight="semibold" mb={4}>
              Your Vocabulary
            </Text>
            <VStack align="stretch">
              {vocabList.map((item, idx) => (
                <Flex
                  key={idx}
                  justify="space-between"
                  align="center"
                  px={4}
                  py={3}
                  borderRadius="md"
                  bg={vocabularyListBg}
                  backdropFilter="blur(20px)"
                  boxShadow="sm"
                >
                  <Text color={colorMode === "dark" ? "white" : "gray.800"}>
                    <strong>{item.en}</strong> - {item.uz}
                  </Text>
                  <HStack>
                    <IconButton
                      aria-label="Play pronunciation"
                      size="sm"
                      variant="ghost"
                      color={colorMode === "dark" ? "white" : "gray.800"}
                    >
                      <FaVolumeUp />
                    </IconButton>
                    <IconButton
                      aria-label="Edit word"
                      size="sm"
                      variant="ghost"
                      color={colorMode === "dark" ? "white" : "gray.800"}
                    >
                      <BiEdit />
                    </IconButton>
                    <IconButton
                      aria-label="Delete word"
                      size="sm"
                      variant="ghost"
                      color={colorMode === "dark" ? "white" : "gray.800"}
                    >
                      <MdDelete />
                    </IconButton>
                  </HStack>
                </Flex>
              ))}
            </VStack>
          </Box>

          {/* Right - Add Word + Practice */}
          <VStack
            flex="1"
            align="stretch"
            w="full"
            minW={{ base: "auto", md: "200px" }}
          >
            <Box
              p={6}
              borderRadius="xl"
              boxShadow="lg"
              bg={glassBg}
              backdropFilter="blur(20px)"
              border="1px solid"
              borderColor={colorMode === "dark" ? "gray.700" : "gray.200"}
            >
              <Text fontWeight="semibold" mb={4}>
                Add New Word
              </Text>
              <VStack>
                <Input
                  placeholder="Enter English word"
                  borderColor={inputBorderColor}
                  borderWidth="1px"
                  _hover={{
                    borderColor: colorMode === "dark" ? "gray.500" : "gray.500",
                  }}
                  _focus={{
                    borderColor:
                      colorMode === "dark" ? "purple.400" : "purple.500",
                    boxShadow: "none",
                  }}
                  value={englishWord}
                  onChange={(e) => setEnglishWord(e.target.value)}
                />

                <Input
                  placeholder="Uzbek tarjimasi"
                  borderColor={inputBorderColor}
                  borderWidth="1px"
                  _hover={{
                    borderColor: colorMode === "dark" ? "gray.500" : "gray.500",
                  }}
                  _focus={{
                    borderColor:
                      colorMode === "dark" ? "purple.400" : "purple.500",
                    boxShadow: "none",
                  }}
                  value={uzbekWord}
                  onChange={(e) => setUzbekWord(e.target.value)}
                />

                <Button
                  w="full"
                  bg="linear-gradient(to right, #C30EFF, #1E92FF)"
                  color="white"
                  _hover={{
                    bg: "linear-gradient(to right, #b00be6, #1a82e6)",
                    opacity: 0.9,
                  }}
                  _active={{
                    transform: "scale(0.98)",
                  }}
                  _focus={{
                    boxShadow: "none",
                  }}
                  onClick={handleAddWord}
                >
                  <FaPlus /> Add Word
                </Button>
              </VStack>
            </Box>

            <Box
              p={6}
              borderRadius="xl"
              boxShadow="lg"
              bg={glassBg}
              backdropFilter="blur(20px)"
              border="1px solid"
              borderColor={colorMode === "dark" ? "gray.700" : "gray.200"}
              textAlign="center"
              mt={5}
            >
              <Text mb={2} fontWeight="medium">
                Practice
              </Text>
              <Text fontSize="2xl" fontWeight="bold" mb={4} color="purple.400">
                {vocabList.length}
              </Text>
              <Text mb={4} color="gray.400">
                Words in Dictionary
              </Text>
              <Button
                w="full"
                bg="linear-gradient(to right, #C30EFF, #1E92FF)"
                color="white"
                _hover={{
                  bg: "linear-gradient(to right, #b00be6, #1a82e6)",
                  opacity: 0.9,
                }}
                _active={{
                  transform: "scale(0.98)",
                }}
                _focus={{
                  boxShadow: "none",
                }}
                onClick={() => setIsPracticeOpen(true)}
              >
                <FaPlay />
                Start Practice
              </Button>
            </Box>
          </VStack>
        </Flex>
      </Container>
      <PracticeDialog
        isOpen={isPracticeOpen}
        onClose={setIsPracticeOpen}
        word={vocabList[currentWordIndex]}
      />
    </Box>
  );
};

export default VocabularyComponent;
