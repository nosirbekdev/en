"use client";

import { navLinks } from "@/config";
import {
  Box,
  Button,
  ClientOnly,
  CloseButton,
  Drawer,
  Flex,
  HStack,
  Portal,
  Skeleton,
  Text,
} from "@chakra-ui/react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { FaLightbulb } from "react-icons/fa";
import { MdMenu } from "react-icons/md";
import { ColorModeButton, useColorMode } from "./ui/color-mode";

const Header = () => {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { colorMode } = useColorMode();

  return (
    <ClientOnly fallback={<Skeleton height="64px" />}>
      <Box
        as="header"
        py={4}
        px={6}
        className={`border-t-4 ${
          colorMode === "dark"
            ? " bg-[#040711]"
            : "border-blue-600 bg-[#eaefef]"
        } fixed top-0 left-0 right-0 z-50`}
      >
        <Flex
          justify={{ base: "space-between", md: "space-around" }}
          align="center"
        >
          {/* Logo Section */}
          <Link href="/" passHref>
            <Flex align="center">
              <Box className="text-blue-400 text-4xl mr-2">
                <FaLightbulb />
              </Box>
              <Text
                fontSize="xl"
                fontWeight="bold"
                className={
                  colorMode === "dark" ? "text-white" : "text-blue-500"
                }
              >
                LingoAI
              </Text>
            </Flex>
          </Link>

          {/* Desktop Navigation Links */}
          <HStack
            display={{ base: "none", md: "flex" }}
            px={4}
            py={2}
            className={`rounded-full border ${
              colorMode === "dark"
                ? "border-blue-400 bg-white/5"
                : "border-blue-500 bg-gray-100/50"
            } backdrop-blur-md transition-all duration-300 space-x-4`}
          >
            {navLinks.map((link) => (
              <Text
                key={link.label}
                className={`${
                  pathname === link.path
                    ? "text-blue-400 font-bold"
                    : colorMode === "dark"
                    ? "text-white"
                    : "text-gray-700"
                } text-md hover:text-blue-400 cursor-pointer `}
                onClick={() => {
                  router.push(link.path);
                  setOpen(false);
                }}
              >
                {link.label}
              </Text>
            ))}
            <ColorModeButton />
          </HStack>

          {/* Mobile Menu Button */}
          <Box display={{ base: "block", md: "none" }}>
            <Drawer.Root open={open} onOpenChange={(e) => setOpen(e.open)}>
              <Drawer.Trigger asChild>
                <Button
                  variant="outline"
                  className={`${
                    colorMode === "dark"
                      ? "border-blue-400 text-white"
                      : "border-gray-300 text-gray-700"
                  }`}
                >
                  <MdMenu />
                </Button>
              </Drawer.Trigger>

              <Portal>
                <Drawer.Backdrop />
                <Drawer.Positioner>
                  <Drawer.Content
                    className={
                      colorMode === "dark"
                        ? "bg-gray-900 text-white"
                        : "bg-white text-gray-900"
                    }
                  >
                    <Drawer.Header>
                      <Drawer.Title
                        className={colorMode === "dark" ? "#eaefef" : "#040711"}
                      >
                        AI
                      </Drawer.Title>
                    </Drawer.Header>
                    <Drawer.Body>
                      <Flex direction="column" gap={4}>
                        {navLinks.map((link) => (
                          <Text
                            key={link.label}
                            fontSize="lg"
                            className={`${
                              pathname === link.path
                                ? "text-blue-400"
                                : colorMode === "dark"
                                ? "text-white"
                                : "text-gray-900"
                            } hover:text-blue-400 cursor-pointer`}
                            onClick={() => {
                              router.push(link.path);
                              setOpen(false);
                            }}
                          >
                            {link.label}
                          </Text>
                        ))}
                        <Box>
                          <ColorModeButton className="" />
                        </Box>
                      </Flex>
                    </Drawer.Body>
                    <Drawer.CloseTrigger asChild>
                      <CloseButton
                        size="sm"
                        position="absolute"
                        top={4}
                        right={4}
                        className={
                          colorMode === "dark" ? "text-white" : "text-gray-900"
                        }
                      />
                    </Drawer.CloseTrigger>
                  </Drawer.Content>
                </Drawer.Positioner>
              </Portal>
            </Drawer.Root>
          </Box>
        </Flex>
      </Box>
    </ClientOnly>
  );
};

export default Header;
