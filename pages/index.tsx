import fileDownload from "js-file-download";
import {
  Box,
  Button,
  Container,
  FormControl,
  FormLabel,
  Heading,
  IconButton,
  Input,
  Link,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  SimpleGrid,
  useColorModeValue,
  useDisclosure,
} from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import { ColorModeSwitcher } from "../components/dark-mode";
import { ChevronDownIcon, HamburgerIcon } from "@chakra-ui/icons";

export default function Home() {
  const [links, setLinks] = useState<any>([]);
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    const getLinksLocalstorage = () => {
      return JSON.parse(window.localStorage.getItem("links") || "[]");
    };
    setLinks(getLinksLocalstorage());
  }, []);

  const inputUrl = useRef<any>(null);
  const inputName = useRef<any>(null);

  const addLink = () => {
    const href = inputUrl?.current?.value;
    const title = inputName?.current?.value;
    const id = Math.random().toString(36).substr(2, 9);
    const newLinks = [...links, { href, title, id }];
    setLinks(newLinks);
    window.localStorage.setItem("links", JSON.stringify(newLinks));
    onClose();
  };

  const deleteLink = (id: string) => {
    const newLinks = links.filter((link: any) => link.id !== id);
    setLinks(newLinks);
    window.localStorage.setItem("links", JSON.stringify(newLinks));
  };

  const exportConfig = () => {
    fileDownload(JSON.stringify(links), "links.json");
  };

  return (
    <>
      <Box p={5}>
        <Menu>
          <MenuButton
            size="sm"
            as={IconButton}
            icon={<HamburgerIcon />}
          ></MenuButton>
          <MenuList>
            <MenuItem onClick={exportConfig}>export config</MenuItem>
            <MenuItem onClick={() => null}>import config</MenuItem>
          </MenuList>
        </Menu>
        <ColorModeSwitcher />
        <Box minH="100vh">
          <Container maxW="container.lg">
            <Heading
              pt={10}
              mb={5}
            >
              Homepage
            </Heading>
            <SimpleGrid
              minChildWidth={120}
              spacing={3}
            >
              {links.map((link: any) => {
                return (
                  <Link href={link.href}>
                    <Box
                      onContextMenu={(e) => {
                        e.preventDefault();
                        deleteLink(link.id);
                      }}
                      padding={2}
                      borderWidth={2}
                      rounded="md"
                      textAlign="center"
                      noOfLines={1}
                    >
                      {link.title}
                    </Box>
                  </Link>
                );
              })}
              <Box
                padding={2}
                borderWidth={2}
                rounded="md"
                bg={useColorModeValue("gray.200", "gray.500")}
                textAlign="center"
                noOfLines={1}
                cursor="pointer"
                onClick={onOpen}
              >
                new link +
              </Box>
            </SimpleGrid>
          </Container>
        </Box>
      </Box>

      <Modal
        isOpen={isOpen}
        onClose={onClose}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add new link</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl>
              <FormLabel>Name</FormLabel>
              <Input
                ref={inputName}
                placeholder="My Link"
              />
            </FormControl>

            <FormControl mt={4}>
              <FormLabel>Link</FormLabel>
              <Input
                ref={inputUrl}
                placeholder="https://my-link.com"
              />
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button
              colorScheme="blue"
              mr={3}
              onClick={addLink}
            >
              Save
            </Button>
            <Button onClick={onClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
