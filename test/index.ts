import { expect } from "chai";
import { ethers } from "hardhat";

describe("Greeter", function () {
  it("Should return the new greeting once it's changed", async function () {
    const Greeter = await ethers.getContractFactory("Greeter");
    const greeter = await Greeter.deploy("Hello, world!");
    await greeter.deployed();

    expect(await greeter.greet()).to.equal("Hello, world!");

    const setGreetingTx = await greeter.setGreeting("Hola, mundo!");

    // wait until the transaction is mined
    await setGreetingTx.wait();

    expect(await greeter.greet()).to.equal("Hola, mundo!");
  });

  it("Should deposit 1.0 Ether", async function () {
    const ether: string = "1.0";
    const Greeter = await ethers.getContractFactory("Greeter");
    const greeter = await Greeter.deploy("Hello, world!");
    await greeter.deployed();

    const tx = await greeter.deposit({
      value: ethers.utils.parseEther(ether),
    });

    // wait until the transaction is mined
    await tx.wait();
    expect(ethers.utils.formatEther(tx.value)).to.equal(ether);
  });

  it("Should withdraw 1.0 Ether", async function () {
    const ether: string = "1.0";
    const Greeter = await ethers.getContractFactory("Greeter");
    const greeter = await Greeter.deploy("Hello, world!");
    await greeter.deployed();

    const tx = await greeter.deposit({
      value: ethers.utils.parseEther(ether),
    });

    // wait until the transaction is mined
    await tx.wait();

    const wtx = await greeter.withdraw({
      value: ethers.utils.parseEther(ether),
    });
    // wait until the transaction is mined
    await wtx.wait();
    expect(ethers.utils.formatEther(wtx.value)).to.equal(ether);
  });
});
