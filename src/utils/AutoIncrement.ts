import { readFile, writeFile } from "fs/promises";
let currentNumber: number = parseInt(await readFile("./auto_increment.txt", "utf-8"))

export async function getAndIncrement() {
    currentNumber++;
    
    await writeFile("./auto_increment.txt", currentNumber.toString());

    return currentNumber;
}