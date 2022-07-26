const hre = require("hardhat");

async function main() {
    const NFTMarket = await hre.ethers.getContractFactory("NFTMarketplace");
    const nftMarket = await NFTMarket.deploy();

    await nftMarket.deployed();

    console.log("Lock with 1 ETH deployed to:", nftMarket.address);

    fs.writeFileSync(
        "./config.js",
        `export const nftMarketAddress = "${nftMarketplace.address}"`
    );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
