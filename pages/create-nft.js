import { useState } from "react";
import { ethers } from "ethers";
import { useRouter } from "next/router";
import Web3Modal from "web3modal";

import { Web3Storage } from "web3.storage"; //using web3 Storage for storing NFT Files

//const IPFS_URL = ipfsHttpClient(process.env.IPFS_URL);

import { nftMarketAddress } from "../config";
import nftMarket from "../artifacts/contracts/NFTMarket.sol/NFTMarketplace.json"; //refrencing abi and artifacts and let ether know how to interact with contract
export default function CreateItem() {
    const [fileUrl, setFileUrl] = useState(null);
    const [formInput, updateFormInput] = useState({
        price: "",
        name: "",
        description: "",
    });
    const router = useRouter();

    async function onChange(e) {
        //connect to a different API

        const imageFile = e.target.files[0];
        const captionInput = document.getElementById("caption-input");

        const WEB3STORAGE_TOKEN = process.env.WEB3STORAGE_TOKEN;
        console.log(WEB3STORAGE_TOKEN);
        const storageClient = new Web3Storage({
            token: WEB3STORAGE_TOKEN,
        });

        console.log(storageClient);
        //const cid = await storageClient.put([imageFile]);

        const fileInput = document.querySelector('input[type="file"]');
        /*const rootCid = await storageClient.put(fileInput.files, {
            name: "cat pics",
            maxRetries: 3,
        });
        */
        const files = [new File(["contents-of-file-1"], "plain-utf8.txt")];
        const cid = await storageClient.put(files);
        console.log("stored files with cid:", cid);
    }

    async function uploadToIPFS() {
        /*
        const { name, description, price } = formInput;
        if (!name || !description || !price || !fileUrl) return;
        
        const data = JSON.stringify({
            name,
            description,
            image: fileUrl,
        });
        try {
            const added = await client.add(data);
            const url = `https://ipfs.infura.io/ipfs/${added.path}`;
            console.log(url);
           
            return url;
        } catch (error) {
            console.log("Error uploading file: ", error);
        }
        */
    }

    async function listNFTForSale() {
        const url = await uploadToIPFS();
        const web3Modal = new Web3Modal();
        const connection = await web3Modal.connect();
        const provider = new ethers.providers.Web3Provider(connection);
        const signer = provider.getSigner();

        /* next, create the item */
        const price = ethers.utils.parseUnits(formInput.price, "ether");
        let contract = new ethers.Contract(
            nftMarketAddress,
            nftMarket.abi,
            signer
        );
        let listingPrice = await contract.getListingPrice();
        listingPrice = listingPrice.toString();
        let transaction = await contract.createToken(url, price, {
            value: listingPrice,
        });
        await transaction.wait();

        router.push("/");
    }

    return (
        <div className="flex justify-center">
            <div className="w-1/2 flex flex-col pb-12">
                <input
                    placeholder="Asset Name"
                    className="mt-8 border rounded p-4"
                    onChange={(e) =>
                        updateFormInput({ ...formInput, name: e.target.value })
                    }
                />
                <textarea
                    placeholder="Asset Description"
                    className="mt-2 border rounded p-4"
                    onChange={(e) =>
                        updateFormInput({
                            ...formInput,
                            description: e.target.value,
                        })
                    }
                />
                <input
                    placeholder="Asset Price in Eth"
                    className="mt-2 border rounded p-4"
                    onChange={(e) =>
                        updateFormInput({ ...formInput, price: e.target.value })
                    }
                />
                <input
                    type="file"
                    name="Asset"
                    className="my-4"
                    onChange={onChange}
                />
                {fileUrl && (
                    <img className="rounded mt-4" width="350" src={fileUrl} />
                )}
                <button
                    onClick={listNFTForSale}
                    className="font-bold mt-4 bg-pink-500 text-white rounded p-4 shadow-lg"
                >
                    Create NFT
                </button>
            </div>
        </div>
    );
}
