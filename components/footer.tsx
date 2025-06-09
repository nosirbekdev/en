"use client";

import { navLinks } from "@/config";
import {
  Box,
  ClientOnly,
  Flex,
  Link,
  Skeleton,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useColorMode } from "./ui/color-mode";

const mapUrl =
  "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d11373.947086167425!2d66.70011155366646!3d38.04346854965163!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3f4af6d4f3831d23%3A0xd90144c669eade06!2sKamchibulak%2C%20Surxondaryo%20Region%2C%20Uzbekistan!5e1!3m2!1sen!2s!4v1749054692489!5m2!1sen!2s";

const getAddressFromUrl = (url: string) => {
  const match = url.match(/!2s([^!]+)/);
  if (match) return decodeURIComponent(match[1]);
  return "Manzil topilmadi";
};

const Footer = () => {
  const address = getAddressFromUrl(mapUrl);
  const { colorMode } = useColorMode();

  return (
    <ClientOnly fallback={<Skeleton height="300px" />}>
      <Box
        as="footer"
        width="100%"
        py={{ base: 5, md: 5 }}
        px={{ base: 6, md: 20 }}
        className={`${colorMode === "dark" ? "" : ""}  flex-shrink-0`}
      >
        <Flex
          direction={{ base: "column", md: "row" }}
          justify="space-between"
          gap={{ base: 10, md: 6 }}
        >
          {/* Logo and About */}
          <VStack align="start" flex="1">
            <Text
              fontSize="2xl"
              fontWeight="extrabold"
              className={
                colorMode === "dark" ? "text-blue-400" : "text-blue-600"
              }
            >
              LingoAI
            </Text>
            <Text
              fontSize="md"
              lineHeight="tall"
              className={
                colorMode === "dark" ? "text-gray-400" : "text-gray-600"
              }
            >
              Texnologiya va AI sohasida yetakchi.
            </Text>
          </VStack>

          {/* Contact */}
          <VStack align="start" flex="1">
            <Text
              fontSize="lg"
              fontWeight="bold"
              className={colorMode === "dark" ? "text-white" : "text-gray-900"}
            >
              Bog‘lanish
            </Text>
            <Link
              href="mailto:info@lingoai.com"
              className="hover:text-blue-400"
              _hover={{}} // Override Chakra's default hover to avoid conflicts
            >
              info@lingoai.com
            </Link>
            <Link
              href="tel:+998901234567"
              className="hover:text-blue-400"
              _hover={{}}
            >
              +998 90 123 45 67
            </Link>
          </VStack>

          {/* Resources */}
          <VStack align="start" flex="1">
            <Text
              fontSize="lg"
              fontWeight="bold"
              className={colorMode === "dark" ? "text-white" : "text-gray-900"}
            >
              Manbalar
            </Text>
            {navLinks.map((link) => (
              <Link
                key={link.path}
                href={link.path}
                className="hover:text-blue-400"
                _hover={{}}
              >
                {link.label}
              </Link>
            ))}
          </VStack>

          {/* Address and Map */}
          <VStack align="start" flex="1">
            <Text
              fontSize="lg"
              fontWeight="bold"
              className={colorMode === "dark" ? "text-white" : "text-gray-900"}
            >
              Manzil
            </Text>
            <Text
              fontSize="sm"
              lineHeight="tall"
              whiteSpace="pre-line"
              className={
                colorMode === "dark" ? "text-gray-400" : "text-gray-600"
              }
            >
              {address}
            </Text>
            <Box width="100%">
              <iframe
                src={mapUrl}
                width="100%"
                height="200"
                style={{ border: 0, borderRadius: "0.375rem" }}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Google Map"
              />
            </Box>
          </VStack>
        </Flex>

        <Text
          fontSize="md"
          textAlign="center"
          mt={10}
          className={colorMode === "dark" ? "text-gray-500" : "text-gray-500"}
        >
          © 2025 LingoAI. Barcha huquqlar himoyalangan.
        </Text>
      </Box>
    </ClientOnly>
  );
};

export default Footer;
