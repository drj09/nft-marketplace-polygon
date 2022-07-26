import { ethers } from "ethers"; //etherjs Library to interact with smartcontract
import axios from "axios"; //axios is for data fetching and http requests
import { useEffect, useState } from "react";
import web3modal from "web3modal"; //library to connect to etherium wallets

import { nftAddress, nftMarketAddress } from "../config";

import Market from "../artifacts/contracts/NFTMarket.sol/NFTMarketplace.json"; //refrencing abi and artifacts AND LET ETHER TI KNOW HOW OT INTERACT WIRH THE  CINTRACT

export default function Home() {
    const [nfts, setNfts] = useState([]); //to update local state when we get list of nft for this user
    const [loadingState, setLoadingState] = useState("not-loaded"); //to updat loading state

    useEffect(() => {
        loadNFTs();
    }, []);
    async function loadNFTs() {
        const provider = new ethers.providers.JsonRpcProvider();
        const marketContract = new ethers.Contract(
            nftaddress,
            NFT,
            abi,
            provider
        );

        const data = await marketContract.fetchMarketItems();

        const items = await Promise.all(
            data.map(async (i) => {
                const tokenUri = await marketContract.tokenURI(i.tokenId);
                const meta = await axios.get(tokenUri);
                let price = ethers.utils.formatUnits(
                    i.price.toString(),
                    "ether"
                );
                let item = {
                    price,
                    tokenId: i.tokenId.toNumber(),
                    seller: i.seller,
                    owne: i.owner,
                    image: MediaRecorder.data.image,
                    name: meta.data.name,
                    description: meta.data.description,
                };
                return item;
            })
        );
        setNfts(items);
        setLoadingState("loaded");
    }
    async function buyNFT(nft) {
        const web3modal = new web3modal();
        const connection = await web3modal.connect(); //waiting for the connections
        const provider = new ethers.provider.Web3Provider(connection); //
        const signer = provider.getSigner();
        const contract = new ethers.Contract(
            nftMarketAddress,
            Market.abi,
            signer
        );

        const price = ethers.utils.parseUnits(nft.price.toString(), "ether");
        const transaction = await contract.createMarketSale(
            nftAddress,
            nft.tokenId,
            {
                value: price,
            }
        );
        await transaction.wait();
        loadNFTs();
    }
    if (loadingState === "loaded" && !nfts.length)
        return (
            <h1 className="px-20 py-10 text-3xl">No Items in MarketPlace</h1>
        );

    return (
        <div className="flex justify-center">
            <div className="px-4" style={{ maxWidth: "1600px" }}>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
                    {nfts.map((nft, i) => (
                        <div
                            key={i}
                            className="border shadow rounded-xl overflow-hidden"
                        >
                            <img src={nft.image} />
                            <div className="p-4">
                                <p
                                    style={{ height: "64px" }}
                                    className="text-2xl font-semibold"
                                >
                                    {nft.name}
                                </p>
                                <div
                                    style={{
                                        height: "70px",
                                        overflow: "hidden",
                                    }}
                                >
                                    <p className="text-gray-400">
                                        {nft.description}
                                    </p>
                                </div>
                            </div>
                            <div className="p-4 bg-black">
                                <p className="text-2xl font-bold text-white">
                                    {nft.price} ETH
                                </p>
                                <button
                                    className="mt-4 w-full bg-pink-500 text-white font-bold py-2 px-12 rounded"
                                    onClick={() => buyNft(nft)}
                                >
                                    Buy
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
