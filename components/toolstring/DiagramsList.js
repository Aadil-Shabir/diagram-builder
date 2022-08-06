import { useContext, useState, useEffect } from 'react';
import { db, storage } from '../../firebase';
import { doc, collection, deleteDoc, updateDoc } from 'firebase/firestore';
import { ref, deleteObject } from 'firebase/storage';
import { ToolstringContext } from '../../context/ToolstringContext';
import {
  Flex,
  Text,
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  useToast,
  Icon,
} from '@chakra-ui/react';
import { EditIcon, DeleteIcon } from '@chakra-ui/icons';
import { BsThreeDotsVertical } from 'react-icons/bs';
import { MdBookmark, MdBookmarkBorder } from 'react-icons/md';
import moment from 'moment';

export default function ToolsList() {
  const { filteredToolstrings } = useContext(ToolstringContext);
  console.log(filteredToolstrings, "Filtered Too String");
  const toast = useToast();
  const [isFrequent, setIsFrequent] = useState(false);

  const handleDeleteTool = async (_id) => {
    try {
      const collectionRef = collection(db, 'toolstrings');
      const docRef = doc(collectionRef, _id);
      // const fileRef = ref(storage, `/tools/${_id}`);
      await deleteDoc(docRef).then(() =>
        toast({
          title: 'Deleted',
          status: 'success',
          position: 'top-right',
          duration: 2000,
          isClosable: true,
        })
      );
    } catch (error) {
      const errorMessage = error.message;
      toast({
        title: errorMessage,
        status: 'error',
        position: 'top-right',
        duration: 2000,
        isClosable: true,
      });
    }
  };

  const handleToggleFrequent = async (_id) => {
    const toolstringRef = doc(db, 'toolstrings', _id);
    await updateDoc(toolstringRef, {
      isFrequent: isFrequent,
    });
  };

  return (
    <>
      {filteredToolstrings?.map((item, index) => (
        <Flex
          w='full'
          key={index}
          minH='60px'
          flexDir='column'
          justify='space-between'
          borderWidth='1px'
          borderRadius='6px'
          _hover={{
            cursor: 'pointer',
            borderColor: 'blue.500',
          }}
          p={1}
          onDoubleClick={(e) =>
            alert('opens toolstring diagram to view or edit')
          }
          my={1}
        >
          <Flex w='full' justify='space-between' p={1}>
            <Text fontSize='10px' fontWeight='extrabold'>
              {item.name}
            </Text>
            <Flex w='20px' flexDir='column' justify='space-between' h='full'>
              <Flex>
                <Menu>
                  <MenuButton
                    as={IconButton}
                    aria-label='Options'
                    variant='ghost'
                    icon={<BsThreeDotsVertical />}
                    size='xs'
                  />
                  <MenuList>
                    <MenuItem
                      icon={<EditIcon />}
                      onClick={() =>
                        alert('opens toolstring diagram to view or edit')
                      }
                    >
                      Edit
                    </MenuItem>

                    {/* <MenuItem
                      icon={<MdBookmark />}
                      onClick={() => handleSetAsFrequent(item._id)}
                    >
                      Set as Frequently Used
                    </MenuItem> */}
                    <MenuItem
                      icon={<DeleteIcon />}
                      onClick={() => handleDeleteTool(item._id)}
                    >
                      Delete
                    </MenuItem>
                  </MenuList>
                </Menu>
              </Flex>
            </Flex>
          </Flex>
          <Flex w='full' justify='space-between'>
            <Text fontSize='9px'>
              Edited: {moment(item.lastModified).fromNow()}
            </Text>
            <Flex mr={1} _hover={{ cursor: 'pointer' }}>
              {item.isFrequent ? (
                <Icon
                  as={MdBookmark}
                  color='blue.500'
                  onClick={() => {
                    setIsFrequent(!isFrequent);
                    handleToggleFrequent(item._id);
                  }}
                />
              ) : (
                <Icon
                  as={MdBookmarkBorder}
                  color='gray.500'
                  onClick={() => {
                    setIsFrequent(!isFrequent);
                    handleToggleFrequent(item._id);
                  }}
                />
              )}
            </Flex>
          </Flex>
        </Flex>
      ))}
    </>
  );
}
