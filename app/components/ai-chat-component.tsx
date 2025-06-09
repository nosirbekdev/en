"use client";

import { useColorMode } from "@/components/ui/color-mode";
import {
  Box,
  Flex,
  HStack,
  IconButton,
  Input,
  InputGroup,
  Text,
} from "@chakra-ui/react";
import {
  FaMicrophone,
  FaPaperPlane,
  FaRobot,
  FaUserCircle,
} from "react-icons/fa";
import { MdRefresh } from "react-icons/md";
import SettingsDrawer from "./settings";
import TranslationModule from "./translate-module";

const AiChatComponent = () => {
  const { colorMode } = useColorMode();

  // Dynamic colors based on mode
  const isDark = colorMode === "dark";

  const background = isDark ? "" : "";
  const textColor = isDark ? "white" : "gray.800";
  const subTextColor = isDark ? "gray.300" : "gray.600";
  const borderColor = isDark ? "blue.600" : "blue.300";
  const boxShadow = isDark ? "0 0 20px #3f3fff" : "0 0 10px #90cdf4";
  const placeholderColor = isDark ? "gray.400" : "gray.500";
  const userNameColor = isDark ? "blue.200" : "blue.600";
  const aiNameColor = isDark ? "blue.200" : "blue.600";
  const timeColor = "gray.500";
  const messageBorder = isDark ? "purple.500" : "purple.300";

  return (
    <Box
      mt={20}
      mb={20}
      color={textColor}
      bg={background}
      fontFamily="sans-serif"
    >
      {/* Header */}
      <Box textAlign="center" mb={10}>
        <Text
          fontSize={{ base: "2xl", md: "4xl" }}
          fontWeight="bold"
          color="blue.400"
        >
          AI English Tutor
        </Text>
        <Text fontSize={{ base: "xs", md: "sm" }} color={subTextColor}>
          Just A Rather Very Intelligent System - English Learning Protocol
        </Text>
      </Box>

      {/* Chat box container */}
      <Box
        maxW="800px"
        mx="auto"
        border="1px solid"
        borderColor={borderColor}
        borderRadius="xl"
        p={6}
        boxShadow={boxShadow}
        position="relative"
      >
        {/* Chat Header */}
        <HStack justifyContent="space-between" mb={4}>
          <Text color="purple.400" fontSize={{ base: "xs", md: "sm" }}>
            AI LEARNING PROTOCOL
          </Text>
          <IconButton
            aria-label="Reset"
            colorScheme="purple"
            variant="ghost"
            border="1px solid"
            borderColor={subTextColor}
            px={3}
            size="sm"
          >
            <MdRefresh /> Reset{" "}
          </IconButton>
        </HStack>

        {/* AI Message */}
        <HStack mb={6}>
          <Box
            border={`1px solid`}
            borderColor={messageBorder}
            p={4}
            borderRadius="lg"
            maxW="70%"
          >
            <Flex alignItems="center" gap={2} mb={3}>
              <FaRobot size={20} />
              <Text
                fontSize={{ base: "sm", md: "md" }}
                color={aiNameColor}
                fontWeight="bold"
              >
                AI TUTOR
              </Text>
            </Flex>
            <Text fontSize={{ base: "sm", md: "md" }} mt={1}>
              Hello! I&apos;m your AI English tutor. You can click on any word
              to see its Uzbek translation.
            </Text>
            <Text mt={2} fontSize="xs" color={timeColor}>
              11:22:09
            </Text>
          </Box>
        </HStack>

        {/* User Message */}
        <HStack justifyContent="flex-end" mb={6}>
          <Box
            border={`1px solid `}
            borderColor={messageBorder}
            p={4}
            borderRadius="lg"
            maxW="70%"
          >
            <Flex alignItems="center" gap={2} mb={3}>
              <FaUserCircle size={20} />
              <Text
                fontSize={{ base: "sm", md: "md" }}
                color={userNameColor}
                fontWeight="bold"
              >
                USER INPUT
              </Text>
            </Flex>
            <Text mt={1} fontSize={{ base: "sm", md: "md" }}>
              A am Ilhom Lorem ipsum dolor sit amet consectetur...
            </Text>
            <Text mt={2} fontSize="xs" color={timeColor} textAlign="right">
              11:40:54
            </Text>
          </Box>
        </HStack>

        {/* Input Area */}
        <InputGroup mt={4}>
          <>
            <SettingsDrawer />
            <Input
              placeholder="Enter your message..."
              border="1px solid"
              borderColor={subTextColor}
              _placeholder={{ color: placeholderColor }}
              color={textColor}
              size={{ base: "sm", md: "md" }}
              fontSize={{ base: "sm", md: "md" }}
            />
            <IconButton
              aria-label="Microphone"
              colorScheme="purple"
              variant="ghost"
              border="1px solid"
              borderColor={subTextColor}
              size={{ base: "sm", md: "md" }}
            >
              <FaMicrophone />
            </IconButton>
            <IconButton
              aria-label="Send"
              colorScheme="purple"
              variant="ghost"
              border="1px solid"
              borderColor={subTextColor}
              size={{ base: "sm", md: "md" }}
            >
              <FaPaperPlane />
            </IconButton>
          </>
        </InputGroup>
      </Box>

      {/* Translation Module */}
      <TranslationModule />
    </Box>
  );
};

export default AiChatComponent;
