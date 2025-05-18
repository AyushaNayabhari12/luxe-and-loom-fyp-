import {createContext, useState} from "react";

export const OrderContext = createContext();


export const OrderContextProvider = ({ children }) => {
    const [quantity, setQuantity] = useState(0);
    const [size, setSize] = useState(0);
    const [customisedImage, setCustomisedImage] = useState('');

    const value = {
        quantity,
        size,
        customisedImage,
        setCustomisedImage,
        setSize,
        setQuantity
    }

    return <OrderContext.Provider value={value}>{children}</OrderContext.Provider>;
}