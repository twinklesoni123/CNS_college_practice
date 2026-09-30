// Convert text to SHA-256 Hash
async function sha256(message) {

    const encoder = new TextEncoder();

    // Convert text into UTF-8 bytes
    const data = encoder.encode(message);

    // Generate SHA-256 hash
    const hashBuffer = await crypto.subtle.digest(
        "SHA-256",
        data
    );

    // Convert ArrayBuffer into byte array
    const hashArray = Array.from(
        new Uint8Array(hashBuffer)
    );

    // Convert bytes into hexadecimal
    const hashHex = hashArray
        .map(byte =>
            byte.toString(16).padStart(2, "0")
        )
        .join("");

    return hashHex;
}


// Generate Main Hash
async function generateHash() {

    const input = document
        .getElementById("inputText")
        .value;

    const output = document
        .getElementById("hashOutput");


    // Check empty input
    if (input.trim() === "") {

        output.innerHTML =
            "⚠ Please enter a message first.";

        output.style.color = "#ffb347";

        return;
    }


    // Show processing message
    output.innerHTML =
        "⚙ Generating SHA-256 hash...";

    output.style.color = "#41d7ff";


    // Generate Hash
    const hash = await sha256(input);


    // Display Hash
    output.innerHTML = hash;


    // Character Count
    document.getElementById(
        "characterCount"
    ).innerText = input.length;


    // Byte Count
    const bytes = new TextEncoder().encode(input).length;

    document.getElementById(
        "byteCount"
    ).innerText = bytes;


    // Store original information
    document.getElementById(
        "originalMessage"
    ).innerText = input;

    document.getElementById(
        "originalHash"
    ).innerText = hash;


    // Update input in Avalanche section
    document.getElementById(
        "avalancheText"
    ).value = input + "!";
}


// Copy Hash
async function copyHash() {

    const hash = document
        .getElementById("hashOutput")
        .innerText;


    if (
        hash ===
        'Click "Generate SHA-256 Hash" to generate the result...'
        ||
        hash.includes("Please enter")
        ||
        hash.includes("Generating")
    ) {

        alert("Please generate a hash first!");

        return;
    }


    try {

        await navigator.clipboard.writeText(hash);

        const button =
            document.querySelector(".copy-btn");

        const oldText =
            button.innerText;

        button.innerText = "✓ Copied!";

        setTimeout(() => {

            button.innerText = oldText;

        }, 2000);

    }
    catch (error) {

        alert(
            "Unable to copy hash. Please copy it manually."
        );

    }
}


// Clear All Data
function clearData() {

    document
        .getElementById("inputText")
        .value = "";


    document
        .getElementById("hashOutput")
        .innerText =
        'Click "Generate SHA-256 Hash" to generate the result...';


    document
        .getElementById("characterCount")
        .innerText = "0";


    document
        .getElementById("byteCount")
        .innerText = "0";


    document
        .getElementById("avalancheText")
        .value = "";


    document
        .getElementById("modifiedMessage")
        .innerText =
        "No modified message yet";


    document
        .getElementById("modifiedHash")
        .innerText =
        "Waiting for comparison...";

}


// Compare Original and Modified Hashes
async function compareHashes() {

    const original =
        document
        .getElementById("inputText")
        .value;


    const modified =
        document
        .getElementById("avalancheText")
        .value;


    if (
        original.trim() === ""
        ||
        modified.trim() === ""
    ) {

        alert(
            "Please enter both original and modified messages."
        );

        return;
    }


    // Generate hashes
    const originalHash =
        await sha256(original);

    const modifiedHash =
        await sha256(modified);


    // Display original
    document
        .getElementById("originalMessage")
        .innerText = original;


    document
        .getElementById("originalHash")
        .innerText = originalHash;


    // Display modified
    document
        .getElementById("modifiedMessage")
        .innerText = modified;


    document
        .getElementById("modifiedHash")
        .innerText = modifiedHash;

}


// Live Character Count
document
    .getElementById("inputText")
    .addEventListener("input", function () {

        const text = this.value;

        document
            .getElementById("characterCount")
            .innerText = text.length;


        document
            .getElementById("byteCount")
            .innerText =
            new TextEncoder()
            .encode(text)
            .length;

    });


// Automatically Generate Hash on Page Load
window.addEventListener(
    "load",
    generateHash
);