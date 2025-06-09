"use client";

import {
  Box,
  HStack,
  IconButton,
  Input,
  InputGroup,
  Text,
} from "@chakra-ui/react";
import { BiSolidBot } from "react-icons/bi";
import { FaMicrophone, FaPaperPlane, FaUserCircle } from "react-icons/fa";
import { MdRefresh } from "react-icons/md";
import SettingsDrawer from "./settings";
import TranslationModule from "./translate-module";

const AiChatComponent = () => {
  return (
    <Box mt={20} mb={20} color="white" fontFamily="sans-serif">
      {/* Header */}
      <Box textAlign="center" mb={10}>
        <Text fontSize="4xl" fontWeight="bold" color="blue.400">
          AI English Tutor
        </Text>
        <Text fontSize="sm" color="gray.300">
          Just A Rather Very Intelligent System - English Learning Protocol
        </Text>
      </Box>

      {/* Chat box container */}
      <Box
        maxW="800px"
        mx="auto"
        border="1px solid"
        borderColor="blue.600"
        borderRadius="xl"
        p={6}
        // bg="gray.900"
        boxShadow="0 0 20px #3f3fff"
        position="relative"
      >
        {/* Chat Header */}
        <HStack justifyContent="space-between" mb={4}>
          <Text color="purple.400" fontSize="sm">
            AI LEARNING PROTOCOL
          </Text>
          <IconButton
            aria-label="Reset"
            colorScheme="purple"
            variant="ghost"
            border="1px solid"
            borderColor="gray.600"
            px={3}
            size="sm"
          >
            <MdRefresh /> Reset
          </IconButton>
        </HStack>

        <HStack mb={6}>
          <Box p={3} bg="gray.800" borderRadius="md">
            <BiSolidBot size={24} />
          </Box>
          <Box border="1px solid purple" p={4} borderRadius="lg" maxW={"70%"}>
            <Text fontSize="sm" color="purple.200" fontWeight="bold">
              AI RESPONSE
            </Text>
            <Text fontSize="sm" mt={1}>
              Hello! I&apos;m your AI English tutor. I&apos;m here to help you
              practice and improve your English skills. You can click on any
              word to see its Uzbek translation. What would you like to talk
              about today?
            </Text>
            <Text mt={2} fontSize="xs" color="gray.500">
              11:22:09
            </Text>
          </Box>
        </HStack>

        <HStack justifyContent="flex-end" mb={6}>
          <Box
            // bg="gray.800"
            border="1px solid purple"
            p={4}
            borderRadius="lg"
            maxW="70%"
          >
            <Text fontSize="sm" color="blue.200" fontWeight="bold">
              USER INPUT
            </Text>
            <Text mt={1} fontSize="sm">
              A am Ilhom Lorem ipsum dolor sit, amet consectetur adipisicing
              elit. Facilis a sunt veniam unde voluptates cupiditate ullam
              impedit asperiores! Error possimus hic enim corporis ut rem
              molestias culpa quaerat id! Nemo.
            </Text>
            <Text mt={2} fontSize="xs" color="gray.500" textAlign="right">
              11:40:54
            </Text>
          </Box>
          <Box p={3} bg="gray.800" borderRadius="md">
            <FaUserCircle size={24} />
          </Box>
        </HStack>

        {/* Input area */}
        <InputGroup mt={4}>
          <>
            <SettingsDrawer />
            <Input
              placeholder="Enter your message..."
              border="1px solid"
              borderColor="gray.600"
              _placeholder={{ color: "gray.400" }}
              color="white"
            />
            <IconButton
              aria-label="Microphone"
              colorScheme="purple"
              variant="ghost"
              border={"1px solid "}
              borderColor="gray.600"
              size="md"
            >
              <FaMicrophone />
            </IconButton>
            <IconButton
              aria-label="Send"
              colorScheme="purple"
              variant="ghost"
              border={"1px solid "}
              borderColor="gray.600"
              size="md"
            >
              <FaPaperPlane />
            </IconButton>
          </>
        </InputGroup>
      </Box>

      {/* Translation module */}
      <TranslationModule />
    </Box>
  );
};

export default AiChatComponent;
