import {
  Button,
  CloseButton,
  Drawer,
  For,
  HStack,
  IconButton,
  Kbd,
  Portal,
} from "@chakra-ui/react";
import { IoSettingsOutline } from "react-icons/io5";

const SettingsDrawer = () => {
  return (
    <HStack wrap="wrap">
      <For each={["sm"]}>
        {(size) => (
          <Drawer.Root key={size} size={size}>
            <Drawer.Trigger asChild>
              <IconButton
                aria-label="Settings"
                colorScheme="purple"
                variant="ghost"
                border={"1px solid "}
                borderColor="gray.600"
                size="md"
              >
                <IoSettingsOutline />
              </IconButton>
            </Drawer.Trigger>
            <Portal>
              <Drawer.Backdrop />
              <Drawer.Positioner>
                <Drawer.Content>
                  <Drawer.Header>
                    <Drawer.Title>Drawer Title</Drawer.Title>
                  </Drawer.Header>
                  <Drawer.Body>
                    Press the <Kbd>esc</Kbd> key to close the drawer.
                  </Drawer.Body>
                  <Drawer.Footer>
                    <Drawer.ActionTrigger asChild>
                      <Button variant="outline">Cancel</Button>
                    </Drawer.ActionTrigger>
                    <Button>Save</Button>
                  </Drawer.Footer>
                  <Drawer.CloseTrigger asChild>
                    <CloseButton size="sm" />
                  </Drawer.CloseTrigger>
                </Drawer.Content>
              </Drawer.Positioner>
            </Portal>
          </Drawer.Root>
        )}
      </For>
    </HStack>
  );
};

export default SettingsDrawer;
