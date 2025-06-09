"use client";

import { useColorMode } from "@/components/ui/color-mode";
import {
  Box,
  Button,
  Dialog,
  Flex,
  IconButton,
  Input,
  Portal,
  Progress,
  Text,
  useBreakpointValue,
} from "@chakra-ui/react";
import { useState } from "react";
import { FaMicrophone, FaVolumeUp } from "react-icons/fa";
import { IoMdClose, IoMdRefresh } from "react-icons/io";

interface PracticeDialogProps {
  isOpen: boolean;
  onClose: (isOpen: boolean) => void;
  word: { en: string; uz: string };
}

const PracticeDialog = ({ isOpen, onClose, word }: PracticeDialogProps) => {
  const [answer, setAnswer] = useState("");
  const { colorMode } = useColorMode();

  const handleOpenChange = (details: { open: boolean }) => {
    onClose(details.open);
  };

  const isMobile = useBreakpointValue({ base: true, md: false });

  const dialogStyles = {
    position: "fixed",
    top: "40%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    background: colorMode === "dark" ? "#10182A" : "#FFFFFF",
    color: colorMode === "dark" ? "#fff" : "#000",
    padding: isMobile ? "1rem" : "2rem",
    borderRadius: "1rem",
    width: isMobile ? "95%" : "90%",
    maxWidth: isMobile ? "100%" : "500px",
    zIndex: 1001,
    boxShadow:
      colorMode === "dark"
        ? "0 4px 6px rgba(0, 0, 0, 0.1)"
        : "0 4px 6px rgba(0, 0, 0, 0.1)",
  };

  const backdropStyles = {
    backgroundColor: "rgba(0,0,0,0.4)",
    backdropFilter: "blur(6px)",
    WebkitBackdropFilter: "blur(6px)",
    position: "fixed",
    inset: 0,
    zIndex: 1000,
  };

  const buttonBg = colorMode === "dark" ? "gray.700" : "gray.800";
  const buttonHoverBg = colorMode === "dark" ? "gray.600" : "gray.700";

  return (
    <Dialog.Root open={isOpen} onOpenChange={handleOpenChange}>
      <Portal>
        <Dialog.Backdrop style={backdropStyles as React.CSSProperties} />
        <Dialog.Content style={dialogStyles as React.CSSProperties}>
          <Flex justify="space-between" align="center" mb={isMobile ? 2 : 4}>
            <Text fontSize={isMobile ? "lg" : "xl"} fontWeight="bold">
              Practice Session
            </Text>
            <IconButton
              aria-label="Close"
              onClick={() => onClose(false)}
              size={isMobile ? "xs" : "sm"}
              bg="transparent"
              color={colorMode === "dark" ? "white" : "black"}
            >
              <IoMdClose />
            </IconButton>
          </Flex>

          <Progress.Root
            value={50}
            size="sm"
            colorPalette="green"
            mb={isMobile ? 2 : 6}
          >
            <Progress.Track>
              <Progress.Range />
            </Progress.Track>
          </Progress.Root>

          <Text
            fontSize={isMobile ? "xs" : "sm"}
            color={colorMode === "dark" ? "gray.300" : "gray.600"}
            mb={isMobile ? 1 : 2}
          >
            Listen and translate this word:
          </Text>

          <Flex
            align="center"
            justify="center"
            gap={isMobile ? 2 : 3}
            mb={isMobile ? 2 : 4}
          >
            <Text
              fontSize={isMobile ? "xl" : "3xl"}
              fontWeight="bold"
              color="purple.400"
            >
              {word.en.toLowerCase()}
            </Text>
            <IconButton
              aria-label="Play"
              size={isMobile ? "xs" : "sm"}
              bg={buttonBg}
              color="white"
              _hover={{ bg: buttonHoverBg }}
            >
              <FaVolumeUp />{" "}
            </IconButton>
          </Flex>

          <Box
            display="flex"
            alignItems="center"
            justifyContent="center"
            gap={isMobile ? 1 : 2}
            mb={isMobile ? 2 : 4}
          >
            <Input
              placeholder="Uzbek tarjimasini kiriting..."
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              borderColor={colorMode === "dark" ? "gray.700" : "gray.200"}
              borderWidth="1px"
              _hover={{
                borderColor: colorMode === "dark" ? "gray.700" : "gray.200",
              }}
              _focus={{ borderColor: "purple.500", boxShadow: "none" }}
              size={isMobile ? "sm" : "md"}
            />
            <IconButton
              aria-label="Play"
              size={isMobile ? "xs" : "sm"}
              variant="ghost"
              border="1px solid"
              borderColor={colorMode === "dark" ? "gray.700" : "gray.200"}
              bg={colorMode === "dark" ? "transparent" : buttonBg}
              color="white"
            >
              <FaMicrophone />{" "}
            </IconButton>
          </Box>

          <Button
            w={isMobile ? "100%" : "auto"}
            bg="purple.600"
            _hover={{ bg: "purple.500" }}
            color="white"
            size={isMobile ? "sm" : "md"}
          >
            Check Answer
          </Button>

          <Box
            display="flex"
            alignItems="center"
            mt={isMobile ? 2 : 6}
            justifyContent="space-between"
          >
            <Text
              fontSize={isMobile ? "xs" : "sm"}
              color={colorMode === "dark" ? "gray.400" : "gray.600"}
              mt={isMobile ? 1 : 4}
            >
              Score: 0/0
            </Text>
            <Button
              variant="ghost"
              border="1px solid"
              borderColor={colorMode === "dark" ? "gray.700" : "gray.200"}
              _hover={{
                bg: colorMode === "dark" ? "teal.700" : "teal.500",
                color: "white",
              }}
              color={colorMode === "dark" ? "white" : "black"}
              size={isMobile ? "xs" : "sm"}
              onClick={() => onClose(false)}
            >
              <IoMdRefresh /> Exit
            </Button>
          </Box>
        </Dialog.Content>
      </Portal>
    </Dialog.Root>
  );
};

export default PracticeDialog;
