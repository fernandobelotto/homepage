import  { ForwardedRef, forwardRef, useEffect, useRef, useState } from 'react'
import { Button, Input } from '@chakra-ui/react';


type Props = {
  onChangeFile: (file: any) => void;
  ref: HTMLInputElement;
};

export const FileInput = forwardRef((props: Props, ref:  ForwardedRef<HTMLInputElement>) =>  {

    const { onChangeFile } = props
    const [file, setFile] = useState();

    const saveFile = (e: any) => {
      setFile(e.target.files[0]);
    };

    const readerFileAsJson = (file: any) => {
        const reader = new FileReader();
        reader.onload = (e: any) => {
            const text = e.target.result;
            const json = JSON.parse(text);
            onChangeFile(json);
        };
        reader.readAsText(file);
    };

    useEffect(() => {
      file && readerFileAsJson(file);
    }, [file])
    

    return (
      <>
        <Input ref={ref} hidden type="file" onChange={saveFile} />
      </>
    );
})