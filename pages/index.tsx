import { RepeatIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  ButtonGroup,
  Center,
  Container,
  FormControl,
  FormLabel,
  Heading,
  HStack,
  IconButton,
  Input,
  Link,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverFooter,
  PopoverHeader,
  PopoverTrigger,
  SimpleGrid,
  useColorModeValue,
  useDisclosure,
} from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import { ColorModeSwitcher } from "../components/dark-mode";

export default function Home() {

  const urlLink = 'https://raw.githubusercontent.com/fernandobelotto/links/master/index.json'

  const [links, setLinks] = useState<any>([]);
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    const getLinksLocalstorage = () => {
      return JSON.parse(window.localStorage.getItem("links") || "[]");
    };
    setLinks(getLinksLocalstorage());
  }, []);

  const inputUrl = useRef<any>(null)
  const inputName = useRef<any>(null)
  
  const addLink = () => {
    const href = inputUrl?.current?.value
    const title = inputName?.current?.value
    const id = Math.random().toString(36).substr(2, 9)
    const newLinks = [...links, { href, title, id }]
    setLinks(newLinks)
    window.localStorage.setItem("links", JSON.stringify(newLinks));
    onClose()
  }

  const getLinks = () => {
    fetch(urlLink)
      .then((res) => res.json())
      .then((res) => {
        console.log(res);
        setLinks(res);
        window.localStorage.setItem("links", JSON.stringify(res));
      });
  };

  const deleteLink = (id: string) => {
    const newLinks = links.filter((link: any) => link.id !== id);
    setLinks(newLinks)
    window.localStorage.setItem("links", JSON.stringify(newLinks));
  }

  return (
    <>
      <ColorModeSwitcher />
      <Box minH="100vh">
        <Container maxW="container.lg">
          <HStack w="100%" justifyContent="space-between">
            <Heading pt={10} mb={5}>
              Homepage
            </Heading>
            <IconButton
              size="sm"
              icon={<RepeatIcon />}
              aria-label="refresh"
              onClick={getLinks}
            />
          </HStack>
          <SimpleGrid minChildWidth={120} spacing={3}>
            {links.map((link: any) => {
              return (
                <Link href={link.href}>
                  <Box
                    onContextMenu={(e) => {e.preventDefault(); deleteLink(link.id)}}
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

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add new link</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl>
              <FormLabel>Name</FormLabel>
              <Input ref={inputName} placeholder="My Link" />
            </FormControl>

            <FormControl mt={4}>
              <FormLabel>Link</FormLabel>
              <Input ref={inputUrl} placeholder="https://my-link.com" />
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={addLink}>
              Save
            </Button>
            <Button onClick={onClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
        </>
  );
}
