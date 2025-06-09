"use client";

import { useColorMode } from "@/components/ui/color-mode";
import {
  Box,
  Button,
  Container,
  Flex,
  Heading,
  HStack,
  Text,
  Textarea,
} from "@chakra-ui/react";
import { useState } from "react";
import { FaPlay } from "react-icons/fa";
import { IoMdRefresh } from "react-icons/io";
import MicrophoneButton from "./microfon";

const PronunciationComponent = () => {
  const [practiceText, setPracticeText] = useState(
    "Enter your own sentence to practice..."
  );
  const [customText, setCustomText] = useState("");
  const [showCustomInput, setShowCustomInput] = useState(false);
  const { colorMode } = useColorMode();

  const handleRandomText = () => {
    setPracticeText("This is a random sentence for practice.");
    setCustomText("");
    setShowCustomInput(false);
  };

  const handleUseText = () => {
    if (customText.trim()) {
      setPracticeText(customText);
      setShowCustomInput(false);
      setCustomText("");
    }
  };

  const handleCustomChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const wordCount = e.target.value.trim().split(/\s+/).length;
    if (wordCount <= 300) {
      setCustomText(e.target.value);
    }
  };

  return (
    <Box
      minH="100vh"
      mt={{ base: 10, md: 20 }}
      mb={{ base: 10, md: 20 }}
      color={colorMode === "dark" ? "white" : "black"}
      px={{ base: 4, md: 6 }}
      py={{ base: 6, md: 10 }}
      display="flex"
      flexDirection="column"
      alignItems="center"
    >
      {/* Title */}
      <Heading
        textAlign="center"
        fontSize={{ base: "2xl", md: "4xl" }}
        fontWeight="bold"
        color="purple.400"
        mb={2}
      >
        AI Pronunciation Practice
      </Heading>
      <Text
        textAlign="center"
        fontSize={{ base: "sm", md: "md" }}
        color={colorMode === "dark" ? "gray.400" : "gray.600"}
        mb={10}
      >
        Record yourself reading the text and get AI feedback on your
        pronunciation.
      </Text>

      <Container
        maxW="6xl"
        px={{ base: 0, md: 6 }}
        display="flex"
        flexDirection="column"
        alignItems="center"
      >
        {/* Practice Section */}
        <Box
          p={{ base: 4, md: 6 }}
          borderRadius="xl"
          boxShadow="xl"
          w="100%"
          mb={10}
          bg={colorMode === "dark" ? "" : "white"}
          border={
            colorMode === "dark" ? "1px solid gray.700" : "1px solid gray.200"
          }
        >
          <Flex
            justify="space-between"
            flexDirection={{ base: "column", md: "row" }}
            align={{ base: "flex-start", md: "center" }}
            mb={6}
          >
            <Heading
              fontSize="xl"
              color="purple.400"
              mb={{ base: 4, md: 0 }}
              borderBottom={
                colorMode === "dark"
                  ? "1px solid gray.700"
                  : "1px solid gray.300"
              }
              pb={2}
              w="full"
            >
              Practice Text
            </Heading>

            <HStack flexWrap={{ base: "wrap", md: "nowrap" }}>
              <Button
                variant="ghost"
                border="1px solid"
                borderColor={colorMode === "dark" ? "gray.700" : "gray.200"}
                _hover={{
                  bg: colorMode === "dark" ? "teal.700" : "purple.600",
                  color: "white",
                }}
                color={colorMode === "dark" ? "white" : "black"}
                onClick={handleRandomText}
                size="sm"
                w={{ base: "full", sm: "auto" }}
              >
                <IoMdRefresh /> Random Text
              </Button>
              <Button
                variant="ghost"
                border="1px solid"
                borderColor={colorMode === "dark" ? "gray.700" : "gray.200"}
                _hover={{
                  bg: colorMode === "dark" ? "teal.700" : "blue.500",
                  color: "white",
                }}
                color={colorMode === "dark" ? "white" : "black"}
                size="sm"
                w={{ base: "full", sm: "auto" }}
              >
                <FaPlay /> Listen
              </Button>
            </HStack>
          </Flex>

          <Textarea
            value={practiceText}
            readOnly
            placeholder="Practice text will appear here"
            color={colorMode === "dark" ? "white" : "black"}
            border="1px solid"
            borderColor={colorMode === "dark" ? "gray.700" : "gray.300"}
            mb={4}
            minH="200px"
            _placeholder={{
              color: colorMode === "dark" ? "gray.500" : "gray.400",
            }}
          />

          <Flex justify="space-between" align="center" mb={4} flexWrap="wrap">
            <Text color={colorMode === "dark" ? "gray.400" : "gray.600"} mb={2}>
              Or enter your own text
            </Text>

            {!showCustomInput && (
              <Button
                onClick={() => setShowCustomInput(true)}
                size="sm"
                variant="ghost"
                border="1px solid"
                borderColor={colorMode === "dark" ? "gray.700" : "gray.200"}
                mb={2}
                w={{ base: "full", sm: "auto" }}
              >
                Add text
              </Button>
            )}
          </Flex>

          {showCustomInput && (
            <>
              <Textarea
                value={customText}
                onChange={handleCustomChange}
                placeholder="Enter your own sentence to practice..."
                color={colorMode === "dark" ? "white" : "black"}
                border="1px solid"
                borderColor={colorMode === "dark" ? "gray.700" : "gray.300"}
                mb={4}
                minH="100px"
                _placeholder={{
                  color: colorMode === "dark" ? "gray.500" : "gray.400",
                }}
              />
              <Text
                fontSize="sm"
                color={
                  customText.trim().split(/\s+/).length > 300
                    ? "red.400"
                    : "gray.500"
                }
                mb={2}
              >
                {customText.trim().split(/\s+/).length} / 300 so‘z
              </Text>
              <Button
                onClick={handleUseText}
                variant="ghost"
                border="1px solid"
                borderColor={colorMode === "dark" ? "gray.700" : "gray.200"}
                _hover={{
                  bg: colorMode === "dark" ? "teal.700" : "teal.500",
                  color: "white",
                }}
                color={colorMode === "dark" ? "white" : "black"}
                size="sm"
              >
                Use This Text
              </Button>
            </>
          )}
        </Box>

        {/* Record Section */}
        <Box
          p={{ base: 4, md: 6 }}
          borderRadius="xl"
          textAlign="center"
          boxShadow="xl"
          w="100%"
          bg={colorMode === "dark" ? "" : "white"}
          border={
            colorMode === "dark" ? "1px solid gray.700" : "1px solid gray.200"
          }
        >
          <Text
            fontWeight="medium"
            mb={4}
            fontSize={{ base: "md", md: "lg" }}
            color={colorMode === "dark" ? "white" : "black"}
          >
            Record Your Pronunciation
          </Text>
          <MicrophoneButton />
          <Text mt={4} color={colorMode === "dark" ? "gray.400" : "gray.600"}>
            Click to start recording
          </Text>
        </Box>
      </Container>
    </Box>
  );
};

export default PronunciationComponent;
