"use client";

import { toaster } from "@/components/ui/toaster";
import { Box } from "@chakra-ui/react";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { FaMicrophone } from "react-icons/fa";

// MotionBox alias
const MotionBox = motion(Box);

const MicrophoneButton = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);

  // Mikrofonga ruxsat olish
  const requestMicrophoneAccess = async () => {
    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });
      setHasPermission(true);
      toaster.success({
        title: "Permission Granted",
        description: "You have granted microphone access.",
        duration: 3000,
      });
    } catch (error) {
      console.error("Microphone access denied:", error);
      setHasPermission(false);
      toaster.error({
        title: "Microphone Permission Denied",
        description: "Please allow microphone access to continue.",
        duration: 4000,
      });
    }
  };

  // Komponent yuklanganda mavjud ruxsat holatini tekshirish
  useEffect(() => {
    navigator.permissions
      ?.query({ name: "microphone" as PermissionName })
      .then((result) => {
        setHasPermission(result.state === "granted");
      })
      .catch(() => setHasPermission(null));
  }, []);

  return (
    <Box
      position="relative"
      w="120px"
      h="120px"
      mx="auto"
      display="flex"
      justifyContent="center"
      alignItems="center"
      cursor={"pointer"}
      onClick={requestMicrophoneAccess}
    >
      {/* Ripple effect – doimiy animatsiya */}
      <MotionBox
        position="absolute"
        top={0}
        left={0}
        w="120px"
        h="120px"
        borderRadius="full"
        bg="linear-gradient(to right, #C30EFF, #1E92FF)"
        animate={{
          scale: [1, 1.5],
          opacity: [0.5, 0],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "easeOut",
        }}
      />

      {/* Statik mikrofonga ruxsat olish tugmasi */}
      <Box
        as="button"
        bg="linear-gradient(to right, #C30EFF, #1E92FF)"
        borderRadius="full"
        w="100px"
        h="100px"
        display="flex"
        justifyContent="center"
        alignItems="center"
        boxShadow="lg"
        zIndex={1}
        cursor={"pointer"}
      >
        <FaMicrophone size={40} color="white" />
      </Box>
    </Box>
  );
};

export default MicrophoneButton;
